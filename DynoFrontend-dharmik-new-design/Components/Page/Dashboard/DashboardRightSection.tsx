import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowOutward } from "@mui/icons-material";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import PanelCard from "@/Components/UI/PanelCard";
import CustomButton from "@/Components/UI/Buttons";
import FeeTierProgress from "./FeeTierProgress";
import ReferralAndKnowledge from "@/Components/Layout/ReferralAndKnowledge";

import useIsMobile from "@/hooks/useIsMobile";
import { theme } from "@/styles/theme";
import { formatNumberWithComma, getCurrencySymbol } from "@/helpers";

import CurrencyIcon from "@/assets/Icons/dollar-sign-icon.svg";
import CheckCircleIcon from "@/assets/Icons/correct-icon.png";
import CrownIcon from "@/assets/Icons/premium-icon.svg";
import BgMobileImage from "@/assets/Images/premium-card-bg.png";
import BgDesktopImage from "@/assets/Images/bg-white.png"

import { PremiumTierCard } from "./styled";

const DEFAULT_MONTHLY_LIMIT = 50000;
const DEFAULT_USED_AMOUNT = 6479.25;
const CURRENT_TIER = "Standard";

const DashboardRightSection = () => {
  const muiTheme = useTheme();
  const isMobile = useIsMobile("md");

  const { t } = useTranslation(["dashboardLayout", "common"]);
  const tDashboard = useCallback(
    (key: string) => t(key, { ns: "dashboardLayout" }),
    [t]
  );

  const [monthlyLimit] = useState(DEFAULT_MONTHLY_LIMIT);
  const [usedAmount, setUsedAmount] = useState(DEFAULT_USED_AMOUNT);

  // Prevent overflow beyond limit
  useEffect(() => {
    if (usedAmount > monthlyLimit) {
      setUsedAmount(monthlyLimit);
    }
  }, [usedAmount, monthlyLimit]);

  return (
    <Box>
      <PanelCard
        title={tDashboard("feeTierProgress")}
        subTitle={tDashboard("yourProgressTowardsTheNextFeeTier")}
        showHeaderBorder={false}
        headerPadding={theme.spacing(2.5, 1.5, 0, 2.5)}
        bodyPadding={isMobile ? theme.spacing("12px", 2, 2, 2) : theme.spacing("26px", 2.5, 2.5, 2.5)}
        headerActionLayout="inline"
        headerSx={{ alignItems: "start" }}
        headerAction={
          <IconButton
            sx={{
              backgroundColor: "#E9ECF2",
              p: "8px",
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <Image
              src={CurrencyIcon}
              alt="Currency"
              width={18}
              height={18}
              draggable={false}
              style={{ width: "clamp(14px, 2vw, 18px)", height: "auto" }}
            />
          </IconButton>
        }
      >
        <Box>
          {/* Monthly Volume */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? 10 : 13,
                color: muiTheme.palette.text.secondary,
                fontFamily: "UrbanistMedium",
                fontWeight: 500,
              }}
            >
              {tDashboard("monthlyVolume")}
            </Typography>

            <Typography sx={{ fontFamily: "UrbanistMedium" }}>
              <Box
                component="span"
                sx={{
                  fontSize: isMobile ? 13 : 15,
                  color: muiTheme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                {getCurrencySymbol(
                  "USD",
                  formatNumberWithComma(usedAmount)
                )}
              </Box>
              <Box
                component="span"
                sx={{
                  px: "6px",
                  fontSize: isMobile ? 10 : 13,
                  color: muiTheme.palette.text.secondary,
                }}
              >
                /
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: isMobile ? 10 : 13,
                  color: muiTheme.palette.text.secondary,
                }}
              >
                {getCurrencySymbol(
                  "USD",
                  monthlyLimit.toLocaleString()
                )}
              </Box>
            </Typography>
          </Box>

          {/* Progress */}
          <FeeTierProgress
            monthlyLimit={monthlyLimit}
            usedAmount={usedAmount}
            currentTier={CURRENT_TIER}
          />

          {/* Current Tier Badge */}
          <Box
            sx={{
              mt: 2,
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              px: 1.5,
              py: 1.4,
              borderRadius: "100px",
              background: theme.palette.success.main,
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? 13 : 15,
                fontWeight: 500,
                color: theme.palette.success.dark,
                fontFamily: "UrbanistMedium",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {tDashboard("currentTier")}:
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Image
                  src={CheckCircleIcon}
                  alt="Active Tier"
                  width={16}
                  height={16}
                  draggable={false}
                />
                {CURRENT_TIER}
              </Box>
            </Typography>
          </Box>

          {/* Premium Upgrade Card */}
          <PremiumTierCard sx={{ mt: isMobile ? 1.5 : 2, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                top: "6px",
                left: "-10px",
                zIndex: -1,
                maxWidth: 310,
              }}
            >
              <Image
                src={isMobile ? BgMobileImage : BgDesktopImage}
                alt="Background"
                fill
                draggable={false}
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: isMobile ? 13 : 15,
                    fontWeight: 500,
                    fontFamily: "UrbanistMedium",
                    lineHeight: "1.2",
                    letterSpacing: "0",
                    wordBreak: "break-all"
                  }}
                >
                  {tDashboard("upgradeToPremiumTier")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: isMobile ? 10 : 13,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    fontFamily: "UrbanistMedium",
                    mt: isMobile ? 0.75 : 1.5,
                    lineHeight: "1.2",
                    letterSpacing: "0",
                    wordBreak: "break-all"
                  }}
                >
                  {tDashboard("lowerFeesAndPrioritySupport")}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  right: isMobile ? "6px" : "24px",
                  top: isMobile ? "6px" : "24px",
                  width: isMobile ? 32 : 49,
                  height: isMobile ? 32 : 49,
                  border: `1px solid ${theme.palette.border.main}`,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={CrownIcon}
                  alt="Premium"
                  width={isMobile ? 14 : 18}
                  height={isMobile ? 12 : 18}
                  draggable={false}
                />
              </Box>
            </Box>

            <Box mt={2.5}>
              <CustomButton
                label={tDashboard("learnMore")}
                variant="secondary"
                size={isMobile ? "small" : "medium"}
                endIcon={<ArrowOutward sx={{ fontSize: 16 }} />}
                fullWidth
              />
            </Box>
          </PremiumTierCard>
        </Box>
      </PanelCard>

      {isMobile && (
        <Box mt={2}>
          <ReferralAndKnowledge isMobile />
        </Box>
      )}
    </Box>
  );
};

export default DashboardRightSection;
