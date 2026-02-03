import styled from "@emotion/styled";
import { styled as muiStyled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const LangTrigger = muiStyled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 12px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: theme?.palette?.border?.main,
  cursor: "pointer",
  background: "white",
  color: theme?.palette?.text?.primary ?? "#000",
  minWidth: "fit-content",

  "&.MuiTypography-root span": {
    fontSize: theme.breakpoints.down("sm") ? "12px" : "15px",
  },
}));

export const LangFlag = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

export const LangText = styled.span`
  font-size: 14px;
  font-weight: 500;
  font-family: UrbanistMedium;
`;

export const CheckIconStyled = styled.img`
  width: 18px;
  height: 18px;
`;

export const VerticalLine = styled.div`
  width: 1px;
  height: 20px;
  background: #ddd;
`;
