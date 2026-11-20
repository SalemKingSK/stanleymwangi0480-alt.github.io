import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PwaInstallState {
  canInstall: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  isSafari: boolean;
  install: () => Promise<boolean>;
  dismiss: () => void;
  isDismissed: boolean;
}

const DISMISS_KEY = "mystique-pwa-dismissed";

function getGlobalPrompt(): BeforeInstallPromptEvent | null {
  return (window.__pwaInstallEvent as BeforeInstallPromptEvent | null) ?? null;
}

export function usePwaInstall(): PwaInstallState {
  // Initialise from the globally pre-captured event so we never miss it
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(getGlobalPrompt);

  const [canInstall, setCanInstall] = useState(() => !!getGlobalPrompt());

  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as Record<string, unknown>).MSStream;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const isInstalled =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  useEffect(() => {
    // Handler for events that fire after this hook mounts
    const handler = (e: Event) => {
      e.preventDefault();
      window.__pwaInstallEvent = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    // Handler for the custom re-dispatch we fire in main.tsx
    const readyHandler = () => {
      const prompt = getGlobalPrompt();
      if (prompt) {
        setDeferredPrompt(prompt);
        setCanInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("pwa-prompt-ready", readyHandler);

    // Also check again on focus (returning to the tab can trigger it)
    window.addEventListener("focus", readyHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("pwa-prompt-ready", readyHandler);
      window.removeEventListener("focus", readyHandler);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    const prompt = deferredPrompt ?? getGlobalPrompt();
    if (!prompt) return false;
    await prompt.prompt();
    const result = await prompt.userChoice;
    window.__pwaInstallEvent = null;
    setDeferredPrompt(null);
    setCanInstall(false);
    return result.outcome === "accepted";
  };

  const dismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return { canInstall, isIOS, isInstalled, isSafari, install, dismiss, isDismissed };
}
