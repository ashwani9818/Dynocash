import React, { useEffect, useCallback } from "react";
import { pageProps } from "@/utils/types";
import { useTranslation } from "react-i18next";
import router from "next/router";
import PaymentLinksPage from "@/Components/Page/Payment-link";
import { AddRounded } from "@mui/icons-material";
import CustomButton from "@/Components/UI/Buttons";
import useIsMobile from "@/hooks/useIsMobile";

const PayLinks = ({
  setPageName,
  setPageDescription,
  setPageAction,
}: pageProps) => {

  const isMobile = useIsMobile("md");
  const { t } = useTranslation("paymentLinks");

  useEffect(() => {
    if (setPageName && setPageDescription) {
      setPageName(t("paymentLinksTitle"));
      setPageDescription(t("paymentLinksDescription"));
    }
  }, [setPageName, setPageDescription, t]);

  useEffect(() => {
    if (!setPageAction) return;
    setPageAction(
      <CustomButton
        label={
          isMobile
            ? t("create")
            : t("createPaymentLink")
        }
        variant="primary"
        size="medium"
        endIcon={<AddRounded sx={{ fontSize: isMobile ? 18 : 20 }} />}
        onClick={() => router.push("/create-pay-link")}
        sx={{
          height: isMobile ? 34 : 40,
          px: isMobile ? 1.5 : 2.5,
          fontSize: isMobile ? 13 : 15,
        }}
      />
    );
    return () => setPageAction(null);
  }, [setPageAction, t, isMobile]);



  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <PaymentLinksPage />
    </div>
  );
};

export default PayLinks;
