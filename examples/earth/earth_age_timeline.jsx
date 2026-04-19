import { useState, useEffect, useRef } from 'react';

// ============ DATA ============
const milestones = [
  {
    id: 0,
    year: '1650',
    yearNum: 1650,
    scientist: 'James Ussher',
    scientistCn: '詹姆斯·厄舍',
    title: '阿马大主教',
    origin: '爱尔兰',
    estimate: '约 6,000 年',
    estimateYears: 6000,
    estimateLabel: '6 × 10³',
    method: '圣经年代学',
    methodEn: 'Biblical Chronology',
    era: '前科学时代',
    description:
      '厄舍大主教通过细致考证《圣经》中的族谱与历史记载，推算出上帝创造地球的精确时刻：公元前 4004 年 10 月 22 日傍晚。这一结论在之后两个世纪里几乎无人敢公开质疑。',
    insight:
      '他将宗教文本视为权威历史，逐代追溯亚当以降的人物谱系，并对照巴比伦、波斯与罗马的王朝年代加以校准。',
    limitation: '完全依赖宗教文本，未引入任何自然证据或实验方法。',
    accuracy: 0.0000013,
  },
  {
    id: 1,
    year: '1779',
    yearNum: 1779,
    scientist: 'Comte de Buffon',
    scientistCn: '布封伯爵',
    title: '博物学家',
    origin: '法国',
    estimate: '约 75,000 年',
    estimateYears: 75000,
    estimateLabel: '7.5 × 10⁴',
    method: '铁球冷却实验',
    methodEn: 'Cooling Iron Spheres',
    era: '启蒙时代',
    description:
      '布封将不同尺寸的铁球加热至白热状态，测量它们冷却至室温所需的时间，再按比例外推到地球这般大小的球体，得到约 75,000 年。',
    insight:
      '这是人类首次尝试用物理实验而非宗教文本推算地球年龄——科学方法的分水岭。他私下相信真实年龄可能接近一千万年，但为避开教会压力保守公布。',
    limitation:
      '假设地球是纯铁球体，忽略了岩石的导热差异与放射性元素的产热作用。',
    accuracy: 0.0000165,
  },
  {
    id: 2,
    year: '1830',
    yearNum: 1830,
    scientist: 'Charles Lyell',
    scientistCn: '查尔斯·莱尔',
    title: '地质学家',
    origin: '英国',
    estimate: '数亿年',
    estimateYears: 300000000,
    estimateLabel: '≈ 3 × 10⁸',
    method: '均变论与地层学',
    methodEn: 'Uniformitarianism',
    era: '地质学时代',
    description:
      '莱尔在《地质学原理》中主张「现在是通往过去的钥匙」——今日观察到的侵蚀、沉积、火山作用，以同样的速率延伸到无限遥远的过去。',
    insight:
      '他不给出确切数字，但通过沉积岩厚度与现代沉积速率的比较，暗示地球必定存在了「深不可测的时间」（deep time）。',
    limitation:
      '完全忽略了沉积速率的波动与地质过程的灾变因素；估值只能给出量级下限。',
    accuracy: 0.066,
  },
  {
    id: 3,
    year: '1862',
    yearNum: 1862,
    scientist: 'Lord Kelvin',
    scientistCn: '开尔文勋爵',
    title: '物理学家',
    origin: '英国',
    estimate: '2,000 万 – 4 亿年',
    estimateYears: 100000000,
    estimateLabel: '≈ 10⁸',
    method: '热力学冷却模型',
    methodEn: 'Thermodynamic Cooling',
    era: '物理学时代',
    description:
      '开尔文假设地球最初是熔融态，依据当时测得的地温梯度与岩石热导率，用傅里叶热传导方程计算地球冷却至现今温度所需的时间。',
    insight:
      '他最初得出 2000 万至 4 亿年，后修正为约 2000 万至 4000 万年。这一数字公开挑战了达尔文——进化论需要的时间远比开尔文给出的多。',
    limitation:
      '开尔文不知道放射性衰变在地球内部持续产生热量。这一未知因素使他的冷却模型从根本上失效。',
    accuracy: 0.022,
  },
  {
    id: 4,
    year: '1899',
    yearNum: 1899,
    scientist: 'John Joly',
    scientistCn: '约翰·乔利',
    title: '地质物理学家',
    origin: '爱尔兰',
    estimate: '8,000 万 – 1 亿年',
    estimateYears: 90000000,
    estimateLabel: '≈ 9 × 10⁷',
    method: '海洋盐度积累',
    methodEn: 'Ocean Salinity',
    era: '物理学时代',
    description:
      '乔利假设原始海洋是淡水，河流持续向海中输送盐分。用海洋总含盐量除以每年的输入量，便得到海洋——进而地球——的年龄。',
    insight:
      '这是一个精巧的「地球化学时钟」概念，引入了积累型年代测定的思维方式，为后来的放射性测年埋下伏笔。',
    limitation:
      '忽略了盐分被封存于蒸发岩、被火山循环回地幔的事实。海洋盐度实际上处于动态平衡，不是单向积累。',
    accuracy: 0.0198,
  },
  {
    id: 5,
    year: '1905',
    yearNum: 1905,
    scientist: 'Ernest Rutherford',
    scientistCn: '欧内斯特·卢瑟福',
    title: '核物理学家',
    origin: '新西兰 / 英国',
    estimate: '≥ 5 亿年',
    estimateYears: 500000000,
    estimateLabel: '≈ 5 × 10⁸',
    method: '放射性衰变',
    methodEn: 'Radioactive Decay',
    era: '放射性测年时代',
    description:
      '卢瑟福意识到放射性衰变的规律——一种元素按可预测的半衰期转变为另一种——可以充当天然时钟。他在一次公开演讲中直接驳斥了开尔文（当时也在场）的估算。',
    insight:
      '他同时也回答了开尔文的谜题：正是放射性衰变源源不断地为地球补充热量，所以冷却模型给出的年龄严重低估。',
    limitation:
      '早期样品有限且纯度不足；铀—氦方法会因氦气逃逸而系统性偏低。',
    accuracy: 0.110,
  },
  {
    id: 6,
    year: '1913',
    yearNum: 1913,
    scientist: 'Arthur Holmes',
    scientistCn: '亚瑟·霍姆斯',
    title: '地质学家',
    origin: '英国',
    estimate: '16 亿 – 30 亿年',
    estimateYears: 2500000000,
    estimateLabel: '≈ 2.5 × 10⁹',
    method: '铀—铅测年法',
    methodEn: 'Uranium-Lead Dating',
    era: '放射性测年时代',
    description:
      '霍姆斯一生致力于完善放射性测年体系。他改用铀—铅方法（铅不会像氦一样逃逸），并编制了第一张地质年代数值标度表。',
    insight:
      '他的 1927 年估值 16 亿年、1946 年估值 30 亿年，逐步逼近真值。他最终把地质时间从相对年代推进到了绝对年代。',
    limitation:
      '仍受制于地壳岩石样本——地壳上最古老的岩石比地球本身要年轻，因此持续偏低。',
    accuracy: 0.551,
  },
  {
    id: 7,
    year: '1956',
    yearNum: 1956,
    scientist: 'Clair Patterson',
    scientistCn: '克莱尔·帕特森',
    title: '地球化学家',
    origin: '美国',
    estimate: '45.5 ± 0.7 亿年',
    estimateYears: 4550000000,
    estimateLabel: '4.55 × 10⁹',
    method: '铅—铅等时线法',
    methodEn: 'Lead-Lead Isochron',
    era: '现代',
    description:
      '帕特森意识到地壳样品永远达不到地球真实年龄，转而分析「峡谷魔鬼」铁陨石（Canyon Diablo meteorite）——太阳系同期形成的原始物质。',
    insight:
      '他花了多年排除实验室中的铅污染，最终测得 45.5 亿年。这个数字至今只被微调为 45.4 ± 0.05 亿年，依然是科学上公认的地球年龄。',
    limitation:
      '在方法本身上几无缺陷——但他随后意识到汽油加铅造成了全球环境污染，此后一生投身于无铅环境的倡议。',
    accuracy: 1.0,
  },
];

