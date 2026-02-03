import React, { useCallback, useState, useRef, useMemo, memo } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import PanelCard from "@/Components/UI/PanelCard";
import CustomButton from "@/Components/UI/Buttons";
import { ArrowOutward, TrendingUp, Add, Remove } from "@mui/icons-material";
import Image from "next/image";
import TransactionIcon from "@/assets/Icons/transaction.svg";
import WalletIcon from "@/assets/Icons/wallet-grey.svg";
import { useTranslation } from "react-i18next";
import { PercentageChip } from "./styled";
import ArrowUpSuccessIcon from "@/assets/Icons/up-success.svg";
import RoundedStackIcon from "@/assets/Icons/roundedStck-icon.svg";
import { formatNumberWithComma, getCurrencySymbol } from "@/helpers";
import {
  CryptocurrencyIcon,
  IconChip,
} from "@/Components/UI/CryptocurrencySelector/styled";
import useIsMobile from "@/hooks/useIsMobile";
import ReusableAreaChart from "@/Components/UI/AreaChart";
import TimePeriodSelector, {
  TimePeriod,
} from "@/Components/UI/TimePeriodSelector";
import { useRouter } from "next/router";
import { DateRange } from "@/Components/UI/DatePicker";
import {
  eachDayOfInterval,
  endOfDay,
  isAfter,
  isValid,
  startOfDay,
} from "date-fns";
import { useWalletData } from "@/hooks/useWalletData";

// Active wallets data array
interface ActiveWallet {
  code: string;
  icon: any;
}

// const activeWalletsData: ActiveWallet[] = [
//   { code: "BTC", icon: BitcoinIcon },
//   { code: "ETH", icon: EthereumIcon },
//   { code: "LTC", icon: LitecoinIcon },
//   // { code: "BNB", icon: BNBIcon },
//   { code: "DOGE", icon: DogecoinIcon },
//   { code: "BCH", icon: BitcoinCashIcon },
//   { code: "TRX", icon: TronIcon },
//   { code: "USDT", icon: USDTIcon },
// ];

// Helper function to format date as "MMM D" (e.g., "Nov 30")
const formatDate = (date: Date): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

// Helper function to generate date range based on period
type SelectedPeriod = TimePeriod | DateRange;

const isDateRange = (value: SelectedPeriod): value is DateRange => {
  return typeof value !== "string";
};

const normalizeDateRange = (range: DateRange): DateRange => {
  const normalizedStart =
    range.startDate && isValid(range.startDate)
      ? startOfDay(range.startDate)
      : null;
  const normalizedEnd =
    range.endDate && isValid(range.endDate) ? endOfDay(range.endDate) : null;

  if (
    normalizedStart &&
    normalizedEnd &&
    isAfter(normalizedStart, normalizedEnd)
  ) {
    return { startDate: normalizedStart, endDate: null };
  }

  return { startDate: normalizedStart, endDate: normalizedEnd };
};

const generateDateRange = (period: SelectedPeriod): Date[] => {
  const today = startOfDay(new Date());

  if (isDateRange(period)) {
    const normalized = normalizeDateRange(period);
    if (!normalized.startDate) {
      return [];
    }
    const intervalEnd = normalized.endDate
      ? startOfDay(normalized.endDate)
      : normalized.startDate;
    if (isAfter(normalized.startDate, intervalEnd)) {
      return [];
    }
    return eachDayOfInterval({
      start: normalized.startDate,
      end: intervalEnd,
    }).map((d) => startOfDay(d));
  }

  let days = 7;
  if (period === "30days") days = 30;
  else if (period === "90days") days = 90;
  else if (period === "custom") days = 7;

  const dates: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(startOfDay(date));
  }
  return dates;
};

// Helper function to process and fill in missing dates
const processTransactionData = (
  rawData: Array<{ date: string; value: number }>,
  period: SelectedPeriod
): Array<{ date: string; value: number }> => {
  const dateRange = generateDateRange(period);
  const safeDateRange =
    dateRange.length > 0 ? dateRange : generateDateRange("7days");
  const dateMap = new Map<string, number>();

  // Create a map of existing data by date string
  rawData.forEach((item) => {
    dateMap.set(item.date, item.value);
  });

  // Fill in all dates in the range
  const result = safeDateRange.map((date) => {
    const dateStr = formatDate(date);
    return {
      date: dateStr,
      value: dateMap.get(dateStr) ?? 0,
    };
  });

  return result;
};

