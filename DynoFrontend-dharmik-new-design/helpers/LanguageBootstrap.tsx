import { useEffect } from "react";
import i18n from "@/i18n";

export default function LanguageBootstrap() {
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return null;
}
