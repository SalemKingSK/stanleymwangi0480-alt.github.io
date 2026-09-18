import React, { useEffect, useMemo, useRef } from 'react';

interface Props {
  text: string;
  activeSentenceIndex: number;
  sentences: string[];
}

type BlockKind = 'hero' | 'heading' | 'subheading' | 'probability' | 'bullet' | 'numbered' | 'divider' | 'empty' | 'body' | 'compound';

interface Block {
  kind: BlockKind;
  text: string;
  label?: string;
  percent?: number;
}

function renderInline(raw: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|==([^=]+)==|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > last) parts.push(<React.Fragment key={key++}>{raw.slice(last, match.index)}</React.Fragment>);
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++} style={{ color: '#f1d98a', fontWeight: 800 }}>{match[2]}</strong>);
    } else if (match[0].startsWith('==')) {
      parts.push(<span key={key++} style={{ color: '#c4b5fd', fontStyle: 'italic', fontWeight: 700 }}>{match[3]}</span>);
    } else {
      parts.push(<code key={key++} style={{ color: '#93c5fd', background: 'rgba(147,197,253,0.08)', padding: '0.05rem 0.25rem', borderRadius: 4 }}>{match[4]}</code>);
    }
    last = match.index + match[0].length;
  }
  if (last < raw.length) parts.push(<React.Fragment key={key++}>{raw.slice(last)}</React.Fragment>);
  return <>{parts}</>;
}

const SECTION_HEADING_RE = /^\d+\.\s+[A-Z][A-Z0-9 ,/&-]+$/;
const PROBABILITY_RE = /^(?:\d+\.\s*)?(.+?)\s+[—–-]\s+(\d{1,3})%$/;
const NUMBERED_RE = /^\d+\.\s+(.+)/;
const COMPOUND_RE = /^[0-9]+\/[0-9]+\s*[—–-]/;

function isHero(line: string): boolean {
  return /^(FORENSIC|DUAL-ESSENCE|UNIVERSAL YEAR)/i.test(line.trim());
}

function classifyLine(line: string): Block {
  const t = line.trim();
  if (!t) return { kind: 'empty', text: '' };
  if (/^---+$/.test(t)) return { kind: 'divider', text: t };
  if (isHero(t)) return { kind: 'hero', text: t };
  if (SECTION_HEADING_RE.test(t)) return { kind: 'heading', text: t.replace(/^\d+\.\s+/, '') };
  const probability = t.match(PROBABILITY_RE);
  if (probability && Number(probability[2]) <= 100) {
    return { kind: 'probability', text: t, label: probability[1].replace(/^\d+\.\s+/, '').trim(), percent: Number(probability[2]) };
  }
  if (/^[•◆*+-]\s+/.test(t)) return { kind: 'bullet', text: t.replace(/^[•◆*+-]\s+/, '') };
  const numbered = t.match(NUMBERED_RE);
  if (numbered && !SECTION_HEADING_RE.test(t)) return { kind: 'numbered', text: numbered[1] };
  if (/^[A-Z][A-Za-z /-]{2,}:$/.test(t) || /^(Closest historical cluster|Likely decisions|Personality shift|Master-number note|Alert note|False-positive lesson):/i.test(t)) {
    return { kind: 'subheading', text: t };
  }
  if (COMPOUND_RE.test(t)) return { kind: 'compound', text: t };
  return { kind: 'body', text: t };
}

function parseBlocks(text: string): Block[] {
  const rawLines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: 'body', text: paragraph.join(' ').replace(/\s+/g, ' ').trim() });
    paragraph = [];
  };

  for (const line of rawLines) {
    const classified = classifyLine(line);
    if (classified.kind === 'body') {
      paragraph.push(classified.text);
      continue;
    }
    flush();
    blocks.push(classified);
  }
  flush();
  return blocks;
}

function probabilityColor(percent: number): string {
  if (percent >= 85) return '#f1d98a';
  if (percent >= 70) return '#86efac';
  if (percent >= 50) return '#67e8f9';
  if (percent >= 35) return '#c4b5fd';
  return '#94a3b8';
}

function ProbabilityBar({ label, percent }: { label: string; percent: number }) {
  const color = probabilityColor(percent);
  return (
    <div
      title={`${label}: ${percent}%`}
      style={{
        margin: '0.55rem 0',
        padding: '0.68rem 0.72rem',
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.045), rgba(139,92,246,0.055))',
        border: '1px solid rgba(167,139,250,0.18)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', alignItems: 'baseline', marginBottom: '0.38rem' }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(231,221,255,0.86)' }}>{label}</span>
        <span style={{ fontFamily: "'Cinzel', serif", color, fontWeight: 800, fontSize: '0.72rem' }}>{percent}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'rgba(15,12,35,0.95)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(3, Math.min(100, percent))}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}, rgba(167,139,250,0.88))`, boxShadow: `0 0 16px ${color}55` }} />
      </div>
    </div>
  );
}

