import { Box, styled } from "@mui/material";

export const HomeContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  padding: theme.spacing(0, 2),
}));

export const HomeFullWidthContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  padding: theme.spacing(0, 2),
  backgroundColor: "#F2F3F84D",
}));
