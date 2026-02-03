import PanelCard from "@/Components/UI/PanelCard";
import {
  Box,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Popover,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentSettingsLabel,
  TabContainer,
  TabContentContainer,
  TabItem,
  ExpireTrigger,
  ExpireText,
  ExpireDropdown,
} from "./styled";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import Image from "next/image";
import CustomRadio from "@/Components/UI/RadioGroup";
import PaymentLinkSuccessModal from "./PaymentLinkSuccessModal";

import RoundedStackIcon from "@/assets/Icons/roundedStck-icon.svg";
import HourglassIcon from "@/assets/Icons/hourglass-icon.svg";
import PaymentIcon from "@/assets/Icons/payment-icon.svg";
import NoteIcon from "@/assets/Icons/note-icon.svg";
import CustomButton from "@/Components/UI/Buttons";
import { theme } from "@/styles/theme";
import useIsMobile from "@/hooks/useIsMobile";

const CreatePaymentLinkPage = () => {
  const isMobile = useIsMobile("md");
  const { t } = useTranslation("createPaymentLinkScreen");
  const tPaymentLink = useCallback(
    (key: string): string => {
      const result = t(key, { ns: "createPaymentLinkScreen" });
      return typeof result === "string" ? result : String(result);
    },
    [t]
  );
  const [activeTab, setActiveTab] = useState(0);
  const [blockchainFees, setBlockchainFees] = useState("company");
  const expireAnchorEl = useRef<HTMLElement | null>(null);
  const expireTriggerRef = useRef<HTMLDivElement>(null);
  const [expireOpen, setExpireOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  // Payment Settings (Tab 0) form data
  const [paymentSettings, setPaymentSettings] = useState({
    value: "",
    expire: "no",
    description: "",
    blockchainFees: "company",
    linkId: "",
  });

  // Validation errors for Payment Settings tab
  const [paymentSettingsErrors, setPaymentSettingsErrors] = useState({
    value: "",
    description: "",
  });

  // Touched fields for Payment Settings tab
  const [paymentSettingsTouched, setPaymentSettingsTouched] = useState({
    value: false,
    description: false,
  });

  // Post-Payment Settings (Tab 1) form data
  const [postPaymentSettings, setPostPaymentSettings] = useState({
    callbackUrl: "",
    redirectUrl: "",
    webhookUrl: "",
  });

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  const handleBlockchainFeesChange = (value: string) => {
    setBlockchainFees(value);
    setPaymentSettings((prev) => ({ ...prev, blockchainFees: value }));
  };

  const validatePaymentSettings = () => {
    const errors: { value: string; description: string } = {
      value: "",
      description: "",
    };

    // Validate value field
    if (!paymentSettings.value || paymentSettings.value.trim() === "") {
      errors.value = tPaymentLink("valueRequired");
    } else {
      const numValue = parseFloat(paymentSettings.value);
      if (isNaN(numValue) || numValue <= 0) {
        errors.value = tPaymentLink("valueInvalid");
      } else if (numValue > 999999999) {
        errors.value = tPaymentLink("valueTooLarge");
      } else if (paymentSettings.value.split(".")[1]?.length > 2) {
        errors.value = tPaymentLink("valueDecimalPlaces");
      }
    }

    // Validate description (optional but check max length if provided)
    if (paymentSettings.description && paymentSettings.description.length > 500) {
      errors.description = tPaymentLink("descriptionMaxLength");
    }

    setPaymentSettingsErrors(errors);
    return !errors.value && !errors.description;
  };

  const handlePaymentSettingsChange = (field: string, value: string) => {
    setPaymentSettings((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (paymentSettingsErrors[field as keyof typeof paymentSettingsErrors]) {
      setPaymentSettingsErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentSettingsBlur = (field: string) => {
    setPaymentSettingsTouched((prev) => ({ ...prev, [field]: true }));
    validatePaymentSettings();
  };

  const handlePostPaymentSettingsChange = (field: string, value: string) => {
    setPostPaymentSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpireOpen = (event: React.MouseEvent<HTMLElement>) => {
    expireAnchorEl.current = event.currentTarget;
    setExpireOpen(true);
  };

  const handleExpireClose = () => {
    setExpireOpen(false);
    expireAnchorEl.current = null;
  };

  const handleExpireSelect = (value: string) => {
    handlePaymentSettingsChange("expire", value);
    handleExpireClose();
  };

  // Handle click outside for expire dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expireTriggerRef.current &&
        !expireTriggerRef.current.contains(event.target as Node) &&
        expireAnchorEl.current &&
        !(expireAnchorEl.current as HTMLElement).contains(event.target as Node)
      ) {
        handleExpireClose();
      }
    };

    if (expireOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expireOpen]);

  const handleCreatePaymentLink = () => {
    if (activeTab === 0) {
      // Mark all fields as touched
      setPaymentSettingsTouched({
        value: true,
        description: true,
      });

      // Validate before submitting
      if (!validatePaymentSettings()) {
        return;
      }

      console.log("Payment Settings Data:", paymentSettings);
      // Generate a mock payment link (in real app, this would come from API)
      const mockLink = `https://pay.dynopay.com/${Math.random()
        .toString(36)
        .substring(7)}`;
      setPaymentLink(mockLink);
      setSuccessModalOpen(true);
    } else if (activeTab === 1) {
      console.log("Post-Payment Settings Data:", postPaymentSettings);
      // Generate a mock payment link (in real app, this would come from API)
      const mockLink = `https://pay.dynopay.com/${Math.random()
        .toString(36)
        .substring(7)}`;
      setPaymentLink(mockLink);
      setSuccessModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
    }
  };
  return (
    <div>
      <PaymentLinkSuccessModal
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
        paymentLink={paymentLink}
        paymentSettings={paymentSettings}
        onCopyLink={handleCopyLink}
      />

      <PanelCard
        bodyPadding={isMobile ? 2 : 2.5}
        sx={{
          maxWidth: { xs: "100%", md: "959px" },
          width: "100%",
          borderRadius: { xs: "8px", md: "14px" },
        }}
      >
        <Box>
          <TabContainer>
            <TabItem
              onClick={() => handleTabChange(0)}
              active={activeTab === 0}
            >
              <p>{tPaymentLink("paymentSettings")}</p>
            </TabItem>
            <TabItem
              onClick={() => handleTabChange(1)}
              active={activeTab === 1}
            >
              <p>{tPaymentLink("postPaymentSettings")}</p>
            </TabItem>
          </TabContainer>
        </Box>
        {activeTab === 0 && (
          <TabContentContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1.5, md: 2 },
                }}
              >
                <InputField
                  label={
                    <PaymentSettingsLabel>
                      <Image
                        src={RoundedStackIcon}
                        alt="value"
                        draggable={false}
                        style={{
                          filter: `brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(100%)`,
                        }}
                      />
                      <span>{tPaymentLink("value")}</span>
                    </PaymentSettingsLabel>
                  }
                  value={paymentSettings.value}
                  onChange={(e) =>
                    handlePaymentSettingsChange("value", e.target.value)
                  }
                  onBlur={() => handlePaymentSettingsBlur("value")}
                  type="number"
                  inputMode="decimal"
                  error={
                    paymentSettingsTouched.value &&
                    Boolean(paymentSettingsErrors.value)
                  }
                  helperText={
                    paymentSettingsTouched.value && paymentSettingsErrors.value
                      ? paymentSettingsErrors.value
                      : undefined
                  }
                  sx={{
                    width: "100%",
                  }}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <PaymentSettingsLabel>
                    <Image src={HourglassIcon} alt="expire" draggable={false} />
                    <span>{tPaymentLink("expire")}</span>
                  </PaymentSettingsLabel>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <ExpireTrigger
                      ref={expireTriggerRef}
                      onClick={handleExpireOpen}
                      fullWidth={true}
                      isOpen={expireOpen}
                      isMobile={isMobile}
                      sx={{
                        borderColor: theme.palette.border.main,
                        "&:hover": {
                          borderColor: theme.palette.border.focus,
                        },
                        "&:focus": {
                          borderColor: theme.palette.border.focus,
                        },
                        "&:focus-visible": {
                          borderColor: theme.palette.border.focus,
                        },
                        "&:active": {
                          borderColor: theme.palette.border.focus,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <ExpireText isMobile={isMobile}>
                          {paymentSettings.expire === "no"
                            ? tPaymentLink("no")
                            : paymentSettings.expire === "yes"
                              ? tPaymentLink("yes")
                              : tPaymentLink("no")}
                        </ExpireText>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {expireOpen ? (
                          <ExpandLessIcon
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: isMobile ? "18px" : "20px",
                            }}
                          />
                        ) : (
                          <ExpandMoreIcon
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: isMobile ? "18px" : "20px",
                            }}
                          />
                        )}
                      </Box>
                    </ExpireTrigger>

                    <Popover
                      anchorEl={expireAnchorEl.current}
                      open={expireOpen}
                      onClose={handleExpireClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      PaperProps={{
                        sx: {
                          mt: "-1px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          width:
                            expireTriggerRef.current?.offsetWidth || "auto",
                          border: `1px solid ${theme.palette.border.main}`,
                          borderTop: "none",
                          maxHeight: "200px",
                          backgroundColor: theme.palette.common.white,
                        },
                      }}
                    >
                      <ExpireDropdown>
                        {["no", "yes"].map((option) => (
                          <ListItemButton
                            key={option}
                            onClick={() => handleExpireSelect(option)}
                            selected={paymentSettings.expire === option}
                            sx={{
                              borderRadius: "8px",
                              p: 1,
                              minHeight: "40px",
                              background:
                                paymentSettings.expire === option
                                  ? theme.palette.primary.light
                                  : "transparent",
                              "&:hover": {
                                background: theme.palette.primary.light,
                              },
                              "&.Mui-selected": {
                                background: theme.palette.primary.light,
                                "&:hover": {
                                  background: theme.palette.primary.light,
                                },
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                option === "no"
                                  ? tPaymentLink("no")
                                  : option === "yes"
                                    ? tPaymentLink("yes")
                                    : option.charAt(0).toUpperCase() + option.slice(1)
                              }
                              primaryTypographyProps={{
                                sx: {
                                  fontFamily: "UrbanistMedium",
                                  fontWeight: 500,
                                  fontSize: isMobile ? "13px" : "15px",
                                  color: theme.palette.text.primary,
                                  lineHeight: "1",
                                  textTransform: "capitalize",
                                },
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </ExpireDropdown>
                    </Popover>
                  </Box>
                </Box>

                <Box>
                  <PaymentSettingsLabel>
                    <Image
                      src={PaymentIcon}
                      alt="blockchain fees"
                      draggable={false}
                    />
                    <span>{tPaymentLink("blockchainFeesPaidBy")}</span>
                  </PaymentSettingsLabel>
                  <Box sx={{ marginTop: { xs: "8px", md: "16px" } }}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={blockchainFees}
                        onChange={(e) =>
                          handleBlockchainFeesChange(e.target.value)
                        }
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: { xs: "13px", md: "15px" },
                            fontFamily: "UrbanistRegular",
                            color: theme.palette.text.primary,
                            paddingLeft: "8px",
                            lineHeight: 1.2,
                          },
                          gap: { xs: "6px", md: "8px" },
                        }}
                      >
                        <FormControlLabel
                          value="customer"
                          control={<CustomRadio />}
                          label={tPaymentLink("customerFeesAdded")}
                          sx={{ margin: "0px" }}
                        />
                        <FormControlLabel
                          value="company"
                          control={<CustomRadio />}
                          label={tPaymentLink("companyPaysFees")}
                          sx={{ margin: "0px" }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <InputField
                  label={
                    <PaymentSettingsLabel>
                      <Image src={NoteIcon} alt="note" draggable={false} />
                      <span>{tPaymentLink("description")}</span>
                    </PaymentSettingsLabel>
                  }
                  value={paymentSettings.description}
                  onChange={(e) =>
                    handlePaymentSettingsChange("description", e.target.value)
                  }
                  onBlur={() => handlePaymentSettingsBlur("description")}
                  error={
                    paymentSettingsTouched.description &&
                    Boolean(paymentSettingsErrors.description)
                  }
                  helperText={
                    paymentSettingsTouched.description &&
                      paymentSettingsErrors.description
                      ? paymentSettingsErrors.description
                      : undefined
                  }
                  maxLength={500}
                  sx={{
                    width: "100%",
                  }}
                  multiline={true}
                  minRows={isMobile ? 4 : 9}
                />
              </Box>
            </Box>
            <Box>
              <CustomButton
                label={tPaymentLink("createPayment")}
                variant="primary"
                size="medium"
                fullWidth={true}
                onClick={handleCreatePaymentLink}
                disabled={
                  Boolean(paymentSettingsErrors.value) ||
                  Boolean(paymentSettingsErrors.description) ||
                  !paymentSettings.value ||
                  paymentSettings.value.trim() === ""
                }
                sx={{
                  [theme.breakpoints.down("md")]: {
                    height: "32px",
                    fontSize: "13px",
                  },
                }}
              />
            </Box>
          </TabContentContainer>
        )}
        {activeTab === 1 && (
          <TabContentContainer>
            <InputField
              label={tPaymentLink("callbackUrl")}
              placeholder={tPaymentLink("callbackUrlPlaceholder")}
              value={postPaymentSettings.callbackUrl}
              onChange={(e) =>
                handlePostPaymentSettingsChange("callbackUrl", e.target.value)
              }
              helperText={tPaymentLink("callbackUrlHelper")}
              type="url"
              sx={{
                width: "100%",
              }}
            />
            <InputField
              label={tPaymentLink("redirectUrl")}
              placeholder={tPaymentLink("redirectUrlPlaceholder")}
              value={postPaymentSettings.redirectUrl}
              onChange={(e) =>
                handlePostPaymentSettingsChange("redirectUrl", e.target.value)
              }
              helperText={tPaymentLink("redirectUrlHelper")}
              type="url"
              sx={{
                width: "100%",
              }}
            />
            <InputField
              label={tPaymentLink("webhookUrl")}
              placeholder={tPaymentLink("webhookUrlPlaceholder")}
              value={postPaymentSettings.webhookUrl}
              onChange={(e) =>
                handlePostPaymentSettingsChange("webhookUrl", e.target.value)
              }
              helperText={tPaymentLink("webhookUrlHelper")}
              type="url"
              sx={{
                width: "100%",
              }}
            />
            <Box>
              <CustomButton
                label={tPaymentLink("createPayment")}
                variant="primary"
                size="medium"
                fullWidth={true}
                onClick={handleCreatePaymentLink}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    height: "32px",
                    fontSize: "13px",
                  },
                }}
              />
            </Box>
          </TabContentContainer>
        )}
      </PanelCard>
    </div>
  );
};

export default CreatePaymentLinkPage;
