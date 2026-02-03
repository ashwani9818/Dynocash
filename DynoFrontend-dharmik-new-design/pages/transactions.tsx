import CustomDatePicker from "@/Components/UI/DatePicker";
import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { pageProps } from "@/utils/types";
import TransactionPage from "@/Components/Page/Transactions";
import { useTranslation } from "react-i18next";

const TransactionsPage = ({
  setPageName,
  setPageDescription,
  setPageAction,
}: pageProps) => {
  const { t } = useTranslation("transactions");
  const tTransactions = useCallback(
    (key: string) => t(key, { ns: "transactions" }),
    [t]
  );
  useEffect(() => {
    if (setPageName && setPageDescription) {
      setPageName(tTransactions("transactionsTitle"));
      setPageDescription(tTransactions("transactionsDescription"));
    }
  }, [setPageName, setPageDescription, tTransactions]);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* <CustomDatePicker /> */}

      <TransactionPage />
    </div>
  );
};

export default TransactionsPage;
