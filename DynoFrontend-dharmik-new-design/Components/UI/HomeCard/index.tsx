/**
 * PanelCard - A reusable card component with header, body, and optional footer sections
 *
 * @example
 * // Basic usage with title and content
 * <PanelCard title="Update Password">
 *   <YourFormContent />
 * </PanelCard>
 *
 * @example
 * // With header icon and footer actions
 * <PanelCard
 *   title="Update Password"
 *   headerIcon={<LockIcon />}
 *   footer={<Button>Update</Button>}
 * >
 *   <YourFormContent />
 * </PanelCard>
 *
 * @example
 * // With header action button
 * <PanelCard
 *   title="Account Settings"
 *   headerAction={<IconButton><EditIcon /></IconButton>}
 * >
 *   <YourContent />
 * </PanelCard>
 */

import React, { ReactNode } from "react";
import { Box, Typography, SxProps } from "@mui/material";
import { CardBody, StyledCard } from "./styled";
import useIsMobile from "@/hooks/useIsMobile";

export interface HomeCardProps {
  /**
   * Title displayed in the card header
   */
  title?: string;
  /**
   * Subtitle displayed in the card header
   */
  subTitle?: string;
  /**
   * Optional icon element displayed next to the title
   */
  headerIcon?: ReactNode;
  /**
   * Optional element displayed on the right side of the header (e.g., action buttons)
   */
  headerAction?: ReactNode;
  /**
   * Layout for the header action.
   * - absolute (default): floats on top-right in a pill wrapper
   * - inline: sits in the normal header row without wrapper styling
   */
  headerActionLayout?: "absolute" | "inline";
  /**
   * Custom styles for the header action wrapper (only applies to absolute layout)
   */
  headerActionWrapperSx?: SxProps;
  /**
   * Main content of the card
   */
  children: ReactNode;
  /**
   * Optional footer content (e.g., action buttons)
   */
  footer?: ReactNode;
  /**
   * Custom padding for the card body
   */
  bodyPadding?: number | string;
  /**
   * Custom padding for the card header
   */
  headerPadding?: number | string;
  /**
   * Custom padding for the card footer
   */
  footerPadding?: number | string;
  /**
   * Whether to show the header border
   */
  showHeaderBorder?: boolean;
  /**
   * Whether to show the footer border
   */
  showFooterBorder?: boolean;
  /**
   * Custom styles for the card
   */
  sx?: SxProps;
  /**
   * Custom styles for the header
   */
  headerSx?: SxProps;
  subTitleSx?: SxProps;
  /**
   * Custom styles for the body
   */
  bodySx?: SxProps;
  /**
   * Custom styles for the footer
   */
  footerSx?: SxProps;
  /**
   * Click handler for the entire card
   */
  onClick?: () => void;
  /**
 * Custom height for the card
 */
  height?: number | string;
  /**
   * Custom width for the card
   */
  width?: number | string;
}

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  subTitle,
  headerIcon,
  headerAction,
  headerActionLayout = "absolute",
  headerActionWrapperSx,
  children,
  bodyPadding,
  headerPadding,
  showHeaderBorder = true,
  sx,
  headerSx,
  subTitleSx,
  bodySx,
  onClick,
  height,
  width,
}) => {
  const isMobile = useIsMobile("md");
  return (
    <StyledCard
      height={height}
      width={width}
      sx={{
        ...sx,
      }}
      onClick={onClick}
    >
      <CardBody
        sx={{
          padding: bodyPadding,
          ...bodySx,
        }}
      >
        {children}
      </CardBody>
    </StyledCard>
  );
};

export default HomeCard;
