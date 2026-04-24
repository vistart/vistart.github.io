import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ────────────────────────────────────────────────────────────────────
   数据结构实验室 · 第四卷 · 图
   VOL. 04 — Graphs
   Specimen 01 — Representation (邻接矩阵 · 邻接表)
   Specimen 02 — Traversal      (DFS / BFS)
   Specimen 03 — Shortest Path  (Dijkstra)
   ──────────────────────────────────────────────────────────────────── */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap');

:root {
  --cream:        #F1EADA;
  --cream-light:  #F7F2E6;
  --cream-dark:   #E4DBC4;
  --ink:          #1F1B17;
  --ink-soft:     #3A3530;
  --ink-muted:    #7A6F5E;
  --accent:       #C7381A;
  --accent-soft:  #D66B4D;
  --accent-faded: rgba(199, 56, 26, 0.10);
  --line:         #B5A78C;
  --line-soft:    #CEC3A8;
  --paper-grain:  rgba(31, 27, 23, 0.018);
}

* { box-sizing: border-box; }

.lab-root {
  min-height: 100vh;
  background-color: var(--cream);
  color: var(--ink);
  font-family: 'Fraunces', 'Noto Serif SC', Georgia, serif;
  font-feature-settings: "ss01", "ss02";
  position: relative;
  padding-bottom: 80px;
  background-image:
    repeating-linear-gradient(0deg, transparent 0, transparent 3px, var(--paper-grain) 3px, var(--paper-grain) 4px),
    repeating-linear-gradient(90deg, transparent 0, transparent 3px, var(--paper-grain) 3px, var(--paper-grain) 4px);
}

.lab-root::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 10% 0%, rgba(199, 56, 26, 0.04), transparent 40%),
    radial-gradient(ellipse at 100% 100%, rgba(31, 27, 23, 0.04), transparent 40%);
  z-index: 0;
}

.lab-container { max-width: 1160px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 1; }

/* ─── Typography ─── */
.serif   { font-family: 'Fraunces', 'Noto Serif SC', Georgia, serif; }
.mono    { font-family: 'JetBrains Mono', 'Courier New', monospace; }
.italic  { font-style: italic; }

.caps {
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-muted);
}

/* ─── Header ─── */
.lab-header {
  padding: 48px 48px 0;
  max-width: 1160px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.lab-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--ink);
}
.lab-volume { display: flex; gap: 28px; align-items: baseline; }
.lab-title-block { margin: 40px 0 12px; }
.lab-title {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-weight: 400;
  font-size: 88px;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0;
}
.lab-title .em {
  font-style: italic;
  font-weight: 500;
  color: var(--accent);
  font-variation-settings: "opsz" 144;
}
.lab-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: 20px;
  display: flex;
  gap: 18px;
  align-items: center;
  letter-spacing: 0.08em;
  flex-wrap: wrap;
}
.lab-subtitle .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); display: inline-block; }
.lab-header-bottom {
  margin-top: 28px;
  padding: 14px 0;
  border-top: 1px solid var(--ink);
  border-bottom: 3px double var(--ink);
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

/* ─── Tabs ─── */
.lab-tabs { display: flex; gap: 0; margin: 48px 0 56px; border-bottom: 1px solid var(--line); }
.lab-tab {
  flex: 1;
  background: transparent;
  border: none;
  padding: 24px 28px;
  cursor: pointer;
  text-align: left;
  border-left: 1px solid var(--line-soft);
  position: relative;
  transition: background 0.25s ease;
  font-family: inherit;
  color: var(--ink-muted);
}
.lab-tab:first-child { border-left: none; }
.lab-tab:hover { background: var(--cream-light); color: var(--ink-soft); }
.lab-tab-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 8px;
}
.lab-tab-name {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-size: 32px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.lab-tab-name-en {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  color: var(--ink-muted);
  margin-left: 10px;
}
.lab-tab.active {
  color: var(--ink);
  background: var(--cream-light);
}
.lab-tab.active::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 3px;
  background: var(--accent);
}
.lab-tab.active .lab-tab-num { color: var(--accent); }
.lab-tab.active .lab-tab-name-en { color: var(--accent-soft); }

/* ─── Module Intro ─── */
.module-intro {
  display: grid;
  grid-template-columns: 180px 1fr 200px;
  gap: 48px;
  padding-bottom: 48px;
  margin-bottom: 56px;
  border-bottom: 1px solid var(--line-soft);
}
.module-intro-side {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  line-height: 1.9;
}
.module-intro-side strong {
  color: var(--ink);
  font-weight: 500;
  display: block;
  margin-bottom: 3px;
}
.module-intro-body p {
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0 0 14px;
}
.module-intro-body p:first-child::first-letter {
  font-family: 'Fraunces', serif;
  font-size: 58px;
  font-weight: 500;
  font-style: italic;
  color: var(--accent);
  float: left;
  line-height: 0.9;
  padding: 6px 10px 0 0;
}

/* ─── Viz Panel ─── */
.viz-panel {
  position: relative;
  padding: 64px 48px 56px;
  background: var(--cream-light);
  margin-bottom: 56px;
}
.viz-panel::before,
.viz-panel::after,
.viz-corner {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--ink);
}
.viz-panel::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.viz-panel::after  { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.viz-corner.bl { bottom: -1px; left: -1px; top: auto; border-right: none; border-top: none; }
.viz-corner.br { bottom: -1px; right: -1px; top: auto; border-left: none; border-top: none; }

.viz-label {
  position: absolute;
  top: 14px;
  left: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.viz-label-right {
  position: absolute;
  top: 14px;
  right: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}
.viz-canvas-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 160px;
  overflow-x: auto;
  padding: 16px 0;
}
.viz-caption {
  text-align: center;
  margin-top: 24px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 14px;
  color: var(--ink-muted);
}
.viz-caption .fig {
  font-family: 'JetBrains Mono', monospace;
  font-style: normal;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  margin-right: 8px;
}

/* ═════ GRAPH VISUALIZATION ═════ */
.gr-stage {
  position: relative;
  margin: 0 auto;
  max-width: 580px;
  width: 100%;
}
.gr-svg {
  display: block;
  width: 100%;
  height: auto;
}

.gr-edge {
  stroke: var(--ink);
  stroke-width: 1.4;
  fill: none;
  transition: stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease;
}
.gr-edge.dim { stroke: var(--line-soft); stroke-width: 1; }
.gr-edge.hl { stroke: var(--accent); stroke-width: 2.25; }
.gr-edge.tree {
  stroke: var(--accent);
  stroke-width: 2.4;
}
.gr-edge.relaxed {
  stroke: var(--accent);
  stroke-width: 2;
  stroke-dasharray: 5 3;
  animation: edgeRelax 0.8s ease;
}
@keyframes edgeRelax {
  0% { stroke-dashoffset: 20; opacity: 0.3; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}

.gr-weight-g text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  fill: var(--ink);
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: middle;
}
.gr-weight-g rect {
  fill: var(--cream-light);
  stroke: var(--line);
  stroke-width: 0.5;
}
.gr-weight-g.hl text { fill: var(--accent); }
.gr-weight-g.hl rect { stroke: var(--accent); fill: var(--cream); }

.gr-node-group circle {
  fill: var(--cream);
  stroke: var(--ink);
  stroke-width: 1.5;
  transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
  cursor: pointer;
}
.gr-node-group:hover circle {
  fill: var(--cream-dark);
}
.gr-node-group text.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  fill: var(--ink);
  pointer-events: none;
  transition: fill 0.3s ease;
  user-select: none;
}
.gr-node-group.selected circle {
  stroke: var(--accent);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 5px rgba(199,56,26,0.45));
}
.gr-node-group.cur circle {
  fill: var(--accent);
  stroke: var(--accent);
  stroke-width: 2;
  animation: pulseNode 1.4s ease infinite;
}
.gr-node-group.cur text.label { fill: var(--cream); }
@keyframes pulseNode {
  0%, 100% { filter: drop-shadow(0 0 0 rgba(199,56,26,0.7)); }
  50% { filter: drop-shadow(0 0 8px rgba(199,56,26,0.7)); }
}
.gr-node-group.visited circle, .gr-node-group.known circle {
  fill: var(--ink);
  stroke: var(--ink);
}
.gr-node-group.visited text.label, .gr-node-group.known text.label { fill: var(--cream); }
.gr-node-group.frontier circle {
  fill: var(--accent-faded);
  stroke: var(--accent-soft);
  stroke-width: 1.8;
}
.gr-node-group.start circle {
  stroke: var(--accent);
  stroke-width: 2.5;
}
.gr-node-group.start text.mark {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.12em;
  fill: var(--accent);
  text-anchor: middle;
  pointer-events: none;
  font-weight: 600;
}
.gr-node-group text.dist {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  fill: var(--accent);
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
}
.gr-node-group.known text.dist { fill: var(--cream); }
.gr-node-group text.dist-bg {
  fill: var(--cream-light);
}

/* Adjacency Matrix */
.rep-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 36px;
  margin-top: 36px;
  padding-top: 30px;
  border-top: 1px solid var(--line-soft);
}
.rep-section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
}
.rep-section-title .num { color: var(--accent); }
.rep-section-title .sub {
  font-family: 'Fraunces', serif;
  font-style: italic;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink-muted);
  font-size: 13px;
}

