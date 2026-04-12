import { useState, useRef, useEffect, useCallback } from "react";

const AU = 149600000;
const LS = 299792.458;
const PLANET_Y = 230;
const VIEW_H = 460;
const SUN_VR = 70; // visual-only radius; Mercury's scaled pos ≈124px, so 70 keeps it clear

const BODIES = [
  {
    id: "sun", type: "star", rkm: 696342, avg: 0, min: 0, max: 0,
    color: "#F9A825", name: "太阳",
    info: "太阳系中心恒星，直径约139万千米，包含太阳系99.86%的质量。表面温度约5500°C，核心温度高达1500万°C。",
    moons: []
  },
  {
    id: "mercury", type: "p", rkm: 2440, avg: 57909000, min: 46000000, max: 69820000,
    color: "#9E9E9E", name: "水星",
    info: "太阳系最小行星，公转周期88天。表面昼夜温差极大（白天+430°C，夜晚-180°C），几乎没有大气层。",
    moons: []
  },
  {
    id: "venus", type: "p", rkm: 6052, avg: 108200000, min: 107500000, max: 108900000,
    color: "#FFF176", name: "金星",
    info: "表面温度高达465°C，是太阳系最热的行星。拥有极厚的二氧化碳大气层造成强烈温室效应，自转方向与大多数行星相反。",
    moons: []
  },
  {
    id: "earth", type: "p", rkm: 6371, avg: 149600000, min: 147100000, max: 152100000,
    color: "#42A5F5", name: "地球",
    info: "目前已知唯一存在生命的星球，拥有液态水海洋和富含氧气的大气层。直径约12742千米，有一颗天然卫星——月球。",
    moons: [{ name: "月球", rkm: 1737, dist: 384400, color: "#B0BEC5" }]
  },
  {
    id: "mars", type: "p", rkm: 3390, avg: 227900000, min: 206600000, max: 249200000,
    color: "#EF5350", name: "火星",
    info: "拥有太阳系最高火山奥林匹斯山（约21千米）和最大峡谷水手谷。表面平均温度-63°C，有两颗小卫星。",
    moons: [
      { name: "火卫一", rkm: 11, dist: 9376, color: "#8D6E63" },
      { name: "火卫二", rkm: 6, dist: 23463, color: "#A1887F" }
    ]
  },
  {
    id: "asteroid_belt", type: "belt",
    name: "小行星带",
    min: 329000000, max: 479000000,  // 2.2–3.2 AU
    color: "#8D6E63",
    info: "位于火星与木星轨道之间（2.2–3.2 AU），包含数百万颗小行星，总质量约为月球的4%。最大天体为谷神星（矮行星，直径约945 km）。",
    moons: []
  },
  {
    id: "jupiter", type: "p", rkm: 69911, avg: 778500000, min: 740600000, max: 816600000,
    color: "#FF9800", name: "木星",
    info: "太阳系最大行星，质量是其他所有行星总和的2.5倍。大红斑是持续数百年的超级风暴，已知79颗卫星。",
    moons: [
      { name: "木卫一", rkm: 1821, dist: 421800, color: "#FFF176" },
      { name: "木卫二", rkm: 1560, dist: 671100, color: "#B0BEC5" },
      { name: "木卫三", rkm: 2634, dist: 1070400, color: "#8D6E63" },
      { name: "木卫四", rkm: 2410, dist: 1882700, color: "#78909C" }
    ]
  },
  {
    id: "saturn", type: "p", rkm: 58232, avg: 1432000000, min: 1353000000, max: 1514000000,
    color: "#F5CBA7", name: "土星",
    info: "以壮观的光环系统著称，光环主要由冰粒和岩石碎块组成。密度是八大行星中最低的，已知83颗卫星。",
    moons: [
      { name: "土卫六", rkm: 2575, dist: 1221870, color: "#FFA726" },
      { name: "土卫五", rkm: 764, dist: 527108, color: "#9E9E9E" },
      { name: "土卫四", rkm: 561, dist: 377396, color: "#B0BEC5" }
    ]
  },
  {
    id: "uranus", type: "p", rkm: 25362, avg: 2867000000, min: 2742000000, max: 3003000000,
    color: "#80DEEA", name: "天王星",
    info: "自转轴倾斜97.8°，相当于「躺着」公转。27颗已知卫星均以莎士比亚作品中的人物命名。",
    moons: [
      { name: "天卫五", rkm: 236, dist: 129900, color: "#80DEEA" },
      { name: "天卫一", rkm: 581, dist: 191900, color: "#80CBC4" }
    ]
  },
  {
    id: "neptune", type: "p", rkm: 24622, avg: 4515000000, min: 4458000000, max: 4537000000,
    color: "#3F51B5", name: "海王星",
    info: "风速最快的行星，可达2100千米/小时。海卫一以逆行轨道运行，推测是被捕获的柯伊伯带天体。",
    moons: [{ name: "海卫一", rkm: 1353, dist: 354800, color: "#7986CB" }]
  },
  {
    id: "pluto", type: "dw", rkm: 1188, avg: 5906000000, min: 4437000000, max: 7376000000,
    color: "#CE93D8", name: "冥王星",
    info: "著名矮行星，轨道偏心率极大（0.25），近日点甚至比海王星离太阳更近！2006年被重新归类为矮行星，有5颗卫星。",
    moons: [{ name: "冥卫一", rkm: 606, dist: 19591, color: "#CE93D8" }]
  }
];