const MODERN_VALUE = 4540000000;

// ============ SVG ILLUSTRATIONS ============
// Each method gets a hand-drawn style diagram
const Illustration = ({ id }) => {
  const stroke = 'var(--ink)';
  const accent = 'var(--accent-rust)';
  const soft = 'var(--accent-teal)';

  const illustrations = [
    // 0 — Ussher: book with radiating lines
    <svg viewBox="0 0 200 160" key="0" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
        <path d="M40 40 L40 120 L100 110 L160 120 L160 40 L100 30 Z" />
        <path d="M100 30 L100 110" />
        <path d="M50 55 L88 49 M50 65 L88 59 M50 75 L88 69 M50 85 L88 79" strokeWidth="0.6" />
        <path d="M112 49 L150 55 M112 59 L150 65 M112 69 L150 75 M112 79 L150 85" strokeWidth="0.6" />
        <circle cx="100" cy="70" r="3" fill={accent} stroke="none" />
        <path d="M100 45 L100 55 M95 50 L105 50" stroke={accent} strokeWidth="1" />
        <g stroke={accent} strokeWidth="0.6" opacity="0.5">
          <path d="M100 22 L100 12" />
          <path d="M115 27 L122 20" />
          <path d="M85 27 L78 20" />
          <path d="M130 35 L140 30" />
          <path d="M70 35 L60 30" />
        </g>
        <text x="100" y="144" fontSize="7" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="serif" fontStyle="italic">
          Genesis 1:1
        </text>
      </g>
    </svg>,

    // 1 — Buffon: heated spheres
    <svg viewBox="0 0 200 160" key="1" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
        <circle cx="45" cy="80" r="14" fill={accent} fillOpacity="0.4" />
        <circle cx="45" cy="80" r="14" />
        <circle cx="95" cy="80" r="22" fill={accent} fillOpacity="0.25" />
        <circle cx="95" cy="80" r="22" />
        <circle cx="155" cy="80" r="32" fill={accent} fillOpacity="0.12" />
        <circle cx="155" cy="80" r="32" />
        <g stroke={accent} strokeWidth="0.7" opacity="0.7">
          <path d="M45 60 L45 52 M31 66 L25 60 M59 66 L65 60 M31 94 L25 100 M59 94 L65 100 M45 100 L45 108" />
          <path d="M95 52 L95 44 M75 62 L68 55 M115 62 L122 55 M75 98 L68 105 M115 98 L122 105 M95 108 L95 116" />
        </g>
        <path d="M20 130 L180 130" strokeDasharray="2 3" />
        <text x="45" y="145" fontSize="6" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="monospace">小</text>
        <text x="95" y="145" fontSize="6" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="monospace">中</text>
        <text x="155" y="145" fontSize="6" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="monospace">地球 ?</text>
      </g>
    </svg>,

    // 2 — Lyell: stratified layers with fossils
    <svg viewBox="0 0 200 160" key="2" style={{ width: '100%', height: '100%' }}>
      <g>
        <rect x="25" y="30" width="150" height="16" fill={soft} fillOpacity="0.25" stroke={stroke} strokeWidth="1" />
        <rect x="25" y="46" width="150" height="22" fill={accent} fillOpacity="0.2" stroke={stroke} strokeWidth="1" />
        <rect x="25" y="68" width="150" height="14" fill="var(--accent-ochre)" fillOpacity="0.25" stroke={stroke} strokeWidth="1" />
        <rect x="25" y="82" width="150" height="28" fill={soft} fillOpacity="0.4" stroke={stroke} strokeWidth="1" />
        <rect x="25" y="110" width="150" height="20" fill={accent} fillOpacity="0.35" stroke={stroke} strokeWidth="1" />
        <g fill="none" stroke={stroke} strokeWidth="0.7">
          <path d="M30 38 Q40 35 50 38 T70 38 T90 38" opacity="0.4" />
          <path d="M100 54 L105 54 M110 58 L118 58" opacity="0.5" />
          <circle cx="60" cy="58" r="2.5" fill={stroke} />
          <path d="M60 58 Q63 55 66 58 Q63 61 60 58" fill={stroke} opacity="0.3" />
          <circle cx="140" cy="75" r="3" />
          <path d="M137 75 L143 75 M140 72 L140 78" strokeWidth="0.5" />
          <path d="M50 95 Q60 90 70 95 Q75 100 70 105 Q60 110 50 105 Q45 100 50 95" fill={stroke} fillOpacity="0.3" />
          <circle cx="120" cy="120" r="2" fill={stroke} />
        </g>
        <text x="182" y="40" fontSize="6" fill={stroke} opacity="0.6" fontFamily="serif" fontStyle="italic">新</text>
        <text x="182" y="124" fontSize="6" fill={stroke} opacity="0.6" fontFamily="serif" fontStyle="italic">古</text>
        <path d="M15 30 L15 130" stroke={stroke} strokeWidth="0.8" />
        <path d="M12 130 L18 130 M12 30 L18 30" stroke={stroke} strokeWidth="0.8" />
        <path d="M15 80 L10 78 M15 80 L10 82" stroke={stroke} strokeWidth="0.6" />
      </g>
    </svg>,

    // 3 — Kelvin: Earth cooling with heat gradient
    <svg viewBox="0 0 200 160" key="3" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="earthHeat" cx="50%" cy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--accent-ochre)" stopOpacity="0.5" />
          <stop offset="100%" stopColor={soft} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="100" cy="80" r="45" fill="url(#earthHeat)" stroke={stroke} strokeWidth="1.2" />
        <circle cx="100" cy="80" r="30" fill="none" stroke={stroke} strokeWidth="0.6" strokeDasharray="2 2" />
        <circle cx="100" cy="80" r="15" fill="none" stroke={stroke} strokeWidth="0.6" strokeDasharray="2 2" />
        <g stroke={accent} strokeWidth="0.8" fill="none" opacity="0.7">
          <path d="M100 25 L100 18 M100 18 L96 22 M100 18 L104 22" />
          <path d="M155 80 L162 80 M162 80 L158 76 M162 80 L158 84" />
          <path d="M100 135 L100 142 M100 142 L96 138 M100 142 L104 138" />
          <path d="M45 80 L38 80 M38 80 L42 76 M38 80 L42 84" />
          <path d="M140 40 L146 34 M146 34 L141 35 M146 34 L145 39" />
          <path d="M60 40 L54 34 M54 34 L59 35 M54 34 L55 39" />
          <path d="M140 120 L146 126 M146 126 L145 121 M146 126 L141 125" />
          <path d="M60 120 L54 126 M54 126 L55 121 M54 126 L59 125" />
        </g>
        <text x="100" y="83" fontSize="7" textAnchor="middle" fill={stroke} fontFamily="serif" fontStyle="italic">
          ∂T/∂t = α∇²T
        </text>
      </g>
    </svg>,

    // 4 — Joly: ocean with salt, hourglass
    <svg viewBox="0 0 200 160" key="4" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
        <path d="M25 90 Q40 85 55 90 T85 90 T115 90 T145 90 T175 90 L175 130 L25 130 Z"
              fill={soft} fillOpacity="0.3" />
        <path d="M25 100 Q40 95 55 100 T85 100 T115 100 T145 100 T175 100" opacity="0.5" />
        <path d="M25 115 Q40 110 55 115 T85 115 T115 115 T145 115 T175 115" opacity="0.3" />
        <g fill={accent} stroke="none">
          <circle cx="45" cy="105" r="1" />
          <circle cx="70" cy="110" r="1" />
          <circle cx="95" cy="107" r="1" />
          <circle cx="120" cy="113" r="1" />
          <circle cx="145" cy="108" r="1" />
          <circle cx="160" cy="115" r="1" />
          <circle cx="55" cy="120" r="1" />
          <circle cx="105" cy="122" r="1" />
          <circle cx="135" cy="125" r="1" />
        </g>
        <g transform="translate(100,50)">
          <path d="M-15 -25 L15 -25 L15 -20 L2 0 L15 20 L15 25 L-15 25 L-15 20 L-2 0 L-15 -20 Z" />
          <path d="M-15 -20 L15 -20" strokeWidth="0.6" />
          <path d="M-15 20 L15 20" strokeWidth="0.6" />
          <g fill={accent} stroke="none">
            <circle cx="0" cy="-10" r="1" />
            <circle cx="-3" cy="-6" r="1" />
            <circle cx="4" cy="-4" r="1" />
            <circle cx="0" cy="-1" r="1" />
          </g>
          <g fill={accent} stroke="none" opacity="0.4">
            <circle cx="0" cy="8" r="0.8" />
            <circle cx="-2" cy="12" r="0.8" />
          </g>
        </g>
        <path d="M100 25 L100 15" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>,

    // 5 — Rutherford: atomic decay
    <svg viewBox="0 0 200 160" key="5" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2">
        <circle cx="100" cy="80" r="8" fill={accent} fillOpacity="0.8" stroke={stroke} />
        <ellipse cx="100" cy="80" rx="45" ry="15" />
        <ellipse cx="100" cy="80" rx="45" ry="15" transform="rotate(60 100 80)" />
        <ellipse cx="100" cy="80" rx="45" ry="15" transform="rotate(-60 100 80)" />
        <circle cx="145" cy="80" r="2.5" fill={stroke} />
        <circle cx="77" cy="119" r="2.5" fill={stroke} />
        <circle cx="77" cy="41" r="2.5" fill={stroke} />
        <g stroke={accent} strokeWidth="1" fill="none" opacity="0.7">
          <path d="M100 80 L170 40" strokeDasharray="3 2" />
          <circle cx="170" cy="40" r="2" fill={accent} />
          <text x="174" y="35" fontSize="7" fill={accent} fontFamily="serif" fontStyle="italic">α</text>
          <path d="M100 80 L30 130" strokeDasharray="3 2" />
          <circle cx="30" cy="130" r="2" fill={accent} />
          <text x="18" y="135" fontSize="7" fill={accent} fontFamily="serif" fontStyle="italic">β</text>
        </g>
        <text x="100" y="150" fontSize="7" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="serif" fontStyle="italic">
          N(t) = N₀ e^(−λt)
        </text>
      </g>
    </svg>,

    // 6 — Holmes: U-Pb decay curve
    <svg viewBox="0 0 200 160" key="6" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1">
        <path d="M30 130 L180 130" />
        <path d="M30 130 L30 20" />
        <path d="M30 25 Q32 23 34 25 M30 25 L28 23" strokeWidth="0.8" />
        <path d="M175 130 Q177 128 175 126 M180 130 L178 128" strokeWidth="0.8" />
        <path d="M30 30 Q60 30 80 60 T130 110 T180 128" stroke={accent} strokeWidth="1.6" />
        <path d="M30 128 Q60 100 100 70 T180 32" stroke={soft} strokeWidth="1.6" strokeDasharray="3 2" />
        <g strokeWidth="0.4" opacity="0.4">
          <path d="M78 130 L78 50" />
          <path d="M128 130 L128 95" />
        </g>
        <circle cx="78" cy="52" r="2" fill={accent} />
        <circle cx="128" cy="100" r="2" fill={accent} />
        <text x="38" y="28" fontSize="7" fill={accent} fontFamily="serif" fontStyle="italic">²³⁸U</text>
        <text x="165" y="42" fontSize="7" fill={soft} fontFamily="serif" fontStyle="italic">²⁰⁶Pb</text>
        <text x="100" y="148" fontSize="7" textAnchor="middle" fill={stroke} opacity="0.6" fontFamily="serif" fontStyle="italic">
          time →
        </text>
      </g>
    </svg>,

    // 7 — Patterson: meteorite with isotope ratios
    <svg viewBox="0 0 200 160" key="7" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
        <path d="M60 40 L100 35 L130 50 L140 75 L125 100 L95 105 L65 95 L55 70 Z"
              fill={accent} fillOpacity="0.4" />
        <path d="M60 40 L100 35 L130 50 L140 75 L125 100 L95 105 L65 95 L55 70 Z" />
        <g stroke={stroke} strokeWidth="0.5" opacity="0.5">
          <path d="M75 55 L85 65 M95 50 L105 62 M110 60 L118 72 M85 75 L95 85 M105 80 L115 90 M70 80 L78 88" />
          <circle cx="80" cy="60" r="2" fill={stroke} />
          <circle cx="110" cy="70" r="2.5" fill={stroke} />
          <circle cx="90" cy="90" r="1.8" fill={stroke} />
        </g>
        <g stroke={accent} strokeWidth="0.8" opacity="0.6">
          <path d="M30 10 L55 35" strokeDasharray="2 2" />
          <path d="M20 30 L50 50" strokeDasharray="2 2" />
          <path d="M35 5 L60 25" strokeDasharray="2 2" />
        </g>
        <g transform="translate(100, 135)">
          <path d="M-50 0 L50 0" strokeWidth="0.6" />
          <path d="M-50 0 L-50 -10" strokeWidth="0.6" />
          <path d="M-50 -8 L-40 -3 L-25 -5 L-10 -8 L5 -12 L20 -16 L35 -18 L50 -19"
                stroke={accent} strokeWidth="1.2" fill="none" />
          <circle cx="50" cy="-19" r="2.5" fill={accent} />
          <text x="55" y="-15" fontSize="6" fill={accent} fontFamily="serif" fontStyle="italic">4.55 Ga</text>
          <text x="-50" y="8" fontSize="5" fill={stroke} opacity="0.6" fontFamily="monospace">²⁰⁴Pb/²⁰⁶Pb</text>
        </g>
      </g>
    </svg>,
  ];

  return illustrations[id] || null;
};

