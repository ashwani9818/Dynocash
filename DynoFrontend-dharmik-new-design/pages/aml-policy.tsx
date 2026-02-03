import useIsMobile from "@/hooks/useIsMobile";
import { Box, Typography } from "@mui/material";
import React from "react";
import { amlPolicy } from "@/utils/constants/aml-policy";

const AMLPolicy = () => {

  const isMobile = useIsMobile("md");

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 768,
        px: isMobile ? "15px" : 0,
        mx: "auto",
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
          lineHeight: "60px",
          letterSpacing: 0,
          mb: "15px",
        }}
      >
        AML Policy
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
          This AML Policy describes how DynoPay (“we”, “us”, “our”) works to prevent money laundering, terrorist financing, and other illicit activity when users interact with our crypto payment services (“the Service”).
        </Typography>

        {amlPolicy.map((section, index) => (
          <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
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
            {/* ITEM DESCRIPTION */}
            {section.description && (
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#676B7E",
                  fontWeight: 400,
                  fontFamily: "OutfitRegular",
                  lineHeight: "28px",
                  letterSpacing: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {section.description.replace(
                  /\. /,
                  ".\n"
                )}
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

export default AMLPolicy;