.adj-matrix {
  border-collapse: collapse;
  font-family: 'JetBrains Mono', monospace;
  background: var(--cream);
  border: 1.5px solid var(--ink);
}
.adj-matrix th,
.adj-matrix td {
  width: 34px;
  height: 34px;
  text-align: center;
  font-size: 13px;
  border: 0.5px solid var(--line-soft);
  transition: background-color 0.2s ease, color 0.2s, border-color 0.2s;
  padding: 0;
}
.adj-matrix thead th,
.adj-matrix tbody th {
  background: var(--cream-dark);
  color: var(--ink);
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 12px;
}
.adj-matrix td.on {
  background: var(--accent);
  color: var(--cream);
  font-weight: 600;
}
.adj-matrix td.off { color: var(--line); }
.adj-matrix td.diag { background: var(--cream-light); color: var(--ink-muted); }
.adj-matrix th.row-hl,
.adj-matrix th.col-hl {
  background: var(--ink);
  color: var(--accent-soft);
}
.adj-matrix td.row-hl,
.adj-matrix td.col-hl {
  background: var(--accent-faded);
}
.adj-matrix td.cross-hl {
  background: var(--accent);
  color: var(--cream);
  box-shadow: inset 0 0 0 2px var(--ink);
}

.adj-list {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
  background: var(--cream);
  border: 1.5px solid var(--ink);
  padding: 10px 0;
}
.adj-list-row {
  display: grid;
  grid-template-columns: 42px 18px 1fr;
  align-items: center;
  padding: 5px 14px;
  border-bottom: 1px dashed var(--line-soft);
  transition: background-color 0.2s ease;
}
.adj-list-row:last-child { border-bottom: none; }
.adj-list-row.hl { background: var(--accent-faded); }
.adj-list-row .node-tag {
  width: 28px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: var(--cream);
  font-weight: 600;
  font-size: 12px;
  transition: background-color 0.2s;
}
.adj-list-row.hl .node-tag { background: var(--accent); }
.adj-list-row .arrow { color: var(--ink-muted); font-size: 11px; text-align: center; }
.adj-list-row .chain {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.adj-list-row .chain .chip {
  padding: 2px 8px;
  background: var(--cream-light);
  border: 1px solid var(--ink);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: border-color 0.2s;
}
.adj-list-row .chain .chip .w {
  color: var(--accent);
  font-size: 10px;
  margin-left: 2px;
}
.adj-list-row.hl .chain .chip { border-color: var(--accent); }
.adj-list-row .chain .nil {
  color: var(--ink-muted);
  font-style: italic;
  font-family: 'Fraunces', serif;
  font-size: 12px;
}

/* Stack / Queue aux display */
.aux-view {
  margin-top: 18px;
  padding: 16px 20px;
  background: var(--cream);
  border: 1px solid var(--ink);
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 12px;
  align-items: center;
  min-height: 60px;
}
.aux-view-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.aux-view-label .em {
  color: var(--accent);
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  letter-spacing: 0;
  text-transform: none;
}
.aux-items {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  overflow-x: auto;
}
.aux-item {
  padding: 4px 10px;
  border: 1.5px solid var(--ink);
  background: var(--cream-light);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  animation: chipEnter 0.3s ease;
  min-width: 26px;
  text-align: center;
}
.aux-item.top {
  background: var(--accent);
  color: var(--cream);
  border-color: var(--accent);
}
.aux-item.head {
  background: var(--accent);
  color: var(--cream);
  border-color: var(--accent);
}
.aux-item.tail {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}
.aux-placeholder {
  font-family: 'Fraunces', serif;
  font-style: italic;
  color: var(--ink-muted);
  font-size: 13px;
}
.aux-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-muted);
  letter-spacing: 0.1em;
  text-align: right;
}
.aux-count .num {
  font-size: 16px;
  color: var(--accent);
  font-weight: 600;
  display: block;
}

@keyframes chipEnter {
  from { opacity: 0; transform: translateY(-6px) scale(0.85); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Visit sequence strip */
.visit-strip {
  margin-top: 18px;
  padding: 14px 20px;
  background: var(--ink);
  color: var(--cream);
}
.visit-strip-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.visit-strip-title .em { color: var(--accent-soft); }
.visit-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
}
.visit-chip {
  padding: 4px 10px;
  border: 1px solid var(--cream);
  background: transparent;
  color: var(--cream);
  font-weight: 500;
  font-size: 13px;
  animation: chipEnter 0.35s ease;
}
.visit-chip.cur {
  background: var(--accent);
  color: var(--cream);
  border-color: var(--accent);
  transform: scale(1.08);
}
.visit-sep { color: rgba(241,234,218,0.4); align-self: center; margin: 0 -3px; }
.visit-placeholder {
  font-family: 'Fraunces', serif;
  font-style: italic;
  color: rgba(241,234,218,0.4);
  font-size: 13px;
}

/* Dijkstra distance table */
.dist-table {
  margin-top: 22px;
  border: 1.5px solid var(--ink);
  background: var(--cream);
}
.dist-table-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  padding: 10px 16px;
  border-bottom: 1px solid var(--ink);
  display: flex;
  justify-content: space-between;
}
.dist-table-title .num { color: var(--accent); }
.dist-table-title .status .done { color: #2B7A4B; }
.dist-table-grid {
  display: grid;
  font-family: 'JetBrains Mono', monospace;
}
.dist-table-row {
  display: grid;
}
.dist-table-row.header {
  background: var(--cream-dark);
  border-bottom: 1px solid var(--ink);
}
.dist-cell {
  padding: 10px 6px;
  text-align: center;
  border-right: 1px dashed var(--line-soft);
  font-size: 14px;
  transition: all 0.25s ease;
}
.dist-cell:last-child { border-right: none; }
.dist-table-row.header .dist-cell {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  font-weight: 500;
  padding: 8px 4px;
  border-right: 1px solid var(--line);
}
.dist-table-row.header .dist-cell.label {
  text-align: left;
  padding-left: 16px;
  color: var(--ink-muted);
}
.dist-cell.label {
  text-align: left;
  padding-left: 16px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
}
.dist-table-row.dist-body .dist-cell {
  border-bottom: 1px dashed var(--line-soft);
}
.dist-cell.node-head {
  color: var(--accent);
  font-weight: 700;
  font-size: 15px;
}
.dist-cell.val { font-weight: 500; color: var(--ink); }
.dist-cell.val.inf { color: var(--ink-muted); font-style: italic; }
.dist-cell.val.known {
  background: var(--ink);
  color: var(--cream);
}
.dist-cell.val.cur {
  background: var(--accent);
  color: var(--cream);
  font-weight: 600;
}
.dist-cell.val.frontier {
  background: var(--accent-faded);
  color: var(--accent);
  font-weight: 600;
}
.dist-cell.val.updated {
  animation: cellFlash 0.6s ease;
}
.dist-cell.prev { color: var(--ink-muted); font-size: 12px; }
.dist-cell.prev .v { color: var(--accent); font-weight: 600; }
@keyframes cellFlash {
  0% { background: var(--accent-soft); color: var(--cream); }
  100% { }
}

.dijk-legend {
  display: flex;
  gap: 20px;
  padding: 10px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-muted);
  border-top: 1px solid var(--line-soft);
  flex-wrap: wrap;
}
.dijk-legend .key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.dijk-legend .sw {
  width: 12px; height: 12px;
  border: 1px solid var(--ink);
}
.dijk-legend .sw.known { background: var(--ink); }
.dijk-legend .sw.cur { background: var(--accent); border-color: var(--accent); }
.dijk-legend .sw.front { background: var(--accent-faded); border-color: var(--accent-soft); }
.dijk-legend .sw.far { background: var(--cream); }

/* ─── Controls ─── */
.controls-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}
.control-block {
  background: var(--cream-light);
  padding: 32px 28px;
  position: relative;
}
.control-block-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  padding-bottom: 14px;
  margin-bottom: 20px;
  border-bottom: 1.5px solid var(--ink);
  display: flex;
  justify-content: space-between;
}
.control-block-title .num { color: var(--accent); }
.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.input-row label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-muted);
  min-width: 80px;
}
.input-row-hint {
  width: 100%;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: -6px;
  margin-bottom: 14px;
  line-height: 1.55;
}
.lab-input {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  background: var(--cream);
  border: 1.5px solid var(--ink);
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lab-input:focus {
  border-color: var(--accent);
  box-shadow: 3px 3px 0 var(--accent-faded);
}
.lab-select {
  flex: 1;
  padding: 8px 28px 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  background: var(--cream);
  border: 1.5px solid var(--ink);
  color: var(--ink);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--ink) 50%), linear-gradient(135deg, var(--ink) 50%, transparent 50%);
  background-position: calc(100% - 14px) 50%, calc(100% - 9px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
}
.btn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 8px;
}
.btn-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.btn-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
.lab-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 12px 10px;
  background: var(--cream);
  color: var(--ink);
  border: 1.5px solid var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.lab-btn:hover {
  background: var(--ink);
  color: var(--cream);
}
.lab-btn:active { transform: translate(1px, 1px); }
.lab-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lab-btn:disabled:hover { background: var(--cream); color: var(--ink); }
.lab-btn .sym {
  color: var(--accent);
  font-size: 14px;
  line-height: 1;
}
.lab-btn:hover .sym { color: var(--accent-soft); }
.lab-btn.accent {
  background: var(--accent);
  color: var(--cream);
  border-color: var(--accent);
}
.lab-btn.accent:hover { background: var(--ink); border-color: var(--ink); }
.lab-btn.accent .sym { color: var(--cream); }
.lab-btn.danger {
  border-color: var(--accent);
  color: var(--accent);
}
.lab-btn.danger:hover {
  background: var(--accent);
  color: var(--cream);
  border-color: var(--accent);
}
.lab-btn.danger .sym { color: var(--accent); }
.lab-btn.danger:hover .sym { color: var(--cream); }

