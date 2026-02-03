import useIsMobile from "@/hooks/useIsMobile";
import { Box, Typography } from "@mui/material";
import React from "react";
import { terms } from "@/utils/constants/term-condition";

const TermsConditions = () => {

  const isMobile = useIsMobile("md");

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 768,
        px: isMobile ? "15px" : 0,
        mx: "auto",
        fontFamily: "OutfitMedium",
        mb: isMobile ? "52px" : "93px",
        pt: isMobile ? "100px" : "128px",
      }}
    >

      {/* SECTION TITLE */}
      <Typography
        component="h1"
        sx={{
          fontSize: isMobile ? "45px" : "60px",
          color: "#131520",
          fontWeight: isMobile ? 600 : 500,
          textAlign: "center",
          fontFamily: "OutfitMedium",
          mb: "15px",
          lineHeight: "60px",
          letterSpacing: 0,
        }}
      >
        Terms & Conditions
      </Typography>

      {/* SECTION CONTENT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          lineHeight: 1.5,
        }}
      >
        {terms.map((section, index) => (
          <Box key={index}>
            {/* ITEM TITLE */}
            <Typography
              sx={{
                fontSize: "18px",
                color: "#676B7E",
                fontWeight: 600,
                fontFamily: "OutfitBold",
                lineHeight: "28px",
                letterSpacing: 0,
              }}
            >
              {section.title}
            </Typography>

            {/* ITEM SECTION */}
            {/* ITEM DESCRIPTION 1 */}
            {section.description1 && (
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#676B7E",
                  fontFamily: "OutfitRegular",
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                {section.description1}
              </Typography>
            )}

            {/* ITEM DESCRIPTION 2 */}
            {section.description2 && (
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#676B7E",
                  fontFamily: "OutfitRegular",
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                {section.description2}
              </Typography>
            )}

            {/* ITEM BULLET POINTS */}
            {section.bulletPoints?.length > 0 && (
              <Box component="ul" sx={{ pl: "26px", my: "5px" }}>
                {section.bulletPoints.map((point, pointIndex) => (
                  <Box
                    component="li"
                    key={pointIndex}
                    sx={{
                      listStyle: "disc",
                      fontSize: "18px",
                      color: "#676B7E",
                      fontWeight: 400,
                      fontFamily: "OutfitRegular",
                      lineHeight: "28px",
                      letterSpacing: 0,
                    }}
                  >
                    {point}
                  </Box>
                ))}
              </Box>
            )}

            {/* ITEM FOOTER */}
            {section.footer && (
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#676B7E",
                  fontWeight: 400,
                  fontFamily: "OutfitRegular",
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                {section.footer}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TermsConditions;