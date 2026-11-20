import * as React from "react";
import { Upload, Download, Pin, Trash2, Pencil } from "lucide-react";
import type { AstroInsightInput } from "./types";

// Lightweight Archivum controls, split out of engagement-tools so the landing
// page doesn't have to download the whole engagement/compatibility engine.
export type StoredSoul = AstroInsightInput & {
  id?: string;
  timestamp?: number;
  pinned?: boolean;
};

export function tinyButtonStyle(color = "#d4af37"): React.CSSProperties {
  return {
    border: `1px solid ${color}55`,
    color,
    background: `${color}14`,
    borderRadius: 10,
    padding: "0.42rem 0.6rem",
    fontFamily: "'Cinzel',serif",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
  };
}
export function ArchivumActions({
  item,
  onLoad,
  onPin,
  onRename,
  onDelete,
}: {
  item: StoredSoul;
  onLoad: (s: AstroInsightInput) => void;
  onPin: (s: StoredSoul) => void;
  onRename: (s: StoredSoul) => void;
  onDelete: (s: StoredSoul) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.35rem",
        flexWrap: "wrap",
        marginTop: "0.65rem",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button style={tinyButtonStyle()} onClick={() => onLoad(item)}>
        Open
      </button>
      <button style={tinyButtonStyle("#f1d98a")} onClick={() => onPin(item)}>
        <Pin size={11} style={{ display: "inline", marginRight: 4 }} />
        Pin
      </button>
      <button style={tinyButtonStyle("#67e8f9")} onClick={() => onRename(item)}>
        <Pencil size={11} style={{ display: "inline", marginRight: 4 }} />
        Rename
      </button>
      <button style={tinyButtonStyle("#fb7185")} onClick={() => onDelete(item)}>
        <Trash2 size={11} style={{ display: "inline", marginRight: 4 }} />
        Delete
      </button>
    </div>
  );
}
export function ImportExportButtons({
  onImport,
  onExport,
}: {
  onImport: () => void;
  onExport: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.45rem",
        flexWrap: "wrap",
        marginTop: "0.75rem",
      }}
    >
      <button style={tinyButtonStyle("#67e8f9")} onClick={onImport}>
        <Upload size={12} style={{ display: "inline", marginRight: 5 }} />
        Import JSON
      </button>
      <button style={tinyButtonStyle("#86efac")} onClick={onExport}>
        <Download size={12} style={{ display: "inline", marginRight: 5 }} />
        Export JSON
      </button>
    </div>
  );
}