import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   VOL. 02 — 查找 · A Manual of Search Algorithms
   (Technical Specimen × Editorial Academic)
   ════════════════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,700&family=Noto+Serif+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

.search-lab, .search-lab *, .search-lab *::before, .search-lab *::after { box-sizing: border-box; }

.search-lab {
  --cream: #F1EADA;
  --cream-2: #F7F2E6;
  --cream-3: #EDE4CE;
  --ink: #1F1B17;
  --ink-2: #3A3530;
  --ink-3: #7A6F5E;
  --accent: #C7381A;
  --accent-soft: #D66B4D;
  --accent-glow: rgba(199,56,26,0.09);
  --line: #B5A78C;
  --line-2: #CEC3A8;
  --ok: #2B7A4B;
  --warn: #B86F1F;
  --bad: #C7381A;
  --font-serif: 'Fraunces', 'Noto Serif SC', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  font-family: var(--font-serif);
  color: var(--ink);
  background: var(--cream);
  background-image:
    repeating-linear-gradient(0deg, rgba(31,27,23,0.022) 0 1px, transparent 1px 26px),
    repeating-linear-gradient(90deg, rgba(31,27,23,0.022) 0 1px, transparent 1px 26px),
    radial-gradient(ellipse 900px 620px at top left, rgba(31,27,23,0.055), transparent 60%),
    radial-gradient(ellipse 900px 620px at bottom right, rgba(31,27,23,0.045), transparent 60%);
  min-height: 100vh;
  padding: 40px 56px 80px;
  font-feature-settings: "kern", "liga";
  -webkit-font-smoothing: antialiased;
}

/* ─── Header ───────────────────────────────────────────── */
.lab-head {
  border-top: 3px double var(--ink);
  border-bottom: 1px solid var(--ink);
  padding: 16px 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.lab-head .mono-sm {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lab-head .accent { color: var(--accent); }

.lab-title {
  font-family: var(--font-serif);
  font-size: 96px;
  font-weight: 500;
  line-height: 0.92;
  letter-spacing: -0.025em;
  margin: 40px 0 20px;
  max-width: 1100px;
  font-variation-settings: "opsz" 144;
}
.lab-title em {
  font-style: italic;
  font-weight: 700;
  color: var(--accent);
  font-variation-settings: "opsz" 144;
}
.lab-title .zh { display: block; font-size: 0.55em; margin-top: 10px; letter-spacing: 0; color: var(--ink-2); font-weight: 500; }

.lab-sub {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  margin-bottom: 44px;
  border-bottom: 1px solid var(--line);
}
.lab-sub .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
.lab-sub .lab {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lab-sub em { font-family: var(--font-serif); font-style: italic; color: var(--ink-2); font-size: 16px; }
.lab-sub .sep { color: var(--line); padding: 0 2px; }

/* ─── Tabs ─────────────────────────────────────────────── */
.tabbar {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  margin-bottom: 56px;
}
.tabbar .tab {
  background: transparent;
  border: none;
  border-right: 1px solid var(--line);
  padding: 14px 10px 12px;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-mono);
  color: var(--ink-2);
  transition: background 0.2s;
}
.tabbar .tab:last-child { border-right: none; }
.tabbar .tab:hover { background: var(--cream-3); }
.tabbar .tab.active { background: var(--ink); color: var(--cream); }
.tabbar .tab .num {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--ink-3);
}
.tabbar .tab.active .num { color: var(--accent-soft); }
.tabbar .tab .zh {
  display: block;
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 500;
  margin-top: 6px;
  letter-spacing: 0;
  color: inherit;
}
.tabbar .tab .en {
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 11px;
  margin-top: 2px;
  color: var(--ink-3);
  letter-spacing: 0;
}
.tabbar .tab.active .en { color: var(--cream-3); }

/* ─── Specimen Shell ───────────────────────────────────── */
.specimen { margin-bottom: 72px; }

/* ─── Section 1 · Intro (3-column) ─────────────────────── */
.intro {
  display: grid;
  grid-template-columns: 180px 1fr 200px;
  gap: 40px;
  padding-top: 18px;
  padding-bottom: 36px;
  border-bottom: 1px solid var(--line);
}
.intro-side .row { margin-bottom: 18px; }
.intro-side .lab {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.intro-side .val {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
}
.intro-side .val .acc { color: var(--accent); }
.intro-body p {
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.75;
  color: var(--ink-2);
  margin: 0 0 18px 0;
  text-align: justify;
  hyphens: auto;
}
.intro-body p:first-of-type::first-letter {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 700;
  color: var(--accent);
  font-size: 4.2em;
  float: left;
  line-height: 0.86;
  padding: 6px 10px 0 0;
  font-variation-settings: "opsz" 144;
}
.intro-body .kw { font-style: italic; color: var(--ink); }
.intro-body .term { color: var(--accent); font-style: italic; }

/* ─── Section Heading ──────────────────────────────────── */
.section-head {
  display: flex;
  align-items: baseline;
  gap: 18px;
  margin: 38px 0 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--ink);
}
.section-head .num {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 700;
  color: var(--accent);
  font-size: 34px;
  font-variation-settings: "opsz" 144;
}
.section-head h3 {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
}
.section-head em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--ink-3);
  font-size: 16px;
  margin-left: auto;
}

/* ─── Viz Panel ────────────────────────────────────────── */
.viz-wrap {
  position: relative;
  background: var(--cream-2);
  border: 1px solid var(--line);
  padding: 54px 40px 64px;
  margin-bottom: 28px;
}
.viz-mark {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: var(--ink);
  border-style: solid;
  border-width: 0;
}
.viz-mark.tl { top: 8px; left: 8px; border-top-width: 2px; border-left-width: 2px; }
.viz-mark.tr { top: 8px; right: 8px; border-top-width: 2px; border-right-width: 2px; }
.viz-mark.bl { bottom: 8px; left: 8px; border-bottom-width: 2px; border-left-width: 2px; }
.viz-mark.br { bottom: 8px; right: 8px; border-bottom-width: 2px; border-right-width: 2px; }
.viz-tag-tl, .viz-tag-tr {
  position: absolute;
  top: 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.viz-tag-tl { left: 32px; color: var(--ink-3); }
.viz-tag-tr { right: 32px; color: var(--accent); }
.viz-caption {
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--ink-3);
  font-size: 13px;
  margin-top: 32px;
  letter-spacing: 0.01em;
}
.viz-caption .num { font-family: var(--font-mono); font-style: normal; color: var(--accent); font-weight: 500; }

/* ─── Controls ─────────────────────────────────────────── */
.ctrl-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}
.ops {
  background: var(--cream-2);
  border: 1px solid var(--line);
  padding: 22px 24px 20px;
  position: relative;
}
.ops-head {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-bottom: 10px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
}
.ops-head .side { font-family: var(--font-serif); font-style: italic; color: var(--ink-3); text-transform: none; letter-spacing: 0; font-size: 13px; }
.ops-grid { display: flex; flex-direction: column; gap: 14px; }
.ops-group {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dotted var(--line-2);
}
.ops-group:last-child { border-bottom: none; }
.ops-group .glabel {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.in {
  font-family: var(--font-mono);
  font-size: 13px;
  background: var(--cream);
  border: 1px solid var(--line);
  padding: 7px 10px;
  color: var(--ink);
  width: 100%;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
}
.in:focus {
  border-color: var(--accent);
  box-shadow: 3px 3px 0 var(--accent-glow);
}

.btn {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--cream);
  color: var(--ink);
  border: 1px solid var(--ink);
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.05s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.btn .sym { color: var(--accent); font-size: 14px; line-height: 1; }
.btn:hover { background: var(--ink); color: var(--cream); }
.btn:hover .sym { color: var(--accent-soft); }
.btn:active { transform: translate(1px, 1px); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
.btn:disabled:hover { background: var(--cream); color: var(--ink); }
.btn.primary { background: var(--accent); color: var(--cream); border-color: var(--accent); }
.btn.primary:hover { background: var(--ink); border-color: var(--ink); }
.btn.primary .sym { color: var(--cream); }
.btn.ghost { border-color: var(--line); color: var(--ink-3); }

/* ─── Log Panel ────────────────────────────────────────── */
.log {
  background: var(--ink);
  color: var(--cream);
  padding: 20px 22px 18px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 260px;
  max-height: 320px;
}
.log-head {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--line);
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--ink-2);
  display: flex;
  justify-content: space-between;
}
.log-head .right { color: var(--accent-soft); font-family: var(--font-serif); font-style: italic; text-transform: none; letter-spacing: 0; }
.log-body { flex: 1; overflow-y: auto; padding-right: 6px; }
.log-body::-webkit-scrollbar { width: 6px; }
.log-body::-webkit-scrollbar-track { background: var(--ink-2); }
.log-body::-webkit-scrollbar-thumb { background: var(--ink-3); }
.log-entry {
  padding: 2px 0;
  display: flex;
  gap: 10px;
  animation: logIn 0.25s ease-out;
}
.log-entry .ts { color: var(--ink-3); flex-shrink: 0; }
.log-entry .msg { color: var(--cream); }
.log-entry .msg .acc { color: var(--accent-soft); }
.log-entry .msg .ok { color: #7BB98E; }
.log-entry .msg .dim { color: var(--line); }
.log-entry.sep { border-top: 1px dotted var(--ink-3); margin-top: 4px; padding-top: 6px; color: var(--line); }
@keyframes logIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }

/* ─── Complexity Table ─────────────────────────────────── */
.cx {
  margin: 36px 0 28px;
}
.cx-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding-bottom: 12px;
  margin-bottom: 0;
  border-bottom: 1px solid var(--ink);
}
.cx-head .num {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 700;
  color: var(--accent);
  font-size: 30px;
  font-variation-settings: "opsz" 144;
}
.cx-head h4 {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}
.cx-head em { font-family: var(--font-serif); font-style: italic; color: var(--ink-3); font-size: 14px; }
.cx-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 12px;
}
.cx-table th {
  text-align: left;
  padding: 12px 12px 10px;
  border-bottom: 1px solid var(--ink);
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.cx-table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--line-2);
  color: var(--ink-2);
  vertical-align: top;
}
.cx-table .op { font-family: var(--font-serif); font-weight: 500; color: var(--ink); }
.cx-table .n { font-weight: 500; }
.cx-table .n.g { color: var(--ok); }
.cx-table .n.a { color: var(--warn); }
.cx-table .n.r { color: var(--bad); }
.cx-table .note { font-family: var(--font-serif); font-style: italic; color: var(--ink-3); font-size: 13px; }

/* ─── Traits Grid ──────────────────────────────────────── */
.traits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--line);
  margin-top: 38px;
}
.trait {
  padding: 24px 26px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.trait:nth-child(2n) { border-right: none; }
.trait:nth-child(n+3) { border-bottom: none; }
.trait .num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
.trait h5 {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.trait p {
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-2);
  margin: 0;
}
.trait p em { color: var(--accent); font-style: italic; }

/* ─── Cells (arrays) ───────────────────────────────────── */
.cells-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0;
  flex-wrap: nowrap;
  padding: 20px 0;
  position: relative;
  min-height: 90px;
}
.cell {
  width: 52px;
  height: 60px;
  border: 1px solid var(--ink);
  border-right: none;
  background: var(--cream);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  position: relative;
  transition: background 0.25s, color 0.25s, transform 0.25s, box-shadow 0.25s;
  animation: cellEnter 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cell:last-child { border-right: 1px solid var(--ink); }
.cell .idx {
  position: absolute;
  top: -18px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--ink-3);
  letter-spacing: 0.1em;
}
.cell.cur {
  background: var(--accent);
  color: var(--cream);
  transform: translateY(-8px);
  box-shadow: 0 4px 0 var(--ink);
  z-index: 2;
}
.cell.hit {
  background: var(--ok);
  color: var(--cream);
  transform: translateY(-8px);
  box-shadow: 0 4px 0 var(--ink);
}
.cell.miss { color: var(--ink-3); background: var(--cream-3); }
.cell.lo::after, .cell.hi::after, .cell.mid::after {
  position: absolute;
  bottom: -22px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}
.cell.lo::after { content: 'lo'; }
.cell.hi::after { content: 'hi'; }
.cell.mid::after { content: 'mid'; bottom: -22px; color: var(--accent); font-weight: 700; }
.cell.lo, .cell.hi { background: var(--cream-3); }
.cell.inactive { background: repeating-linear-gradient(45deg, var(--cream-2), var(--cream-2) 4px, var(--cream-3) 4px, var(--cream-3) 8px); color: var(--ink-3); }
@keyframes cellEnter {
  from { opacity: 0; transform: translateY(-18px) scale(0.85); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ─── Index tables (for block search) ──────────────────── */
.idx-table {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}
.idx-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--ink);
  border-right: none;
  background: var(--cream);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  min-width: 78px;
  transition: all 0.25s;
}
.idx-cell:last-child { border-right: 1px solid var(--ink); }
.idx-cell .top { font-size: 9px; color: var(--ink-3); letter-spacing: 0.15em; text-transform: uppercase; }
.idx-cell .big { font-family: var(--font-serif); font-size: 18px; font-weight: 500; margin: 2px 0; }
.idx-cell .rng { font-size: 10px; color: var(--ink-3); }
.idx-cell.cur { background: var(--accent); color: var(--cream); transform: translateY(-6px); box-shadow: 0 4px 0 var(--ink); }
.idx-cell.cur .top, .idx-cell.cur .rng { color: var(--cream-3); }
.block-sep {
  display: block;
  height: 16px;
  position: relative;
}

.block-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.block-row {
  display: flex;
  gap: 0;
  position: relative;
}
.block-row .blabel {
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--ink-3);
  white-space: nowrap;
  text-transform: uppercase;
}
.block-row.active .blabel { color: var(--accent); }

/* ─── Trees ────────────────────────────────────────────── */
.tree-canvas {
  position: relative;
  width: 100%;
  min-height: 360px;
  padding: 20px 0 40px;
}
.tree-svg {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  pointer-events: none;
  overflow: visible;
}
.tree-edge {
  stroke: var(--ink-2);
  stroke-width: 1.2;
  fill: none;
  transition: stroke 0.3s;
}
.tree-edge.cur { stroke: var(--accent); stroke-width: 2; }
.tnode {
  position: absolute;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  transform: translate(-50%, -50%);
  transition: left 0.4s cubic-bezier(0.4,0,0.2,1), top 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s, color 0.3s, box-shadow 0.3s, border-color 0.3s;
  animation: cellEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}
.tnode.cur { background: var(--accent); color: var(--cream); border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-glow); z-index: 3; }
.tnode.hit { background: var(--ok); color: var(--cream); border-color: var(--ok); box-shadow: 0 0 0 4px rgba(43,122,75,0.18); z-index: 3; }
.tnode.red { background: var(--accent); color: var(--cream); border-color: var(--ink); }
.tnode.black { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.tnode.red.cur { box-shadow: 0 0 0 4px var(--accent-glow); }
.tnode .bf {
  position: absolute;
  top: -14px;
  right: -10px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent);
  background: var(--cream-2);
  border: 1px solid var(--line);
  padding: 1px 4px;
  border-radius: 2px;
}

