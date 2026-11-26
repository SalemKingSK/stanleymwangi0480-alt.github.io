/**
 * Marks which Curriculum field a piece of reading belongs to.
 *
 * Sections wrap their content in <StudyScope field=… variant=…>; every
 * AccordionContentWithPlayer inside writes the tag onto its read-aloud scope
 * as data attributes, which the tracker reads when the voice finishes the
 * passage. A passage can override the tag or name its `part`.
 */
import * as React from "react";

export interface StudyTag {
  /** Field id from the curriculum catalogue, e.g. "astro.totem". */
  field: string;
  /** Which variant of the field this chart shows, e.g. "Rat". */
  variant?: string | number | null;
  /** Which passage of the field ("main" when a field has one passage). */
  part?: string;
  /** Set by StudyBlock: the whole block is one passage, so readers inside don't tag themselves. */
  container?: boolean;
}

const StudyContext = React.createContext<StudyTag | null>(null);

export function StudyScope({
  field,
  variant,
  part,
  children,
}: StudyTag & { children: React.ReactNode }) {
  const parent = React.useContext(StudyContext);
  const value = React.useMemo<StudyTag>(
    () => ({ field, variant: variant ?? parent?.variant ?? null, part }),
    [field, variant, part, parent?.variant],
  );
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

/**
 * A block studied as one passage: everything read aloud inside it counts
 * towards the same field/variant/part, and it is studied once all of it has
 * been heard (rather than once per inner Listen button).
 */
export function StudyBlock({
  field,
  variant,
  part,
  children,
  ...rest
}: StudyTag & { children: React.ReactNode } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const value = React.useMemo<StudyTag>(() => ({ field, variant: variant ?? null, part, container: true }), [field, variant, part]);
  return (
    <StudyContext.Provider value={value}>
      <div {...rest} {...studyAttrs({ field, variant, part })}>
        {children}
      </div>
    </StudyContext.Provider>
  );
}

export function useStudyTag(): StudyTag | null {
  return React.useContext(StudyContext);
}

/**
 * Data attributes for a read-aloud scope. `own` is a tag given straight to the
 * passage: its field replaces the scope's; its part/variant refine it.
 */
export function studyAttrs(
  scope: StudyTag | null,
  own?: Partial<StudyTag> | false,
): Record<string, string> {
  if (own === false) return {};
  // Inside a StudyBlock the block itself carries the tag.
  if (scope?.container && (!own?.field || own.field === scope.field)) return {};
  const field = own?.field ?? scope?.field;
  if (!field) return {};
  const variant = own?.variant ?? (own?.field && own.field !== scope?.field ? null : scope?.variant);
  const part = own?.part ?? (own?.field && own.field !== scope?.field ? undefined : scope?.part);
  const out: Record<string, string> = { "data-study-field": field };
  if (variant !== null && variant !== undefined && variant !== "") out["data-study-variant"] = String(variant);
  out["data-study-part"] = part || "main";
  return out;
}
