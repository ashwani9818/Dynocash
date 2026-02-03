import withAuth from "@/Components/Page/Common/HOC/withAuth";
import { LayoutProps, rootReducer } from "@/utils/types";
import { Box, Grid, useTheme, SxProps, Theme } from "@mui/material";
import React from "react";
import useTokenData from "@/hooks/useTokenData";
import Toast from "@/Components/UI/Toast";
import { useSelector } from "react-redux";
import NewHeader from "@/Components/Layout/NewHeader";
import NewSidebar from "@/Components/Layout/NewSidebar";
import MobileNavigationBar from "@/Components/Layout/MobileNavigationBar";
import { MainPageHeader, PageHeader, PageHeaderDescription, PageHeaderTitle } from "./styled";
import { CompanyDialogProvider } from "@/Components/UI/CompanyDialog/context";

const ClientLayout = ({
  children,
  pageName,
  pageDescription,
  pageWarning,
  pageAction,
  pageHeaderSx,
}: LayoutProps) => {
  const theme = useTheme();
  const tokenData = useTokenData();
  const ToastState = useSelector((state: rootReducer) => state.toastReducer);
  return (
    <CompanyDialogProvider>
      <Box
        sx={{
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: theme.palette.secondary.main,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toast
          open={ToastState.open}
          message={ToastState.message}
          severity={ToastState.severity || "success"}
          loading={ToastState.loading}
        />

        <Box sx={{ px: { xs: 2, md: 3 }, pt: 3 }}>
          <NewHeader />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: "hidden", // important
            px: { xs: 2, lg: 3 },
            // pb: { xs: 10, lg: 2 }, // Add bottom padding on mobile for bottom nav
            mt: 3,
          }}
        >
          <Grid container spacing={3} sx={{ height: "100%" }}>
            {/* Desktop Sidebar */}
            <Grid
              item
              xs={0}
              md={3}
              lg={2.5}
              sx={{
                height: "100%",
                overflow: "hidden",
                display: { xs: "none", lg: "block" },
              }}
            >
              <NewSidebar />
            </Grid>

            {/* Main Content */}
            <Grid
              item
              xs={12}
              md={12}
              lg={9.5}
              sx={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                pb: { xs: 10, lg: 0 },
              }}
            >
              {(pageName || pageDescription) && (
                <MainPageHeader>
                  <PageHeader
                    sx={
                      pageHeaderSx
                        ? ([
                          { pt: 0, pb: { lg: 2.5, md: 1.5, xs: 1 }, mb: 0 },
                          pageHeaderSx,
                        ] as SxProps<Theme>)
                        : { pt: 0, pb: { lg: 2.5, md: 1.5, xs: 1 }, mb: 0 }
                    }
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {pageName && (
                        <PageHeaderTitle variant="h1">{pageName}</PageHeaderTitle>
                      )}
                      {pageDescription && (
                        <PageHeaderDescription variant="body1">
                          {pageDescription}
                        </PageHeaderDescription>
                      )}
                    </Box>

                    {pageAction && (
                      <Box
                        sx={{
                          flexShrink: 0,
                          pt: { xs: 0.5, md: 0 },
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: { xs: 1, md: 2 },
                        }}
                        className="pageAction"
                      >
                        {pageAction}
                      </Box>
                    )}
                  </PageHeader>
                  {pageWarning && (
                    <Box sx={{ mb: { xs: 1, md: 2 }, mt: { xs: 1, md: 0 } }}>
                      {pageWarning}
                    </Box>
                  )}
                </MainPageHeader>
              )}
              {children}
            </Grid>
          </Grid>
        </Box>

        {/* Mobile Bottom Navigation */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
          }}
        >
          <MobileNavigationBar />
        </Box>
      </Box>
    </CompanyDialogProvider>
  );
};

export default withAuth(ClientLayout);
