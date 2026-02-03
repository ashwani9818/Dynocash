import React, { useCallback, useRef, useState } from "react";
import {
  SidebarFooter,
  ReferralCard,
  ReferralCardContent,
  ReferralCardTitle,
  ReferralCardContentValue,
  ReferralCardContentValueContainer,
  CopyButton,
  KnowledgeBaseBtn,
  KnowledgeBaseTitle,
} from "@/Components/Layout/NewSidebar/styled";
import { Box } from "@mui/material";
import Image from "next/image";
import BGOverlay from "@/assets/Images/bg-overlay.png";
import CopyIcon from "@/assets/Icons/copy-icon.svg";
import FileIcon from "@/assets/Icons/file-icon.svg";
import { useTranslation } from "react-i18next";
import Toast from "@/Components/UI/Toast";

const ReferralAndKnowledge = ({ isMobile }: { isMobile: boolean }) => {
  const { t } = useTranslation("common");
  const tCommon = useCallback((key: string) => t(key, { ns: "common" }), [t]);
  const [openToast, setOpenToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText("DYNO2024XYZ");
    setOpenToast(false);

    setTimeout(() => {
      setOpenToast(true);
    }, 0);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setOpenToast(false);
    }, 2000);
  }

  const knowledgeBaseUrl = process.env.NEXT_PUBLIC_KNOWLEDGE_BASE_URL as string;

  const handleKnowledgeBaseClick = () => {
    window.open(knowledgeBaseUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <SidebarFooter>
      <ReferralCard>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            userSelect: "none",
          }}
        >
          <Image
            src={BGOverlay}
            alt="BG Overlay"
            width={82}
            height={100}
            draggable={false}
          />
        </Box>
        <ReferralCardContent>
          <ReferralCardTitle>{t("yourReferralCode")}</ReferralCardTitle>

          <ReferralCardContentValueContainer>
            <ReferralCardContentValue>DYNO2024XYZ</ReferralCardContentValue>
            <CopyButton
              onClick={handleCopy}
            >
              <Image
                src={CopyIcon}
                alt="Copy Icon"
                width={isMobile ? 12 : 14}
                height={isMobile ? 12 : 14}
                draggable={false}
              />
            </CopyButton>
          </ReferralCardContentValueContainer>
        </ReferralCardContent>
      </ReferralCard>

      <KnowledgeBaseBtn onClick={handleKnowledgeBaseClick}>
        <Image
          src={FileIcon}
          alt="File Icon"
          width={isMobile ? 14 : 18}
          height={isMobile ? 14 : 18}
          draggable={false}
        />
        <KnowledgeBaseTitle>{t("knowledgeBase")}</KnowledgeBaseTitle>
      </KnowledgeBaseBtn>
      <Toast
        open={openToast}
        message={tCommon("copiedToClipboard")}
        severity="success"
      />
    </SidebarFooter>
  );
};

export default ReferralAndKnowledge;
