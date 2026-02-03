import React from "react";
import Image from "next/image";
import HomeCard from "@/Components/UI/HomeCard";
import { Box, Grid } from "@mui/material";
import useIsMobile from "@/hooks/useIsMobile";
import {
  FeatureIcon,
  GoLiveDescription,
  FeatureTitle,
} from "@/Components/UI/HomeCard/styled";
import HomeSectionTitle from "@/Components/UI/SectionTitle";
import HomeButton from "@/Components/Layout/HomeButton";

import PaymentLinkSuccessImage from "@/assets/Images/home/payment-link-success.svg";
import TransactionDashboardImage from "@/assets/Images/home/transaction-dashboard.svg";
import WalletSelectorImage from "@/assets/Images/home/wallet-selector.svg";
import APIKeyImage from "@/assets/Images/home/api-key.svg";
import ProgressCounterImage from "@/assets/Images/home/progress-counter.svg";
import WebhookInfoImage from "@/assets/Images/home/webhook-info.svg";

import LinkIcon from "@/assets/Icons/home/link-icon.svg";
import DashboardIcon from "@/assets/Icons/home/dashboard-icon.svg";
import WalletIcon from "@/assets/Icons/home/wallet-icon.svg";
import APIKeyIcon from "@/assets/Icons/home/code-icon.svg";
import ProgressCounterIcon from "@/assets/Icons/home/trend-down-icon.svg";
import WebhookIcon from "@/assets/Icons/home/webhook-icon.svg";

const cardData = [
  {
    title: "No-Code Payment Links",
    description: "Simple way to send a payment request without any technical setup.",
    image: PaymentLinkSuccessImage,
    icon: LinkIcon,
    order: { xs: 3, md: 1 },
  },
  {
    title: "Full Transaction Dashboard",
    description: "Real-time tracking of all crypto payments with detailed insights.",
    image: TransactionDashboardImage,
    icon: DashboardIcon,
    order: { xs: 2, md: 2 },
  },
  {
    title: "Multiple Wallets Per Company",
    description: "Manage all your crypto assets in one unified place.",
    image: WalletSelectorImage,
    icon: WalletIcon,
    order: { xs: 1, md: 3 },
  },
  {
    title: "Developer-Friendly API",
    description: "Clean keys management and comprehensive documentation.",
    image: APIKeyImage,
    icon: APIKeyIcon,
    order: { xs: 6, md: 4 },
  },
  {
    title: "Fee Management That Makes Sense",
    description: "Transparent tier system and real-time fee monitoring.",
    image: ProgressCounterImage,
    icon: ProgressCounterIcon,
    order: { xs: 5, md: 5 },
  },
  {
    title: "Instant Callbacks & Webhooks",
    description: "For businesses that need automation and real-time updates.",
    image: WebhookInfoImage,
    icon: WebhookIcon,
    order: { xs: 4, md: 6 },
  },
];

const FeaturesSection = () => {
  const isMobile = useIsMobile("md");

  return (
    <section
      id="features"
      style={{
        padding: isMobile ? "60px 0px" : "83px 0px",
      }}
    >
      {/* Section Title */}
      <HomeSectionTitle
        type="small"
        badgeText="Features"
        title="All you need for your business"
        highlightText="your business"
        subtitle="Focus on your business and let us manage your crypto payment processes for you."
        sx={{ maxWidth: "100%" }}
      />

      {/* Feature Cards */}
      <Box sx={{ paddingTop: isMobile ? 5 : 8 }}>
        <Grid container spacing={4}>
          {cardData.slice(0, 3).map((card) => (
            <Grid
              key={card.title}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
              sx={{ order: card.order }}
              display="flex"
              justifyContent="center"
            >
              <HomeCard
                height={isMobile ? 405 : 500}
                width={isMobile ? 360 : 395}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    width: "100%",
                    height: "100%",
                    padding: isMobile ? "20px" : "25px",
                  }}
                >
                  <FeatureIcon sx={{ mb: 2 }}>
                    <Image src={card.icon} alt={`${card.title} icon`} width={24} height={24} />
                  </FeatureIcon>

                  <FeatureTitle sx={{ mb: 1 }}>{card.title}</FeatureTitle>
                  <GoLiveDescription sx={{ mb: 2 }}>
                    {card.description}
                  </GoLiveDescription>

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
                      priority={cardData.indexOf(card) < 3}
                      style={{
                        width: isMobile ? "110%" : "100%",
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
          {cardData.slice(3, cardData.length).map((card) => (
            <Grid
              key={card.title}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
              sx={{ order: card.order }}
              display="flex"
              justifyContent="center"
            >
              <HomeCard
                height={isMobile ? 405 : 400}
                width={isMobile ? 360 : 395}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    width: "100%",
                    height: "100%",
                    paddingX: isMobile ? "20px" : "25px",
                    paddingTop: isMobile ? "20px" : "25px",
                  }}
                >
                  <FeatureIcon sx={{ mb: 2 }}>
                    <Image src={card.icon} alt={`${card.title} icon`} width={24} height={24} />
                  </FeatureIcon>

                  <FeatureTitle sx={{ mb: 1 }}>{card.title}</FeatureTitle>
                  <GoLiveDescription sx={{ mb: "3px" }}>
                    {card.description}
                  </GoLiveDescription>

                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: card.title === "Developer-Friendly API" ? "15px" : "0px",
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      quality={100}
                      priority={cardData.indexOf(card) < 3}
                      style={{
                        width: "110%",
                        height: "100%",
                        // objectFit: "contain",
                      }}
                      draggable={false}
                    />
                  </Box>
                </Box>
              </HomeCard>
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 5 : 8 }}>
          <HomeButton variant="primary" label="Start Accepting Crypto" />
        </Box>
      </Box>
    </section>
  );
};

export default FeaturesSection;