const PLANET_VR = {
  sun: 190, mercury: 4, venus: 7, earth: 7, mars: 5,
  jupiter: 22, saturn: 20, uranus: 14, neptune: 13, pluto: 3
};

const TOTAL_KM = BODIES[BODIES.length - 1].max + AU * 4;

function fmtKm(km) {
  if (km >= 1e8) return (km / 1e8).toFixed(1) + " 亿km";
  if (km >= 1e4) return (km / 1e4).toFixed(0) + " 万km";
  return km.toFixed(0) + " km";
}
function fmtLs(km) {
  const ls = km / LS;
  if (ls >= 60) return (ls / 60).toFixed(1) + " 光分";
  return ls.toFixed(1) + " 光秒";
}
function fmtAU(km) {
  return (km / AU).toFixed(2) + " AU";
}

function getRulerStep(rangeKm, viewW, unit) {
  // For AU mode, snap steps to round AU multiples
  const steps = unit === "au"
    ? [AU * 0.1, AU * 0.25, AU * 0.5, AU, AU * 2, AU * 5, AU * 10, AU * 20]
    : [1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7, 5e7, 1e8, 5e8, 1e9, 5e9];
  const minPx = 80;
  for (const s of steps) {
    if (s / rangeKm * viewW >= minPx) return s;
  }
  return steps[steps.length - 1];
}