// Transaction Volume Chart Component
const TransactionVolumeChart = ({
  selectedPeriod,
}: {
  selectedPeriod: SelectedPeriod;
}) => {
  const isMobile = useIsMobile("md");
  const isSmall = useIsMobile("sm");

  // Raw transaction data (this would come from API in real app)
  // SAMPLE DATA FOR TESTING - Uncomment the scenarios you want to test:

  // Scenario 1: No data (new account) - shows grid only, no line
  // const rawTransactionData = useMemo(
  //   () => [
  //     // Empty array for no data
  //   ],
  //   []
  // );

  // Scenario 2: Single data point - shows one dot with line from 0
  // const rawTransactionData = useMemo(
  //   () => [
  //     { date: "Dec 24", value: 8000 },
  //   ],
  //   []
  // );

  // Scenario 3: Multiple data points with gaps - fills missing dates
  // const rawTransactionData = useMemo(
  //   () => [
  //     { date: "Dec 24", value: 6000 },
  //     { date: "Dec 25", value: 12000 },
  //     { date: "Dec 27", value: 8000 },
  //     { date: "Dec 28", value: 13500 },
  //   ],
  //   []
  // );

  // Scenario 4: Large value fluctuation - tests Y-axis domain
  const rawTransactionData = useMemo(
    () => [
      { date: "Jan 12", value: 800 },
      { date: "Jan 13", value: 12000 },
      { date: "Jan 14", value: 6000 },
      { date: "Jan 15", value: 114500 },
      { date: "Jan 16", value: 12000 },
    ],
    []
  );

  // Scenario 5: Full 7 days of data
  // const rawTransactionData = useMemo(
  //   () => [
  //     {date: "Dec 1", value: 2000},
  //     {date: "Dec 2", value: 4000},
  //     {date: "Dec 3", value: 0},
  //     {date: "Dec 4", value: 8000},
  //     {date: "Dec 5", value: 10000},
  //     {date: "Dec 6", value: 12000},
  //     {date: "Dec 7", value: 14000},
  //     {date: "Dec 8", value: 0},
  //     {date: "Dec 9", value: 18000},
  //     {date: "Dec 10", value: 20000},
  //     {date: "Dec 11", value: 22000},
  //     {date: "Dec 12", value: 0},
  //     {date: "Dec 13", value: 26000},
  //     {date: "Dec 14", value: 28000},
  //     {date: "Dec 15", value: 30000},
  //     {date: "Dec 16", value: 0},
  //     {date: "Dec 17", value: 34000},
  //     {date: "Dec 18", value: 36000},
  //     {date: "Dec 19", value: 0},
  //     {date: "Dec 20", value: 40000},
  //     {date: "Dec 21", value: 42000},
  //     {date: "Dec 22", value: 0},
  //     {date: "Dec 23", value: 46000},
  //     {date: "Dec 24", value: 48000},
  //     {date: "Dec 25", value: 50000},
  //     {date: "Dec 26", value: 52000},
  //     {date: "Dec 27", value: 54000},
  //     {date: "Dec 28", value: 56000},
  //     {date: "Dec 29", value: 58000},
  //     {date: "Dec 30", value: 60000},
  //     {date: "Dec 31", value: 62000},
  //   ],
  //   []
  // );

  // Process data to fill in missing dates based on selected period
  const transactionData = useMemo(
    () => processTransactionData(rawTransactionData, selectedPeriod),
    [rawTransactionData, selectedPeriod]
  );

  // Check if we have any non-zero data
  const hasData = useMemo(
    () => transactionData.some((item) => item.value > 0),
    [transactionData]
  );

  return (
    <Box sx={{ width: "100%", mt: isMobile ? "14px" : "12px" }}>
      <ReusableAreaChart
        data={transactionData}
        dataKey="date"
        valueKey="value"
        width={isMobile ? "100%" : "800px"}
        height={320}
        strokeWidth={3}
        dotRadius={5}
        showDots={true}
        showGrid={true}
        gridColor="#D9D9D9"
        gridStrokeDasharray="3 3"
        curveType="monotone"
        margin={{ top: 20, right: 0, bottom: 0, left: 10 }}
        yAxisTickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        yAxisDomain={[0, 16000]}
        tooltipLabelFormatter={(data) => data.date}
        tooltipValueFormatter={(value) => [
          getCurrencySymbol("USD", formatNumberWithComma(value)),
          "Volume",
        ]}
        gradientStartColor="#D1E0FF"
        gradientEndColor="#E5EDFF"
        gradientStartOpacity={0.8}
        gradientEndOpacity={0}
        tooltipLabel="Volume"
        isAnimationActive={true}
        animationDuration={500}
        enableHorizontalScroll={true}
        gridCellWidthMobile={
          selectedPeriod === "7days" && isSmall ? 82 : isMobile ? 132 : 105
        }
        gridCellHeightMobile={60}
        gridCellWidthDesktop={150.5}
        gridCellHeightDesktop={72.25}
        hasData={hasData}
      />
    </Box>
  );
};

const StatCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
}) => {
  const theme = useTheme();
  return (
    <PanelCard
      showHeaderBorder={false}
      headerPadding={theme.spacing(2.5)}
      bodyPadding={theme.spacing(2.5)}
      sx={{ height: "100%" }}
      headerAction={
        <Box
          sx={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: theme.palette.grey[100],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src={icon} alt={title} width={16} height={16} />
        </Box>
      }
    >
      <Box>
        <Typography
          sx={{
            fontSize: "15px",
            color: theme.palette.text.secondary,
            mb: 1,
            fontFamily: "UrbanistRegular",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: change ? 1 : 0,
            fontFamily: "UrbanistMedium",
          }}
        >
          {value}
        </Typography>
        {change && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: "#10B981" }} />
            <Typography
              sx={{
                fontSize: "13px",
                color: "#10B981",
                fontFamily: "UrbanistMedium",
              }}
            >
              {change}
            </Typography>
          </Box>
        )}
      </Box>
    </PanelCard>
  );
};

// Memoized wallet card component to prevent re-renders during drag
const ActiveWalletsCard = memo(
  ({
    title,
    icon,
    isMobile,
  }: {
    title: string;
    icon: any;
    isMobile: boolean;
  }) => {
    const theme = useTheme();
    return (
      <IconChip
        sx={{
          padding: "6px 8px !important",
          minWidth: "fit-content",
          height: "30px",
          alignItems: "center",
          flexShrink: 0,
          "& img": {
            userSelect: "none",
            WebkitUserDrag: "none",
            pointerEvents: "none",
            WebkitTouchCallout: "none",
          },
        }}
      >
        <CryptocurrencyIcon
          src={icon}
          alt={title}
          width={18}
          height={18}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          style={{ userSelect: "none", pointerEvents: "none" }}
        />
        <span
          style={{
            fontSize: isMobile ? "11px" : "13px",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            flexShrink: 0,
          }}
        >
          {title}
        </span>
      </IconChip>
    );
  }
);

ActiveWalletsCard.displayName = "ActiveWalletsCard";

