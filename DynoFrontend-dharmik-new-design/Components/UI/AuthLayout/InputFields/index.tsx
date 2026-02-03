import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { StaticImageData } from "next/image";
import useIsMobile from "@/hooks/useIsMobile";

export interface InputFieldProps {
  label?: string | React.ReactNode | React.ReactElement;
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | string;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  showPasswordToggle?: boolean;
  sideButton?: boolean;
  onSideButtonClick?: () => void;
  sideButtonIcon?: React.ReactNode | StaticImageData;
  sideButtonType?: "primary" | "secondary";
  sideButtonIconWidth?: string;
  sideButtonIconHeight?: string;
  sx?: SxProps<Theme>;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  inputHeight?: string;
  iconBoxSize?: string;
  inputBgColor?: string;
  inputMode?:
  | "none"
  | "text"
  | "tel"
  | "url"
  | "email"
  | "numeric"
  | "decimal"
  | "search";
  inputRef?: React.Ref<HTMLInputElement>;
  autoComplete?: string;
  minRows?: number;
  maxRows?: number;
}

/**
 * Comprehensive InputField component with support for all variants:
 * - Disabled, Read-only, Success, Error states
 * - Password visibility toggle
 * - Custom adornments
 * - MUI TextField with full customization
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value = "",
  name,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onPaste,
  type = "text",
  variant = "outlined",
  size = "medium",
  disabled = false,
  readOnly = false,
  error = false,
  success = false,
  helperText = "",
  fullWidth = true,
  startAdornment,
  endAdornment,
  showPasswordToggle = false,
  sideButton = false,
  onSideButtonClick,
  sideButtonIcon,
  sideButtonType = "primary",
  sideButtonIconWidth,
  sideButtonIconHeight,
  sx,
  multiline = false,
  rows = 1,
  maxLength,
  inputMode,
  inputHeight,
  inputBgColor,
  iconBoxSize,
  minRows = 1,
  maxRows,
  inputRef,
  autoComplete,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile("sm");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordArray, setPasswordArray] = useState<string[]>([]);
  const inputRefInternal = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (type === "password") {
      if (value) {
        setPasswordArray(value.split(""));
      } else {
        setPasswordArray([]);
      }
    }
  }, [value, type]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "password" && !showPassword) {
      const inputEvent = e.nativeEvent as InputEvent;
      const input = e.target;
      let newArray: string[];

      if (
        !inputEvent.data &&
        inputEvent.inputType === "deleteContentBackward"
      ) {
        newArray = passwordArray.slice(0, -1);
        setPasswordArray(newArray);
      } else if (inputEvent.data !== null && inputEvent.data !== undefined) {
        if (inputEvent.data.trim() === "" && inputEvent.data === " ") {
          newArray = passwordArray;
        } else {
          newArray = [...passwordArray, inputEvent.data];
        }
        setPasswordArray(newArray);
      } else {
        const asteriskCount = (input.value.match(/\*/g) || []).length;
        if (asteriskCount < passwordArray.length) {
          newArray = passwordArray.slice(0, asteriskCount);
        } else if (asteriskCount > passwordArray.length) {
          newArray = passwordArray;
        } else {
          newArray = passwordArray;
        }
        setPasswordArray(newArray);
      }

      if (!newArray) {
        newArray = passwordArray;
      }

      const displayValue = showPassword
        ? newArray.join("")
        : newArray.map(() => "*").join("");

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: e.target.name,
          value: newArray.join(""),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      if (onChange) {
        onChange(syntheticEvent);
      }
    } else if (onChange) {
      onChange(e);
    }
  };

  const inputType =
    type === "password"
      ? "text"
      : showPasswordToggle && type === "password" && showPassword
        ? "text"
        : type;

  const inputValue =
    type === "password"
      ? showPassword
        ? passwordArray.join("")
        : passwordArray.map(() => "*").join("")
      : value;

  const handleNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type === "number") {
      if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
        e.preventDefault();
        return;
      }
    }

    if (type === "password" && e.key === " ") {
      e.preventDefault();
      return;
    }

    if (onKeyDown) {
      onKeyDown(e as React.KeyboardEvent<HTMLInputElement>);
    }
  };
  const handleNumberPaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type === "number") {
      const pastedText = e.clipboardData.getData("text");
      if (pastedText.includes("e") || pastedText.includes("E")) {
        e.preventDefault();
        return;
      }
    }

    if (onPaste) {
      onPaste(e as React.ClipboardEvent<HTMLInputElement>);
    }
  };
  const borderColor = success
    ? theme.palette.success.main
    : error
      ? theme.palette.error.main
      : theme.palette.border.main;
  const borderWidth = "1px";
  const focusBorderColor = success
    ? theme.palette.success.main
    : error
      ? theme.palette.error.main
      : theme.palette.border.focus;

  const renderSideButtonIcon = () => {
    const iconWidth = sideButtonIconWidth ?? (isMobile ? "16px" : "18px");
    const iconHeight = sideButtonIconHeight ?? (isMobile ? "16px" : "18px");

    if (!sideButtonIcon) {
      return (
        <EditIcon
          sx={{
            fontSize: iconWidth,
            width: iconWidth,
            height: iconHeight,
          }}
        />
      );
    }

    if (typeof sideButtonIcon === "object" && "src" in sideButtonIcon) {
      const widthNum = parseInt(iconWidth.replace("px", "")) || 12;
      const heightNum = parseInt(iconHeight.replace("px", "")) || 12;

      return (
        <Image
          src={sideButtonIcon}
          alt="icon"
          width={widthNum}
          height={heightNum}
          style={{
            display: "flex",
            objectFit: "contain",
            width: iconWidth,
            height: iconHeight,
          }}
          draggable={false}
        />
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: iconWidth,
          height: iconHeight,
          "& svg": {
            fontSize: iconWidth,
            width: iconWidth,
            height: iconHeight,
          },
        }}
      >
        {sideButtonIcon as React.ReactNode}
      </Box>
    );
  };

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
            fontFamily: "UrbanistMedium",
            fontSize: isMobile ? "13px" : "15px",
            textAlign: "start",
            color: theme.palette.text.primary,
            lineHeight: "100%",
            letterSpacing: 0,
          }}
          className="label"
        >
          {typeof label === "string" ? <span>{label}</span> : label}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: multiline ? "flex-start" : "center",
            gap: "8px",
            width: fullWidth ? "100%" : "auto",
          }}
        >
          <TextField
            placeholder={placeholder}
            value={inputValue}
            name={name}
            onChange={
              type === "password" && !showPassword
                ? handlePasswordInput
                : type === "password" && showPassword
                  ? (
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    const newValue = e.target.value;
                    const valueWithoutSpaces = newValue.replace(/\s/g, "");
                    const newArray = valueWithoutSpaces.split("");
                    setPasswordArray(newArray);
                    if (onChange) {
                      const inputEvent = {
                        ...e,
                        target: {
                          ...(e.target as HTMLInputElement),
                          value: newArray.join(""),
                        },
                      } as React.ChangeEvent<HTMLInputElement>;
                      onChange(inputEvent);
                    }
                    if (
                      inputRefInternal.current &&
                      newValue !== valueWithoutSpaces
                    ) {
                      inputRefInternal.current.value = valueWithoutSpaces;
                    }
                  }
                  : onChange
            }
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={handleNumberKeyDown as any}
            onPaste={
              type === "number" || onPaste
                ? (e: React.ClipboardEvent<HTMLDivElement>) => {
                  handleNumberPaste(e as any);
                }
                : type === "password"
                  ? (e: React.ClipboardEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text");
                    const pastedTextWithoutSpaces = pastedText.replace(
                      /\s/g,
                      ""
                    );
                    const newArray = [
                      ...passwordArray,
                      ...pastedTextWithoutSpaces.split(""),
                    ];
                    setPasswordArray(newArray);
                    if (onChange) {
                      const syntheticEvent = {
                        ...e,
                        target: {
                          ...e.target,
                          name: name || "",
                          value: newArray.join(""),
                        },
                      } as any;
                      onChange(syntheticEvent);
                    }
                  }
                  : undefined
            }
            type={inputType}
            variant={variant}
            disabled={disabled}
            inputRef={(el) => {
              if (inputRef) {
                if (typeof inputRef === "function") {
                  inputRef(el);
                } else {
                  (
                    inputRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = el;
                }
              }
              inputRefInternal.current = el;
            }}
            inputProps={{
              readOnly: readOnly,
              maxLength: maxLength,
              inputMode: inputMode,
              autoComplete:
                type === "password" ? "new-password" : autoComplete || "off",
              "data-form-type": type === "password" ? "other" : undefined,
              "data-lpignore": type === "password" ? "true" : undefined,
              "data-1p-ignore": type === "password" ? "true" : undefined,
              style: {
                cursor: readOnly ? "not-allowed" : "auto",
              },
            }}
            fullWidth={sideButton ? false : fullWidth}
            multiline={multiline}
            rows={multiline && !minRows && !maxRows ? rows : undefined}
            minRows={multiline ? minRows : undefined}
            maxRows={multiline ? maxRows : undefined}
            error={error}
            helperText={undefined}
            InputProps={{
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : undefined,
            }}
            sx={{
              ...sx,
              ...(sideButton && { flex: 1 }),
              borderRadius: "6px !important",
              boxShadow: "none",
              fontFamily: "UrbanistMedium",
              "& .MuiInputBase-root": {
                ...(multiline
                  ? {
                    minHeight: inputHeight ?? (isMobile ? "32px" : "40px"),
                    alignItems: "flex-start",
                    padding: "0px !important",
                  }
                  : {
                    height: inputHeight ?? (isMobile ? "32px" : "40px"),
                  }),
                borderRadius: "6px",
                boxSizing: "border-box",
                "& input, & textarea": {
                  padding: "11px 14px",
                  boxSizing: "border-box",
                  fontSize: isMobile ? "13px" : "15px",
                  lineHeight: "1.5",
                  color: disabled ? "#B0BEC5" : "#333",
                  "&::placeholder": {
                    color: theme.palette.secondary.contrastText,
                    fontFamily: "UrbanistMedium",
                    fontSize: isMobile ? "10px" : "13px",
                    lineHeight: 1.2,
                  },
                  fontFamily: "UrbanistMedium",
                  ...(type === "number" && {
                    MozAppearance: "textfield",
                    "&::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "&::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }),
                },
                "& textarea": {
                  resize: "none",
                  overflow: "auto",
                },
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                backgroundColor:
                  inputBgColor ??
                  (disabled
                    ? "#F5F5F5"
                    : success
                      ? "#E5EDFF"
                      : error
                        ? "#FFFBFB"
                        : "#FFFFFF"),
                transition: "all 0.3s ease",
                boxShadow: "rgba(16, 24, 40, 0.05) 0px 1px 2px 0px",
                "& fieldset": {
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                },
                "&:hover fieldset": {
                  borderColor: disabled ? borderColor : focusBorderColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: focusBorderColor,
                  borderWidth: "1px",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#F5F5F5",
                  opacity: 1,
                },
                "& input": {
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px white inset",
                    WebkitTextFillColor: "#333",
                  },
                },
              },
              "& .MuiOutlinedInput-input.Mui-disabled": {
                WebkitTextFillColor: "#6b728080",
              },
            }}
          />

          {sideButton && (
            <IconButton
              onClick={onSideButtonClick}
              disabled={disabled}
              tabIndex={-1}
              aria-label="Toggle visibility"
              sx={{
                width: iconBoxSize ?? (isMobile ? "32px" : "40px"),
                height: iconBoxSize ?? (isMobile ? "32px" : "40px"),
                minWidth: iconBoxSize ?? (isMobile ? "32px" : "40px"),
                minHeight: iconBoxSize ?? (isMobile ? "32px" : "40px"),
                maxWidth: isMobile ? "32px" : "40px",
                maxHeight: iconBoxSize ?? (isMobile ? "32px" : "40px"),
                borderRadius: "6px",
                border: `1px solid ${sideButtonType === "primary" ? "#676768" : "#0004FF"
                  }`,
                backgroundColor: "#FFFFFF",
                color: "#242428",
                padding: isMobile ? "8px" : "11px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#E9ECF2",
                },
                "&:disabled": {
                  backgroundColor: "#F5F5F5",
                  opacity: 0.6,
                  borderColor: "#E9ECF2",
                },
              }}
            >
              {renderSideButtonIcon()}
            </IconButton>
          )}
        </Box>

        {helperText && (
          <Typography
            sx={{
              margin: "4px 0 0 0",
              fontSize: isMobile ? "10px" : "13px",
              fontFamily: "UrbanistMedium",
              fontWeight: 500,
              color: error
                ? theme.palette.error.main
                : theme.palette.secondary.contrastText,
              lineHeight: "1.2",
              textAlign: "start",
            }}
            className="helper-text"
          >
            {helperText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InputField;
