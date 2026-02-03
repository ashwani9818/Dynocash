import React, { useState, useEffect, useRef } from "react";
import PopupModal from "../../PopupModal";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import FormManager from "@/Components/Page/Common/FormManager";
import { theme } from "@/styles/theme";
import InputField from "../../AuthLayout/InputFields";
import PanelCard from "../../PanelCard";
import Image from "next/image";
import WalletIcon from "@/assets/Icons/wallet-icon.svg";
import * as yup from "yup";
import InfoIcon from "@/assets/Icons/info-icon.svg";
import CurrencySelector from "../../CurrencySelector";
import CompanySelectorForm from "../../CompanySelectorForm";
import {
  PermissionsContainer,
  IconContainer,
  ContentContainer,
  PermissionsTitle,
  PermissionsList,
} from "./styled";
import CustomButton from "../../Buttons";
import SuccessAPIModel from "../SuccessAPIModel";
import { useDispatch, useSelector } from "react-redux";
import { ApiAction } from "@/Redux/Actions";
import { API_INSERT } from "@/Redux/Actions/ApiAction";
import { CompanyAction } from "@/Redux/Actions";
import { COMPANY_FETCH } from "@/Redux/Actions/CompanyAction";
import { rootReducer } from "@/utils/types";

export interface CreateApiModelProps {
  open: boolean;
  onClose: () => void;
}

