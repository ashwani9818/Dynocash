import { useMediaQuery, useTheme } from "@mui/material";

/**
 * Custom hook to detect if the current screen width is mobile
 * Uses MUI's breakpoint system (default: below 'sm' breakpoint which is 600px)
 * @param breakpoint - The MUI breakpoint to consider as mobile (default: 'sm')
 * @returns boolean - true if screen width is mobile, false otherwise
 */
const useIsMobile = (breakpoint: "xs" | "sm" | "md" | "lg" | "xl" = "sm"): boolean => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));

  return isMobile;
};

export default useIsMobile;