/* ─── Hash ─────────────────────────────────────────────── */
.hash-wrap { display: flex; flex-direction: column; gap: 2px; max-width: 760px; margin: 0 auto; }
.hash-bucket {
  display: grid;
  grid-template-columns: 60px 1fr;
  border-bottom: 1px solid var(--line-2);
  min-height: 44px;
  transition: background 0.2s;
}
.hash-bucket:first-child { border-top: 1px solid var(--ink); }
.hash-bucket:last-child { border-bottom: 1px solid var(--ink); }
.hash-bucket.cur { background: var(--accent-glow); }
.hash-idx {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  padding: 12px 14px;
  border-right: 1px solid var(--line-2);
  display: flex;
  align-items: center;
  gap: 6px;
}
.hash-idx .n { color: var(--ink); font-weight: 500; }
.hash-chain {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  gap: 4px;
  flex-wrap: wrap;
}
.hash-item {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 5px 9px;
  background: var(--cream);
  border: 1px solid var(--ink);
  display: flex;
  align-items: center;
  gap: 6px;
  animation: cellEnter 0.35s;
  transition: all 0.25s;
}
.hash-item.cur { background: var(--accent); color: var(--cream); transform: translateY(-4px); box-shadow: 0 3px 0 var(--ink); }
.hash-item.hit { background: var(--ok); color: var(--cream); }
.hash-arrow { color: var(--ink-3); font-family: var(--font-mono); }

/* ─── KMP ──────────────────────────────────────────────── */
.kmp-wrap { display: flex; flex-direction: column; gap: 10px; font-family: var(--font-mono); padding: 12px 0; }
.kmp-line { display: flex; align-items: center; gap: 0; position: relative; justify-content: center; }
.kmp-label { position: absolute; left: 20px; font-size: 10px; letter-spacing: 0.15em; color: var(--ink-3); text-transform: uppercase; top: 50%; transform: translateY(-50%); }
.kmp-cell {
  width: 36px;
  height: 44px;
  border: 1px solid var(--ink);
  border-right: none;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 15px;
  position: relative;
  transition: all 0.25s;
}
.kmp-cell:last-child { border-right: 1px solid var(--ink); }
.kmp-cell.cmp { background: var(--accent); color: var(--cream); transform: translateY(-4px); box-shadow: 0 3px 0 var(--ink); }
.kmp-cell.ok { background: var(--ok); color: var(--cream); }
.kmp-cell.bad { background: var(--bad); color: var(--cream); }
.kmp-cell.dim { color: var(--ink-3); background: var(--cream-2); }
.kmp-cell .idx { position: absolute; top: -16px; font-size: 9px; color: var(--ink-3); left: 50%; transform: translateX(-50%); }
.kmp-next-row {
  display: flex;
  font-family: var(--font-mono);
  font-size: 12px;
  margin-top: 28px;
  border: 1px solid var(--line);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.kmp-next-row .lab {
  padding: 6px 10px;
  background: var(--cream-3);
  border-right: 1px solid var(--line);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-3);
  display: flex;
  align-items: center;
}
.kmp-next-row .c {
  padding: 6px 0;
  width: 32px;
  text-align: center;
  border-right: 1px solid var(--line-2);
}
.kmp-next-row .c:last-child { border-right: none; }

