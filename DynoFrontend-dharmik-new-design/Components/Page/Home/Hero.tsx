import HomeSectionTitle from "@/Components/UI/SectionTitle";
import { Box } from "@mui/material";
import React from "react";

import Dashboard from "@/assets/Images/home/Dashboard.png";
import Payment from "@/assets/Images/home/Payment-Container.png";
import Wallet from "@/assets/Images/home/Wallet.png";
import BitcoinBg from "@/assets/Images/home/Bitcoin-bg.png";
import EthereumBg from "@/assets/Images/home/Ethereum-bg.png";
import LitecoinBg from "@/assets/Images/home/Litecoin-bg.png";

import Image from "next/image";
import HomeButton from "@/Components/Layout/HomeButton";

const HeroSection = () => {
  return (
    <div>
      <Box
        sx={{
          pt: { lg: "63px", md: "48px", sm: "35px", xs: "24px" },
          zIndex: 20,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <HomeSectionTitle
            type="large"
            badgeText="Crypto Payments Made Simple"
            title="Accept Crypto Payments in Minutes"
            highlightText="Crypto Payments"
            subtitle="A modern crypto payment gateway that plugs into any e-commerce setup. Add your wallets, generate payment links, use the API, and receive crypto fast and securely."
          />
          <Box
            sx={{
              position: "absolute",
              bottom: { lg: "15%", md: "15%", sm: "10%", xs: "40%" },
              left: { lg: "20%", md: "15%", sm: "5%", xs: "0%" },
              width: "40px",
              height: "40px",
              zIndex: 10,
              filter: "blur(1px)",
              animation: "floatBitcoin 5s ease-in-out infinite",
              "@keyframes floatBitcoin": {
                "0%, 100%": {
                  transform: "translateY(0px) rotate(0deg)",
                  opacity: 0.8,
                },
                "50%": {
                  transform: "translateY(-20px) rotate(5deg)",
                  opacity: 1,
                },
              },
            }}
          >
            <Image
              src={BitcoinBg}
              alt="background"
              fill
              style={{ objectFit: "fill" }}
              draggable={false}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: { lg: "20%", md: "15%", sm: "0%" },
              top: { xs: "0%", sm: "70%", lg: "70%" },
              right: { lg: "20%", md: "15%", sm: "5%", xs: "0%" },
              width: "36px",
              height: "58px",
              zIndex: 10,
              filter: "blur(1px)",
              animation: "floatEthereum 5s ease-in-out infinite",
              "@keyframes floatEthereum": {
                "0%, 100%": {
                  transform: "translateY(0px) rotate(0deg)",
                  opacity: 0.8,
                },
                "50%": {
                  transform: "translateY(-25px) rotate(-5deg)",
                  opacity: 1,
                },
              },
            }}
          >
            <Image
              src={EthereumBg}
              alt="background"
              fill
              style={{ objectFit: "cover" }}
              draggable={false}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "10px", sm: 2 },
            marginTop: "24px",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Start Accepting Crypto Button */}
          <HomeButton variant="primary" label="Start Accepting Crypto" />
          {/* Learn More Button */}
          <HomeButton variant="outlined" label="Learn More" />
        </Box>
      </Box>

      <Box
        sx={{
          my: 8,
          position: "relative",
          display: { lg: "flex", md: "flex", sm: "none", xs: "none" },
          alignItems: "center",
          justifyContent: "center",
          ":before": {
            content: '""',
            position: "absolute",
            top: "-10%",
            left: 0,
            width: "100%",
            height: "110%",
            backgroundColor: "rgba(0, 4, 255, 0.05)",
            filter: "blur(100px)",
            borderRadius: "1000px",
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { lg: "487px", md: "400px" },
            zIndex: 2,
          }}
        >
          {/* Glow */}
          {/* <Box
            sx={{
              bgcolor: "rgba(0, 4, 255, 0.05)",
              position: "absolute",
              top: "-10%",
              width: "100%",
              height: "110%",
              filter: "blur(100px)",
              borderRadius: "1000px",
              zIndex: 0,
            }}
          /> */}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-50px",
                left: "30%",
                width: "97px",
                height: "97px",
                zIndex: 0,
                pointerEvents: "none",
                filter: "blur(3px)",
                opacity: 0.8,
                animation: "floatLitecoin 6s ease-in-out infinite",
                "@keyframes floatLitecoin": {
                  "0%, 100%": {
                    transform: "translateY(0px) translateX(0px) rotate(0deg)",
                    opacity: 0.8,
                  },
                  "33%": {
                    transform: "translateY(-15px) translateX(10px) rotate(3deg)",
                    opacity: 1,
                  },
                  "66%": {
                    transform: "translateY(10px) translateX(-10px) rotate(-3deg)",
                    opacity: 0.9,
                  },
                },
              }}
            >
              <Image
                src={LitecoinBg}
                alt="Bitcoin Background"
                fill
                style={{
                  objectFit: "contain",
                  opacity: 0.8,
                }}
                draggable={false}
              />
            </Box>

            <Image
              src={Dashboard}
              alt="Dashboard Container"
              fill
              style={{ objectFit: "contain" }}
              priority
              draggable={false}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translate(-5%, -25%)",
            width: { lg: "258px", md: "200px" },
            height: { lg: "168px", md: "120px" },
            zIndex: 3,
            display: { xs: "none", md: "block" },
            borderRadius: "16px",
            boxShadow: "0px 3.24px 24.89px rgba(18, 19, 92, 0.16)",
          }}
        >
          <Image
            src={Wallet}
            alt="Wallet Container"
            fill
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        </Box>

        {/* Payment */}
        <Box
          sx={{
            position: "absolute",
            top: "49%",
            right: "8%",
            transform: "translate(35%, -47%)",
            width: { lg: "308px", md: "240px" },
            height: { lg: "251px", md: "200px" },
            zIndex: 3,
            display: { xs: "none", md: "block" },
            borderRadius: "16px",
            boxShadow: "0px 3.24px 24.89px rgba(18, 19, 92, 0.16)",
          }}
        >
          <Image
            src={Payment}
            alt="Payment Container"
            fill
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        </Box>
      </Box>

      {/* Mobile Section */}
      <Box
        sx={{
          display: { md: "none", sm: "block", xs: "block" },
          mt: 4,
          mb: 10,
          position: "relative",
          height: "450px",
          "&:before": {
            content: '""',
            position: "absolute",
            top: "0%",
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 4, 255, 0.05)",
            filter: "blur(100px)",
            borderRadius: "1000px",
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "0%",
            left: "0",
            width: "258px",
            height: "168px",
            filter: "blur(1px)",
          }}
        >
          <Image
            src={Wallet}
            alt="Wallet Container"
            fill
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "0%",
            right: "0",
            width: "308px",
            height: "251px",
            filter: "blur(1px)",
          }}
        >
          <Image
            src={Payment}
            alt="Payment Container"
            fill
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "0%",
            right: "-16px",
            width: "97px",
            height: "97px",
            filter: "blur(3px)",
            zIndex: 0,
            animation: "floatLitecoinMobile 6s ease-in-out infinite",
            "@keyframes floatLitecoinMobile": {
              "0%, 100%": {
                transform: "translateY(0px) translateX(0px) rotate(0deg)",
                opacity: 0.8,
              },
              "33%": {
                transform: "translateY(-15px) translateX(10px) rotate(3deg)",
                opacity: 1,
              },
              "66%": {
                transform: "translateY(10px) translateX(-10px) rotate(-3deg)",
                opacity: 0.9,
              },
            },
          }}
        >
          <Image
            src={LitecoinBg}
            alt="Dashboard Mobile"
            fill
            style={{ objectFit: "cover" }}
            draggable={false}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            width: "847px",
            height: "367px",
          }}
        >
          <Image
            src={Dashboard}
            alt="Dashboard Mobile"
            fill
            style={{ objectFit: "cover", placeContent: "left" }}
            draggable={false}
          />
        </Box>
      </Box>
    </div>
  );
};

export default HeroSection;