const DashboardLeftSection = () => {
  const theme = useTheme();
  const namespaces = ["dashboardLayout", "common"];
  const isMobile = useIsMobile("md");
  const router = useRouter();
  const [showAllWallets, setShowAllWallets] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const statCardsContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const statCardsDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const statCardsStartXRef = useRef(0);
  const statCardsScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isStatCardsDragging, setIsStatCardsDragging] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("7days");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const { t } = useTranslation(namespaces);
  const tDashboard = useCallback(
    (key: string) => t(key, { ns: "dashboardLayout" }),
    [t]
  );

  const { activeWalletsData } = useWalletData();

  const maxWalletsToShow = isMobile ? 2 : 3;
  const walletsToDisplay = showAllWallets
    ? activeWalletsData
    : activeWalletsData.slice(0, maxWalletsToShow);
  const hasMoreWallets = activeWalletsData.length > maxWalletsToShow;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isStatCardsDragging) return;
      if (!showAllWallets || !scrollContainerRef.current) return;
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    },
    [showAllWallets, isStatCardsDragging]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        !isDraggingRef.current ||
        !scrollContainerRef.current ||
        !showAllWallets
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 2; // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    },
    [showAllWallets]
  );

  const handleMouseUp = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) {
      e.stopPropagation();
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (e) {
        e.stopPropagation();
      }
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    []
  );

  const handleStatCardsMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!statCardsContainerRef.current) return;
      if (
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest("a")
      )
        return;
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.contains(e.target as Node)
      )
        return;
      e.preventDefault();
      statCardsDraggingRef.current = true;
      setIsStatCardsDragging(true);
      statCardsStartXRef.current =
        e.pageX - statCardsContainerRef.current.offsetLeft;
      statCardsScrollLeftRef.current = statCardsContainerRef.current.scrollLeft;
    },
    []
  );

  const handleStatCardsMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!statCardsDraggingRef.current || !statCardsContainerRef.current)
        return;
      if (isDraggingRef.current) return;
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.contains(e.target as Node)
      )
        return;
      e.preventDefault();
      const x = e.pageX - statCardsContainerRef.current.offsetLeft;
      const walk = (x - statCardsStartXRef.current) * 2;
      statCardsContainerRef.current.scrollLeft =
        statCardsScrollLeftRef.current - walk;
    },
    []
  );

  const handleStatCardsMouseUp = useCallback(() => {
    statCardsDraggingRef.current = false;
    setIsStatCardsDragging(false);
  }, []);

  const handleStatCardsMouseLeave = useCallback(() => {
    statCardsDraggingRef.current = false;
    setIsStatCardsDragging(false);
  }, []);

  return (
    <Box>
      {/* Stat Cards */}
      <Box
        ref={statCardsContainerRef}
        onMouseDown={handleStatCardsMouseDown}
        onMouseMove={handleStatCardsMouseMove}
        onMouseUp={handleStatCardsMouseUp}
        onMouseLeave={handleStatCardsMouseLeave}
        sx={{
          mb: 2.5,
          display: "flex",
          gap: isMobile ? "8px" : "16px",
          overflowX: "auto",
          overflowY: "hidden",
          cursor: isStatCardsDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          willChange: isStatCardsDragging ? "scroll-position" : "auto",
          "& img": {
            userSelect: "none",
            WebkitUserDrag: "none",
            pointerEvents: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            KhtmlUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          },
          "& *": {
            userSelect: "none",
            WebkitUserDrag: "none",
          },
          "& button": {
            pointerEvents: "auto",
          },
          "&::-webkit-scrollbar": {
            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
          },
        }}
      >
        {/* Total Transactions */}
        <PanelCard
          title={tDashboard("totalTransactions")}
          showHeaderBorder={false}
          headerPadding={
            isMobile
              ? theme.spacing(2, 2, 0, 2)
              : theme.spacing(2.5, 2.5, 0, 2.5)
          }
          bodyPadding={
            isMobile
              ? theme.spacing(1.5, 2, 2, 2)
              : theme.spacing(2, 2, 2.5, 2.5)
          }
          sx={{
            width: { xs: "200px", sm: "240px", md: "315px" },
            height: { xs: "128px", sm: "140px", md: "176px" },
            flexShrink: 0,
          }}
          headerAction={
            <IconButton
              sx={{
                padding: "8px",
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Image
                src={TransactionIcon}
                alt="Transaction Icon"
                width={17}
                height={14}
                style={{
                  width: "clamp(14px, 2vw, 17px)",
                  height: "auto",
                }}
                draggable={false}
              />
            </IconButton>
          }
        >
          <Typography
            sx={{
              fontSize: isMobile ? "20px" : "40px",
              color: theme.palette.text.primary,
              fontFamily: "UrbanistMedium",
              lineHeight: 1.2,
              fontWeight: 500,
              letterSpacing: 0,
            }}
          >
            4
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: { xs: "18px", sm: 3, md: 2.5 },
            }}
          >
            <PercentageChip
              sx={{ padding: isMobile ? "7px 3px" : "5px 7px", lineHeight: 0 }}
            >
              <Image
                src={ArrowUpSuccessIcon}
                alt="Arrow Up Success Icon"
                width={11}
                height={11}
                style={{
                  width: "clamp(8px, 2vw, 11px)",
                  height: "auto",
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: isMobile ? "10px" : "13px",
                  color: theme.palette.border.success,
                  fontFamily: "UrbanistMedium",
                  lineHeight: 0,
                  padding: isMobile ? "0px 2px" : "8px 0px",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                12%
              </Typography>
            </PercentageChip>
            <Typography
              sx={{
                fontSize: isMobile ? "10px" : "13px",
                color: theme.palette.text.secondary,
                fontFamily: "UrbanistMedium",
                lineHeight: "100%",
                fontWeight: 500,
                letterSpacing: 0,
              }}
            >
              {t("comparedToLastMonth")}
            </Typography>
          </Box>
        </PanelCard>

        {/* Total Volume */}
        <PanelCard
          title={t("totalVolume")}
          showHeaderBorder={false}
          headerPadding={
            isMobile
              ? theme.spacing(2, 2, 0, 2)
              : theme.spacing(2.5, 2.5, 0, 2.5)
          }
          bodyPadding={
            isMobile ? theme.spacing(1.5, 2, 2, 2) : theme.spacing(2, 2, 2.5, 2)
          }
          sx={{
            width: { xs: "200px", sm: "240px", md: "315px" },
            height: { xs: "128px", sm: "140px", md: "176px" },
            flexShrink: 0,
          }}
          headerAction={
            <IconButton
              sx={{
                padding: "8px",
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Image
                src={RoundedStackIcon}
                alt="Rounded Stack Icon"
                width={17}
                height={14}
                style={{
                  width: "clamp(14px, 2vw, 17px)",
                  height: "auto",
                }}
                draggable={false}
              />
            </IconButton>
          }
        >
          <Typography
            sx={{
              fontSize: isMobile ? "20px" : "40px",
              color: theme.palette.text.primary,
              fontFamily: "UrbanistMedium",
              lineHeight: 1.2,
              fontWeight: 500,
              letterSpacing: 0,
            }}
          >
            {getCurrencySymbol("USD", formatNumberWithComma(6479.25))}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: 1,
              mt: { xs: "18px", sm: 3, md: 2.5 },
            }}
          >
            <PercentageChip
              sx={{ padding: isMobile ? "7px 3px" : "5px 7px", lineHeight: 0 }}
            >
              <Image
                src={ArrowUpSuccessIcon}
                alt="Arrow Up Success Icon"
                width={11}
                height={11}
                style={{
                  width: "clamp(8px, 2vw, 11px)",
                  height: "auto",
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: isMobile ? "10px" : "13px",
                  color: theme.palette.border.success,
                  fontFamily: "UrbanistMedium",
                  lineHeight: 0,
                  padding: isMobile ? "0px 2px" : "8px 0px",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                8.5%
              </Typography>
            </PercentageChip>
            <Typography
              sx={{
                fontSize: isMobile ? "10px" : "13px",
                color: theme.palette.text.secondary,
                fontFamily: "UrbanistMedium",
                lineHeight: "100%",
                fontWeight: 500,
                letterSpacing: 0,
                paddingRight: "0px !important",
              }}
            >
              {t("comparedToLastMonth")}
            </Typography>
          </Box>
        </PanelCard>

        {/* Active Wallets */}
        <PanelCard
          title={tDashboard("activeWallets")}
          showHeaderBorder={false}
          headerPadding={
            isMobile
              ? theme.spacing(2, 2, 0, 2)
              : theme.spacing(2.5, 2.5, 0, 2.5)
          }
          bodyPadding={
            isMobile
              ? theme.spacing(1.5, 2, 2, 2)
              : theme.spacing(2, 2, 2.5, 2.5)
          }
          sx={{
            width: { xs: "200px", sm: "240px", md: "315px" },
            height: { xs: "128px", sm: "140px", md: "176px" },
            flexShrink: 0,
          }}
          headerAction={
            <IconButton
              sx={{
                padding: "8px",
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Image
                src={WalletIcon}
                alt="Wallet Icon"
                width={17}
                height={14}
                style={{
                  width: "clamp(12px, 2vw, 17px)",
                  height: "auto",
                }}
                draggable={false}
              />
            </IconButton>
          }
        >
          <Typography
            sx={{
              fontSize: isMobile ? "20px" : "40px",
              color: theme.palette.text.primary,
              fontFamily: "UrbanistMedium",
              lineHeight: "100%",
              fontWeight: 500,
              letterSpacing: 0,
            }}
          >
            {activeWalletsData.length}
          </Typography>

          <Box
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: isMobile ? "6px" : "8px",
              mt: { xs: "18px", sm: 3, md: 2.5 },
              overflowX: "auto",
              overflowY: "hidden",
              flexWrap: "nowrap",
              cursor: showAllWallets
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              willChange: isDragging ? "scroll-position" : "auto",
              "& img": {
                userSelect: "none",
                WebkitUserDrag: "none",
                pointerEvents: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                KhtmlUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              },
              "& *": {
                userSelect: "none",
                WebkitUserDrag: "none",
              },
              "& button": {
                pointerEvents: "auto",
              },
              "&::-webkit-scrollbar": {
                height: "0px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
              },
            }}
          >
            {walletsToDisplay.map((wallet) => (
              <ActiveWalletsCard
                key={wallet.code}
                title={wallet.code}
                icon={wallet.icon}
                isMobile={isMobile}
              />
            ))}
            {hasMoreWallets && !showAllWallets && (
              <IconButton
                onClick={() => setShowAllWallets(true)}
                sx={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "999px",
                  background: theme.palette.secondary.light,
                  border: `1px solid ${theme.palette.border.main}`,
                  padding: 0,
                  minWidth: "30px",
                  flexShrink: 0,
                  "&:hover": {
                    background: theme.palette.secondary.dark,
                  },
                }}
              >
                <Add
                  sx={{
                    fontSize: "20px",
                    color: theme.palette.text.secondary,
                  }}
                />
              </IconButton>
            )}
            {showAllWallets && (
              <IconButton
                onClick={() => setShowAllWallets(false)}
                sx={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "999px",
                  background: theme.palette.secondary.light,
                  border: `1px solid ${theme.palette.border.main}`,
                  padding: 0,
                  minWidth: "30px",
                  flexShrink: 0,
                  "&:hover": {
                    background: theme.palette.secondary.dark,
                  },
                }}
              >
                <Remove
                  sx={{
                    fontSize: "20px",
                    color: theme.palette.text.secondary,
                  }}
                />
              </IconButton>
            )}
          </Box>
        </PanelCard>
      </Box>

      {/* Transaction Volume Graph */}
      <PanelCard
        showHeaderBorder={false}
        headerPadding={theme.spacing(2.5)}
        bodyPadding={theme.spacing(2.5, 2, 2.5, 2)}
        headerActionLayout="inline"
        sx={{ mb: 2.5, boxShadow: "none !important" }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Typography
              sx={{
                fontSize: isMobile ? "15px" : "20px",
                color: theme.palette.text.primary,
                fontFamily: "UrbanistMedium",
                lineHeight: 1.2,
              }}
            >
              {tDashboard("transactionVolume")}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.secondary,
                fontFamily: "UrbanistMedium",
                lineHeight: 1.2,
              }}
            >
              {tDashboard("dailyTransactionActivity")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: { xs: "space-between", md: "flex-start" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TimePeriodSelector
              value={selectedPeriod}
              onChange={(period) => setSelectedPeriod(period)}
              dateRange={customDateRange}
              onDateRangeChange={setCustomDateRange}
              sx={{ flexShrink: 0 }}
            />
            <Box>
              <CustomButton
                label={t("viewTransactions")}
                variant="secondary"
                size={isMobile ? "small" : "medium"}
                endIcon={<ArrowOutward sx={{ fontSize: 16 }} />}
                sx={{ flexShrink: 0 }}
                onClick={() => router.push("/transactions")}
              />
            </Box>
          </Box>
        </Box>
        <TransactionVolumeChart
          selectedPeriod={
            selectedPeriod === "custom" ? customDateRange : selectedPeriod
          }
        />
      </PanelCard>
    </Box>
  );
};

export default DashboardLeftSection;
