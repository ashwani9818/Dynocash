import express from "express";
import {
  encrypt,
  errorResponseHelper,
  getErrorMessage,
  successResponseHelper,
  sendEmail,
} from "../helper";
import jwt from "jsonwebtoken";
import { IUserType } from "../utils/types";
import {
  apiModel,
  companyModel,
  customerModel,
  customerWalletModel,
  planModel,
  userWalletModel,
  userModel,
} from "../models";
import { apiLogger } from "../utils/loggers";
import crypto from "crypto";
import sequelize from "../utils/dbInstance";
import { Op, QueryTypes } from "sequelize";
import flw from "../apis/flutterwaveApi";

const addApi = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  try {
    const { company_id, base_currency, withdrawal_whitelist } = req.body;

    const keyData = {
      base_currency,
      company_id,
      adm_id: userData.user_id,
    };

    const wallets = await userWalletModel.findOne({
      where: {
        user_id: userData.user_id,
        wallet_address: { [Op.not]: null },
      },
    });


    if(!wallets){
      return errorResponseHelper(
        res,
        500,
        "User do not have any wallet address!"
      );
    }

    const keyString = "DYNOPAY_USER_API-" + JSON.stringify(keyData);

    const apiKey = encrypt(keyString, process.env.API_SECRET);

    const isExists = await apiModel
      .findOne({
        where: {
          company_id,
          base_currency,
        },
      })
      .then((token) => token !== null)
      .then((isExists) => isExists);

    if (isExists) {
      errorResponseHelper(
        res,
        400,
        "API for this company and currency is already exists!"
      );
    } else {
      const isExists = await companyModel
        .findOne({
          where: {
            company_id,
          },
        })
        .then((token) => token !== null)
        .then((isExists) => isExists);

      if (!isExists) {
        errorResponseHelper(res, 500, "Company does not exists!");
      } else {
        const company_data = await companyModel.findOne({
          where: {
            company_id,
          },
        });
        const createdUser = await customerModel.create({
          id: crypto.randomUUID(),
          customer_name: company_data.dataValues.company_name + " admin",
          email: company_data.dataValues.email,
          mobile: company_data.dataValues.email,
          company_id: company_id,
        });

        await customerWalletModel.create({
          id: crypto.randomUUID(),
          customer_id: createdUser.dataValues.customer_id,
          wallet_type: base_currency,
        });

        const token = await getAccessToken(createdUser.dataValues.customer_id);
        const resData = await apiModel.create({
          company_id,
          base_currency: base_currency,
          apiKey,
          user_id: userData.user_id,
          adminToken: token.token,
          withdrawal_whitelist: withdrawal_whitelist
        });

        // Send email notification to user about API key creation
        try {
          const userDetails = await userModel.findOne({
            where: { user_id: userData.user_id },
          });

          if (userDetails && userDetails.dataValues.email) {
            const companyName = company_data.dataValues.company_name || "your company";
            console.log("Attempting to send API key creation email to:", userDetails.dataValues.email);
            await sendEmail(
              userDetails.dataValues.email,
              userDetails.dataValues.name || "User",
              "API Key Created Successfully!",
              `Hello ${userDetails.dataValues.name || "User"}!\n\nYour API key for "${companyName}" (${base_currency}) has been successfully created on DynoPay.\n\nYou can now:\n1. Use this API key to integrate DynoPay into your applications\n2. Make secure API calls to process payments\n3. Manage your payment flows programmatically\n\nImportant: Keep your API key secure and never share it publicly. If you suspect your key has been compromised, delete it immediately and create a new one.\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe DynoPay Team`
            );
            console.log("API key creation email sent successfully to:", userDetails.dataValues.email);
          }
        } catch (emailError) {
          // Log error but don't fail API creation if email fails
          console.log("Failed to send API key creation email:", emailError);
          apiLogger.error("Failed to send API key creation email", {
            user_id: userData.user_id,
            company_id: company_id,
            base_currency: base_currency,
            error: emailError,
          });
        }

        successResponseHelper(res, 200, "Api generated successfully!", {
          ...resData.dataValues,
          ...company_data.dataValues,
        });
      }
    }
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

const getAccessToken = async (id) => {
  const user = await customerModel.findOne({
    where: {
      customer_id: id,
    },
  });

  const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const { customer_id, ...userData } = user.dataValues;
  console.log(userData);
  if (tokenSecret) {
    const token = jwt.sign(userData, tokenSecret);
    const resData = { token, customer_id: userData.id };
    return resData;
  }
};

const getApi = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  try {
    const resData = await sequelize.query(
      `select a.*,c.company_id,c.company_name from tbl_api a
        join tbl_company c on a.company_id=c.company_id
        where a.user_id=${userData.user_id}
        `,
      { type: QueryTypes.SELECT }
    );
    successResponseHelper(res, 200, "", resData);
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

const deleteApi = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  try {
    const api_id = req.params.id;
    
    // Get API details before deleting for email notification
    const apiDetails = await apiModel.findOne({
      where: {
        user_id: userData.user_id,
        api_id,
      },
    });

    const resData = await apiModel.destroy({
      where: {
        user_id: userData.user_id,
        api_id,
      },
    });

    // Send email notification to user about API key deletion
    if (resData > 0 && apiDetails) {
      try {
        const userDetails = await userModel.findOne({
          where: { user_id: userData.user_id },
        });

        if (userDetails && userDetails.dataValues.email) {
          // Get company name from the API details
          let companyName = "your company";
          let baseCurrency = apiDetails.dataValues.base_currency || "N/A";
          
          if (apiDetails.dataValues.company_id) {
            const companyData = await companyModel.findOne({
              where: { company_id: apiDetails.dataValues.company_id },
            });
            if (companyData) {
              companyName = companyData.dataValues.company_name || companyName;
            }
          }

          console.log("Attempting to send API key deletion email to:", userDetails.dataValues.email);
          await sendEmail(
            userDetails.dataValues.email,
            userDetails.dataValues.name || "User",
            "API Key Deleted Successfully",
            `Hello ${userDetails.dataValues.name || "User"}!\n\nYour API key for "${companyName}" (${baseCurrency}) has been successfully deleted from DynoPay.\n\nIf you deleted this key by mistake or need to create a new one, you can do so from the API Keys section in your dashboard.\n\nIf you did not authorize this deletion, please contact our support team immediately.\n\nBest regards,\nThe DynoPay Team`
          );
          console.log("API key deletion email sent successfully to:", userDetails.dataValues.email);
        }
      } catch (emailError) {
        // Log error but don't fail API deletion if email fails
        console.log("Failed to send API key deletion email:", emailError);
        apiLogger.error("Failed to send API key deletion email", {
          user_id: userData.user_id,
          api_id: api_id,
          error: emailError,
        });
      }
    }

    successResponseHelper(res, 200, "Api deleted successfully!", resData);
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

const getApiCustomers = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  try {
    const { rowsPerPage, page } = req.body;
    let column, sortType, offset, limit;

    if (rowsPerPage && page) {
      offset = (page - 1) * rowsPerPage;
      limit = rowsPerPage;
    }
    const company_data = await (
      await companyModel.findAll({
        attributes: ["company_id"],
        where: {
          user_id: userData.user_id,
        },
      })
    ).map((x) => x.dataValues.company_id);

    const customer_data = await customerModel.findAll({
      where: {
        company_id: {
          [Op.in]: company_data,
        },
      },
    });

    successResponseHelper(res, 200, "", customer_data);
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

const createPlan = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  try {
    const { plan_name, amount, interval, company_id } = req.body;

    const apiData = await apiModel.findOne({ where: { company_id } });

    const { data } = await flw.PaymentPlan.create({
      name: plan_name,
      amount,
      interval,
      currency: apiData.dataValues?.base_currency ?? "USD",
    });

    const payload = {
      id: crypto.randomUUID(),
      user_id: userData.user_id,
      flw_plan_id: data.id,
      company_id,
      plan_name,
      amount,
      interval,
      currency: data.currency,
    };

    const planData = await planModel.create({ ...payload });

    successResponseHelper(res, 200, "Plan generated successfully!", planData);
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

const getPlans = async (req: express.Request, res: express.Response) => {
  const userData = jwt.decode(res.locals.token) as IUserType;
  const company_id = req.params.id;
  try {
    const planData = await planModel.findAll({
      where: {
        company_id,
        user_id: userData.user_id,
      },
    });

    successResponseHelper(res, 200, "", planData);
  } catch (e) {
    const message = getErrorMessage(e);
    apiLogger.error(
      message,
      { user_id: userData.user_id, email: userData.email },
      new Error(e)
    );
    errorResponseHelper(res, 500, message);
  }
};

export default {
  addApi,
  getApi,
  deleteApi,
  getApiCustomers,
  createPlan,
  getPlans,
};
