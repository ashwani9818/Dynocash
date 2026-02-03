import { useState, useEffect } from "react";
import { Popover, useTheme, Box, Typography } from "@mui/material";
import { UserTrigger, UserName, PopWrapper, MenuItemRow } from "./styled";

import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SettingsIcon from "@mui/icons-material/Settings";
import useTokenData from "@/hooks/useTokenData";
import { VerticalLine } from "../LanguageSwitcher/styled";
import { useRouter } from "next/router";
import useWindow from "@/hooks/useWindow";
import CustomButton from "../Buttons";
import { useTranslation } from "react-i18next";
import LogoutIcon from "@/assets/Icons/logout-icon.svg";
import useIsMobile from "@/hooks/useIsMobile";
import { getInitials } from "@/helpers";

export default function UserMenu() {
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imageError, setImageError] = useState(false);

  const triggerWidth = anchorEl?.clientWidth || 180;
  const tokenData = useTokenData();
  const router = useRouter();
  const customWindow = useWindow();
  const { t } = useTranslation("dashboardLayout");

  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    if (customWindow) {
      customWindow.localStorage.removeItem("token");
      customWindow.location.replace("/auth/login");
    }
  };

  // Safely get firstName, handle cases where name might be undefined
  const firstName = tokenData?.name?.split(" ")[0] || "";
  const lastName = tokenData?.name?.split(" ")[1] || "";
  const userName = tokenData?.name || "";
  const userPhoto = tokenData?.photo || "";

  // Reset error state when photo changes
  useEffect(() => {
    setImageError(false);
  }, [userPhoto]);

  return (
    <>
      {/* Trigger */}
      <UserTrigger onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              position: "relative",
              width: isMobile ? 24 : 32,
              height: isMobile ? 24 : 32,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                userPhoto && !imageError
                  ? "transparent"
                  : theme.palette.primary.light,
              flexShrink: 0,
            }}
          >
            {userPhoto && !imageError ? (
              <Image
                src={userPhoto as string}
                alt="user"
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                draggable={false}
                onError={() => setImageError(true)}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light,
                  fontFamily: "UrbanistMedium",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {getInitials(firstName, lastName)}
              </Typography>
            )}
          </Box>

          <UserName sx={{ fontSize: isMobile ? 13 : 15 }}>
            {isMobile ? firstName || "User" : userName || "User"}
          </UserName>
        </Box>

        <VerticalLine />
        {anchorEl ? (
          <ExpandLessIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        ) : (
          <ExpandMoreIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        )}
      </UserTrigger>

      {/* Popover */}
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isMobile ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isMobile ? "right" : "left",
        }}
        PaperProps={{
          sx: {
            width: isMobile ? 'fit-content' : triggerWidth,
            border: "1px solid #E9ECF2",
            borderRadius: "8px",
            boxShadow: "0 4px 16px 0 rgba(47, 47, 101, 0.15)",
            overflow: "hidden",
          },
        }}
      >
        <PopWrapper>
          {/* Settings */}
          <MenuItemRow
            onClick={() => {
              router.push("/profile");
              closeMenu();
            }}
            sx={{
              gap: isMobile ? "6px" : "8px",
              paddingY: 0,
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                background: "transparent",
              },
            }}
          >
            <SettingsIcon sx={{ fontSize: isMobile ? "16px" : "16px" }} />
            <span style={{ fontFamily: "UrbanistMedium", lineHeight: "1.2", letterSpacing: "0", fontSize: isMobile ? "13px" : "15px" }}>
              {t("settings")}
            </span>
          </MenuItemRow>

          <Box mt={isMobile ? 1.5 : 2}>
            <CustomButton
              label={t("logout")}
              onClick={handleLogout}
              variant="secondary"
              endIcon={
                <Image
                  src={LogoutIcon}
                  alt="logout"
                  width={10}
                  height={10}
                  draggable={false}
                />
              }
              sx={{ padding: "8px 34px", height: isMobile ? "32px" : "40px" }}
              fullWidth
            // size="medium"
            />
          </Box>
        </PopWrapper>
      </Popover>
    </>
  );
}
