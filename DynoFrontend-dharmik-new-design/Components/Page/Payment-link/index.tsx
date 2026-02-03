import React, { useEffect } from "react";
import { Box } from "@mui/material";
import PaymentLinksTable, { PaymentLink } from "./PaymentLinksTable";
import PaymentLinksTopBar from "./PaymentLinksTopBar";

interface Props {
  setPageName?: (v: string) => void;
  setPageDescription?: (v: string) => void;
  setPageAction?: (v: React.ReactNode | null) => void;
}

const PaymentLinksPage = ({
  setPageName,
  setPageDescription,
  setPageAction,
}: Props) => {

  // 🔥 THIS IS THE KEY PART
  useEffect(() => {
    setPageName?.("");
    setPageDescription?.("");
    setPageAction?.(null);
  }, []);

  const paymentLinks: PaymentLink[] = [
    {
      id: "a7b9c1d2e3f4a5",
      description: "Premium Subscription - Annual Plan",
      usdValue: "$1,250",
      createdAt: "07.11.2025 15:32:00",
      expiresAt: "07.11.2025 14:32:00",
      status: "active",
      timesUsed: 2,
    },
    {
      id: "a7b9c1d2e3f4a5",
      description: "Digital Product Purchase",
      usdValue: "$233",
      createdAt: "04.11.2025 11:32:00",
      expiresAt: "23.11.2025 14:32:00",
      status: "expired",
      timesUsed: 2,
    },
    {
      id: "a7b9c1d2e3f4a5",
      description: "Consulting Services - January 2026",
      usdValue: "$9,442",
      createdAt: "01.11.2025 22:32:00",
      expiresAt: "29.11.2025 14:32:00",
      status: "active",
      timesUsed: 2,
    },
    {
      id: "a7b9c1d2e3f4a5",
      description: "Premium Subscription - Annual Plan",
      usdValue: "$1,250",
      createdAt: "07.11.2025 15:32:00",
      expiresAt: "07.11.2025 14:32:00",
      status: "active",
      timesUsed: 2,
    },
  ];

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        "> :not(:last-child)": {
          marginBottom: { md: "20px", xs: "16px" },
        },
      }}
    >
      <PaymentLinksTopBar onSearch={handleSearch} />

      <PaymentLinksTable
        paymentLinks={paymentLinks}
        rowsPerPage={5}
      />
    </Box>
  );
};

export default PaymentLinksPage;
