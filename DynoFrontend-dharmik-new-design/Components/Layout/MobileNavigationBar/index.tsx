import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box, useTheme } from "@mui/material";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import DashboardIcon from "@/assets/Icons/dashboard-icon.svg";
import TransactionsIcon from "@/assets/Icons/transaction-icon.svg";
import WalletsIcon from "@/assets/Icons/wallet-icon.svg";
import APIIcon from "@/assets/Icons/key-icon.svg";
import NotificationsIcon from "@/assets/Icons/notification-icon.svg";
import i18n from "i18next";

import portugalFlag from "@/assets/Images/Icons/flags/portugal-flag.png";
import unitedStatesFlag from "@/assets/Images/Icons/flags/united-states-flag.png";
import franceFlag from "@/assets/Images/Icons/flags/france-flag.png";
import spainFlag from "@/assets/Images/Icons/flags/spain-flag.png";
import Link from "next/link";

import {
  NavigationBarContainer,
  NavigationBar,
  NavItem,
  IconButton,
  NavLabel,
  MainNavRow,
  FirstRow,
  SecondRow,
  AlertBanner,
  AlertText,
  ExpandedContent,
} from "./styled";
import { VerticalLine } from "@/Components/UI/LanguageSwitcher/styled";
import LanguageSwitcherModal from "@/Components/UI/MobileLanguageSwitcher";
import { useTranslation } from "react-i18next";
import SidebarIcon from "@/utils/customIcons/sidebar-icons";

const MobileNavigationBar = () => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation("dashboardLayout");
  const [isExpanded, setIsExpanded] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const navBarRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "pt", label: "Português", flag: portugalFlag },
    { code: "en", label: "English", flag: unitedStatesFlag },
    // { code: "fr", label: "Français", flag: franceFlag },
    // { code: "es", label: "Español", flag: spainFlag },
  ];

  // First row items (5 items)
  const firstRowItems = [
    { label: t("dash"), icon: "dashboard", path: "/dashboard", id: "dash" },
    {
      label: t("transactions"),
      icon: "transactions",
      path: "/transactions",
      id: "transactions",
    },
    { label: t("create"), icon: "add", path: "/create-pay-link", id: "create-pay-link" },
    { label: t("wallets"), icon: "wallets", path: "/wallet", id: "wallets" },
    {
      label: isExpanded ? t("close") : t("more"),
      icon: isExpanded ? "close" : "more",
      path: null,
      id: "more",
    },
  ];

  // Second row items (3 items) - shown when expanded
  const secondRowItems = [
    { label: t("language"), icon: "language", path: null, id: "language" },
    {
      label: t("payLinks"),
      icon: "payment-links",
      path: "/pay-links",
      id: "pay-links",
    },
    { label: t("api"), icon: "api", path: "/apis", id: "api" },
    {
      label: t("notifications"),
      icon: "notifications",
      path: "/notifications",
      id: "notifications",
    },
  ];

  const isActiveRoute = (path: string | null) => {
    if (!path) return false;
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  const handleNavClick = (
    item: (typeof firstRowItems)[0] | (typeof secondRowItems)[0]
  ) => {
    if (item.id === "more") {
      setIsExpanded(!isExpanded);
    } else if (item.path) {
      router.push(item.path);
      setIsExpanded(false);
    } else if (item.id === "language") {
      setOpenLang((prev) => !prev);
      // setIsExpanded(false);
    }
  };

  // Close expanded navigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        navBarRef.current &&
        !navBarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const renderIcon = (
    icon: string | any,
    active: boolean,
    isCreate = false
  ) => {
    if (typeof icon === "string") {
      switch (icon) {
        case "add":
          return (
            <AddIcon
              sx={{
                color: isCreate
                  ? theme.palette.primary.main
                  : active
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
              }}
            />
          );
        case "more":
          return <KeyboardArrowUpIcon />;
        case "close":
          return <KeyboardArrowDownIcon />;
        case "language":
          return <LanguageIcon />;
        default:
          return null;
      }
    }
    return <Image src={icon} width={20} height={20} alt="" draggable={false} />;
  };

  return (
    <NavigationBarContainer>
      <Box position="relative" ref={navBarRef}>
        <NavigationBar expanded={isExpanded}>
          <MainNavRow expanded={isExpanded}>
            {/* First row - 5 items */}
            <FirstRow>
              {firstRowItems.map((item) => {
                const active = isActiveRoute(item.path);
                const isCreate = item.id === "create";
                const supportedIcons = [
                  "dashboard",
                  "transactions",
                  "wallets",
                  "api",
                  "notifications",
                  "payment-links",
                ];
                const useSidebarIcon = supportedIcons.includes(item.icon);
                return (
                  <NavItem
                    key={item.id}
                    active={active}
                    onClick={() => handleNavClick(item)}
                  >
                    <IconButton active={active || isCreate}>
                      {useSidebarIcon ? (
                        <SidebarIcon
                          name={item.icon}
                          size={16}
                          color={
                            active
                              ? theme.palette.primary.main
                              : theme.palette.text.primary
                          }
                        />
                      ) : (
                        renderIcon(item.icon, active, isCreate)
                      )}
                    </IconButton>
                    <NavLabel active={active}>{item.label}</NavLabel>
                  </NavItem>
                );
              })}
            </FirstRow>

            {/* Second row - 3 items (shown when expanded, centered) */}
            {isExpanded && (
              <SecondRow>
                {secondRowItems.map((item) => {
                  const active = isActiveRoute(item.path);
                  const isCreate = item.id === "create";
                  const currentLang = i18n.language || "en";

                  return (
                    <NavItem
                      key={item.id}
                      active={active}
                      onClick={() => handleNavClick(item)}
                    >
                      <IconButton active={active || isCreate}>
                        {item.id === "language" ? (
                          <Box
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              fontFamily: "UrbanistMedium",
                              color: active
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                            }}
                          >
                            {currentLang.toUpperCase()}
                          </Box>
                        ) : (
                          <SidebarIcon
                            name={item.icon}
                            size={16}
                            color={
                              active
                                ? theme.palette.primary.main
                                : theme.palette.text.primary
                            }
                          />
                        )}
                      </IconButton>
                      <NavLabel active={active}>{item.label}</NavLabel>
                    </NavItem>
                  );
                })}
              </SecondRow>
            )}
          </MainNavRow>

          {/* <ExpandedContent isExpanding={isExpanded}>
            <AlertBanner>
              <ErrorIcon
                sx={{ color: theme.palette.error.main, fontSize: "20px" }}
              />
              <AlertText>{t("requiredKYC")}</AlertText>

              <VerticalLine />
              <ArrowOutwardIcon
                sx={{ color: theme.palette.text.secondary, fontSize: "16px" }}
              />
            </AlertBanner>
          </ExpandedContent> */}

          <ExpandedContent isExpanding={isExpanded}>
            <Link href='/wallet' onClick={() => setIsExpanded(false)}>
              <AlertBanner>
                <ErrorIcon
                  sx={{ color: theme.palette.error.main, fontSize: "20px" }}
                />
                <AlertText>{t("walletSetUpWarnnigTitle")}</AlertText>
              </AlertBanner>
            </Link>
          </ExpandedContent>
        </NavigationBar>

        <LanguageSwitcherModal
          open={openLang}
          languages={languages}
          currentLanguage={i18n.language || "en"}
          onSelect={(code: string) => {
            i18n.changeLanguage(code);
            localStorage.setItem("lang", code);
          }}
          onClose={() => setOpenLang(false)}
        />
      </Box>
    </NavigationBarContainer>
  );
};

export default MobileNavigationBar;
