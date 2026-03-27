"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const t = useTranslations("installPrompt");
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const handleInstall = () => {
    promptEvent?.prompt();
    promptEvent?.userChoice.finally(() => setVisible(false));
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-blue-600 text-white p-4 flex justify-between items-center z-50">
      <span>{t("message")}</span>
      <div className="flex gap-2">
        <button onClick={handleInstall} className="bg-white text-blue-600 px-3 py-1 rounded">
          {t("install")}
        </button>
        <button onClick={() => setVisible(false)} className="px-3 py-1">
          {t("dismiss")}
        </button>
      </div>
    </div>
  );
}
