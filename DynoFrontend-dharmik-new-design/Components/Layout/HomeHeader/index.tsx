import { useState, useEffect, useRef } from "react";
import { Box, Button, Divider, IconButton, Drawer } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import DynopayLogo from "@/assets/Images/auth/dynopay-logo.svg";
import CloseIcon from "@/assets/Icons/close-icon.svg";
import {
  HeaderContainer,
  NavLinks,
  Actions,
  MobileMenuButton,
  MobileDrawer,
  MobileNavItem,
} from "./styled";
import { homeTheme } from "@/styles/homeTheme";
import useIsMobile from "@/hooks/useIsMobile";
import HomeButton from "../HomeButton";
import { theme } from "@/styles/theme";
import { MenuRounded } from "@mui/icons-material";

const HomeHeader = () => {
  const router = useRouter();
  const isMobile = useIsMobile("md");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

  const HeaderItems = [
    { label: "How It Works", sectionId: "how-it-works", path: "/" },
    { label: "Features", sectionId: "features", path: "/" },
    { label: "Use Cases", sectionId: "use-cases", path: "/" },
    { label: "Documentation", path: "/" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (item: typeof HeaderItems[0]) => {
    if (item.sectionId) {
      // If we're not on the home page, navigate first then scroll
      if (router.pathname !== "/") {
        router.push("/").then(() => {
          // Wait for page to load, then scroll
          setTimeout(() => {
            scrollToSection(item.sectionId!);
          }, 100);
        });
      } else {
        scrollToSection(item.sectionId);
      }
    } else {
      router.push(item.path);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header at the top of the page
      if (currentScrollY < scrollThreshold) {
        setIsHeaderVisible(true);
      } else {
        // Determine scroll direction
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - show header
          setIsHeaderVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: "white",
        transform: isHeaderVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        width: "100%",
      }}
    >
      <HeaderContainer>
        {/* Logo */}
        <Image
          src={DynopayLogo}
          alt="Dynopay"
          width={134}
          height={45}
          draggable={false}
          className="logo"
          style={{ width: "134px", height: "45px" }}
          onClick={() => router.push("/")}
        />

        {/* Center Nav - Desktop Only */}
        <NavLinks className="desktop-nav">
          {HeaderItems.map((item) => (
            <Button disableRipple key={item.label} onClick={() => handleNavClick(item)}>
              {item.label}
            </Button>
          ))}
        </NavLinks>

        <Box sx={{ display: "flex", alignItems: "center", gap: "11px" }}>
          {/* Right Actions */}
          <Actions>
            <Button disableRipple className="signin" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>

            <HomeButton
              variant="primary"
              label="Get Started"
              onClick={() => router.push("/auth/register")}
              showIcon={false}
              sx={{
                borderRadius: "8px !important",
                padding: "8px 12px !important",
                minWidth: "98px !important",
              }}
            />
          </Actions>
          {/* Mobile Menu Button */}
          {isMobile && (
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <MenuRounded sx={{ color: theme.palette.text.primary, fontSize: 24 }} />
            </MobileMenuButton>
          )}
        </Box>
      </HeaderContainer>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "320px",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          },
        }}
      >
        <MobileDrawer>
          {/* Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px",
              flexShrink: 0,
            }}
          >
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                padding: "8px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Image
                src={CloseIcon}
                alt="Close"
                width={24}
                height={24}
                draggable={false}
              />
            </IconButton>
          </Box>

          {/* Mobile Nav Items - Scrollable */}
          <Box
            sx={{
              padding: "0 24px",
              marginTop: "32px",
              paddingBottom: "32px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {HeaderItems.map((item) => (
              <MobileNavItem
                key={item.label}
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </Box>
        </MobileDrawer>
      </Drawer>

      <Divider sx={{ borderColor: homeTheme.palette.border.main }} />
    </div>
  );
};

export default HomeHeader;
