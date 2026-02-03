import { TokenData } from "@/utils/types";
import React, { useState, useEffect, useCallback, useRef } from "react";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { UserAction } from "@/Redux/Actions/UserAction";
import { USER_REFRESH } from "@/Redux/Actions/UserAction";

const useTokenData = () => {
  const [tokenData, setTokenData] = useState<TokenData>();
  const dispatch = useDispatch();
  const hasRefreshedRef = useRef(false);

  const updateTokenData = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as TokenData;
        setTokenData(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        setTokenData(undefined);
      }
    } else {
      setTokenData(undefined);
    }
  }, []);

  useEffect(() => {
    // Initial load
    updateTokenData();

    // Refresh user data on mount/refresh if we have a token
    // This ensures we get the latest data from the backend
    if (localStorage.getItem("token") && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      // Small delay to ensure Redux store is ready
      setTimeout(() => {
        dispatch(UserAction(USER_REFRESH));
      }, 100);
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        updateTokenData();
        // Refresh from backend when token changes in another tab
        if (e.newValue) {
          setTimeout(() => {
            dispatch(UserAction(USER_REFRESH));
          }, 100);
        }
      }
    };

    // Listen for custom token update events (same tab)
    const handleTokenUpdate = () => {
      updateTokenData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenUpdated", handleTokenUpdate);

    // Also check on window focus/visibility change (refresh data when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden && localStorage.getItem("token")) {
        // Refresh user data when tab becomes visible
        dispatch(UserAction(USER_REFRESH));
      }
    };

    const handleFocus = () => {
      updateTokenData();
      // Refresh user data when window regains focus
      if (localStorage.getItem("token")) {
        dispatch(UserAction(USER_REFRESH));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleTokenUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [updateTokenData, dispatch]);

  return tokenData;
};

export default useTokenData;
