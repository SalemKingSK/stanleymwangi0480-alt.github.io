/**
 * Reads the text of the user's handbook PDF in the browser with pdf.js
 * (loaded only when they pick a file). Returns the lines with their font sizes
 * and positions for parse.ts. Nothing leaves the device.
 */
import type { PdfLine } from "./types";

interface TextItemLike { str: string; transform: number[]; width: number; height: number; hasEOL?: boolean }

/** Groups pdf.js text items into lines (items on the same baseline). */
export function itemsToLines(page: number, items: TextItemLike[]): PdfLine[] {
  const lines: PdfLine[] = [];
  let cur: PdfLine | null = null;
  for (const it of items) {
    if (typeof it.str !== "string") continue;
    const x = it.transform[4], y = it.transform[5];
    if (cur && Math.abs(y - cur.y) > 2) { lines.push(cur); cur = null; }
    if (it.str === "") {
      if (it.hasEOL && cur) { lines.push(cur); cur = null; }
      continue;
    }
    if (!cur) cur = { page, y, x0: x, x1: x + it.width, size: it.height, text: "" };
    cur.text += it.str;
    cur.x1 = Math.max(cur.x1, x + it.width);
    cur.size = Math.max(cur.size, it.height);
    if (it.hasEOL) { lines.push(cur); cur = null; }
  }
  if (cur) lines.push(cur);
  return lines.filter((l) => l.text.trim());
}

export async function extractPdfLines(
  data: ArrayBuffer,
  onProgress?: (page: number, total: number) => void,
): Promise<{ lines: PdfLine[]; pages: number }> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Bundled by Vite as a plain .js module worker (served with a JavaScript type everywhere).
  const PdfWorker = (await import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker")).default;
  const port = new PdfWorker();
  pdfjs.GlobalWorkerOptions.workerPort = port;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false }).promise;
  const lines: PdfLine[] = [];
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      lines.push(...itemsToLines(p, tc.items as unknown as TextItemLike[]));
      page.cleanup();
      onProgress?.(p, doc.numPages);
    }
    return { lines, pages: doc.numPages };
  } finally {
    await doc.destroy().catch(() => {});
    port.terminate();
    pdfjs.GlobalWorkerOptions.workerPort = null;
  }
}
