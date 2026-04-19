import React, { useState, useEffect, useRef } from "react";

// ===== Design Tokens =====
const C = {
  bg: "#0b0e17",
  bgAlt: "#131827",
  bgCard: "#19203450",
  line: "#2a3449",
  lineStrong: "#3a4669",
  text: "#f2e8d0",
  textDim: "#a0a8c0",
  textMute: "#6b7590",
  cisc: "#e8733c",        // warm amber - heavy, complex
  ciscSoft: "#e8733c22",
  ciscEdge: "#e8733c66",
  risc: "#6bd4c4",        // cool mint - clean, streamlined
  riscSoft: "#6bd4c422",
  riscEdge: "#6bd4c466",
  gold: "#d4a949",
  red: "#c8523d",
};

const fonts = {
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  display: "'Space Grotesk', 'IBM Plex Sans', sans-serif",
  body: "'IBM Plex Sans', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  serif: "'DM Serif Display', 'Noto Serif SC', serif",
};

// ===== Reusable Bits =====
const MonoLabel = ({ children, color = C.textMute, size = 11 }) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: size,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </span>
);

const Corner = ({ x, y, color = C.lineStrong }) => (
  <div
    style={{
      position: "absolute",
      width: 10,
      height: 10,
      borderColor: color,
      borderStyle: "solid",
      borderWidth: 0,
      ...(x === "l" ? { left: -1, borderLeftWidth: 1 } : { right: -1, borderRightWidth: 1 }),
      ...(y === "t" ? { top: -1, borderTopWidth: 1 } : { bottom: -1, borderBottomWidth: 1 }),
    }}
  />
);

const TechBox = ({ children, style, accent = C.lineStrong }) => (
  <div style={{ position: "relative", ...style }}>
    <Corner x="l" y="t" color={accent} />
    <Corner x="r" y="t" color={accent} />
    <Corner x="l" y="b" color={accent} />
    <Corner x="r" y="b" color={accent} />
    {children}
  </div>
);

// ===== Section: Hero =====
const Hero = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")} UTC`
      );
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "32px 48px 64px",
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      {/* grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
        <MonoLabel color={C.textDim}>DOC / 001 · COMPUTER ARCHITECTURE</MonoLabel>
        <div style={{ display: "flex", gap: 28 }}>
          <MonoLabel color={C.textMute}>REV 2026.04</MonoLabel>
          <MonoLabel color={C.gold}>● {time}</MonoLabel>
        </div>
      </div>

      {/* main content */}
      <div style={{ position: "relative", zIndex: 2, marginTop: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <div style={{ width: 80, height: 1, background: C.lineStrong }} />
          <MonoLabel color={C.textDim}>指令集架构之争 · INSTRUCTION SET ARCHITECTURE</MonoLabel>
        </div>

        <h1
          style={{
            fontFamily: fonts.mono,
            fontSize: "clamp(72px, 13vw, 220px)",
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            margin: 0,
            color: C.text,
          }}
        >
          <span style={{ color: C.cisc }}>CISC</span>
          <span style={{ color: C.textMute, opacity: 0.4 }}> · </span>
          <span style={{ color: C.risc }}>RISC</span>
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 80,
            marginTop: 64,
            alignItems: "end",
          }}
        >
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(22px, 2.2vw, 32px)",
              lineHeight: 1.35,
              color: C.text,
              margin: 0,
              maxWidth: 780,
            }}
          >
            两种哲学，塑造了六十年的计算世界——
            一个追求<span style={{ color: C.cisc, fontStyle: "italic" }}> 以繁化简 </span>的硬件智慧，
            一个信仰<span style={{ color: C.risc, fontStyle: "italic" }}> 以简制胜 </span>的架构美学。
          </p>
          <div style={{ fontFamily: fonts.body, color: C.textDim, fontSize: 14, lineHeight: 1.7 }}>
            <MonoLabel color={C.gold}>摘要 · ABSTRACT</MonoLabel>
            <p style={{ marginTop: 12 }}>
              本文档对比复杂指令集（Complex Instruction Set Computing）与精简指令集（Reduced Instruction Set Computing）的设计哲学、技术特征、历史演进及代表产品，揭示从 IBM System/360 到 Apple M 系列、RISC-V 崛起的架构演化逻辑。
            </p>
          </div>
        </div>
      </div>

      {/* bottom markers */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <MonoLabel color={C.textMute}>↓ 向下滚动 / SCROLL</MonoLabel>
        <MonoLabel color={C.textMute}>§ 0.0 — INTRO</MonoLabel>
      </div>
    </section>
  );
};

