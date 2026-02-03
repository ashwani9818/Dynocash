import React, { useState, useRef, useCallback, useMemo } from "react";
import { Box, Typography, useTheme, Menu, ListItemButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import CustomDatePicker, {
  DateRange,
  DatePickerRef,
} from "@/Components/UI/DatePicker";
import CustomButton from "@/Components/UI/Buttons";
import useIsMobile from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import {
  TransactionsTopBarContainer,
  DatePickerTriggerButton,
  WalletSelectorButton,
  SearchIconButton,
  SearchContainer,
  FiltersContainer,
  DatePickerWrapper,
  WalletSelectorWrapper,
  ExportButtonWrapper,
  CryptoIconChip,
} from "./styled";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import { format } from "date-fns";
import SearchIcon from "@/assets/Icons/search-icon.svg";
import CalendarIcon from "@/assets/Icons/calendar-icon.svg";
import WalletIcon from "@/assets/Icons/wallet-icon.svg";
import ExportIcon from "@/assets/Icons/export-icon.svg";
import BitcoinIcon from "@/assets/cryptocurrency/Bitcoin-icon.svg";
import EthereumIcon from "@/assets/cryptocurrency/Ethereum-icon.svg";
import LitecoinIcon from "@/assets/cryptocurrency/Litecoin-icon.svg";
import Image from "next/image";
import { ALLCRYPTOCURRENCIES } from "@/hooks/useWalletData";
interface TransactionsTopBarProps {
  onSearch?: (searchTerm: string) => void;
  onDateRangeChange?: (dateRange: DateRange) => void;
  onWalletChange?: (wallet: string) => void;
  onExport?: () => void;
}

const TransactionsTopBar: React.FC<TransactionsTopBarProps> = ({
  onSearch,
  onDateRangeChange,
  onWalletChange,
  onExport,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const { t } = useTranslation("transactions");
  const tTransactions = useCallback(
    (key: string) => t(key, { ns: "transactions" }),
    [t]
  );
  const datePickerRef = useRef<DatePickerRef>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const walletButtonRef = useRef<HTMLButtonElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [selectedWallet, setSelectedWallet] = useState("all");
  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  const handleWalletChange = (value: string) => {
    setSelectedWallet(value);
    setWalletMenuAnchor(null);
    onWalletChange?.(value);
  };

  const handleWalletButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    setWalletMenuAnchor(e.currentTarget);
  };

  const handleWalletMenuClose = () => {
    setWalletMenuAnchor(null);
  };

  const handleCalendarButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    if (datePickerRef.current) {
      datePickerRef.current.open(e);
    }
  };

  const formatDateRange = (): string => {
    if (dateRange.startDate && dateRange.endDate) {
      if (isMobile) {
        return `${format(dateRange.startDate, "dd.MM.yy")}-${format(
          dateRange.endDate,
          "dd.MM.yy"
        )}`;
      }
      return `${format(dateRange.startDate, "MMM dd, yyyy")} - ${format(
        dateRange.endDate,
        "MMM dd, yyyy"
      )}`;
    }
    if (dateRange.startDate) {
      if (isMobile) {
        return format(dateRange.startDate, "dd.MM.yy");
      }
      return format(dateRange.startDate, "MMM dd, yyyy");
    }
    return isMobile ? tTransactions("period") : tTransactions("selectDateRange");
  };

  const walletOptions = useMemo(
    () => [
      {
        value: "all",
        label: tTransactions("allWallets"),
        code: "ALL",
        icon: WalletIcon,
      },
      ...ALLCRYPTOCURRENCIES.map((crypto, index) => ({
        value: `wallet${index + 1}`,
        label: crypto.name,
        code: crypto.code,
        icon: crypto.icon,
      })),
    ],
    [tTransactions]
  );

  return (
    <TransactionsTopBarContainer>
      <SearchContainer>
        <InputField
          inputHeight={isMobile ? "32px" : "40px"}
          placeholder={tTransactions("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyPress}
        />
        <SearchIconButton onClick={handleSearch}>
          <Image src={SearchIcon} alt="search" width={20} height={20} />
        </SearchIconButton>
      </SearchContainer>

      <FiltersContainer>
        <DatePickerWrapper>
          <DatePickerTriggerButton
            ref={buttonRef}
            onClick={handleCalendarButtonClick}
          >
            <Image
              src={CalendarIcon}
              alt="calendar"
              width={14}
              height={14}
              style={{
                filter: "brightness(0) saturate(100%) invert(0%)",
              }}
            />
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: isMobile ? "13px" : "15px",
                fontFamily: "UrbanistMedium",
                fontWeight: 500,
                lineHeight: 1.2,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "left",
                flex: 1,
              }}
            >
              {formatDateRange()}
            </Typography>
            <Box className="separator" />
            <KeyboardArrowDownIcon className="arrow-icon" />
          </DatePickerTriggerButton>
          <Box
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <CustomDatePicker
              ref={datePickerRef}
              value={dateRange}
              onChange={handleDateRangeChange}
              hideTrigger={true}
            />
          </Box>
        </DatePickerWrapper>

        <WalletSelectorWrapper>
          <WalletSelectorButton
            ref={walletButtonRef}
            onClick={handleWalletButtonClick}
          >
            <Image src={WalletIcon} alt="wallet" width={17} height={17} />
            <Typography className="wallet-text">
              {walletOptions.find((opt) => opt.value === selectedWallet)
                ?.label || tTransactions("allWallets")}
            </Typography>
            <Box className="separator" />
            <KeyboardArrowDownIcon className="arrow-icon" />
          </WalletSelectorButton>
          <Menu
            anchorEl={walletMenuAnchor}
            open={Boolean(walletMenuAnchor)}
            onClose={handleWalletMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                mt: "8px",
                borderRadius: "6px",
                minWidth: isMobile ? "180px" : "240px",
                boxShadow: "rgba(16, 24, 40, 0.12) 0px 8px 24px 0px",
                border: `1px solid ${theme.palette.border.main}`,
                padding: "0 8px",
              },
            }}
          >
            {/* Menu Items */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "4px" : "6px",
              }}
            >
              {walletOptions.map((option) => (
                <ListItemButton
                  key={option.value}
                  onClick={() => handleWalletChange(option.value)}
                  selected={selectedWallet === option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "13px" : "15px",
                    fontFamily: "UrbanistMedium",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    padding: "3px 8px 3px 3px",
                    borderRadius: "50px",
                    backgroundColor:
                      selectedWallet === option.value
                        ? theme.palette.primary.light
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.light,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    },
                  }}
                >
                  {/* Icon and Code Badge Combined */}
                  <CryptoIconChip
                    sx={{
                      width: "fit-content",
                      background: theme.palette.secondary.light,
                      height: isMobile ? "24px" : "32px",
                    }}
                  >
                    <Image
                      src={option.icon}
                      alt={option.label}
                      draggable={false}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {option.code}
                    </Typography>
                  </CryptoIconChip>

                  {/* Label */}
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: isMobile ? "13px" : "14px",
                      fontFamily: "UrbanistMedium",
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                      lineHeight: "1.2",
                    }}
                  >
                    {option.label}
                  </Typography>

                  {/* Checkmark */}
                  {selectedWallet === option.value && (
                    <CheckIcon
                      sx={{
                        fontSize: "18px",
                        color: theme.palette.text.primary,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </ListItemButton>
              ))}
            </Box>
          </Menu>
        </WalletSelectorWrapper>

        <ExportButtonWrapper>
          <CustomButton
            label={tTransactions("export")}
            startIcon={
              <Image
                src={ExportIcon}
                alt="export"
                width={isMobile ? 13 : 17}
                height={isMobile ? 13 : 17}
              />
            }
            variant="secondary"
            onClick={onExport}
            sx={{
              padding: isMobile ? "8px 16px" : "10px 60px",
              minWidth: "auto",
              height: isMobile ? "32px" : "40px",
              fontSize: isMobile ? "13px" : "15px",
              fontFamily: "UrbanistMedium",
              fontWeight: 500,
            }}
          />
        </ExportButtonWrapper>
      </FiltersContainer>
    </TransactionsTopBarContainer>
  );
};

export default TransactionsTopBar;
