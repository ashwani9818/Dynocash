import { styled } from "@mui/material";

export const HeaderContainer = styled("div")(({ theme }) => ({
  top: 0,
  zIndex: 999,
  width: "100%",
  boxShadow: "none",
  background: "transparent",
  // display: "flex",
  // flexDirection: "row",
  // color: theme.palette.primary.main,
  // [theme.breakpoints.down("sm")]: {
  //   width: "100vw",
  // },
  // gap: "20px",
}));

export const LogoContainer = styled("div")(({ theme }) => ({
  background: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  padding: "9px 24px 8px ",
  borderRadius: "14px",
  outline: "1px solid ",
  outlineColor: theme?.palette?.border?.main,

  ".logo": {
    cursor: "pointer",
    userSelect: "none",
  },
}));

export const MainContainer = styled("div")(({ theme }) => ({
  background: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "14px",
  gap: "10px",
  padding: "6px 8px",
  outline: "1px solid",
  outlineColor: theme?.palette?.border?.main,

  [theme.breakpoints.down("md")]: {
    padding: "8px 10px",
  },
}));

export const RightSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
}));

export const RequiredKYC = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "9px 12px",
  borderRadius: "6px",
  border: "1px solid",
  cursor: "pointer",
  background: "white",
  color: theme?.palette?.border?.main,
}));

export const RequiredKYCText = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  paddingLeft: "4px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  fontSize: "15px",
  lineHeight: "1.2",
  letterSpacing: "0",
  fontFamily: "UrbanistMedium",
}));
