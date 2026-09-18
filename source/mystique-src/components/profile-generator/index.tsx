import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getAstroInsightAction } from "@/lib/actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import type {
  AstroInsightInput,
  AstroInsightOutput,
  NumerologyData,
} from "./types";
import { ProfileForm } from "./profile-form";
import { MatchOraclePanel } from "./match-oracle";
import { ResultsDisplay } from "./results-display";
import type { FamousPerson } from "@/lib/famous-birthdays";
import {
  ArchivumActions,
  ImportExportButtons,
  type StoredSoul,
} from "./engagement-tools";
const IDB_NAME = "MystiqueArchivum";
const IDB_VERSION = 1;
const STORE_NAME = "souls";
const LEGACY_KEY = "mystiqueCompassHistory";
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export function ProfileGenerator() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState<AstroInsightInput>({
    name: "",
    day: 0,
    month: 0,
    year: 0,
    gender: "",
  });
  const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
  const [numerology, setNumerology] = React.useState<NumerologyData | null>(
    null,
  );
  const [history, setHistory] = React.useState<StoredSoul[]>([]);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  React.useEffect(() => {
    const initHistory = async () => {
      try {
        const db = await openDB();
        const legacyRaw = localStorage.getItem(LEGACY_KEY);
        let legacyItems: any[] = [];
        if (legacyRaw) {
          try {
            legacyItems = JSON.parse(legacyRaw);
          } catch {}
        }
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        if (legacyItems.length > 0) {
          legacyItems.forEach((item) => {
            const name = item.name || item.fullName || item.title;
            const d = item.day || item.birthDay || item.dayOfBirth;
            const m = item.month || item.birthMonth || item.monthOfBirth;
            const y = item.year || item.birthYear || item.yearOfBirth;
            if (name && d && m && y) {
              const soulId = `${String(name).trim().replace(/\s+/g, "_")}-${d}-${m}-${y}`;
              store.put({
                ...item,
                id: soulId,
                name: String(name).trim(),
                day: Number(d),
                month: Number(m),
                year: Number(y),
                gender: item.gender || "male",
                timestamp: item.timestamp || Date.now(),
              });
            }
          });
        }
        tx.oncomplete = () => {
          if (legacyItems.length > 0) localStorage.removeItem(LEGACY_KEY);
          const finalTx = db.transaction(STORE_NAME, "readonly");
          const finalStore = finalTx.objectStore(STORE_NAME);
          const req = finalStore.getAll();
          req.onsuccess = () =>
            setHistory(
              (req.result as StoredSoul[]).sort(
                (a, b) =>
                  Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
                  (b.timestamp || 0) - (a.timestamp || 0),
              ),
            );
        };
        tx.onerror = () => {
          const fbTx = db.transaction(STORE_NAME, "readonly");
          const fbStore = fbTx.objectStore(STORE_NAME);
          const req = fbStore.getAll();
          req.onsuccess = () =>
            setHistory(
              (req.result as StoredSoul[]).sort(
                (a, b) =>
                  Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
                  (b.timestamp || 0) - (a.timestamp || 0),
              ),
            );
        };
      } catch {}
    };
    initHistory();
  }, []);
  const refreshHistory = React.useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = (req.result || []) as StoredSoul[];
        rows.sort(
          (a, b) =>
            Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
            (b.timestamp || 0) - (a.timestamp || 0),
        );
        setHistory(rows);
      };
    } catch {}
  }, []);
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (!encoded) return;
    try {
      const decoded = JSON.parse(
        decodeURIComponent(escape(atob(encoded))),
      ) as AstroInsightInput;
      if (decoded?.name && decoded.day && decoded.month && decoded.year) {
        const data = { ...decoded, gender: decoded.gender || "male" };
        setFormData(data);
        processRequest(data);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch {}
    // processRequest is intentionally omitted to avoid re-processing after render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addHistoryRecord = async (item: AstroInsightInput) => {
    const sanitizedName = item.name.trim();
    const soulId = `${sanitizedName.replace(/\s+/g, "_")}-${item.day}-${item.month}-${item.year}`;
    const timestamp = Date.now();
    const record = {
      ...item,
      name: sanitizedName,
      id: soulId,
      timestamp,
      day: Number(item.day),
      month: Number(item.month),
      year: Number(item.year),
    };
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () =>
        setHistory((prev) =>
          [record, ...prev.filter((h) => (h as any).id !== soulId)].sort(
            (a, b) =>
              Number(Boolean((b as any).pinned)) -
                Number(Boolean((a as any).pinned)) ||
              ((b as any).timestamp || 0) - ((a as any).timestamp || 0),
          ),
        );
    } catch {}
  };
  const updateSoulRecord = async (record: StoredSoul) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = refreshHistory;
    } catch {}
  };
  const deleteSoulRecord = async (record: StoredSoul) => {
    if (!confirm(`Delete ${record.name} from the Archivum?`)) return;
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete((record as any).id);
      tx.oncomplete = refreshHistory;
    } catch {}
  };
  const pinSoulRecord = async (record: StoredSoul) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      history.forEach((s) =>
        store.put({ ...s, pinned: (s as any).id === (record as any).id }),
      );
      tx.oncomplete = refreshHistory;
    } catch {}
  };
  const renameSoulRecord = async (record: StoredSoul) => {
    const next = prompt("Rename this soul:", record.name)?.trim();
    if (!next || next === record.name) return;
    await updateSoulRecord({ ...record, name: next });
  };
  const exportArchivum = () => {
    const payload = {
      app: "Mystique Compass",
      version: 2,
      exportedAt: new Date().toISOString(),
      souls: history,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mystique-archivum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importArchivumFile = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const souls = Array.isArray(data) ? data : data.souls;
      if (!Array.isArray(souls)) throw new Error("Invalid Archivum file");
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      souls.forEach((item: any) => {
        if (!item.name || !item.day || !item.month || !item.year) return;
        const id =
          item.id ||
          `${String(item.name).trim().replace(/\s+/g, "_")}-${item.day}-${item.month}-${item.year}`;
        store.put({
          ...item,
          id,
          name: String(item.name).trim(),
          day: Number(item.day),
          month: Number(item.month),
          year: Number(item.year),
          gender: item.gender || "male",
          timestamp: item.timestamp || Date.now(),
        });
      });
      tx.oncomplete = () => {
        refreshHistory();
        toast({
          title: "Archivum Imported",
          description: `${souls.length} record(s) were processed.`,
        });
      };
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: err?.message || "Could not import that file.",
      });
    }
  };
  const handleReset = () => {
    if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setInsight(null);
    setNumerology(null);
    setFormData({ name: "", day: 0, month: 0, year: 0, gender: "" });
  };
  const processRequest = React.useCallback(
    (data: AstroInsightInput) => {
      if (
        !data.name ||
        !data.day ||
        !data.month ||
        !data.year ||
        !data.gender
      ) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill out all the fields.",
        });
        return;
      }
      const dt = new Date(
        Number(data.year),
        Number(data.month) - 1,
        Number(data.day),
      );
      if (
        dt.getFullYear() !== Number(data.year) ||
        dt.getMonth() !== Number(data.month) - 1 ||
        dt.getDate() !== Number(data.day)
      ) {
        toast({
          variant: "destructive",
          title: "Invalid Birth Date",
          description: "Please enter a real calendar date.",
        });
        return;
      }
      startTransition(() => {
        void (async () => {
        const result = await getAstroInsightAction(data);
        if (result.success && result.insight && result.numerology) {
          setInsight(result.insight);
          setNumerology(result.numerology);
          addHistoryRecord(data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "An unexpected error occurred.",
          });
        }
        })();
      });
    },
    [toast],
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processRequest({
      name: formData.name,
      day: parseInt(String(formData.day)),
      month: parseInt(String(formData.month)),
      year: parseInt(String(formData.year)),
      gender: formData.gender,
    });
  };
  const handleFamousPersonSelect = (person: FamousPerson) => {
    const personData: AstroInsightInput = {
      name: person.name,
      day: person.day,
      month: person.month,
      year: person.year,
      gender: person.gender,
    };
    setFormData(personData);
    processRequest(personData);
  };
  const handleHistoryClick = (item: AstroInsightInput) => {
    setIsHistoryOpen(false);
    setFormData(item);
    processRequest(item);
  };
  const [oracleOnly, setOracleOnly] = React.useState(
    typeof window !== "undefined" && /(^|[?&#])oracle(=1)?\b/.test(window.location.search + window.location.hash)
  );
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setOracleOnly(/(^|[?&#])oracle(=1)?\b/.test(window.location.search + window.location.hash));
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, []);
  if (oracleOnly) {
    return (
      <div className="w-full max-w-3xl mx-auto px-3 pt-6 pb-24">
        <MatchOraclePanel onClose={() => setOracleOnly(false)} />
      </div>
    );
  }
  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <AnimatePresence mode="wait">
        {insight && numerology ? (
          <motion.div key="results">
            <ResultsDisplay
              insight={insight}
              numerology={numerology}
              history={history}
              onReset={handleReset}
              onHistoryOpen={() => setIsHistoryOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importArchivumFile(file);
                e.currentTarget.value = "";
              }}
            />
            <ProfileForm
              formData={formData}
              isPending={isPending}
              onSubmit={handleSubmit}
              onHistoryOpen={() => setIsHistoryOpen(true)}
              onSelectChange={(v) =>
                setFormData((prev) => ({ ...prev, gender: v }))
              }
              onFieldChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              onFamousPersonSelect={handleFamousPersonSelect}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setOracleOnly(true)}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#f1d98a",
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 999,
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                ⚽ Match Oracle — fixture dossier
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOracleOnly(true)}
        aria-label="Open the Match Oracle"
        style={{
          position: "fixed",
          left: "1rem",
          bottom: "1.15rem",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.6rem 0.85rem",
          borderRadius: 999,
          border: "1px solid rgba(212,175,55,0.45)",
          background: "linear-gradient(135deg, rgba(30,14,60,0.97), rgba(60,26,96,0.94))",
          color: "#f1d98a",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.66rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontWeight: 800,
          boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
          cursor: "pointer",
        }}
      >
        ⚽ Oracle
      </button>
      <SheetContent
        className="w-[90%] sm:max-w-md"
        style={{
          background: "rgba(9,16,35,0.98)",
          borderLeft: "1px solid rgba(200,168,75,0.22)",
        }}
      >
        <SheetHeader className="pb-6 border-b border-white/10">
          <SheetTitle className="font-decorative text-xl text-primary">
            Archivum of Souls
          </SheetTitle>
          <p className="text-[10px] font-cinzel uppercase tracking-widest text-slate-500">
            indefinite records • local storage
          </p>
          <ImportExportButtons
            onImport={() => importInputRef.current?.click()}
            onExport={exportArchivum}
          />
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-3 py-4 pr-4">
            {history.length > 0 ? (
              history.map((item, index) => (
                <button
                  key={`${(item as any).id || index}`}
                  className="w-full text-left p-4 rounded-xl transition-all duration-300 group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-base font-bold text-slate-100 group-hover:text-primary transition-colors">
                      {(item as any).pinned ? "★ " : ""}
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-cinzel uppercase tracking-wider text-slate-500">
                      <span>
                        Born {item.day}/{item.month}/{item.year}
                      </span>
                      <span className="opacity-30">•</span>
                      <span
                        className={
                          item.gender === "male"
                            ? "text-blue-400/70"
                            : "text-pink-400/70"
                        }
                      >
                        {item.gender}
                      </span>
                    </div>
                    <ArchivumActions
                      item={item as StoredSoul}
                      onLoad={handleHistoryClick}
                      onPin={pinSoulRecord}
                      onRename={renameSoulRecord}
                      onDelete={deleteSoulRecord}
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4">
                <History className="h-12 w-12 stroke-[1]" />
                <p className="font-cinzel text-xs uppercase tracking-widest">
                  The Archivum is empty
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
