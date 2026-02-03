import styled from "@emotion/styled";
import { styled as muiStyled } from "@mui/material/styles";
import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export const PeriodTrigger = muiStyled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "7px 12px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: theme?.palette?.border?.main,
  cursor: "pointer",
  background: "white",
  color: theme?.palette?.text?.primary ?? "#000",
  minWidth: "fit-content",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: theme?.palette?.border?.focus,
  },
}));

export const PeriodText = styled.span`
  font-size: 14px;
  font-weight: 500;
  font-family: UrbanistMedium;
  white-space: nowrap;
`;

export const CheckIconStyled = styled(CheckIcon)`
  font-size: 18px;
  color: #000;
`;

export const VerticalLine = styled.div`
  width: 1px;
  height: 20px;
  background: #ddd;
`;

