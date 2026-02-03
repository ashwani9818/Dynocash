import { styled } from "@mui/material";

export const SelectorTrigger = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "9px 12px",
  borderRadius: "6px",
  border: "1px solid ",
  borderColor: theme?.palette?.border?.main,
  cursor: "pointer",
  background: "white",
  color: theme?.palette?.text?.primary,
  [theme.breakpoints.down("md")]: {
    padding: "0px",
    gap: "8px",
    border: "none",
  },
}));

export const TriggerText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  whiteSpace: "nowrap",
  fontSize: "15px",
  fontFamily: "UrbanistMedium",
  [theme.breakpoints.down("md")]: {
    fontSize: "13px",
  },
}));

export const CompanyListWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginTop: "6px",
}));

export const CompanyItem = styled("div")<{ active: boolean }>(
  ({ active, theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    maxHeight: "50px",
    background: active ? theme.palette.primary.light : "transparent",
    transition: "0.2s ease-in-out",
    fontFamily: "UrbanistMedium",
    lineHeight: "1.2",
    letterSpacing: "0",

    "&:hover": {
      background: "#eef2ff",
    },

    ".info": {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },

    ".name": {
      fontSize: "15px",
      fontWeight: 500,
      color: theme.palette.text.primary,
      [theme.breakpoints.down("md")]: {
        fontSize: "13px",
      },
    },

    ".email": {
      fontSize: "13px",
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("md")]: {
        fontSize: "10px",
      },
    },
  })
);

export const ItemLeft = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

export const ItemRight = styled("div")<{ active: boolean }>(
  ({ active, theme }) => ({
    background: active ? theme.palette.primary.light : "transparent",
    border: active ? "1px solid #fff" : "1px solid #d1d5db",
    display: "flex",
    width: "40px",
    height: "40px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.15s ease-in-out",

    "&:hover": {
      background: active ? theme.palette.primary.light : "#f4f6f9",
      borderColor: theme.palette.primary.main,

      "& img": {
        filter: "brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7151%) hue-rotate(240deg) brightness(101%) contrast(150%)",
      },
    },
    [theme.breakpoints.down("md")]: {
      width: "32px",
      height: "32px",
    },
  })
);
