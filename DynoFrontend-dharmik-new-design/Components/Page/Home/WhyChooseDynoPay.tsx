import React from "react";
import Image from "next/image";
import HomeCard from "@/Components/UI/HomeCard";
import { Box, Grid, Typography } from "@mui/material";
import useIsMobile from "@/hooks/useIsMobile";
import {
  WhyChooseUsCard,
  WhyChooseDynoPayIcon,
  WhyChooseDynoPayTitle,
  WhyChooseDynoPayDescription,
} from "@/Components/UI/HomeCard/styled";
import HomeSectionTitle from "@/Components/UI/SectionTitle";
import LowerFeesIcon from "@/assets/Icons/home/lower-arrow-icon.svg";
import FullControlOfFundsIcon from "@/assets/Icons/home/shield-icon.svg";
import FastIntegrationIcon from "@/assets/Icons/home/light-bolt-icon.svg";
import GlobalReachIcon from "@/assets/Icons/home/global-icon.svg";

const WhyChooseDynopaySection = () => {
  const isMobile = useIsMobile("md");

  const whyChooseItems = [
    {
      icon: LowerFeesIcon,
      iconAlt: "lower fees icon",
      title: "Lower Fees",
      description: "Minimal blockchain costs, nothing hidden. Save more on every transaction.",
    },
    {
      icon: FullControlOfFundsIcon,
      iconAlt: "full control of funds icon",
      title: "Full Control of Funds",
      description: "Crypto goes directly into your own wallets. Non-custodial by design.",
    },
    {
      icon: FastIntegrationIcon,
      iconAlt: "fast integration icon",
      title: "Fast Integration",
      description: "Payment links for non-dev teams, powerful API for developers.",
    },
    {
      icon: GlobalReachIcon,
      iconAlt: "global reach icon",
      title: "Global Reach",
      description: "Let customers pay from anywhere in the world, instantly.",
    },
  ];

  return (
    <section
      style={{
        padding: "96px 0px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Why Choose DynoPay Section Title */}
      <HomeSectionTitle
        type="small"
        badgeText="Why DynoPay"
        title="Why businesses choose us"
        highlightText="choose us"
        subtitle="Built for modern businesses that want to accept crypto without the complexity."
        sx={{ maxWidth: "100%" }}
      />
      {/* Why Choose DynoPay Section Cards */}
      <Box
        sx={{
          paddingTop: isMobile ? 5 : 8,
          paddingX: 2,
        }}
      >
        <Grid container spacing={3}>
          {whyChooseItems.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={6} lg={3} xl={3}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WhyChooseUsCard>
                  <WhyChooseDynoPayIcon>
                    <Image
                      src={item.icon}
                      alt={item.iconAlt}
                      width={28}
                      height={28}
                      draggable={false}
                    />
                  </WhyChooseDynoPayIcon>

                  <WhyChooseDynoPayTitle sx={{ marginTop: 2 }}>
                    {item.title}
                  </WhyChooseDynoPayTitle>
                  <WhyChooseDynoPayDescription sx={{ marginTop: 1 }}>
                    {item.description}
                  </WhyChooseDynoPayDescription>
                </WhyChooseUsCard>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </section>
  );
};

export default WhyChooseDynopaySection;
