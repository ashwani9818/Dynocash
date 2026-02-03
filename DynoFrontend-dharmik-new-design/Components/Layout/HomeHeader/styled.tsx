import { homeTheme } from "@/styles/homeTheme";
import { styled, IconButton } from "@mui/material";

export const HeaderContainer = styled("nav")(({ theme }) => ({
  height: 64,
  padding: "0 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  maxWidth: 1280,
  margin: "0 auto",

  [theme.breakpoints.down("md")]: {
    padding: "0 16px",
  },

  ".logo": {
    cursor: "pointer",
    userSelect: "none",
    [theme.breakpoints.down("md")]: {
      width: "100px",
      height: "auto",
    },
  },
}));

export const NavLinks = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 24,
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },

  button: {
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    fontFamily: "OutfitRegular",
    color: homeTheme.palette.text.secondary,
    padding: 0,

    "&:hover": {
      background: "transparent",
      color: homeTheme.palette.primary.main,
    },
  },
}));

export const Actions = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",

  ".signin": {
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: homeTheme.palette.text.primary,
    lineHeight: "20px",
    fontFamily: "OutfitMedium",
    whiteSpace: "nowrap",

    // [theme.breakpoints.down("md")]: {
    //   fontSize: "13px",
    //   padding: "6px 8px",
    // },

    // [theme.breakpoints.down("sm")]: {
    //   fontSize: "12px",
    //   padding: "4px 6px",
    // },

    "&:hover": {
      background: "transparent",
      color: homeTheme.palette.primary.main,
    },
  },
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  padding: "0px",
}));

export const MobileDrawer = styled("div")({
  height: "100%",
  backgroundColor: "#fafafa",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

export const MobileNavItem = styled("div")(({ theme }) => ({
  padding: "16px 0",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  fontFamily: "OutfitRegular",
  color: homeTheme.palette.text.primary,
  cursor: "pointer",
  borderBottom: `1px solid ${homeTheme.palette.border.main}`,
  transition: "color 0.2s ease",

  "&:hover": {
    color: homeTheme.palette.primary.main,
  },

  "&:last-child": {
    borderBottom: "none",
  },
}));
