import { pageProps } from "@/utils/types";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { Box } from "@mui/material";
import CreatePaymentLinkPage from "@/Components/Page/CreatePaymentLink";

const CreatePaymentLink = ({
  setPageName,
  setPageDescription,
  setPageAction,
  setPageHeaderSx,
}: pageProps) => {
  const namespaces = ["createPaymentLinkScreen", "common"];
  const { t } = useTranslation(namespaces);
  const tCreatePaymentLink = useCallback(
    (key: string, defaultValue?: string) =>
      t(key, { ns: "createPaymentLinkScreen", defaultValue }),
    [t]
  );

  useEffect(() => {
    if (setPageName && setPageDescription) {
      setPageName(
        tCreatePaymentLink("createPaymentLinkTitle", "Create Payment Link")
      );
      setPageDescription("");
    }
  }, [setPageName, setPageDescription, tCreatePaymentLink]);

  return (
    <>
      <Head>
        <title>DynoPay - Create Payment Link</title>
        <meta name="description" content="Create a new payment link" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <CreatePaymentLinkPage />
      </Box>
    </>
  );
};

export default CreatePaymentLink;
