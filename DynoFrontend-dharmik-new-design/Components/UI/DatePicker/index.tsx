import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, useTheme, Popover } from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isAfter,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  startOfDay,
} from "date-fns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useIsMobile from "@/hooks/useIsMobile";
import {
  StyledDatePickerContainer,
  ContentContainer,
  PresetsSidebar,
  PresetTitle,
  PresetItem,
  CalendarContainer,
  CalendarHeader,
  CalendarHeaderText,
  WeekdayHeader,
  WeekdayCell,
  CalendarGrid,
  DateCellWrapper,
  DateButton,
  NavigationButton,
  TriggerButton,
  DividerLine,
} from "./styled";
import type { DateRange } from "./utils";
import { detectPreset, getPresetDates, rangeHasFutureDate, sanitizeRange } from "./utils";

export type { DateRange } from "./utils";

export interface DatePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  onPresetChange?: (preset: string) => void;
  onAudit?: (event: {
    type: "future_date_blocked" | "future_range_sanitized";
    attempted?: DateRange | Date;
    applied?: DateRange;
    today: Date;
  }) => void;
  showPresets?: boolean;
  className?: string;
  placeholder?: string;
  buttonText?: string;
  fullWidth?: boolean;
  hideTrigger?: boolean;
  trigger?:
  | React.ReactElement
  | ((
    onClick: (event: React.MouseEvent<HTMLElement>) => void
  ) => React.ReactElement);
  disableFutureDates?: boolean;
  blockedDateMessage?: string;
  noscriptStartDateName?: string;
  noscriptEndDateName?: string;
}

type PresetType =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "last7Days"
  | "last30Days";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// CalendarMonth Component
interface CalendarMonthProps {
  month: Date;
  maxDate: Date;
  disableFutureDates: boolean;
  selectedRange: DateRange;
  onDateClick: (date: Date) => void;
  hoverDate: Date | null;
  onDateHover: (date: Date | null) => void;
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  maxDate,
  disableFutureDates,
  selectedRange,
  onDateClick,
  hoverDate,
  onDateHover,
  onNavigateLeft,
  onNavigateRight,
  showLeftArrow = false,
  showRightArrow = false,
}) => {
  const theme = useTheme();
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyCells = Array(startDayOfWeek).fill(null);

  const isInRange = (date: Date) => {
    const { startDate, endDate } = selectedRange;
    if (!startDate) return false;

    const end = endDate || hoverDate;
    if (!end) return false;

    const start = startDate < end ? startDate : end;
    const endDateValue = startDate < end ? end : startDate;

    return isWithinInterval(date, { start, end: endDateValue });
  };

  const isRangeStart = (date: Date) => {
    const { startDate, endDate } = selectedRange;
    if (!startDate) return false;
    const end = endDate || hoverDate;
    if (!end) return isSameDay(date, startDate);
    return isSameDay(date, startDate < end ? startDate : end);
  };

  const isRangeEnd = (date: Date) => {
    const { startDate, endDate } = selectedRange;
    if (!startDate) return false;
    const end = endDate || hoverDate;
    if (!end) return false;
    return isSameDay(date, startDate < end ? end : startDate);
  };

  const isSelected = (date: Date) => {
    const { startDate, endDate } = selectedRange;
    return (
      (startDate && isSameDay(date, startDate)) ||
      (endDate && isSameDay(date, endDate))
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
      }}
    >
      <CalendarHeader>
        {showLeftArrow && onNavigateLeft ? (
          <NavigationButton onClick={onNavigateLeft} size="small">
            <ChevronLeftIcon sx={{ fontSize: "16px" }} />
          </NavigationButton>
        ) : (
          <Box sx={{ width: "28px" }} />
        )}
        <CalendarHeaderText>{format(month, "MMMM yyyy")}</CalendarHeaderText>
        {showRightArrow && onNavigateRight ? (
          <NavigationButton onClick={onNavigateRight} size="small">
            <ChevronRightIcon sx={{ fontSize: "16px" }} />
          </NavigationButton>
        ) : (
          <Box sx={{ width: "28px" }} />
        )}
      </CalendarHeader>

      <WeekdayHeader>
        {WEEKDAYS.map((day, i) => (
          <WeekdayCell key={i}>{day}</WeekdayCell>
        ))}
      </WeekdayHeader>

      <CalendarGrid>
        {/* Empty cells at the start to align with weekday headers */}
        {emptyCells.map((_, i) => (
          <DateCellWrapper key={`empty-${i}`} />
        ))}
        {/* Dates from the current month */}
        {days.map((day, i) => {
          const inRange = isInRange(day);
          const isStart = isRangeStart(day);
          const isEnd = isRangeEnd(day);
          const selected = isSelected(day);
          const isDisabled = disableFutureDates && isAfter(startOfDay(day), startOfDay(maxDate));

          // Check if this is the start or end of the week
          const dayOfWeek = day.getDay();
          const isWeekStart = dayOfWeek === 0; // Sunday (like 7, 14, 21, 28)
          const isWeekEnd = dayOfWeek === 6; // Saturday (like 6, 13, 20, 27)

          // Apply rounded corners if date is in range (but not the actual start/end of the range)
          // - Sunday (start of week) → round left side
          // - Saturday (end of week) → round right side
          const shouldRoundWeekStart =
            inRange && !isStart && !isEnd && isWeekStart;
          const shouldRoundWeekEnd = inRange && !isStart && !isEnd && isWeekEnd;

          return (
            <DateCellWrapper
              key={`day-${i}`}
              inRange={!!(inRange && !isStart && !isEnd)}
              isStart={!!(isStart && !isEnd)}
              isEnd={!!(isEnd && !isStart)}
              isWeekStart={shouldRoundWeekStart}
              isWeekEnd={shouldRoundWeekEnd}
            >
              <DateButton
                selected={!!selected}
                iscurrentmonth={true}
                isStart={!!(isStart && !isEnd)}
                isEnd={!!(isEnd && !isStart)}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                onClick={() => onDateClick(day)}
                onMouseEnter={() => {
                  if (!isDisabled) onDateHover(day);
                }}
                onMouseLeave={() => onDateHover(null)}
              >
                {format(day, "d")}
              </DateButton>
            </DateCellWrapper>
          );
        })}
      </CalendarGrid>
    </Box>
  );
};

