import PanelCard from "@/Components/UI/PanelCard";
import CustomSwitch from "@/Components/UI/CustomSwitch";
import CustomButton from "@/Components/UI/Buttons";
import { theme } from "@/styles/theme";
import { Box, IconButton, Typography, Grid, Divider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

import BellIcon from "@/assets/Icons/bell-icon.svg";
import MobileIcon from "@/assets/Icons/mobile-icon.svg";
import EnvelopeIcon from "@/assets/Icons/envelope-icon.svg";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

interface NotificationItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showDivider?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  checked,
  onChange,
  showDivider = true,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "15px" },
              fontWeight: 700,
              fontFamily: "UrbanistBold",
              color: "#242428",
              mb: 0.5,
              lineHeight: "100%",
              letterSpacing: 0
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "15px" },
              fontFamily: "UrbanistMedium",
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        </Box>
        <CustomSwitch
          checked={checked}
          onChange={(e, checked) => onChange(checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
      </Box>
      {showDivider && (
        <Divider
          sx={{
            borderColor: theme.palette.border.main,
            my: 0,
          }}
        />
      )}
    </>
  );
};

const NotificationPage = () => {
  const namespaces = ["notifications"];
  const { t } = useTranslation(namespaces);
  const tNotifications = useCallback((key: string) => t(key, { ns: "notifications" }), [t]);

  // Transaction Alerts state
  const [transactionUpdates, setTransactionUpdates] = useState(true);
  const [paymentReceived, setPaymentReceived] = useState(false);

  // Weekly Reports state
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(false);

  // Email Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving notification preferences...");
  };

  return (
    <Box>
      <Grid container spacing={2.5}>
        {/* Left Column - Two Cards Stacked */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Transaction Alerts Card */}
            <PanelCard
              headerSx={{ fontSize: { xs: "15px", md: "20px" } }}
              subTitleSx={{ fontSize: { xs: "13px", md: "15px" } }}
              title={tNotifications("transactionAlertsTitle")}
              subTitle={tNotifications("transactionAlertsSubtitle")}
              showHeaderBorder={false}
              headerPadding={theme.spacing(2.5, 2.5, 0, 2.5)}
              bodyPadding={theme.spacing(0, 2.5, 2.5, 2.5)}
              headerAction={
                <IconButton
                  sx={{
                    padding: "8px",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Image
                    src={BellIcon.src}
                    alt="bell-icon"
                    width={20}
                    height={20}
                    draggable={false}
                  />
                </IconButton>
              }
              sx={{ height: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pt: { xs: 3, md: 5.5 },
                }}
              >
                <NotificationItem
                  title={tNotifications("transactionUpdatesTitle")}
                  description={tNotifications("transactionUpdatesDescription")}
                  checked={transactionUpdates}
                  onChange={setTransactionUpdates}
                />
                <NotificationItem
                  title={tNotifications("paymentReceivedTitle")}
                  description={tNotifications("paymentReceivedDescription")}
                  checked={paymentReceived}
                  onChange={setPaymentReceived}
                  showDivider={false}
                />
              </Box>
            </PanelCard>

            {/* Weekly Reports Card */}
            <PanelCard
              headerSx={{ fontSize: { xs: "15px", md: "20px" } }}
              title={tNotifications("weeklyReportsTitle")}
              subTitle={tNotifications("weeklyReportsSubtitle")}
              showHeaderBorder={false}
              headerPadding={theme.spacing(2.5, 2.5, 0, 2.5)}
              bodyPadding={theme.spacing(0, 2.5, 2.5, 2.5)}
              headerAction={
                <IconButton
                  sx={{
                    padding: "8px",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Image
                    src={MobileIcon.src}
                    alt="mobile-icon"
                    width={20}
                    height={20}
                    draggable={false}
                  />
                </IconButton>
              }
              sx={{ height: "100%" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: { xs: 3, md: 5.5 }, }}>
                <NotificationItem
                  title={tNotifications("weeklySummaryTitle")}
                  description={tNotifications("weeklySummaryDescription")}
                  checked={weeklySummary}
                  onChange={setWeeklySummary}
                />
                <NotificationItem
                  title={tNotifications("securityAlertsTitle")}
                  description={tNotifications("securityAlertsDescription")}
                  checked={securityAlerts}
                  onChange={setSecurityAlerts}
                  showDivider={false}
                />
              </Box>
            </PanelCard>
          </Box>
        </Grid>

        {/* Right Column - Single Taller Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <PanelCard
              headerSx={{ fontSize: { xs: "15px", md: "20px" } }}
              title={tNotifications("emailNotificationsCardTitle")}
              subTitle={tNotifications("emailNotificationsCardSubtitle")}
              showHeaderBorder={false}
              bodyPadding={theme.spacing(0, 2.5, 2.5, 2.5)}
              headerPadding={theme.spacing(2.5, 2.5, 0, 2.5)}
              headerAction={
                <IconButton
                  sx={{
                    padding: "8px",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Image
                    src={EnvelopeIcon.src}
                    alt="envelope-icon"
                    width={20}
                    height={20}
                    draggable={false}
                  />
                </IconButton>
              }
              sx={{ height: "fit-content" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: { xs: 3, md: 5.5 } }}>
                <NotificationItem
                  title={tNotifications("emailNotificationsTitle")}
                  description={tNotifications("emailNotificationsDescription")}
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <NotificationItem
                  title={tNotifications("smsNotificationsTitle")}
                  description={tNotifications("smsNotificationsDescription")}
                  checked={smsNotifications}
                  onChange={setSmsNotifications}
                />
                {/* Browser Notifications - Special Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, pr: 2 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "15px" },
                        fontWeight: 700,
                        fontFamily: "UrbanistMedium",
                        color: "#242428",
                        mb: 0.5,
                        lineHeight: "100%",
                        letterSpacing: 0
                      }}
                    >
                      {tNotifications("browserNotificationsTitle")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "15px" },
                        fontFamily: "UrbanistRegular",
                        color: theme.palette.text.secondary,
                        lineHeight: 1.5,
                      }}
                    >
                      {tNotifications("browserNotificationsDescription")}
                    </Typography>
                  </Box>
                  <CustomButton
                    label={tNotifications("activate")}
                    variant="secondary"
                    size="medium"
                    endIcon={
                      <Box>
                        <ArrowOutwardIcon />
                      </Box>
                    }
                    onClick={() => {
                      // TODO: Implement browser notification activation
                      console.log("Activating browser notifications...");
                    }}
                  />
                </Box>
              </Box>
            </PanelCard>

            <CustomButton
              label={tNotifications("saveChanges")}
              variant="primary"
              size="large"
              fullWidth
              onClick={handleSaveChanges}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationPage;