// ===== Section: Philosophy (Two Worlds) =====
const Philosophy = () => {
  const ciscTraits = [
    { k: "指令数量", v: "多（数百至上千）" },
    { k: "指令长度", v: "可变（1–15 字节）" },
    { k: "执行周期", v: "不定（1–多个时钟）" },
    { k: "译码难度", v: "高，需微码" },
    { k: "寻址模式", v: "丰富（十余种）" },
    { k: "代码密度", v: "高" },
    { k: "典型口号", v: "'让硬件替程序员做更多事'" },
  ];
  const riscTraits = [
    { k: "指令数量", v: "少（数十至百余）" },
    { k: "指令长度", v: "固定（通常 32 bit）" },
    { k: "执行周期", v: "基本 1 周期/条" },
    { k: "译码难度", v: "低，硬连线实现" },
    { k: "寻址模式", v: "精简（Load/Store 架构）" },
    { k: "代码密度", v: "相对较低" },
    { k: "典型口号", v: "'让简单的指令跑得飞快'" },
  ];

  const Col = ({ title, subtitle, traits, color, edge, soft, num }) => (
    <div
      style={{
        border: `1px solid ${C.line}`,
        background: `linear-gradient(180deg, ${soft} 0%, transparent 60%)`,
        padding: "40px 36px 36px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
        <MonoLabel color={color}>{num}</MonoLabel>
        <MonoLabel color={C.textMute}>{title.split(" ")[0]}</MonoLabel>
      </div>
      <h3
        style={{
          fontFamily: fonts.mono,
          fontSize: 56,
          fontWeight: 700,
          margin: 0,
          color: color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: fonts.serif,
          fontSize: 22,
          color: C.text,
          marginTop: 16,
          marginBottom: 36,
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>

      <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 20 }}>
        {traits.map((t, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              padding: "12px 0",
              borderBottom: i < traits.length - 1 ? `1px dashed ${C.line}` : "none",
              fontSize: 14,
              fontFamily: fonts.body,
            }}
          >
            <span style={{ color: C.textDim, fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.08em" }}>
              {t.k.toUpperCase()}
            </span>
            <span style={{ color: C.text }}>{t.v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.line}`, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
        <MonoLabel color={C.gold}>§ 1.0</MonoLabel>
        <MonoLabel color={C.textDim}>两种哲学 / TWO PHILOSOPHIES</MonoLabel>
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: "clamp(40px, 5vw, 68px)",
          fontWeight: 600,
          color: C.text,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          maxWidth: 1000,
          lineHeight: 1.05,
        }}
      >
        同一个问题，两种<span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: C.gold }}>截然相反</span>的答案。
      </h2>
      <p style={{ fontFamily: fonts.body, color: C.textDim, fontSize: 16, maxWidth: 720, lineHeight: 1.7, marginBottom: 64 }}>
        当程序员写下一行代码、编译器翻译为机器指令、CPU 逐条执行——
        指令集架构（ISA）就是硬件与软件的边界条约。它决定了 CPU 能听懂什么语言，也决定了这门语言是繁是简。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Col
          num="ISA-01"
          title="CISC"
          subtitle="复杂指令集 · Complex Instruction Set Computing"
          traits={ciscTraits}
          color={C.cisc}
          edge={C.ciscEdge}
          soft={C.ciscSoft}
        />
        <Col
          num="ISA-02"
          title="RISC"
          subtitle="精简指令集 · Reduced Instruction Set Computing"
          traits={riscTraits}
          color={C.risc}
          edge={C.riscEdge}
          soft={C.riscSoft}
        />
      </div>
    </section>
  );
};

// ===== Section: Execution Demo =====
const ExecutionDemo = () => {
  const [running, setRunning] = useState(false);
  const [ciscStep, setCiscStep] = useState(0);
  const [riscStep, setRiscStep] = useState(0);

  const ciscProgram = [
    { asm: "MULT [addr1], [addr2], [addr3]", note: "单条指令：读两地址 → 相乘 → 写回地址", cycles: "≈ 8–10 周期" },
  ];
  const riscProgram = [
    { asm: "LOAD  R1, [addr1]", note: "从内存取值到寄存器 R1", cycles: "1 周期" },
    { asm: "LOAD  R2, [addr2]", note: "从内存取值到寄存器 R2", cycles: "1 周期" },
    { asm: "MUL   R3, R1, R2", note: "寄存器之间相乘", cycles: "1 周期" },
    { asm: "STORE [addr3], R3", note: "写回内存", cycles: "1 周期" },
  ];

  const run = () => {
    if (running) return;
    setRunning(true);
    setCiscStep(0);
    setRiscStep(0);
    let c = 0;
    let r = 0;
    const ciscInterval = setInterval(() => {
      c++;
      setCiscStep(c);
      if (c >= ciscProgram.length) clearInterval(ciscInterval);
    }, 1600);
    const riscInterval = setInterval(() => {
      r++;
      setRiscStep(r);
      if (r >= riscProgram.length) {
        clearInterval(riscInterval);
        setTimeout(() => setRunning(false), 800);
      }
    }, 500);
  };

  const Trace = ({ title, color, soft, program, step, label }) => (
    <div
      style={{
        border: `1px solid ${C.line}`,
        padding: "28px 28px 32px",
        background: C.bgAlt,
        position: "relative",
        minHeight: 360,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: color }} />
          <MonoLabel color={color} size={12}>{title}</MonoLabel>
        </div>
        <MonoLabel color={C.textMute}>{label}</MonoLabel>
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 13 }}>
        {program.map((line, i) => {
          const active = i < step;
          const current = i === step - 1 && running;
          return (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                marginBottom: 10,
                border: `1px solid ${active ? color : C.line}`,
                background: active ? soft : "transparent",
                transition: "all 0.3s ease",
                opacity: active || !running ? 1 : 0.4,
                transform: current ? "translateX(6px)" : "translateX(0)",
              }}
            >
              <div style={{ color: active ? C.text : C.textDim, fontWeight: 600, marginBottom: 4 }}>
                {active ? "► " : "  "}{line.asm}
              </div>
              <div style={{ color: C.textMute, fontSize: 11, letterSpacing: "0.04em" }}>
                {line.note} <span style={{ color: color }}>· {line.cycles}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.line}`, background: C.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
        <MonoLabel color={C.gold}>§ 2.0</MonoLabel>
        <MonoLabel color={C.textDim}>执行对比 / EXECUTION TRACE</MonoLabel>
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 32 }}>
        <div>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 600,
              color: C.text,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            同一个任务：<br />
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: C.gold }}>两个整数相乘并写回</span>
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: fonts.body, color: C.textDim, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            CISC 用一条强大的 <code style={{ fontFamily: fonts.mono, color: C.cisc }}>MULT</code> 指令搞定——但这条指令内部要执行多步微操作，耗费多个时钟周期。
            RISC 把同样的工作拆成 4 条简单指令——每条都在一个时钟周期内完成，更适合流水线。
          </p>
          <button
            onClick={run}
            disabled={running}
            style={{
              fontFamily: fonts.mono,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "14px 28px",
              background: running ? C.line : C.text,
              color: running ? C.textMute : C.bg,
              border: "none",
              cursor: running ? "wait" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {running ? "● 执行中..." : "► 运行对比"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Trace title="CISC · 1 条指令" color={C.cisc} soft={C.ciscSoft} program={ciscProgram} step={ciscStep} label="SINGLE MICROCODED OP" />
        <Trace title="RISC · 4 条指令" color={C.risc} soft={C.riscSoft} program={riscProgram} step={riscStep} label="PIPELINED SEQUENCE" />
      </div>

      <div
        style={{
          marginTop: 40,
          padding: "20px 24px",
          border: `1px dashed ${C.line}`,
          fontFamily: fonts.body,
          fontSize: 13,
          color: C.textDim,
          lineHeight: 1.7,
        }}
      >
        <MonoLabel color={C.gold}>观察</MonoLabel>
        <p style={{ margin: "8px 0 0" }}>
          表面上 CISC 代码更短、更优雅；但 RISC 的每条指令都等长、规整，编译器、流水线、超标量调度都更容易优化。
          当 CPU 主频从 MHz 飞升到 GHz、从单发射进化到乱序超标量后，RISC 的结构优势开始主导高性能计算。
        </p>
      </div>
    </section>
  );
};

// ===== Section: Timeline =====
const Timeline = () => {
  const events = [
    { year: "1964", side: "cisc", title: "IBM System/360", desc: "统一指令集的开山之作。IBM 斥资 50 亿美元，让软件可跨机型运行，定义了'架构'概念本身。", tag: "大型机 · 复杂指令" },
    { year: "1971", side: "cisc", title: "Intel 4004", desc: "世界第一款商用微处理器，4 位架构，2300 个晶体管，为微型计算机时代奠基。", tag: "4-bit · 微处理器" },
    { year: "1975", side: "cisc", title: "MOS 6502 · Intel 8080", desc: "8 位微处理器普及，Apple II、Commodore、Atari 采用 6502；Zilog Z80 与 Intel 8080 统治 CP/M 时代。", tag: "8-bit 时代" },
    { year: "1978", side: "cisc", title: "Intel 8086 · x86 诞生", desc: "16 位处理器开启 x86 王朝。IBM PC 于 1981 年采用其精简版 8088，彻底改写计算机产业。", tag: "x86 元年" },
    { year: "1980", side: "risc", title: "Patterson 提出 RISC", desc: "UC Berkeley 的 David Patterson 与同事首次提出 RISC 理念，启动 Berkeley RISC 项目，用简单指令追求高吞吐。", tag: "RISC 理论诞生" },
    { year: "1981", side: "risc", title: "Stanford MIPS 项目", desc: "John Hennessy 在斯坦福启动 MIPS 项目（Microprocessor without Interlocked Pipeline Stages），强调编译器+流水线协同。", tag: "MIPS 启动" },
    { year: "1985", side: "risc", title: "ARM1 诞生", desc: "英国 Acorn 计算机公司推出 ARM1——Acorn RISC Machine。这颗为 BBC Micro 下一代设计的芯片，后来将席卷全世界。", tag: "ARM 初世代" },
    { year: "1986", side: "risc", title: "MIPS R2000", desc: "首款商用 RISC 处理器之一，被 SGI 工作站、任天堂 N64、PS1 采用。", tag: "商业化落地" },
    { year: "1987", side: "risc", title: "SPARC 发布", desc: "Sun Microsystems 推出 SPARC 架构，基于 Berkeley RISC-II，成为工作站/服务器主力。", tag: "Sun · 工作站" },
    { year: "1991", side: "risc", title: "PowerPC 联盟", desc: "Apple + IBM + Motorola 结盟推出 PowerPC，用于 Mac（1994–2006）、游戏主机、嵌入式系统。", tag: "AIM 联盟" },
    { year: "1993", side: "both", title: "Intel Pentium", desc: "x86 暗中'RISC 化'。内部将复杂指令翻译为类 RISC 微操作（μops），兼顾兼容性与性能——这个设计沿用至今。", tag: "CISC 外壳 / RISC 内核" },
    { year: "2007", side: "risc", title: "iPhone + ARM", desc: "初代 iPhone 搭载 ARM 核心（三星 S5L8900）。移动互联网爆发，ARM 悄然成为出货量最大的 CPU 架构。", tag: "移动革命" },
    { year: "2010", side: "risc", title: "RISC-V 诞生", desc: "UC Berkeley 推出开源指令集 RISC-V，由 Krste Asanović、David Patterson 主导。任何人可免费设计芯片，无授权费。", tag: "开源 ISA" },
    { year: "2020", side: "risc", title: "Apple M1", desc: "Apple 抛弃 Intel，自研基于 ARM 的 M1 芯片登陆 Mac。单线程性能、能效比全面超越 x86，重塑 PC 格局。", tag: "ARM 攻入桌面" },
    { year: "2024", side: "both", title: "x86 Ecosystem 联盟", desc: "Intel 与 AMD 联合成立 x86 生态咨询组，应对 ARM 与 RISC-V 的双面夹击。", tag: "防守反击" },
    { year: "2026", side: "risc", title: "RISC-V 全面开花", desc: "RISC-V International 成员超 4000 家；阿里玄铁、SiFive、Tenstorrent 大规模商用；欧盟、印度将其列为战略架构。", tag: "当前格局" },
  ];

  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.line}`, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
        <MonoLabel color={C.gold}>§ 3.0</MonoLabel>
        <MonoLabel color={C.textDim}>演进时间线 / TIMELINE</MonoLabel>
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>

      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: "clamp(40px, 5vw, 68px)",
          fontWeight: 600,
          color: C.text,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        六十二年的<span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: C.gold }}>架构长河</span>
      </h2>
      <p style={{ fontFamily: fonts.body, color: C.textDim, fontSize: 16, maxWidth: 720, lineHeight: 1.7, marginBottom: 72 }}>
        从 1964 年 IBM 的统一架构构想，到 2026 年 RISC-V 的开源浪潮——CISC 与 RISC 的边界从未截然分开，它们互相借鉴、彼此渗透，共同推动着计算从房间大小的机器走进每个人的口袋。
      </p>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* central line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(180deg, transparent, ${C.lineStrong} 10%, ${C.lineStrong} 90%, transparent)`,
          }}
        />
        {events.map((e, i) => {
          const isLeft = e.side === "cisc" || (e.side === "both" && i % 2 === 0);
          const color = e.side === "cisc" ? C.cisc : e.side === "risc" ? C.risc : C.gold;
          const soft = e.side === "cisc" ? C.ciscSoft : e.side === "risc" ? C.riscSoft : "#d4a94922";
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 1fr",
                gap: 0,
                marginBottom: 48,
                alignItems: "start",
              }}
            >
              {/* Left */}
              <div style={{ paddingRight: 40, textAlign: "right" }}>
                {isLeft && <EventCard e={e} color={color} soft={soft} align="right" />}
              </div>
              {/* Center node */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    color: color,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                    background: C.bg,
                    padding: "4px 8px",
                  }}
                >
                  {e.year}
                </div>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: color,
                    border: `2px solid ${C.bg}`,
                    transform: "rotate(45deg)",
                    boxShadow: `0 0 0 2px ${color}`,
                  }}
                />
              </div>
              {/* Right */}
              <div style={{ paddingLeft: 40 }}>
                {!isLeft && <EventCard e={e} color={color} soft={soft} align="left" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EventCard = ({ e, color, soft, align }) => (
  <div
    style={{
      display: "inline-block",
      maxWidth: 460,
      padding: "18px 22px",
      border: `1px solid ${C.line}`,
      background: `linear-gradient(${align === "right" ? "270deg" : "90deg"}, ${soft} 0%, ${C.bgAlt} 100%)`,
      textAlign: align === "right" ? "right" : "left",
      position: "relative",
    }}
  >
    <MonoLabel color={color} size={10}>{e.tag}</MonoLabel>
    <h4
      style={{
        fontFamily: fonts.display,
        fontSize: 22,
        fontWeight: 600,
        color: C.text,
        margin: "8px 0 8px",
        letterSpacing: "-0.01em",
      }}
    >
      {e.title}
    </h4>
    <p style={{ fontFamily: fonts.body, fontSize: 13.5, color: C.textDim, lineHeight: 1.65, margin: 0 }}>
      {e.desc}
    </p>
  </div>
);

// ===== Section: Products Gallery =====
const Products = () => {
  const [tab, setTab] = useState("cisc");

  const ciscProducts = [
    { name: "Intel 8086", year: 1978, desc: "16 位处理器，x86 架构的起点。29,000 晶体管 · 5–10 MHz。", tag: "x86" },
    { name: "Intel Pentium 4", year: 2000, desc: "NetBurst 架构，深度流水线，主频竞赛的标志。最高 3.8 GHz。", tag: "x86" },
    { name: "Intel Core i9-14900K", year: 2023, desc: "24 核混合架构，6.0 GHz 睿频。x86 性能旗舰。", tag: "x86-64" },
    { name: "AMD Ryzen 9 7950X3D", year: 2023, desc: "Zen 4 架构 + 3D V-Cache，游戏与生产力通吃。", tag: "x86-64" },
    { name: "IBM System/360", year: 1964, desc: "首款定义'指令集架构'的大型机家族，CISC 的奠基者。", tag: "Mainframe" },
    { name: "DEC VAX-11/780", year: 1977, desc: "经典 CISC 教科书处理器，指令丰富、寻址模式多达 20 种。", tag: "Minicomputer" },
    { name: "Motorola 68000", year: 1979, desc: "32 位 CISC，驱动初代 Macintosh、Amiga、Sega Genesis。", tag: "68k" },
    { name: "Zilog Z80", year: 1976, desc: "8 位 CISC 经典，至今仍用于嵌入式、计算器、复古设备。", tag: "8-bit" },
  ];

  const riscProducts = [
    { name: "Apple M1 / M2 / M3 / M4", year: "2020–", desc: "ARM 架构自研 SoC，统一内存、能效比之王，重塑笔记本。", tag: "ARM" },
    { name: "Apple A 系列（A17 Pro / A18）", year: "2007–", desc: "iPhone 自研 SoC 系列，ARM 指令集 + 自研微架构。", tag: "ARM" },
    { name: "Qualcomm Snapdragon 8 Gen 3", year: "2023", desc: "Android 旗舰平台，ARMv9 架构，AI 专用引擎。", tag: "ARM" },
    { name: "Amazon Graviton 4", year: "2024", desc: "AWS 云端 ARM 处理器，64 核 Neoverse V2，主导云计算新格局。", tag: "ARM Server" },
    { name: "NVIDIA Grace", year: "2023", desc: "72 核 ARM Neoverse V2，专为 AI 数据中心打造。", tag: "ARM Server" },
    { name: "阿里 玄铁 C910", year: "2019–", desc: "平头哥自研 RISC-V 处理器，广泛用于 IoT、智能汽车。", tag: "RISC-V" },
    { name: "SiFive P870", year: "2023", desc: "高性能 RISC-V 核心，瞄准应用处理器、汽车、AI 市场。", tag: "RISC-V" },
    { name: "MIPS R2000 · R10000", year: "1986 / 1996", desc: "经典 RISC 商用化先驱，驱动 SGI 工作站与早期游戏主机。", tag: "MIPS" },
    { name: "IBM POWER9 / POWER10", year: "2017 / 2021", desc: "面向 HPC 与 AI 的高性能 RISC 处理器，大端/小端兼容。", tag: "POWER" },
    { name: "SPARC M8", year: "2017", desc: "Oracle 旗下企业级 RISC 处理器，32 核，主打数据库加速。", tag: "SPARC" },
  ];

  const products = tab === "cisc" ? ciscProducts : riscProducts;
  const accent = tab === "cisc" ? C.cisc : C.risc;
  const accentSoft = tab === "cisc" ? C.ciscSoft : C.riscSoft;

  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
        <MonoLabel color={C.gold}>§ 4.0</MonoLabel>
        <MonoLabel color={C.textDim}>代表产品 / FLAGSHIP CHIPS</MonoLabel>
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", gap: 40, marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(40px, 5vw, 68px)",
            fontWeight: 600,
            color: C.text,
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          定义时代的<span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: accent, transition: "color 0.3s" }}>那些芯片</span>
        </h2>
        <div style={{ display: "flex", gap: 0, border: `1px solid ${C.line}` }}>
          {[
            { k: "cisc", label: "CISC 阵营", color: C.cisc },
            { k: "risc", label: "RISC 阵营", color: C.risc },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              style={{
                padding: "14px 28px",
                fontFamily: fonts.mono,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: tab === t.k ? t.color : "transparent",
                color: tab === t.k ? C.bg : C.textDim,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                borderRight: t.k === "cisc" ? `1px solid ${C.line}` : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 0,
          border: `1px solid ${C.line}`,
          borderRight: "none",
          borderBottom: "none",
        }}
      >
        {products.map((p, i) => (
          <div
            key={p.name}
            style={{
              padding: "28px 26px 26px",
              borderRight: `1px solid ${C.line}`,
              borderBottom: `1px solid ${C.line}`,
              background: `linear-gradient(135deg, ${accentSoft} 0%, transparent 60%)`,
              transition: "all 0.3s",
              position: "relative",
              minHeight: 180,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 24,
                height: 1,
                background: accent,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <MonoLabel color={accent}>{p.tag}</MonoLabel>
              <MonoLabel color={C.textMute}>{p.year}</MonoLabel>
            </div>
            <h4
              style={{
                fontFamily: fonts.display,
                fontSize: 22,
                fontWeight: 600,
                color: C.text,
                margin: "0 0 10px",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {p.name}
            </h4>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 13.5,
                color: C.textDim,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {p.desc}
            </p>
            <MonoLabel color={C.textMute} size={10}>
              <span style={{ position: "absolute", bottom: 10, right: 14 }}>No. {String(i + 1).padStart(3, "0")}</span>
            </MonoLabel>
          </div>
        ))}
      </div>
    </section>
  );
};

// ===== Section: Modern Landscape =====
const Landscape = () => {
  const segments = [
    { name: "桌面 PC", cisc: 85, risc: 15, note: "x86 仍主导，但 Apple Silicon 快速侵蚀" },
    { name: "笔记本电脑", cisc: 70, risc: 30, note: "Apple M 系列 + Snapdragon X Elite 抢占份额" },
    { name: "数据中心 / 云", cisc: 75, risc: 25, note: "AWS Graviton、NVIDIA Grace 快速增长" },
    { name: "智能手机", cisc: 0, risc: 100, note: "ARM 一统天下" },
    { name: "嵌入式 / IoT", cisc: 5, risc: 95, note: "ARM Cortex-M / RISC-V 双雄" },
    { name: "超算 HPC", cisc: 55, risc: 45, note: "富岳（ARM）、Frontier（x86+GPU）" },
    { name: "汽车 / 车载", cisc: 15, risc: 85, note: "ARM 主导，RISC-V 迅速渗透" },
  ];

  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.line}`, background: C.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
        <MonoLabel color={C.gold}>§ 5.0</MonoLabel>
        <MonoLabel color={C.textDim}>当今格局 / 2026 LANDSCAPE</MonoLabel>
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>

      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: "clamp(40px, 5vw, 68px)",
          fontWeight: 600,
          color: C.text,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        边界已经<span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: C.gold }}>模糊</span>，但<br />
        战场依然<span style={{ fontFamily: fonts.serif, fontStyle: "italic", color: C.gold }}>分明</span>。
      </h2>
      <p style={{ fontFamily: fonts.body, color: C.textDim, fontSize: 16, maxWidth: 760, lineHeight: 1.7, marginBottom: 56 }}>
        现代 x86 内部早已 RISC 化，现代 ARM 也引入了宏融合等 CISC 式优化——纯粹的派别之争已经过时。
        真正的战场转移到了<strong style={{ color: C.text }}>生态、能效与开放性</strong>。以下是 2026 年的估算份额：
      </p>

      <div>
        {segments.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 180px",
              gap: 24,
              padding: "18px 0",
              borderBottom: i < segments.length - 1 ? `1px solid ${C.line}` : "none",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 18, color: C.text, fontWeight: 500 }}>{s.name}</div>
              <MonoLabel color={C.textMute} size={10}>SEGMENT {String(i + 1).padStart(2, "0")}</MonoLabel>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  height: 26,
                  border: `1px solid ${C.line}`,
                  background: C.bgAlt,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${s.cisc}%`,
                    background: `repeating-linear-gradient(135deg, ${C.cisc} 0 6px, ${C.cisc}cc 6px 12px)`,
                    transition: "width 0.6s",
                  }}
                />
                <div
                  style={{
                    width: `${s.risc}%`,
                    background: `repeating-linear-gradient(135deg, ${C.risc} 0 6px, ${C.risc}cc 6px 12px)`,
                    transition: "width 0.6s",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 11, color: C.cisc }}>CISC · {s.cisc}%</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 11, color: C.risc }}>RISC · {s.risc}%</span>
              </div>
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: C.textDim, lineHeight: 1.5 }}>{s.note}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 32,
          fontFamily: fonts.mono,
          fontSize: 11,
          color: C.textMute,
          letterSpacing: "0.08em",
        }}
      >
        * 数据为业界估算，不同口径（出货量 / 营收 / 装机量）会有差异。
      </div>
    </section>
  );
};

