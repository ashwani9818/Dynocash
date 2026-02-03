import React from "react";
import { Box, Typography, TextField, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@/assets/Icons/search-icon.svg";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "@/Components/UI/Buttons";
import { useRouter } from "next/router";
import Image from "next/image";
import SearchSvg from "@/assets/Icons/search.svg";
import useIsMobile from "@/hooks/useIsMobile";
interface Props {
  onSearch: (value: string) => void;
}

const PaymentLinksTopBar = ({ onSearch }: Props) => {

  const isMobile = useIsMobile("md");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: isMobile ? "100%" : "50%",
      }}
    >
      <InputBase
        placeholder="Search links..."
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          height: "40px",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #E9ECF2",
          backgroundColor: "#FFFFFF",
          px: "10px",
          fontFamily: "UrbanistMedium",
          fontSize: "14px",
          color: "#242428",
        }}
      />

      <Image src={SearchSvg} height={40} width={40} alt="search-icon" />
    </Box>
  );
};

export default PaymentLinksTopBar;
