import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import {
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  SxProps,
  Theme,
  Box,
  Button,
  Typography,
} from "@mui/material";
import {
  PeriodTrigger,
  PeriodText,
  CheckIconStyled,
  VerticalLine,
} from "./styled";
import CalendarTodayIcon from "@/assets/Icons/calendar-icon.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExpandLess } from "@mui/icons-material";
import useIsMobile from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import CustomDatePicker, { DateRange, DatePickerRef } from "@/Components/UI/DatePicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { endOfDay, format, isAfter, isValid, startOfDay } from "date-fns";
import Image from "next/image";

export type TimePeriod = "7days" | "30days" | "90days" | "custom";

export interface TimePeriodOption {
  value: TimePeriod;
  label: string;
}

interface TimePeriodSelectorProps {
  value?: TimePeriod;
  onChange?: (period: TimePeriod) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  sx?: SxProps<Theme>;
}

export default function TimePeriodSelector({
  value = "7days",
  onChange,
  dateRange,
  onDateRangeChange,
  sx,
}: TimePeriodSelectorProps) {
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const namespaces = ["dashboardLayout", "common"];
  const { t } = useTranslation(namespaces);
  const tDashboard = useCallback(
    (key: string) => t(key, { ns: "dashboardLayout" }),
    [t]
  );

  const timePeriods: TimePeriodOption[] = useMemo(
    () => [
      { value: "7days", label: tDashboard("last7Days") },
      { value: "30days", label: tDashboard("last30Days") },
      { value: "90days", label: tDashboard("last90Days") },
      { value: "custom", label: tDashboard("customPeriod") },
    ],
    [tDashboard]
  );

  const datePickerRef = useRef<DatePickerRef>(null);
  const calendarButtonRef = useRef<HTMLButtonElement | null>(null);
  const [uncontrolledCustomDateRange, setUncontrolledCustomDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const customDateRange = dateRange ?? uncontrolledCustomDateRange;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const listRef = useRef<HTMLUListElement>(null);

  const handleCalendarButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    datePickerRef.current?.open(e);
  };

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    setFocusedIndex(timePeriods.findIndex((p) => p.value === value) || 0);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setFocusedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (period: TimePeriod) => {
      onChange?.(period);
      setAnchorEl(null);
      setFocusedIndex(0);
    },
    [onChange]
  );

  const handleSelectWithEvent = useCallback(
    (event: React.MouseEvent<HTMLElement>, period: TimePeriod) => {
      if (period !== "custom") {
        handleSelect(period);
        return;
      }

      // Set the value to custom and close the list first. The date picker
      // is only rendered when `value === 'custom'`, so we wait a tick to
      // ensure it mounts and then open it anchored to the calendar button.
      onChange?.("custom");
      setAnchorEl(null);
      setFocusedIndex(0);

      setTimeout(() => {
        const target = (calendarButtonRef.current ?? (event.currentTarget as HTMLElement)) as HTMLElement;
        // Cast to any to match the expected React.MouseEvent signature
        datePickerRef.current?.open(({
          currentTarget: target,
        } as unknown) as React.MouseEvent<HTMLElement>);
      }, 0);
    },
    [handleSelect, onChange]
  );

  const handleCustomDateRangeChange = (range: DateRange) => {
    const normalizedStart =
      range.startDate && isValid(range.startDate) ? startOfDay(range.startDate) : null;
    const normalizedEnd =
      range.endDate && isValid(range.endDate) ? endOfDay(range.endDate) : null;

    const normalizedRange: DateRange = {
      startDate: normalizedStart,
      endDate:
        normalizedStart && normalizedEnd && isAfter(normalizedStart, normalizedEnd)
          ? null
          : normalizedEnd,
    };

    if (dateRange === undefined) {
      setUncontrolledCustomDateRange(normalizedRange);
    }
    onDateRangeChange?.(normalizedRange);
  };

  const formatCustomDateRange = (): string => {
    if (customDateRange.startDate && customDateRange.endDate) {
      if (isMobile) {
        return `${format(customDateRange.startDate, "dd.MM.yy")}-${format(
          customDateRange.endDate,
          "dd.MM.yy"
        )}`;
      }
      return `${format(customDateRange.startDate, "MMM dd, yyyy")} - ${format(
        customDateRange.endDate,
        "MMM dd, yyyy"
      )}`;
    }
    if (customDateRange.startDate) {
      if (isMobile) {
        return format(customDateRange.startDate, "dd.MM.yy");
      }
      return format(customDateRange.startDate, "MMM dd, yyyy");
    }
    return tDashboard("customPeriod");
  };

  // Keyboard navigation
  useEffect(() => {
    if (!anchorEl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!anchorEl) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < timePeriods.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : timePeriods.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < timePeriods.length) {
            handleSelect(timePeriods[focusedIndex].value);
          }
          break;
        case "Escape":
          event.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorEl, focusedIndex, timePeriods, handleSelect, handleClose]);

  // Scroll focused item into view
  useEffect(() => {
    if (anchorEl && listRef.current) {
      const focusedItem = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [focusedIndex, anchorEl]);

  const selected = timePeriods.find((p) => p.value === value) ?? timePeriods[0];

  return (
    <>
      {value === "custom" ? (
        <>
          <Button
            ref={calendarButtonRef}
            onClick={handleCalendarButtonClick}
            sx={[
              {
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "6px" : "12px",
                padding: isMobile ? "8px 10px" : "9px 16px",
                borderRadius: "6px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "UrbanistMedium",
                color: theme.palette.text.primary,
                backgroundColor: "#FFFFFF",
                border: `1px solid ${theme.palette.border.main}`,
                justifyContent: "space-between",
                whiteSpace: "nowrap",
                width: "fit-content",
                height: isMobile ? "32px" : "40px",
                minWidth: isMobile ? "fit-content" : "200px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: theme.palette.border.focus,
                },
                "&:focus": {
                  borderColor: theme.palette.border.focus,
                },
                "& .separator": {
                  width: "1px",
                  height: isMobile ? "16px" : "20px",
                  backgroundColor: theme.palette.border.main,
                  flexShrink: 0,
                },
                "& .arrow-icon": {
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                },
              },
              ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
          >
            <Image
              src={CalendarTodayIcon}
              alt="calendar"
              width={isMobile ? 13 : 14}
              height={isMobile ? 13 : 14}
              style={{ filter: "brightness(0) saturate(100%) invert(0%)" }}
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
              {formatCustomDateRange()}
            </Typography>
            <Box className="separator" />
            <KeyboardArrowDownIcon
              className="arrow-icon"
              onClick={(e) => {
                e.stopPropagation();
                const closestButton = (e.currentTarget as Element).closest("button") as
                  | HTMLElement
                  | null;
                setAnchorEl(
                  closestButton ?? (e.currentTarget as unknown as HTMLElement)
                );
                setFocusedIndex(timePeriods.findIndex((p) => p.value === value) || 0);
              }}
            />
          </Button>
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
              value={customDateRange}
              onChange={handleCustomDateRangeChange}
              hideTrigger={true}
            />
          </Box>
        </>
      ) : (
        <PeriodTrigger
          onClick={handleOpen}
          sx={[
            { maxHeight: isMobile ? "32px" : "40px" },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "4px" : "6px",
            }}
          >
            <Box
              component="img"
              src={CalendarTodayIcon.src as string}
              alt="calendar"
              sx={{
                width: isMobile ? "13px" : "14px",
                height: isMobile ? "13px" : "14px",
                userDrag: "none",
                WebkitUserDrag: "none",
              }}
              draggable={false}
            />
            <PeriodText
              style={{
                fontSize: isMobile ? "13px" : "15px",
                fontFamily: "UrbanistMedium",
                color: theme.palette.text.secondary,
              }}
            >
              {selected.label}
            </PeriodText>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "4px",
              gap: 0.2,
            }}
          >
            <VerticalLine
              style={{
                height: isMobile ? "14px" : "20px",
                minHeight: isMobile ? "14px" : "20px",
                marginRight: isMobile ? "4px" : "9px",
              }}
            />
            {!anchorEl ? (
              <ExpandMoreIcon
                style={{
                  color: theme.palette.text.secondary,
                  width: isMobile ? "16px" : "24px",
                  height: isMobile ? "16px" : "24px",
                }}
              />
            ) : (
              <ExpandLess
                style={{
                  color: theme.palette.text.secondary,
                  width: isMobile ? "16px" : "24px",
                  height: isMobile ? "16px" : "24px",
                }}
              />
            )}
          </Box>
        </PeriodTrigger>
      )}

      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "7px",
              boxShadow: "0 4px 16px 0 rgba(47, 47, 101, 0.15)",
              overflow: "hidden",
              border: `1px solid ${theme.palette.border.main}`,
            },
          },
        }}
      >
        <List
          ref={listRef}
          sx={{
            width: "100%",
            p: "6px",
            minWidth: isMobile ? "160px" : "190px",
          }}
        >
          {timePeriods.map((period, index) => (
            <ListItemButton
              key={period.value}
              onClick={(event) => handleSelectWithEvent(event, period.value)}
              onMouseEnter={() => setFocusedIndex(index)}
              sx={{
                borderRadius: "63px",
                fontSize: isMobile ? "13px !important" : "15px",
                fontFamily: "UrbanistMedium",
                fontWeight: 500,
                lineHeight: "100%",
                letterSpacing: 0,
                height: "32px",
                mb: 0.5,
                py: isMobile ? "6px !important" : "7px !important",
                background:
                  period.value === value || focusedIndex === index
                    ? theme.palette.primary.light
                    : "transparent",
                "&:hover": {
                  background: theme.palette.primary.light,
                },
                "&:focus": {
                  background: theme.palette.primary.light,
                  outline: "none",
                },
              }}
            >
              <ListItemText
                sx={{
                  fontFamily: "UrbanistMedium",
                  fontWeight: 500,
                }}
                primaryTypographyProps={{
                  sx: {
                    fontSize: isMobile ? "13px !important" : "15px",
                    lineHeight: 1.2,
                  },
                }}
                primary={period.label}
              />

              {period.value === value && (
                <ListItemIcon sx={{ minWidth: "fit-content" }}>
                  <CheckIconStyled
                    sx={{
                      width: "16px",
                      height: "16px",
                    }}
                  />
                </ListItemIcon>
              )}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}