/* ─── Concept Diagram ──────────────────────────────────── */
.concept-tree { display: flex; justify-content: center; position: relative; padding: 20px 0 40px; }
.concept-root {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.concept-node {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 8px 16px;
  border: 1px solid var(--ink);
  background: var(--cream);
  letter-spacing: 0.05em;
  text-align: center;
  min-width: 110px;
}
.concept-node.head { background: var(--ink); color: var(--cream); font-weight: 600; }
.concept-node.acc { border-color: var(--accent); color: var(--accent); }
.concept-line-v { width: 1px; background: var(--line); height: 20px; align-self: center; }
.concept-branches { display: flex; justify-content: center; gap: 8px; margin-top: 0; }
.concept-col { display: flex; flex-direction: column; align-items: center; position: relative; padding: 0 10px; }
.concept-col::before { content: ''; position: absolute; top: -20px; left: 50%; width: 1px; height: 20px; background: var(--line); }

.concept-bar {
  height: 1px;
  background: var(--line);
  width: calc(100% - 40px);
  position: absolute;
  top: -20px;
  left: 20px;
}

.concept-children { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
.concept-child {
  font-family: var(--font-serif);
  font-size: 13px;
  padding: 6px 12px;
  background: var(--cream-2);
  border-left: 2px solid var(--accent);
  color: var(--ink-2);
}

/* ─── Figure labels / misc ─────────────────────────────── */
.fig-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding: 2px 0;
  margin-bottom: 6px;
}
.fig-hline { height: 1px; background: var(--line); margin: 20px 0; }

/* ─── Submode selector (for tree/B-tree) ────────────────── */
.submode {
  display: flex;
  gap: 0;
  margin-bottom: 22px;
  border: 1px solid var(--ink);
  width: fit-content;
}
.submode button {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 8px 18px;
  background: var(--cream);
  border: none;
  border-right: 1px solid var(--ink);
  cursor: pointer;
  color: var(--ink-2);
  transition: all 0.15s;
}
.submode button:last-child { border-right: none; }
.submode button.active { background: var(--ink); color: var(--cream); }
.submode button.active .sym { color: var(--accent-soft); }
.submode button:hover:not(.active) { background: var(--cream-3); }

/* ─── Stat strip ───────────────────────────────────────── */
.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--line);
  background: var(--cream-2);
  margin-bottom: 20px;
}
.stat-cell {
  padding: 14px 18px;
  border-right: 1px solid var(--line);
}
.stat-cell:last-child { border-right: none; }
.stat-cell .lab {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.stat-cell .val {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.stat-cell .val .acc { color: var(--accent); font-style: italic; }
.stat-cell .val.sm { font-size: 15px; font-family: var(--font-mono); font-weight: 400; }

/* ─── Footer ───────────────────────────────────────────── */
.lab-foot {
  border-top: 1px solid var(--ink);
  border-bottom: 3px double var(--ink);
  padding: 14px 0;
  margin-top: 80px;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lab-foot em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--accent);
  text-transform: none;
  letter-spacing: 0;
  font-size: 13px;
}

/* ─── Tiny helpers ─────────────────────────────────────── */
.acc { color: var(--accent); }
.mono { font-family: var(--font-mono); }
.ital { font-style: italic; }
.hrule { height: 1px; background: var(--line); margin: 12px 0; }
.dbl-rule { border-top: 3px double var(--ink); margin: 30px 0 22px; }
.dim { color: var(--ink-3); }

/* ─── Responsive safeguards ────────────────────────────── */
@media (max-width: 980px) {
  .search-lab { padding: 24px 20px 48px; }
  .lab-title { font-size: 64px; }
  .intro { grid-template-columns: 1fr; }
  .ctrl-row { grid-template-columns: 1fr; }
  .tabbar { grid-template-columns: repeat(3, 1fr); }
  .tabbar .tab:nth-child(3n) { border-right: none; }
}
`;

/* ════════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════════ */

const nowTs = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

let _idCounter = 1000;
const uid = () => `n${++_idCounter}`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ════════════════════════════════════════════════════════════════════════ */

const VizPanel = ({ figNum, figTitle, status, children, caption }) => (
  <div className="viz-wrap">
    <span className="viz-mark tl" /><span className="viz-mark tr" />
    <span className="viz-mark bl" /><span className="viz-mark br" />
    <span className="viz-tag-tl">FIG. {figNum} · {figTitle}</span>
    {status && <span className="viz-tag-tr">{status}</span>}
    {children}
    {caption && (
      <div className="viz-caption">
        <span className="num">FIG. {figNum}</span> &nbsp;·&nbsp; <em>{caption}</em>
      </div>
    )}
  </div>
);

const LogPanel = ({ title, entries, logRef }) => {
  return (
    <div className="log">
      <div className="log-head">
        <span>§ LOG · {title}</span>
        <span className="right">transcript</span>
      </div>
      <div className="log-body" ref={logRef}>
        {entries.length === 0 && (
          <div className="log-entry"><span className="ts">--:--:--</span><span className="msg dim">waiting for operation…</span></div>
        )}
        {entries.map((e, i) => (
          <div key={i} className={`log-entry ${e.sep ? 'sep' : ''}`}>
            <span className="ts">{e.ts}</span>
            <span className="msg" dangerouslySetInnerHTML={{ __html: e.msg }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const useLog = () => {
  const [entries, setEntries] = useState([]);
  const logRef = useRef(null);
  const push = useCallback((msg, sep = false) => {
    setEntries(es => [...es, { ts: nowTs(), msg, sep }]);
  }, []);
  const clear = useCallback(() => setEntries([]), []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries]);
  return { entries, push, clear, logRef };
};

const SectionHead = ({ num, title, subtitle }) => (
  <div className="section-head">
    <span className="num">§{num}</span>
    <h3>{title}</h3>
    {subtitle && <em>{subtitle}</em>}
  </div>
);

const ComplexityTable = ({ num, title, rows, subtitle = "summary" }) => (
  <div className="cx">
    <div className="cx-head">
      <span className="num">§{num}</span>
      <h4>{title}</h4>
      <em>— {subtitle}</em>
    </div>
    <table className="cx-table">
      <thead>
        <tr>
          <th style={{ width: '24%' }}>操作 · op</th>
          <th style={{ width: '16%' }}>最好 · best</th>
          <th style={{ width: '16%' }}>平均 · avg</th>
          <th style={{ width: '16%' }}>最坏 · worst</th>
          <th>备注 · note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="op">{r.op}</td>
            <td><span className={`n ${r.bestT || 'g'}`}>{r.best}</span></td>
            <td><span className={`n ${r.avgT || 'a'}`}>{r.avg}</span></td>
            <td><span className={`n ${r.worstT || 'r'}`}>{r.worst}</span></td>
            <td className="note">{r.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TraitsGrid = ({ traits }) => (
  <div className="traits">
    {traits.map((t, i) => (
      <div key={i} className="trait">
        <div className="num">TRAIT · {String(i + 1).padStart(2, '0')}</div>
        <h5>{t.title}</h5>
        <p dangerouslySetInnerHTML={{ __html: t.body }} />
      </div>
    ))}
  </div>
);

const Intro = ({ meta, children }) => (
  <div className="intro">
    <div className="intro-side">
      {meta.left.map((m, i) => (
        <div key={i} className="row">
          <div className="lab">{m.lab}</div>
          <div className="val" dangerouslySetInnerHTML={{ __html: m.val }} />
        </div>
      ))}
    </div>
    <div className="intro-body">{children}</div>
    <div className="intro-side">
      {meta.right.map((m, i) => (
        <div key={i} className="row">
          <div className="lab">{m.lab}</div>
          <div className="val" dangerouslySetInnerHTML={{ __html: m.val }} />
        </div>
      ))}
    </div>
  </div>
);

const OpsPanel = ({ title, children, side = "operations" }) => (
  <div className="ops">
    <div className="ops-head">
      <span>§ {title}</span>
      <span className="side">— {side}</span>
    </div>
    <div className="ops-grid">{children}</div>
  </div>
);

const OpsRow = ({ label, children }) => (
  <div className="ops-group">
    <span className="glabel">{label}</span>
    {children}
  </div>
);

const StatStrip = ({ stats }) => (
  <div className="stat-strip">
    {stats.map((s, i) => (
      <div key={i} className="stat-cell">
        <div className="lab">{s.lab}</div>
        <div className={`val ${s.sm ? 'sm' : ''}`} dangerouslySetInnerHTML={{ __html: s.val }} />
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 01 — 基本概念 · preliminaries
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenConcepts = () => {
  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">01</span> / 09' },
          { lab: 'TYPE', val: 'theoretical' },
          { lab: 'SCOPE', val: 'survey, asl, taxonomy' },
        ],
        right: [
          { lab: 'KEYWORDS', val: 'key · record<br/>查找表 · asl' },
          { lab: 'PRINCIPLE', val: '比较 ≥ 1 次' },
          { lab: 'MEASURE', val: 'ASL = Σ p<sub>i</sub> · c<sub>i</sub>' },
        ],
      }}>
        <p>
          <span className="term">查找</span>（<em>searching</em>）是在由若干同类数据元素构成的集合中，
          寻找满足某种给定条件的元素的过程。被查找的集合称作<span className="kw">查找表</span>（<em>search table</em>），
          每一个元素通常具有一个能够唯一标识自身的字段——<span className="kw">关键字</span>（<em>key</em>）。
          若关键字唯一地对应一条记录，则称其为<span className="kw">主关键字</span>；否则为<span className="kw">次关键字</span>。
        </p>
        <p>
          查找操作可依表格是否允许变动划为两类：仅允许读取的称<em>静态查找</em>（<span className="kw">static search table</span>），
          同时允许插入与删除的称<em>动态查找</em>（<span className="kw">dynamic search table</span>）。
          衡量查找效率最常用的指标是<span className="term">平均查找长度</span> ASL，即关键字比较次数的数学期望，
          它将贯穿本卷每一节的复杂度讨论。
        </p>
      </Intro>

      <SectionHead num="1" title="查找算法 · a taxonomy" subtitle="fig. genealogy" />

      <VizPanel figNum="01" figTitle="TAXONOMY" status="OVERVIEW · static" caption="search algorithms · 谱系图">
        <ConceptTaxonomy />
      </VizPanel>

      <StatStrip stats={[
        { lab: '关键字 KEY', val: '<span class="acc">K</span>' },
        { lab: '记录数 N', val: 'n' },
        { lab: '比较次数 c<sub>i</sub>', val: '<span class="acc">ASL</span>', sm: false },
        { lab: '概率 p<sub>i</sub>', val: 'Σ p<sub>i</sub> = 1', sm: true },
      ]} />

      <ComplexityTable
        num="2"
        title="主要方法复杂度一览 · at a glance"
        rows={[
          { op: '顺序查找 · sequential', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', note: '无序亦可；ASL = (n+1)/2' },
          { op: '折半查找 · binary', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', note: '必须有序；仅顺序存储' },
          { op: '分块查找 · indexed', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', note: '块间有序 · 块内任意' },
          { op: '二叉搜索树 · bst', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', note: '退化成单支时最差' },
          { op: '平衡树 · avl / rbt', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '旋转维持近似平衡' },
          { op: 'B 树 · b-tree', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '多路平衡 · 磁盘友好' },
          { op: '散列 · hashing', best: 'O(1)', avg: 'O(1)', worst: 'O(n)', note: '装填因子决定退化程度' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '关键字 · Key', body: '能够<em>唯一标识</em>一条记录的字段；主关键字严格单射，次关键字允许重复。' },
        { title: '查找成功 / 失败', body: '找到与给定值相等的记录为<em>成功</em>，否则为<em>失败</em>。两者的 ASL 常分别计算。' },
        { title: '静态 与 动态', body: '只读即为<em>静态</em>；若需插入删除则为<em>动态</em>，后者对存储结构提出更高要求。' },
        { title: '存储结构的张力', body: '顺序存储便于<em>随机访问</em>但移动代价高；链式存储插入便捷却无法二分。取舍是本卷的主旋律。' },
      ]} />
    </div>
  );
};

const ConceptTaxonomy = () => (
  <div className="concept-tree">
    <div className="concept-root">
      <div className="concept-node head">查 找 · SEARCH</div>
      <div className="concept-line-v" />
      <div className="concept-branches" style={{ position: 'relative', paddingTop: 20 }}>
        <div className="concept-bar" />
        {/* static */}
        <div className="concept-col">
          <div className="concept-node">静态查找 · STATIC</div>
          <div className="concept-children">
            <div className="concept-child">顺序查找 <em>sequential</em></div>
            <div className="concept-child">折半查找 <em>binary</em></div>
            <div className="concept-child">分块查找 <em>indexed</em></div>
          </div>
        </div>
        {/* dynamic */}
        <div className="concept-col">
          <div className="concept-node">动态查找 · DYNAMIC</div>
          <div className="concept-children">
            <div className="concept-child">二叉搜索树 <em>BST</em></div>
            <div className="concept-child">AVL · 红黑树 <em>balanced</em></div>
            <div className="concept-child">B 树 / B+ 树 <em>multi-way</em></div>
          </div>
        </div>
        {/* hash */}
        <div className="concept-col">
          <div className="concept-node acc">散列 · HASHING</div>
          <div className="concept-children">
            <div className="concept-child">直接定址 <em>direct</em></div>
            <div className="concept-child">除留余数 <em>modulo</em></div>
            <div className="concept-child">冲突处理 <em>collision</em></div>
          </div>
        </div>
        {/* string */}
        <div className="concept-col">
          <div className="concept-node">串匹配 · STRING</div>
          <div className="concept-children">
            <div className="concept-child">朴素法 <em>brute-force</em></div>
            <div className="concept-child">KMP · next 表</div>
            <div className="concept-child">BM · Rabin-Karp</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 02 — 顺序查找 · sequential
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenSequential = () => {
  const [arr, setArr] = useState([42, 17, 88, 23, 9, 56, 71, 34, 12, 65]);
  const [target, setTarget] = useState('56');
  const [cursor, setCursor] = useState(-1);
  const [found, setFound] = useState(-1);
  const [missed, setMissed] = useState([]);
  const [running, setRunning] = useState(false);
  const [useSentinel, setUseSentinel] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  const reset = () => {
    setCursor(-1); setFound(-1); setMissed([]);
  };

  const doSearch = async () => {
    if (running) return;
    const t = Number(target);
    if (Number.isNaN(t)) { push('<span class="acc">ERR</span> · 目标非数字'); return; }
    reset();
    setRunning(true);
    push(`§ search · 目标 = <span class="acc">${t}</span> · 长度 n = ${arr.length}${useSentinel ? ' · <span class="dim">[哨兵模式]</span>' : ''}`);
    let hit = -1;
    const seen = [];
    for (let i = 0; i < arr.length; i++) {
      setCursor(i);
      await sleep(260);
      if (arr[i] === t) {
        push(`compare a[${i}] = ${arr[i]} · <span class="ok">✓ 命中</span>`);
        hit = i;
        setFound(i);
        break;
      } else {
        push(`compare a[${i}] = ${arr[i]} · <span class="dim">≠ ${t}</span>`);
        seen.push(i);
        setMissed([...seen]);
      }
    }
    setCursor(-1);
    if (hit === -1) push(`fin. · <span class="acc">未命中</span> · 比较 ${arr.length} 次 · O(n)`, true);
    else push(`fin. · 比较 ${hit + 1} 次 · ASL<sub>succ</sub> = (n+1)/2`, true);
    setRunning(false);
  };

  const addElem = () => {
    const v = Math.floor(Math.random() * 90) + 10;
    setArr([...arr, v]);
    push(`append · 新元素 ${v} → a[${arr.length}]`);
    reset();
  };

  const removeLast = () => {
    if (arr.length <= 1) return;
    const v = arr[arr.length - 1];
    setArr(arr.slice(0, -1));
    push(`pop · 移除 ${v} · 长度 = ${arr.length - 1}`);
    reset();
  };

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">02</span> / 09' },
          { lab: 'TYPE', val: 'static · linear' },
          { lab: 'PREREQ', val: '—' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(n)</span>' },
          { lab: 'ASL (succ)', val: '(n+1)/2' },
          { lab: 'STORAGE', val: 'array · list' },
        ],
      }}>
        <p>
          <span className="term">顺序查找</span>（<em>sequential search</em>）是最朴素的查找方法：
          自表首至表尾逐个将元素的关键字与给定值相比较，直至命中或全表扫完。
          其魅力在于<span className="kw">全无前提</span>——数据是否有序、是否随机存储都不影响其可行性，
          代价仅仅是线性的时间。
        </p>
        <p>
          工程上常以"<em>哨兵</em>"（<span className="kw">sentinel</span>）技巧在末端或首端预置目标值，
          如此循环体可省去"是否越界"的判断，每趟节省一次条件跳转。
          此改写不改变 O(n) 的渐近复杂度，却能在常数项上带来可观加速——
          这正是工程师与理论家的典型分野。
        </p>
      </Intro>

      <SectionHead num="1" title="线性扫描 · linear scan" subtitle="fig. specimen" />

      <VizPanel figNum="02" figTitle="LAYOUT · a[0..n-1]" status={running ? '▶ SCANNING' : '◎ IDLE'} caption="逐元素比较 · 直至命中或扫完">
        <div className="cells-row" style={{ flexWrap: 'wrap' }}>
          {arr.map((v, i) => (
            <div
              key={i}
              className={`cell ${cursor === i ? 'cur' : ''} ${found === i ? 'hit' : ''} ${missed.includes(i) && found === -1 ? 'miss' : ''}`}
            >
              <span className="idx">[{i}]</span>
              {v}
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="ctrl-row">
        <OpsPanel title="控制台 · console">
          <OpsRow label="目标 K">
            <input className="in" value={target} onChange={e => setTarget(e.target.value)} disabled={running} />
            <button className="btn primary" onClick={doSearch} disabled={running}>
              查找 <span className="sym">→</span>
            </button>
          </OpsRow>
          <OpsRow label="修改表">
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={addElem} disabled={running}>追加 <span className="sym">＋</span></button>
              <button className="btn" onClick={removeLast} disabled={running}>尾删 <span className="sym">−</span></button>
            </div>
            <button className="btn ghost" onClick={() => { reset(); clear(); }} disabled={running}>清 · ↻</button>
          </OpsRow>
          <OpsRow label="哨兵">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>
              <input type="checkbox" checked={useSentinel} onChange={e => setUseSentinel(e.target.checked)} disabled={running} />
              启用哨兵 / sentinel（示意）
            </label>
            <span />
          </OpsRow>
        </OpsPanel>
        <LogPanel title="sequential" entries={entries} logRef={logRef} />
      </div>

      <ComplexityTable
        num="2"
        title="顺序查找 · 复杂度"
        rows={[
          { op: '成功查找 · hit', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', note: 'ASL = (n+1)/2 · 等概率情形' },
          { op: '失败查找 · miss', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', note: '必须扫完全表 · n+1 次比较', bestT: 'r', avgT: 'r' },
          { op: '追加 · append', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', note: '尾端插入 · 表不必维持秩序' },
          { op: '删除 · remove', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', note: '删除中部需后移 · 或置空标记' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '无前提 · unconditional', body: '数据<em>不必有序</em>、存储结构<em>无须随机</em>——链表亦可胜任。' },
        { title: '实现简朴 · plain form', body: '一重循环加一次比较，代码行数以两手之指即可穷尽。' },
        { title: '哨兵技巧', body: '在 a[n] 位置预置目标值，循环退化为"只判等"，常数级加速 · 工程之美。' },
        { title: '适用场景', body: '短表、偶发查询、无序集合。当 n ≤ 20 左右时，其常数项甚至<em>优于</em>二分。' },
      ]} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 03 — 分块查找 · indexed (block) search
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenBlock = () => {
  const BLOCKS = [
    { max: 22, range: [0, 4], items: [13, 7, 22, 4, 18] },
    { max: 48, range: [5, 9], items: [37, 48, 26, 31, 42] },
    { max: 72, range: [10, 14], items: [55, 72, 61, 50, 68] },
    { max: 96, range: [15, 19], items: [85, 77, 96, 91, 80] },
  ];
  const [target, setTarget] = useState('61');
  const [idxCur, setIdxCur] = useState(-1);
  const [blkRow, setBlkRow] = useState(-1);
  const [cellCur, setCellCur] = useState(-1);
  const [foundCell, setFoundCell] = useState(-1);
  const [running, setRunning] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  const reset = () => { setIdxCur(-1); setBlkRow(-1); setCellCur(-1); setFoundCell(-1); };

  const doSearch = async () => {
    if (running) return;
    const t = Number(target);
    if (Number.isNaN(t)) { push('<span class="acc">ERR</span> · 目标非数字'); return; }
    reset();
    setRunning(true);
    push(`§ block search · 目标 = <span class="acc">${t}</span> · 块数 = ${BLOCKS.length}`);

    // Phase 1: scan index (could be binary but we scan sequentially for clarity)
    let target_blk = -1;
    for (let i = 0; i < BLOCKS.length; i++) {
      setIdxCur(i);
      await sleep(280);
      push(`idx · 块[${i}] max = ${BLOCKS[i].max} · ${t <= BLOCKS[i].max ? '<span class="ok">t ≤ max · 进入</span>' : '<span class="dim">t > max · 越过</span>'}`);
      if (t <= BLOCKS[i].max) { target_blk = i; break; }
    }
    if (target_blk === -1) {
      setIdxCur(-1);
      push(`fin. · 目标 > 最大块上限 · <span class="acc">未命中</span>`, true);
      setRunning(false);
      return;
    }

    // Phase 2: scan within block
    setBlkRow(target_blk);
    push(`§ enter block · 块[${target_blk}] · ${BLOCKS[target_blk].items.length} 项`);
    const blk = BLOCKS[target_blk];
    let hit = -1;
    for (let j = 0; j < blk.items.length; j++) {
      setCellCur(j);
      await sleep(240);
      const v = blk.items[j];
      if (v === t) {
        push(`compare [${target_blk}·${j}] = ${v} · <span class="ok">✓ 命中</span>`);
        setFoundCell(j);
        hit = j;
        break;
      } else {
        push(`compare [${target_blk}·${j}] = ${v} · <span class="dim">≠</span>`);
      }
    }
    if (hit === -1) {
      push(`fin. · 块内未命中 · <span class="acc">未命中</span>`, true);
    } else {
      push(`fin. · 2 阶段共比较 ${target_blk + 1} + ${hit + 1} 次 · ASL ≈ √n`, true);
    }
    setIdxCur(-1); setCellCur(-1);
    setRunning(false);
  };

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">03</span> / 09' },
          { lab: 'TYPE', val: 'static · indexed' },
          { lab: 'PREREQ', val: '块间有序' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(√n)</span>' },
          { lab: 'STRATEGY', val: 'two-level' },
          { lab: 'INDEX', val: 'max · start' },
        ],
      }}>
        <p>
          <span className="term">分块查找</span>（<em>indexed / jump search</em>）介于顺序与二分之间：
          将 n 个元素按顺序划分为若干<span className="kw">块</span>，<em>块间有序</em>而<em>块内任意</em>；
          再为各块建立一张索引表，记载每块的最大关键字与起始位置。
          查找时，先在索引表中定位目标所在块，再在块内顺序扫描。
        </p>
        <p>
          若将块规模取为 √n，则索引表长度亦为 √n，
          两阶段的开销各不超过 √n，总 ASL 约为 <em>√n + 1/2</em>。
          这是一种"懒人的折半"——既无须整表排序，也获得了相当可观的加速，
          尤其适合<span className="kw">频繁插入但偶尔查找</span>的数据集。
        </p>
      </Intro>

      <SectionHead num="1" title="索引 + 扫描 · two-phase" subtitle="fig. specimen" />

      <VizPanel figNum="03" figTitle="LAYOUT · index + blocks" status={running ? '▶ SCANNING' : '◎ IDLE'} caption="上为索引表 · 下为四块数据 · 块间有序块内任意">
        <div className="idx-table">
          {BLOCKS.map((b, i) => (
            <div key={i} className={`idx-cell ${idxCur === i ? 'cur' : ''}`}>
              <div className="top">IDX · {i}</div>
              <div className="big">{b.max}</div>
              <div className="rng">[{b.range[0]}..{b.range[1]}]</div>
            </div>
          ))}
        </div>
        <div className="block-sep" />
        <div className="block-stack">
          {BLOCKS.map((b, i) => (
            <div key={i} className={`block-row ${blkRow === i ? 'active' : ''}`}>
              <span className="blabel">BLK · {i}</span>
              {b.items.map((v, j) => (
                <div
                  key={j}
                  className={`cell ${blkRow === i && cellCur === j ? 'cur' : ''} ${blkRow === i && foundCell === j ? 'hit' : ''}`}
                  style={{ width: 48, height: 48, fontSize: 14 }}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="ctrl-row">
        <OpsPanel title="控制台 · console">
          <OpsRow label="目标 K">
            <input className="in" value={target} onChange={e => setTarget(e.target.value)} disabled={running} />
            <button className="btn primary" onClick={doSearch} disabled={running}>
              查找 <span className="sym">→</span>
            </button>
          </OpsRow>
          <OpsRow label="预设">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => setTarget('61')} disabled={running}>命中 · 61</button>
              <button className="btn" onClick={() => setTarget('91')} disabled={running}>命中 · 91</button>
              <button className="btn" onClick={() => setTarget('40')} disabled={running}>未中 · 40</button>
              <button className="btn" onClick={() => setTarget('99')} disabled={running}>越界 · 99</button>
            </div>
            <span />
          </OpsRow>
          <OpsRow label="日志">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              记录比较次数与阶段 · trace
            </span>
            <button className="btn ghost" onClick={() => { reset(); clear(); }} disabled={running}>清 · ↻</button>
          </OpsRow>
        </OpsPanel>
        <LogPanel title="indexed" entries={entries} logRef={logRef} />
      </div>

      <ComplexityTable
        num="2"
        title="分块查找 · 复杂度"
        rows={[
          { op: '索引定位 · index', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', note: '顺序查找索引表；可改为折半' },
          { op: '块内扫描 · scan', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', note: '块长 √n 时期望最优' },
          { op: '总体 · total', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', note: 'ASL ≈ ½(n/s + s) · s 为块长' },
          { op: '插入 · insert', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', note: '仅需维护所在块与其索引' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '块间有序 · between', body: '前一块的所有关键字都<em>小于</em>后一块的任一关键字；索引表据此构建。' },
        { title: '块内任意 · within', body: '块内元素可乱序排列；插入删除无须整体移动，只影响所在块。' },
        { title: '最优块长 · √n', body: '当块长取 s ≈ √n 时，两阶段开销相等，<em>总 ASL 最小化</em>。' },
        { title: '折衷之美', body: '介乎顺序与折半之间 · 插入友好、查询尚可 · 适合<em>动态较强</em>的静态表。' },
      ]} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 04 — 折半查找 · binary search
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenBinary = () => {
  const [arr] = useState([5, 12, 19, 26, 33, 41, 52, 58, 67, 74, 83, 91, 97]);
  const [target, setTarget] = useState('58');
  const [lo, setLo] = useState(-1);
  const [hi, setHi] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(-1);
  const [inactive, setInactive] = useState([]);
  const [running, setRunning] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  const reset = () => { setLo(-1); setHi(-1); setMid(-1); setFound(-1); setInactive([]); };

  const doSearch = async () => {
    if (running) return;
    const t = Number(target);
    if (Number.isNaN(t)) { push('<span class="acc">ERR</span> · 目标非数字'); return; }
    reset();
    setRunning(true);
    let l = 0, h = arr.length - 1;
    const inact = [];
    push(`§ binary · 目标 = <span class="acc">${t}</span> · 区间 [${l}, ${h}]`);
    setLo(l); setHi(h);
    await sleep(300);

    let step = 0;
    while (l <= h) {
      step++;
      const m = (l + h) >> 1;
      setMid(m);
      await sleep(400);
      push(`step ${step} · lo=${l} hi=${h} <span class="acc">mid=${m}</span> → a[mid]=${arr[m]}`);
      if (arr[m] === t) {
        push(`compare a[${m}] = ${arr[m]} · <span class="ok">✓ 命中</span>`);
        setFound(m);
        setLo(-1); setHi(-1); setMid(-1);
        push(`fin. · 比较 ${step} 次 · O(log n)`, true);
        setRunning(false);
        return;
      } else if (arr[m] < t) {
        push(`a[${m}]=${arr[m]} < ${t} · <span class="dim">左半丢弃</span>`);
        for (let k = l; k <= m; k++) inact.push(k);
        l = m + 1;
      } else {
        push(`a[${m}]=${arr[m]} > ${t} · <span class="dim">右半丢弃</span>`);
        for (let k = m; k <= h; k++) inact.push(k);
        h = m - 1;
      }
      setInactive([...inact]);
      setLo(l); setHi(h); setMid(-1);
      await sleep(240);
    }
    push(`fin. · lo > hi · <span class="acc">未命中</span> · ${step} 次比较`, true);
    setLo(-1); setHi(-1); setMid(-1);
    setRunning(false);
  };

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">04</span> / 09' },
          { lab: 'TYPE', val: 'static · divide' },
          { lab: 'PREREQ', val: '必须<em>有序</em>' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(log n)</span>' },
          { lab: 'ASL', val: 'log₂(n+1) − 1' },
          { lab: 'STORAGE', val: '仅顺序表' },
        ],
      }}>
        <p>
          <span className="term">折半查找</span>（<em>binary search</em>），又称二分查找，
          是对<em>有序顺序表</em>的标准解法。每一步取当前区间之中点，以其关键字与目标相较：
          相等则命中，小于目标则丢弃左半，大于目标则丢弃右半。
          每次比较将搜索空间<span className="kw">减半</span>，因此至多 ⌈log₂(n+1)⌉ 次。
        </p>
        <p>
          它的优雅源自两条严苛约束：<em>必须有序</em>且<em>必须顺序存储</em>。
          前者保证了"丢弃一半"的合法性——左右子区间各自保序；
          后者保证中点可在 O(1) 时间内取得，离开数组便立刻失效。
          这也是为何链表上的"二分"是一个美丽却无法兑现的承诺。
        </p>
      </Intro>

      <SectionHead num="1" title="区间折半 · divide and conquer" subtitle="fig. specimen" />

      <VizPanel figNum="04" figTitle="LAYOUT · sorted a[0..n-1]" status={running ? '▶ SEARCHING' : '◎ IDLE'} caption="lo / mid / hi 三指针 · 每步区间折半">
        <div className="cells-row" style={{ flexWrap: 'wrap', marginTop: 30 }}>
          {arr.map((v, i) => {
            let cls = '';
            if (found === i) cls = 'hit';
            else if (mid === i) cls = 'cur mid';
            else if (inactive.includes(i)) cls = 'inactive';
            else if (lo === i && hi === i) cls = 'lo';
            else if (lo === i) cls = 'lo';
            else if (hi === i) cls = 'hi';
            return (
              <div key={i} className={`cell ${cls}`}>
                <span className="idx">[{i}]</span>
                {v}
              </div>
            );
          })}
        </div>
      </VizPanel>

      <div className="ctrl-row">
        <OpsPanel title="控制台 · console">
          <OpsRow label="目标 K">
            <input className="in" value={target} onChange={e => setTarget(e.target.value)} disabled={running} />
            <button className="btn primary" onClick={doSearch} disabled={running}>
              折半 <span className="sym">↕</span>
            </button>
          </OpsRow>
          <OpsRow label="预设">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => setTarget('58')} disabled={running}>中段 · 58</button>
              <button className="btn" onClick={() => setTarget('5')} disabled={running}>首 · 5</button>
              <button className="btn" onClick={() => setTarget('97')} disabled={running}>末 · 97</button>
              <button className="btn" onClick={() => setTarget('50')} disabled={running}>未中 · 50</button>
            </div>
            <span />
          </OpsRow>
          <OpsRow label="判定树">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              ASL<sub>succ</sub> = (1+2·2+3·4+4·6)/13 ≈ <span style={{ color: 'var(--accent)' }}>3.08</span>
            </span>
            <button className="btn ghost" onClick={() => { reset(); clear(); }} disabled={running}>清 · ↻</button>
          </OpsRow>
        </OpsPanel>
        <LogPanel title="binary" entries={entries} logRef={logRef} />
      </div>

      <ComplexityTable
        num="2"
        title="折半查找 · 复杂度"
        rows={[
          { op: '成功 · hit', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', note: '判定树深度 ≤ ⌈log₂(n+1)⌉' },
          { op: '失败 · miss', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '抵达外部结点', bestT: 'a' },
          { op: '插入 · insert', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', note: '须保持有序 · 大量搬移', bestT: 'r', avgT: 'r' },
          { op: '删除 · remove', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', note: '同上', bestT: 'r', avgT: 'r' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '有序为基 · sorted', body: '关键字必须预先<em>单调</em>排列。无序则折半非法，须先排序——排序开销常成新瓶颈。' },
        { title: '顺序存储 · array only', body: '链式结构上无法 O(1) 取中点，"链上折半"的时间复杂度退化为 O(n)，与顺序查找无异。' },
        { title: '判定树 · decision tree', body: '折半过程等价于在一棵近似平衡的二叉树上自根而下——<em>深度即比较次数</em>。' },
        { title: '动态不友好', body: '插入删除需维持有序，代价 O(n)；故折半查找只胜任<em>静态</em>或几近静态的表。' },
      ]} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 05 — 树型查找 · tree search (BST / AVL / RBT)
   ════════════════════════════════════════════════════════════════════════ */

/* Tree utilities */
const makeNode = (val, color = null) => ({
  id: uid(), val, left: null, right: null, color, // for RBT: 'R' | 'B'
});

const bstInsert = (root, val) => {
  if (!root) return makeNode(val);
  if (val < root.val) root.left = bstInsert(root.left, val);
  else if (val > root.val) root.right = bstInsert(root.right, val);
  return root;
};

const bstMin = (node) => {
  while (node.left) node = node.left;
  return node;
};

const bstDelete = (root, val) => {
  if (!root) return null;
  if (val < root.val) root.left = bstDelete(root.left, val);
  else if (val > root.val) root.right = bstDelete(root.right, val);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const succ = bstMin(root.right);
    root.val = succ.val;
    root.id = succ.id; // maintain identity approximation
    root.right = bstDelete(root.right, succ.val);
  }
  return root;
};

const treeHeight = (node) => {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
};

const computeLayout = (root, hSpace = 62, vSpace = 76) => {
  const positions = {};
  const edges = [];
  let inOrderIdx = 0;
  const walk = (node, depth) => {
    if (!node) return;
    walk(node.left, depth + 1);
    positions[node.id] = { x: inOrderIdx * hSpace, y: depth * vSpace, depth };
    inOrderIdx++;
    if (node.left) edges.push({ from: node.id, to: node.left.id });
    if (node.right) edges.push({ from: node.id, to: node.right.id });
    walk(node.right, depth + 1);
  };
  walk(root, 0);
  return { positions, edges, width: inOrderIdx * hSpace };
};

const collectNodes = (root) => {
  const out = [];
  const walk = (n) => { if (!n) return; walk(n.left); out.push(n); walk(n.right); };
  walk(root);
  return out;
};

/* AVL ops */
const nodeHeight = (n) => n ? (n._h ?? 1) : 0;
const updateHeight = (n) => { if (n) n._h = 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right)); };
const balanceFactor = (n) => n ? nodeHeight(n.left) - nodeHeight(n.right) : 0;
const rotR = (y) => { const x = y.left; y.left = x.right; x.right = y; updateHeight(y); updateHeight(x); return x; };
const rotL = (x) => { const y = x.right; x.right = y.left; y.left = x; updateHeight(x); updateHeight(y); return y; };

const avlInsert = (root, val) => {
  if (!root) { const n = makeNode(val); n._h = 1; return n; }
  if (val < root.val) root.left = avlInsert(root.left, val);
  else if (val > root.val) root.right = avlInsert(root.right, val);
  else return root;
  updateHeight(root);
  const bf = balanceFactor(root);
  if (bf > 1 && val < root.left.val) return rotR(root); // LL
  if (bf < -1 && val > root.right.val) return rotL(root); // RR
  if (bf > 1 && val > root.left.val) { root.left = rotL(root.left); return rotR(root); } // LR
  if (bf < -1 && val < root.right.val) { root.right = rotR(root.right); return rotL(root); } // RL
  return root;
};

const SpecimenTree = () => {
  const [mode, setMode] = useState('bst'); // 'bst' | 'avl' | 'rbt'
  const [root, setRoot] = useState(null);
  const [input, setInput] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [hitId, setHitId] = useState(null);
  const [running, setRunning] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  // initial tree setup based on mode
  useEffect(() => {
    initDefault(mode);
  }, [mode]); // eslint-disable-line

  const initDefault = (m) => {
    if (m === 'bst') {
      const seq = [50, 30, 70, 20, 40, 60, 80, 10, 35, 65, 85];
      let r = null;
      for (const v of seq) r = bstInsert(r, v);
      setRoot(r);
      clear();
      push(`§ init BST · 依序插入 {${seq.join(', ')}}`);
    } else if (m === 'avl') {
      const seq = [30, 20, 40, 10, 25, 35, 50, 5, 15, 45, 55];
      let r = null;
      for (const v of seq) r = avlInsert(r, v);
      setRoot(r);
      clear();
      push(`§ init AVL · 依序插入 {${seq.join(', ')}} · 平衡已维护`);
    } else {
      // RBT — pre-built representative tree with valid coloring
      // Build a small but illustrative RBT manually
      const n13 = makeNode(13, 'B');
      const n8 = makeNode(8, 'R');
      const n17 = makeNode(17, 'R');
      const n1 = makeNode(1, 'B');
      const n11 = makeNode(11, 'B');
      const n15 = makeNode(15, 'B');
      const n25 = makeNode(25, 'B');
      const n6 = makeNode(6, 'R');
      const n22 = makeNode(22, 'R');
      const n27 = makeNode(27, 'R');
      n13.left = n8; n13.right = n17;
      n8.left = n1; n8.right = n11;
      n17.left = n15; n17.right = n25;
      n1.right = n6;
      n25.left = n22; n25.right = n27;
      setRoot(n13);
      clear();
      push(`§ init RBT · 固定样本树 · 根 13 (B)`);
    }
    setCurrentId(null); setHitId(null);
  };

  const { positions, edges, width } = useMemo(() => computeLayout(root, 64, 74), [root]);
  const nodes = useMemo(() => collectNodes(root), [root]);
  const H = treeHeight(root);
  const canvasH = Math.max(300, H * 74 + 60);

  const doInsert = () => {
    if (running) return;
    const v = parseInt(input, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    if (mode === 'rbt') { push('<span class="acc">note</span> · RBT 插入涉及重着色 + 旋转 · 本展示为固定样本'); return; }
    if (mode === 'bst') {
      setRoot(bstInsert(root ? { ...root } : null, v));
      push(`insert · ${v} · 按 BST 规则下行`);
    } else {
      setRoot(avlInsert(root ? JSON.parse(JSON.stringify(root)) : null, v));
      push(`insert · ${v} · 沿途回溯更新 h · 若 |bf|>1 则旋转`);
    }
    setInput('');
  };

  const doDelete = () => {
    if (running) return;
    const v = parseInt(input, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    if (mode === 'rbt') { push('<span class="acc">note</span> · RBT 删除需考虑双黑 · 展示跳过'); return; }
    const cloned = root ? JSON.parse(JSON.stringify(root)) : null;
    setRoot(bstDelete(cloned, v));
    push(`delete · ${v} · ${mode === 'avl' ? '（简化为 BST 删除 · 未重平衡）' : '转交后继 · 可能替换'}`);
    setInput('');
  };

  const doSearch = async () => {
    if (running) return;
    const v = parseInt(searchVal, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    setRunning(true);
    setHitId(null); setCurrentId(null);
    push(`§ search · K = <span class="acc">${v}</span> · 从根出发`);
    let node = root;
    let step = 0;
    while (node) {
      step++;
      setCurrentId(node.id);
      await sleep(500);
      if (node.val === v) {
        push(`compare ${node.val} = ${v} · <span class="ok">✓ 命中 · ${step} 次</span>`);
        setHitId(node.id); setCurrentId(null);
        setRunning(false);
        push(`fin. · 深度 ${step} · 平衡树下 ≤ log₂n`, true);
        return;
      } else if (v < node.val) {
        push(`${v} < ${node.val} · <span class="dim">向左</span>`);
        node = node.left;
      } else {
        push(`${v} > ${node.val} · <span class="dim">向右</span>`);
        node = node.right;
      }
    }
    push(`fin. · <span class="acc">未命中</span> · 到达空指针`, true);
    setCurrentId(null);
    setRunning(false);
  };

  const modeInfo = {
    bst: { name: '二叉搜索树', en: 'binary search tree', sym: '§', asl: 'O(log n) ~ O(n)' },
    avl: { name: '平衡二叉树', en: 'AVL tree', sym: '◎', asl: 'O(log n) · |bf| ≤ 1' },
    rbt: { name: '红黑树', en: 'red-black tree', sym: '§', asl: 'O(log n) · 黑高平衡' },
  }[mode];

  const offsetX = 40;

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">05</span> / 09' },
          { lab: 'TYPE', val: 'dynamic · tree' },
          { lab: 'SUBMODES', val: 'BST · AVL · RBT' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(log n)</span>*' },
          { lab: 'PREREQ', val: '可比较' },
          { lab: 'INV.', val: '左 &lt; 根 &lt; 右' },
        ],
      }}>
        <p>
          <span className="term">树型查找</span>将数据组织为具有层次秩序的结点集合。
          最朴素的形式是<em>二叉搜索树</em>（<span className="kw">BST</span>）：
          于每个结点处维持"左子树皆小、右子树皆大"的不变量，查找过程即沿根而下的一次单路径漫游。
          然而当插入序列有偏时，BST 可能退化为一条单支，此时查找开销回落至 O(n)。
        </p>
        <p>
          为抵御退化，人们引入了平衡约束：<em>AVL 树</em>要求每个结点左右子树高度差不超过 1，
          通过单/双旋转在插入删除时即时恢复；<em>红黑树</em>放松约束——允许最长路径至多为最短路径的两倍——
          以更少的旋转换来更快的更新。二者皆将最坏情形锁死在 <span className="term">O(log n)</span>，
          成为内存中有序映射的标准实现。
        </p>
      </Intro>

      <SectionHead num="1" title="树型查找 · interactive" subtitle="fig. specimen" />

      <div className="submode">
        <button className={mode === 'bst' ? 'active' : ''} onClick={() => setMode('bst')}>BST · 二叉搜索</button>
        <button className={mode === 'avl' ? 'active' : ''} onClick={() => setMode('avl')}>AVL · 平衡</button>
        <button className={mode === 'rbt' ? 'active' : ''} onClick={() => setMode('rbt')}>RBT · 红黑</button>
      </div>

      <VizPanel figNum="05" figTitle={`LAYOUT · ${mode.toUpperCase()}`} status={running ? '▶ TRAVERSING' : '◎ IDLE'} caption={`${modeInfo.name} · ${modeInfo.en} · 高度 h = ${H}`}>
        <div className="tree-canvas" style={{ height: canvasH, overflow: 'auto' }}>
          <div style={{ position: 'relative', width: Math.max(width + offsetX * 2, 700), height: canvasH, margin: '0 auto' }}>
            <svg className="tree-svg" style={{ height: canvasH, width: width + offsetX * 2 }}>
              {edges.map((e, i) => {
                const a = positions[e.from], b = positions[e.to];
                if (!a || !b) return null;
                return (
                  <line
                    key={i}
                    x1={a.x + offsetX} y1={a.y + 24}
                    x2={b.x + offsetX} y2={b.y + 24}
                    className="tree-edge"
                  />
                );
              })}
            </svg>
            {nodes.map(n => {
              const pos = positions[n.id];
              if (!pos) return null;
              const cls = [
                'tnode',
                currentId === n.id ? 'cur' : '',
                hitId === n.id ? 'hit' : '',
                mode === 'rbt' && n.color === 'R' ? 'red' : '',
                mode === 'rbt' && n.color === 'B' ? 'black' : '',
              ].filter(Boolean).join(' ');
              return (
                <div
                  key={n.id}
                  className={cls}
                  style={{ left: pos.x + offsetX, top: pos.y + 24 }}
                >
                  {n.val}
                  {mode === 'avl' && (
                    <span className="bf">{balanceFactor(n) > 0 ? '+' : ''}{balanceFactor(n)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </VizPanel>

      <div className="ctrl-row">
        <OpsPanel title={`控制台 · ${modeInfo.en}`}>
          <OpsRow label="修改">
            <input className="in" value={input} onChange={e => setInput(e.target.value)} disabled={running} placeholder="key" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={doInsert} disabled={running}>插入 <span className="sym">＋</span></button>
              <button className="btn" onClick={doDelete} disabled={running}>删除 <span className="sym">−</span></button>
            </div>
          </OpsRow>
          <OpsRow label="查找 K">
            <input className="in" value={searchVal} onChange={e => setSearchVal(e.target.value)} disabled={running} />
            <button className="btn primary" onClick={doSearch} disabled={running}>查找 <span className="sym">→</span></button>
          </OpsRow>
          <OpsRow label="重置">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              {mode === 'bst' && '由默认序列重建 BST'}
              {mode === 'avl' && '由默认序列重建 AVL · 平衡已维护'}
              {mode === 'rbt' && '固定样本 · 仅展示颜色/结构'}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => initDefault(mode)} disabled={running}>重建 <span className="sym">↻</span></button>
              <button className="btn ghost" onClick={clear} disabled={running}>清日志</button>
            </div>
          </OpsRow>
        </OpsPanel>
        <LogPanel title={`tree · ${mode}`} entries={entries} logRef={logRef} />
      </div>

      <div className="dbl-rule" />

      <SectionHead num="2" title={`${modeInfo.name} · 特性详解`} subtitle={`— ${modeInfo.en}`} />

      {mode === 'bst' && (
        <>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.8, color: 'var(--ink-2)', maxWidth: 900 }}>
            BST 的秩序来自每个结点的<em>二分律</em>：左子树中所有关键字严格小于根，右子树中所有关键字严格大于根。
            其中序遍历恰得一个<em>有序序列</em>——这是 BST 最深刻的性质，也是它与有序表的桥梁。
          </p>
          <TraitsGrid traits={[
            { title: '秩序 · order', body: '左 &lt; 根 &lt; 右 · 中序遍历产生<em>升序序列</em>。' },
            { title: '插入路径', body: '从根比较下行至空指针处挂接 · 与查找路径<em>完全一致</em>。' },
            { title: '删除三态', body: '叶子直接摘除；单子女取代其位；双子女以<em>中序后继</em>替换。' },
            { title: '退化风险', body: '有序序列作为插入次序 → 退化为单支链 · ASL 回落至 O(n)。' },
          ]} />
        </>
      )}

      {mode === 'avl' && (
        <>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.8, color: 'var(--ink-2)', maxWidth: 900 }}>
            AVL 在 BST 之上加一条严苛的律令：每个结点的<em>平衡因子</em> bf = h(左) − h(右) 必须满足 |bf| ≤ 1。
            若插入/删除后此不变量被破坏，则通过四种旋转中的一种予以恢复——<em>LL · RR · LR · RL</em>。
          </p>
          <div className="viz-wrap" style={{ padding: '32px 40px 40px' }}>
            <span className="viz-mark tl" /><span className="viz-mark tr" /><span className="viz-mark bl" /><span className="viz-mark br" />
            <span className="viz-tag-tl">FIG. 05b · ROTATIONS</span>
            <span className="viz-tag-tr">4 CASES</span>
            <RotationDiagrams />
            <div className="viz-caption"><span className="num">FIG. 05b</span> &nbsp;·&nbsp; <em>四种旋转 · single vs double</em></div>
          </div>
          <TraitsGrid traits={[
            { title: 'bf 不变量', body: '每个结点 |bf| ≤ 1 · 全树高度严格 O(log n)。' },
            { title: '四种旋转', body: '<em>LL</em> 右旋 · <em>RR</em> 左旋 · <em>LR</em> 先左后右 · <em>RL</em> 先右后左。' },
            { title: '插入开销', body: '至多一次（双）旋转即可恢复平衡 · 查找则未受影响。' },
            { title: '删除开销', body: '可能需要沿回溯路径<em>连续旋转多次</em>，开销略高于插入。' },
          ]} />
        </>
      )}

      {mode === 'rbt' && (
        <>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.8, color: 'var(--ink-2)', maxWidth: 900 }}>
            红黑树放松了 AVL 的严格平衡要求，代之以五条着色律：
            <span style={{ color: 'var(--accent)' }}>(1)</span> 每结点非红即黑；
            <span style={{ color: 'var(--accent)' }}>(2)</span> 根必为黑；
            <span style={{ color: 'var(--accent)' }}>(3)</span> 所有叶（NIL）为黑；
            <span style={{ color: 'var(--accent)' }}>(4)</span> 红结点的子女必为黑；
            <span style={{ color: 'var(--accent)' }}>(5)</span> 自任一结点到其后代叶的每条路径含相同数目的黑结点（<em>黑高</em>）。
            这五条共同保证最长路径至多是最短路径的两倍，即树高 ≤ 2log₂(n+1)。
          </p>
          <TraitsGrid traits={[
            { title: '五大性质', body: '色 · 根黑 · 叶黑 · 红不相邻 · <em>黑高相等</em>。' },
            { title: '插入策略', body: '新结点总染<em>红</em> · 若父亦红则视叔色分情况<em>重着色 + 旋转</em>。' },
            { title: '优于 AVL 之处', body: '更新平均只需<em>≤ 2 次旋转</em> · 广泛用于 C++ std::map 与 Java TreeMap。' },
            { title: '黑高 · black height', body: '由根到叶的黑结点数相等 · 这是路径长度严格有界的根本保证。' },
          ]} />
        </>
      )}

      <ComplexityTable
        num="3"
        title={`${modeInfo.name} · 复杂度`}
        rows={
          mode === 'bst' ? [
            { op: '查找 · search', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', note: '平衡时最优 · 单支时最差', bestT: 'g', avgT: 'a', worstT: 'r' },
            { op: '插入 · insert', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', note: '沿查找路径下行 · 同上', bestT: 'g', avgT: 'a', worstT: 'r' },
            { op: '删除 · remove', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', note: '找后继 · 可能再次 O(h)', bestT: 'g', avgT: 'a', worstT: 'r' },
            { op: '中序 · inorder', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', note: '产生有序序列', bestT: 'a', avgT: 'a', worstT: 'a' },
          ] : mode === 'avl' ? [
            { op: '查找 · search', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '树高严格 ≤ 1.44 log₂n' },
            { op: '插入 · insert', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '至多 1 次（双）旋转' },
            { op: '删除 · remove', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '可能需沿路径旋转多次' },
            { op: '旋转开销', best: 'O(1)', avg: 'O(1)', worst: 'O(log n)', note: '单次 O(1) · 累计至多 h', avgT: 'g' },
          ] : [
            { op: '查找 · search', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '树高 ≤ 2 log₂(n+1)' },
            { op: '插入 · insert', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '平均旋转 ≤ 2 次' },
            { op: '删除 · remove', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: '平均旋转 ≤ 3 次' },
            { op: '重着色', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', note: '可能沿路径上溯', avgT: 'g' },
          ]
        }
      />
    </div>
  );
};

const RotationDiagrams = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, padding: '20px 10px' }}>
    {[
      { name: 'LL', sub: '右旋', desc: '左高于右 · 新增于左之左' },
      { name: 'RR', sub: '左旋', desc: '右高于左 · 新增于右之右' },
      { name: 'LR', sub: '左-右双旋', desc: '新增于左之右 · 先左后右' },
      { name: 'RL', sub: '右-左双旋', desc: '新增于右之左 · 先右后左' },
    ].map((r, i) => (
      <div key={i} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 4 }}>
          CASE · {r.name}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, marginBottom: 6 }}>{r.sub}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{r.desc}</div>
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 06 — B 树 · B+ 树 · multi-way
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenBTree = () => {
  const [mode, setMode] = useState('b'); // 'b' | 'bplus'
  const [highlightPath, setHighlightPath] = useState([]);

  // A pre-built B-tree of order m=4 (each node has 2..3 keys, 3..4 children in this sketch)
  // For display, structure as nested objects with keys + children[]
  // Using a 3-order (max 2 keys per node, max 3 children) for compactness
  const sampleBTree = useMemo(() => ({
    // order 4 B-tree (max 3 keys per node)
    keys: [30, 60],
    children: [
      { keys: [10, 20], children: [] },
      { keys: [40, 50], children: [] },
      { keys: [70, 80, 90], children: [] },
    ],
  }), []);

  // A B+ tree: internal nodes hold only routing keys; leaves form a linked list and hold all data
  const sampleBPlus = useMemo(() => ({
    internal: [
      { keys: [30, 60], isRoot: true },
    ],
    leaves: [
      { keys: [10, 20, 30], next: 1 },
      { keys: [40, 50, 60], next: 2 },
      { keys: [70, 80, 90], next: -1 },
    ],
  }), []);

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">06</span> / 09' },
          { lab: 'TYPE', val: 'multi-way balanced' },
          { lab: 'ORDER m', val: '≥ 3 (典型 m = 3..1024)' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(log<sub>m</sub>n)</span>' },
          { lab: 'FIT FOR', val: 'disk / ssd' },
          { lab: 'HEIGHT', val: '极低 · 代价平摊' },
        ],
      }}>
        <p>
          <span className="term">B 树</span>（<em>B-tree</em>）是一族多路平衡查找树，为<em>外部存储</em>而生。
          每个结点可同时容纳多个关键字（m−1 个）并指向多个子女（最多 m 个），
          从而将树高压至 log<sub>m</sub>n——对 m = 200 的 B 树，百万条记录仅需三到四层。
          每一层读盘代价高昂，而<em>树高决定读盘次数</em>，这正是 B 树压低 m-路扇出的缘由。
        </p>
        <p>
          <span className="term">B+ 树</span>是 B 树的变体，也是工程中更常见的形态。
          其内部结点只存<em>路由键</em>，所有真实数据都落在叶层；
          叶结点之间以链表连接，因此一次<em>区间扫描</em>只需先定位起点再顺链而行，极利于数据库索引。
          MySQL InnoDB、PostgreSQL 等的主索引皆为 B+ 树。
        </p>
      </Intro>

      <SectionHead num="1" title="多路平衡 · disk-friendly" subtitle="fig. specimen" />

      <div className="submode">
        <button className={mode === 'b' ? 'active' : ''} onClick={() => setMode('b')}>B 树 · B-tree</button>
        <button className={mode === 'bplus' ? 'active' : ''} onClick={() => setMode('bplus')}>B+ 树 · B+ tree</button>
      </div>

      {mode === 'b' && (
        <VizPanel figNum="06" figTitle="LAYOUT · B-TREE m=4" status="SAMPLE · order 4" caption="每结点最多 3 键 4 子 · 关键字在各层均可存在">
          <BTreeRender root={sampleBTree} />
        </VizPanel>
      )}
      {mode === 'bplus' && (
        <VizPanel figNum="06b" figTitle="LAYOUT · B+ TREE" status="LEAVES LINKED" caption="内部结点只作路由 · 数据全在叶层 · 叶之间以链表相连">
          <BPlusRender data={sampleBPlus} />
        </VizPanel>
      )}

      <div className="ctrl-row">
        <OpsPanel title={`${mode === 'b' ? 'B 树' : 'B+ 树'} · 说明`} side="reference">
          <OpsRow label="阶 m">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>
              每结点至多 <span style={{ color: 'var(--accent)' }}>m</span> 个子女 · 至少 <span style={{ color: 'var(--accent)' }}>⌈m/2⌉</span>
            </span>
            <span />
          </OpsRow>
          <OpsRow label="关键字数">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>
              每结点 <span style={{ color: 'var(--accent)' }}>⌈m/2⌉−1 .. m−1</span> 个
            </span>
            <span />
          </OpsRow>
          <OpsRow label="插入">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              落至叶 · 若满则<span style={{ color: 'var(--accent)' }}>分裂</span>中键上升 · 可逐层上传
            </span>
            <span />
          </OpsRow>
          <OpsRow label="删除">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              若不足 ⌈m/2⌉−1 · 向兄弟<span style={{ color: 'var(--accent)' }}>借键</span>或<span style={{ color: 'var(--accent)' }}>合并</span>
            </span>
            <span />
          </OpsRow>
        </OpsPanel>
        <div className="log">
          <div className="log-head"><span>§ NOTE · architecture</span><span className="right">editorial</span></div>
          <div className="log-body">
            <div className="log-entry"><span className="ts">—</span><span className="msg">B 树的设计前提是<span className="acc"> 盘页代价 ≫ 比较代价</span></span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">一层一页 · <span className="ok">fan-out</span> 越大越好</span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">m 的取值由<span className="acc">页大小</span>决定</span></div>
            <div className="log-entry sep"><span className="ts">—</span><span className="msg dim">— B+ tree differs in ——</span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">内部结点<span className="acc">仅含路由键</span></span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">所有数据落在<span className="acc">叶层</span></span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">叶以<span className="ok">链表</span>相连 · 利于范围扫描</span></div>
            <div className="log-entry"><span className="ts">—</span><span className="msg">查找路径总是抵达<span className="acc">叶层</span>（IO 次数稳定）</span></div>
          </div>
        </div>
      </div>

      <ComplexityTable
        num="2"
        title={`${mode === 'b' ? 'B 树' : 'B+ 树'} · 复杂度`}
        rows={
          mode === 'b' ? [
            { op: '查找 · search', best: 'O(1)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '关键字可出现在任意层' },
            { op: '插入 · insert', best: 'O(log<sub>m</sub>n)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '至多 h 次分裂' },
            { op: '删除 · remove', best: 'O(log<sub>m</sub>n)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '借键或合并 · 至多 h 次' },
            { op: '磁盘读 · I/O', best: '1', avg: 'log<sub>m</sub>n', worst: 'log<sub>m</sub>n', note: '树高即 I/O 次数 · 关键指标' },
          ] : [
            { op: '查找 · search', best: 'O(log<sub>m</sub>n)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '总是抵达叶层 · 路径长度稳定', bestT: 'a' },
            { op: '范围扫描', best: 'O(log<sub>m</sub>n + k)', avg: 'O(log<sub>m</sub>n + k)', worst: 'O(log<sub>m</sub>n + k)', note: '沿叶链遍历 k 项 · B+ 独门绝技', bestT: 'g', avgT: 'g', worstT: 'g' },
            { op: '插入 · insert', best: 'O(log<sub>m</sub>n)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '分裂仅发生于叶/内部结点' },
            { op: '删除 · remove', best: 'O(log<sub>m</sub>n)', avg: 'O(log<sub>m</sub>n)', worst: 'O(log<sub>m</sub>n)', note: '叶删除 · 内部可能合并' },
          ]
        }
      />

      <TraitsGrid traits={[
        { title: '多路扇出 · fan-out', body: '一个结点容纳多达 m−1 个关键字 · 树高<em>对数底 m</em> · 极扁平。' },
        { title: '严格平衡', body: '所有叶处于同一层 · 插入/删除通过<em>分裂</em>与<em>合并</em>维持此性质。' },
        { title: '磁盘亲和 · I/O', body: '一个结点对应一页磁盘块 · 查找时 I/O 次数 = 树高 · <em>极其重要</em>。' },
        { title: 'B+ 的额外之利', body: '叶链利于<em>范围查询</em> · 内部结点更小可常驻缓存 · 数据库首选。' },
      ]} />
    </div>
  );
};

const BKey = ({ v, active }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 40, padding: '6px 10px',
    borderRight: '1px solid var(--line)',
    fontFamily: 'var(--font-mono)', fontSize: 13,
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--cream)' : 'var(--ink)',
    transition: 'all 0.2s',
  }}>{v}</div>
);

const BNode = ({ keys, active, isLeaf }) => (
  <div style={{
    display: 'inline-flex',
    border: '1.5px solid var(--ink)',
    background: 'var(--cream)',
    fontFamily: 'var(--font-mono)',
    animation: 'cellEnter 0.4s',
  }}>
    {keys.map((k, i) => (
      <div key={i} style={{
        padding: '8px 12px',
        borderRight: i < keys.length - 1 ? '1px solid var(--line)' : 'none',
        fontSize: 14, fontWeight: 500,
      }}>{k}</div>
    ))}
  </div>
);

const BTreeRender = ({ root }) => {
  // layout: root at top center, children spaced evenly below
  const ROOT_Y = 20;
  const LEAF_Y = 150;
  return (
    <div style={{ position: 'relative', width: '100%', height: 240, maxWidth: 780, margin: '0 auto' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Edges from root to each child */}
        {root.children.map((_, i) => {
          const x1 = 390 + (i - 1) * 30; // slight spread near root
          const y1 = 54;
          const x2 = 110 + i * 240;
          const y2 = LEAF_Y + 2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-2)" strokeWidth="1.2" />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: ROOT_Y, transform: 'translateX(-50%)' }}>
        <BNode keys={root.keys} />
      </div>
      {root.children.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: 110 + i * 240, top: LEAF_Y, transform: 'translateX(-50%)' }}>
          <BNode keys={c.keys} isLeaf />
        </div>
      ))}
    </div>
  );
};

const BPlusRender = ({ data }) => {
  const ROOT_Y = 20;
  const LEAF_Y = 170;
  return (
    <div style={{ position: 'relative', width: '100%', height: 280, maxWidth: 780, margin: '0 auto' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {data.leaves.map((_, i) => {
          const x1 = 390 + (i - 1) * 30;
          const y1 = 54;
          const x2 = 110 + i * 240;
          const y2 = LEAF_Y + 2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-2)" strokeWidth="1.2" strokeDasharray="0" />;
        })}
        {/* Leaf chain arrows */}
        {data.leaves.map((l, i) => {
          if (l.next < 0 || l.next >= data.leaves.length) return null;
          const x1 = 110 + i * 240 + 50;
          const x2 = 110 + l.next * 240 - 50;
          const y = LEAF_Y + 24;
          return (
            <g key={`link${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--accent)" strokeWidth="1.5" />
              <polygon points={`${x2},${y} ${x2 - 6},${y - 4} ${x2 - 6},${y + 4}`} fill="var(--accent)" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: ROOT_Y, transform: 'translateX(-50%)' }}>
        <BNode keys={data.internal[0].keys} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, textTransform: 'uppercase' }}>routing</div>
      </div>
      {data.leaves.map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: 110 + i * 240, top: LEAF_Y, transform: 'translateX(-50%)' }}>
          <BNode keys={l.keys} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, textTransform: 'uppercase' }}>leaf · data</div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 07 — 散列表 · hash table
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenHash = () => {
  const TABLE_SIZE = 11; // prime
  const [buckets, setBuckets] = useState(() => Array.from({ length: TABLE_SIZE }, () => []));
  const [input, setInput] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [curBucket, setCurBucket] = useState(-1);
  const [curItemIdx, setCurItemIdx] = useState(-1);
  const [hitBucket, setHitBucket] = useState(-1);
  const [hitItemIdx, setHitItemIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  const hash = (k) => k % TABLE_SIZE;

  const totalItems = buckets.reduce((acc, b) => acc + b.length, 0);
  const loadFactor = (totalItems / TABLE_SIZE).toFixed(2);
  const collisions = buckets.reduce((acc, b) => acc + Math.max(0, b.length - 1), 0);

  useEffect(() => {
    // Initial: seed with some values to demonstrate collisions
    const seed = [23, 45, 12, 67, 34, 89, 56];
    const bk = Array.from({ length: TABLE_SIZE }, () => []);
    seed.forEach(v => bk[v % TABLE_SIZE].push(v));
    setBuckets(bk);
    push(`§ init · 种子数据 {${seed.join(', ')}} · m = ${TABLE_SIZE} · 除留余数法`);
  }, []); // eslint-disable-line

  const doInsert = async () => {
    if (running) return;
    const v = parseInt(input, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    setRunning(true);
    const h = hash(v);
    push(`§ insert · K = <span class="acc">${v}</span> · h(K) = ${v} mod ${TABLE_SIZE} = <span class="acc">${h}</span>`);
    setCurBucket(h);
    await sleep(500);
    const bk = buckets.map(b => [...b]);
    if (bk[h].includes(v)) {
      push(`bucket[${h}] 已存在 · <span class="dim">跳过</span>`);
    } else {
      if (bk[h].length > 0) {
        push(`bucket[${h}] 非空 · 链长 = ${bk[h].length} · <span class="acc">碰撞 · 链首插入</span>`);
      }
      bk[h] = [v, ...bk[h]]; // insert at head for chaining
      setBuckets(bk);
      push(`done · 装填因子 α = ${((totalItems + 1) / TABLE_SIZE).toFixed(2)}`, true);
    }
    setCurBucket(-1);
    setInput('');
    setRunning(false);
  };

  const doSearch = async () => {
    if (running) return;
    const v = parseInt(searchVal, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    setRunning(true);
    setHitBucket(-1); setHitItemIdx(-1);
    const h = hash(v);
    push(`§ search · K = <span class="acc">${v}</span> · h(K) = ${h}`);
    setCurBucket(h);
    await sleep(400);
    const chain = buckets[h];
    if (chain.length === 0) {
      push(`bucket[${h}] 为空 · <span class="acc">未命中</span>`, true);
      setCurBucket(-1); setRunning(false); return;
    }
    let found = -1;
    for (let i = 0; i < chain.length; i++) {
      setCurItemIdx(i);
      await sleep(300);
      if (chain[i] === v) {
        push(`compare bucket[${h}][${i}] = ${chain[i]} · <span class="ok">✓ 命中</span>`);
        found = i;
        setHitBucket(h); setHitItemIdx(i);
        break;
      } else {
        push(`compare bucket[${h}][${i}] = ${chain[i]} · <span class="dim">≠</span>`);
      }
    }
    if (found === -1) {
      push(`链扫尽 · <span class="acc">未命中</span> · 比较 ${chain.length} 次`, true);
    } else {
      push(`fin. · 比较 ${found + 1} 次 · ASL ≈ 1 + α/2`, true);
    }
    setCurBucket(-1); setCurItemIdx(-1);
    setRunning(false);
  };

  const doDelete = () => {
    if (running) return;
    const v = parseInt(input, 10);
    if (Number.isNaN(v)) { push('<span class="acc">ERR</span> · 输入非数字'); return; }
    const h = hash(v);
    const bk = buckets.map(b => [...b]);
    if (bk[h].includes(v)) {
      bk[h] = bk[h].filter(x => x !== v);
      setBuckets(bk);
      push(`delete · ${v} · 自 bucket[${h}] 移除`);
    } else {
      push(`delete · ${v} · <span class="acc">不存在</span>`);
    }
    setInput('');
  };

  return (
    <div className="specimen">
      <Intro meta={{
        left: [
          { lab: 'SPECIMEN', val: '<span class="acc">07</span> / 09' },
          { lab: 'TYPE', val: 'hashing' },
          { lab: 'STRATEGY', val: 'separate chaining' },
        ],
        right: [
          { lab: 'ACCESS', val: '<span class="acc">O(1)*</span>' },
          { lab: 'HASH FN', val: 'k mod m (m prime)' },
          { lab: 'α (load)', val: `<span class="acc">${loadFactor}</span>` },
        ],
      }}>
        <p>
          <span className="term">散列表</span>（<em>hash table</em>）背离"比较而后定位"的传统范式，
          转而以函数 <em>h(K)</em> 将关键字直接映射为存储位置。
          理想情形下，一次哈希、一次访存即得——<span className="kw">O(1)</span> 的均摊代价。
          但函数并非射入，不同关键字可能落入同一槽位，此即<em>冲突</em>（<span className="kw">collision</span>）。
        </p>
        <p>
          冲突处理有两家学派。<em>链地址法</em>（<span className="term">separate chaining</span>）
          在每个槽位挂一条链表，冲突者鱼贯而入；<em>开放地址法</em>则循"探测序列"另寻空位——
          线性探测、二次探测、双散列各有风味。装填因子 α = n/m 越接近 1，期望比较次数越大；
          工程中常设阈值 α ≤ 0.75 自动扩容。此处实现的是<span className="kw">链地址法</span>。
        </p>
      </Intro>

      <StatStrip stats={[
        { lab: '表长 m', val: `${TABLE_SIZE}` },
        { lab: '元素数 n', val: `${totalItems}` },
        { lab: '装填因子 α', val: `<span class="acc">${loadFactor}</span>` },
        { lab: '冲突数', val: `${collisions}`, sm: true },
      ]} />

      <SectionHead num="1" title="散列表 · chaining" subtitle="fig. specimen" />

      <VizPanel figNum="07" figTitle="LAYOUT · h(K) = K mod 11" status={running ? '▶ PROBING' : '◎ IDLE'} caption="11 个槽位 · 每槽一条链 · 冲突者依次挂入">
        <div className="hash-wrap">
          {buckets.map((chain, i) => (
            <div key={i} className={`hash-bucket ${curBucket === i ? 'cur' : ''}`}>
              <div className="hash-idx">
                <span>bucket</span><span className="n">[{i}]</span>
              </div>
              <div className="hash-chain">
                {chain.length === 0 && <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 12 }}>∅ · empty</span>}
                {chain.map((v, j) => (
                  <React.Fragment key={`${i}-${j}-${v}`}>
                    <div className={`hash-item ${curBucket === i && curItemIdx === j ? 'cur' : ''} ${hitBucket === i && hitItemIdx === j ? 'hit' : ''}`}>
                      {v}
                    </div>
                    {j < chain.length - 1 && <span className="hash-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="ctrl-row">
        <OpsPanel title="控制台 · console">
          <OpsRow label="插入 K">
            <input className="in" value={input} onChange={e => setInput(e.target.value)} disabled={running} placeholder="e.g. 78" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={doInsert} disabled={running}>插入 <span className="sym">＋</span></button>
              <button className="btn" onClick={doDelete} disabled={running}>删除 <span className="sym">−</span></button>
            </div>
          </OpsRow>
          <OpsRow label="查找 K">
            <input className="in" value={searchVal} onChange={e => setSearchVal(e.target.value)} disabled={running} />
            <button className="btn primary" onClick={doSearch} disabled={running}>查找 <span className="sym">→</span></button>
          </OpsRow>
          <OpsRow label="提示">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
              h(78) = 78 mod 11 = <span style={{ color: 'var(--accent)' }}>1</span> · 会与 12, 23 争抢
            </span>
            <button className="btn ghost" onClick={clear} disabled={running}>清 · ↻</button>
          </OpsRow>
        </OpsPanel>
        <LogPanel title="hashing" entries={entries} logRef={logRef} />
      </div>

      <div className="dbl-rule" />

      <SectionHead num="2" title="哈希函数 · hash functions" subtitle="fig. menagerie" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
        {[
          { name: '直接定址法', en: 'direct address', form: 'h(K) = a·K + b', note: '适用关键字分布均匀连续的情形，空间浪费严重。' },
          { name: '除留余数法', en: 'division method', form: 'h(K) = K mod m', note: 'm 取<em>质数</em>以减小冲突 · 最常用。' },
          { name: '平方取中法', en: 'mid-square', form: 'h(K) = mid(K²)', note: '取 K² 的中间几位 · 各位共同作用。' },
          { name: '数字分析法', en: 'digit analysis', form: 'h(K) = select(K)', note: '依已知分布选取离散性强的数位。' },
          { name: '折叠法', en: 'folding', form: 'h(K) = Σ segments(K)', note: '将关键字分段相加 · 适于位数多。' },
          { name: '随机数法', en: 'random', form: 'h(K) = rand(K)', note: '以 K 为种子 · 适于关键字长度不同。' },
        ].map((fn, i) => (
          <div key={i} style={{
            padding: '18px 22px',
            borderRight: (i + 1) % 3 === 0 ? 'none' : '1px solid var(--line)',
            borderBottom: i < 3 ? '1px solid var(--line)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
              METHOD · {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{fn.name}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{fn.en}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)', padding: '4px 8px', background: 'var(--cream-2)', marginBottom: 8, border: '1px solid var(--line-2)' }}>
              {fn.form}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.6, color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: fn.note }} />
          </div>
        ))}
      </div>

      <SectionHead num="3" title="冲突处理 · collision" subtitle="— two schools" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
            SCHOOL · CHAINING
          </div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, margin: '0 0 10px' }}>链地址法 · <em style={{ color: 'var(--ink-3)' }}>separate chaining</em></h4>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)', margin: 0 }}>
            每槽维持一条链表，冲突者依序挂入。删除容易、无聚集；代价是额外的指针开销与缓存不友好。
            期望 ASL<sub>成功</sub> ≈ <em>1 + α/2</em>，失败时 ≈ <em>α + e<sup>−α</sup></em>。
          </p>
        </div>
        <div style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
            SCHOOL · OPEN
          </div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, margin: '0 0 10px' }}>开放定址法 · <em style={{ color: 'var(--ink-3)' }}>open addressing</em></h4>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)', margin: 0 }}>
            冲突时在表内另觅空位。探测序列有三：
            <em> 线性</em>（h+i）、<em>二次</em>（h±i²）、<em>双散列</em>（h₁+i·h₂）。
            空间紧凑但易<span style={{ color: 'var(--accent)' }}>聚集</span>；α 不得超 0.75。
          </p>
        </div>
      </div>

      <ComplexityTable
        num="4"
        title="散列表 · 复杂度"
        rows={[
          { op: '查找 成功', best: 'O(1)', avg: 'O(1+α)', worst: 'O(n)', note: 'ASL ≈ 1 + α/2 · 链地址' },
          { op: '查找 失败', best: 'O(1)', avg: 'O(α)', worst: 'O(n)', note: 'ASL ≈ α · 链扫到尾' },
          { op: '插入 · insert', best: 'O(1)', avg: 'O(1)', worst: 'O(n)', note: '须检查是否已存在' },
          { op: '删除 · delete', best: 'O(1)', avg: 'O(1+α)', worst: 'O(n)', note: '开放定址需墓碑标记' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '时间 O(1) · 之梦', body: '均摊意义上<em>无视 n</em> · 代价是对哈希函数与装填因子的苛刻要求。' },
        { title: '装填因子 α', body: 'α = n/m · 链地址可容忍 α &gt; 1 · 开放地址必须 <em>α &lt; 1</em> 且通常 ≤ 0.75。' },
        { title: '良好的 h', body: '应使关键字<em>均匀散布</em> · 计算简便 · 避免对输入分布敏感的模式。' },
        { title: '无序之局限', body: '关键字顺序<em>一旦散列便失落</em> · 不支持范围查询 · 不适合需有序遍历的场景。' },
      ]} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 08 — 字符串模式匹配 · String Pattern Matching
   ════════════════════════════════════════════════════════════════════════ */

// Build KMP next[] table (0-indexed, next[j] = length of longest proper prefix that is also suffix of P[0..j-1])
const buildNext = (p) => {
  const n = p.length;
  const next = new Array(n).fill(0);
  if (n === 0) return next;
  next[0] = -1; // convention: mismatch at j=0 means slide text pointer
  let k = -1, j = 0;
  while (j < n - 1) {
    if (k === -1 || p[j] === p[k]) {
      k++; j++;
      next[j] = k;
    } else {
      k = next[k];
    }
  }
  return next;
};

const SpecimenKMP = () => {
  const [text, setText] = useState('ababcabcacbab');
  const [pattern, setPattern] = useState('abcac');
  const [mode, setMode] = useState('kmp'); // 'bf' | 'kmp'
  const [i, setI] = useState(0);          // text pointer
  const [j, setJ] = useState(0);          // pattern pointer
  const [offset, setOffset] = useState(0); // pattern alignment offset
  const [phase, setPhase] = useState('idle'); // idle | cmp | ok | bad | hit | fail
  const [steps, setSteps] = useState(0);
  const [hits, setHits] = useState([]);
  const [running, setRunning] = useState(false);
  const { entries, push, clear, logRef } = useLog();

  const next = useMemo(() => buildNext(pattern), [pattern]);

  useEffect(() => {
    push(`§ init · text = "<span class="acc">${text}</span>" · pattern = "<span class="acc">${pattern}</span>"`);
    push(`next[] = [${next.join(', ')}] · 由 pattern 本身前后缀规律导出`, true);
  }, []); // eslint-disable-line

  const reset = () => {
    setI(0); setJ(0); setOffset(0); setPhase('idle'); setSteps(0); setHits([]);
    clear();
    push(`§ reset · ${mode === 'kmp' ? 'KMP' : 'brute-force'} · next = [${next.join(', ')}]`);
  };

  const runBF = async () => {
    if (running) return;
    setRunning(true); clear(); setHits([]); setSteps(0);
    push(`§ brute-force · 朴素匹配 · O(nm)`, true);
    const n = text.length, m = pattern.length;
    let _i = 0, _j = 0, _steps = 0, _hits = [];
    while (_i <= n - m + (_j > 0 ? 0 : 0) && _i < n) {
      setI(_i); setJ(_j); setOffset(_i - _j); setPhase('cmp');
      _steps++; setSteps(_steps);
      await sleep(420);
      if (_j < m && text[_i] === pattern[_j]) {
        push(`cmp · T[${_i}]='${text[_i]}' = P[${_j}] · <span class="ok">匹配</span>`);
        setPhase('ok');
        await sleep(200);
        _i++; _j++;
        if (_j === m) {
          const hitAt = _i - m;
          _hits.push(hitAt); setHits([..._hits]);
          push(`<span class="acc">★ HIT</span> at index ${hitAt} · 整段匹配`);
          setPhase('hit');
          await sleep(500);
          // brute force continues after a hit by shifting by 1
          _i = hitAt + 1; _j = 0;
          setI(_i); setJ(_j); setOffset(_i);
          setPhase('idle');
          await sleep(300);
        }
      } else {
        if (_j < m) push(`cmp · T[${_i}]='${text[_i]}' ≠ P[${_j}]='${pattern[_j]}' · <span class="acc">回溯 i = ${_i - _j + 1}</span>`);
        setPhase('bad');
        await sleep(280);
        // brute-force backtrack: i回到上一次起点+1, j归零
        _i = _i - _j + 1;
        _j = 0;
        setI(_i); setJ(_j); setOffset(_i);
        setPhase('idle');
        await sleep(150);
      }
    }
    push(`§ 结束 · 共 <span class="acc">${_steps}</span> 步 · 命中 ${_hits.length} 处`, true);
    setPhase('idle'); setRunning(false);
  };

  const runKMP = async () => {
    if (running) return;
    setRunning(true); clear(); setHits([]); setSteps(0);
    push(`§ KMP · 利用 next[] 避免回溯 text · O(n+m)`, true);
    push(`next[] = [${next.join(', ')}]`);
    const n = text.length, m = pattern.length;
    let _i = 0, _j = 0, _steps = 0, _hits = [];
    while (_i < n) {
      setI(_i); setJ(Math.max(0, _j)); setOffset(_i - Math.max(0, _j)); setPhase('cmp');
      _steps++; setSteps(_steps);
      await sleep(420);
      if (_j === -1 || text[_i] === pattern[_j]) {
        if (_j === -1) {
          push(`j = −1 · 滑动 pattern · i → ${_i + 1}`);
        } else {
          push(`cmp · T[${_i}]='${text[_i]}' = P[${_j}] · <span class="ok">匹配</span>`);
        }
        setPhase('ok');
        await sleep(200);
        _i++; _j++;
        if (_j === m) {
          const hitAt = _i - m;
          _hits.push(hitAt); setHits([..._hits]);
          push(`<span class="acc">★ HIT</span> at index ${hitAt} · next[${m}] 视角继续`);
          setPhase('hit');
          await sleep(500);
          _j = 0; // restart for next occurrence (simple demo)
        }
      } else {
        push(`cmp · T[${_i}]='${text[_i]}' ≠ P[${_j}]='${pattern[_j]}' · j 回退至 next[${_j}] = ${next[_j]}`);
        setPhase('bad');
        await sleep(320);
        _j = next[_j];
      }
    }
    push(`§ 结束 · 共 <span class="acc">${_steps}</span> 步 · 命中 ${_hits.length} 处 · <em>text pointer never retreats</em>`, true);
    setPhase('idle'); setRunning(false);
  };

  const meta = {
    left: [
      { lab: 'SPECIMEN', val: '08 / <em>字符串模式匹配</em>' },
      { lab: 'TYPE', val: 'linear · <em>string search</em>' },
      { lab: 'ALPHABET', val: 'Σ = {a, b, c}' },
    ],
    right: [
      { lab: 'BRUTE', val: '<em>O(nm)</em> · 回溯 text' },
      { lab: 'KMP', val: '<em>O(n+m)</em> · 不回溯 text' },
      { lab: 'NEXT', val: `[${next.join(', ')}]` },
    ],
  };

  // Render text + pattern line-up
  const textN = text.length, patN = pattern.length;
  const curI = phase === 'idle' ? -1 : i;
  const curJ = phase === 'idle' ? -1 : j;
  const matchedUpTo = curJ >= 0 ? curJ : 0;

  return (
    <div className="specimen">
      <Intro meta={meta}>
        <h2 className="intro-title"><em>Comparing</em> 串中之串 · 01010</h2>
        <p className="intro-para">
          <em>模式匹配</em>的根本问题：在长文本 <em>T</em> 中定位模式 <em>P</em> 首次（或全部）出现的位置。
          朴素算法在失败后让 <em>text pointer</em> 回到起点 +1、<em>pattern pointer</em> 归零——这是
          最浪费的回溯，因为它把已经做过的比较又做了一遍。
        </p>
        <p className="intro-para">
          <em>Knuth · Morris · Pratt</em> 的洞见：匹配失败时，模式自身前后缀的结构已蕴含一个"下一步
          从哪里继续"的答案。预计算 <em>next[j]</em>——<em>P[0..j−1]</em> 的最长真前后缀公共长度——
          便可让 <em>text pointer</em> 永不回头，将总步数压至 <em>O(n + m)</em>。
        </p>
      </Intro>

      <VizPanel
        figNum="08"
        figTitle="PATTERN SLIDING"
        status={`mode · ${mode.toUpperCase()}`}
        caption="alignment of pattern beneath text · i, j pointers and next[] lookup"
      >
        <div className="kmp-wrap">
          {/* Text row */}
          <div className="kmp-line">
            <span className="kmp-label">TEXT · T</span>
            {[...text].map((ch, idx) => {
              let cls = '';
              const inPat = idx >= offset && idx < offset + patN;
              if (idx === curI && curJ >= 0) cls = phase === 'ok' || phase === 'hit' ? 'ok' : phase === 'bad' ? 'bad' : 'cmp';
              else if (inPat && idx < curI) cls = 'ok';
              else if (hits.some(h => idx >= h && idx < h + patN)) cls = 'ok';
              else if (!inPat) cls = 'dim';
              return (
                <div key={idx} className={`kmp-cell ${cls}`}>
                  <span className="idx">{idx}</span>
                  {ch}
                </div>
              );
            })}
          </div>
          {/* Pattern row, offset */}
          <div className="kmp-line" style={{ marginTop: 18 }}>
            <span className="kmp-label">PATT · P</span>
            <div style={{ width: `${offset * 36}px` }} />
            {[...pattern].map((ch, idx) => {
              let cls = '';
              if (idx === curJ && phase !== 'idle') cls = phase === 'ok' || phase === 'hit' ? 'ok' : phase === 'bad' ? 'bad' : 'cmp';
              else if (idx < matchedUpTo && phase !== 'bad' && phase !== 'idle') cls = 'ok';
              return (
                <div key={idx} className={`kmp-cell ${cls}`}>
                  <span className="idx">{idx}</span>
                  {ch}
                </div>
              );
            })}
          </div>
          {/* next[] row */}
          {mode === 'kmp' && (
            <div className="kmp-next-row">
              <span className="lab">NEXT[j]</span>
              {next.map((v, idx) => (
                <span key={idx} className="c">
                  <div style={{ fontSize: 9, color: 'var(--ink-3)' }}>j={idx}</div>
                  <div style={{ color: 'var(--accent)' }}>{v}</div>
                </span>
              ))}
            </div>
          )}
        </div>

        <StatStrip stats={[
          { lab: 'MODE', val: mode === 'kmp' ? 'KMP' : 'BRUTE' },
          { lab: 'i (TEXT)', val: phase === 'idle' ? '∅' : String(i) },
          { lab: 'j (PATT)', val: phase === 'idle' ? '∅' : String(Math.max(0, j)) },
          { lab: 'STEPS', val: String(steps) },
          { lab: 'HITS', val: String(hits.length) },
          { lab: 'n / m', val: `${textN} / ${patN}` },
        ]} />
      </VizPanel>

      <div className="two-col">
        <OpsPanel title="MATCH · 操作" side="actions">
          <OpsRow label="输入 · input">
            <input
              className="in"
              value={text}
              onChange={(e) => setText(e.target.value.replace(/[^a-c]/g, '').slice(0, 16))}
              placeholder="text · a/b/c"
              style={{ maxWidth: 180 }}
              disabled={running}
            />
            <input
              className="in"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.replace(/[^a-c]/g, '').slice(0, 8))}
              placeholder="pattern"
              style={{ maxWidth: 120 }}
              disabled={running}
            />
          </OpsRow>
          <OpsRow label="算法 · algo">
            <button className={`btn ${mode === 'kmp' ? 'btn-primary' : ''}`} onClick={() => setMode('kmp')} disabled={running}>
              KMP <span className="sym">◎</span>
            </button>
            <button className={`btn ${mode === 'bf' ? 'btn-primary' : ''}`} onClick={() => setMode('bf')} disabled={running}>
              朴素 <span className="sym">○</span>
            </button>
          </OpsRow>
          <OpsRow label="运行 · run">
            <button className="btn btn-primary" onClick={mode === 'kmp' ? runKMP : runBF} disabled={running || pattern.length === 0}>
              开始匹配 <span className="sym">→</span>
            </button>
            <button className="btn" onClick={reset} disabled={running}>
              重置 <span className="sym">↺</span>
            </button>
          </OpsRow>
          <OpsRow label="示例 · preset">
            <button className="btn" onClick={() => { setText('ababcabcacbab'); setPattern('abcac'); }} disabled={running}>
              经典 <span className="sym">※</span>
            </button>
            <button className="btn" onClick={() => { setText('aaaaab'); setPattern('aaab'); }} disabled={running}>
              退化 <span className="sym">※</span>
            </button>
            <button className="btn" onClick={() => { setText('abababab'); setPattern('abab'); }} disabled={running}>
              重叠 <span className="sym">※</span>
            </button>
          </OpsRow>
        </OpsPanel>
        <LogPanel title="KMP · TRACE" entries={entries} logRef={logRef} />
      </div>

      <SectionHead num="1" title="next[] 之构造 · next table construction" subtitle="— prefix function" />
      <div style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', padding: '18px 22px', marginBottom: 30 }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.75, color: 'var(--ink-2)', margin: '0 0 10px' }}>
          <em>定义 · </em>next[j] 记 P[0..j−1] 中，相等的最长真前缀与真后缀之长度。约定 <em>next[0] = −1</em>
          作哨兵，使失配时 i、j 可同步推进。
        </p>
        <div style={{ display: 'flex', gap: 0, fontFamily: 'var(--font-mono)', fontSize: 13, border: '1px solid var(--ink)', width: 'fit-content', marginTop: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-3)', background: 'var(--cream-3)' }}>J</div>
            <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-3)', background: 'var(--cream-3)' }}>P[j]</div>
            <div style={{ padding: '6px 10px', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', background: 'var(--cream-3)' }}>NEXT</div>
          </div>
          {[...pattern].map((ch, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line-2)' }}>
              <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--line)', textAlign: 'center', minWidth: 32 }}>{idx}</div>
              <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--line)', textAlign: 'center', fontWeight: 600 }}>{ch}</div>
              <div style={{ padding: '6px 12px', textAlign: 'center', color: 'var(--accent)', fontWeight: 600 }}>{next[idx]}</div>
            </div>
          ))}
        </div>
      </div>

      <ComplexityTable
        num="2"
        title="字符串匹配 · 复杂度"
        rows={[
          { op: '朴素 · brute force', best: 'O(n)', avg: 'O(nm)', worst: 'O(nm)', note: 'i 回溯至起点 + 1 · 最劣形如 aaab' },
          { op: 'KMP · 主扫', best: 'O(n)', avg: 'O(n+m)', worst: 'O(n+m)', note: 'i 不回溯 · 摊还分析' },
          { op: 'KMP · 预处理', best: 'O(m)', avg: 'O(m)', worst: 'O(m)', note: '构造 next[] · 仅依赖 P' },
          { op: 'Boyer-Moore', best: 'O(n/m)', avg: 'O(n)', worst: 'O(nm)', note: '右向左扫 · 坏字符+好后缀 · 附注' },
        ]}
      />

      <TraitsGrid traits={[
        { title: '不回溯 · pointer monotone', body: 'KMP 的核心价值不在"更快"，而在 <em>text 指针单调不退</em> · 适合流式/单遍扫描场景。' },
        { title: 'next 是模式的自相似', body: 'next[] 只取决于 <em>pattern</em> 本身 · 与 text 无关 · 可预计算并缓存。' },
        { title: '最劣的代价', body: '朴素算法最劣 <em>O(nm)</em> · 多出现在 pattern 与 text 具有<em>高重复前缀</em>时。' },
        { title: 'KMP 之外', body: '若字符集大、模式长，<em>Boyer-Moore</em> 常更快 · 若需多模式，<em>AC 自动机</em>。' },
      ]} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SPECIMEN · 09 — 查找算法的分析及应用 · Analysis & Application
   ════════════════════════════════════════════════════════════════════════ */

const SpecimenAnalysis = () => {
  const meta = {
    left: [
      { lab: 'SPECIMEN', val: '09 / <em>综述</em>' },
      { lab: 'TYPE', val: '<em>synthesis</em>' },
      { lab: 'METHODS', val: '8 families' },
    ],
    right: [
      { lab: 'VIEW', val: '<em>comparative</em>' },
      { lab: 'CRITERIA', val: '时 · 空 · 适用' },
      { lab: 'SUFFIX', val: '<em>fin.</em>' },
    ],
  };

  const summaryRows = [
    { m: '顺序 · sequential', avg: 'O(n)', sp: 'O(1)', pre: '无', cond: '任意', scene: '<em>小规模</em> · 无序 · 一次性扫描' },
    { m: '折半 · binary', avg: 'O(log n)', sp: 'O(1)', pre: 'O(n log n) 排序', cond: '顺序存储 · 有序', scene: '静态 · 有序 · <em>随机访问</em>' },
    { m: '分块 · block', avg: 'O(√n)', sp: 'O(√n)', pre: 'O(n) 建索引', cond: '块间有序 · 块内任意', scene: '更新较频繁 · 内外混合' },
    { m: '二叉搜索树', avg: 'O(log n)', sp: 'O(n)', pre: 'O(n log n) 建树', cond: '动态集合', scene: '动态插入删除 · 期望平衡' },
    { m: '平衡树 · AVL/RBT', avg: 'O(log n)', sp: 'O(n)', pre: 'O(n log n)', cond: '动态且需最劣保证', scene: '严格 O(log n) 上界' },
    { m: 'B 树 / B+ 树', avg: 'O(log<sub>m</sub> n)', sp: 'O(n)', pre: 'O(n log n)', cond: '大数据 · 外存', scene: '<em>数据库</em> · 文件系统索引' },
    { m: '散列表 · hash', avg: 'O(1)', sp: 'O(n)', pre: 'O(n) 散列', cond: '无序 · 等值查询', scene: '<em>符号表</em> · 缓存 · 去重' },
    { m: 'KMP · pattern', avg: 'O(n+m)', sp: 'O(m)', pre: 'O(m) next[]', cond: '字符串', scene: '文本搜索 · 日志扫描' },
  ];

  const apps = [
    { name: '数据库索引', en: 'database index', pick: 'B+ 树', why: '多路平衡 · <em>外存友好</em> · 叶子链表支持范围扫描。', sym: '§' },
    { name: '编译器符号表', en: 'symbol table', pick: '散列 · hash', why: '关键字<em>等值查询</em>为主 · O(1) 均摊 · 作用域嵌套用链式。', sym: '◎' },
    { name: '字典 / 集合', en: 'ordered map', pick: '红黑树', why: '需<em>按序遍历</em>与 O(log n) 最劣保证 · STL map、Java TreeMap。', sym: '※' },
    { name: '文件系统目录', en: 'filesystem', pick: 'B 树 / B+ 树', why: '磁盘块 = 节点 · <em>高扇出</em> · 减少 I/O 次数。', sym: '§' },
    { name: '文本搜索引擎', en: 'text search', pick: '倒排 + 散列', why: '词典用散列定位 · 倒排列表用跳表/有序数组。KMP 用于短文件扫描。', sym: '↻' },
    { name: '路由表 · LPM', en: 'routing table', pick: '压缩 Trie', why: '<em>最长前缀匹配</em> · Trie 的变体 · 硬件友好。', sym: '→' },
    { name: '内存缓存', en: 'in-memory cache', pick: '散列 + 双链表', why: '散列定位 + 链表维序 · LRU/LFU 之标准实现。', sym: '◎' },
    { name: '拼写检查', en: 'spell check', pick: '字典树 · Trie', why: '公共前缀<em>共享路径</em> · 查询与插入 O(|k|)。', sym: '※' },
  ];

  return (
    <div className="specimen">
      <Intro meta={meta}>
        <h2 className="intro-title"><em>Synthesis</em> 查找之族 · <em>fin.</em></h2>
        <p className="intro-para">
          <em>九种方法</em>，其本质是在三个维度上取舍：<em>时间复杂度</em> 对应扫描的次数，
          <em>空间复杂度</em> 对应数据组织的代价，<em>前提条件</em>（有序？动态？可散列？）决定
          算法的适用边界。凡谈查找，先问数据形态。
        </p>
        <p className="intro-para">
          若数据<em>静态且有序</em>，折半足矣；若频繁更新，须用<em>平衡树</em>；若规模巨大而载于外
          存，<em>B+ 树</em>是工业标准；若只关心等值查询，<em>散列表</em>往往最快。KMP 处理字符串，
          Trie 处理前缀——每一种工具，都对应着一种问题的几何形状。
        </p>
      </Intro>

      <SectionHead num="1" title="八族查找 · 对照" subtitle="— comparison summary" />
      <div style={{ background: 'var(--cream-2)', border: '1px solid var(--ink)', borderWidth: '3px 1px', margin: '18px 0 36px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 0.8fr 0.8fr 1fr 1.2fr 2fr',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          background: 'var(--cream-3)',
          borderBottom: '1px solid var(--ink)',
        }}>
          <div style={{ padding: '10px 14px' }}>方法 · method</div>
          <div style={{ padding: '10px 14px' }}>平均 · avg</div>
          <div style={{ padding: '10px 14px' }}>空间 · space</div>
          <div style={{ padding: '10px 14px' }}>预处理 · pre</div>
          <div style={{ padding: '10px 14px' }}>前提 · cond</div>
          <div style={{ padding: '10px 14px' }}>典型场景 · scene</div>
        </div>
        {summaryRows.map((r, idx) => (
          <div key={idx} style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.8fr 0.8fr 1fr 1.2fr 2fr',
            fontSize: 13,
            borderBottom: idx === summaryRows.length - 1 ? 'none' : '1px solid var(--line-2)',
            background: idx % 2 === 0 ? 'var(--cream-2)' : 'var(--cream)',
          }}>
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>{r.m}</div>
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }} dangerouslySetInnerHTML={{ __html: r.avg }} />
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: r.sp }} />
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: r.pre }} />
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: r.cond }} />
            <div style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', fontSize: 13, fontStyle: 'normal', color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: r.scene }} />
          </div>
        ))}
      </div>

      <SectionHead num="2" title="ASL · 平均查找长度" subtitle="— average search length" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 36 }}>
        {[
          { lab: '顺序查找', en: 'sequential', f: 'ASL = (n+1)/2', note: '成功时平均 · 每元素概率相等' },
          { lab: '折半查找', en: 'binary', f: 'ASL ≈ log₂(n+1) − 1', note: '判定树平均路径长度' },
          { lab: '分块查找', en: 'block', f: 'ASL = (b+1)/2 + (s+1)/2', note: 'b = 块数 · s = 块长 · 最优 s = √n' },
          { lab: '散列 (链地址, 成功)', en: 'hash · succ', f: 'ASL ≈ 1 + α/2', note: 'α = n/m · 装填因子' },
          { lab: '散列 (链地址, 失败)', en: 'hash · fail', f: 'ASL ≈ α', note: '失败 = 扫过整条链' },
          { lab: '二叉搜索树 (平衡)', en: 'BST · balanced', f: 'ASL ≈ log₂(n)', note: '最优形态 · 不保证' },
        ].map((x, i) => (
          <div key={i} style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
              FORMULA · {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500 }}>{x.lab} · <em style={{ color: 'var(--ink-3)', fontSize: 13 }}>{x.en}</em></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)', background: 'var(--cream)', padding: '6px 10px', margin: '8px 0', border: '1px solid var(--line-2)' }}>
              {x.f}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fontStyle: 'italic', color: 'var(--ink-3)' }}>{x.note}</div>
          </div>
        ))}
      </div>

      <SectionHead num="3" title="八则应用 · 场景与选型" subtitle="— where to pick what" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid var(--ink)', marginBottom: 36 }}>
        {apps.map((a, i) => (
          <div key={i} style={{
            padding: '20px 22px',
            borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
            borderBottom: i < apps.length - 2 ? '1px solid var(--line)' : 'none',
            background: (Math.floor(i / 2) % 2 === 0) ? 'var(--cream-2)' : 'var(--cream)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                APP · {String(i + 1).padStart(2, '0')}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent)' }}>{a.sym}</span>
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, margin: '2px 0' }}>{a.name}</h4>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>{a.en}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>→ PICK</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{a.pick}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }} dangerouslySetInnerHTML={{ __html: a.why }} />
          </div>
        ))}
      </div>

      <SectionHead num="4" title="选型之问 · decision tree" subtitle="— when-to-pick" />
      <div style={{
        background: 'var(--cream-2)',
        border: '1px solid var(--ink)',
        padding: '28px 32px',
        marginBottom: 36,
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        lineHeight: 2.2,
      }}>
        <div style={{ marginBottom: 14, fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 14 }}>
          — <em>questions to ask before picking a search method</em>
        </div>
        <div><span style={{ color: 'var(--accent)' }}>Q1.</span> 数据是否 <em style={{ fontFamily: 'var(--font-serif)' }}>静态</em>？</div>
        <div style={{ paddingLeft: 40 }}>└ 是 · 有序 · <span style={{ color: 'var(--accent)' }}>折半</span>／有序分块</div>
        <div style={{ paddingLeft: 40 }}>└ 否 · 走 Q2</div>
        <div><span style={{ color: 'var(--accent)' }}>Q2.</span> 是否只需 <em style={{ fontFamily: 'var(--font-serif)' }}>等值查询</em>？</div>
        <div style={{ paddingLeft: 40 }}>└ 是 · <span style={{ color: 'var(--accent)' }}>散列表</span>（期望 O(1)）</div>
        <div style={{ paddingLeft: 40 }}>└ 否（需有序遍历/范围） · 走 Q3</div>
        <div><span style={{ color: 'var(--accent)' }}>Q3.</span> 数据能否 <em style={{ fontFamily: 'var(--font-serif)' }}>全部载入内存</em>？</div>
        <div style={{ paddingLeft: 40 }}>└ 能 · <span style={{ color: 'var(--accent)' }}>红黑树 / AVL</span></div>
        <div style={{ paddingLeft: 40 }}>└ 不能 · <span style={{ color: 'var(--accent)' }}>B+ 树</span>（磁盘友好 · 范围扫描）</div>
        <div><span style={{ color: 'var(--accent)' }}>Q4.</span> 关键字是 <em style={{ fontFamily: 'var(--font-serif)' }}>字符串</em>？</div>
        <div style={{ paddingLeft: 40 }}>└ 前缀查询 · <span style={{ color: 'var(--accent)' }}>Trie</span></div>
        <div style={{ paddingLeft: 40 }}>└ 子串查询 · <span style={{ color: 'var(--accent)' }}>KMP / BM / AC</span></div>
      </div>

      <TraitsGrid traits={[
        { title: '渐近并非一切', body: '<em>常数因子</em>与<em>缓存局部性</em>常决定实际速度 · 小 n 时朴素算法反胜之。' },
        { title: '空间换时间', body: '散列/索引/预计算皆<em>以空间换时间</em> · 关键在预处理摊销是否划算。' },
        { title: '稳定与最劣', body: '平均 O(log n) 不等于<em>最劣</em> O(log n) · 平衡树提供严格保证 · BST 无此承诺。' },
        { title: '选型先问数据', body: '工具固然重要 · 更重要的是<em>识别问题形态</em> · 先问静态/动态/有序/等值。' },
      ]} />

      <div style={{
        textAlign: 'center',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: 18,
        color: 'var(--ink-3)',
        margin: '50px 0 30px',
        letterSpacing: '0.02em',
      }}>
        — <em style={{ color: 'var(--accent)' }}>fin.</em> · end of VOL. 02 —
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   ROOT · <SearchLab>
   ════════════════════════════════════════════════════════════════════════ */

