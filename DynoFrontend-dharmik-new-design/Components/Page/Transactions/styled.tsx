import { theme } from "@/styles/theme";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TransactionsTableContainer = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "14px",
  overflow: "hidden",
  minHeight: 0,
  ["@media (max-width:960px)"]: {
    height: "auto",
  },
});

export const TransactionsTableScrollWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "none",
  "-ms-overflow-style": "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
  [theme.breakpoints.down("md")]: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  [theme.breakpoints.down("sm")]: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  [theme.breakpoints.down("xs")]: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
}));

export const TransactionsTableHeader = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gridAutoColumns: "minmax(0, 1fr)",
  alignItems: "center",
  padding: "19px 20px",
  backgroundColor: theme.palette.primary.light,
  borderRadius: "14px 14px 0 0",
  gap: "16px",
  minWidth: "max-content",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns:
      "minmax(120px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr)",
    padding: "15px 12px",
    gap: "12px",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns:
      "minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr) minmax(80px, 1fr)",
    padding: "12px 10px",
    gap: "10px",
  },
  [theme.breakpoints.down("xs")]: {
    gridTemplateColumns:
      "minmax(90px, 1fr) minmax(70px, 1fr) minmax(70px, 1fr) minmax(70px, 1fr) minmax(100px, 1fr) minmax(70px, 1fr)",
    padding: "10px 8px",
    gap: "8px",
  },
}));

export const TransactionsTableHeaderItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  minWidth: "180px",
  gap: 10,
  "& span": {
    fontSize: "15px",
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontFamily: "UrbanistMedium",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  "& img": {
    width: "16px",
    height: "16px",
    objectFit: "contain",
    objectPosition: "center",
    flexShrink: 0,
  },
  [theme.breakpoints.down("md")]: {
    minWidth: "180px",
    gap: 8,
    "& span": {
      fontSize: "10px",
    },
    "& img": {
      width: "14px",
      height: "11px",
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "110px",
    gap: 6,
    "& span": {
      fontSize: "11px",
    },
    "& img": {
      width: "12px",
      height: "10px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    gap: 6,
    "& span": {
      fontSize: "10px",
    },
    "& img": {
      width: "10px",
      height: "10px",
    },
  },
}));

export const TransactionsTableBody = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "0 20px",
  minWidth: "max-content",
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  [theme.breakpoints.down("md")]: {
    padding: "0 12px",
  },
}));

export const TransactionsTableRow = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gridAutoColumns: "minmax(0, 1fr)",
  alignItems: "center",
  padding: "11px 0",
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: "16px",
  minWidth: "max-content",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns:
      "minmax(120px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr)",
    gap: "12px",
    padding: "8px 0",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns:
      "minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr) minmax(80px, 1fr)",
    gap: "10px",
    padding: "6px 0",
  },
  [theme.breakpoints.down("xs")]: {
    gridTemplateColumns:
      "minmax(90px, 1fr) minmax(70px, 1fr) minmax(70px, 1fr) minmax(70px, 1fr) minmax(100px, 1fr) minmax(70px, 1fr)",
    gap: "8px",
    padding: "4px 0",
  },
  //   "&:last-child": {
  //     borderBottom: "none",
  //   },
}));

export const TransactionsTableCell = styled(Typography)(({ theme }) => ({
  fontSize: "15px",
  fontWeight: 500,
  maxWidth: "180px",
  minWidth: 0,
  color: theme.palette.text.primary,
  fontFamily: "UrbanistMedium",
  lineHeight: "100%",
  letterSpacing: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("md")]: {
    fontSize: "13px",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "110px",
    fontSize: "12px",
    lineHeight: "14px",
  },
  [theme.breakpoints.down("xs")]: {
    maxWidth: "90px",
    fontSize: "11px",
    lineHeight: "12px",
  },
}));

export const TransactionsTableFooter = styled(Box)(({ theme }) => ({
  width: "100%",
  // Removed height: "100%" to prevent layout stretching
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px 20px 24px",
  flexShrink: 0,
  minHeight: "max-content",
  [theme.breakpoints.down("md")]: {
    padding: "12px 12px 16px 12px",
    flexWrap: "wrap",
    gap: "8px",
  },
}));

export const TransactionsTableFooterText = styled(Typography)({
  fontSize: "13px",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  fontFamily: "UrbanistMedium",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "10px",
    lineHeight: "12px",
  },
});

export const StatusBadge = styled(Box)<{
  status: "done" | "pending" | "failed";
}>(({ theme, status }) => {
  const statusColors = {
    done: {
      bg: "#EAFFF0",
      border: "#DCF6E4",
    },
    pending: {
      bg: "#FFEDD7",
      border: "#FFE3C0",
    },
    failed: {
      bg: "#FFEBE5",
      border: "#FFC9CA",
    },
  };

  const colors = statusColors[status];

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 9px",
    borderRadius: "100px",
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "UrbanistMedium",
    width: "fit-content",
    [theme.breakpoints.down("md")]: {
      padding: "5px 9px",
    },
  };
});

export const StatusIconWrapper = styled(Box)<{
  status: "done" | "pending" | "failed";
}>(({ status, theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,

    "& img": {
      width: "14px",
      height: "14px",
      [theme.breakpoints.down("md")]: {
        width: "12px",
        height: "12px",
      },
    },
  };
});