// ============ LOG SCALE VISUALIZATION ============
const ScaleBar = ({ estimate, modern }) => {
  // log scale from 10^3 to 10^10
  const minLog = 3;
  const maxLog = 10;
  const estimatePos = ((Math.log10(estimate) - minLog) / (maxLog - minLog)) * 100;
  const modernPos = ((Math.log10(modern) - minLog) / (maxLog - minLog)) * 100;

  return (
    <div className="relative h-12 w-full">
      <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'var(--ink)', opacity: 0.3 }} />
      {/* Decade ticks */}
      {[3, 4, 5, 6, 7, 8, 9, 10].map((decade) => {
        const pos = ((decade - minLog) / (maxLog - minLog)) * 100;
        return (
          <div key={decade} className="absolute flex flex-col items-center" style={{ left: `${pos}%`, transform: 'translateX(-50%)', top: '50%' }}>
            <div className="w-px h-2" style={{ background: 'var(--ink)', opacity: 0.4, marginTop: '-4px' }} />
            <div className="text-[9px] mt-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink)', opacity: 0.5 }}>
              10{['³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰'][decade - 3]}
            </div>
          </div>
        );
      })}
      {/* Modern value */}
      <div className="absolute flex flex-col items-center transition-all duration-700" style={{ left: `${modernPos}%`, transform: 'translateX(-50%)', top: '50%' }}>
        <div className="w-0.5 h-6 -mt-3" style={{ background: 'var(--accent-teal)' }} />
        <div className="absolute -top-6 whitespace-nowrap text-[9px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-teal)' }}>
          真值 4.54 Ga
        </div>
      </div>
      {/* Estimate */}
      <div className="absolute flex flex-col items-center transition-all duration-700" style={{ left: `${estimatePos}%`, transform: 'translateX(-50%)', top: '50%' }}>
        <div className="w-1 h-8 -mt-4 rounded-full" style={{ background: 'var(--accent-rust)' }} />
        <div className="absolute -bottom-5 whitespace-nowrap text-[10px] font-semibold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--accent-rust)' }}>
          估值
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
export default function EarthAgeTimeline() {
  const [activeId, setActiveId] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const active = milestones[activeId];
  const detailRef = useRef(null);

  // Animate entry
  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.style.opacity = '0';
      detailRef.current.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        if (detailRef.current) {
          detailRef.current.style.transition = 'opacity 500ms ease, transform 500ms ease';
          detailRef.current.style.opacity = '1';
          detailRef.current.style.transform = 'translateY(0)';
        }
      });
    }
  }, [activeId]);

  const handleSelect = (id) => {
    setActiveId(id);
    setHasInteracted(true);
  };

  return (
    <div className="min-h-screen w-full" style={{
      background: 'var(--parchment)',
      color: 'var(--ink)',
      fontFamily: 'Spectral, Georgia, serif',
    }}>
      {/* Fonts and variables */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --parchment: #efe6d0;
          --parchment-dark: #e4d8bc;
          --ink: #1e1a14;
          --ink-soft: #4a4236;
          --accent-rust: #9b3a1a;
          --accent-teal: #3d6b5c;
          --accent-ochre: #c4843a;
          --accent-indigo: #2d3561;
        }

        .paper-texture {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(155, 58, 26, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(61, 107, 92, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 50% 90%, rgba(196, 132, 58, 0.03) 0%, transparent 40%);
        }

        .grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .strata-line {
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(30, 26, 20, 0.15) 10%,
            rgba(30, 26, 20, 0.25) 50%,
            rgba(30, 26, 20, 0.15) 90%,
            transparent);
        }

        .timeline-item-active {
          background: linear-gradient(90deg, rgba(155, 58, 26, 0.1), transparent);
        }

        .timeline-item-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent-rust);
        }

        .timeline-dot {
          transition: all 300ms ease;
        }
        .timeline-item:hover .timeline-dot,
        .timeline-item-active .timeline-dot {
          background: var(--accent-rust);
          transform: scale(1.3);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in-up { animation: fadeInUp 700ms ease forwards; }

        .ornament {
          font-family: 'Fraunces', serif;
          font-style: italic;
          opacity: 0.4;
          letter-spacing: 0.3em;
        }

        .scroll-smooth { scroll-behavior: smooth; }

        /* Custom scrollbar */
        .timeline-scroll::-webkit-scrollbar { width: 4px; }
        .timeline-scroll::-webkit-scrollbar-track { background: transparent; }
        .timeline-scroll::-webkit-scrollbar-thumb { background: rgba(30, 26, 20, 0.2); border-radius: 2px; }
      `}</style>

      <div className="relative paper-texture min-h-screen">
        <div className="grain" />

        {/* HEADER */}
        <header className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'var(--ink)', opacity: 0.3 }} />
            <span className="ornament text-[10px]" style={{ color: 'var(--ink)' }}>
              ⌘ A CHRONICLE OF DEEP TIME ⌘
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--ink)', opacity: 0.3 }} />
          </div>

          <div className="text-center mb-3">
            <div className="text-[11px] uppercase tracking-[0.4em] mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
              Anno Domini 1650 — 1956
            </div>
            <h1 className="leading-[0.95] mb-4" style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}>
              丈量 <em style={{ color: 'var(--accent-rust)', fontWeight: 400 }}>地球</em> 的岁月
            </h1>
            <div className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>
              从圣经年代学到同位素地球化学——人类如何在三个世纪里将地球年龄<br className="hidden md:block" />
              从六千年一步步推进到四十五亿年。
            </div>
          </div>

          {/* Master scale panel */}
          <div className="mt-12 border-y py-6" style={{ borderColor: 'rgba(30, 26, 20, 0.2)' }}>
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                对数年龄标尺 · 年
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                现代值: 4.54 × 10⁹ 年
              </div>
            </div>
            <div className="pt-8 pb-6">
              <ScaleBar estimate={active.estimateYears} modern={MODERN_VALUE} />
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <main className="max-w-7xl mx-auto px-6 pb-16 grid lg:grid-cols-[280px_1fr] gap-10">

          {/* TIMELINE NAV (LEFT) */}
          <aside className="relative">
            <div className="sticky top-6">
              <div className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                — 编年 · Chronology
              </div>

              <div className="timeline-scroll overflow-y-auto max-h-[70vh] pr-2 relative">
                {/* Vertical spine */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px" style={{ background: 'rgba(30, 26, 20, 0.25)' }} />

                {milestones.map((m) => {
                  const isActive = m.id === activeId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m.id)}
                      className={`timeline-item relative w-full text-left py-3 pl-7 pr-3 transition-all duration-300 ${isActive ? 'timeline-item-active' : ''}`}
                      style={{
                        borderBottom: '1px dashed rgba(30, 26, 20, 0.12)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="timeline-dot absolute left-[5px] top-[18px] w-[9px] h-[9px] rounded-full border"
                        style={{
                          background: isActive ? 'var(--accent-rust)' : 'var(--parchment)',
                          borderColor: 'var(--ink)',
                        }}
                      />
                      <div className="flex items-baseline gap-3">
                        <div className="text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', color: isActive ? 'var(--accent-rust)' : 'var(--ink)' }}>
                          {m.year}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {m.origin}
                        </div>
                      </div>
                      <div className="text-[15px] mt-0.5" style={{ fontFamily: 'Fraunces, serif', fontWeight: isActive ? 600 : 500, fontStyle: isActive ? 'italic' : 'normal', color: 'var(--ink)' }}>
                        {m.scientistCn}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                        {m.method}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!hasInteracted && (
                <div className="mt-4 text-[10px] italic animate-pulse" style={{ color: 'var(--accent-rust)', fontFamily: 'Fraunces, serif' }}>
                  ↑ 点击任一条目展开阅读
                </div>
              )}
            </div>
          </aside>

          {/* DETAIL PANEL (RIGHT) */}
          <section ref={detailRef}>
            {/* Era + Year header */}
            <div className="flex items-start justify-between mb-6 pb-6" style={{ borderBottom: '1px solid rgba(30, 26, 20, 0.2)' }}>
              <div>
                <div className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.25em] mb-3" style={{
                  background: 'var(--accent-rust)',
                  color: 'var(--parchment)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {active.era}
                </div>
                <h2 className="mb-1" style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  {active.scientistCn}
                </h2>
                <div className="text-sm italic" style={{ color: 'var(--ink-soft)' }}>
                  {active.scientist} · {active.title} · {active.origin}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                  Anno
                </div>
                <div style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: 'var(--accent-rust)',
                }}>
                  {active.year}
                </div>
              </div>
            </div>

            {/* Method + Illustration */}
            <div className="grid md:grid-cols-[1fr_1fr] gap-8 mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                  — 方法 · Methodus
                </div>
                <h3 className="mb-2" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', fontWeight: 600, fontStyle: 'italic' }}>
                  {active.method}
                </h3>
                <div className="text-sm mb-6" style={{ color: 'var(--ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {active.methodEn}
                </div>

                <div className="space-y-4">
                  <div className="p-4" style={{ background: 'var(--parchment-dark)', borderLeft: '3px solid var(--accent-rust)' }}>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-rust)' }}>
                      估算
                    </div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600 }}>
                      {active.estimate}
                    </div>
                    <div className="text-[10px] mt-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                      ≈ {active.estimateLabel} 年
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative" style={{
                border: '1px solid rgba(30, 26, 20, 0.2)',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '1.5rem',
                aspectRatio: '1',
              }}>
                <div className="absolute top-2 left-2 text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)', opacity: 0.7 }}>
                  Fig. {active.id + 1}
                </div>
                <Illustration id={active.id} />
                <div className="absolute bottom-2 right-2 text-[9px] italic" style={{ fontFamily: 'Fraunces, serif', color: 'var(--ink-soft)', opacity: 0.6 }}>
                  {active.methodEn}
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-6">
              <div>
                <div className="strata-line mb-5" />
                <div className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                  — 记述
                </div>
                <p className="text-[17px] leading-[1.75]" style={{ color: 'var(--ink)' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', float: 'left', lineHeight: '0.9', marginRight: '0.3rem', marginTop: '0.3rem', color: 'var(--accent-rust)' }}>
                    {active.description.charAt(0)}
                  </span>
                  {active.description.slice(1)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="p-5" style={{ background: 'rgba(61, 107, 92, 0.08)', border: '1px solid rgba(61, 107, 92, 0.25)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-teal)' }} />
                    <div className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-teal)' }}>
                      洞见
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                    {active.insight}
                  </p>
                </div>

                <div className="p-5" style={{ background: 'rgba(155, 58, 26, 0.06)', border: '1px solid rgba(155, 58, 26, 0.25)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-rust)' }} />
                    <div className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-rust)' }}>
                      局限
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                    {active.limitation}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="mt-10 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(30, 26, 20, 0.15)' }}>
              <button
                onClick={() => activeId > 0 && handleSelect(activeId - 1)}
                disabled={activeId === 0}
                className="flex items-center gap-2 text-sm transition-opacity"
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  opacity: activeId === 0 ? 0.3 : 1,
                  cursor: activeId === 0 ? 'default' : 'pointer',
                }}
              >
                <span>←</span>
                <span>{activeId > 0 ? milestones[activeId - 1].year : ''}</span>
              </button>
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
                {activeId + 1} / {milestones.length}
              </div>
              <button
                onClick={() => activeId < milestones.length - 1 && handleSelect(activeId + 1)}
                disabled={activeId === milestones.length - 1}
                className="flex items-center gap-2 text-sm transition-opacity"
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  opacity: activeId === milestones.length - 1 ? 0.3 : 1,
                  cursor: activeId === milestones.length - 1 ? 'default' : 'pointer',
                }}
              >
                <span>{activeId < milestones.length - 1 ? milestones[activeId + 1].year : ''}</span>
                <span>→</span>
              </button>
            </div>
          </section>
        </main>

        {/* FOOTER: the grand comparison */}
        <footer className="max-w-7xl mx-auto px-6 pb-16 pt-4">
          <div className="strata-line mb-8" />
          <div className="text-center mb-8">
            <div className="ornament text-[10px] mb-3">⌘ EPILOGUE ⌘</div>
            <h3 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--ink)',
            }}>
              三个世纪，<span style={{ color: 'var(--accent-rust)' }}>六个数量级</span>。
            </h3>
          </div>

          {/* Comparative bars */}
          <div className="space-y-1 max-w-4xl mx-auto">
            {milestones.map((m) => {
              const logMin = 3;
              const logMax = 10;
              const width = ((Math.log10(m.estimateYears) - logMin) / (logMax - logMin)) * 100;
              const isActive = m.id === activeId;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m.id)}
                  className="block w-full group transition-all"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-16 text-[11px] text-right" style={{ fontFamily: 'JetBrains Mono, monospace', color: isActive ? 'var(--accent-rust)' : 'var(--ink-soft)', fontWeight: isActive ? 600 : 400 }}>
                      {m.year}
                    </div>
                    <div className="w-32 text-[12px] truncate" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: isActive ? 'var(--accent-rust)' : 'var(--ink)' }}>
                      {m.scientistCn}
                    </div>
                    <div className="flex-1 relative h-5">
                      <div className="absolute inset-y-0 left-0 rounded-sm transition-all duration-500 group-hover:opacity-100"
                        style={{
                          width: `${width}%`,
                          background: isActive ? 'var(--accent-rust)' : 'rgba(30, 26, 20, 0.3)',
                          opacity: isActive ? 1 : 0.6,
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 w-0.5" style={{ background: 'var(--accent-teal)' }} title="现代值" />
                    </div>
                    <div className="w-24 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: isActive ? 'var(--accent-rust)' : 'var(--ink-soft)' }}>
                      {m.estimateLabel}
                    </div>
                  </div>
                </button>
              );
            })}
            <div className="pt-3 mt-2 flex items-center gap-4 text-[10px]" style={{ borderTop: '1px dashed rgba(30,26,20,0.2)', fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-soft)' }}>
              <div className="w-16"></div>
              <div className="w-32"></div>
              <div className="flex-1 flex justify-between">
                <span>10³</span>
                <span>10⁶</span>
                <span style={{ color: 'var(--accent-teal)' }}>10⁹ · 真值</span>
              </div>
              <div className="w-24"></div>
            </div>
          </div>

          <div className="text-center mt-16 text-[11px]" style={{ color: 'var(--ink-soft)', fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
            <div className="mb-2 ornament">· · ·</div>
            「现在是通往过去的钥匙。」—— 查尔斯·莱尔
          </div>
        </footer>
      </div>
    </div>
  );
}