/* Mode pills (DFS/BFS) */
.mode-pills {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  margin-top: 4px;
}
.mode-pills button {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 10px;
  border: 1.5px solid var(--ink);
  background: var(--cream);
  color: var(--ink);
  cursor: pointer;
  margin-left: -1.5px;
  transition: all 0.15s ease;
}
.mode-pills button:first-child { margin-left: 0; }
.mode-pills button:hover { background: var(--cream-dark); }
.mode-pills button.active {
  background: var(--ink);
  color: var(--cream);
}
.mode-pills button .zh {
  display: block;
  font-size: 13px;
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-style: italic;
  color: var(--accent);
  margin-bottom: 3px;
  letter-spacing: 0;
  text-transform: none;
}
.mode-pills button.active .zh { color: var(--accent-soft); }

/* Selection display */
.sel-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-muted);
  padding: 10px 14px;
  border: 1px dashed var(--ink);
  background: var(--cream);
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sel-display .val {
  color: var(--accent);
  font-weight: 600;
  font-size: 14px;
}
.sel-display.none .val {
  color: var(--ink-muted);
  font-style: italic;
  font-family: 'Fraunces', serif;
  text-transform: none;
  letter-spacing: 0;
}
.sel-display.pending {
  border-color: var(--accent);
  border-style: solid;
}
.sel-display.pending .val {
  animation: pendingBlink 1.2s ease infinite;
}
@keyframes pendingBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ─── Log ─── */
.log-block {
  background: var(--ink);
  color: var(--cream);
  padding: 28px 28px 20px;
  position: relative;
}
.log-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cream);
  padding-bottom: 14px;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba(241, 234, 218, 0.2);
  display: flex;
  justify-content: space-between;
}
.log-title .num { color: var(--accent-soft); }
.log-title .act { cursor: pointer; }
.log-list {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.8;
  max-height: 300px;
  overflow-y: auto;
  color: rgba(241, 234, 218, 0.7);
}
.log-item {
  display: grid;
  grid-template-columns: 62px 1fr 56px;
  gap: 10px;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(241, 234, 218, 0.1);
  animation: logEnter 0.25s ease;
}
.log-item .t { color: rgba(241, 234, 218, 0.4); font-size: 10px; }
.log-item .msg { color: var(--cream); }
.log-item.success .msg { color: var(--cream); }
.log-item.error   .msg { color: var(--accent-soft); }
.log-item.info    .msg { color: rgba(241, 234, 218, 0.7); }
.log-item .c {
  text-align: right;
  color: var(--accent-soft);
  font-size: 10px;
  letter-spacing: 0.05em;
}
.log-empty {
  font-family: 'Fraunces', serif;
  font-style: italic;
  color: rgba(241, 234, 218, 0.4);
  font-size: 13px;
  padding: 20px 0;
  text-align: center;
}
@keyframes logEnter {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
.log-list::-webkit-scrollbar { width: 6px; }
.log-list::-webkit-scrollbar-thumb { background: rgba(241, 234, 218, 0.2); }

/* ─── Complexity Table ─── */
.complexity-block { margin-bottom: 40px; }
.complexity-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 14px;
  margin-bottom: 0;
  border-bottom: 1.5px solid var(--ink);
}
.complexity-title h3 {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-weight: 500;
  font-size: 28px;
  margin: 0;
  letter-spacing: -0.01em;
}
.complexity-title .num {
  font-family: 'JetBrains Mono', monospace;
  color: var(--accent);
  font-size: 11px;
  letter-spacing: 0.22em;
}
.complexity-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'JetBrains Mono', monospace;
}
.complexity-table th,
.complexity-table td {
  padding: 14px 18px;
  text-align: left;
  font-size: 13px;
  border-bottom: 1px solid var(--line-soft);
}
.complexity-table th {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--ink);
}
.complexity-table td:first-child {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-size: 15px;
  color: var(--ink);
  font-weight: 500;
}
.complexity-table .c-good { color: #2B7A4B; }
.complexity-table .c-bad  { color: var(--accent); }
.complexity-table .c-mid  { color: #B86F1F; }

/* ─── Traits Grid ─── */
.traits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--line-soft);
  margin-bottom: 56px;
  border: 1px solid var(--line-soft);
}
.trait {
  background: var(--cream);
  padding: 24px 26px;
}
.trait-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 8px;
}
.trait-title {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-weight: 500;
  font-size: 19px;
  margin-bottom: 6px;
  line-height: 1.3;
}
.trait-desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-soft);
}

