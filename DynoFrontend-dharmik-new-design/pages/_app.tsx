import {
  AdminLayout,
  ClientLayout,
  LoginLayout,
  PaymentLayout,
} from "@/Containers";
import store from "@/store";
import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { Provider } from "react-redux";
import "../i18n";
import LanguageBootstrap from "@/helpers/LanguageBootstrap";
import type { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import HomeLayout from "@/Containers/Home";
import { homeTheme } from "@/styles/homeTheme";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [pageName, setPageName] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [pageAction, setPageAction] = useState<ReactNode | null>(null);
  const [pageWarning, setPageWarning] = useState<ReactNode | null>(null);
  const [pageHeaderSx, setPageHeaderSx] = useState<SxProps<Theme> | null>(null);

  const homePaths = [
    "/",
    "/terms-conditions",
    "/privacy-policy",
    "/aml-policy",
    "/api-status",
  ];
  const isHomePath = homePaths.includes(pathname);
  return (
    <>
      <Provider store={store}>
        <LanguageBootstrap />
        <SessionProvider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            {isHomePath && (
              <ThemeProvider theme={homeTheme}>
                <HomeLayout>
                  <Component {...pageProps} />
                </HomeLayout>
              </ThemeProvider>
            )}

            {!isHomePath &&
              !pathname.includes("auth") &&
              !pathname.includes("payment") &&
              !pathname.includes("admin") && (
                <ClientLayout
                  pageName={pageName}
                  pageDescription={pageDescription}
                  pageAction={pageAction}
                  pageWarning={pageWarning}
                  pageHeaderSx={pageHeaderSx || undefined}
                >
                  <Component
                    {...pageProps}
                    setPageName={setPageName}
                    setPageDescription={setPageDescription}
                    setPageAction={setPageAction}
                    setPageWarning={setPageWarning}
                    setPageHeaderSx={setPageHeaderSx}
                  />
                </ClientLayout>
              )}
            {(pathname.includes("auth") ||
              pathname.includes("admin/login")) && (
                <LoginLayout
                  pageName={pageName}
                  pageDescription={pageDescription}
                >
                  <Component
                    {...pageProps}
                    setPageName={setPageName}
                    setPageDescription={setPageDescription}
                    setPageAction={setPageAction}
                  />
                </LoginLayout>
              )}
            {pathname.includes("payment") && (
              <PaymentLayout
                pageName={pageName}
                pageDescription={pageDescription}
              >
                <Component
                  {...pageProps}
                  setPageName={setPageName}
                  setPageDescription={setPageDescription}
                  setPageAction={setPageAction}
                />
              </PaymentLayout>
            )}
            {pathname.includes("admin") &&
              !pathname.includes("admin/login") && (
                <AdminLayout
                  pageName={pageName}
                  pageDescription={pageDescription}
                >
                  <Component
                    {...pageProps}
                    setPageName={setPageName}
                    setPageDescription={setPageDescription}
                    setPageAction={setPageAction}
                  />
                </AdminLayout>
              )}
          </ThemeProvider>
        </SessionProvider>
      </Provider>
    </>
  );
}