const TABS = [
  { n: '01', zh: '概念',    en: 'concepts',       C: SpecimenConcepts },
  { n: '02', zh: '顺序查找', en: 'sequential',     C: SpecimenSequential },
  { n: '03', zh: '分块查找', en: 'block search',   C: SpecimenBlock },
  { n: '04', zh: '折半查找', en: 'binary search',  C: SpecimenBinary },
  { n: '05', zh: '树型查找', en: 'trees',          C: SpecimenTree },
  { n: '06', zh: 'B / B+', en: 'multi-way',      C: SpecimenBTree },
  { n: '07', zh: '散列表',   en: 'hash table',     C: SpecimenHash },
  { n: '08', zh: '模式匹配', en: 'pattern match',  C: SpecimenKMP },
  { n: '09', zh: '分析应用', en: 'analysis',       C: SpecimenAnalysis },
];

export default function SearchLab() {
  const [tab, setTab] = useState(0);
  const Active = TABS[tab].C;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <div className="search-lab">
      <style>{STYLES}</style>

      <header className="lab-head">
        <span className="mono-sm">VOL. <span className="accent">02</span> · A FIELD MANUAL OF DATA STRUCTURES</span>
        <span className="mono-sm">MMXXVI · <span className="accent">查找篇</span></span>
      </header>

      <h1 className="lab-title">
        An <em>Atlas</em> of Search
        <span className="zh">查 · 找 · 之 图 鉴</span>
      </h1>

      <div className="lab-sub">
        <span className="dot" />
        <span className="lab">SPECIMENS · 01 — 09</span>
        <span className="sep">/</span>
        <em>from sequential scan to pattern matching</em>
        <span className="sep">·</span>
        <span className="lab">9 TABS · 4 INTERACTIVE</span>
      </div>

      <nav className="tabbar">
        {TABS.map((t, i) => (
          <button
            key={t.n}
            className={`tab ${i === tab ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >
            <span className="num">SPECIMEN · {t.n}</span>
            <span className="zh">{t.zh}</span>
            <span className="en">{t.en}</span>
          </button>
        ))}
      </nav>

      <main>
        <Active />
      </main>

      <footer className="lab-foot">
        <span><em>A Manual of Search</em> · VOL. 02 · 查找</span>
        <span>SPECIMEN · {TABS[tab].n} · {TABS[tab].zh}</span>
        <span>p. {String((tab + 1) * 7).padStart(3, '0')} / 063</span>
      </footer>
    </div>
  );
}