// ===== Section: Verdict =====
const Verdict = () => (
  <section style={{ padding: "160px 48px 120px", position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
      <MonoLabel color={C.gold}>§ 6.0</MonoLabel>
      <MonoLabel color={C.textDim}>结语 / CLOSING</MonoLabel>
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>

    <blockquote
      style={{
        fontFamily: fonts.serif,
        fontSize: "clamp(32px, 4vw, 54px)",
        fontWeight: 400,
        color: C.text,
        lineHeight: 1.25,
        margin: "0 0 48px",
        maxWidth: 1100,
        letterSpacing: "-0.01em",
      }}
    >
      "The best instruction set is the one that lets the <em style={{ color: C.cisc }}>compiler</em>, the <em style={{ color: C.risc }}>hardware</em>, and the <em style={{ color: C.gold }}>programmer</em> all do what they do best."
    </blockquote>
    <MonoLabel color={C.textDim}>— 改编自 David Patterson 的经典论断</MonoLabel>

    <div
      style={{
        marginTop: 80,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 32,
        paddingTop: 48,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      {[
        { k: "CISC 的遗产", v: "兼容性、代码密度、生态厚度——x86 在 PC 与服务器的统治仍难撼动。" },
        { k: "RISC 的胜利", v: "能效、可扩展、可定制——从手机到超算，从 IoT 到 AI。" },
        { k: "下一章", v: "RISC-V 的开源革命正在重演 Linux 之于操作系统的故事。" },
      ].map((o, i) => (
        <div key={i}>
          <MonoLabel color={C.gold}>{`0${i + 1}`}</MonoLabel>
          <h4
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              fontWeight: 600,
              color: C.text,
              margin: "10px 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            {o.k}
          </h4>
          <p style={{ fontFamily: fonts.body, fontSize: 14, color: C.textDim, lineHeight: 1.7, margin: 0 }}>
            {o.v}
          </p>
        </div>
      ))}
    </div>

    <div
      style={{
        marginTop: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <MonoLabel color={C.textMute}>END OF DOCUMENT · 本文档结束</MonoLabel>
      <MonoLabel color={C.textMute}>⌬ CISC × RISC · 2026</MonoLabel>
    </div>
  </section>
);

// ===== Main =====
export default function CiscVsRiscApp() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: fonts.body,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.gold}; color: ${C.bg}; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Subtle global noise */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          zIndex: 100,
          mixBlendMode: "overlay",
        }}
      />

      <Hero />
      <Philosophy />
      <ExecutionDemo />
      <Timeline />
      <Products />
      <Landscape />
      <Verdict />
    </div>
  );
}
