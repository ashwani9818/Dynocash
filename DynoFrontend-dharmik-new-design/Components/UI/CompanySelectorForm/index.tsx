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
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import useIsMobile from "@/hooks/useIsMobile";
import { useSelector } from "react-redux";
import { rootReducer } from "@/utils/types";
import {
  CompanyTrigger,
  CompanyText,
  CompanyDropdown,
} from "./styled";

export interface CompanySelectorFormProps {
  label?: string;
  value?: number | string;
  onChange?: (value: number) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  name?: string;
}

const CompanySelectorForm: React.FC<CompanySelectorFormProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  name,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile("sm");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const companyState = useSelector(
    (state: rootReducer) => state.companyReducer
  );

  const companies = companyState.companyList ?? [];

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (companyId: number) => {
    onChange?.(companyId);
    handleClose();
  };

  const selectedCompany = companies.find(
    (c) => c.company_id === Number(value)
  );
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
      }}
    >
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontFamily: "UrbanistMedium",
            fontSize: isMobile ? "13px" : "15px",
            textAlign: "start",
            color: "#242428",
            lineHeight: "1.2",
          }}
        >
          {label + (required ? " *" : "")}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        <CompanyTrigger
          ref={triggerRef}
          onClick={handleOpen}
          error={error}
          fullWidth={fullWidth}
          isOpen={isOpen}
          isMobile={isMobile}
          sx={{
            borderColor: borderColor,
            borderRadius: "8px",
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
              gap: isMobile ? "3px" : "4px",
              flex: 1,
            }}
          >
            <BusinessCenterIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: isMobile ? "14px" : "18px",
              }}
            />
            <CompanyText isMobile={isMobile}>
              {selectedCompany?.company_name || "Select Company"}
            </CompanyText>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
        </CompanyTrigger>

        <Popover
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              mt: "2px",
              borderRadius: "6px",
              overflow: "hidden",
              fontFamily: "UrbanistMedium",
              width: triggerRef.current?.offsetWidth || "auto",
              border: `1px solid ${borderColor}`,
              borderTop: "none",
              maxHeight: "200px",
              backgroundColor: theme.palette.common.white,
              boxShadow: "0px 4px 16px 0px rgba(47, 47, 101, 0.15)",
            },
          }}
        >
          <CompanyDropdown>
            {companies.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: isMobile ? "10px" : "13px",
                  }}
                >
                  No companies available
                </Typography>
              </Box>
            ) : (
              companies.map((company) => (
                <ListItemButton
                  key={company.company_id}
                  onClick={() => handleSelect(company.company_id)}
                  selected={company.company_id === Number(value)}
                  sx={{
                    maxHeight: "32px",
                    borderRadius: "50px",
                    lineHeight: 1.2,
                    p: "8px",
                    gap: isMobile ? "3px" : "4px",
                    background:
                      company.company_id === Number(value)
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
                  <ListItemIcon sx={{ minWidth: "fit-content" }}>
                    <BusinessCenterIcon
                      sx={{
                        color:
                          company.company_id === Number(value)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        fontSize: "18px",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={company.company_name}
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "UrbanistMedium",
                        fontWeight: 500,
                        fontSize: isMobile ? "10px" : "13px",
                        color: theme.palette.text.primary,
                        lineHeight: 1.2,
                      },
                    }}
                  />
                </ListItemButton>
              ))
            )}
          </CompanyDropdown>
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
              lineHeight: 1.2,
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

export default CompanySelectorForm;
