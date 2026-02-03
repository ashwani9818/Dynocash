import React from "react";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { StyledHomeButton } from "./styled";
import { rootReducer } from "@/utils/types";
import { SxProps, Theme } from "@mui/material";

interface HomeButtonProps {
  variant?: "primary" | "outlined";
  label?: string;
  showIcon?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  navigateTo?: string;
  sx?: SxProps<Theme>;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  variant = "primary",
  label,
  showIcon,
  onClick,
  disabled = false,
  fullWidth = false,
  navigateTo,
  sx,
}) => {
  const router = useRouter();
  const userState = useSelector((state: rootReducer) => state.userReducer);

  // Default labels based on variant
  const defaultLabel =
    variant === "primary" ? "Start Accepting Crypto" : "Learn More";

  // Default icon visibility based on variant
  const defaultShowIcon = variant === "primary";

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // If navigateTo is provided, use it
    if (navigateTo) {
      router.push(navigateTo);
      return;
    }

    // Default navigation logic for primary variant
    if (variant === "primary") {
      const token = localStorage.getItem("token");
      const isLoggedIn = token;

      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  };

  return (
    <StyledHomeButton
      intent={variant}
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={sx}
    >
      {label || defaultLabel}
      {(showIcon !== undefined ? showIcon : defaultShowIcon) && (
        <ArrowForward sx={{ fontSize: 18 }} />
      )}
    </StyledHomeButton>
  );
};

export default HomeButton;
