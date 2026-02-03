import React, { useState, useCallback } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import BitcoinIcon from "@/assets/cryptocurrency/Bitcoin-icon.svg";
import EthereumIcon from "@/assets/cryptocurrency/Ethereum-icon.svg";
import LitecoinIcon from "@/assets/cryptocurrency/Litecoin-icon.svg";
import BNBIcon from "@/assets/cryptocurrency/BNB-icon.svg";
import DogecoinIcon from "@/assets/cryptocurrency/Dogecoin-icon.svg";
import BitcoinCashIcon from "@/assets/cryptocurrency/BitcoinCash-icon.svg";
import TronIcon from "@/assets/cryptocurrency/Tron-icon.svg";
import USDTIcon from "@/assets/cryptocurrency/USDT-icon.svg";

import CorrectIcon from "@/assets/Icons/correct-icon.png";
import WrongIcon from "@/assets/Icons/wrong-icon.png";
import HourglassIcon from "@/assets/Icons/hourglass-icon.svg";

import TransactionIcon from "@/assets/Icons/transaction-icon.svg";
import CryptoIcon from "@/assets/Icons/crypto-icon.svg";
import RoundedStackIcon from "@/assets/Icons/roundedStck-icon.svg";
import CurrencyIcon from "@/assets/Icons/dollar-sign-icon.svg";
import HexagonIcon from "@/assets/Icons/hexagon-icon.svg";
import TimeIcon from "@/assets/Icons/time-icon.svg";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import {
  TransactionsTableBody,
  TransactionsTableCell,
  TransactionsTableContainer,
  TransactionsTableFooter,
  TransactionsTableFooterText,
  TransactionsTableHeader,
  TransactionsTableHeaderItem,
  TransactionsTableRow,
  TransactionsTableScrollWrapper,
  StatusBadge,
  StatusIconWrapper,
  StatusText,
  CryptoIconChip,
  MobileNavigationButtons,
} from "./styled";
import CustomButton from "@/Components/UI/Buttons";
import RowsPerPageSelector from "@/Components/UI/RowsPerPageSelector";
import useIsMobile from "@/hooks/useIsMobile";
import TransactionDetailsModal, {
  ExtendedTransaction,
} from "./TransactionDetailsModal";
import { HourGlassIcon } from "@/utils/customIcons";

// Transaction data interface - extends ExtendedTransaction which already includes all fields
export type Transaction = ExtendedTransaction;

