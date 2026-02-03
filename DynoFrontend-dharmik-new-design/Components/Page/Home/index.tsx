import React from "react";
import HeroSection from "./Hero";
import GoLiveSection from "./GoLive";
import FeaturesSection from "./Features";
import {
  HomeContainer,
  HomeFullWidthContainer,
} from "@/Containers/Home/styled";
import UseCaseSection from "./UseCase";
import WhyChooseDynopaySection from "./WhyChooseDynoPay";
import useIsMobile from "@/hooks/useIsMobile";

const HomePage = () => {
  const isMobile = useIsMobile("md");
  return (
    <>
      <div style={{ paddingTop: isMobile ? "76px" : "65px" }}>
        <HomeContainer>
          <HeroSection />
        </HomeContainer>

        <HomeFullWidthContainer>
          <GoLiveSection />
        </HomeFullWidthContainer>

        <HomeContainer>
          <FeaturesSection />
        </HomeContainer>

        <HomeFullWidthContainer>
          <WhyChooseDynopaySection />
        </HomeFullWidthContainer>

        <HomeContainer>
          <UseCaseSection />
        </HomeContainer>
      </div>
    </>
  );
};

export default HomePage;