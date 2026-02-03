import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  TableBodyCell,
  TransactionsTableScrollWrapper,
  StatusChip,
  TableFooter,
  FooterText,
  TransactionsTableContainer,
} from "./styled";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import TransactionIcon from "@/assets/Icons/transaction-icon.svg";
import CryptoIcon from "@/assets/Icons/crypto-icon.svg";
import RoundedStackIcon from "@/assets/Icons/roundedStck-icon.svg";
import HexagonIcon from "@/assets/Icons/hexagon-icon.svg";
import TimeIcon from "@/assets/Icons/time-icon.svg";
import TimeUsedIcon from "@/assets/Icons/cryptocurrency_link.svg";
import ActionIcon from "@/assets/Icons/Actions.svg";
import CopyIcon from "@/assets/Icons/copy-icon.svg";

import Image from "next/image";

import TrueIcon from "@/assets/Icons/True.svg";
import FalseIcon from "@/assets/Icons/False.svg";

import RowsPerPageSelector from "@/Components/UI/RowsPerPageSelector";
import CustomButton from "@/Components/UI/Buttons";
import { MobileNavigationButtons } from "@/Components/Page/Transactions/styled";
import useIsMobile from "@/hooks/useIsMobile";
import Toast from "@/Components/UI/Toast";
import { CopyButton } from "../Transactions/TransactionDetailsModal.styled";

/* ================= TYPES ================= */

export type PaymentLinkStatus = "active" | "expired";

export interface PaymentLink {
  id: string;
  description: string;
  usdValue: string;
  createdAt: string;
  expiresAt: string;
  status: PaymentLinkStatus;
  timesUsed: number;
}

interface Props {
  paymentLinks: PaymentLink[];
  rowsPerPage?: number;
}

/* ================= ICON MAP (MOVED OUT) ================= */

const headerIconMap: Record<string, any> = {
  "linkIdHeader": TransactionIcon,
  "descriptionHeader": CryptoIcon,
  "usdValueHeader": RoundedStackIcon,
  "createdHeader": TimeIcon,
  "expiresHeader": TimeIcon,
  "statusHeader": HexagonIcon,
  "timesUsedHeader": TimeUsedIcon,
  "actionsHeader": ActionIcon,
};

/* ================= HEADER (MEMOIZED) ================= */

const Header = React.memo(({ label }: { label: string }) => {
  const { t } = useTranslation("paymentLinks");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {headerIconMap[label] && (
        <Image
          src={headerIconMap[label]}
          alt={label}
          width={18}
          height={18}
          draggable={false}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) brightness(95%) contrast(100%)",
          }}
        />
      )}

      <Typography
        sx={{
          fontSize: { xs: "13px", md: "15px" },
          fontWeight: 500,
          fontFamily: "UrbanistMedium",
          lineHeight: "100%",
          letterSpacing: 0,
          color: "#242428",
          whiteSpace: "nowrap",
        }}
      >
        {t(label)}
      </Typography>
    </Box>
  )
});

Header.displayName = "Header";

/* ================= COMPONENT ================= */

const PaymentLinksTable = ({ paymentLinks, rowsPerPage = 10 }: Props) => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(rowsPerPage);
  const { t } = useTranslation("paymentLinks");
  const tCommon = useCallback((key: string) => t(key, { ns: "common" }), [t]);
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const [openToast, setOpenToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = paymentLinks.length;
  const start = page * rows;
  const end = Math.min(start + rows, total);

  const paginatedData = paymentLinks.slice(start, end);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setOpenToast(false);

    setTimeout(() => {
      setOpenToast(true);
    }, 0);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setOpenToast(false);
    }, 2000);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          maxHeight: "fit-content",
        }}
      >
        <TransactionsTableContainer>
          <TransactionsTableScrollWrapper>
            <Table>
              {/* ================= TABLE HEAD ================= */}
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  backgroundColor: "#E5EDFF",
                }}
              >
                <TableRow sx={{ backgroundColor: "#E5EDFF" }}>
                  <TableCell><Header label="linkIdHeader" /></TableCell>
                  <TableCell><Header label="descriptionHeader" /></TableCell>
                  <TableCell><Header label="usdValueHeader" /></TableCell>
                  <TableCell><Header label="createdHeader" /></TableCell>
                  <TableCell><Header label="expiresHeader" /></TableCell>
                  <TableCell><Header label="statusHeader" /></TableCell>
                  <TableCell><Header label="timesUsedHeader" /></TableCell>
                  <TableCell align="center"><Header label="actionsHeader" /></TableCell>
                </TableRow>
              </TableHead>

              {/* ================= TABLE BODY ================= */}
              <TableBody sx={{ marginTop: "7px", overflowY: "auto" }}>
                {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableBodyCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.id}</TableBodyCell>
                    <TableBodyCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.description}</TableBodyCell>
                    <TableBodyCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.usdValue}</TableBodyCell>
                    <TableBodyCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.createdAt}</TableBodyCell>
                    <TableBodyCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.expiresAt}</TableBodyCell>

                    <TableCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>
                      <StatusChip status={row.status}>
                        {row.status === "active" ? (
                          <Image
                            src={TrueIcon}
                            alt="True Icon"
                            width={isMobile ? 12 : 14}
                            height={isMobile ? 12 : 14}
                            draggable={false}
                          />
                        ) : (
                          <Image
                            src={FalseIcon}
                            alt="False Icon"
                            width={isMobile ? 12 : 14}
                            height={isMobile ? 12 : 14}
                            draggable={false}
                          />
                        )}
                        {row.status === "active" ? "Active" : "Expired"}
                      </StatusChip>
                    </TableCell>

                    <TableCell sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>{row.timesUsed}</TableCell>

                    <TableCell align="center" sx={{ paddingY: isMobile ? "5px !important" : "11px !important" }}>
                      <CopyButton
                        onClick={() => handleCopy(row.id)}
                      >
                        <Image
                          src={CopyIcon}
                          alt="Copy Icon"
                          width={isMobile ? 12 : 14}
                          height={isMobile ? 12 : 14}
                          draggable={false}
                        />
                      </CopyButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TransactionsTableScrollWrapper>

          <TableFooter>
            <RowsPerPageSelector
              value={rows}
              onChange={(value) => {
                setRows(value);
                setPage(0);
              }}
              menuItems={[
                { value: 5, label: 5 },
                { value: 10, label: 10 },
                { value: 15, label: 15 },
                { value: 20, label: 20 },
              ]}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FooterText>
                Showing {paymentLinks.length > 0 ? start + 1 : 0}-{end} of {total}{" "}
                links
              </FooterText>
              <CustomButton
                label={"Previous"}
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
                    lineHeight: "100%",
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
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              />
              <CustomButton
                label={"Next"}
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
                    lineHeight: "100%",
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
                disabled={end >= total}
                onClick={() => setPage((p) => p + 1)}
              />

              <MobileNavigationButtons
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                <KeyboardArrowLeftRoundedIcon
                  sx={{ height: "16px", width: "16px", color: "inherit" }}
                />
              </MobileNavigationButtons>
              <MobileNavigationButtons
                onClick={() => setPage((p) => p + 1)}
                disabled={end >= total}
              >
                <KeyboardArrowRightRoundedIcon
                  sx={{ height: "16px", width: "16px", color: "inherit" }}
                />
              </MobileNavigationButtons>
            </Box>
          </TableFooter>
        </TransactionsTableContainer>
      </Box>

      <Toast
        open={openToast}
        message={tCommon("copiedToClipboard")}
        severity="success"
      />
    </>
  );
};

export default PaymentLinksTable;