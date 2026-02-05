import { useEffect, useMemo, useState } from "react";
import { Popover, useTheme, Box, Divider } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EditIcon from "@/assets/Icons/edit-icon.svg";
import {
  SelectorTrigger,
  TriggerText,
  CompanyListWrapper,
  CompanyItem,
  ItemLeft,
  ItemRight,
} from "./styled";

import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { VerticalLine } from "../LanguageSwitcher/styled";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import CustomButton from "../Buttons";
import { useSelector, useDispatch } from "react-redux";
import { rootReducer } from "@/utils/types";
import { useCompanyDialog } from "@/Components/UI/CompanyDialog/context";
import useIsMobile from "@/hooks/useIsMobile";
import { CompanyAction } from "@/Redux/Actions/CompanyAction";
import { COMPANY_SELECT } from "@/Redux/Actions/CompanyAction";

export default function CompanySelector() {
  const { t } = useTranslation("dashboardLayout");
  const theme = useTheme();
  const isMobile = useIsMobile("md");
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openAddCompany, openEditCompany } = useCompanyDialog();
  const companyState = useSelector(
    (state: rootReducer) => state.companyReducer
  );

  const companies = useMemo(
    () => companyState.companyList ?? [],
    [companyState.companyList]
  );
  
  // Use Redux selectedCompanyId, fallback to local state for initial load
  const active = companyState.selectedCompanyId ?? null;

  useEffect(() => {
    // Set first company as selected if none is selected
    if (active == null && companies.length > 0 && companyState.selectedCompanyId === null) {
      dispatch({ type: COMPANY_SELECT, payload: companies[0].company_id });
    }
  }, [active, companies, dispatch, companyState.selectedCompanyId]);

  const selected = companies.find((c) => c.company_id === active);
  
  const handleCompanySelect = (companyId: number) => {
    // Only dispatch if selecting a different company
    if (companyState.selectedCompanyId !== companyId) {
      dispatch({ type: COMPANY_SELECT, payload: companyId });
    }
  };

  const handleOpen = (e: any) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {/* TRIGGER */}
      <SelectorTrigger onClick={handleOpen}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <BusinessCenterIcon
            sx={{ color: theme.palette.primary.main, fontSize: 20 }}
          />

          <TriggerText>{selected?.company_name ?? "-"}</TriggerText>
        </Box>

        <VerticalLine />

        {!anchorEl ? (
          <ExpandMoreIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        ) : (
          <ExpandLess
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        )}
      </SelectorTrigger>

      {/* POPOVER */}
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            border: "1px solid #E9ECF2",
            borderRadius: "6px",
            boxShadow: "0 4px 16px 0 rgba(47, 47, 101, 0.15)",
            overflow: "hidden",
            width: 330,
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            fontSize: 13,
            mb: 1.5,
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontFamily: "UrbanistMedium",
            lineHeight: "1.2",
            letterSpacing: "0",
          }}
        >
          {t("companySelectorTitle")}:
        </Box>

        <CompanyListWrapper>
          {companies.map((c) => (
            <CompanyItem
              key={c.company_id}
              active={active === c.company_id}
              onClick={() => handleCompanySelect(c.company_id)}
            >
              <ItemLeft>
                <Box className="info">
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <BusinessCenterIcon
                      sx={{
                        color:
                          active === c.company_id
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        fontSize: "18px",
                      }}
                    />

                    <Box className="name">{c.company_name}</Box>
                  </Box>
                  <Box className="email">{c.email}</Box>
                </Box>
              </ItemLeft>

              <ItemRight
                active={active === c.company_id}
                onClick={(e: any) => {
                  e.stopPropagation();
                  handleClose();
                  openEditCompany(c);
                }}
                role="button"
                tabIndex={0}
              >
                <Image
                  src={EditIcon}
                  width={isMobile ? 12 : 16}
                  height={isMobile ? 13 : 17}
                  alt="edit"
                  draggable={false}
                />
              </ItemRight>
            </CompanyItem>
          ))}
        </CompanyListWrapper>

        <Divider sx={{ my: 1.75, borderColor: "#D9D9D9" }} />

        <CustomButton
          label={t("addCompany")}
          variant="secondary"
          size="medium"
          endIcon={<Add sx={{ fontSize: isMobile ? "16px" : "18px" }} />}
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => {
            handleClose();
            openAddCompany();
          }}
        />
      </Popover>
    </>
  );
}
