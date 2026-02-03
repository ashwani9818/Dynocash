import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Popover,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import useIsMobile from "@/hooks/useIsMobile";
import Image from "next/image";
import {
  CryptocurrencyTrigger,
  CryptocurrencyIcon,
  CryptocurrencyText,
  CryptocurrencyDropdown,
  CryptocurrencyDividerLine,
  IconChip,
} from "./styled";

// Import cryptocurrency icons
import BitcoinIcon from "@/assets/cryptocurrency/Bitcoin-icon.svg";
import EthereumIcon from "@/assets/cryptocurrency/Ethereum-icon.svg";
import LitecoinIcon from "@/assets/cryptocurrency/Litecoin-icon.svg";
import BNBIcon from "@/assets/cryptocurrency/BNB-icon.svg";
import DogecoinIcon from "@/assets/cryptocurrency/Dogecoin-icon.svg";
import BitcoinCashIcon from "@/assets/cryptocurrency/BitcoinCash-icon.svg";
import TronIcon from "@/assets/cryptocurrency/Tron-icon.svg";
import USDTIcon from "@/assets/cryptocurrency/USDT-icon.svg";
import { useWalletData } from "@/hooks/useWalletData";

// Cryptocurrency data
export interface Cryptocurrency {
  code: string;
  name: string;
  icon: any;
}

// export const cryptocurrencies: Cryptocurrency[] = [
//   { code: "BTC", name: "Bitcoin", icon: BitcoinIcon },
//   { code: "ETH", name: "Ethereum", icon: EthereumIcon },
//   { code: "LTC", name: "Litecoin", icon: LitecoinIcon },
//   { code: "BNB", name: "BNB", icon: BNBIcon },
//   { code: "DOGE", name: "Dogecoin", icon: DogecoinIcon },
//   { code: "BCH", name: "Bitcoin Cash", icon: BitcoinCashIcon },
//   { code: "TRX", name: "Tron", icon: TronIcon },
//   { code: "USDT", name: "USDT", icon: USDTIcon },
// ];



export interface CryptocurrencySelectorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  name?: string;
  sx?: React.CSSProperties;
  sxIconChip?: React.CSSProperties;
}

const CryptocurrencySelector: React.FC<CryptocurrencySelectorProps> = ({
  label,
  value = "BTC",
  onChange,
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  name,
  sx,
  sxIconChip,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile("sm");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { cryptocurrencies } = useWalletData();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (cryptoCode: string) => {
    onChange?.(cryptoCode);
    handleClose();
  };

  const selectedCrypto =
    cryptocurrencies.find((c) => c.code === value) || cryptocurrencies[0];
  const isOpen = Boolean(anchorEl);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        anchorEl &&
        !(anchorEl as HTMLElement).contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, anchorEl]);

  const borderColor = error
    ? theme.palette.error.main
    : theme.palette.border.main;
  const focusBorderColor = error
    ? theme.palette.error.main
    : theme.palette.border.focus;

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        ...sx,
      }}
    >
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: isMobile ? "13px" : "15px",
            textAlign: "start",
            color: theme.palette.text.primary,
            lineHeight: "1.2",
          }}
        >
          {label}
          {required && (
            <Typography
              component="span"
              sx={{ color: theme.palette.text.primary, ml: 0.5 }}
            >
              *
            </Typography>
          )}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        <CryptocurrencyTrigger
          ref={triggerRef}
          onClick={handleOpen}
          error={error}
          fullWidth={fullWidth}
          isOpen={isOpen}
          isMobile={isMobile}
          sx={{
            borderColor: borderColor,
            borderRadius: "6px",
            "&:hover": {
              borderColor: focusBorderColor,
            },
            "&:focus": {
              borderColor: focusBorderColor,
            },
            "&:focus-visible": {
              borderColor: focusBorderColor,
            },
            "&:active": {
              borderColor: focusBorderColor,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
            }}
          >
            <IconChip sx={{ minWidth: "fit-content", height: "28px", ...sxIconChip }}>
              <CryptocurrencyIcon
                src={selectedCrypto.icon}
                alt={selectedCrypto.name}
                width={20}
                height={20}
              />
              <span>{selectedCrypto.code}</span>
            </IconChip>
            <CryptocurrencyText isMobile={isMobile}>
              {selectedCrypto.name}
            </CryptocurrencyText>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CryptocurrencyDividerLine />
            {isOpen ? (
              <ExpandLessIcon
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: isMobile ? "18px" : "20px",
                }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: isMobile ? "18px" : "20px",
                }}
              />
            )}
          </Box>
        </CryptocurrencyTrigger>

        <Popover
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              mt: "-1px",
              borderRadius: "6px",
              overflow: "hidden",
              width: triggerRef.current?.offsetWidth || "auto",
              border: `1px solid ${borderColor}`,
              borderTop: "none",
              maxHeight: "200px",
              backgroundColor: theme.palette.common.white,
            },
          }}
        >
          <CryptocurrencyDropdown>
            {cryptocurrencies.map((crypto) => (
              <ListItemButton
                key={crypto.code}
                onClick={() => handleSelect(crypto.code)}
                selected={crypto.code === value}
                sx={{
                  borderRadius: "50px",
                  p: 1,
                  gap: 1.5,
                  minHeight: "40px",
                  background:
                    crypto.code === value
                      ? theme.palette.primary.light
                      : "transparent",
                  "&:hover": {
                    background: theme.palette.primary.light,
                  },
                  "&.Mui-selected": {
                    background: theme.palette.primary.light,
                    "&:hover": {
                      background: theme.palette.primary.light,
                    },
                  },
                }}
              >
                <IconChip sx={{ minWidth: "fit-content" }}>
                  <CryptocurrencyIcon src={crypto.icon} alt={crypto.name} width={20} height={20} />
                  <span>{crypto.code}</span>
                </IconChip>
                <ListItemText
                  primary={crypto.name}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "UrbanistMedium",
                      fontWeight: 500,
                      fontSize: "15px",
                      color: theme.palette.text.primary,
                      lineHeight: "1",
                    },
                  }}
                />
                {crypto.code === value && (
                  <CheckIcon
                    sx={{
                      fontSize: "18px",
                      color: theme.palette.text.primary,
                      ml: "auto",
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </CryptocurrencyDropdown>
        </Popover>

        {helperText && (
          <Typography
            sx={{
              margin: "4px 0 0 0",
              fontSize: isMobile ? "10px" : "13px",
              fontWeight: 500,
              color: error
                ? theme.palette.error.main
                : theme.palette.text.secondary,
              lineHeight: "1.5",
              textAlign: "start",
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CryptocurrencySelector;
