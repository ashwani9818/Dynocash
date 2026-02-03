import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const isServer = typeof window === "undefined";

// Always start with ENGLISH for SSR + hydration
const DEFAULT_LANGUAGE = "en";

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE, // 🔑 critical
  fallbackLng: DEFAULT_LANGUAGE,
  debug: false,

  resources: {
    en: {
      common: require("./langs/locales/en/common.json"),
      auth: require("./langs/locales/en/auth.json"),
      dashboardLayout: require("./langs/locales/en/dashboardLayout.json"),
      profile: require("./langs/locales/en/profile.json"),
      notifications: require("./langs/locales/en/notifications.json"),
      apiScreen: require("./langs/locales/en/apiScreen.json"),
      walletScreen: require("./langs/locales/en/walletScreen.json"),
      companyDialog: require("./langs/locales/en/companyDialog.json"),
      transactions: require("./langs/locales/en/transactions.json"),
      createPaymentLinkScreen: require("./langs/locales/en/createPaymentLinkScreen.json"),
      paymentLinks: require("./langs/locales/en/paymentLinks.json"),
    },
    pt: {
      common: require("./langs/locales/pt/common.json"),
      auth: require("./langs/locales/pt/auth.json"),
      dashboardLayout: require("./langs/locales/pt/dashboardLayout.json"),
      profile: require("./langs/locales/pt/profile.json"),
      notifications: require("./langs/locales/pt/notifications.json"),
      apiScreen: require("./langs/locales/pt/apiScreen.json"),
      walletScreen: require("./langs/locales/pt/walletScreen.json"),
      companyDialog: require("./langs/locales/pt/companyDialog.json"),
      transactions: require("./langs/locales/pt/transactions.json"),
      createPaymentLinkScreen: require("./langs/locales/pt/createPaymentLinkScreen.json"),
      paymentLinks: require("./langs/locales/pt/paymentLinks.json"),
    },
    fr: {
      common: require("./langs/locales/fr/common.json"),
      auth: require("./langs/locales/fr/auth.json"),
    },
    es: {
      common: require("./langs/locales/es/common.json"),
      auth: require("./langs/locales/es/auth.json"),
    },
  },

  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false, // safer for Next.js pages router
  },
});

// Optional logs (safe)
if (!isServer) {
  i18n.on("languageChanged", (lng) => {
    console.log("[i18n] language changed →", lng);
  });
}

export default i18n;