const CreateApiModel: React.FC<CreateApiModelProps> = ({ open, onClose }) => {
  const { t } = useTranslation("apiScreen");
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdApiData, setCreatedApiData] = useState<any>(null);
  const previousApiListLengthRef = useRef<number>(0);
  const isSubmittingRef = useRef<boolean>(false);
  const hasProcessedSuccessRef = useRef<boolean>(false); // Track if we've already processed success
  
  const apiState = useSelector((state: rootReducer) => state.apiReducer);
  const companyState = useSelector((state: rootReducer) => state.companyReducer);

  // Fetch companies when modal opens
  useEffect(() => {
    if (open && companyState.companyList.length === 0) {
      dispatch(CompanyAction(COMPANY_FETCH));
    }
  }, [open, companyState.companyList.length, dispatch]);

  // Prevent modal from reopening after successful API creation
  useEffect(() => {
    // If we've processed success and modal is open (shouldn't happen, but safeguard)
    if (hasProcessedSuccessRef.current && open && !showSuccessModal) {
      // Modal reopened after success - close it immediately
      onClose();
    }
  }, [open, showSuccessModal, onClose]);

  // Reset refs when modal closes
  useEffect(() => {
    if (!open) {
      previousApiListLengthRef.current = apiState.apiList.length;
      isSubmittingRef.current = false;
      hasProcessedSuccessRef.current = false; // Reset success flag when modal closes
      setCreatedApiData(null);
      // Ensure success modal is also closed when create modal closes
      if (showSuccessModal) {
        setShowSuccessModal(false);
      }
    }
  }, [open, apiState.apiList.length, showSuccessModal]);

  // Handle successful API creation
  useEffect(() => {
    if (
      isSubmittingRef.current &&
      !apiState.loading &&
      apiState.apiList.length > previousApiListLengthRef.current &&
      open && // Only process if modal is still open
      !hasProcessedSuccessRef.current // Prevent processing success multiple times
    ) {
      // A new API was added - find it
      const newApi = apiState.apiList.find(
        (api: any, index: number) => index >= previousApiListLengthRef.current
      );
      if (newApi) {
        // Mark that we've processed this success to prevent re-processing
        hasProcessedSuccessRef.current = true;
        setCreatedApiData(newApi);
        previousApiListLengthRef.current = apiState.apiList.length;
        isSubmittingRef.current = false;
        // Close the create modal first
        onClose();
        // Then show success modal after a brief delay to ensure create modal is closed
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 100);
      }
    }
  }, [apiState.apiList, apiState.loading, onClose, open]);

  const onSubmit = (values: any) => {
    // Prepare payload matching backend expectations
    const payload = {
      company_id: Number(values.company_id),
      base_currency: values.base_currency,
      withdrawal_whitelist: values.withdrawal_whitelist || false,
    };

    // Track that we're submitting
    previousApiListLengthRef.current = apiState.apiList.length;
    isSubmittingRef.current = true;
    hasProcessedSuccessRef.current = false; // Reset success flag when submitting new form

    // Dispatch API_INSERT action
    dispatch(ApiAction(API_INSERT, payload));
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedApiData(null);
    // Ensure create modal stays closed after success modal closes
    // Always call onClose to ensure parent state is updated
    onClose();
  };

  // Prevent modal from opening if we've already processed success
  const shouldShowModal = open && !hasProcessedSuccessRef.current;

  return (
    <>
      <PopupModal
        open={shouldShowModal}
        showHeader={false}
        transparent
        handleClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "443px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 2,
          },
        }}
      >
        <PanelCard
          title={t("generate.modalTitle")}
          showHeaderBorder={false}
          headerIcon={
            <Image
              src={WalletIcon.src}
              alt="wallet-icon"
              width={16}
              height={18}
              draggable={false}
            />
          }
          bodyPadding={theme.spacing(1.5, 3.75, 3.75, 3.75)}
          headerPadding={theme.spacing(3.75, 3.75, 0, 3.75)}
          headerActionLayout="inline"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontFamily: "UrbanistMedium", lineHeight: 1.2 }}
            >
              {t("generate.modalSubtitle")}
            </Typography>
          </Box>
          <FormManager
            initialValues={{ company_id: "", base_currency: "USD" }}
            yupSchema={yup.object().shape({
              company_id: yup
                .number()
                .required(t("validation.required"))
                .min(1, t("validation.selectCompany") || "Please select a company"),
              base_currency: yup.string().required(t("validation.required")),
            })}
            onSubmit={onSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              submitDisable,
              touched,
              values,
            }) => (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <CompanySelectorForm
                  fullWidth
                  label={t("generate.selectCompany") || "Select Company"}
                  name="company_id"
                  value={values.company_id || ""}
                  onChange={(value) => {
                    const event = {
                      target: {
                        name: "company_id",
                        value: value,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleChange(event);
                  }}
                  required
                  error={touched.company_id && !!errors.company_id}
                  helperText={
                    touched.company_id && errors.company_id
                      ? String(errors.company_id)
                      : undefined
                  }
                />

                <CurrencySelector
                  fullWidth
                  label={t("generate.baseCurrency")}
                  name="base_currency"
                  value={values.base_currency || "USD"}
                  onChange={(value) => {
                    const event = {
                      target: {
                        name: "base_currency",
                        value: value,
                      },
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleChange(event);
                  }}
                  required
                  error={touched.base_currency && !!errors.base_currency}
                  helperText={
                    touched.base_currency && errors.base_currency
                      ? errors.base_currency
                      : undefined
                  }
                />

                <PermissionsContainer>
                  <IconContainer sx={{ width: "24px", height: "24px" }}>
                    <Image
                      src={InfoIcon.src}
                      alt="info-icon"
                      width={16}
                      height={16}
                      style={{
                        filter: `brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(100%)`,
                      }}
                      draggable={false}
                    />
                  </IconContainer>
                  <ContentContainer>
                    <PermissionsTitle variant="body2">
                      {t("generate.keyNameDescription")}
                    </PermissionsTitle>
                    <PermissionsList>
                      <li>{t("generate.keyNameDescription1")}</li>
                      <li>{t("generate.keyNameDescription2")}</li>
                      <li>{t("generate.keyNameDescription3")}</li>
                      <li>{t("generate.keyNameDescription4")}</li>
                    </PermissionsList>
                  </ContentContainer>
                </PermissionsContainer>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <CustomButton
                    variant="outlined"
                    size="medium"
                    label={t("actions.cancel")}
                    onClick={onClose}
                    sx={{
                      flex: 1,
                    }}
                  />
                  <CustomButton
                    type="submit"
                    variant="primary"
                    size="medium"
                    label={t("actions.generate")}
                    disabled={submitDisable}
                    sx={{
                      flex: 1,
                    }}
                  />
                </Box>
              </Box>
            )}
          </FormManager>
        </PanelCard>
      </PopupModal>
      <SuccessAPIModel
        open={showSuccessModal}
        handleClose={handleSuccessModalClose}
        apiData={createdApiData}
      />
    </>
  );
};

export default CreateApiModel;
