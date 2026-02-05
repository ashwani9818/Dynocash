import { rootReducer } from "@/utils/types";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WalletAction } from "@/Redux/Actions";
import { WALLET_FETCH } from "@/Redux/Actions/WalletAction";

import BitcoinIcon from "@/assets/cryptocurrency/Bitcoin-icon.svg";
import EthereumIcon from "@/assets/cryptocurrency/Ethereum-icon.svg";
import LitecoinIcon from "@/assets/cryptocurrency/Litecoin-icon.svg";
import DogecoinIcon from "@/assets/cryptocurrency/Dogecoin-icon.svg";
import BitcoinCashIcon from "@/assets/cryptocurrency/BitcoinCash-icon.svg";
import TronIcon from "@/assets/cryptocurrency/Tron-icon.svg";
import USDTIcon from "@/assets/cryptocurrency/USDT-icon.svg";

/* ---------------------------------- Types --------------------------------- */

export type WalletType =
  | "BTC"
  | "ETH"
  | "LTC"
  | "DOGE"
  | "BCH"
  | "TRX"
  | "USDT-ERC20"
  | "USDT-TRC20";

export type CryptoCode =
  | "BTC"
  | "ETH"
  | "LTC"
  | "DOGE"
  | "BCH"
  | "TRX"
  | "USDT-ERC20"
  | "USDT-TRC20";

export interface WalletDataType {
  icon: any;
  walletTitle: WalletType;
  walletAddress: string;
  name: string;
  totalProcessed: number;
}

export interface Cryptocurrency {
  code: CryptoCode;
  name: string;
  icon: any;
}

/* ------------------------------- Static Maps ------------------------------- */

const WALLET_ORDER: readonly WalletType[] = [
  "BTC",
  "ETH",
  "LTC",
  "DOGE",
  "BCH",
  "TRX",
  "USDT-ERC20",
  "USDT-TRC20",
];

const WALLET_ICONS: Record<WalletType, any> = {
  BTC: BitcoinIcon,
  ETH: EthereumIcon,
  LTC: LitecoinIcon,
  DOGE: DogecoinIcon,
  BCH: BitcoinCashIcon,
  TRX: TronIcon,
  "USDT-ERC20": USDTIcon,
  "USDT-TRC20": USDTIcon,
};

const WALLET_NAMES: Record<WalletType, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LTC: "Litecoin",
  DOGE: "Dogecoin",
  BCH: "Bitcoin Cash",
  TRX: "Tron",
  "USDT-ERC20": "USDT-ERC20",
  "USDT-TRC20": "USDT-TRC20",
};

export const ALLCRYPTOCURRENCIES: readonly Cryptocurrency[] = [
  { code: "BTC", name: "Bitcoin", icon: BitcoinIcon },
  { code: "ETH", name: "Ethereum", icon: EthereumIcon },
  { code: "LTC", name: "Litecoin", icon: LitecoinIcon },
  { code: "DOGE", name: "Dogecoin", icon: DogecoinIcon },
  { code: "BCH", name: "Bitcoin Cash", icon: BitcoinCashIcon },
  { code: "TRX", name: "Tron", icon: TronIcon },
  { code: "USDT-ERC20", name: "USDT-ERC20", icon: USDTIcon },
  { code: "USDT-TRC20", name: "USDT-TRC20", icon: USDTIcon },
];

/* ------------------------------- Main Hook -------------------------------- */

// Shared refs outside the hook to prevent multiple instances from fetching simultaneously
const globalLastFetchedCompanyIdRef = { current: null as number | null };
const globalIsFetchingRef = { current: false };

export const useWalletData = () => {
  const dispatch = useDispatch();
  const walletState = useSelector((state: rootReducer) => state.walletReducer);
  const companyState = useSelector((state: rootReducer) => state.companyReducer);
  const walletLoading = Boolean(walletState?.loading);
  const [walletWarning, setWalletWarning] = useState(false);
  
  // Use a stable reference to the selected company ID
  const selectedCompanyId = companyState.selectedCompanyId;
  const prevCompanyIdRef = useRef<number | null>(null);

  // Fetch wallets when company is selected or switched
  useEffect(() => {
    const currentCompanyId = selectedCompanyId;
    
    // Skip if company ID hasn't actually changed
    if (prevCompanyIdRef.current === currentCompanyId) {
      return;
    }
    
    // Update the previous company ID ref
    prevCompanyIdRef.current = currentCompanyId;
    
    // Skip if no company selected
    if (!currentCompanyId) {
      globalLastFetchedCompanyIdRef.current = null;
      globalIsFetchingRef.current = false;
      return;
    }
    
    // Skip if this is the same company we already fetched (using global ref)
    if (globalLastFetchedCompanyIdRef.current === currentCompanyId) {
      // Reset fetching flag if loading is complete
      if (!walletLoading) {
        globalIsFetchingRef.current = false;
      }
      return;
    }
    
    // Skip if currently loading or already fetching (using global ref)
    if (walletLoading || globalIsFetchingRef.current) {
      return;
    }
    
    // Mark that we're fetching for this company BEFORE dispatching (using global ref)
    globalIsFetchingRef.current = true;
    globalLastFetchedCompanyIdRef.current = currentCompanyId;
    dispatch(WalletAction(WALLET_FETCH, { company_id: currentCompanyId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]); // Only depend on company ID - walletLoading is checked inside but not in deps
  
  // Reset fetching flag when loading completes
  useEffect(() => {
    if (!walletLoading) {
      globalIsFetchingRef.current = false;
    }
  }, [walletLoading]);

  /* ---------------------------- Wallet Data ---------------------------- */

  const walletData = useMemo<WalletDataType[]>(() => {
    const list = Array.isArray(walletState?.walletList)
      ? walletState.walletList
      : [];
    if (!list.length) return [];

    return list
      .filter(
        (wallet) =>
          WALLET_ORDER.includes(wallet.wallet_type as WalletType) &&
          Boolean(wallet.wallet_address)
      )
      .sort(
        (a, b) =>
          WALLET_ORDER.indexOf(a.wallet_type as WalletType) -
          WALLET_ORDER.indexOf(b.wallet_type as WalletType)
      )
      .map((wallet) => {
        const type = wallet.wallet_type as WalletType;

        return {
          icon: WALLET_ICONS[type],
          walletTitle: type,
          walletAddress: wallet.wallet_address,
          name: WALLET_NAMES[type],
          totalProcessed: Number(wallet.amount_in_usd) || 0,
        };
      });
  }, [walletState?.walletList]);

  /* ------------------ Cryptocurrencies NOT in Wallet ------------------ */

  const cryptocurrencies = useMemo<Cryptocurrency[]>(() => {
    if (!walletData.length) return [...ALLCRYPTOCURRENCIES];

    return ALLCRYPTOCURRENCIES.filter(
      (crypto) =>
        !walletData.some((wallet) => wallet.walletTitle === crypto.code)
    );
  }, [walletData]);

  useEffect(() => {
    if (walletLoading) {
      setWalletWarning(false);
      return;
    }
    setWalletWarning(cryptocurrencies.length > 0);
  }, [walletLoading, cryptocurrencies]);

  const activeWalletsData = useMemo(() => {
    return ALLCRYPTOCURRENCIES.filter((crypto) => {
      return !cryptocurrencies.some((c) => c.code === crypto.code);
    });
  }, [cryptocurrencies]);

  return {
    walletLoading,
    walletData,
    cryptocurrencies,
    walletWarning,
    activeWalletsData,
  };
};
