import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileGenerator } from "@/components/profile-generator";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Download, Share } from "lucide-react";
import { shareApp } from "@/lib/usage-tracker";
function TopInstallBar({
  pwa,
  onInstallClick,
}: {
  pwa: ReturnType<typeof usePwaInstall>;
  onInstallClick: () => void;
}) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("mystique-topbar-dismissed") === "1";
    } catch {
      return false;
    }
  });
  if (pwa.isInstalled || dismissed) return null;
  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("mystique-topbar-dismissed", "1");
    } catch {}
  };
  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(20,8,50,0.98) 0%, rgba(30,12,65,0.98) 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.3)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "0.55rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <img
          src="/icon-192.svg"
          alt="Mystique Compass"
          style={{ width: 32, height: 32, borderRadius: 7, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#d4af37",
              margin: 0,
              lineHeight: 1,
              marginBottom: "0.15rem",
            }}
          >
            Mystique Compass
          </p>
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(210,195,250,0.72)",
              margin: 0,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pwa.isIOS
              ? "Tap Share → Add to Home Screen"
              : "Install for your cosmic experience"}
          </p>
        </div>
        <button
          onClick={onInstallClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.38rem 0.85rem",
            background: "linear-gradient(135deg, #d4af37 0%, #a07820 100%)",
            border: "none",
            borderRadius: 20,
            color: "#04001a",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
          aria-label="Install app"
        >
          {pwa.isIOS ? (
            <Share size={12} strokeWidth={2.5} />
          ) : (
            <Download size={12} strokeWidth={2.5} />
          )}
          Install
        </button>
        <button
          onClick={() => {
            void shareApp();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26,
            height: 26,
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "50%",
            color: "#d4af37",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label="Share Mystique Compass"
          title="Share Mystique Compass"
        >
          <Share size={12} strokeWidth={2.5} />
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: "rgba(212,175,55,0.5)",
            cursor: "pointer",
            padding: "0.25rem",
            lineHeight: 1,
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
function App() {
  const pwa = usePwaInstall();
  const [promptOpen, setPromptOpen] = useState(false);
  useEffect(() => {
    if (!pwa.isInstalled && !pwa.isDismissed && pwa.isIOS) {
      const timer = setTimeout(() => setPromptOpen(true), 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pwa.isInstalled, pwa.isDismissed, pwa.isIOS]);
  const handleInstallClick = async () => {
    if (pwa.isIOS) {
      setPromptOpen(true);
      return;
    }
    if (pwa.canInstall) {
      // Note: on success this also fires the browser's native "appinstalled"
      // event, which usage-tracker.ts listens for directly. We don't track
      // here too, to avoid double-counting the same install.
      await pwa.install();
      return;
    }
    setPromptOpen(true);
  };
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <TopInstallBar pwa={pwa} onInstallClick={handleInstallClick} />
        <div className="flex-1 px-4 py-6 flex flex-col justify-center">
          <main className="w-full max-w-[980px] mx-auto">
            <ProfileGenerator />
          </main>
        </div>
      </div>
      <Toaster />
      <PwaInstallPrompt
        pwa={pwa}
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
      />
    </TooltipProvider>
  );
}
export default App;
