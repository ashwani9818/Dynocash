import useIsMobile from "@/hooks/useIsMobile";
import { Box, Typography } from "@mui/material";
import React from "react";
import privacyData from "@/utils/constants/privacy-policy";

const PrivacyPolicy = () => {
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

      {/* PRIVACY POLICY HEADING */}
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
        Privacy Policy
      </Typography>

      {/* PRIVACY POLICY DESCRIPTION */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
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
          This Privacy Policy explains how DynoPay (“we”, “us”, “our”) collects,
          uses, and protects your information when you use our website,
          dashboard, or API (“the Service”).
        </Typography>

        {/* PRIVACY POLICY SECTIONS */}
        {privacyData.map((section) => (
          <Box key={section.title}>
            {/* SECTION HEADING */}
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
            {/* SECTION DESCRIPTION */}
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
              {section.description}
            </Typography>

            {/* SECTION INFO */}
            <Box sx={{ my: section.info.length > 0 ? "28px" : 0 }}>
              {section.info.length > 0 &&
                section.info.map((info, infoIndex) => (
                  <>
                    {/* INFO HEADING */}
                    <Typography
                      key={infoIndex}
                      sx={{
                        fontSize: "18px",
                        color: "#676B7E",
                        fontWeight: 400,
                        fontFamily: "OutfitRegular",
                        lineHeight: "28px",
                        letterSpacing: 0,
                      }}
                    >
                      {info.title}
                    </Typography>

                    {/* INFO DESCRIPTION */}
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
                      {info.details}
                    </Typography>
                  </>
                ))}
            </Box>
            {/* SECTION ITEMS */}
            {section.items.length > 0 && (
              <Box component="ul" sx={{ pl: "26px" }}>
                {section.items.map((item, itemIndex) => (
                  <Box
                    component="li"
                    key={itemIndex}
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
                    {item}
                  </Box>
                ))}
              </Box>
            )}
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
