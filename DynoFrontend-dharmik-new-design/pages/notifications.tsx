import useTokenData from "@/hooks/useTokenData";
import React, { useCallback, useEffect } from "react";
import ProfilePage from "@/Components/Page/Profile/ProfilePage";
import { pageProps } from "@/utils/types";
import { useTranslation } from "react-i18next";
import NotificationPage from "@/Components/Page/Notification/NotificationPage";

const Notifications = ({ setPageName, setPageDescription }: pageProps) => {
  const tokenData = useTokenData();
  const namespaces = ["notifications", "common"];
  const { t } = useTranslation(namespaces);
  const tNotifications = useCallback((key: string) => t(key, { ns: "notifications" }), [t]);
  useEffect(() => {
    if (setPageName && setPageDescription) {
      setPageName(tNotifications("notifications"));
      setPageDescription(tNotifications("notificationsDescription"));
    }
  }, [setPageName, setPageDescription, tNotifications]);

  return <>{<NotificationPage />}</>;
};

export default Notifications;
