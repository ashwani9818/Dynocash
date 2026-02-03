import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { homeTheme } from "@/styles/homeTheme";
import { useEffect, useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isMobile = useIsMobile("md");

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when user scrolls down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: isMobile ? "8px" : "32px",
                right: isMobile ? "16px" : "24px",
                zIndex: 1000,
                transition: "all 0.3s ease-in-out",
            }}
        >
            <IconButton
                onClick={scrollToTop}
                sx={{
                    backgroundColor: homeTheme.palette.primary.main,
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    "&:hover": {
                        backgroundColor: homeTheme.palette.primary.light,
                        transform: "translateY(-4px)",
                    },
                    transition: "all 0.3s ease-in-out",
                }}
                aria-label="Scroll to top"
            >
                <KeyboardArrowUpIcon sx={{ fontSize: isMobile ? "24px" : "28px" }} />
            </IconButton>
        </Box>
    );
};

export default ScrollToTopButton;