export default function SolarSystem() {
  const [unit, setUnit] = useState("km");
  const [offsetX, setOffsetX] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, ruler: false, startX: 0, startOff: 0 });
  const [viewW, setViewW] = useState(680);

  const getW = useCallback(() => containerRef.current?.getBoundingClientRect().width || 680, []);

  // Keep viewW in sync with container size (handles resize + initial mount)
  useEffect(() => {
    const update = () => setViewW(getW());
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [getW]);

  const totalW = Math.max(viewW * 9, 18000);
  const ppk = totalW / TOTAL_KM;

  const clamp = useCallback((o) => {
    const w = getW();
    return Math.max(-(totalW - w), Math.min(0, o));
  }, [totalW, getW]);

  const startDrag = (e, isRuler = false) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragRef.current = { active: true, ruler: isRuler, startX: clientX, startOff: offsetX };
    if (!e.touches) e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newOff = clamp(dragRef.current.startOff + (clientX - dragRef.current.startX));
      setOffsetX(newOff);
    };
    const onUp = () => { dragRef.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [clamp]);

  const showTip = (e, name, info) => {
    e.stopPropagation();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0);
    const y = (e.clientY || e.touches?.[0]?.clientY || 0);
    setTooltip({ name, info });
    setTooltipPos({ x, y });
  };
  const hideTip = () => setTooltip(null);

  const startKm = -offsetX / ppk;
  const endKm = (viewW - offsetX) / ppk;
  const step = getRulerStep(endKm - startKm, viewW, unit);

  const rulerTicks = [];
  let val = Math.ceil(startKm / step) * step;
  while (val <= endKm) {
    const px = val * ppk + offsetX;
    if (px >= 0 && px <= viewW) {
      const label = unit === "km" ? fmtKm(val) : unit === "ls" ? fmtLs(val) : fmtAU(val);
      rulerTicks.push({ px, label });
    }
    val += step;
  }

  const tipX = tooltipPos.x + 14;
  const tipY = tooltipPos.y - 10;

  return (
    <div ref={containerRef} style={{ width: "100%", fontFamily: "sans-serif", userSelect: "none" }}>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderBottom: "1px solid #ddd", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#666" }}>单位:</span>
        {["km", "ls", "au"].map(u => (
          <button key={u} onClick={() => setUnit(u)} style={{
            padding: "2px 12px", border: "1px solid #ccc", borderRadius: 6,
            fontSize: 12, cursor: "pointer",
            background: unit === u ? "#eee" : "transparent",
            fontWeight: unit === u ? 600 : 400, color: unit === u ? "#111" : "#666"
          }}>
            {u === "km" ? "千米" : u === "ls" ? "光秒" : "天文单位"}
          </button>
        ))}
        <span style={{ fontSize: 12, color: "#999", marginLeft: 6 }}>← 拖动画面或标尺浏览 →</span>
      </div>

      {/* Main canvas */}
      <div
        onMouseDown={e => startDrag(e)}
        onTouchStart={e => startDrag(e)}
        style={{ position: "relative", height: VIEW_H, overflow: "hidden", cursor: "grab", background: "#0a0a1a" }}
      >
        {/* Stars background — seeded LCG, fills actual viewport width */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          {(() => {
            // Seeded LCG so stars are stable across re-renders
            let s = 0xdeadbeef;
            const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) | 0; return (s >>> 0) / 0xffffffff; };
            const count = Math.round(viewW * VIEW_H / 3200); // density scales with area
            return Array.from({ length: count }, (_, i) => {
              const x = rand() * viewW;
              const y = rand() * VIEW_H;
              const tier = rand(); // 0-1, drives size + brightness tier
              const r = tier > 0.97 ? 1.6 : tier > 0.88 ? 1.1 : tier > 0.6 ? 0.75 : 0.4;
              const op = tier > 0.97 ? 0.9 + rand() * 0.1
                : tier > 0.88 ? 0.55 + rand() * 0.3
                  : 0.15 + rand() * 0.45;
              const twinkle = tier > 0.97; // brightest stars get a soft halo
              return (
                <g key={i}>
                  {twinkle && <circle cx={x} cy={y} r={r * 3} fill="white" opacity={op * 0.15} />}
                  <circle cx={x} cy={y} r={r} fill="white" opacity={op} />
                </g>
              );
            });
          })()}
        </svg>

        {/* Bodies layer */}
        <div style={{ position: "absolute", top: 0, left: 0, width: totalW, height: VIEW_H, transform: `translateX(${offsetX}px)`, willChange: "transform" }}>
          <svg width={totalW} height={VIEW_H} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>

            {BODIES.map(b => {
              const cr = PLANET_VR[b.id] || 5;
              if (b.type === "star") {
                return (
                  <g key={b.id} style={{ cursor: "pointer" }}
                    onMouseEnter={e => showTip(e, b.name, b.info)}
                    onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={hideTip}
                    onClick={e => showTip(e, b.name, b.info)}>
                    <defs>
                      <radialGradient id="sunGlow" cx="100%" cy="50%" r="100%">
                        <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#F9A825" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Faint glow fill */}
                    <circle cx={0} cy={PLANET_Y} r={SUN_VR} fill="url(#sunGlow)" />
                    {/* Outline arc — center at x=0 so only right edge is visible */}
                    <circle cx={0} cy={PLANET_Y} r={SUN_VR}
                      fill="none" stroke="#F9A825" strokeWidth={2} opacity={0.75} />
                    <text x={SUN_VR - 4} y={PLANET_Y - SUN_VR + 16}
                      textAnchor="end" fontSize={12} fill="#F9A825" opacity={0.7}>太阳</text>
                  </g>
                );
              }

              // Asteroid belt rendering
              if (b.type === "belt") {
                const beltMinPx = b.min * ppk;
                const beltMaxPx = b.max * ppk;
                const beltWidth = beltMaxPx - beltMinPx;
                // Deterministic pseudo-random dots
                const dots = Array.from({ length: 180 }, (_, i) => {
                  const t = (i * 2654435761) % 1000 / 1000; // golden-ratio hash
                  const t2 = (i * 1013904223) % 1000 / 1000;
                  const t3 = (i * 1664525) % 1000 / 1000;
                  return {
                    x: beltMinPx + t * beltWidth,
                    y: PLANET_Y + (t2 - 0.5) * 60,
                    r: 0.6 + t3 * 1.2,
                    op: 0.25 + t3 * 0.45
                  };
                });
                return (
                  <g key={b.id} style={{ cursor: "pointer" }}
                    onMouseEnter={e => showTip(e, b.name, b.info)}
                    onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={hideTip}
                    onClick={e => showTip(e, b.name, b.info)}>
                    {/* Belt band background */}
                    <rect x={beltMinPx} y={PLANET_Y - 32} width={beltWidth} height={64}
                      fill="#8D6E63" opacity={0.06} />
                    {/* Edge markers */}
                    <line x1={beltMinPx} y1={PLANET_Y - 28} x2={beltMinPx} y2={PLANET_Y + 28}
                      stroke="#8D6E63" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.4} />
                    <line x1={beltMaxPx} y1={PLANET_Y - 28} x2={beltMaxPx} y2={PLANET_Y + 28}
                      stroke="#8D6E63" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.4} />
                    {/* Asteroid dots */}
                    {dots.map((d, i) => (
                      <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#A1887F" opacity={d.op} />
                    ))}
                    {/* Label */}
                    <text x={(beltMinPx + beltMaxPx) / 2} y={PLANET_Y + 46}
                      textAnchor="middle" fontSize={11} fill="#8D6E63" opacity={0.8}>小行星带</text>
                  </g>
                );
              }

              const cx = b.avg * ppk;
              const minPx = b.min * ppk;
              const maxPx = b.max * ppk;
              const moonSpacing = Math.max(16, cr + 8);
              const moonY = PLANET_Y - cr - 24;

              const distInfo = `平均距太阳 ${(b.avg / 1e6).toFixed(1)} 百万km（${(b.avg / AU).toFixed(2)} AU）。轨道范围：${(b.min / 1e6).toFixed(0)}–${(b.max / 1e6).toFixed(0)} 百万km。${b.info}`;

              return (
                <g key={b.id}>
                  {/* Orbit range */}
                  <line x1={minPx} y1={PLANET_Y} x2={maxPx} y2={PLANET_Y}
                    stroke={b.color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.35} />
                  <circle cx={minPx} cy={PLANET_Y} r={2.5} fill={b.color} opacity={0.5} />
                  <circle cx={maxPx} cy={PLANET_Y} r={2.5} fill={b.color} opacity={0.5} />

                  {/* Saturn ring */}
                  {b.id === "saturn" && (
                    <ellipse cx={cx} cy={PLANET_Y} rx={cr * 1.9} ry={cr * 0.42}
                      fill="none" stroke="#F5CBA7" strokeWidth={4} opacity={0.55} />
                  )}

                  {/* Planet */}
                  <g style={{ cursor: "pointer" }}
                    onMouseEnter={e => showTip(e, b.name, distInfo)}
                    onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={hideTip}
                    onClick={e => showTip(e, b.name, distInfo)}>
                    <circle cx={cx} cy={PLANET_Y} r={cr + 8} fill="transparent" />
                    <circle cx={cx} cy={PLANET_Y} r={cr} fill={b.color} />
                    <text x={cx} y={PLANET_Y + cr + 16} textAnchor="middle" fontSize={12} fill="#aaa">
                      {b.name}{b.type === "dw" ? " ✦" : ""}
                    </text>
                  </g>

                  {/* Moons */}
                  {b.moons.map((m, i) => {
                    const mx = cx + (i - (b.moons.length - 1) / 2) * moonSpacing;
                    const mr = Math.max(2, Math.min(5, m.rkm / 500));
                    const moonInfo = `${b.name}的卫星，半径约 ${m.rkm.toLocaleString()} km，距${b.name}约 ${m.dist.toLocaleString()} km。`;
                    return (
                      <g key={m.name} style={{ cursor: "pointer" }}
                        onMouseEnter={e => showTip(e, m.name, moonInfo)}
                        onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={hideTip}
                        onClick={e => showTip(e, m.name, moonInfo)}>
                        <circle cx={mx} cy={moonY} r={mr + 5} fill="transparent" />
                        <circle cx={mx} cy={moonY} r={mr} fill={m.color} />
                        <text x={mx} y={moonY - mr - 4} textAnchor="middle" fontSize={9} fill="#777">{m.name}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Ruler */}
      <div
        onMouseDown={e => startDrag(e, true)}
        onTouchStart={e => startDrag(e, true)}
        style={{ position: "relative", height: 38, borderTop: "1px solid #ddd", overflow: "hidden", cursor: "grab", background: "#f5f5f5" }}
      >
        <svg width="100%" height={38} style={{ position: "absolute", top: 0, left: 0 }}>
          {rulerTicks.map((t, i) => (
            <g key={i}>
              <line x1={t.px} y1={0} x2={t.px} y2={13} stroke="#999" strokeWidth={0.5} />
              <text x={t.px + 3} y={27} fontSize={10} fill="#888" fontFamily="sans-serif">{t.label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", zIndex: 9999, pointerEvents: "none",
          left: Math.min(tipX, window.innerWidth - 280),
          top: Math.min(tipY, window.innerHeight - 150),
          maxWidth: 270, background: "white", border: "1px solid #ddd",
          borderRadius: 10, padding: "10px 13px", fontSize: 13, lineHeight: 1.55,
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 14 }}>{tooltip.name}</div>
          <div style={{ color: "#555" }}>{tooltip.info}</div>
        </div>
      )}
    </div>
  );
}
