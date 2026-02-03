import { homeTheme } from "@/styles/homeTheme";
import { Button, styled, keyframes } from "@mui/material";

const bounceUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

export const StyledHomeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "intent",
})<{ intent?: "primary" | "outlined" }>(
  ({ theme, intent = "primary" }) => ({
    padding: "12px 32px",
    fontSize: "14px",
    maxHeight: "44px",
    lineHeight: "20px",
    fontWeight: 500,
    fontFamily: "OutfitMedium",
    borderRadius: "10px !important",
    letterSpacing: "0px !important",
    textTransform: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "none",
    transition: "all 0.3s ease",
    ...(intent === "primary"
      ? {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        "& .MuiSvgIcon-root": {
          animation: `${bounceUpDown} 1.5s ease-in-out infinite`,
          transition: "transform 0.3s ease",
        },
        "&:hover": {
          backgroundColor: "#0004FF99",
          boxShadow: "none",
          "& .MuiSvgIcon-root": {
            animation: "none",
            transform: "translateX(4px)",
          },
        },
        "&:active": {
          backgroundColor: theme.palette.primary.main,
          "& .MuiSvgIcon-root": {
            animation: "none",
            transform: "translateX(2px)",
          },
        },
      }
      : {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.border.main}`,
        "&:hover": {
          backgroundColor: theme.palette.common.white,
          borderColor: homeTheme.palette.text.primary,
          color: homeTheme.palette.text.primary,
          boxShadow: "none",
        },
        "&:active": {
          backgroundColor: theme.palette.common.white,
        },
      }),
  }));
