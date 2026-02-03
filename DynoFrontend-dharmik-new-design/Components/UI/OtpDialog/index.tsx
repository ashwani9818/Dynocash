import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { CancelRounded, Info } from "@mui/icons-material";
import Image from "next/image";
import PopupModal from "@/Components/UI/PopupModal";
import CustomButton from "@/Components/UI/Buttons";
import FormManager from "@/Components/Page/Common/FormManager";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import PanelCard from "@/Components/UI/PanelCard";
import useIsMobile from "@/hooks/useIsMobile";
import * as yup from "yup";
import EnvelopeIcon from "@/assets/Icons/envelope-icon.svg";
import ArrowUpwardIcon from "@/assets/Icons/up-arrow-icon.png";
import { DialogCloseButton } from "./styled";
import CloseIcon from "@/assets/Icons/close-icon.svg";
import { useTranslation } from "react-i18next";

export interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  contactInfo?: string; // Email or phone number to display
  contactType?: "email" | "phone"; // Type of contact info
  otpLength?: number; // Default 6
  resendCodeLabel?: string;
  resendCodeCountdownLabel?: (seconds: number) => string;
  primaryButtonLabel?: string;
  onResendCode?: () => void;
  onVerify?: (otp: string) => void;
  onClearError?: () => void; // Callback to clear error when user starts typing
  countdown?: number; // Countdown in seconds
  loading?: boolean;
  error?: string;
  preventClose?: boolean; // Prevent closing when countdown is active
}

// Generate initial OTP values dynamically
const generateOtpInitial = (length: number) => {
  const initial: any = {};
  for (let i = 1; i <= length; i++) {
    initial[`otp${i}`] = "";
  }
  return initial;
};