/* ─── Footer ─── */
.lab-footer {
  margin-top: 80px;
  padding: 28px 0;
  border-top: 3px double var(--ink);
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.flourish {
  font-family: 'Fraunces', serif;
  font-style: italic;
  color: var(--accent);
  font-weight: 500;
}

@media (max-width: 900px) {
  .lab-container, .lab-header { padding: 0 24px; }
  .lab-title { font-size: 56px; }
  .module-intro { grid-template-columns: 1fr; gap: 24px; }
  .controls-grid { grid-template-columns: 1fr; }
  .traits-grid { grid-template-columns: 1fr; }
  .rep-grid { grid-template-columns: 1fr; }
  .lab-tab-name { font-size: 20px; }
  .lab-tab-name-en { display: block; margin-left: 0; margin-top: 2px; font-size: 14px; }
}
`;

/* ═════════════════════════════════════════════════════════════════════
   Shared Helpers
   ═════════════════════════════════════════════════════════════════════ */
function useLog() {
  const [log, setLog] = useState([]);
  const idRef = useRef(0);
  const push = useCallback((msg, complexity = '—', kind = 'success') => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    setLog(prev => [{ id: ++idRef.current, t, msg, complexity, kind }, ...prev].slice(0, 30));
  }, []);
  const clear = useCallback(() => setLog([]), []);
  return [log, push, clear];
}

function LogPanel({ log, onClear, num }) {
  return (
    <div className="log-block">
      <div className="log-title">
        <span><span className="num">{num}</span> &nbsp;OPERATION · LOG</span>
        <span className="act" onClick={onClear}>[ CLEAR ]</span>
      </div>
      <div className="log-list">
        {log.length === 0 ? (
          <div className="log-empty">— no entries yet —</div>
        ) : log.map(e => (
          <div key={e.id} className={`log-item ${e.kind}`}>
            <span className="t">{e.t}</span>
            <span className="msg">{e.msg}</span>
            <span className="c">{e.complexity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Graph utilities
   ═════════════════════════════════════════════════════════════════════ */
const GRAPH_VIEW_W = 560;
const GRAPH_VIEW_H = 300;

/* Shared 6-node layout (A..F) reused by all three specimens */
const BASE_NODES = [
  { id: 'A', x:  90, y:  70 },
  { id: 'B', x: 280, y:  60 },
  { id: 'C', x: 470, y:  70 },
  { id: 'D', x:  90, y: 230 },
  { id: 'E', x: 280, y: 240 },
  { id: 'F', x: 470, y: 230 },
];

const edgeKey = (a, b) => a < b ? `${a}-${b}` : `${b}-${a}`;

function toAdjList(graph) {
  const m = new Map(graph.nodes.map(n => [n.id, []]));
  for (const e of graph.edges) {
    m.get(e.from).push({ to: e.to, w: e.w ?? 1 });
    m.get(e.to).push({ to: e.from, w: e.w ?? 1 });
  }
  // sort neighbors alphabetically for deterministic traversal order
  for (const arr of m.values()) arr.sort((a, b) => a.to.localeCompare(b.to));
  return m;
}

function GraphSvg({ nodes, edges, nodeStates = {}, edgeStates = {}, weights = false, startId = null, distMap = null, onNodeClick = null, selectedId = null }) {
  /* nodeStates : { [id]: 'cur' | 'visited' | 'known' | 'frontier' | 'start' }
     edgeStates : { [key]: 'hl' | 'tree' | 'relaxed' | 'dim' } */
  return (
    <svg className="gr-svg" viewBox={`0 0 ${GRAPH_VIEW_W} ${GRAPH_VIEW_H}`}>
      {/* Edges first (under nodes) */}
      {edges.map(e => {
        const na = nodes.find(n => n.id === e.from);
        const nb = nodes.find(n => n.id === e.to);
        if (!na || !nb) return null;
        const k = edgeKey(e.from, e.to);
        const state = edgeStates[k] || '';
        return (
          <line
            key={k}
            className={`gr-edge ${state}`}
            x1={na.x} y1={na.y}
            x2={nb.x} y2={nb.y}
          />
        );
      })}

      {/* Weight labels (only for weighted graphs) */}
      {weights && edges.map(e => {
        const na = nodes.find(n => n.id === e.from);
        const nb = nodes.find(n => n.id === e.to);
        if (!na || !nb) return null;
        const k = edgeKey(e.from, e.to);
        const state = edgeStates[k] || '';
        const hl = state === 'relaxed' || state === 'tree';
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const label = String(e.w);
        const boxW = 22;
        const boxH = 16;
        return (
          <g key={`w-${k}`} className={`gr-weight-g ${hl ? 'hl' : ''}`}>
            <rect x={mx - boxW / 2} y={my - boxH / 2} width={boxW} height={boxH} rx={2} />
            <text x={mx} y={my + 0.5}>{label}</text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(n => {
        const st = nodeStates[n.id] || '';
        const isStart = startId === n.id;
        const isSelected = selectedId === n.id;
        const classes = [
          'gr-node-group',
          st,
          isStart ? 'start' : '',
          isSelected ? 'selected' : '',
        ].filter(Boolean).join(' ');

        const dist = distMap ? distMap.get(n.id) : null;
        const hasDist = distMap && dist !== undefined;
        const distText = hasDist ? (dist === Infinity ? '∞' : dist) : '';

        return (
          <g
            key={n.id}
            className={classes}
            onClick={onNodeClick ? () => onNodeClick(n.id) : undefined}
          >
            <circle cx={n.x} cy={n.y} r={22} />
            <text className="label" x={n.x} y={n.y}>{n.id}</text>
            {isStart && (
              <text className="mark" x={n.x} y={n.y + 38}>START</text>
            )}
            {hasDist && (
              <>
                <rect
                  x={n.x - 18} y={n.y - 40}
                  width={36} height={18}
                  rx={2}
                  fill={st === 'known' ? 'var(--ink)' : 'var(--cream-light)'}
                  stroke="var(--accent)" strokeWidth="1"
                />
                <text
                  className="dist"
                  x={n.x}
                  y={n.y - 31}
                  style={{ fill: st === 'known' ? 'var(--cream)' : 'var(--accent)' }}
                >
                  {distText}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Specimen 01 · Graph Representation  (存储结构)
   ═════════════════════════════════════════════════════════════════════ */
const STORAGE_INITIAL_EDGES = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'D', to: 'E' },
  { from: 'E', to: 'F' },
];

function StorageModule() {
  const [edges, setEdges] = useState(STORAGE_INITIAL_EDGES);
  const [selA, setSelA] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [log, pushLog, clearLog] = useLog();

  const nodes = BASE_NODES;
  const nodeIds = nodes.map(n => n.id);

  const edgeSet = useMemo(() => {
    const s = new Set();
    for (const e of edges) s.add(edgeKey(e.from, e.to));
    return s;
  }, [edges]);

  const adjList = useMemo(() => toAdjList({ nodes, edges }), [edges]);

  /* Adjacency matrix computation */
  const matrix = useMemo(() => {
    const n = nodeIds.length;
    const idx = new Map(nodeIds.map((id, i) => [id, i]));
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    for (const e of edges) {
      m[idx.get(e.from)][idx.get(e.to)] = 1;
      m[idx.get(e.to)][idx.get(e.from)] = 1;
    }
    return m;
  }, [edges]);

  const onNodeClick = (id) => {
    if (!selA) {
      setSelA(id);
      pushLog(`select · ${id} · 请再选一节点以切换其间之边`, '—', 'info');
    } else if (selA === id) {
      setSelA(null);
      pushLog(`deselect · 取消选中`, '—', 'info');
    } else {
      const k = edgeKey(selA, id);
      const exists = edgeSet.has(k);
      if (exists) {
        setEdges(prev => prev.filter(e => edgeKey(e.from, e.to) !== k));
        pushLog(`remove · edge (${selA}, ${id})`, 'O(E)', 'success');
      } else {
        const a = selA < id ? selA : id;
        const b = selA < id ? id : selA;
        setEdges(prev => [...prev, { from: a, to: b }]);
        pushLog(`insert · edge (${selA}, ${id})`, 'O(1)', 'success');
      }
      setSelA(null);
    }
  };

  const reset = () => {
    setEdges(STORAGE_INITIAL_EDGES);
    setSelA(null);
    pushLog(`reset · 恢复初始图`, '—', 'info');
  };

  const clearAll = () => {
    setEdges([]);
    setSelA(null);
    pushLog(`clear · 清空所有边`, '—', 'info');
  };

  const connectAll = () => {
    const all = [];
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        all.push({ from: nodeIds[i], to: nodeIds[j] });
      }
    }
    setEdges(all);
    setSelA(null);
    pushLog(`complete · 构造完全图 K₆ (${all.length} 条边)`, 'O(V²)', 'success');
  };

  /* Highlight maps */
  const nodeStates = {};
  if (selA) nodeStates[selA] = 'cur';
  if (hoverId && hoverId !== selA && selA) nodeStates[hoverId] = 'frontier';

  const edgeStates = {};
  if (selA && hoverId && hoverId !== selA) {
    edgeStates[edgeKey(selA, hoverId)] = 'hl';
  }

  const n = nodeIds.length;
  const maxEdges = n * (n - 1) / 2;
  const density = maxEdges ? (edges.length / maxEdges) : 0;

  return (
    <>
      <section className="module-intro">
        <aside className="module-intro-side">
          <div><strong>SPECIMEN</strong> 01 / 03</div>
          <div><strong>TYPE</strong> Undirected</div>
          <div><strong>|V|</strong> <span style={{color:'var(--accent)'}}>{nodeIds.length}</span></div>
          <div><strong>|E|</strong> <span style={{color:'var(--accent)'}}>{edges.length}</span></div>
          <div><strong>DENSITY</strong> {(density * 100).toFixed(0)}%</div>
        </aside>
        <div className="module-intro-body">
          <p>图是顶点与边的集合——G = (V, E)。与树不同，图无根，亦允环，其上的邻接关系可以错综密织，或疏或密，全凭 E 的构成。要存一张图，最直观有两种方式：以矩阵索引，或以链表连缀。</p>
          <p>邻接矩阵用 n × n 的方阵记下"有无"——查询边的存在 O(1)，代价是空间 O(V²)；邻接表则为每个顶点缀一张出边的链表——节省空间 O(V+E)，查边却要扫链表。稠密用矩阵，稀疏用链表——这便是选择的分野。</p>
        </div>
        <aside className="module-intro-side" style={{ textAlign: 'right' }}>
          <div><strong>SELECTED</strong> <span style={{color:'var(--accent)'}}>{selA || '∅'}</span></div>
          <div><strong>MAX-EDGES</strong> {maxEdges}</div>
          <div><strong>MATRIX-SIZE</strong> {nodeIds.length}²</div>
          <div><strong>LIST-SIZE</strong> V+2E</div>
          <div><strong>IS-COMPLETE</strong> <span style={{color: edges.length === maxEdges ? '#2B7A4B' : 'var(--ink-muted)'}}>{edges.length === maxEdges ? 'YES' : 'NO'}</span></div>
        </aside>
      </section>

      <section className="viz-panel">
        <span className="viz-corner bl" />
        <span className="viz-corner br" />
        <span className="viz-label">FIG. 01 · GRAPH G(V, E)</span>
        <span className="viz-label-right">
          {selA ? `${selA} → · 点选第二节点切换边` : '点击节点以选中'}
        </span>

        <div className="viz-canvas-wrap">
          <div className="gr-stage">
            <GraphSvg
              nodes={nodes}
              edges={edges}
              nodeStates={nodeStates}
              edgeStates={edgeStates}
              selectedId={selA}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>

        {/* Representation: adjacency matrix + adjacency list */}
        <div className="rep-grid">
          <div>
            <div className="rep-section-title">
              <span><span className="num">§</span> 邻接矩阵 · ADJ. MATRIX</span>
              <span className="sub">O(V²) space</span>
            </div>
            <table className="adj-matrix">
              <thead>
                <tr>
                  <th></th>
                  {nodeIds.map(id => (
                    <th key={id} className={selA === id ? 'col-hl' : ''}>{id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodeIds.map((rowId, i) => (
                  <tr key={rowId}>
                    <th className={selA === rowId ? 'row-hl' : ''}>{rowId}</th>
                    {nodeIds.map((colId, j) => {
                      const v = matrix[i][j];
                      const isDiag = i === j;
                      const rowHL = selA === rowId;
                      const colHL = selA === colId;
                      const cross = selA && hoverId && hoverId !== selA && (
                        (rowId === selA && colId === hoverId) ||
                        (rowId === hoverId && colId === selA)
                      );
                      const cls = [
                        isDiag ? 'diag' : (v ? 'on' : 'off'),
                        rowHL && !isDiag ? 'row-hl' : '',
                        colHL && !isDiag && !rowHL ? 'col-hl' : '',
                        cross ? 'cross-hl' : '',
                      ].filter(Boolean).join(' ');
                      return (
                        <td key={colId} className={cls}>
                          {isDiag ? '—' : v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="rep-section-title">
              <span><span className="num">§</span> 邻接表 · ADJ. LIST</span>
              <span className="sub">O(V+E) space</span>
            </div>
            <div className="adj-list">
              {nodeIds.map(id => {
                const nbs = adjList.get(id) || [];
                const isHL = selA === id;
                return (
                  <div key={id} className={`adj-list-row ${isHL ? 'hl' : ''}`}>
                    <div className="node-tag">{id}</div>
                    <div className="arrow">→</div>
                    <div className="chain">
                      {nbs.length === 0 ? (
                        <span className="nil">∅ — isolated</span>
                      ) : nbs.map((n, i) => (
                        <React.Fragment key={n.to}>
                          <span className="chip">{n.to}</span>
                          {i < nbs.length - 1 && <span style={{ color: 'var(--ink-muted)', fontSize: 10, alignSelf: 'center' }}>→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="viz-caption">
          <span className="fig">FIG. 01</span>
          <span className="italic">两种存储各擅胜场——稠密图用矩阵，稀疏图用链表；图的选择决定算法的代价。</span>
        </div>
      </section>

      <section className="controls-grid">
        <div className="control-block">
          <div className="control-block-title">
            <span><span className="num">§1</span> &nbsp;OPERATIONS</span>
            <span>{selA ? 'PENDING' : 'IDLE'}</span>
          </div>

          <div className={`sel-display ${selA ? 'pending' : 'none'}`}>
            <span>{selA ? 'PENDING · PICK SECOND NODE' : 'SELECTED'}</span>
            <span className="val">{selA || 'click a node'}</span>
          </div>

          <div className="input-row-hint">
            § 点击一节点选中，再点击另一节点以切换其间的边——已存在则删，否则则建。
          </div>

          <div className="btn-grid">
            <button className="lab-btn" onClick={() => setSelA(null)}>
              <span>取消选中</span><span className="sym">∅</span>
            </button>
            <button className="lab-btn danger" onClick={clearAll}>
              <span>清空所有边</span><span className="sym">−</span>
            </button>
          </div>

          <div style={{ height: 12 }} />

          <div className="btn-grid">
            <button className="lab-btn" onClick={connectAll}>
              <span>构造完全图 K₆</span><span className="sym">☉</span>
            </button>
            <button className="lab-btn accent" onClick={reset}>
              <span>恢复初始 RESET</span><span className="sym">↺</span>
            </button>
          </div>

          <div style={{ height: 14 }} />
          <div className="input-row-hint">
            § 无向图在邻接矩阵中对称 (aᵢⱼ = aⱼᵢ)；邻接表中每条边被记两次——各在两端各出现一次。
          </div>
        </div>

        <LogPanel log={log} onClear={clearLog} num="§2" />
      </section>

      <section className="complexity-block">
        <div className="complexity-title">
          <h3>时间复杂度 <span className="flourish">summary</span></h3>
          <span className="num">§3 · COMPLEXITY</span>
        </div>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>操作 Operation</th>
              <th>邻接矩阵 Matrix</th>
              <th>邻接表 List</th>
              <th>备注 Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>查边 (u,v) 是否存在</td>
              <td className="c-good">O(1)</td>
              <td className="c-mid">O(deg u)</td>
              <td>矩阵索引直取；链表需扫出邻接</td>
            </tr>
            <tr>
              <td>加边 / 删边</td>
              <td className="c-good">O(1)</td>
              <td className="c-mid">O(deg u)</td>
              <td>链表删除需定位</td>
            </tr>
            <tr>
              <td>枚举 u 的所有邻居</td>
              <td className="c-bad">O(V)</td>
              <td className="c-good">O(deg u)</td>
              <td>矩阵需扫整行；链表直接沿链</td>
            </tr>
            <tr>
              <td>空间占用</td>
              <td className="c-bad">O(V²)</td>
              <td className="c-good">O(V+E)</td>
              <td>稠密图矩阵更省；稀疏图链表更省</td>
            </tr>
            <tr>
              <td>遍历整图</td>
              <td className="c-bad">O(V²)</td>
              <td className="c-good">O(V+E)</td>
              <td>DFS/BFS 的基本代价</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="traits-grid">
        <div className="trait">
          <div className="trait-num">TRAIT · 01</div>
          <div className="trait-title">顶点与边</div>
          <div className="trait-desc">图 G = (V, E)。V 是顶点集，E 是边集。边可以有方向（有向图）或无方向（无向图），可以有权（带权图）或无权。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 02</div>
          <div className="trait-title">稠密 或 稀疏</div>
          <div className="trait-desc">|E| 接近 |V|² 时为稠密图，宜用矩阵；|E| 接近 |V| 时为稀疏图，宜用邻接表。表示的选择决定算法代价。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 03</div>
          <div className="trait-title">对称与非对称</div>
          <div className="trait-desc">无向图的邻接矩阵沿主对角线对称；有向图则未必。邻接表中无向图每条边记两次，有向图只记一次。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 04</div>
          <div className="trait-title">度与连通</div>
          <div className="trait-desc">顶点的度即其邻居数；度之和恒为 2|E|（握手定理）。若任两顶点间皆有路径，则称图连通——这是许多算法的前提。</div>
        </div>
      </section>
    </>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Specimen 02 · Traversal (DFS / BFS)
   ═════════════════════════════════════════════════════════════════════ */
const TRAVERSAL_GRAPH = {
  nodes: BASE_NODES,
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
  ],
};

function dfsSnapshots(adj, startId) {
  const visited = new Set();
  const order = [];
  const stack = [startId];
  const treeEdges = new Set();
  const snapshots = [];
  snapshots.push({ cur: null, stack: [...stack], visited: new Set(visited), order: [...order], treeEdges: new Set(treeEdges), parent: null });

  const parentOf = new Map();

  while (stack.length) {
    let cur = stack[stack.length - 1];
    stack.pop();
    while (cur !== undefined && visited.has(cur)) {
      cur = stack.pop();
    }
    if (cur === undefined) break;

    visited.add(cur);
    order.push(cur);
    const p = parentOf.get(cur);
    if (p !== undefined) treeEdges.add(edgeKey(p, cur));

    const nbs = [...(adj.get(cur) || [])];
    // push in reverse to visit alphabetically first
    for (let i = nbs.length - 1; i >= 0; i--) {
      const n = nbs[i];
      if (!visited.has(n.to) && !stack.includes(n.to)) {
        stack.push(n.to);
        parentOf.set(n.to, cur);
      }
    }

    snapshots.push({
      cur,
      stack: [...stack],
      visited: new Set(visited),
      order: [...order],
      treeEdges: new Set(treeEdges),
      parent: p || null,
    });
  }
  return snapshots;
}

function bfsSnapshots(adj, startId) {
  const visited = new Set([startId]);
  const order = [];
  const queue = [startId];
  const treeEdges = new Set();
  const snapshots = [];
  snapshots.push({ cur: null, queue: [...queue], visited: new Set(visited), order: [...order], treeEdges: new Set(treeEdges), parent: null });

  const parentOf = new Map();

  while (queue.length) {
    const cur = queue.shift();
    order.push(cur);
    const p = parentOf.get(cur);
    if (p !== undefined) treeEdges.add(edgeKey(p, cur));

    const nbs = [...(adj.get(cur) || [])];
    for (const n of nbs) {
      if (!visited.has(n.to)) {
        visited.add(n.to);
        queue.push(n.to);
        parentOf.set(n.to, cur);
      }
    }

    snapshots.push({
      cur,
      queue: [...queue],
      visited: new Set(visited),
      order: [...order],
      treeEdges: new Set(treeEdges),
      parent: p || null,
    });
  }
  return snapshots;
}

function TraversalModule() {
  const graph = TRAVERSAL_GRAPH;
  const adj = useMemo(() => toAdjList(graph), [graph]);

  const [mode, setMode] = useState('dfs');
  const [startId, setStartId] = useState('A');
  const [snapshots, setSnapshots] = useState([]);
  const [step, setStep] = useState(-1);
  const autoRef = useRef(null);
  const [log, pushLog, clearLog] = useLog();

  const stopAuto = () => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  };
  useEffect(() => stopAuto, []);

  const buildSnapshots = (m, s) => {
    return m === 'dfs' ? dfsSnapshots(adj, s) : bfsSnapshots(adj, s);
  };

  const reset = () => {
    stopAuto();
    setSnapshots([]);
    setStep(-1);
    pushLog(`reset · 清除遍历轨迹`, '—', 'info');
  };

  const startTraversal = () => {
    stopAuto();
    const snaps = buildSnapshots(mode, startId);
    setSnapshots(snaps);
    setStep(0);
    pushLog(
      `start · ${mode === 'dfs' ? 'DFS 深度优先' : 'BFS 广度优先'} · from ${startId}`,
      'O(V+E)',
      'info'
    );
  };

  const stepOne = () => {
    stopAuto();
    if (snapshots.length === 0) {
      startTraversal();
      return;
    }
    if (step < snapshots.length - 1) {
      const next = step + 1;
      setStep(next);
      const snap = snapshots[next];
      if (snap.cur) {
        pushLog(`visit · ${snap.cur}`, 'O(1)', 'success');
      }
    } else {
      pushLog(`step · 已至末态`, '—', 'info');
    }
  };

  const stepBack = () => {
    stopAuto();
    if (step > 0) {
      setStep(step - 1);
      pushLog(`back · 回退一步`, '—', 'info');
    }
  };

  const autoRun = () => {
    stopAuto();
    if (snapshots.length === 0) {
      const snaps = buildSnapshots(mode, startId);
      setSnapshots(snaps);
      setStep(0);
      pushLog(
        `auto · ${mode === 'dfs' ? 'DFS' : 'BFS'} from ${startId}`,
        'O(V+E)',
        'info'
      );
      // start interval using latest
      autoRef.current = setInterval(() => {
        setStep(s => {
          if (s >= snaps.length - 1) { stopAuto(); return s; }
          return s + 1;
        });
      }, 650);
      return;
    }
    pushLog(`auto · 自动播放`, '—', 'info');
    autoRef.current = setInterval(() => {
      setStep(s => {
        if (s >= snapshots.length - 1) { stopAuto(); return s; }
        return s + 1;
      });
    }, 650);
  };

  const pause = () => {
    if (autoRef.current) {
      stopAuto();
      pushLog(`pause · 暂停`, '—', 'info');
    }
  };

  const changeMode = (m) => {
    if (m === mode) return;
    setMode(m);
    stopAuto();
    setSnapshots([]);
    setStep(-1);
    pushLog(`mode · → ${m === 'dfs' ? 'DFS 深度优先' : 'BFS 广度优先'}`, '—', 'info');
  };

  const changeStart = (s) => {
    setStartId(s);
    stopAuto();
    setSnapshots([]);
    setStep(-1);
    pushLog(`start · → ${s}`, '—', 'info');
  };

  const curSnap = step >= 0 && step < snapshots.length ? snapshots[step] : null;
  const nodeStates = {};
  const edgeStates = {};
  if (curSnap) {
    // Already processed nodes (in order[])
    for (const v of curSnap.order) {
      if (v !== curSnap.cur) nodeStates[v] = 'visited';
    }
    // Pending nodes (in stack for DFS, in queue for BFS)
    const aux = mode === 'dfs' ? curSnap.stack : curSnap.queue;
    for (const v of aux) {
      if (!nodeStates[v] && v !== curSnap.cur) nodeStates[v] = 'frontier';
    }
    // Currently being processed
    if (curSnap.cur) nodeStates[curSnap.cur] = 'cur';
    // Tree edges discovered so far
    for (const k of curSnap.treeEdges) edgeStates[k] = 'tree';
  }

  const visitOrder = curSnap ? curSnap.order : [];
  const auxList = curSnap ? (mode === 'dfs' ? curSnap.stack : curSnap.queue) : [];

  const isRunning = autoRef.current !== null;
  const finished = curSnap && step === snapshots.length - 1;

  return (
    <>
      <section className="module-intro">
        <aside className="module-intro-side">
          <div><strong>SPECIMEN</strong> 02 / 03</div>
          <div><strong>MODE</strong> <span style={{color:'var(--accent)'}}>{mode.toUpperCase()}</span></div>
          <div><strong>START</strong> {startId}</div>
          <div><strong>STEP</strong> {step >= 0 ? `${step} / ${snapshots.length - 1}` : '—'}</div>
          <div><strong>VISITED</strong> {curSnap ? curSnap.visited.size : 0} / {graph.nodes.length}</div>
        </aside>
        <div className="module-intro-body">
          <p>遍历，即有序地访问图中每一节点。深度优先（DFS）一路向深，遇底方回——其本质是一个栈：新发现的顶点压栈，下一步从栈顶取出。广度优先（BFS）逐层外扩，由近至远——其本质是一个队列：先入先出，保证先访问同层之后再进入更深之层。</p>
          <p>两者同样是 O(V + E) 的代价，所得之访问序却面目不同——DFS 织出一条深向的藤蔓，BFS 铺开一张浅向的涟漪。选哪一种，取决于你想找什么：最短无权路径用 BFS，连通分量与回路检测则常用 DFS。</p>
        </div>
        <aside className="module-intro-side" style={{ textAlign: 'right' }}>
          <div><strong>AUX</strong> {mode === 'dfs' ? 'STACK' : 'QUEUE'}</div>
          <div><strong>AUX-SIZE</strong> <span style={{color:'var(--accent)'}}>{auxList.length}</span></div>
          <div><strong>CURRENT</strong> {curSnap && curSnap.cur ? curSnap.cur : '∅'}</div>
          <div><strong>TREE-EDGES</strong> {curSnap ? curSnap.treeEdges.size : 0}</div>
          <div><strong>STATUS</strong> <span style={{color: finished ? '#2B7A4B' : 'var(--accent)'}}>{finished ? 'DONE' : (curSnap ? 'STEPPING' : 'IDLE')}</span></div>
        </aside>
      </section>

      <section className="viz-panel">
        <span className="viz-corner bl" />
        <span className="viz-corner br" />
        <span className="viz-label">FIG. 02 · {mode === 'dfs' ? 'DEPTH-FIRST' : 'BREADTH-FIRST'} · FROM {startId}</span>
        <span className="viz-label-right">
          {curSnap ? `STEP ${step} / ${snapshots.length - 1}` : 'IDLE'}
        </span>

        <div className="viz-canvas-wrap">
          <div className="gr-stage">
            <GraphSvg
              nodes={graph.nodes}
              edges={graph.edges}
              nodeStates={nodeStates}
              edgeStates={edgeStates}
              startId={startId}
            />
          </div>
        </div>

        {/* Auxiliary structure (stack or queue) */}
        <div className="aux-view">
          <div className="aux-view-label">
            <span className="em">{mode === 'dfs' ? '栈 · Stack' : '队列 · Queue'}</span>
            {mode === 'dfs' ? 'LIFO' : 'FIFO'}
          </div>
          <div className="aux-items">
            {auxList.length === 0 ? (
              <span className="aux-placeholder">— 空 · empty —</span>
            ) : auxList.map((id, i) => {
              const isLast = i === auxList.length - 1;
              const isFirst = i === 0;
              return (
                <span
                  key={`${id}-${i}`}
                  className={[
                    'aux-item',
                    mode === 'dfs' && isLast ? 'top' : '',
                    mode === 'bfs' && isFirst ? 'head' : '',
                    mode === 'bfs' && isLast && auxList.length > 1 ? 'tail' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {id}
                </span>
              );
            })}
          </div>
          <div className="aux-count">
            <span className="num">{auxList.length}</span>
            {mode === 'dfs' ? 'STACKED' : 'QUEUED'}
          </div>
        </div>

        {/* Visit sequence */}
        <div className="visit-strip">
          <div className="visit-strip-title">
            <span>§ 访问序 · VISIT ORDER · <span className="em">{mode.toUpperCase()}</span></span>
            <span>{visitOrder.length} / {graph.nodes.length}</span>
          </div>
          {visitOrder.length === 0 ? (
            <div className="visit-placeholder">— 选择起点并按「开始」以启动遍历 —</div>
          ) : (
            <div className="visit-sequence">
              {visitOrder.map((id, i) => (
                <React.Fragment key={`${id}-${i}`}>
                  <span className={`visit-chip ${curSnap && curSnap.cur === id && i === visitOrder.length - 1 ? 'cur' : ''}`}>{id}</span>
                  {i < visitOrder.length - 1 && <span className="visit-sep">→</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="viz-caption">
          <span className="fig">FIG. 02</span>
          <span className="italic">朱砂色节点为"正在访问"；墨黑为"已访问"；朱砂色粗线为生成树边（发现此节点所经之边）。</span>
        </div>
      </section>

      <section className="controls-grid">
        <div className="control-block">
          <div className="control-block-title">
            <span><span className="num">§1</span> &nbsp;CONTROL</span>
            <span>{isRunning ? 'AUTO' : (curSnap ? (finished ? 'DONE' : 'PAUSED') : 'IDLE')}</span>
          </div>

          <div className="mode-pills">
            <button
              className={mode === 'dfs' ? 'active' : ''}
              onClick={() => changeMode('dfs')}
            >
              <span className="zh">深度优先</span>
              DFS · LIFO
            </button>
            <button
              className={mode === 'bfs' ? 'active' : ''}
              onClick={() => changeMode('bfs')}
            >
              <span className="zh">广度优先</span>
              BFS · FIFO
            </button>
          </div>

          <div style={{ height: 16 }} />

          <div className="input-row">
            <label>START</label>
            <select
              className="lab-select"
              value={startId}
              onChange={e => changeStart(e.target.value)}
            >
              {graph.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
              ))}
            </select>
          </div>

          <div className="btn-grid cols-4">
            <button className="lab-btn accent" onClick={stepOne} disabled={finished}>
              <span>单步</span><span className="sym">→</span>
            </button>
            <button className="lab-btn" onClick={stepBack} disabled={step <= 0}>
              <span>回退</span><span className="sym">←</span>
            </button>
            <button className="lab-btn" onClick={autoRun} disabled={finished}>
              <span>自动</span><span className="sym">▷</span>
            </button>
            <button className="lab-btn" onClick={pause} disabled={!isRunning}>
              <span>暂停</span><span className="sym">‖</span>
            </button>
          </div>

          <div style={{ height: 12 }} />
          <div className="btn-grid">
            <button className="lab-btn" onClick={() => { stopAuto(); setStep(0); pushLog('rewind · 回到开始', '—', 'info'); }} disabled={snapshots.length === 0}>
              <span>回到开始</span><span className="sym">⇤</span>
            </button>
            <button className="lab-btn" onClick={reset}>
              <span>清除 RESET</span><span className="sym">↺</span>
            </button>
          </div>

          <div style={{ height: 14 }} />
          <div className="input-row-hint">
            § 为保证演示的次序一致，邻居访问顺序按字母升序。实际实现中，访问顺序取决于邻接表的存储顺序。
          </div>
        </div>

        <LogPanel log={log} onClear={clearLog} num="§2" />
      </section>

      <section className="complexity-block">
        <div className="complexity-title">
          <h3>时间复杂度 <span className="flourish">summary</span></h3>
          <span className="num">§3 · COMPLEXITY</span>
        </div>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>操作 Operation</th>
              <th>最好 Best</th>
              <th>平均 Avg.</th>
              <th>最坏 Worst</th>
              <th>备注 Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DFS 遍历 (邻接表)</td>
              <td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td>
              <td>每顶点访问一次，每边考察两次</td>
            </tr>
            <tr>
              <td>BFS 遍历 (邻接表)</td>
              <td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td>
              <td>同上，以队列代栈</td>
            </tr>
            <tr>
              <td>DFS / BFS (邻接矩阵)</td>
              <td className="c-bad">O(V²)</td><td className="c-bad">O(V²)</td><td className="c-bad">O(V²)</td>
              <td>枚举邻居需扫整行</td>
            </tr>
            <tr>
              <td>辅助空间</td>
              <td className="c-mid">O(V)</td><td className="c-mid">O(V)</td><td className="c-mid">O(V)</td>
              <td>栈 / 队列 + 访问数组</td>
            </tr>
            <tr>
              <td>最短无权路径</td>
              <td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td><td className="c-good">O(V+E)</td>
              <td>BFS 的天然结果；DFS 不保证</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="traits-grid">
        <div className="trait">
          <div className="trait-num">TRAIT · 01</div>
          <div className="trait-title">深向 与 广向</div>
          <div className="trait-desc">DFS 一路向深，遇底回溯；BFS 逐层扩张，由近及远。一者用栈，一者用队列——结构即性格。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 02</div>
          <div className="trait-title">生成树</div>
          <div className="trait-desc">每次"第一次发现某顶点"所经之边构成一棵生成树——DFS 得深树，BFS 得层次树，各自揭示图的不同侧面。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 03</div>
          <div className="trait-title">递归或迭代</div>
          <div className="trait-desc">DFS 天然递归，调用栈即是隐含的栈；BFS 则需显式队列。对超深图，迭代 DFS 可避栈溢出。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 04</div>
          <div className="trait-title">应用殊途</div>
          <div className="trait-desc">BFS 求最短无权径、层次序；DFS 用于环检测、拓扑排序、强连通分量——两者互为补益，皆为图论之根基。</div>
        </div>
      </section>
    </>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Specimen 03 · Dijkstra's Shortest Path
   ═════════════════════════════════════════════════════════════════════ */
const DIJKSTRA_GRAPH = {
  nodes: BASE_NODES,
  edges: [
    { from: 'A', to: 'B', w: 4 },
    { from: 'A', to: 'D', w: 2 },
    { from: 'B', to: 'C', w: 3 },
    { from: 'B', to: 'D', w: 1 },
    { from: 'B', to: 'E', w: 7 },
    { from: 'C', to: 'F', w: 2 },
    { from: 'D', to: 'E', w: 5 },
    { from: 'E', to: 'F', w: 3 },
  ],
};

function dijkstraSnapshots(adj, srcId, allIds) {
  const dist = new Map(allIds.map(id => [id, Infinity]));
  const prev = new Map(allIds.map(id => [id, null]));
  const known = new Set();
  dist.set(srcId, 0);

  const snapshots = [];
  snapshots.push({
    cur: null,
    dist: new Map(dist),
    prev: new Map(prev),
    known: new Set(known),
    relaxed: [],
    picked: srcId,
    action: 'init',
  });

  while (known.size < allIds.length) {
    let cur = null;
    let minD = Infinity;
    for (const id of allIds) {
      if (!known.has(id) && dist.get(id) < minD) {
        cur = id;
        minD = dist.get(id);
      }
    }
    if (cur === null) break;

    known.add(cur);
    const relaxed = [];
    for (const n of (adj.get(cur) || [])) {
      if (known.has(n.to)) continue;
      const nd = dist.get(cur) + n.w;
      if (nd < dist.get(n.to)) {
        dist.set(n.to, nd);
        prev.set(n.to, cur);
        relaxed.push({ to: n.to, w: n.w, newDist: nd });
      }
    }

    snapshots.push({
      cur,
      dist: new Map(dist),
      prev: new Map(prev),
      known: new Set(known),
      relaxed,
      picked: cur,
      action: 'visit',
    });
  }
  return snapshots;
}

function DijkstraModule() {
  const graph = DIJKSTRA_GRAPH;
  const allIds = graph.nodes.map(n => n.id);
  const adj = useMemo(() => toAdjList(graph), [graph]);

  const [source, setSource] = useState('A');
  const [snapshots, setSnapshots] = useState([]);
  const [step, setStep] = useState(-1);
  const autoRef = useRef(null);
  const [log, pushLog, clearLog] = useLog();

  const stopAuto = () => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  };
  useEffect(() => stopAuto, []);

  const buildSnaps = (src) => dijkstraSnapshots(adj, src, allIds);

  const start = () => {
    stopAuto();
    const snaps = buildSnaps(source);
    setSnapshots(snaps);
    setStep(0);
    pushLog(`init · Dijkstra from ${source} · 初始化距离表`, 'O(V)', 'info');
  };

  const stepOne = () => {
    stopAuto();
    if (snapshots.length === 0) {
      start();
      return;
    }
    if (step < snapshots.length - 1) {
      const next = step + 1;
      setStep(next);
      const snap = snapshots[next];
      if (snap.relaxed.length > 0) {
        pushLog(
          `pick ${snap.cur} · relax [${snap.relaxed.map(r => `${r.to}=${r.newDist}`).join(', ')}]`,
          'O(deg)',
          'success'
        );
      } else if (snap.cur) {
        pushLog(`pick ${snap.cur} · 无可松弛的邻接`, 'O(deg)', 'info');
      }
    } else {
      pushLog(`step · 已至末态`, '—', 'info');
    }
  };

  const stepBack = () => {
    stopAuto();
    if (step > 0) {
      setStep(step - 1);
      pushLog(`back · 回退一步`, '—', 'info');
    }
  };

  const autoRun = () => {
    stopAuto();
    let snaps = snapshots;
    if (snaps.length === 0) {
      snaps = buildSnaps(source);
      setSnapshots(snaps);
      setStep(0);
      pushLog(`auto · Dijkstra from ${source}`, '—', 'info');
    } else {
      pushLog(`auto · 自动播放`, '—', 'info');
    }
    autoRef.current = setInterval(() => {
      setStep(s => {
        if (s >= snaps.length - 1) { stopAuto(); return s; }
        return s + 1;
      });
    }, 900);
  };

  const pause = () => {
    if (autoRef.current) { stopAuto(); pushLog(`pause · 暂停`, '—', 'info'); }
  };

  const reset = () => {
    stopAuto();
    setSnapshots([]);
    setStep(-1);
    pushLog(`reset · 清除运行状态`, '—', 'info');
  };

  const changeSource = (s) => {
    setSource(s);
    stopAuto();
    setSnapshots([]);
    setStep(-1);
    pushLog(`source · → ${s}`, '—', 'info');
  };

  const curSnap = step >= 0 && step < snapshots.length ? snapshots[step] : null;
  const isRunning = autoRef.current !== null;
  const finished = curSnap && step === snapshots.length - 1;

  const nodeStates = {};
  const edgeStates = {};
  if (curSnap) {
    for (const id of curSnap.known) nodeStates[id] = 'known';
    if (curSnap.cur && curSnap.action !== 'init') nodeStates[curSnap.cur] = 'cur';
    // frontier: unknown with finite distance
    for (const id of allIds) {
      if (!curSnap.known.has(id) && curSnap.dist.get(id) !== Infinity) {
        if (nodeStates[id] !== 'cur') nodeStates[id] = 'frontier';
      }
    }
    // shortest-path tree edges: edges (prev[v], v) for v whose prev is set
    for (const id of allIds) {
      const p = curSnap.prev.get(id);
      if (p) edgeStates[edgeKey(p, id)] = 'tree';
    }
    // edges just relaxed in this step: mark as 'relaxed'
    for (const r of curSnap.relaxed) {
      if (curSnap.cur) edgeStates[edgeKey(curSnap.cur, r.to)] = 'relaxed';
    }
  } else {
    // Before starting, nothing highlighted
  }

  const distMap = curSnap ? curSnap.dist : null;

  return (
    <>
      <section className="module-intro">
        <aside className="module-intro-side">
          <div><strong>SPECIMEN</strong> 03 / 03</div>
          <div><strong>ALGORITHM</strong> <span style={{color:'var(--accent)'}}>DIJKSTRA</span></div>
          <div><strong>SOURCE</strong> {source}</div>
          <div><strong>|V|·|E|</strong> {graph.nodes.length}·{graph.edges.length}</div>
          <div><strong>STEP</strong> {step >= 0 ? `${step} / ${snapshots.length - 1}` : '—'}</div>
        </aside>
        <div className="module-intro-body">
          <p>最短路径——给一张带权图与一个源点 s，求 s 到每一其他顶点的最短距离。Dijkstra 之法极其精巧：维持一个"已知"集合，从未知之中取出当前距离最小的顶点，将其纳入已知，并以其为跳板松弛其邻居的距离。如此往复，直至所有顶点皆被纳入。</p>
          <p>它的正确性仰仗一个条件——边权非负。一旦权可为负，那"贪心"便不再成立，须改用 Bellman-Ford 等算法。但在多数实际应用中（如地图、网络延迟），边权天然非负，Dijkstra 便是利器。</p>
        </div>
        <aside className="module-intro-side" style={{ textAlign: 'right' }}>
          <div><strong>KNOWN</strong> <span style={{color:'var(--accent)'}}>{curSnap ? curSnap.known.size : 0}</span> / {allIds.length}</div>
          <div><strong>CURRENT</strong> {curSnap && curSnap.cur ? curSnap.cur : '∅'}</div>
          <div><strong>RELAXED</strong> {curSnap ? curSnap.relaxed.length : 0}</div>
          <div><strong>STATUS</strong> <span style={{color: finished ? '#2B7A4B' : 'var(--accent)'}}>{finished ? 'DONE' : (curSnap ? 'STEPPING' : 'IDLE')}</span></div>
          <div><strong>MAX-DIST</strong> {curSnap ? (() => {
            let m = 0;
            for (const v of curSnap.dist.values()) { if (v !== Infinity && v > m) m = v; }
            return m || '—';
          })() : '—'}</div>
        </aside>
      </section>

      <section className="viz-panel">
        <span className="viz-corner bl" />
        <span className="viz-corner br" />
        <span className="viz-label">FIG. 03 · DIJKSTRA · FROM {source}</span>
        <span className="viz-label-right">
          {curSnap ? (finished ? 'OPTIMAL' : `PICKED: ${curSnap.cur}`) : 'IDLE'}
        </span>

        <div className="viz-canvas-wrap" style={{ paddingTop: 40 }}>
          <div className="gr-stage">
            <GraphSvg
              nodes={graph.nodes}
              edges={graph.edges}
              nodeStates={nodeStates}
              edgeStates={edgeStates}
              weights={true}
              startId={source}
              distMap={distMap}
            />
          </div>
        </div>

        {/* Distance Table */}
        <div className="dist-table">
          <div className="dist-table-title">
            <span><span className="num">§</span> 距离表 · DISTANCE TABLE</span>
            <span className="status">
              {finished ? <span className="done">OPTIMAL · WPL fixed</span> : (curSnap ? `STEP ${step}` : 'NOT STARTED')}
            </span>
          </div>
          <div className="dist-table-grid">
            <div className="dist-table-row header" style={{ gridTemplateColumns: `140px repeat(${allIds.length}, 1fr)` }}>
              <div className="dist-cell label">NODE</div>
              {allIds.map(id => (
                <div key={id} className="dist-cell">{id}</div>
              ))}
            </div>
            <div className="dist-table-row dist-body" style={{ gridTemplateColumns: `140px repeat(${allIds.length}, 1fr)` }}>
              <div className="dist-cell label">DIST from {source}</div>
              {allIds.map(id => {
                const d = curSnap ? curSnap.dist.get(id) : Infinity;
                const inf = d === Infinity;
                const isKnown = curSnap && curSnap.known.has(id);
                const isCur = curSnap && curSnap.cur === id;
                const isFrontier = curSnap && !isKnown && !inf;
                const wasRelaxed = curSnap && curSnap.relaxed.some(r => r.to === id);
                const cls = [
                  'val',
                  inf ? 'inf' : '',
                  isKnown ? 'known' : '',
                  isCur && !isKnown ? 'cur' : '',
                  !isCur && !isKnown && isFrontier ? 'frontier' : '',
                  wasRelaxed ? 'updated' : '',
                ].filter(Boolean).join(' ');
                return (
                  <div key={id} className={`dist-cell ${cls}`}>
                    {inf ? '∞' : d}
                  </div>
                );
              })}
            </div>
            <div className="dist-table-row dist-body" style={{ gridTemplateColumns: `140px repeat(${allIds.length}, 1fr)` }}>
              <div className="dist-cell label">PREV</div>
              {allIds.map(id => {
                const p = curSnap ? curSnap.prev.get(id) : null;
                return (
                  <div key={id} className="dist-cell prev">
                    {p ? <span className="v">{p}</span> : '—'}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="dijk-legend">
            <span className="key"><span className="sw known" /> 已知 known</span>
            <span className="key"><span className="sw cur" /> 本步所选 current</span>
            <span className="key"><span className="sw front" /> 可达未定 frontier</span>
            <span className="key"><span className="sw far" /> 尚不可达 ∞</span>
          </div>
        </div>

        <div className="viz-caption">
          <span className="fig">FIG. 03</span>
          <span className="italic">每节点上方小框内的数字为目前已知的最短距离；朱砂色粗线即最短路径树；虚线则为此步刚被松弛的边。</span>
        </div>
      </section>

      <section className="controls-grid">
        <div className="control-block">
          <div className="control-block-title">
            <span><span className="num">§1</span> &nbsp;CONTROL</span>
            <span>{isRunning ? 'AUTO' : (curSnap ? (finished ? 'DONE' : 'PAUSED') : 'IDLE')}</span>
          </div>

          <div className="input-row">
            <label>SOURCE</label>
            <select
              className="lab-select"
              value={source}
              onChange={e => changeSource(e.target.value)}
            >
              {allIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="btn-grid cols-4">
            <button className="lab-btn accent" onClick={stepOne} disabled={finished}>
              <span>单步</span><span className="sym">→</span>
            </button>
            <button className="lab-btn" onClick={stepBack} disabled={step <= 0}>
              <span>回退</span><span className="sym">←</span>
            </button>
            <button className="lab-btn" onClick={autoRun} disabled={finished}>
              <span>自动</span><span className="sym">▷</span>
            </button>
            <button className="lab-btn" onClick={pause} disabled={!isRunning}>
              <span>暂停</span><span className="sym">‖</span>
            </button>
          </div>

          <div style={{ height: 12 }} />

          <div className="btn-grid">
            <button className="lab-btn" onClick={() => { stopAuto(); setStep(0); pushLog('rewind · 回到开始', '—', 'info'); }} disabled={snapshots.length === 0}>
              <span>回到开始</span><span className="sym">⇤</span>
            </button>
            <button className="lab-btn" onClick={reset}>
              <span>清除 RESET</span><span className="sym">↺</span>
            </button>
          </div>

          <div style={{ height: 14 }} />
          <div className="input-row-hint">
            § Dijkstra 每轮从未知集中取距离最小的顶点纳入已知，然后以它为中介松弛邻居——"若经过它更近，则更新"。
            <br />
            <br />
            § 本图 8 条边皆有权，最终距离表收敛后所得即从源点出发的最短距离全集。
          </div>
        </div>

        <LogPanel log={log} onClear={clearLog} num="§2" />
      </section>

      <section className="complexity-block">
        <div className="complexity-title">
          <h3>时间复杂度 <span className="flourish">summary</span></h3>
          <span className="num">§3 · COMPLEXITY</span>
        </div>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>实现方式 Implementation</th>
              <th>取最小 Extract-Min</th>
              <th>松弛 Relax</th>
              <th>总代价 Total</th>
              <th>备注 Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>朴素数组扫描</td>
              <td className="c-bad">O(V)</td>
              <td className="c-good">O(1)</td>
              <td className="c-bad">O(V²)</td>
              <td>稠密图最优实现</td>
            </tr>
            <tr>
              <td>二叉堆 (Binary Heap)</td>
              <td className="c-good">O(log V)</td>
              <td className="c-good">O(log V)</td>
              <td className="c-mid">O((V+E) log V)</td>
              <td>稀疏图最常用</td>
            </tr>
            <tr>
              <td>斐波那契堆</td>
              <td className="c-good">O(log V)</td>
              <td className="c-good">O(1) 平摊</td>
              <td className="c-good">O(V log V + E)</td>
              <td>理论最优，常数较大</td>
            </tr>
            <tr>
              <td>空间占用</td>
              <td colSpan={3} className="c-mid" style={{ textAlign: 'center' }}>O(V)</td>
              <td>距离数组 + 前驱数组 + 已知集合</td>
            </tr>
            <tr>
              <td>前置条件</td>
              <td colSpan={3} className="c-bad" style={{ textAlign: 'center' }}>边权非负</td>
              <td>负权需 Bellman-Ford 或 SPFA</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="traits-grid">
        <div className="trait">
          <div className="trait-num">TRAIT · 01</div>
          <div className="trait-title">贪心可行</div>
          <div className="trait-desc">每轮取当前距离最小的未知顶点纳入已知——这一贪心选择之所以正确，全赖"边权非负"这一前提。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 02</div>
          <div className="trait-title">松弛操作</div>
          <div className="trait-desc">以选中顶点为中介重算邻居的距离：若 d(u) + w(u,v) &lt; d(v)，则更新之——松弛是 Dijkstra 的核心动作。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 03</div>
          <div className="trait-title">前驱记录</div>
          <div className="trait-desc">每次松弛时记下 v 的前驱，使得算法结束后不仅知道"最短有多远"，还能回溯出完整的最短路径。</div>
        </div>
        <div className="trait">
          <div className="trait-num">TRAIT · 04</div>
          <div className="trait-title">单源单对比较</div>
          <div className="trait-desc">Dijkstra 求"单源"最短路径；若求所有对之间的最短路径，则用 Floyd-Warshall——三重循环，O(V³)。</div>
        </div>
      </section>
    </>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   Root
   ═════════════════════════════════════════════════════════════════════ */
export default function GraphStructuresLab() {
  const [tab, setTab] = useState('storage');

  const tabCN = tab === 'storage' ? '存储' : tab === 'traversal' ? '遍历' : '最短路径';

  return (
    <>
      <style>{STYLES}</style>
      <div className="lab-root">
        <header className="lab-header">
          <div className="lab-header-top">
            <div className="lab-volume">
              <span className="caps">VOL. 04</span>
              <span className="caps">图 / GRAPHS</span>
            </div>
            <div className="caps">A SPECIMEN STUDY / 2026</div>
          </div>

          <div className="lab-title-block">
            <h1 className="lab-title">
              脉络之网 与 <span className="em">径路之长</span>
            </h1>
            <div className="lab-subtitle">
              <span className="dot" />
              <span>DATA STRUCTURE LABORATORY</span>
              <span>·</span>
              <span>INTERACTIVE SPECIMENS</span>
              <span>·</span>
              <span className="italic serif" style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                in webs &amp; their shortest paths
              </span>
            </div>
          </div>

          <div className="lab-header-bottom">
            <span>§ 本卷 · 存储 · 遍历 · 最短路径</span>
            <span>无向带权 / 六节点之图</span>
            <span>点选 · 迭代 · 观察松弛</span>
          </div>
        </header>

        <main className="lab-container">
          <nav className="lab-tabs">
            <button
              className={`lab-tab ${tab === 'storage' ? 'active' : ''}`}
              onClick={() => setTab('storage')}
            >
              <span className="lab-tab-num">SPECIMEN · 01</span>
              <span className="lab-tab-name">
                存储
                <span className="lab-tab-name-en">Representation</span>
              </span>
            </button>
            <button
              className={`lab-tab ${tab === 'traversal' ? 'active' : ''}`}
              onClick={() => setTab('traversal')}
            >
              <span className="lab-tab-num">SPECIMEN · 02</span>
              <span className="lab-tab-name">
                遍历
                <span className="lab-tab-name-en">Traversal</span>
              </span>
            </button>
            <button
              className={`lab-tab ${tab === 'dijkstra' ? 'active' : ''}`}
              onClick={() => setTab('dijkstra')}
            >
              <span className="lab-tab-num">SPECIMEN · 03</span>
              <span className="lab-tab-name">
                最短路径
                <span className="lab-tab-name-en">Shortest Path</span>
              </span>
            </button>
          </nav>

          {tab === 'storage'   && <StorageModule />}
          {tab === 'traversal' && <TraversalModule />}
          {tab === 'dijkstra'  && <DijkstraModule />}

          <footer className="lab-footer">
            <span>© DATA STRUCTURE LAB</span>
            <span className="flourish serif italic" style={{ fontSize: 13, letterSpacing: 0, textTransform: 'none' }}>
              fin · {tabCN}
            </span>
            <span>PLATE {tab === 'storage' ? '01' : tab === 'traversal' ? '02' : '03'} / 03</span>
          </footer>
        </main>
      </div>
    </>
  );
}
