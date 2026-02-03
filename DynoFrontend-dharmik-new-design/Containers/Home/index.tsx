import useTokenData from "@/hooks/useTokenData";
import { useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { rootReducer } from "@/utils/types";
import HomeHeader from "@/Components/Layout/HomeHeader";
import HomeFooter from "@/Components/Layout/HomeFooter";
import { HomeContainer } from "./styled";
import ScrollToTopButton from "@/Components/Layout/ScrollToTopButton";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const homeTheme = useTheme();
  const tokenData = useTokenData();
  const ToastState = useSelector((state: rootReducer) => state.toastReducer);
  return (
    <>
      <HomeHeader />
      {children}
      <HomeFooter />
      <ScrollToTopButton />
    </>
  );
};

export default HomeLayout;