export const ScrollableTextDisplay: React.FC<Props> = ({ text, activeSentenceIndex, sentences }) => {
  const sentenceRefs = useRef<(HTMLElement | null)[]>([]);
  const blocks = useMemo(() => parseBlocks(text || ''), [text]);
  const activeSnippet = activeSentenceIndex >= 0 ? (sentences[activeSentenceIndex] || '').trim().replace(/\s+/g, ' ').slice(0, 64) : '';

  useEffect(() => {
    sentenceRefs.current = sentenceRefs.current.slice(0, blocks.length);
  }, [blocks.length]);

  useEffect(() => {
    if (activeSentenceIndex >= 0) {
      const idx = blocks.findIndex((b) => activeSnippet && b.text.replace(/\s+/g, ' ').includes(activeSnippet));
      if (idx >= 0) sentenceRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSentenceIndex, activeSnippet, blocks]);

  if (!text) return null;

  return (
    <div style={{ lineHeight: 1.72, paddingBottom: '0.5rem' }}>
      {blocks.map((block, idx) => {
        const isActive = !!activeSnippet && block.text.replace(/\s+/g, ' ').includes(activeSnippet);
        const activeWrap: React.CSSProperties = isActive
          ? { background: 'rgba(212,175,55,0.11)', borderRadius: 10, outline: '1px solid rgba(212,175,55,0.2)' }
          : {};
        const setRef = (el: HTMLElement | null) => { sentenceRefs.current[idx] = el; };

        if (block.kind === 'empty') return <div key={idx} ref={setRef} style={{ height: '0.45rem' }} />;
        if (block.kind === 'divider') return <div key={idx} ref={setRef} style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)', margin: '1.25rem 0' }} />;
        if (block.kind === 'probability') return <div key={idx} ref={setRef} style={activeWrap}><ProbabilityBar label={block.label || block.text} percent={block.percent || 0} /></div>;

        if (block.kind === 'hero') {
          return (
            <div key={idx} ref={setRef} style={{ ...activeWrap, margin: '0.2rem 0 0.9rem', padding: '0.82rem 0.9rem', borderRadius: 16, background: 'linear-gradient(135deg, rgba(212,175,55,0.13), rgba(139,92,246,0.09))', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem', letterSpacing: '0.14em', lineHeight: 1.55, textTransform: 'uppercase', color: '#f1d98a', fontWeight: 800 }}>{renderInline(block.text)}</div>
            </div>
          );
        }

        if (block.kind === 'heading') {
          return (
            <div key={idx} ref={setRef} style={{ ...activeWrap, margin: '1.45rem 0 0.7rem', padding: '0.55rem 0.7rem', borderRadius: 12, background: 'rgba(139,92,246,0.10)', borderLeft: '3px solid rgba(212,175,55,0.85)' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#d4af37', fontWeight: 800 }}>{renderInline(block.text)}</div>
            </div>
          );
        }

        if (block.kind === 'subheading' || block.kind === 'compound') {
          return (
            <div key={idx} ref={setRef} style={{ ...activeWrap, margin: '0.95rem 0 0.35rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.11em', textTransform: 'uppercase', color: block.kind === 'compound' ? '#f1d98a' : '#c4b5fd', fontWeight: 750 }}>{renderInline(block.text)}</div>
            </div>
          );
        }

        if (block.kind === 'bullet' || block.kind === 'numbered') {
          return (
            <div key={idx} ref={setRef} style={{ ...activeWrap, display: 'grid', gridTemplateColumns: '1.1rem 1fr', gap: '0.45rem', alignItems: 'start', margin: '0.5rem 0', paddingLeft: 0 }}>
              <span style={{ color: block.kind === 'numbered' ? '#d4af37' : '#a78bfa', fontSize: '0.72rem', lineHeight: 1.7, textAlign: 'center' }}>{block.kind === 'numbered' ? '›' : '◆'}</span>
              <span style={{ fontSize: '0.84rem', color: 'rgba(231,221,255,0.86)', lineHeight: 1.75 }}>{renderInline(block.text)}</span>
            </div>
          );
        }

        return (
          <p key={idx} ref={setRef} style={{ ...activeWrap, fontSize: '0.86rem', lineHeight: 1.82, color: 'rgba(231,221,255,0.86)', margin: '0.65rem 0' }}>
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
};
