import React from "react";
import { Box, styled, Theme, SxProps, Typography } from "@mui/material";
import { homeTheme } from "@/styles/homeTheme";

const HomeSectionTitleWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const Badge = styled(Box)(() => ({
  textAlign: "center",
  width: "fit-content",
  fontSize: 14,
  lineHeight: "20px",
  letterSpacing: "0px !important",
  fontWeight: 500,
  fontFamily: "OutfitMedium",
  color: homeTheme.palette.primary.main,
  backgroundColor: homeTheme.palette.background.default,
  padding: "6px 16px",
  borderRadius: "9999px",
}));

const Heading = styled(Typography)<{ type: "small" | "large" }>(
  ({ theme, type }) => ({
    fontSize: type === "large" ? "60px" : "36px",
    lineHeight: type === "large" ? "60px" : "40px",
    fontWeight: 500,
    fontFamily: "OutfitMedium",
    color: homeTheme.palette.text.primary,
    maxWidth: type === "large" ? 705 : "auto",
    marginTop: type === "large" ? "24px" : "16px",
    marginBottom: type === "large" ? "15px" : "16px",
    padding: "0 15px",
    [theme.breakpoints.down("md")]: {
      fontSize: type === "large" ? "45px" : "36px",
      lineHeight: type === "large" ? "48px" : "40px",
    },
  })
);

const SubText = styled(Typography)<{ type: "small" | "large" }>(
  ({ theme, type }) => ({
    padding: "0",
    fontSize: type === "large" ? "18px" : "16px",
    lineHeight: type === "large" ? "28px" : "24px",
    fontWeight: 400,
    letterSpacing: "0px !important",
    fontFamily: "OutfitRegular",
    color: homeTheme.palette.text.secondary,
    maxWidth: type === "large" ? 500 : 576,
    [theme.breakpoints.down("md")]: {
      fontSize: type === "large" ? "18px" : "16px",
      lineHeight: type === "large" ? "28px" : "24px",
    },
  })
);

const HighlightText = styled("span")(() => ({
  background: "linear-gradient(90deg, #0004FF 0%, #6A4DFF 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  fontWeight: 500,
}));

interface HomeSectionTitleProps {
  type?: "small" | "large";
  badgeText?: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  align?: "center" | "start";
  sx?: SxProps<Theme>;
}

const HomeSectionTitle: React.FC<HomeSectionTitleProps> = ({
  sx,
  badgeText,
  title,
  highlightText,
  subtitle,
  type = "large",
  align = "center",
}) => {
  const renderTitle = () => {
    if (!highlightText || !title.includes(highlightText)) {
      return title;
    }

    const parts = title.split(highlightText);

    return (
      <>
        {parts[0]}
        <HighlightText>{highlightText}</HighlightText>
        {parts[1]}
      </>
    );
  };

  const textAlign = align === "start" ? "left" : "center";
  const alignItems = align === "start" ? "flex-start" : "center";

  return (
    <HomeSectionTitleWrapper
      sx={{
        alignItems,
        ...sx
      }}
    >
      {badgeText && (
        <Badge sx={{ textAlign, alignSelf: align === "start" ? "flex-start" : "center" }}>
          {badgeText}
        </Badge>
      )}

      <Heading
        className="title"
        type={type}
        variant="h1"
        sx={{ textAlign: textAlign || "center" }}
      >
        {renderTitle()}
      </Heading>

      <SubText
        className="subtitle"
        type={type}
        variant="body1"
        sx={{ textAlign: textAlign || "center" }}
      >
        {subtitle}
      </SubText>
    </HomeSectionTitleWrapper>
  );
};

export default HomeSectionTitle;
