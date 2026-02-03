import React from "react";
import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import useIsMobile from "@/hooks/useIsMobile";

export interface TitleDescriptionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  titleVariant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
  descriptionVariant?: "body1" | "body2" | "subtitle1" | "subtitle2" | "p";
  gutterBottom?: boolean;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  description,
  align = "left",
  titleVariant = "h2",
  descriptionVariant = "body2",
  gutterBottom = true,
  divider = false,
  sx,
}) => {
  const isMobile = useIsMobile("sm");
  if (!title && !description) return null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: align,
        ...sx,
      }}
    >
      {title ? (
        <Typography
          component="div"
          sx={{
            fontSize: "20px",
            fontFamily: "UrbanistMedium",
            color: "#242428",
            lineHeight: "1",
            ...(isMobile && { fontSize: "15px" }),
          }}
        >
          {title}
        </Typography>
      ) : null}

      {description ? (
        <Typography
          sx={{
            fontSize: "15px",
            marginTop: "12px",
            fontFamily: "UrbanistMedium",
            color: "#676768",
            ...(isMobile && { fontSize: "13px" }),
          }}
        >
          {description}
        </Typography>
      ) : null}
    </Box>
  );
};

export default TitleDescription;
