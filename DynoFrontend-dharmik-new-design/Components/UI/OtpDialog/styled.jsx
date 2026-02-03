import { IconButton, styled, Typography } from "@mui/material";

export const DialogCloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: -24,
  right: -24,
  zIndex: 1,
  height: "40px",
  width: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: "50%",
  border: `1px solid ${theme.palette.border.main}`,
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "32px",
    width: "32px",
  },
}));