export const StatusText = styled(Typography)<{
  status: "done" | "pending" | "failed";
}>(({ status, theme }) => {
  const statusColors = {
    done: {
      textColor: "#47B464",
    },
    pending: {
      textColor: "#F7931A",
    },
    failed: {
      textColor: "#E8484A",
    },
  };

  return {
    fontSize: "13px",
    fontWeight: 500,
    color: statusColors[status].textColor,
    fontFamily: "UrbanistMedium",
    textTransform: "capitalize",
    lineHeight: "16px",
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
      lineHeight: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
      lineHeight: "12px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
      lineHeight: "10px",
    },
  };
});

export const CryptoIconChip = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "7px 9px",
  borderRadius: "999px",
  background: theme.palette.secondary.light,
  fontFamily: "UrbanistMedium",
  fontSize: "13px",
  fontWeight: 500,
  color: theme.palette.text.primary,
  flexShrink: 0,
  border: `1px solid ${theme.palette.border.main}`,

  [theme.breakpoints.down("md")]: {
    padding: "5px 8px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "4px 6px",
  },

  "& span": {
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "UrbanistMedium",
    lineHeight: "18px",
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
      lineHeight: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
      lineHeight: "12px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
      lineHeight: "10px",
    },
  },

  "& img": {
    width: "20px",
    height: "20px",
    objectFit: "contain",
    objectPosition: "center",
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      width: "14px",
      height: "14px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "12px",
      height: "12px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "10px",
      height: "10px",
    },
  },
});

export const MobileNavigationButtons = styled(Button)(({ theme }) => ({
  display: "none",
  width: "28px",
  height: "28px",
  padding: "0",
  minWidth: "28px",
  borderRadius: "8px",
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.border.main}`,
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    border: `1px solid ${theme.palette.border.main}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.border.main}`,
    color: theme.palette.text.secondary,
    opacity: 0.5,
    cursor: "not-allowed",
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const TransactionsTopBarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "12px",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
  },
  [theme.breakpoints.down("md")]: {
    gap: "8px",
  },
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("md")]: {
    flex: 1,
    minWidth: "250px",
  },
  [theme.breakpoints.down("md")]: {
    gap: "8px",
  },
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
  flex: 1,
  [theme.breakpoints.down("md")]: {
    flexWrap: "wrap",
    gap: "8px",
  },
}));

export const DatePickerWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  flex: 1,
  minWidth: "fit-content",
  [theme.breakpoints.up("md")]: {
    // maxWidth: "200px",
  },
}));

export const WalletSelectorWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  flex: 1,
  minWidth: "fit-content",
  [theme.breakpoints.up("md")]: {
    // maxWidth: "200px",
  },
}));

export const ExportButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
}));

export const DatePickerTriggerButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "9px 16px",
  borderRadius: "6px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "UrbanistMedium",
  color: theme.palette.text.primary,
  backgroundColor: "#FFFFFF",
  border: `1px solid ${theme.palette.border.main}`,
  justifyContent: "space-between",
  whiteSpace: "nowrap",
  width: "100%",
  height: "40px",
  "&:hover": {
    backgroundColor: "#F5F5F5",
    borderColor: theme.palette.border.focus,
  },
  "&:focus": {
    borderColor: theme.palette.border.focus,
  },
  "& .calendar-icon": {
    fontSize: "18px",
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  "& .date-text": {
    flex: 1,
    textAlign: "left",
    fontSize: "14px",
    fontFamily: "UrbanistMedium",
    color: theme.palette.text.secondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .separator": {
    width: "1px",
    height: "20px",
    backgroundColor: theme.palette.border.main,
    flexShrink: 0,
  },
  "& .arrow-icon": {
    fontSize: "16px",
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  [theme.breakpoints.up("md")]: {
    minWidth: "200px",
  },
  [theme.breakpoints.down("md")]: {
    padding: "8px 10px",
    height: "32px",
    gap: "6px",
    minWidth: "fit-content",
    "& .separator": {
      height: "16px",
    },
    "& .arrow-icon": {
      fontSize: "14px",
    },
  },
}));

export const WalletSelectorButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "9px 16px",
  borderRadius: "6px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "UrbanistMedium",
  color: theme.palette.text.primary,
  backgroundColor: "#FFFFFF",
  border: `1px solid ${theme.palette.border.main}`,
  justifyContent: "space-between",
  whiteSpace: "nowrap",
  width: "100%",
  height: "40px",
  "&:hover": {
    backgroundColor: "#F5F5F5",
    borderColor: theme.palette.border.focus,
  },
  "&:focus": {
    borderColor: theme.palette.border.focus,
  },
  "& .wallet-icon": {
    fontSize: "18px",
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  "& .wallet-text": {
    flex: 1,
    textAlign: "left",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: "UrbanistMedium",
    color: theme.palette.text.primary,
    lineHeight: "18px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
      lineHeight: "16px",
    },
  },
  "& .separator": {
    width: "1px",
    height: "20px",
    backgroundColor: theme.palette.border.main,
    flexShrink: 0,
  },
  "& .arrow-icon": {
    fontSize: "16px",
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  [theme.breakpoints.up("md")]: {
    minWidth: "200px",
  },
  [theme.breakpoints.down("md")]: {
    padding: "8px 10px",
    height: "32px",
    gap: "6px",
    minWidth: "fit-content",
    "& .separator": {
      height: "16px",
    },
    "& .arrow-icon": {
      fontSize: "14px",
    },
  },
}));

export const SearchIconButton = styled(IconButton)(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "& img": {
    width: "17px",
    height: "17px",
    objectFit: "contain",
    objectPosition: "center",
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      width: "12px",
      height: "12px",
    },
  },
  [theme.breakpoints.down("md")]: {
    width: "32px",
    height: "32px",
  },
}));
