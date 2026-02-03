import { Lock } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { UserAction } from "@/Redux/Actions";
import { USER_UPDATE_PASSWORD } from "@/Redux/Actions/UserAction";
import FormManager from "../Common/FormManager";
import InfoIcon from "@/assets/Icons/info-icon.svg";
import PanelCard from "@/Components/UI/PanelCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import { useTranslation } from "react-i18next";
import { InfoIconBox, InfoText, InfoWrapper } from "./styled";
import { theme } from "@/styles/theme";
import Image from "next/image";
import CustomButton from "@/Components/UI/Buttons";
import useIsMobile from "@/hooks/useIsMobile";
import PasswordValidation from "@/Components/UI/AuthLayout/PasswordValidation";

const initialPasswords = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const UpdatePassword = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation("profile");
  const [formKey, setFormKey] = useState(0);
  const isMobile = useIsMobile("md");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const newPasswordFieldRef = useRef<HTMLDivElement | null>(null);

  // Track which fields have been interacted with (touched or changed)
  const [interactedFields, setInteractedFields] = useState<{
    oldPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Reset interacted fields when form is reset
  useEffect(() => {
    setInteractedFields({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    setShowPasswordValidation(false);
  }, [formKey]);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=__+{}\[\]:;<>,.?/~]).{8,20}$/;

  const passwordSchema = yup.object().shape({
    oldPassword: yup.string().optional(),
    newPassword: yup
      .string()
      .nullable()
      .test("password-validation", "", function (value) {
        // Only validate if value exists and is not empty
        if (!value || value.trim() === "") {
          return true; // No error if empty
        }
        return passwordRegex.test(value);
      }),
    confirmPassword: yup
      .string()
      .nullable()
      .test("password-match", t("passwordMismatch"), function (value) {
        // Only validate if value exists and is not empty
        if (!value || value.trim() === "") {
          return true; // No error if empty
        }
        // Check if it matches newPassword
        const newPassword = this.parent.newPassword;
        return value === newPassword;
      }),
  });

  const handlePasswordSubmit = (values: any) => {
    dispatch(UserAction(USER_UPDATE_PASSWORD, { ...values }));
    // Reset form after submission
    setFormKey((prev) => prev + 1);
  };

  return (
    <PanelCard
      bodyPadding={`${theme.spacing(2, 2.5, 2.5, 2.5)}`}
      title={t("updatePassword")}
      showHeaderBorder={false}
      headerAction={
        <IconButton>
          <Lock color="action" />
        </IconButton>
      }
    >
      <FormManager
        key={formKey}
        initialValues={initialPasswords}
        yupSchema={passwordSchema}
        onSubmit={handlePasswordSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          submitDisable,
          touched,
          values,
        }) => {
          // Helper to check if error should be shown
          const shouldShowError = (
            fieldName: keyof typeof interactedFields,
            touched: any,
            errors: any
          ) => {
            // Show error if field has been interacted with (touched or changed) AND there's an error
            return (
              (interactedFields[fieldName] || touched[fieldName]) &&
              !!errors[fieldName]
            );
          };

          // Create enhanced handlers that track interactions
          const createChangeHandler = (
            fieldName: keyof typeof interactedFields
          ) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
              setInteractedFields((prev) => ({ ...prev, [fieldName]: true }));
              handleChange(e);

              // Handle password validation for newPassword field
              if (fieldName === "newPassword") {
                const value = e.target.value.replace(/\s/g, ""); // Remove spaces
                if (!value) {
                  setShowPasswordValidation(false);
                } else if (passwordRegex.test(value)) {
                  setShowPasswordValidation(false);
                } else {
                  setShowPasswordValidation(true);
                }
              }
            };
          };

          const createBlurHandler = (
            fieldName: keyof typeof interactedFields
          ) => {
            return (e: React.FocusEvent<HTMLInputElement>) => {
              setInteractedFields((prev) => ({ ...prev, [fieldName]: true }));
              handleBlur(e);

              // Handle password validation blur for newPassword field
              if (fieldName === "newPassword") {
                setTimeout(() => {
                  setShowPasswordValidation(false);
                }, 200);
              }
            };
          };

          const handleNewPasswordFocus = () => {
            if (values.newPassword && !passwordRegex.test(values.newPassword)) {
              setShowPasswordValidation(true);
            }
          };

          return (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  rowGap: "14px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <InputField
                    inputHeight={isMobile ? "32px" : "38px"}
                    label={t("oldPassword")}
                    type={showPassword ? "text" : "password"}
                    name="oldPassword"
                    value={values.oldPassword || ""}
                    onChange={createChangeHandler("oldPassword")}
                    onBlur={createBlurHandler("oldPassword")}
                    placeholder={t("oldPasswordPlaceholder")}
                    error={shouldShowError("oldPassword", touched, errors)}
                    helperText={
                      shouldShowError("oldPassword", touched, errors)
                        ? errors.oldPassword
                        : ""
                    }
                    sideButton={true}
                    sideButtonType="primary"
                    iconBoxSize={isMobile ? "32px" : "38px"}
                    sideButtonIcon={
                      showPassword ? (
                        <VisibilityOffIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      )
                    }
                    sideButtonIconWidth={isMobile ? "14px" : "19px"}
                    sideButtonIconHeight={isMobile ? "14px" : "19px"}
                    onSideButtonClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    showPasswordToggle={true}
                  />

                  <InfoWrapper>
                    <InfoIconBox>
                      <Image
                        src={InfoIcon.src}
                        alt="info-icon"
                        width={16}
                        height={16}
                        draggable={false}
                      />
                    </InfoIconBox>
                    <InfoText>{t("infoText")}</InfoText>
                  </InfoWrapper>
                </Box>

                <Box
                  ref={newPasswordFieldRef}
                  sx={{ position: "relative", width: "100%" }}
                >
                  <InputField
                    inputHeight={isMobile ? "32px" : "38px"}
                    label={t("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={values.newPassword || ""}
                    onChange={createChangeHandler("newPassword")}
                    onFocus={handleNewPasswordFocus}
                    onBlur={createBlurHandler("newPassword")}
                    placeholder={t("newPasswordPlaceholder")}
                    error={
                      shouldShowError("newPassword", touched, errors) ||
                      showPasswordValidation
                    }
                    helperText={
                      shouldShowError("newPassword", touched, errors)
                        ? errors.newPassword
                        : ""
                    }
                    sideButton={true}
                    sideButtonType="primary"
                    iconBoxSize={isMobile ? "32px" : "38px"}
                    sideButtonIcon={
                      showNewPassword ? (
                        <VisibilityOffIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      )
                    }
                    sideButtonIconWidth={isMobile ? "14px" : "19px"}
                    sideButtonIconHeight={isMobile ? "14px" : "19px"}
                    onSideButtonClick={() => {
                      setShowNewPassword(!showNewPassword);
                    }}
                    showPasswordToggle={true}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      ...(isMobile &&
                        theme.breakpoints.down("lg") && {
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100%",
                        }),
                      zIndex: 5,
                    }}
                  >
                    <PasswordValidation
                      password={values.newPassword || ""}
                      anchorEl={newPasswordFieldRef.current}
                      open={showPasswordValidation}
                      onClose={() => setShowPasswordValidation(false)}
                      showOnMobile={showPasswordValidation}
                    />
                  </Box>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <InputField
                    inputHeight={isMobile ? "32px" : "38px"}
                    label={t("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword || ""}
                    onChange={createChangeHandler("confirmPassword")}
                    onBlur={createBlurHandler("confirmPassword")}
                    placeholder={t("confirmPasswordPlaceholder")}
                    error={shouldShowError("confirmPassword", touched, errors)}
                    helperText={
                      shouldShowError("confirmPassword", touched, errors)
                        ? errors.confirmPassword
                        : ""
                    }
                    sideButton={true}
                    sideButtonType="primary"
                    iconBoxSize={isMobile ? "32px" : "38px"}
                    sideButtonIcon={
                      showConfirmPassword ? (
                        <VisibilityOffIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{
                            color: "#676768",
                            height: "18px",
                            width: "16px",
                          }}
                        />
                      )
                    }
                    sideButtonIconWidth={isMobile ? "14px" : "19px"}
                    sideButtonIconHeight={isMobile ? "14px" : "19px"}
                    onSideButtonClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    showPasswordToggle={true}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: { xs: "stretch", sm: "flex-end" },
                }}
              >
                <CustomButton
                  label={t("update")}
                  variant="primary"
                  size={isMobile ? "small" : "medium"}
                  disabled={
                    submitDisable ||
                    !values.newPassword?.trim() ||
                    !values.confirmPassword?.trim()
                  }
                  type="submit"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                />
              </Box>
            </Box>
          );
        }}
      </FormManager>
    </PanelCard>
  );
};

export default UpdatePassword;
