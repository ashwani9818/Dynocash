import { LayoutProps, rootReducer } from "@/utils/types";
import React from "react";
import { LoginWrapper, ContentWrapper } from "./styled";
import { useSelector } from "react-redux";
import Toast from "@/Components/UI/Toast";
import Image from "next/image";
import bg from "@/assets/Images/auth/Background-Image.png";
import AuthBg from "@/assets/Images/auth/auth-bg.png";
import { Box } from "@mui/material";

const LoginLayout = ({ children, pageName, pageDescription }: LayoutProps) => {
  const ToastState = useSelector((state: rootReducer) => state.toastReducer);

  return (
    <LoginWrapper>
      <Toast
        open={ToastState.open}
        message={ToastState.message}
        severity={ToastState.severity ? ToastState.severity : "success"}
        loading={ToastState.loading}
      />

      {/* Desktop Background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          width: { xs: "100%", md: "100%", lg: "80%" },
          height: "100dvh",
          zIndex: 1,
          display: { xs: "none", md: "block" },
          bottom: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={bg}
            alt="bg"
            fill
            priority
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        </Box>
      </Box>

      {/* Mobile Background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          width: { xs: "528px", sm: "100%", lg: "596px" },
          height: { xs: "528px", sm: "100dvh", lg: "596px" },
          zIndex: 1,
          display: { xs: "block", md: "none" },
          top: { xs: "30%", sm: "0%" },
          left: { xs: "-190px", sm: "-10%" },
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={AuthBg}
            alt="authBg"
            fill
            priority
            style={{ objectFit: "contain" }}
            draggable={false}
          />
        </Box>
      </Box>

      <ContentWrapper>{children}</ContentWrapper>
    </LoginWrapper>
  );
};

export default LoginLayout;
