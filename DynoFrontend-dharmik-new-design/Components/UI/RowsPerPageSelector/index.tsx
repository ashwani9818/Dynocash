import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { menuItem } from "@/utils/types";
import {
  RowsPerPageContainer,
  VerticalSeparator,
  CustomSelect,
  CustomSelectValue,
} from "./styled";
import MenuIcon from "@/assets/Icons/menu-icon.svg";
import Image from "next/image";
import useIsMobile from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

interface RowsPerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  menuItems?: menuItem[];
}

const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({
  value,
  onChange,
  menuItems = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
  ],
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useIsMobile("md");
  const { t } = useTranslation("transactions");
  const tRowsPerPageSelector = useCallback(
    (key: string, options?: any): string => {
      const result = t(key, { ns: "transactions", ...options });
      return typeof result === "string" ? result : String(result);
    },
    [t]
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue: number) => {
    onChange(selectedValue);
    handleClose();
  };

  const selectedLabel =
    menuItems.find((item) => item.value === value)?.label || value;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <RowsPerPageContainer>
      <Image
        src={MenuIcon}
        alt="menu"
        width={isMobile ? 12 : 15}
        height={isMobile ? 12 : 15}
      />
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "UrbanistMedium",
          lineHeight: "16px",
          [theme.breakpoints.down("md")]: {
            display: "none",
          },
        }}
      >
        {tRowsPerPageSelector("rowsPerPage")}:
      </Typography>
      <VerticalSeparator />
      <Box ref={selectRef} sx={{ position: "relative" }}>
        <CustomSelect onClick={handleClick}>
          <CustomSelectValue>{selectedLabel}</CustomSelectValue>
          <KeyboardArrowDown
            sx={{
              fontSize: "18px",
              color: theme.palette.text.primary,
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              [theme.breakpoints.down("md")]: {
                fontSize: "14px",
              },
            }}
          />
        </CustomSelect>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
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
              mt: "4px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              border: `1px solid ${theme.palette.border.main}`,
              minWidth: selectRef.current?.offsetWidth || "80px",
            },
          }}
        >
          <MenuList sx={{ padding: "4px" }}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.value}
                onClick={() => handleSelect(item.value)}
                selected={item.value === value}
                sx={{
                  fontSize: "15px",
                  fontWeight: item.value === value ? 500 : 500,
                  fontFamily: "UrbanistMedium",
                  lineHeight: "18px",
                  padding: "8px 12px",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.light,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                  },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Popover>
      </Box>
    </RowsPerPageContainer>
  );
};

export default RowsPerPageSelector;