const OtpDialog: React.FC<OtpDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  contactInfo = "",
  contactType = "email",
  otpLength = 6,
  resendCodeLabel,
  resendCodeCountdownLabel,
  primaryButtonLabel,
  onResendCode,
  onVerify,
  onClearError,
  countdown = 0,
  loading = false,
  error,
  preventClose = false,
}) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const isMobile = useIsMobile("sm");
  const otpInitial = React.useMemo(() => generateOtpInitial(otpLength), [otpLength]);
  const [otpValues, setOtpValues] = useState(otpInitial);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Use translations as defaults if props are not provided
  const dialogTitle = title || t("emailVerification");
  const dialogSubtitle = subtitle;
  const dialogResendCodeLabel = resendCodeLabel || t("resendCode");
  const dialogResendCodeCountdownLabel =
    resendCodeCountdownLabel ||
    ((seconds: number) => `${t("codeIn")} ${seconds}s`);
  const dialogPrimaryButtonLabel = primaryButtonLabel || t("checkAndAdd");

  // Calculate input size based on screen size
  const inputSize = isMobile ? "32px" : "40px";

  // Create schema based on otpLength with proper numeric validation
  const otpSchema = React.useMemo(() => {
    const shape: any = {};
    for (let i = 1; i <= otpLength; i++) {
      shape[`otp${i}`] = yup
        .string()
        .required(t("required"))
        .matches(/^[0-9]$/, t("mustBeNumeric") || "Must be a single digit");
    }
    return yup.object().shape(shape);
  }, [otpLength, t]);

  // Reset OTP values when dialog closes and auto-focus first field when opens
  useEffect(() => {
    if (!open) {
      setOtpValues(otpInitial);
      inputRefs.current = [];
      previousOtpRef.current = "";
      setFocusedIndex(null);
    } else {
      // Reset previous OTP ref when dialog opens
      previousOtpRef.current = "";
      // Auto-focus first input when dialog opens
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          setFocusedIndex(0);
        }
      }, 100);
    }
  }, [open, otpInitial]);

  const handleOtpChange = (
    index: number,
    value: string,
    handleChange: any,
    values: any
  ) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");

    // If empty string, allow clearing
    if (numericValue.length === 0 && value === "") {
      const fieldName = `otp${index + 1}`;
      const e: any = {
        target: {
          name: fieldName,
          value: "",
        },
      };
      handleChange(e);
      // Clear error when user starts typing
      if (error && onClearError) {
        onClearError();
      }
      return;
    }

    // If no numeric value, ignore
    if (numericValue.length === 0) {
      return;
    }

    const singleDigit = numericValue.slice(-1); // Get last digit
    const fieldName = `otp${index + 1}`;

    const e: any = {
      target: {
        name: fieldName,
        value: singleDigit,
      },
    };
    handleChange(e);

    // Clear error when user starts typing
    if (error && onClearError) {
      onClearError();
    }

    // If multiple digits were entered, distribute them to subsequent fields
    if (numericValue.length > 1) {
      const remainingDigits = numericValue.slice(1);
      remainingDigits.split("").forEach((digit, idx) => {
        const nextIndex = index + idx + 1;
        if (nextIndex < otpLength) {
          const nextFieldName = `otp${nextIndex + 1}`;
          const nextEvent: any = {
            target: {
              name: nextFieldName,
              value: digit,
            },
          };
          handleChange(nextEvent);
        }
      });

      // Focus on the last filled field or next empty field
      const lastFilledIndex = Math.min(
        index + numericValue.length - 1,
        otpLength - 1
      );
      const nextField = inputRefs.current[lastFilledIndex];
      if (nextField) {
        setTimeout(() => {
          nextField.focus();
          setFocusedIndex(lastFilledIndex);
        }, 0);
      }
    } else if (singleDigit && index < otpLength - 1) {
      // Auto-focus to next field if current field has a value
      const nextField = inputRefs.current[index + 1];
      if (nextField) {
        setTimeout(() => {
          nextField.focus();
          setFocusedIndex(index + 1);
        }, 0);
      }
    }
  };

  const handleOtpBlur = (fieldName: string, handleBlur: any) => {
    const e: any = {
      target: {
        name: fieldName,
      },
    };
    handleBlur(e);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    values: any,
    handleChange: any
  ) => {
    const fieldName = `otp${index + 1}`;
    const currentValue = values[fieldName];

    // Handle Arrow Left - move to previous field
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevField = inputRefs.current[index - 1];
      if (prevField) {
        prevField.focus();
        setFocusedIndex(index - 1);
      }
      return;
    }

    // Handle Arrow Right - move to next field
    if (e.key === "ArrowRight" && index < otpLength - 1) {
      e.preventDefault();
      const nextField = inputRefs.current[index + 1];
      if (nextField) {
        nextField.focus();
        setFocusedIndex(index + 1);
      }
      return;
    }

    // Handle Backspace
    if (e.key === "Backspace") {
      if (!currentValue && index > 0) {
        // If current field is empty, move to previous and clear it
        e.preventDefault();
        const prevField = inputRefs.current[index - 1];
        const prevFieldName = `otp${index}`;
        const clearEvent: any = {
          target: {
            name: prevFieldName,
            value: "",
          },
        };
        handleChange(clearEvent);
        if (prevField) {
          prevField.focus();
          setFocusedIndex(index - 1);
        }
      } else if (currentValue) {
        // If current field has value, just clear it
        const clearEvent: any = {
          target: {
            name: fieldName,
            value: "",
          },
        };
        handleChange(clearEvent);
      }
      return;
    }

    // Handle Delete key - clear current field
    if (e.key === "Delete") {
      e.preventDefault();
      const clearEvent: any = {
        target: {
          name: fieldName,
          value: "",
        },
      };
      handleChange(clearEvent);
      return;
    }

    // Handle Enter key - trigger submit if all fields are valid
    if (e.key === "Enter") {
      e.preventDefault();
      const { isValid, otp } = validateOtp(values);
      
      if (isValid && otp !== previousOtpRef.current && onVerify) {
        previousOtpRef.current = otp;
        onVerify(otp);
      }
      return;
    }

    // Prevent non-numeric keys (except navigation keys already handled)
    if (
      !/^[0-9]$/.test(e.key) &&
      ![
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Enter",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLDivElement>,
    handleChange: any,
    values: any,
    startIndex: number = 0
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Get pasted data
    const pastedData = e.clipboardData.getData("text");

    // Extract only numbers from pasted data
    const numericValue = pastedData.replace(/\D/g, "");

    // If no numeric data, ignore paste
    if (numericValue.length === 0) {
      return;
    }

    // Clear error when user pastes
    if (error && onClearError) {
      onClearError();
    }

    // Use the latest form values from ref if available
    const currentValues = formValuesRef.current || values;

    // Determine starting index - start from the field where paste occurred
    // If current field has a value, replace it; otherwise start from first empty field
    let firstEmptyIndex = startIndex;
    const currentFieldValue = currentValues[`otp${startIndex + 1}`];
    
    // If current field is empty, find first empty field to start filling from
    if (!currentFieldValue || String(currentFieldValue).trim().length === 0) {
      for (let i = 0; i < otpLength; i++) {
        const fieldName = `otp${i + 1}`;
        const fieldValue = currentValues[fieldName];
        if (
          !fieldValue ||
          String(fieldValue).trim().length === 0
        ) {
          firstEmptyIndex = i;
          break;
        }
      }
    }

    // Calculate how many digits we can fit
    const availableSlots = otpLength - firstEmptyIndex;
    const digitsToFill = numericValue.slice(0, availableSlots);

    // Validate each digit is numeric before filling
    const validDigits = digitsToFill.split("").filter(digit => /^\d$/.test(digit));
    
    if (validDigits.length === 0) {
      return;
    }

    // Create updated values object with all pasted digits
    const updatedValues = { ...currentValues };
    
    // Fill OTP fields with pasted values starting from firstEmptyIndex
    validDigits.forEach((digit, idx) => {
      const fieldIndex = firstEmptyIndex + idx;
      if (fieldIndex < otpLength) {
        const fieldName = `otp${fieldIndex + 1}`;
        updatedValues[fieldName] = digit;
      }
    });

    // Update form values ref immediately
    formValuesRef.current = updatedValues;

    // Update all fields in sequence using handleChange
    validDigits.forEach((digit, idx) => {
      const fieldIndex = firstEmptyIndex + idx;
      if (fieldIndex < otpLength) {
        const fieldName = `otp${fieldIndex + 1}`;
        const changeEvent: any = {
          target: {
            name: fieldName,
            value: digit,
          },
        };
        handleChange(changeEvent);
      }
    });

    // Calculate the last filled index
    const lastFilledIndex = Math.min(
      firstEmptyIndex + validDigits.length - 1,
      otpLength - 1
    );

    // Use setTimeout to ensure all state updates are processed before focusing
    setTimeout(() => {
      const latestValues = formValuesRef.current || updatedValues;
      let nextFocusIndex = lastFilledIndex;

      // Check if all fields are now filled
      const allFilled = Array.from({ length: otpLength }).every((_, idx) => {
        const fieldName = `otp${idx + 1}`;
        const fieldValue = latestValues[fieldName];
        return fieldValue && String(fieldValue).trim().length > 0 && /^\d$/.test(String(fieldValue).trim());
      });

      if (!allFilled) {
        // Find next empty field
        for (let i = lastFilledIndex + 1; i < otpLength; i++) {
          const fieldName = `otp${i + 1}`;
          const fieldValue = latestValues[fieldName];
          if (
            !fieldValue ||
            String(fieldValue).trim().length === 0
          ) {
            nextFocusIndex = i;
            break;
          }
        }
      } else {
        // All filled, focus last field
        nextFocusIndex = otpLength - 1;
      }

      const nextField = inputRefs.current[nextFocusIndex];
      if (nextField) {
        nextField.focus();
        setFocusedIndex(nextFocusIndex);
        // Select all text in the field for better UX
        nextField.select();
      }
    }, 100); // Slightly longer delay to ensure all state updates are processed
  };

  // Validate OTP before submission
  const validateOtp = React.useCallback((values: any): { isValid: boolean; otp: string } => {
    // Combine OTP values into a single string
    const otp = Object.keys(values)
      .sort()
      .map((key) => values[key])
      .join("");

    // Check if OTP has correct length
    if (otp.length !== otpLength) {
      return { isValid: false, otp };
    }

    // Check if all characters are numeric
    if (!/^\d+$/.test(otp)) {
      return { isValid: false, otp };
    }

    // Check if all fields are filled and valid
    for (let i = 1; i <= otpLength; i++) {
      const fieldName = `otp${i}`;
      const fieldValue = values[fieldName];
      const stringValue = String(fieldValue || "").trim();
      if (
        !fieldValue ||
        stringValue === "" ||
        !/^\d$/.test(stringValue)
      ) {
        return { isValid: false, otp };
      }
    }

    return { isValid: true, otp };
  }, [otpLength]);

  const handleSubmit = (values: any) => {
    const { isValid, otp } = validateOtp(values);
    
    // Only submit if OTP is valid and not a duplicate
    if (isValid && otp !== previousOtpRef.current && onVerify) {
      previousOtpRef.current = otp;
      onVerify(otp);
    }
  };

  // Track previous OTP to prevent duplicate submissions
  const previousOtpRef = useRef<string>("");
  const formValuesRef = useRef<any>(null);

  // Reset previous OTP when error occurs to allow resubmission
  useEffect(() => {
    if (error) {
      previousOtpRef.current = "";
    }
  }, [error]);

  // Handle close - prevent if preventClose is true
  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <PopupModal
      open={open}
      handleClose={handleClose}
      showHeader={false}
      transparent
      disableEscapeKeyDown={preventClose}
      onClose={(event, reason) => {
        if (preventClose) {
          return;
        }
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose();
        }
      }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "14px",
          maxWidth: "520px",
          width: "100%",
        },
        [theme.breakpoints.down("md")]: {
          "& .MuiDialog-paper": {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "14px",
            maxWidth: "520px",
            width: "90%",
            margin: 0,
            position: "fixed",
          },
        },
      }}
    >
      <PanelCard
        title={dialogTitle}
        headerIcon={
          contactType === "email" ? (
            <Image
              src={EnvelopeIcon}
              alt="email icon"
              width={24}
              height={24}
              draggable={false}
            />
          ) : undefined
        }
        headerAction={
          <DialogCloseButton
            onClick={handleClose}
            sx={{
              cursor: preventClose ? "not-allowed" : "pointer",
              opacity: preventClose ? 0.5 : 1,
            }}
          >
            <Image
              src={CloseIcon.src}
              alt="close icon"
              width={16}
              height={16}
              draggable={false}
            />
          </DialogCloseButton>
        }
        showHeaderBorder={false}
        bodyPadding="0"
        headerPadding="0"
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "none",
          outline: "none",
          [theme.breakpoints.down("sm")]: {
            padding: "20px",
          },
        }}
        bodySx={{
          padding: "0",
        }}
      >
        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: "15px",
            color: theme.palette.text.secondary,
            fontFamily: "UrbanistMedium",
            marginBottom: "16px",
            marginTop: "12px",
            lineHeight: "1.3",
          }}
        >
          {dialogSubtitle}
        </Typography>

        {/* Info Message Box */}
        {contactInfo && (
          <Box
            sx={{
              backgroundColor: theme.palette.secondary.main,
              borderRadius: "6px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: `1px solid ${theme.palette.border.main}`,
              marginBottom: "16px",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Info
              sx={{
                color: theme.palette.primary.main,
                fontSize: "18px",
                width: "16px",
                height: "16px",
              }}
            />
            <Typography
              sx={{
                fontSize: "15px",
                color: theme.palette.primary.main,
                fontFamily: "UrbanistMedium",
                lineHeight: "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "13px",
                },
              }}
            >
              {t("codeSentTo")}{" "}
              <span style={{ fontWeight: 600, fontFamily: "UrbanistBold" }}>
                {contactInfo}
              </span>
            </Typography>
          </Box>
        )}

        {/* OTP Input Fields */}
        <FormManager
          initialValues={otpInitial}
          yupSchema={otpSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            submitDisable,
            touched,
            values,
          }) => {
            formValuesRef.current = values;

            // Validate all fields are filled and numeric
            const checkAllFieldsFilled = (currentValues: any): boolean => {
              for (let idx = 0; idx < otpLength; idx++) {
                const fieldName = `otp${idx + 1}`;
                const fieldValue = currentValues[fieldName];
                if (
                  fieldValue === undefined ||
                  fieldValue === null ||
                  String(fieldValue).trim().length === 0 ||
                  !/^\d$/.test(String(fieldValue).trim())
                ) {
                  return false;
                }
              }
              return true;
            };

            const areAllFieldsFilled = checkAllFieldsFilled(values);

            // Helper function to check and auto-submit with proper validation
            const checkAutoSubmit = (currentValues: any) => {
              // Validate OTP before auto-submitting
              const { isValid, otp } = validateOtp(currentValues);

              if (isValid && !loading && !submitDisable) {
                // Prevent duplicate submissions
                if (otp !== previousOtpRef.current) {
                  previousOtpRef.current = otp;
                  // Small delay to ensure UI updates are complete
                  setTimeout(() => {
                    if (onVerify) {
                      onVerify(otp);
                    }
                  }, 150);
                }
              } else if (!isValid) {
                // Reset previous OTP when fields are invalid or cleared
                previousOtpRef.current = "";
              }
            };

            return (
              <>
                <Box sx={{ marginBottom: "16px" }}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      fontFamily: "UrbanistMedium",
                      marginBottom: "8px",
                    }}
                  >
                    {t("verificationCode")} *
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-start",
                    }}
                    onPaste={(e) => {
                      // Handle paste at container level (when no field is focused)
                      // Find first empty field or use first field
                      let pasteStartIndex = 0;
                      for (let i = 0; i < otpLength; i++) {
                        const fieldName = `otp${i + 1}`;
                        const fieldValue = values[fieldName];
                        if (
                          !fieldValue ||
                          String(fieldValue).trim().length === 0
                        ) {
                          pasteStartIndex = i;
                          break;
                        }
                      }
                      handlePaste(e, handleChange, values, pasteStartIndex);
                      // Delay auto-submit check to ensure all paste operations complete
                      setTimeout(() => {
                        const latestValues =
                          formValuesRef.current || values;
                        checkAutoSubmit(latestValues);
                      }, 200);
                    }}
                  >
                    {Array.from({ length: otpLength }).map((_, index) => {
                      const fieldName = `otp${index + 1}`;
                      const hasValue =
                        values[fieldName] && values[fieldName].length > 0;
                      const hasError = !!error;
                      const isFocused = focusedIndex === index;

                      return (
                        <Box
                          key={fieldName}
                          sx={{
                            width: inputSize,
                            minWidth: inputSize,
                            maxWidth: inputSize,
                          }}
                        >
                          <InputField
                            value={values[fieldName] || ""}
                            name={fieldName}
                            type="text"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              
                              // Process the input value
                              handleOtpChange(
                                index,
                                inputValue,
                                handleChange,
                                values
                              );

                              // Update form values ref after a brief delay to ensure state is updated
                              setTimeout(() => {
                                // Get latest values from form state
                                const latestValues = formValuesRef.current || values;
                                checkAutoSubmit(latestValues);
                              }, 100);
                            }}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => {
                              setFocusedIndex(null);
                              handleOtpBlur(fieldName, handleBlur);
                            }}
                            onKeyDown={(e) =>
                              handleKeyDown(index, e, values, handleChange)
                            }
                            onPaste={(e) => {
                              handlePaste(e, handleChange, values, index);
                              // Delay auto-submit check to ensure all paste operations complete
                              // This ensures form state is fully updated before validation
                              setTimeout(() => {
                                const latestValues =
                                  formValuesRef.current || values;
                                checkAutoSubmit(latestValues);
                              }, 200);
                            }}
                            autoComplete="off"
                            error={hasError}
                            success={hasValue && !hasError}
                            fullWidth
                            maxLength={1}
                            inputMode="numeric"
                            inputHeight={inputSize}
                            inputRef={(el: HTMLInputElement | null) => {
                              inputRefs.current[index] = el;
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "6px !important",
                                backgroundColor: "#fff !important",
                                "& fieldset": {
                                  borderColor:
                                    theme.palette.border.main + " !important",
                                  borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                  borderColor:
                                    theme.palette.primary.main + " !important",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor:
                                    theme.palette.primary.main + " !important",
                                  borderWidth: "1px",
                                },
                              },
                              "& .MuiInputBase-input": {
                                textAlign: "center",
                                fontSize: isMobile ? "18px" : "20px",
                                fontWeight: 600,
                                fontFamily: "UrbanistBold",
                                padding: "0 !important",
                                letterSpacing: "0.5px",
                                color: "#242428",
                                height: "100%",
                                lineHeight: inputSize,
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                  {error && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#d32f2f",
                        marginTop: "8px",
                        fontFamily: "UrbanistMedium",
                      }}
                    >
                      {error}
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Resend Code Button */}
                  <CustomButton
                    variant="secondary"
                    size="medium"
                    label={
                      countdown > 0
                        ? dialogResendCodeCountdownLabel(countdown)
                        : dialogResendCodeLabel
                    }
                    onClick={() => {
                      if (onResendCode) {
                        onResendCode();
                      }
                    }}
                    disabled={countdown > 0 || loading}
                    endIcon={
                      countdown > 0 || loading ? undefined : ArrowUpwardIcon
                    }
                    type="button"
                    sx={{
                      fontWeight: 500,
                      padding: "11px 20px",
                      flex: 1,
                      fontSize: isMobile ? "13px" : "15px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "13px",
                        padding: "10px 16px",
                      },
                    }}
                  />

                  {/* Primary Action Button */}
                  <CustomButton
                    variant="primary"
                    size="medium"
                    label={dialogPrimaryButtonLabel}
                    type="submit"
                    disabled={
                      submitDisable ||
                      loading ||
                      !areAllFieldsFilled ||
                      !validateOtp(values).isValid
                    }
                    sx={{
                      fontWeight: 700,
                      padding: "15px 24px",
                      flex: 1,
                      fontSize: isMobile ? "13px" : "15px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "13px",
                        padding: "12px 20px",
                      },
                    }}
                  />
                </Box>
              </>
            );
          }}
        </FormManager>
      </PanelCard>
    </PopupModal>
  );
};

export default OtpDialog;