export interface DatePickerRef {
  open: (event: React.MouseEvent<HTMLElement>) => void;
  close: () => void;
  isOpen: () => boolean;
}

// Main Component
const CustomDatePicker = forwardRef<DatePickerRef, DatePickerProps>(({
  value,
  onChange,
  onPresetChange,
  onAudit,
  showPresets = true,
  className,
  placeholder = "Select date range",
  buttonText,
  fullWidth = false,
  hideTrigger = false,
  trigger,
  disableFutureDates = true,
  blockedDateMessage = "You can’t select a future date.",
  noscriptStartDateName,
  noscriptEndDateName,
}, ref) => {
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedRange, setSelectedRange] = useState<DateRange>(() => {
    if (value && value.startDate && value.endDate) {
      return sanitizeRange(value, today);
    }
    // Initialize with "thisMonth" preset if no value provided
    return getPresetDates("thisMonth", today);
  });
  const [leftMonth, setLeftMonth] = useState<Date>(() => (isMobile ? today : subMonths(today, 1)));
  const [rightMonth, setRightMonth] = useState<Date>(() => today); // Right is current month
  const [activePreset, setActivePreset] = useState<PresetType | null>(() => {
    if (value && value.startDate && value.endDate) {
      return detectPreset(value, today);
    }
    return "thisMonth";
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Reset months on open so desktop shows [lastMonth, currentMonth]
    // and mobile shows [currentMonth]. This also ensures responsive
    // behavior when user resizes the viewport while the popover is open.
    setLeftMonth(isMobile ? today : subMonths(today, 1));
    setRightMonth(today);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoverDate(null);
    setIsSelectingEnd(false);
    setErrorMessage(null);
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    open: (event: React.MouseEvent<HTMLElement>) => {
      handleOpen(event);
    },
    close: () => {
      handleClose();
    },
    isOpen: () => {
      return isOpen;
    },
  }));

  // Sync months when the viewport breakpoint changes while the popover is open
  useEffect(() => {
    if (!isOpen) return;
    setLeftMonth(isMobile ? today : subMonths(today, 1));
    setRightMonth(today);
  }, [isMobile, isOpen, today]);

  const formatDateRange = (): string => {
    const { startDate, endDate } = selectedRange;
    if (startDate && endDate) {
      if (isMobile) {
        return `${format(startDate, "dd.MM.yy")}-${format(endDate, "dd.MM.yy")}`;
      }
      return `${format(startDate, "MMM dd, yyyy")} - ${format(
        endDate,
        "MMM dd, yyyy"
      )}`;
    }
    if (startDate) {
      if (isMobile) {
        return format(startDate, "dd.MM.yy");
      }
      return format(startDate, "MMM dd, yyyy");
    }
    if (buttonText) {
      return buttonText;
    }
    return placeholder;
  };

  useEffect(() => {
    if (value) {
      const sanitized = disableFutureDates ? sanitizeRange(value, today) : value;
      if (disableFutureDates) {
        if (rangeHasFutureDate(value, today)) {
          onAudit?.({
            type: "future_range_sanitized",
            attempted: value,
            applied: sanitized,
            today,
          });
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("date-picker-audit", {
                detail: { type: "future_range_sanitized", attempted: value, applied: sanitized, today },
              })
            );
          }
        }
      }

      setSelectedRange(sanitized);
      const detectedPreset = detectPreset(sanitized, today);
      setActivePreset(detectedPreset);
      if (sanitized.startDate) {
        const startMonth = startOfMonth(sanitized.startDate);
        const todayMonth = startOfMonth(today);

        if (isMobile) {
          // Mobile: Show the month of the selected date
          setLeftMonth(startMonth);
          setRightMonth(addMonths(startMonth, 1));
        } else {
          // Desktop: If selecting current month, show [Prev | Current] 
          // so the right side isn't a future (empty) month.
          if (isSameMonth(startMonth, todayMonth) && disableFutureDates) {
            setLeftMonth(subMonths(todayMonth, 1));
            setRightMonth(todayMonth);
          } else {
            setLeftMonth(startMonth);
            setRightMonth(addMonths(startMonth, 1));
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePresetClick = (preset: PresetType) => {
    setActivePreset(preset);
    const presetDates = getPresetDates(preset, today);
    setSelectedRange(presetDates);
    if (onChange) {
      onChange(presetDates);
    }
    if (onPresetChange) {
      onPresetChange(preset);
    }
    if (presetDates.startDate) {
      const startMonth = startOfMonth(presetDates.startDate);
      const todayMonth = startOfMonth(today);

      if (isMobile) {
        setLeftMonth(startMonth);
        setRightMonth(addMonths(startMonth, 1));
      } else {
        if (isSameMonth(startMonth, todayMonth) && disableFutureDates) {
          setLeftMonth(subMonths(todayMonth, 1));
          setRightMonth(todayMonth);
        } else {
          setLeftMonth(startMonth);
          setRightMonth(addMonths(startMonth, 1));
        }
      }
    }
  };

  const handleDateClick = (date: Date) => {
    if (disableFutureDates && isAfter(startOfDay(date), today)) {
      setErrorMessage(blockedDateMessage);
      onAudit?.({ type: "future_date_blocked", attempted: date, today });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("date-picker-audit", {
            detail: { type: "future_date_blocked", attempted: date, today },
          })
        );
      }
      return;
    }
    setErrorMessage(null);
    if (!isSelectingEnd || !selectedRange.startDate) {
      const newRange = { startDate: date, endDate: null };
      setSelectedRange(newRange);
      setActivePreset(null);
      setIsSelectingEnd(true);
    } else {
      const newRange = {
        startDate:
          selectedRange.startDate < date ? selectedRange.startDate : date,
        endDate:
          selectedRange.startDate < date ? date : selectedRange.startDate,
      };
      const sanitized = disableFutureDates ? sanitizeRange(newRange, today) : newRange;
      setSelectedRange(sanitized);
      // Detect if the manually selected range matches a preset
      const detectedPreset = detectPreset(sanitized, today);
      setActivePreset(detectedPreset);
      if (onChange) {
        onChange(sanitized);
      }
      setIsSelectingEnd(false);
    }
  };

  const navigateLeft = () => {
    // Move both months back by 1
    setLeftMonth(subMonths(leftMonth, 1));
    setRightMonth(subMonths(rightMonth, 1));
  };

  const navigateRight = () => {
    if (disableFutureDates) {
      const todayMonth = startOfMonth(today);

      // On Mobile: Check if leftMonth is already the current month
      if (isMobile && isSameMonth(leftMonth, todayMonth)) {
        return; // Block moving to future
      }

      // On Desktop: Check if rightMonth is already the current month
      if (!isMobile && isSameMonth(rightMonth, todayMonth)) {
        return; // Block moving to future
      }
    }

    // Move both months forward by 1
    setLeftMonth(addMonths(leftMonth, 1));
    setRightMonth(addMonths(rightMonth, 1));
  };

  const presets = [
    { key: "today" as PresetType, label: "Today" },
    { key: "yesterday" as PresetType, label: "Yesterday" },
    { key: "thisWeek" as PresetType, label: "This Week" },
    { key: "lastWeek" as PresetType, label: "Last Week" },
    { key: "thisMonth" as PresetType, label: "This Month" },
    { key: "lastMonth" as PresetType, label: "Last Month" },
    { key: "last7Days" as PresetType, label: "Last 7 Days" },
    { key: "last30Days" as PresetType, label: "Last 30 Days" },
  ];

  const renderTrigger = () => {
    if (hideTrigger) {
      return null;
    }

    if (trigger) {
      if (typeof trigger === "function") {
        return trigger(handleOpen);
      }
      // If it's a React element, clone it and add onClick handler
      if (React.isValidElement(trigger)) {
        const existingOnClick = (trigger.props as any)?.onClick;
        return React.cloneElement(trigger, {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            handleOpen(e);
            if (existingOnClick) {
              existingOnClick(e);
            }
          },
        } as any);
      }
      return trigger;
    }

    return (
      <TriggerButton
        ref={triggerRef}
        onClick={handleOpen}
        fullWidth={fullWidth}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "16px", rotate: isOpen ? "180deg" : "0deg" }} />}
        startIcon={<CalendarTodayIcon sx={{ fontSize: "18px" }} />}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontFamily: "UrbanistMedium",
            color:
              selectedRange.startDate && selectedRange.endDate
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
            flex: 1,
            textAlign: "left",
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {formatDateRange()}
        </Typography>
      </TriggerButton>
    );
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto", position: "relative" }}>
      {renderTrigger()}

      <Popover
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: "8px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "rgba(16, 24, 40, 0.12) 0px 8px 24px 0px",
            maxWidth: isMobile ? "95vw" : "auto",
            border: `1px solid ${theme.palette.border.main}`,
          },
        }}
      >
        <StyledDatePickerContainer className={className}>
          <ContentContainer>
            {showPresets && (
              <PresetsSidebar>
                <PresetTitle>Presets</PresetTitle>
                {presets.map((preset) => (
                  <PresetItem
                    key={preset.key}
                    active={activePreset === preset.key}
                    onClick={() => handlePresetClick(preset.key)}
                  >
                    <p className="label">{preset.label}</p>
                    {activePreset === preset.key && (
                      <Box className="arrow">
                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                    )}
                  </PresetItem>
                ))}
              </PresetsSidebar>
            )}

            <DividerLine />

            <CalendarMonth
              month={leftMonth}
              maxDate={today}
              disableFutureDates={disableFutureDates}
              selectedRange={selectedRange}
              onDateClick={handleDateClick}
              hoverDate={isSelectingEnd ? hoverDate : null}
              onDateHover={setHoverDate}
              onNavigateLeft={navigateLeft}
              onNavigateRight={navigateRight}
              showLeftArrow={true}
              showRightArrow={isMobile}
            />

            <DividerLine
              sx={{ [theme.breakpoints.down("md")]: { display: "none" } }}
            />

            {!isMobile && (
              <CalendarMonth
                month={rightMonth}
                maxDate={today}
                disableFutureDates={disableFutureDates}
                selectedRange={selectedRange}
                onDateClick={handleDateClick}
                hoverDate={isSelectingEnd ? hoverDate : null}
                onDateHover={setHoverDate}
                onNavigateRight={navigateRight}
                showRightArrow={true}
              />
            )}
          </ContentContainer>
          {errorMessage && (
            <Box sx={{ pt: "10px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontFamily: "UrbanistMedium",
                  color: theme.palette.error.main,
                  lineHeight: 1.2,
                }}
                role="alert"
              >
                {errorMessage}
              </Typography>
            </Box>
          )}
        </StyledDatePickerContainer>
      </Popover>

      {(noscriptStartDateName || noscriptEndDateName) && (
        <noscript>
          <div>
            {noscriptStartDateName && (
              <input
                type="date"
                name={noscriptStartDateName}
                max={format(today, "yyyy-MM-dd")}
              />
            )}
            {noscriptEndDateName && (
              <input
                type="date"
                name={noscriptEndDateName}
                max={format(today, "yyyy-MM-dd")}
              />
            )}
          </div>
        </noscript>
      )}
    </Box>
  );
});

CustomDatePicker.displayName = "CustomDatePicker";

export default CustomDatePicker;
