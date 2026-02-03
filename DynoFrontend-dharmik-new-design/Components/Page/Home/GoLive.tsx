import React from "react";
import Image from "next/image";
import HomeCard from "@/Components/UI/HomeCard";
import { Box, Grid, Typography } from "@mui/material";
import useIsMobile from "@/hooks/useIsMobile";
import {
  GoLiveCount,
  GoLiveDescription,
} from "@/Components/UI/HomeCard/styled";
import { homeTheme } from "@/styles/homeTheme";
import { ImageCenter } from "@/Containers/Login/styled";
import CompanySelectorImage from "@/assets/Images/home/company-dropdown.svg";
import AllWalletsImage from "@/assets/Images/home/all-wallets.svg";
import PaymentLinkAddImage from "@/assets/Images/home/payment-link-create.svg";
import HomeSectionTitle from "@/Components/UI/SectionTitle";
import { theme } from "@/styles/theme";

const GoLiveSection = () => {
  const isMobile = useIsMobile("md");

  const cardData = [
    {
      title: "Create a Company Workspace",
      description: "Set up your business profile and configure your payment preferences in minutes.",
      image: CompanySelectorImage,
    },
    {
      title: "Add Your Crypto Wallets",
      description: "Connect BTC, ETH, LTC, and more. All your assets managed in one secure place.",
      image: AllWalletsImage,
    },
    {
      title: "Generate Payment Links or Integrate API",
      description: "Create instant payment links for non-dev teams or use our developer-friendly API.",
      image: PaymentLinkAddImage,
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "96px 0",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Section Title */}
      <HomeSectionTitle
        type="small"
        badgeText="How It Works"
        title="Go live in three simple steps"
        highlightText="three simple steps"
        subtitle="Getting started with DynoPay takes minutes, not days. Here's how simple it is."
        sx={{ maxWidth: "100%" }}
      />

      {/* Cards */}
      <Box sx={{ pt: isMobile ? 5 : 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid
              key={card.title}
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              display="flex"
              justifyContent="center"
            >
              <HomeCard
                height={isMobile ? 645 : 612}
                width={isMobile ? 338 : 395}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    width: "100%",
                    height: "100%",
                    paddingX: isMobile ? "30px" : "33px",
                    paddingTop: "33px",
                    paddingBottom: isMobile ? "24px" : "",
                  }}
                >
                  <GoLiveCount sx={{ textAlign: "center", mb: 2 }}>0{index + 1}</GoLiveCount>

                  <Typography sx={{ mb: "12px" }} style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "28px",
                    letterSpacing: 0,
                    fontFamily: "OutfitMedium",
                    color: theme.palette.text.primary,
                  }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ mb: 1 }} style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: 0,
                    fontFamily: "OutfitRegular",
                    color: theme.palette.text.secondary,
                  }}>
                    {card.description}
                  </Typography>

                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      quality={100}
                      priority={index < 3}
                      style={{
                        width: isMobile ? card.title === "Generate Payment Links or Integrate API" ? "110%" : "120%" : "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      draggable={false}
                    />
                  </Box>
                </Box>
              </HomeCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </section>
  );
};

export default GoLiveSection;
