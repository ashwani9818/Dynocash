/**
 * Example usage of the ReusableAreaChart component
 * This demonstrates how to use the component with various customization options
 */

import React, { useMemo } from "react";
import { Box } from "@mui/material";
import ReusableAreaChart from "./index";
import { formatNumberWithComma, getCurrencySymbol } from "@/helpers";

// Example 1: Transaction Volume Chart (matching the reference image)
export const TransactionVolumeExample = () => {
  // Sample data matching the reference image
  const transactionData = useMemo(
    () => [
      { date: "Nov 1", value: 8000 },
      { date: "Nov 2", value: 12000 },
      { date: "Nov 3", value: 8500 },
      { date: "Nov 4", value: 15600 },
      { date: "Nov 5", value: 11000 },
      { date: "Nov 6", value: 13500 },
      { date: "Nov 7", value: 14500 },
    ],
    []
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <ReusableAreaChart
        data={transactionData}
        dataKey="date"
        valueKey="value"
        height={200}
        strokeWidth={2.5}
        dotRadius={5}
        showDots={true}
        showGrid={true}
        gridColor="#E9ECF2"
        curveType="monotone"
        margin={{ top: 5, right: 20, bottom: 30, left: 40 }}
        // Y-axis formatting - show values in thousands (k)
        yAxisTickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        // Tooltip formatting
        tooltipLabelFormatter={(data) => data.date}
        tooltipValueFormatter={(value) => [
          getCurrencySymbol("USD", formatNumberWithComma(value)),
          "Volume",
        ]}
        tooltipLabel="Volume"
        // Gradient colors
        gradientStartOpacity={0.2}
        gradientEndOpacity={0.05}
      />
    </Box>
  );
};

// Example 2: Simple Sales Chart
export const SalesChartExample = () => {
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <ReusableAreaChart
        data={salesData}
        dataKey="month"
        valueKey="sales"
        height={250}
        strokeColor="#10B981"
        fillColor="#10B981"
        dotColor="#10B981"
        gradientStartColor="#10B981"
        gradientEndColor="#10B981"
        yAxisTickFormatter={(value) => `$${value.toLocaleString()}`}
        tooltipValueFormatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
      />
    </Box>
  );
};

// Example 3: Custom Styled Chart
export const CustomStyledExample = () => {
  const customData = [
    { day: "Mon", count: 120 },
    { day: "Tue", count: 190 },
    { day: "Wed", count: 300 },
    { day: "Thu", count: 200 },
    { day: "Fri", count: 250 },
    { day: "Sat", count: 180 },
    { day: "Sun", count: 150 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <ReusableAreaChart
        data={customData}
        dataKey="day"
        valueKey="count"
        height={300}
        strokeColor="#FF6B6B"
        fillColor="#FF6B6B"
        dotColor="#FF6B6B"
        strokeWidth={3}
        dotRadius={6}
        showDots={true}
        showGrid={true}
        gridColor="#E0E0E0"
        gridStrokeDasharray="5 5"
        curveType="natural"
        gradientStartColor="#FF6B6B"
        gradientEndColor="#FF6B6B"
        gradientStartOpacity={0.3}
        gradientEndOpacity={0.1}
        margin={{ top: 10, right: 30, bottom: 40, left: 50 }}
        yAxisDomain={[0, 400]}
        yAxisTickCount={5}
        tooltipValueFormatter={(value) => [`${value}`, "Count"]}
        containerSx={{ backgroundColor: "#FAFAFA", padding: 2, borderRadius: 2 }}
      />
    </Box>
  );
};

// Example 4: Minimal Chart (no grid, no dots)
export const MinimalChartExample = () => {
  const minimalData = [
    { time: "00:00", temp: 20 },
    { time: "06:00", temp: 18 },
    { time: "12:00", temp: 25 },
    { time: "18:00", temp: 22 },
    { time: "24:00", temp: 19 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <ReusableAreaChart
        data={minimalData}
        dataKey="time"
        valueKey="temp"
        height={180}
        showGrid={false}
        showDots={false}
        strokeWidth={2}
        fillOpacity={0.1}
        margin={{ top: 5, right: 10, bottom: 20, left: 0 }}
        yAxisTickFormatter={(value) => `${value}°C`}
        tooltipValueFormatter={(value) => [`${value}°C`, "Temperature"]}
      />
    </Box>
  );
};