interface TransactionsTableProps {
  transactions: Transaction[];
  rowsPerPage?: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  rowsPerPage: initialRowsPerPage = 10,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("transactions");
  const tTransactions = useCallback(
    (key: string, options?: any): string => {
      const result = t(key, { ns: "transactions", ...options });
      return typeof result === "string" ? result : String(result);
    },
    [t]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExtendedTransaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isMobile = useIsMobile("md");

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const getCryptoIcon = (crypto: string) => {
    switch (crypto) {
      case "BTC":
        return BitcoinIcon;
      case "ETH":
        return EthereumIcon;
      case "LTC":
        return LitecoinIcon;
      case "DOGE":
        return DogecoinIcon;
      case "BCH":
        return BitcoinCashIcon;
      case "TRX":
        return TronIcon;
      case "USDT-ERC20":
        return USDTIcon;
      case "USDT-TRC20":
        return USDTIcon;
      default:
        return BitcoinIcon;
    }
  };

  const getStatusIcon = (status: "done" | "pending" | "failed") => {
    switch (status) {
      case "done":
        return <Image src={CorrectIcon} alt="correct" draggable={false} />;
      case "pending":
        return <HourGlassIcon fill={"#F57C00"} size={isMobile ? 12 : 16} />;
      case "failed":
        return <Image src={WrongIcon} alt="incorrect" draggable={false} />;
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const HeaderData = [
    {
      label: isMobile ? tTransactions("id") : tTransactions("transactionId"),
      key: "id",
      icon: TransactionIcon,
    },
    {
      label: tTransactions("crypto"),
      key: "crypto",
      icon: CryptoIcon,
    },
    {
      label: tTransactions("amount"),
      key: "amount",
      icon: RoundedStackIcon,
    },
    {
      label: tTransactions("usdValue"),
      key: "usdValue",
      icon: CurrencyIcon,
    },
    {
      label: tTransactions("dateTime"),
      key: "dateTime",
      icon: TimeIcon,
    },
    {
      label: tTransactions("status"),
      key: "status",
      icon: HexagonIcon,
    },
  ];

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, maxHeight: "fit-content" }}>
      <TransactionsTableContainer>
        <TransactionsTableScrollWrapper>
          <TransactionsTableHeader>
            {HeaderData.map((item) => (
              <TransactionsTableHeaderItem key={item.key}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  style={{
                    filter: `brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(100%)`,
                  }}
                  draggable={false}
                />
                <span>{item.label}</span>
              </TransactionsTableHeaderItem>
            ))}
          </TransactionsTableHeader>
          <TransactionsTableBody>
            {currentTransactions.length > 0 ? (
              <>
                {currentTransactions.map((transaction, index) => (
                  <TransactionsTableRow
                    key={transaction.id}
                    onClick={() => handleRowClick(transaction)}
                    sx={{
                      paddingY: "10px !important",
                      cursor: "pointer",
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: "cardFadeUp 0.5s ease forwards",
                      animationDelay: `${index * 0.05}s`,

                      "@keyframes cardFadeUp": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(20px)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    <TransactionsTableCell>{transaction.id}</TransactionsTableCell>
                    <TransactionsTableCell>
                      <CryptoIconChip sx={{ width: "fit-content" }}>
                        <Image
                          src={getCryptoIcon(transaction.crypto)}
                          alt={transaction.crypto}
                          draggable={false}
                        />
                        <Typography
                          component={"span"}
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {transaction.crypto}
                        </Typography>
                      </CryptoIconChip>
                    </TransactionsTableCell>
                    <TransactionsTableCell>
                      {(() => {
                        const [value, unit] = transaction.amount.split(" ");
                        return `${Number(value).toFixed(4)} ${unit}`;
                      })()}
                    </TransactionsTableCell>
                    <TransactionsTableCell>
                      {(() => {
                        const value = transaction.usdValue.replace("$", "");
                        return `$${Number(value).toFixed(3)}`;
                      })()}
                    </TransactionsTableCell>
                    <TransactionsTableCell>
                      {formatDateTime(transaction.dateTime)}
                    </TransactionsTableCell>
                    <TransactionsTableCell>
                      <StatusBadge status={transaction.status}>
                        <StatusIconWrapper status={transaction.status}>
                          {getStatusIcon(transaction.status)}
                        </StatusIconWrapper>
                        <StatusText status={transaction.status}>
                          {tTransactions(transaction.status)}
                        </StatusText>
                      </StatusBadge>
                    </TransactionsTableCell>
                  </TransactionsTableRow>
                ))}
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", mt: 3 }}>{t("transactionsNotAvailable", { ns: "common" })}</Box>
            )}

          </TransactionsTableBody>
        </TransactionsTableScrollWrapper>
        <TransactionsTableFooter>
          <RowsPerPageSelector
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            menuItems={[
              { value: 5, label: 5 },
              { value: 10, label: 10 },
              { value: 15, label: 15 },
              { value: 20, label: 20 },
            ]}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TransactionsTableFooterText>
              {tTransactions("showingTransactions", {
                count: currentTransactions.length,
                total: transactions.length,
              })}
            </TransactionsTableFooterText>
            <CustomButton
              label={tTransactions("previous")}
              variant="outlined"
              size="medium"
              sx={{
                width: "fit-content",
                height: "36px",
                padding: "0px 12px",
                "&:disabled": {
                  backgroundColor: theme.palette.common.white,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.border.main}`,
                  cursor: "not-allowed",
                  opacity: 0.5,
                },
                ".custom-button-label": {
                  fontSize: "13px !important",
                  fontFamily: "UrbanistMedium",
                  lineHeight: "16px",
                  fontWeight: 500,
                },
                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              }}
              startIcon={
                <KeyboardArrowLeftRoundedIcon
                  sx={{ height: "20px", width: "20px" }}
                />
              }
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <CustomButton
              label={tTransactions("next")}
              variant="outlined"
              size="medium"
              sx={{
                width: "fit-content",
                height: "36px",
                padding: "0px 12px",
                "&:disabled": {
                  backgroundColor: theme.palette.common.white,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.border.main}`,
                  cursor: "not-allowed",
                  opacity: 0.5,
                },
                ".custom-button-label": {
                  fontSize: "13px !important",
                  fontFamily: "UrbanistMedium",
                  lineHeight: "16px",
                  fontWeight: 500,
                },
                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              }}
              endIcon={
                <KeyboardArrowRightRoundedIcon
                  sx={{ height: "20px", width: "20px" }}
                />
              }
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />

            <MobileNavigationButtons
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <KeyboardArrowLeftRoundedIcon
                sx={{ height: "16px", width: "16px", color: "inherit" }}
              />
            </MobileNavigationButtons>
            <MobileNavigationButtons
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <KeyboardArrowRightRoundedIcon
                sx={{ height: "16px", width: "16px", color: "inherit" }}
              />
            </MobileNavigationButtons>
          </Box>
        </TransactionsTableFooter>
      </TransactionsTableContainer>
      <TransactionDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default TransactionsTable;
