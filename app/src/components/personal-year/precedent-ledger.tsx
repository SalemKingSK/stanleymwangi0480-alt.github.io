import * as React from "react";
import type {
  PrecedentLedgerData,
  PrecedentOutcome,
} from "@/lib/numerology/personal-year-synthesis";

const OUTCOME_META: Record<PrecedentOutcome, { label: string; color: string }> = {
  triumph: { label: "Triumph", color: "#f1d98a" },
  legacy: { label: "Legacy", color: "#86efac" },
  transition: { label: "Turning point", color: "#67e8f9" },
  mixed: { label: "Mixed", color: "#c4b5fd" },
  loss: { label: "Reversal", color: "#fb7185" },
};
const ORDER: PrecedentOutcome[] = ["triumph", "legacy", "transition", "mixed", "loss"];

function OutcomeBar({ counts }: { counts: Record<PrecedentOutcome, number> }) {
  const total = ORDER.reduce((t, k) => t + counts[k], 0);
  if (!total) return null;
  return (
    <div>
      <div
        role="img"
        aria-label={ORDER.filter((k) => counts[k]).map((k) => `${OUTCOME_META[k].label}: ${counts[k]}`).join(", ")}
        style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.06)" }}
      >
        {ORDER.filter((k) => counts[k]).map((k) => (
          <div key={k} style={{ width: `${(counts[k] / total) * 100}%`, background: OUTCOME_META[k].color }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem 0.8rem", marginTop: "0.45rem" }}>
        {ORDER.filter((k) => counts[k]).map((k) => (
          <span key={k} style={{ fontSize: "0.68rem", color: "rgba(231,221,255,0.8)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, background: OUTCOME_META[k].color }} />
            {OUTCOME_META[k].label} {counts[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Shows the historical precedents behind a Personal Year reading in
 * proportion: how they turned out, how many there are, and how common the
 * pair is, so a vivid example isn't mistaken for a forecast.
 */
export function PrecedentLedger({ ledger }: { ledger: PrecedentLedgerData }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const total = ORDER.reduce((t, k) => t + ledger.outcomeCounts[k], 0);
  const { baseRate } = ledger;

  return (
    <div style={{ display: "grid", gap: "0.85rem" }}>
      <div
        role="note"
        style={{
          padding: "0.75rem 0.85rem",
          borderRadius: "0.8rem",
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.25)",
          fontSize: "0.74rem",
          lineHeight: 1.5,
          color: "rgba(253,230,138,0.92)",
        }}
      >
        <strong>Precedent is not probability.</strong> Your {ledger.targetYear} pair, {ledger.pairLabel}, is shared by{" "}
        {baseRate.sharers === 1 ? "just your birthday" : `${baseRate.sharers} of the ${baseRate.birthdays} birthdays`} this year
        {" "}(about 1 in {baseRate.oneIn} people). That is still millions of people living this pair at once;
        the cases below show what it has looked like in a few famous lives, not what will happen in yours.
      </div>

      <div>
        <p style={{ margin: "0 0 0.45rem", fontSize: "0.7rem", color: "rgba(231,221,255,0.65)" }}>
          {ledger.outcomeBasis === "exact pair"
            ? `How the ${total} recorded case${total === 1 ? "" : "s"} with your exact pair turned out`
            : `No recorded case has your exact pair. How the ${total} closest matches turned out`}
          {" "}(library: {ledger.libraryTotal} cases, {ledger.libraryPeople} people)
        </p>
        <OutcomeBar counts={ledger.outcomeCounts} />
      </div>

      {ledger.cases.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
          {ledger.cases.map((c) => {
            const isOpen = open === c.id;
            const meta = OUTCOME_META[c.outcome];
            return (
              <li key={c.id} style={{ borderRadius: "0.7rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "0.6rem 0.75rem",
                    color: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: meta.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "rgba(241,245,249,0.95)" }}>
                      {c.person}, {c.year}
                      {c.exactPair ? (
                        <span style={{ marginLeft: 6, fontSize: "0.62rem", color: "#f1d98a", border: "1px solid rgba(241,217,138,0.4)", borderRadius: 999, padding: "0 6px" }}>
                          exact pair
                        </span>
                      ) : null}
                    </span>
                    <span style={{ display: "block", fontSize: "0.66rem", color: "rgba(203,213,225,0.6)" }}>
                      {c.pair} · age {c.age} · {meta.label} · {c.similarity}% similar
                    </span>
                  </span>
                  <span aria-hidden="true" style={{ color: "rgba(212,175,55,0.7)", fontSize: "0.8rem" }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 0.75rem 0.7rem 2.1rem", fontSize: "0.74rem", lineHeight: 1.5, color: "rgba(226,232,240,0.85)" }}>
                    <p style={{ margin: "0 0 0.35rem" }}>{c.event}.</p>
                    <p style={{ margin: "0 0 0.35rem" }}>
                      <span style={{ color: "rgba(212,175,55,0.85)" }}>Lesson: </span>
                      {c.lesson}
                    </p>
                    {c.caveat && (
                      <p style={{ margin: "0 0 0.35rem", color: "rgba(203,213,225,0.6)" }}>
                        <span>Caveat: </span>
                        {c.caveat}
                      </p>
                    )}
                    {c.sources.length > 0 && (
                      <p style={{ margin: 0, fontSize: "0.66rem", color: "rgba(203,213,225,0.55)", wordBreak: "break-word" }}>
                        Sources: {c.sources.join(" · ")}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
