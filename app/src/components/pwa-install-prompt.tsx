import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share, PlusSquare } from "lucide-react";
import type { PwaInstallState } from "@/hooks/use-pwa-install";

interface Props {
  pwa: PwaInstallState;
  open: boolean;
  onClose: () => void;
}

export function PwaInstallPrompt({ pwa, open, onClose }: Props) {
  const handleInstall = async () => {
    if (pwa.isIOS) return;
    if (!pwa.canInstall) return;
    const accepted = await pwa.install();
    if (accepted) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(4,0,16,0.72)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 101,
              background:
                "linear-gradient(170deg, #160840 0%, #0a0420 100%)",
              borderTop: "1px solid rgba(212,175,55,0.32)",
              borderRadius: "20px 20px 0 0",
              padding: "1.5rem 1.25rem 2.5rem",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "rgba(212,175,55,0.3)",
                margin: "0 auto 1.4rem",
              }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 99,
                color: "rgba(200,185,255,0.6)",
                cursor: "pointer",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              <X size={14} />
            </button>

            {/* App row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.2rem",
              }}
            >
              <img
                src="/icon-192.svg"
                alt="Mystique Compass"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  boxShadow: "0 4px 24px rgba(168,85,247,0.35)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: "1rem",
                    color: "#d4af37",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Mystique Compass
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(190,175,240,0.65)",
                    margin: "0.25rem 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  Numerology · Astrology · Cosmic Profile
                </p>
                {/* Star rating */}
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    marginTop: "0.35rem",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{ color: "#d4af37", fontSize: "0.7rem" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
                marginBottom: "1.2rem",
              }}
            />

            {/* Feature pills */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1.3rem",
              }}
            >
              {[
                "✦ Numerology",
                "☽ Astrology",
                "☯ Chinese Zodiac",
                "⚡ Offline Ready",
              ].map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.06em",
                    color: "rgba(200,185,255,0.75)",
                    background: "rgba(120,80,200,0.15)",
                    border: "1px solid rgba(168,85,247,0.22)",
                    borderRadius: 99,
                    padding: "0.25rem 0.65rem",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* iOS instructions */}
            {pwa.isIOS && (
              <div
                style={{
                  background: "rgba(120,80,200,0.1)",
                  border: "1px solid rgba(168,85,247,0.22)",
                  borderRadius: 12,
                  padding: "0.9rem 1rem",
                  marginBottom: "1.2rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#a78bfa",
                    margin: "0 0 0.6rem",
                  }}
                >
                  Add to Home Screen
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    {
                      icon: <Share size={14} />,
                      text: (
                        <>
                          Tap the{" "}
                          <strong style={{ color: "#d4af37" }}>Share</strong>{" "}
                          button in Safari
                        </>
                      ),
                    },
                    {
                      icon: <PlusSquare size={14} />,
                      text: (
                        <>
                          Choose{" "}
                          <strong style={{ color: "#d4af37" }}>
                            Add to Home Screen
                          </strong>
                        </>
                      ),
                    },
                    {
                      icon: (
                        <span style={{ fontSize: "0.75rem" }}>✦</span>
                      ),
                      text: "Tap Add — done!",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "rgba(200,185,255,0.75)",
                        fontSize: "0.73rem",
                      }}
                    >
                      <span style={{ color: "#a78bfa", flexShrink: 0 }}>
                        {step.icon}
                      </span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Install / OK button */}
            {!pwa.isIOS && pwa.canInstall && (
              <button
                onClick={handleInstall}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #c9a227, #d4af37 50%, #b8941f)",
                  border: "none",
                  borderRadius: 14,
                  padding: "0.9rem",
                  color: "#0d0820",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow:
                    "0 4px 24px rgba(212,175,55,0.4), 0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                <Download size={15} />
                Install App — Free
              </button>
            )}

            {/* Fallback for browsers that haven't fired beforeinstallprompt yet */}
            {!pwa.isIOS && !pwa.canInstall && (
              <div
                style={{
                  background: "rgba(120,80,200,0.1)",
                  border: "1px solid rgba(168,85,247,0.22)",
                  borderRadius: 12,
                  padding: "0.9rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#a78bfa",
                  margin: "0 0 0.6rem",
                }}>
                  Install via browser menu
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { icon: "⋮", text: "Tap the 3-dot menu in your browser" },
                    { icon: "⊕", text: 'Select "Add to Home Screen" or "Install App"' },
                    { icon: "✦", text: "Tap Install — done!" },
                  ].map((step, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "rgba(200,185,255,0.75)", fontSize: "0.73rem",
                    }}>
                      <span style={{ color: "#a78bfa", flexShrink: 0, fontSize: "1rem", width: 16, textAlign: "center" }}>{step.icon}</span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: "100%",
                    marginTop: "0.9rem",
                    background: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.35)",
                    borderRadius: 10,
                    padding: "0.7rem",
                    color: "#d4af37",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Got it
                </button>
              </div>
            )}

            {pwa.isIOS && (
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: 14,
                  padding: "0.9rem",
                  color: "#d4af37",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Got it
              </button>
            )}

            {(pwa.canInstall || pwa.isIOS) && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  color: "rgba(160,145,210,0.4)",
                  margin: "0.8rem 0 0",
                }}
              >
                No download required · Installs instantly
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
