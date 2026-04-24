import { useState, useEffect } from "react";
import {
  Cable,
  GitBranch,
  Radio,
  Waves,
  ArrowUpRight,
  Circle,
  Layers,
  Network,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const DATA_LINK = {
  id: "datalink",
  num: "L2",
  name: "数据链路层",
  en: "Data Link Layer",
  motto: "让帧在同一个二层域里，找到正确的端口。",
  long:
    "关注的是：一个以太网帧，在同一个广播域内，应当从哪个物理端口转发出去。它不跨越路由器，只在本地链路或 VLAN 内部工作。",
  keywords: ["交换 · 桥接", "MAC 学习", "VLAN", "生成树", "链路聚合"],
  protocols: [
    {
      id: "ethernet",
      name: "Ethernet",
      code: "IEEE 802.3",
      tagline: "几乎所有局域网都架在它之上",
      purpose:
        "最基础的二层帧格式。用 48 位 MAC 地址在同一广播域内寻址，定义了从前导码到 CRC 的每一个字节，是上层一切数据的载体。",
      how: [
        { t: "封装", d: "上层数据被包进以太网帧：目的 MAC + 源 MAC + 类型 + 载荷 + CRC。" },
        { t: "寻址", d: "MAC 是出厂烧录的 48 位唯一标识。广播地址为 FF:FF:FF:FF:FF:FF。" },
        { t: "检错不纠错", d: "接收端用 CRC 校验，出错直接丢弃——不重传，留给上层处理。" },
        { t: "冲突域已消失", d: "在交换式网络里每端口独占链路，CSMA/CD 基本形同虚设。" },
      ],
      diagram: "ethernet-frame",
    },
    {
      id: "vlan",
      name: "VLAN",
      code: "IEEE 802.1Q",
      tagline: "在同一台交换机里划出多个虚拟网段",
      purpose:
        "在物理交换机上划分多个逻辑广播域。不同 VLAN 之间默认隔离，需要路由器或三层交换机才能互通。",
      how: [
        { t: "打标签", d: "交换机在帧头插入 4 字节 802.1Q Tag，其中 12 位 VLAN ID 标识所属 VLAN。" },
        { t: "Access 口", d: "连接终端。进入时打 Tag，出去时剥 Tag——PC 完全感知不到 VLAN 的存在。" },
        { t: "Trunk 口", d: "连接交换机之间，保留 Tag，让多个 VLAN 的帧在同一根干道上共存。" },
        { t: "转发键", d: "查表键是 (VLAN ID, MAC)，同一个 MAC 在不同 VLAN 里可指向不同端口。" },
      ],
      diagram: "vlan-tag",
    },
    {
      id: "stp",
      name: "STP",
      code: "IEEE 802.1D",
      tagline: "用阻塞端口把冗余拓扑收敛成一棵树",
      purpose:
        "物理环路在二层会引起广播风暴和 MAC 漂移。STP 在有环拓扑里阻塞掉一些端口，逻辑上形成无环的树。",
      how: [
        { t: "选举根桥", d: "所有交换机比较 Bridge ID（优先级 + MAC），最小者当选 Root Bridge。" },
        { t: "选 Root Port", d: "每台非根交换机选出「到根路径开销最小」的那个端口。" },
        { t: "选 Designated Port", d: "每个网段再选出一个「代表它向下转发」的端口。" },
        { t: "其余阻塞", d: "既不是 Root 也不是 Designated 的端口进入 Blocking 状态，逻辑上下线。" },
      ],
      diagram: "spanning-tree",
      notes:
        "RSTP (802.1w) 把收敛时间改进到秒级；MSTP (802.1s) 让多个 VLAN 共享一棵树、不同 VLAN 组走不同树，以分担流量。",
    },
    {
      id: "lacp",
      name: "LACP",
      code: "IEEE 802.1AX",
      tagline: "把多条物理链路绑成一条逻辑链路",
      purpose:
        "用多条并行物理链路组成一个聚合组（Port-Channel / Bond），对上层看来是一条带宽叠加的链路；故障单条不触发 STP 重算。",
      how: [
        { t: "协商成员", d: "两端交换机周期性发送 LACPDU，参数一致的链路加入同一 LAG。" },
        { t: "流级哈希分担", d: "基于源目 MAC、IP、L4 端口哈希，把同一条流绑定到同一物理链路（防乱序）。" },
        { t: "故障收敛", d: "某条成员失效，流量在剩余成员上重新哈希——不惊动 STP。" },
      ],
      diagram: "lacp",
    },
    {
      id: "lldp",
      name: "LLDP",
      code: "IEEE 802.1AB",
      tagline: "「我在这里」——二层邻居自报家门",
      purpose:
        "链路层邻居发现。每台设备在自己的端口上周期性广播 LLDP 帧，告诉直连邻居：我是谁、在哪个端口、有什么能力。",
      how: [
        { t: "周期通告", d: "默认 30 秒一次，目的 MAC 01:80:C2:00:00:0E，内容是一组 TLV。" },
        { t: "只收不转", d: "LLDP 帧不跨交换机转发，只能看到直连邻居。" },
        { t: "拓扑重建", d: "网管系统把所有设备的邻居表拼在一起，还原出物理拓扑图。" },
      ],
      diagram: "lldp",
      notes: "CDP 是思科的私有等价物，原理完全一样。",
    },
    {
      id: "ppp",
      name: "PPP",
      code: "RFC 1661",
      tagline: "点对点链路（WAN / 拨号）的封装",
      purpose:
        "两台设备之间的串行链路（WAN 专线、拨号、PPPoE）上的封装协议，内建了链路协商、认证和多协议承载。",
      how: [
        { t: "LCP 建立链路", d: "Link Control Protocol 协商 MTU、认证方式、魔术字等参数。" },
        { t: "认证（可选）", d: "PAP 明文验证，或 CHAP 挑战握手——后者不传明文密码。" },
        { t: "NCP 协商上层", d: "IPCP / IPv6CP 分别协商三层参数，例如分配对端 IP。" },
        { t: "数据传输", d: "全部协商完成才开始传数据；断开走 Terminate 四次挥手。" },
      ],
      diagram: "ppp",
    },
  ],
  mechanisms: [
    {
      name: "MAC 自学习",
      idea: "源 MAC → 入端口 写入转发表；目的 MAC → 出端口 查表转发。",
      tag: "transparent bridging",
    },
    {
      name: "未知目的泛洪",
      idea: "目的 MAC 不在表中，则向除入端口外的所有端口复制转发。",
      tag: "flooding",
    },
    {
      name: "生成树算法",
      idea: "选举 Root Bridge → Root Port → Designated Port，其余端口阻塞。",
      tag: "distributed / no-loop",
    },
    {
      name: "VLAN 内查表",
      idea: "转发键不是单纯 MAC，而是 (VLAN ID, MAC) → 出端口。",
      tag: "broadcast domain",
    },
    {
      name: "聚合哈希分担",
      idea: "对 MAC / IP / L4 端口哈希，把同一流绑定到同一成员链路。",
      tag: "load balancing",
    },
    {
      name: "MAC 老化与端口安全",
      idea: "老化定时器回收过期表项；Port Security 限制可学习 MAC 数。",
      tag: "housekeeping",
    },
  ],
};

const NETWORK = {
  id: "network",
  num: "L3",
  name: "网络层",
  en: "Network Layer",
  motto: "让 IP 分组，跨越网段与自治系统，到达目的地。",
  long:
    "关注的是：一个 IP 包应当交给哪个下一跳，才能跨越路由器，最终落到目标网段上。它处理逻辑地址与全局可达性。",
  keywords: ["路由 · 选路", "最长前缀匹配", "IGP / EGP", "最短路径", "策略"],
  protocols: [
    {
      id: "ip",
      name: "IP",
      code: "RFC 791 / 8200",
      tagline: "网络层的核心——承载一切的那个包",
      purpose:
        "IPv4（32 位）/ IPv6（128 位）地址标识主机所在的网段。头部字段支撑 TTL、分片、服务类型等决策，是所有路由协议真正调度的对象。",
      how: [
        { t: "寻址", d: "地址 = 网络前缀 + 主机号。路由器只看前缀，忽略主机号。" },
        { t: "TTL 防环", d: "每经过一台路由器减 1，到 0 丢包并回 ICMP Time Exceeded。" },
        { t: "分片（v4）", d: "遇到 MTU 不够时在途中切片；v6 改为源端做路径 MTU 探测。" },
        { t: "上层指示", d: "头部 Protocol 字段标出上层：TCP=6 / UDP=17 / ICMP=1。" },
      ],
      diagram: "ip-header",
    },
    {
      id: "icmp",
      name: "ICMP",
      code: "RFC 792",
      tagline: "网络层的报错与诊断通道",
      purpose:
        "当 IP 传输出问题（目的不可达、TTL 超时、需要分片但 DF 置位），由 ICMP 反馈源端。也是 ping 和 traceroute 的基础。",
      how: [
        { t: "ping", d: "发 Echo Request，对端回 Echo Reply——测延迟和可达性。" },
        { t: "traceroute", d: "发 TTL=1,2,3... 的包，每跳因 TTL=0 回 Time Exceeded，由此勾勒路径。" },
        { t: "Unreachable", d: "目的网络 / 主机 / 端口不可达；或需要分片但 DF=1 不能切。" },
      ],
      diagram: "traceroute",
    },
    {
      id: "rip",
      name: "RIP",
      code: "RFC 2453",
      tagline: "最老的 IGP，用跳数丈量世界",
      purpose:
        "Routing Information Protocol。最早的动态路由协议之一，每 30 秒向邻居广播整张路由表，度量简单到只数跳数。",
      how: [
        { t: "周期通告", d: "默认 30 秒把整张表塞进 UDP 520 发给所有邻居。" },
        { t: "Bellman-Ford", d: "邻居通告的距离 + 1；若优于当前记录则更新。" },
        { t: "计数到无穷", d: "坏消息环里逐跳 +1。用「最大 15」+ 水平分割 + 毒性反转来缓解。" },
      ],
      diagram: "rip",
      notes: "度量粗糙、收敛慢，今天基本只在教学和实验室见到。",
    },
    {
      id: "ospf",
      name: "OSPF",
      code: "RFC 2328",
      tagline: "企业网主力 IGP",
      purpose:
        "Open Shortest Path First。链路状态协议：所有路由器泛洪 LSA 获得全网拓扑，然后各自独立跑 Dijkstra 算出最短路径树。",
      how: [
        { t: "发现邻居", d: "通过 Hello 包（组播 224.0.0.5）发现并维持邻接。" },
        { t: "泛洪 LSA", d: "每台路由器把自己的链路信息打包成 LSA 泛洪给所有邻居。" },
        { t: "LSDB 同步", d: "所有路由器的 LSDB 一致 = 拥有同一份拓扑地图。" },
        { t: "SPF 计算", d: "各自以自己为根跑 Dijkstra，得出最短路径树。" },
        { t: "分区域", d: "大网用 Area 0（骨干）+ 非骨干区域；ABR 做摘要，抑制 LSA 泛洪范围。" },
      ],
      diagram: "ospf-area",
    },
    {
      id: "isis",
      name: "IS-IS",
      code: "ISO 10589",
      tagline: "运营商骨干网的最爱",
      purpose:
        "Intermediate System to Intermediate System。与 OSPF 同为链路状态协议，算法几乎一样——但封装在链路层而不是 IP 上，扩展性和稳定性在大网里表现更好。",
      how: [
        { t: "两级分区", d: "Level-1（区域内）+ Level-2（区域间），比 OSPF Area 更灵活。" },
        { t: "TLV 扩展", d: "用 TLV 编码承载新特性（IPv6、流量工程），加特性不破兼容。" },
        { t: "跑在二层", d: "不依赖 IP——配置中断时仍能维持邻接。大型 ISP 多用 IS-IS + MPLS。" },
      ],
      diagram: "isis",
    },
    {
      id: "eigrp",
      name: "EIGRP",
      code: "Cisco / RFC 7868",
      tagline: "比距离向量聪明、比链路状态轻量",
      purpose:
        "Enhanced Interior Gateway Routing Protocol。思科的混合型协议，基于 DUAL 算法，度量用复合公式（带宽 / 延迟 / 负载 / 可靠性），收敛非常快。",
      how: [
        { t: "邻居维护", d: "Hello 包建立邻接，基于 RTP 可靠传输路由信息。" },
        { t: "复合度量", d: "默认按 K1·带宽 + K3·延迟 综合，比单纯跳数精细得多。" },
        { t: "DUAL", d: "维护 Successor 与 Feasible Successor，主路径挂了直接切备份，不用重算。" },
      ],
      diagram: "eigrp",
      notes: "曾为思科私有，2013 年以 Informational RFC 形式部分开放。",
    },
    {
      id: "bgp",
      name: "BGP-4",
      code: "RFC 4271",
      tagline: "互联网的脊梁——AS 之间的路由",
      purpose:
        "Border Gateway Protocol。跑在自治系统（AS）之间，通告完整的 AS-PATH，按策略（Local Pref / AS-PATH 长度 / MED 等）而不是单纯最短路径选路。",
      how: [
        { t: "TCP 179 会话", d: "与对等 AS 建立长连接 TCP，增量通告路由变化。" },
        { t: "AS-PATH", d: "通告里写明「经过了哪些 AS」——看到自己 AS 就丢弃，天然防环。" },
        { t: "策略选路", d: "不看跳数看「利益」：优先走客户、避开对手、用 MED 影响入向流量。" },
        { t: "决策顺序", d: "Weight → LocalPref → AS-PATH → Origin → MED → eBGP>iBGP → IGP 度量 …" },
      ],
      diagram: "bgp",
    },
    {
      id: "igmp",
      name: "IGMP / MLD",
      code: "RFC 3376 / 3810",
      tagline: "「我要 / 不要这个组播流」",
      purpose:
        "Internet Group Management Protocol（IPv4）与 Multicast Listener Discovery（IPv6）。主机用它告诉本地路由器自己想接收哪些组播组，路由器据此决定是否转发。",
      how: [
        { t: "Query", d: "路由器周期性询问：「这个网段还有谁在接收 xxx 组播组？」。" },
        { t: "Report", d: "有兴趣的主机回应 Report；没兴趣的沉默。" },
        { t: "Leave", d: "主动离开时发 Leave Group，路由器确认无人后停止转发。" },
      ],
      diagram: "igmp",
      notes: "IGMP 只负责「主机 ↔ 本地路由器」这一段；跨路由器的组播分发由 PIM 处理。",
    },
  ],
  mechanisms: [
    {
      name: "最长前缀匹配",
      idea: "在路由表中选择与目的 IP 匹配位数最多的条目。",
      tag: "IP forwarding",
    },
    {
      name: "距离向量 (Bellman-Ford)",
      idea: "只知道「到某网段的距离与下一跳」，周期性地与邻居交换整张表。",
      tag: "RIP",
    },
    {
      name: "链路状态 (Dijkstra)",
      idea: "先泛洪链路状态建全网拓扑，再各自跑 SPF 算最短路径树。",
      tag: "OSPF / IS-IS",
    },
    {
      name: "路径向量",
      idea: "通告完整 AS-PATH，按 Local Pref / AS 长度 / MED 等策略选路。",
      tag: "BGP",
    },
    {
      name: "DUAL",
      idea: "利用可行后继 (Feasible Successor) 快速收敛，避免重算。",
      tag: "EIGRP",
    },
    {
      name: "ECMP / 路由汇总",
      idea: "等价多路径分担；CIDR 汇总减少表项，提升可扩展性。",
      tag: "scale",
    },
  ],
};

const CROSS_LAYER = [
  {
    id: "arp",
    name: "ARP",
    code: "RFC 826",
    layers: "L2 ⇄ L3",
    tagline: "IP 地址 → MAC 地址：二三层之间的翻译官",
    purpose:
      "要把一个 IP 包发给同网段里某个 IP，必须先知道它的 MAC 地址才能封进以太帧。ARP 在本地广播域里完成这个询问。",
    how: [
      { t: "广播询问", d: "A 要发给 IP=1.1.1.2，但不知道对方 MAC。A 向本网段广播：「谁是 1.1.1.2？把 MAC 告诉我。」" },
      { t: "单播回复", d: "IP=1.1.1.2 的主机 B 认领，单播回复：「我是 1.1.1.2，MAC 是 bb:22。」" },
      { t: "写缓存", d: "A 把 (1.1.1.2 → bb:22) 记入 ARP 缓存，以后直接单播。" },
      { t: "条目老化", d: "缓存有 TTL（几分钟），过期后下次发包会重新询问。" },
    ],
    why_cross:
      "它承载在二层帧里（广播本身是二层动作），解析的却是三层地址——这正是二三层之间最典型的粘合剂。",
    diagram: "arp",
  },
  {
    id: "ndp",
    name: "NDP",
    code: "RFC 4861",
    layers: "L3 (ICMPv6) ⇄ L2",
    tagline: "IPv6 里的 ARP，但能力多得多",
    purpose:
      "Neighbor Discovery Protocol。IPv6 版的「ARP+」，集邻居发现、路由器发现、地址自动配置、重定向于一身。走在 ICMPv6 上，而不是独立的二层协议。",
    how: [
      { t: "NS / NA", d: "Neighbor Solicitation 替代 ARP Request，Neighbor Advertisement 替代 Reply。" },
      { t: "RS / RA", d: "主机发 Router Solicitation，路由器回 Router Advertisement 通告前缀与网关；据此自动配地址（SLAAC）。" },
      { t: "组播代替广播", d: "询问时用「请求节点组播地址」，只打扰真正相关的主机，更高效。" },
    ],
    diagram: "ndp",
    why_cross:
      "运行在 ICMPv6（三层）之上，解决的却依旧是「三层地址 → 二层地址」这一跨层问题。",
  },
  {
    id: "mpls",
    name: "MPLS",
    code: "RFC 3031",
    layers: "L2.5",
    tagline: "贴个标签，不看 IP 只看标签转发",
    purpose:
      "Multi-Protocol Label Switching。在二层帧头与 IP 头之间插入一个 32 位标签。中间路由器只看标签交换，不查 IP 路由表——从而支撑流量工程、VPN 等高级特性。",
    how: [
      { t: "入口 Push", d: "进入 MPLS 网络时由 Ingress LSR 压入第一个标签。" },
      { t: "中间 Swap", d: "中间 LSR 只看标签，查 LFIB 换成下一跳的标签继续转发——不看 IP。" },
      { t: "出口 Pop", d: "Egress LSR 弹出标签，恢复为普通 IP 包交给目的网段。" },
    ],
    why_cross:
      "常说 MPLS 是「2.5 层」——它既不改 IP 也不改以太帧，只在两者之间加了一层，使转发速度与策略控制解耦。",
    diagram: "mpls",
  },
];

const ALGORITHMS = [
  {
    id: "dv",
    name: "距离向量",
    sub: "Distance Vector",
    by: "RIP",
    metric: "跳数 · Hop",
    converge: "慢",
    loop: "有计数到无穷",
    fix: "Split Horizon · Poison Reverse · Hold-down",
    gist: "只和邻居交换，基于 Bellman-Ford 迭代。",
  },
  {
    id: "ls",
    name: "链路状态",
    sub: "Link State / Dijkstra",
    by: "OSPF · IS-IS",
    metric: "可配 Cost (带宽反比)",
    converge: "快",
    loop: "全局拓扑，天然少环",
    fix: "LSA 泛洪 · 区域划分",
    gist: "先知全局拓扑，再各自独立跑最短路径。",
  },
  {
    id: "pv",
    name: "路径向量",
    sub: "Path Vector",
    by: "BGP-4",
    metric: "策略属性 (AS-PATH · LocalPref · MED)",
    converge: "最慢",
    loop: "AS-PATH 自带防环",
    fix: "策略 · Route Reflector",
    gist: "通告完整路径，策略选路而非单纯最短。",
  },
  {
    id: "dual",
    name: "DUAL",
    sub: "Diffusing Update",
    by: "EIGRP",
    metric: "复合 (带宽 · 延迟 · 负载 · 可靠性)",
    converge: "很快",
    loop: "可行后继防环",
    fix: "Feasibility Condition",
    gist: "有后备路径时直接切换，无须全局重算。",
  },
];

/* ------------------------------------------------------------------ */
/*  Primitives                                                        */
/* ------------------------------------------------------------------ */

function GridBg() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(237,228,211,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,228,211,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,140,66,0.07), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,234,212,0.05), transparent 60%)",
          zIndex: 0,
        }}
      />
    </>
  );
}

function NumBadge({ n, tone }) {
  const color = tone === "orange" ? "#FF8C42" : tone === "cyan" ? "#5EEAD4" : "#EDE4D3";
  return (
    <div
      className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase"
      style={{ color }}
    >
      <span
        className="inline-block w-8 h-px"
        style={{ backgroundColor: color }}
      />
      {n}
    </div>
  );
}

function SectionLabel({ children, tone }) {
  const color = tone === "orange" ? "#FF8C42" : tone === "cyan" ? "#5EEAD4" : "#EDE4D3";
  return (
    <div
      className="font-mono text-[11px] tracking-[0.3em] uppercase mb-6"
      style={{ color }}
    >
      <span
        className="inline-block w-6 h-px mr-3 align-middle"
        style={{ backgroundColor: color }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Existing visualizations (kept)                                    */
/* ------------------------------------------------------------------ */

function MacLearningViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(t);
  }, []);

  const entries = [
    { mac: "aa:11", port: "P1" },
    { mac: "bb:22", port: "P2" },
    { mac: "cc:33", port: "P3" },
  ];

  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
      <svg viewBox="0 0 300 180" className="w-full">
        <rect
          x="110"
          y="70"
          width="80"
          height="40"
          fill="#111827"
          stroke="#FF8C42"
          strokeWidth="1"
        />
        <text
          x="150"
          y="95"
          fill="#FF8C42"
          fontSize="10"
          textAnchor="middle"
          fontFamily="monospace"
        >
          SWITCH
        </text>

        {[
          { x: 40, y: 40, l: "A" },
          { x: 40, y: 140, l: "B" },
          { x: 260, y: 40, l: "C" },
        ].map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={h.y} r="12" fill="#111827" stroke="#c9c0ae" strokeWidth="1" />
            <text x={h.x} y={h.y + 3} fill="#EDE4D3" fontSize="9" textAnchor="middle" fontFamily="monospace">
              {h.l}
            </text>
          </g>
        ))}

        <line x1="52" y1="40" x2="110" y2="80" stroke="#8A8175" strokeWidth="1" opacity="0.5" />
        <line x1="52" y1="140" x2="110" y2="100" stroke="#8A8175" strokeWidth="1" opacity="0.5" />
        <line x1="190" y1="90" x2="248" y2="40" stroke="#8A8175" strokeWidth="1" opacity="0.5" />

        {step >= 1 && (
          <g style={{ animation: "fade 0.5s ease" }}>
            <circle cx={step === 1 ? 70 : 140} cy={step === 1 ? 55 : 85} r="4" fill="#FF8C42" />
          </g>
        )}
      </svg>

      <div
        className="font-mono text-[11px] min-w-[120px]"
        style={{ border: "1px solid #1f2937", padding: "8px 10px" }}
      >
        <div className="text-[#8A8175] text-[9px] tracking-widest mb-2 uppercase">MAC Table</div>
        {entries.slice(0, Math.max(1, step)).map((e, i) => (
          <div key={i} className="flex justify-between gap-3 py-0.5" style={{ animation: "fade 0.3s ease" }}>
            <span className="text-[#EDE4D3]">{e.mac}</span>
            <span style={{ color: "#FF8C42" }}>{e.port}</span>
          </div>
        ))}
        {step === 0 && <div className="text-[#8A8175] italic">(empty)</div>}
      </div>
    </div>
  );
}

function SpanningTreeViz() {
  const nodes = [
    { id: "R", x: 150, y: 30, label: "Root" },
    { id: "A", x: 60, y: 110, label: "A" },
    { id: "B", x: 240, y: 110, label: "B" },
    { id: "C", x: 150, y: 170, label: "C" },
  ];
  const edges = [
    { a: "R", b: "A", blocked: false },
    { a: "R", b: "B", blocked: false },
    { a: "A", b: "C", blocked: false },
    { a: "B", b: "C", blocked: true },
    { a: "A", b: "B", blocked: true },
  ];
  const find = (id) => nodes.find((n) => n.id === id);

  return (
    <svg viewBox="0 0 300 200" className="w-full">
      {edges.map((e, i) => {
        const a = find(e.a);
        const b = find(e.b);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={e.blocked ? "#FF8C42" : "#c9c0ae"}
            strokeWidth={e.blocked ? "1" : "1.5"}
            strokeDasharray={e.blocked ? "4 3" : "0"}
            opacity={e.blocked ? 0.5 : 1}
          />
        );
      })}
      {edges
        .filter((e) => e.blocked)
        .map((e, i) => {
          const a = find(e.a);
          const b = find(e.b);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={`x-${i}`}>
              <circle cx={mx} cy={my} r="6" fill="#111827" stroke="#FF8C42" strokeWidth="1" />
              <text x={mx} y={my + 3} fill="#FF8C42" fontSize="8" textAnchor="middle" fontFamily="monospace">
                ✕
              </text>
            </g>
          );
        })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.id === "R" ? 18 : 14}
            fill="#111827"
            stroke={n.id === "R" ? "#FF8C42" : "#c9c0ae"}
            strokeWidth="1.5"
          />
          <text x={n.x} y={n.y + 3} fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
            {n.label}
          </text>
        </g>
      ))}
      <text x="10" y="195" fill="#8A8175" fontSize="9" fontFamily="monospace">
        — active   ╌ blocked
      </text>
    </svg>
  );
}

function DijkstraViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 5), 1500);
    return () => clearInterval(t);
  }, []);

  const nodes = [
    { id: "S", x: 40, y: 100, c: 0 },
    { id: "A", x: 120, y: 50, c: 2 },
    { id: "B", x: 120, y: 150, c: 5 },
    { id: "C", x: 220, y: 80, c: 3 },
    { id: "D", x: 220, y: 170, c: 7 },
  ];
  const edges = [
    ["S", "A", 2],
    ["S", "B", 5],
    ["A", "C", 1],
    ["B", "C", 3],
    ["B", "D", 4],
    ["C", "D", 3],
  ];
  const visited = ["S", "A", "C", "B", "D"].slice(0, step + 1);
  const find = (id) => nodes.find((n) => n.id === id);

  return (
    <svg viewBox="0 0 280 220" className="w-full">
      {edges.map(([a, b, w], i) => {
        const n1 = find(a);
        const n2 = find(b);
        const active = visited.includes(a) && visited.includes(b);
        return (
          <g key={i}>
            <line
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke={active ? "#5EEAD4" : "#2a3343"}
              strokeWidth={active ? "1.5" : "1"}
            />
            <text
              x={(n1.x + n2.x) / 2}
              y={(n1.y + n2.y) / 2 - 4}
              fill="#8A8175"
              fontSize="9"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {w}
            </text>
          </g>
        );
      })}
      {nodes.map((n) => {
        const inTree = visited.includes(n.id);
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r="14"
              fill="#111827"
              stroke={inTree ? "#5EEAD4" : "#8A8175"}
              strokeWidth="1.5"
            />
            <text
              x={n.x}
              y={n.y + 3}
              fill={inTree ? "#5EEAD4" : "#8A8175"}
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {n.id}
            </text>
            <text
              x={n.x}
              y={n.y - 22}
              fill="#c9c0ae"
              fontSize="9"
              textAnchor="middle"
              fontFamily="monospace"
              fontStyle="italic"
            >
              {inTree ? `d=${n.c}` : "∞"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PathVectorViz() {
  return (
    <svg viewBox="0 0 300 200" className="w-full">
      <defs>
        <marker id="pv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#5EEAD4" />
        </marker>
      </defs>
      {[
        { id: "AS65001", x: 40, y: 60 },
        { id: "AS65002", x: 150, y: 40 },
        { id: "AS65003", x: 260, y: 60 },
        { id: "AS65004", x: 150, y: 160 },
      ].map((as) => (
        <g key={as.id}>
          <rect
            x={as.x - 30}
            y={as.y - 12}
            width="60"
            height="24"
            fill="#111827"
            stroke="#5EEAD4"
            strokeWidth="1"
            rx="2"
          />
          <text x={as.x} y={as.y + 4} fill="#5EEAD4" fontSize="9" textAnchor="middle" fontFamily="monospace">
            {as.id}
          </text>
        </g>
      ))}
      <line x1="70" y1="60" x2="120" y2="40" stroke="#c9c0ae" strokeWidth="1" opacity="0.6" />
      <line x1="180" y1="40" x2="230" y2="60" stroke="#c9c0ae" strokeWidth="1" opacity="0.6" />
      <line x1="70" y1="70" x2="130" y2="155" stroke="#c9c0ae" strokeWidth="1" opacity="0.6" />
      <line x1="170" y1="155" x2="230" y2="70" stroke="#c9c0ae" strokeWidth="1" opacity="0.6" />

      <text x="40" y="190" fill="#8A8175" fontSize="9" fontFamily="monospace">
        prefix 10.0.0.0/24
      </text>
      <text x="150" y="110" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        AS-PATH: 65001 · 65002 · 65003
      </text>
      <path
        d="M 60 75 Q 150 100 240 75"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.7"
        markerEnd="url(#pv-arr)"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  New visualizations                                                */
/* ------------------------------------------------------------------ */

function EthernetFrameViz({ accent = "#FF8C42" }) {
  const fields = [
    { w: 0.14, name: "前导", sub: "7B" },
    { w: 0.04, name: "SFD", sub: "1B" },
    { w: 0.12, name: "Dst MAC", sub: "6B" },
    { w: 0.12, name: "Src MAC", sub: "6B" },
    { w: 0.08, name: "Type", sub: "2B" },
    { w: 0.42, name: "Payload", sub: "46 – 1500 B" },
    { w: 0.08, name: "FCS", sub: "4B" },
  ];
  let cursor = 0;
  const W = 300;
  return (
    <svg viewBox="0 0 300 110" className="w-full">
      {fields.map((f, i) => {
        const x = cursor * W;
        const w = f.w * W;
        cursor += f.w;
        const hl = f.name === "Dst MAC" || f.name === "Src MAC";
        return (
          <g key={i}>
            <rect
              x={x + 1}
              y="30"
              width={w - 2}
              height="32"
              fill="#111827"
              stroke={hl ? accent : "#2a3343"}
              strokeWidth="1"
            />
            <text
              x={x + w / 2}
              y="50"
              fill={hl ? accent : "#EDE4D3"}
              fontSize="8.5"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {f.name}
            </text>
            <text
              x={x + w / 2}
              y="78"
              fill="#8A8175"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {f.sub}
            </text>
          </g>
        );
      })}
      <text x="0" y="20" fill="#8A8175" fontSize="9" fontFamily="monospace">
        ← Ethernet II frame (64–1518 bytes)
      </text>
      <text x="300" y="100" fill="#8A8175" fontSize="8" fontFamily="monospace" textAnchor="end">
        高亮：真正参与寻址的字段
      </text>
    </svg>
  );
}

function VlanTagViz({ accent = "#FF8C42" }) {
  return (
    <svg viewBox="0 0 300 160" className="w-full">
      <text x="0" y="14" fill="#8A8175" fontSize="9" fontFamily="monospace">
        Before · 普通帧
      </text>
      {[
        { x: 0, w: 60, t: "Dst MAC" },
        { x: 60, w: 60, t: "Src MAC" },
        { x: 120, w: 40, t: "Type" },
        { x: 160, w: 110, t: "Payload" },
        { x: 270, w: 30, t: "FCS" },
      ].map((f, i) => (
        <g key={i}>
          <rect x={f.x + 1} y="22" width={f.w - 2} height="28" fill="#111827" stroke="#2a3343" strokeWidth="1" />
          <text x={f.x + f.w / 2} y="40" fill="#c9c0ae" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            {f.t}
          </text>
        </g>
      ))}

      <text x="0" y="78" fill="#8A8175" fontSize="9" fontFamily="monospace">
        After · 加了 802.1Q Tag
      </text>
      {[
        { x: 0, w: 60, t: "Dst MAC", hl: false },
        { x: 60, w: 60, t: "Src MAC", hl: false },
        { x: 120, w: 50, t: "802.1Q", hl: true },
        { x: 170, w: 30, t: "Type", hl: false },
        { x: 200, w: 75, t: "Payload", hl: false },
        { x: 275, w: 25, t: "FCS", hl: false },
      ].map((f, i) => (
        <g key={i}>
          <rect
            x={f.x + 1}
            y="86"
            width={f.w - 2}
            height="28"
            fill="#111827"
            stroke={f.hl ? accent : "#2a3343"}
            strokeWidth={f.hl ? "1.5" : "1"}
          />
          <text
            x={f.x + f.w / 2}
            y="104"
            fill={f.hl ? accent : "#c9c0ae"}
            fontSize="8.5"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {f.t}
          </text>
        </g>
      ))}

      <line x1="145" y1="50" x2="145" y2="86" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
      <text x="150" y="72" fill={accent} fontSize="8.5" fontFamily="monospace" fontStyle="italic">
        insert 4B (VLAN ID, PRI, DEI)
      </text>
      <text x="0" y="138" fill="#8A8175" fontSize="8.5" fontFamily="monospace">
        VLAN ID (12 bit) ∈ [1, 4094] · 定义所属广播域
      </text>
      <text x="0" y="152" fill="#8A8175" fontSize="8.5" fontFamily="monospace">
        PRI (3 bit) · QoS 优先级 ·  DEI (1 bit) · Drop Eligible
      </text>
    </svg>
  );
}

function LacpViz({ accent = "#FF8C42" }) {
  return (
    <svg viewBox="0 0 300 180" className="w-full">
      <rect x="10" y="70" width="60" height="40" fill="#111827" stroke={accent} strokeWidth="1" />
      <text x="40" y="95" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        SW-A
      </text>
      <rect x="230" y="70" width="60" height="40" fill="#111827" stroke={accent} strokeWidth="1" />
      <text x="260" y="95" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        SW-B
      </text>

      {/* physical members */}
      {[40, 60, 100, 120].map((y, i) => (
        <line
          key={i}
          x1="70"
          y1={y}
          x2="230"
          y2={y}
          stroke="#c9c0ae"
          strokeWidth="1"
          opacity="0.7"
        />
      ))}
      {[40, 60, 100, 120].map((y, i) => (
        <text
          key={`l-${i}`}
          x="150"
          y={y - 3}
          fill="#8A8175"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {`1 Gbps · member ${i + 1}`}
        </text>
      ))}

      {/* aggregate bracket */}
      <path
        d="M 76 32 Q 70 32 70 38 L 70 128 Q 70 134 76 134"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M 224 32 Q 230 32 230 38 L 230 128 Q 230 134 224 134"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.6"
      />

      <rect x="120" y="148" width="60" height="22" fill="#111827" stroke={accent} strokeWidth="1" />
      <text x="150" y="163" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
        LAG · 4 Gbps
      </text>
      <line x1="150" y1="135" x2="150" y2="148" stroke={accent} strokeDasharray="2 2" strokeWidth="1" />
      <text x="150" y="18" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        4 × 1G 物理链路 → 1 × 4G 逻辑链路
      </text>
    </svg>
  );
}

function IpHeaderViz({ accent = "#5EEAD4" }) {
  const [version, setVersion] = useState(4);
  const W = 300;

  const ipv4Rows = [
    [
      { w: 4, t: "Ver", hl: true },
      { w: 4, t: "IHL" },
      { w: 8, t: "ToS" },
      { w: 16, t: "Total Length" },
    ],
    [
      { w: 16, t: "Identification" },
      { w: 3, t: "Flags" },
      { w: 13, t: "Frag Offset" },
    ],
    [
      { w: 8, t: "TTL", hl: true },
      { w: 8, t: "Proto", hl: true },
      { w: 16, t: "Header Checksum" },
    ],
    [{ w: 32, t: "Source IP (32 bit)", hl: true }],
    [{ w: 32, t: "Destination IP (32 bit)", hl: true }],
  ];

  const ipv6Rows = [
    [
      { w: 4, t: "Ver", hl: true },
      { w: 8, t: "TC" },
      { w: 20, t: "Flow Label" },
    ],
    [
      { w: 16, t: "Payload Length" },
      { w: 8, t: "Next Hdr", hl: true },
      { w: 8, t: "Hop Lim", hl: true },
    ],
    [{ w: 32, t: "Source Address (128 bit)", hl: true }],
    [{ w: 32, t: "Destination Address (128 bit)", hl: true }],
  ];

  const rows = version === 4 ? ipv4Rows : ipv6Rows;
  const svgH = version === 4 ? 170 : 145;

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-3 justify-center">
        {[4, 6].map((v) => {
          const on = version === v;
          return (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className="font-mono text-[10px] tracking-widest px-3 py-1 transition-colors"
              style={{
                color: on ? accent : "#8A8175",
                border: `1px solid ${on ? accent : "#2a3343"}`,
                backgroundColor: on ? "#1A2332" : "transparent",
              }}
            >
              IPv{v}
            </button>
          );
        })}
      </div>
      <svg viewBox={`0 0 300 ${svgH}`} className="w-full">
        <text x="0" y="10" fill="#8A8175" fontSize="8.5" fontFamily="monospace">
          0
        </text>
        <text x="295" y="10" fill="#8A8175" fontSize="8.5" fontFamily="monospace" textAnchor="end">
          31 bit
        </text>
        {rows.map((row, rIdx) => {
          let cursor = 0;
          return (
            <g key={rIdx}>
              {row.map((cell, cIdx) => {
                const x = (cursor / 32) * W;
                const w = (cell.w / 32) * W;
                cursor += cell.w;
                return (
                  <g key={cIdx}>
                    <rect
                      x={x + 0.5}
                      y={16 + rIdx * 26}
                      width={w - 1}
                      height="24"
                      fill="#111827"
                      stroke={cell.hl ? accent : "#2a3343"}
                      strokeWidth={cell.hl ? "1.2" : "0.8"}
                    />
                    <text
                      x={x + w / 2}
                      y={16 + rIdx * 26 + 15}
                      fill={cell.hl ? accent : "#c9c0ae"}
                      fontSize={cell.w < 6 ? "7.5" : "8.5"}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {cell.t}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        <text x="0" y={svgH - 7} fill="#8A8175" fontSize="8" fontFamily="monospace">
          {version === 4
            ? "20 B 固定 + 可选 · 高亮：Ver / TTL / Proto / Src / Dst"
            : "40 B 固定 · 无分片字段 · Next Hdr 代替 Protocol"}
        </text>
      </svg>
    </div>
  );
}

function TracerouteViz({ accent = "#5EEAD4" }) {
  const hops = [
    { x: 40, label: "Src" },
    { x: 100, label: "R1" },
    { x: 160, label: "R2" },
    { x: 220, label: "R3" },
    { x: 280, label: "Dst" },
  ];
  const ttls = [
    { from: 0, to: 1, ttl: 1 },
    { from: 0, to: 2, ttl: 2 },
    { from: 0, to: 3, ttl: 3 },
  ];
  return (
    <svg viewBox="0 0 300 200" className="w-full">
      <line x1="40" y1="100" x2="280" y2="100" stroke="#2a3343" strokeWidth="1" />
      {hops.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy="100" r="10" fill="#111827" stroke={accent} strokeWidth="1" />
          <text x={h.x} y="103" fill={accent} fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            {h.label}
          </text>
        </g>
      ))}

      {ttls.map((t, i) => {
        const yTop = 30 + i * 18;
        const xDrop = hops[t.to].x;
        return (
          <g key={i} style={{ animation: `fade 0.4s ease ${i * 0.2}s both` }}>
            <line x1={hops[0].x} y1={yTop} x2={xDrop} y2={yTop} stroke={accent} strokeWidth="1" opacity="0.8" />
            <line x1={xDrop} y1={yTop} x2={xDrop} y2="92" stroke={accent} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <text x={hops[0].x} y={yTop - 3} fill={accent} fontSize="8.5" fontFamily="monospace">
              TTL={t.ttl}
            </text>
            <text x={xDrop} y={yTop - 3} fill="#EDE4D3" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
              ⏰ Time Exc.
            </text>
          </g>
        );
      })}
      <text x="150" y="130" fill="#c9c0ae" fontSize="9" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        每跳 TTL 归零后回 ICMP，源据此拼出路径
      </text>
      <text x="150" y="180" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
        traceroute = 连续发 TTL=1,2,3... 的探测包
      </text>
    </svg>
  );
}

function OspfAreaViz({ accent = "#5EEAD4" }) {
  return (
    <svg viewBox="0 0 300 230" className="w-full">
      {/* Area 0 - backbone */}
      <ellipse cx="150" cy="115" rx="95" ry="55" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
      <text x="150" y="78" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        Area 0 · Backbone
      </text>
      {/* Backbone routers */}
      {[
        { x: 100, y: 115, l: "R1" },
        { x: 200, y: 115, l: "R2" },
        { x: 150, y: 140, l: "R3" },
      ].map((r, i) => (
        <g key={i}>
          <circle cx={r.x} cy={r.y} r="9" fill="#111827" stroke={accent} strokeWidth="1" />
          <text x={r.x} y={r.y + 2.5} fill={accent} fontSize="8" textAnchor="middle" fontFamily="monospace">
            {r.l}
          </text>
        </g>
      ))}
      <line x1="109" y1="115" x2="191" y2="115" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="105" y1="122" x2="145" y2="138" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="195" y1="122" x2="155" y2="138" stroke={accent} strokeWidth="0.8" opacity="0.6" />

      {/* ABR routers */}
      <circle cx="55" cy="115" r="9" fill="#111827" stroke="#EDE4D3" strokeWidth="1.2" />
      <text x="55" y="117.5" fill="#EDE4D3" fontSize="8" textAnchor="middle" fontFamily="monospace">
        ABR
      </text>
      <circle cx="245" cy="115" r="9" fill="#111827" stroke="#EDE4D3" strokeWidth="1.2" />
      <text x="245" y="117.5" fill="#EDE4D3" fontSize="8" textAnchor="middle" fontFamily="monospace">
        ABR
      </text>
      <line x1="64" y1="115" x2="91" y2="115" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      <line x1="209" y1="115" x2="236" y2="115" stroke={accent} strokeWidth="0.8" opacity="0.6" />

      {/* Area 1 - left */}
      <ellipse cx="40" cy="180" rx="38" ry="28" fill="none" stroke="#8A8175" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <text x="40" y="220" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        Area 1
      </text>
      <circle cx="40" cy="180" r="7" fill="#111827" stroke="#c9c0ae" strokeWidth="1" />
      <line x1="55" y1="124" x2="45" y2="173" stroke="#c9c0ae" strokeWidth="0.8" opacity="0.5" />

      {/* Area 2 - right */}
      <ellipse cx="260" cy="180" rx="38" ry="28" fill="none" stroke="#8A8175" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <text x="260" y="220" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        Area 2
      </text>
      <circle cx="260" cy="180" r="7" fill="#111827" stroke="#c9c0ae" strokeWidth="1" />
      <line x1="245" y1="124" x2="255" y2="173" stroke="#c9c0ae" strokeWidth="0.8" opacity="0.5" />

      <text x="150" y="15" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        所有非骨干区域必须连到 Area 0
      </text>
    </svg>
  );
}

function ArpExchangeViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);
  /* 4 steps: 0) broadcast query; 1) unicast reply; 2) write cache; 3) direct unicast */
  return (
    <svg viewBox="0 0 300 220" className="w-full">
      {/* A */}
      <rect x="15" y="90" width="70" height="44" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="50" y="108" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        Host A
      </text>
      <text x="50" y="124" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
        1.1.1.1 · aa:11
      </text>

      {/* B */}
      <rect x="215" y="90" width="70" height="44" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="250" y="108" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        Host B
      </text>
      <text x="250" y="124" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
        1.1.1.2 · bb:22
      </text>

      {/* wire */}
      <line x1="85" y1="112" x2="215" y2="112" stroke="#2a3343" strokeWidth="1" />

      {/* step badge */}
      <rect x="120" y="15" width="60" height="22" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="150" y="30" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        STEP 0{step + 1}
      </text>

      {/* messages by step */}
      <g key={step} style={{ animation: "fade 0.5s ease" }}>
        {step === 0 && (
          <>
            <text x="150" y="62" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              broadcast
            </text>
            <text x="150" y="78" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
              "who has 1.1.1.2?"
            </text>
            <path d="M 85 112 L 215 112" stroke="#EDE4D3" strokeWidth="1.5" markerEnd="url(#arp-arrow)" />
          </>
        )}
        {step === 1 && (
          <>
            <text x="150" y="62" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              unicast reply
            </text>
            <text x="150" y="78" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
              "I am 1.1.1.2, MAC=bb:22"
            </text>
            <path d="M 215 112 L 85 112" stroke="#EDE4D3" strokeWidth="1.5" markerEnd="url(#arp-arrow)" />
          </>
        )}
        {step === 2 && (
          <>
            <text x="150" y="62" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              cache updated
            </text>
            <text x="50" y="160" fill="#EDE4D3" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
              ARP table
            </text>
            <rect x="15" y="165" width="70" height="22" fill="#111827" stroke="#EDE4D3" strokeWidth="0.8" />
            <text x="50" y="179" fill="#EDE4D3" fontSize="8" textAnchor="middle" fontFamily="monospace">
              1.1.1.2 → bb:22
            </text>
          </>
        )}
        {step === 3 && (
          <>
            <text x="150" y="62" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              direct unicast
            </text>
            <text x="150" y="78" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
              no broadcast needed
            </text>
            <path d="M 85 112 L 215 112" stroke="#EDE4D3" strokeWidth="1.5" strokeDasharray="0" markerEnd="url(#arp-arrow)" />
            <rect x="15" y="165" width="70" height="22" fill="#111827" stroke="#EDE4D3" strokeWidth="0.8" />
            <text x="50" y="179" fill="#EDE4D3" fontSize="8" textAnchor="middle" fontFamily="monospace">
              1.1.1.2 → bb:22
            </text>
          </>
        )}
      </g>

      <defs>
        <marker id="arp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#EDE4D3" />
        </marker>
      </defs>
    </svg>
  );
}

function MplsViz({ accent = "#EDE4D3" }) {
  const lsrs = [
    { x: 30, y: 100, l: "Ingress", sub: "Push" },
    { x: 110, y: 100, l: "LSR", sub: "Swap" },
    { x: 190, y: 100, l: "LSR", sub: "Swap" },
    { x: 270, y: 100, l: "Egress", sub: "Pop" },
  ];
  const labels = [
    { from: 0, to: 1, txt: "L=17" },
    { from: 1, to: 2, txt: "L=42" },
    { from: 2, to: 3, txt: "L=9" },
  ];
  return (
    <svg viewBox="0 0 300 180" className="w-full">
      <text x="150" y="20" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        LSP · Label Switched Path
      </text>
      {/* line */}
      <line x1="30" y1="100" x2="270" y2="100" stroke="#2a3343" strokeWidth="1" />

      {lsrs.map((r, i) => (
        <g key={i}>
          <circle cx={r.x} cy={r.y} r="14" fill="#111827" stroke={accent} strokeWidth="1" />
          <text x={r.x} y={r.y + 3} fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
            {r.sub}
          </text>
          <text x={r.x} y={r.y + 28} fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            {r.l}
          </text>
        </g>
      ))}

      {labels.map((l, i) => {
        const a = lsrs[l.from];
        const b = lsrs[l.to];
        const mx = (a.x + b.x) / 2;
        return (
          <g key={i}>
            <rect x={mx - 18} y="76" width="36" height="16" fill="#111827" stroke={accent} strokeWidth="0.8" />
            <text x={mx} y="87" fill={accent} fontSize="8.5" textAnchor="middle" fontFamily="monospace">
              {l.txt}
            </text>
          </g>
        );
      })}

      <text x="30" y="150" fill="#8A8175" fontSize="8.5" fontFamily="monospace">
        Push 17 → Swap 17→42 → Swap 42→9 → Pop
      </text>
      <text x="30" y="165" fill="#8A8175" fontSize="8.5" fontFamily="monospace">
        中间 LSR 不查 IP 路由表，只查 Label FIB
      </text>
    </svg>
  );
}

function PppViz({ accent = "#FF8C42" }) {
  const phases = [
    { x: 30, label: "Dead", muted: true },
    { x: 90, label: "LCP", sub: "Establish" },
    { x: 150, label: "Auth", sub: "CHAP/PAP" },
    { x: 210, label: "NCP", sub: "IPCP" },
    { x: 270, label: "Open", sub: "Data", terminal: true },
  ];
  return (
    <svg viewBox="0 0 300 180" className="w-full">
      <text x="150" y="14" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        PPP 链路生命周期
      </text>
      {phases.slice(0, -1).map((p, i) => (
        <line
          key={`arr-${i}`}
          x1={p.x + 20}
          y1="85"
          x2={phases[i + 1].x - 20}
          y2="85"
          stroke={accent}
          strokeWidth="0.9"
          opacity="0.7"
          markerEnd="url(#ppp-arr)"
        />
      ))}
      {phases.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x - 20}
            y="70"
            width="40"
            height="32"
            fill="#111827"
            stroke={p.muted ? "#8A8175" : accent}
            strokeWidth="1"
            rx="2"
          />
          <text
            x={p.x}
            y="85"
            fill={p.muted ? "#8A8175" : accent}
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {p.label}
          </text>
          {p.sub && (
            <text x={p.x} y="96" fill="#8A8175" fontSize="7" textAnchor="middle" fontFamily="monospace">
              {p.sub}
            </text>
          )}
        </g>
      ))}
      <path
        d="M 270 102 Q 270 140 150 140 Q 30 140 30 102"
        fill="none"
        stroke="#8A8175"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.6"
        markerEnd="url(#ppp-arr-muted)"
      />
      <text x="150" y="158" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        Terminate → 回到 Dead
      </text>
      <defs>
        <marker id="ppp-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
        <marker id="ppp-arr-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#8A8175" />
        </marker>
      </defs>
    </svg>
  );
}

function RipViz({ accent = "#5EEAD4" }) {
  return (
    <svg viewBox="0 0 300 210" className="w-full">
      <text x="150" y="12" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        每 30 秒 · 把整张表喊给邻居
      </text>

      <rect x="15" y="30" width="50" height="28" fill="#111827" stroke={accent} strokeWidth="1" />
      <text x="40" y="48" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        R1
      </text>
      <rect x="235" y="30" width="50" height="28" fill="#111827" stroke={accent} strokeWidth="1" />
      <text x="260" y="48" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        R2
      </text>
      <line x1="65" y1="44" x2="235" y2="44" stroke="#c9c0ae" strokeWidth="0.8" opacity="0.5" />

      <path d="M 70 70 Q 150 85 230 70" fill="none" stroke={accent} strokeWidth="1" markerEnd="url(#rip-arr)" opacity="0.85" />
      <path d="M 230 95 Q 150 110 70 95" fill="none" stroke={accent} strokeWidth="1" markerEnd="url(#rip-arr)" opacity="0.85" />
      <text x="150" y="78" fill={accent} fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        full table
      </text>
      <text x="150" y="110" fill={accent} fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        full table
      </text>

      <text x="15" y="140" fill="#8A8175" fontSize="8" fontFamily="monospace">
        R1 route table
      </text>
      <rect x="15" y="145" width="120" height="56" fill="#111827" stroke="#2a3343" strokeWidth="0.8" />
      <text x="22" y="160" fill="#EDE4D3" fontSize="8" fontFamily="monospace">
        10.0.0.0/24  direct  d=0
      </text>
      <text x="22" y="175" fill={accent} fontSize="8" fontFamily="monospace">
        10.0.1.0/24  via R2  d=1
      </text>
      <text x="22" y="190" fill="#8A8175" fontSize="8" fontFamily="monospace">
        ...
      </text>

      <text x="165" y="140" fill="#8A8175" fontSize="8" fontFamily="monospace">
        R2 route table
      </text>
      <rect x="165" y="145" width="120" height="56" fill="#111827" stroke="#2a3343" strokeWidth="0.8" />
      <text x="172" y="160" fill="#EDE4D3" fontSize="8" fontFamily="monospace">
        10.0.1.0/24  direct  d=0
      </text>
      <text x="172" y="175" fill={accent} fontSize="8" fontFamily="monospace">
        10.0.0.0/24  via R1  d=1
      </text>
      <text x="172" y="190" fill="#8A8175" fontSize="8" fontFamily="monospace">
        ...
      </text>

      <defs>
        <marker id="rip-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
      </defs>
    </svg>
  );
}

function IsIsViz({ accent = "#5EEAD4" }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full">
      <text x="150" y="14" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        L1 区域 · L2 骨干 · L1/L2 边界
      </text>

      {/* L2 backbone line */}
      <line x1="40" y1="100" x2="260" y2="100" stroke={accent} strokeWidth="1.2" strokeDasharray="4 2" />
      <text x="150" y="88" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
        Level-2 Backbone
      </text>

      {/* L1/L2 boundary routers on backbone */}
      {[80, 150, 220].map((x, i) => (
        <g key={i}>
          <rect x={x - 12} y="90" width="24" height="20" fill="#111827" stroke="#EDE4D3" strokeWidth="1.2" />
          <text x={x} y="103" fill="#EDE4D3" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
            L1/L2
          </text>
        </g>
      ))}

      {/* L1 areas below */}
      {[
        { x: 80, id: "A" },
        { x: 150, id: "B" },
        { x: 220, id: "C" },
      ].map((area, i) => (
        <g key={i}>
          <ellipse cx={area.x} cy="175" rx="34" ry="22" fill="none" stroke="#8A8175" strokeWidth="1" strokeDasharray="3 2" opacity="0.55" />
          <circle cx={area.x - 12} cy={175} r="5" fill="#111827" stroke="#c9c0ae" strokeWidth="0.8" />
          <circle cx={area.x + 12} cy={175} r="5" fill="#111827" stroke="#c9c0ae" strokeWidth="0.8" />
          <line x1={area.x} y1={110} x2={area.x} y2={158} stroke="#c9c0ae" strokeWidth="0.8" opacity="0.5" />
          <text x={area.x} y="210" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            L1 · Area {area.id}
          </text>
        </g>
      ))}

      <text x="150" y="40" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        与 OSPF 不同 · 无强制 Area 0
      </text>
      <text x="150" y="54" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        L1 区域之间直接通过 L2 路径互联
      </text>
    </svg>
  );
}

function EigrpViz({ accent = "#5EEAD4" }) {
  return (
    <svg viewBox="0 0 300 210" className="w-full">
      <text x="150" y="14" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        DUAL · Successor + Feasible Successor
      </text>

      <circle cx="40" cy="100" r="15" fill="#111827" stroke={accent} strokeWidth="1.2" />
      <text x="40" y="104" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
        Src
      </text>
      <circle cx="260" cy="100" r="15" fill="#111827" stroke={accent} strokeWidth="1.2" />
      <text x="260" y="104" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
        Dst
      </text>

      {/* Successor path via N1 */}
      <circle cx="150" cy="50" r="13" fill="#111827" stroke={accent} strokeWidth="1.2" />
      <text x="150" y="54" fill={accent} fontSize="8" textAnchor="middle" fontFamily="monospace">
        N1
      </text>
      <line x1="54" y1="93" x2="140" y2="56" stroke={accent} strokeWidth="1.5" />
      <line x1="160" y1="56" x2="246" y2="93" stroke={accent} strokeWidth="1.5" />
      <text x="100" y="72" fill={accent} fontSize="7.5" fontFamily="monospace">
        FD=10
      </text>
      <text x="200" y="72" fill={accent} fontSize="7.5" fontFamily="monospace">
        RD=6
      </text>
      <text x="150" y="34" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        Successor · 主
      </text>

      {/* Feasible Successor via N2 */}
      <circle cx="150" cy="150" r="13" fill="#111827" stroke="#8A8175" strokeWidth="1" strokeDasharray="2 2" />
      <text x="150" y="154" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
        N2
      </text>
      <line x1="54" y1="107" x2="140" y2="144" stroke="#8A8175" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="160" y1="144" x2="246" y2="107" stroke="#8A8175" strokeWidth="1" strokeDasharray="3 2" />
      <text x="100" y="138" fill="#8A8175" fontSize="7.5" fontFamily="monospace">
        FD=15
      </text>
      <text x="200" y="138" fill="#8A8175" fontSize="7.5" fontFamily="monospace">
        RD=8
      </text>
      <text x="150" y="180" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        Feasible Successor · 备
      </text>

      <text x="150" y="200" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        主路径挂 → 直接切 FS，无须 DUAL 扩散
      </text>
    </svg>
  );
}

function BgpViz({ accent = "#5EEAD4" }) {
  const criteria = [
    { n: "01", l: "Weight (Cisco)", hint: "higher wins" },
    { n: "02", l: "Local Pref", hint: "higher wins" },
    { n: "03", l: "AS-PATH length", hint: "shorter wins" },
    { n: "04", l: "Origin · IGP > EGP > ?" },
    { n: "05", l: "MED", hint: "lower wins" },
    { n: "06", l: "eBGP > iBGP" },
    { n: "07", l: "IGP metric to nexthop" },
  ];
  return (
    <svg viewBox="0 0 300 230" className="w-full">
      <text x="150" y="14" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        BGP 选路决策 · 从上到下依次比较
      </text>
      {criteria.map((c, i) => {
        const y = 28 + i * 25;
        return (
          <g key={i}>
            <rect
              x="25"
              y={y}
              width="250"
              height="20"
              fill="#111827"
              stroke={accent}
              strokeWidth="0.8"
              opacity={1 - i * 0.07}
            />
            <text x="38" y={y + 14} fill={accent} fontSize="8.5" fontFamily="monospace">
              {c.n}
            </text>
            <text x="68" y={y + 14} fill="#EDE4D3" fontSize="9" fontFamily="monospace">
              {c.l}
            </text>
            {c.hint && (
              <text x="268" y={y + 14} fill="#8A8175" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontStyle="italic">
                {c.hint}
              </text>
            )}
          </g>
        );
      })}
      <text x="150" y="218" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        第一个分出胜负的规则 → 选定该路由
      </text>
    </svg>
  );
}

function IgmpViz({ accent = "#5EEAD4" }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, []);
  const hosts = [
    { y: 40, label: "H1" },
    { y: 100, label: "H2" },
    { y: 160, label: "H3" },
  ];
  return (
    <svg viewBox="0 0 300 210" className="w-full">
      <text x="150" y="14" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        router ↔ host · 组播成员管理
      </text>

      <rect x="15" y="82" width="60" height="36" fill="#111827" stroke={accent} strokeWidth="1.2" />
      <text x="45" y="104" fill={accent} fontSize="10" textAnchor="middle" fontFamily="monospace">
        Router
      </text>

      {hosts.map((h, i) => (
        <g key={i}>
          <line x1="75" y1="100" x2="227" y2={h.y} stroke="#2a3343" strokeWidth="0.8" />
          <circle cx="240" cy={h.y} r="13" fill="#111827" stroke="#c9c0ae" strokeWidth="1" />
          <text x="240" y={h.y + 3} fill="#EDE4D3" fontSize="9" textAnchor="middle" fontFamily="monospace">
            {h.label}
          </text>
        </g>
      ))}

      <g key={step} style={{ animation: "fade 0.5s ease" }}>
        {step === 0 && (
          <>
            {hosts.map((h, i) => (
              <path
                key={i}
                d={`M 75 100 Q 150 ${90 + i * 12} 227 ${h.y}`}
                fill="none"
                stroke={accent}
                strokeWidth="1"
                markerEnd="url(#igmp-arr)"
                opacity="0.85"
              />
            ))}
            <text x="150" y="194" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              Query · 「谁在听 224.1.1.1？」
            </text>
          </>
        )}
        {step === 1 && (
          <>
            <path d="M 227 40 L 75 95" stroke={accent} strokeWidth="1" markerEnd="url(#igmp-arr)" />
            <path d="M 227 100 L 75 108" stroke={accent} strokeWidth="1" markerEnd="url(#igmp-arr)" />
            <text x="150" y="194" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              Report · H1、H2 有兴趣；H3 沉默
            </text>
          </>
        )}
        {step === 2 && (
          <>
            <path d="M 227 40 L 75 95" stroke="#FF8C42" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#igmp-arr-leave)" />
            <text x="150" y="194" fill="#FF8C42" fontSize="9" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              Leave · H1 不再接收
            </text>
          </>
        )}
      </g>

      <defs>
        <marker id="igmp-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
        <marker id="igmp-arr-leave" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#FF8C42" />
        </marker>
      </defs>
    </svg>
  );
}

function NdpViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <svg viewBox="0 0 300 220" className="w-full">
      <rect x="15" y="90" width="70" height="44" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="50" y="108" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        Host A
      </text>
      <text x="50" y="124" fill="#8A8175" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
        fe80::1 · aa:11
      </text>
      <rect x="215" y="90" width="70" height="44" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="250" y="108" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        Host B
      </text>
      <text x="250" y="124" fill="#8A8175" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
        fe80::2 · bb:22
      </text>
      <line x1="85" y1="112" x2="215" y2="112" stroke="#2a3343" strokeWidth="1" />

      <rect x="120" y="15" width="60" height="22" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
      <text x="150" y="30" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace">
        STEP 0{step + 1}
      </text>

      <g key={step} style={{ animation: "fade 0.5s ease" }}>
        {step === 0 && (
          <>
            <text x="150" y="60" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              Neighbor Solicitation
            </text>
            <text x="150" y="75" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
              ICMPv6 · 送到 solicited-node 组播地址
            </text>
            <path d="M 85 112 L 215 112" stroke="#EDE4D3" strokeWidth="1.5" markerEnd="url(#ndp-arr)" />
          </>
        )}
        {step === 1 && (
          <>
            <text x="150" y="60" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              Neighbor Advertisement
            </text>
            <text x="150" y="75" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
              「fe80::2 的 MAC 是 bb:22」
            </text>
            <path d="M 215 112 L 85 112" stroke="#EDE4D3" strokeWidth="1.5" markerEnd="url(#ndp-arr)" />
          </>
        )}
        {step === 2 && (
          <>
            <text x="150" y="60" fill="#EDE4D3" fontSize="10" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
              RS / RA · 路由器发现
            </text>
            <text x="150" y="75" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace">
              主机收 RA 后自动配置地址（SLAAC）
            </text>
            <rect x="110" y="155" width="80" height="28" fill="#111827" stroke="#EDE4D3" strokeWidth="1" />
            <text x="150" y="173" fill="#EDE4D3" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Router
            </text>
            <path d="M 50 134 Q 110 160 130 155" fill="none" stroke="#EDE4D3" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#ndp-arr)" />
            <path d="M 170 155 Q 220 160 250 134" fill="none" stroke="#EDE4D3" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#ndp-arr)" />
          </>
        )}
      </g>

      <defs>
        <marker id="ndp-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#EDE4D3" />
        </marker>
      </defs>
    </svg>
  );
}

function LldpViz({ accent = "#FF8C42" }) {
  const switches = [
    { x: 55, name: "SW-A" },
    { x: 150, name: "SW-B" },
    { x: 245, name: "SW-C" },
  ];
  return (
    <svg viewBox="0 0 300 220" className="w-full">
      <text x="150" y="12" fill="#8A8175" fontSize="9" textAnchor="middle" fontFamily="monospace">
        邻居自报家门 · 每 30s 广播一次
      </text>

      {/* LLDPDU / TLV block */}
      <rect x="30" y="24" width="240" height="50" fill="#111827" stroke={accent} strokeWidth="0.8" />
      <text x="150" y="38" fill={accent} fontSize="8" textAnchor="middle" fontFamily="monospace">
        LLDPDU · TLV list
      </text>
      <text x="150" y="54" fill="#c9c0ae" fontSize="8" textAnchor="middle" fontFamily="monospace">
        Chassis ID · Port ID · TTL
      </text>
      <text x="150" y="67" fill="#c9c0ae" fontSize="8" textAnchor="middle" fontFamily="monospace">
        Sys Name · Sys Desc · Caps · VLAN ...
      </text>

      {/* Switches */}
      {switches.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 28} y="116" width="56" height="32" fill="#111827" stroke={accent} strokeWidth="1" />
          <text x={s.x} y="136" fill={accent} fontSize="9" textAnchor="middle" fontFamily="monospace">
            {s.name}
          </text>
        </g>
      ))}

      {/* Bidirectional LLDP between adjacent switches */}
      <path d="M 85 127 L 119 127" stroke={accent} strokeWidth="1" markerEnd="url(#lldp-arr)" />
      <path d="M 119 137 L 85 137" stroke={accent} strokeWidth="1" markerEnd="url(#lldp-arr)" />
      <path d="M 181 127 L 215 127" stroke={accent} strokeWidth="1" markerEnd="url(#lldp-arr)" />
      <path d="M 215 137 L 181 137" stroke={accent} strokeWidth="1" markerEnd="url(#lldp-arr)" />

      {/* A ↔ C invisible */}
      <path
        d="M 55 160 Q 150 200 245 160"
        fill="none"
        stroke="#8A8175"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.5"
      />
      <text x="150" y="194" fill="#8A8175" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        SW-A ⇠ 不可见 ⇢ SW-C
      </text>
      <text x="150" y="210" fill="#8A8175" fontSize="8" textAnchor="middle" fontFamily="monospace" fontStyle="italic">
        帧不跨交换机 · MAC 01:80:C2:00:00:0E
      </text>

      <defs>
        <marker id="lldp-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Viz dispatcher                                                    */
/* ------------------------------------------------------------------ */

function renderViz(id, accent) {
  switch (id) {
    case "ethernet-frame":
      return <EthernetFrameViz accent={accent} />;
    case "vlan-tag":
      return <VlanTagViz accent={accent} />;
    case "spanning-tree":
      return <SpanningTreeViz />;
    case "lacp":
      return <LacpViz accent={accent} />;
    case "lldp":
      return <LldpViz accent={accent} />;
    case "ppp":
      return <PppViz accent={accent} />;
    case "ip-header":
      return <IpHeaderViz accent={accent} />;
    case "traceroute":
      return <TracerouteViz accent={accent} />;
    case "rip":
      return <RipViz accent={accent} />;
    case "ospf-area":
      return <OspfAreaViz accent={accent} />;
    case "isis":
      return <IsIsViz accent={accent} />;
    case "eigrp":
      return <EigrpViz accent={accent} />;
    case "bgp":
      return <BgpViz accent={accent} />;
    case "igmp":
      return <IgmpViz accent={accent} />;
    case "arp":
      return <ArpExchangeViz />;
    case "ndp":
      return <NdpViz />;
    case "mpls":
      return <MplsViz accent={accent} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Protocol tabs                                                     */
/* ------------------------------------------------------------------ */

function ProtocolTabs({ protocols, accent }) {
  const [idx, setIdx] = useState(0);
  const active = protocols[idx];

  return (
    <div>
      {/* Tab bar */}
      <div
        className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0 mb-0 border-b"
        style={{ borderColor: "#1f2937", scrollbarWidth: "thin" }}
      >
        <div className="flex gap-0 min-w-max">
          {protocols.map((p, i) => {
            const on = i === idx;
            return (
              <button
                key={p.id}
                onClick={() => setIdx(i)}
                className="relative px-4 md:px-5 py-3 shrink-0 text-left transition-colors"
                style={{
                  color: on ? accent : "#8A8175",
                }}
              >
                <div
                  className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1"
                  style={{ opacity: on ? 1 : 0.7 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="font-mono text-[13px] whitespace-nowrap"
                  style={{ fontWeight: on ? 600 : 400 }}
                >
                  {p.name}
                </div>
                {on && (
                  <div
                    className="absolute left-0 right-0 bottom-[-1px] h-[2px]"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div key={active.id} style={{ animation: "fade 0.35s ease" }}>
        {/* Header */}
        <div className="pt-8 pb-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
          <div>
            <div
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: accent }}
            >
              {active.code}
            </div>
            <div
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: '"Fraunces", "Noto Serif SC", serif',
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ color: accent }}>{active.name}</span>
              <span className="text-[#8A8175] font-light mx-3">—</span>
              <span style={{ fontStyle: "italic" }}>{active.tagline}</span>
            </div>
          </div>
        </div>

        {/* Body: left text / right diagram */}
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-[1px] bg-[#1f2937]">
          <div className="bg-[#111827] p-6 md:p-8">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-3">
              作用 · Purpose
            </div>
            <p
              className="text-[#EDE4D3] text-[15px] leading-relaxed mb-8"
              style={{ fontWeight: 300 }}
            >
              {active.purpose}
            </p>

            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-4">
              工作原理 · How it works
            </div>
            <ol className="space-y-4">
              {active.how.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="font-mono text-[11px] pt-[3px] shrink-0"
                    style={{ color: accent, minWidth: "1.6em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      className="text-[14px] text-[#EDE4D3] mb-1"
                      style={{ fontWeight: 500 }}
                    >
                      {s.t}
                    </div>
                    <div className="text-[13px] text-[#c9c0ae] leading-relaxed">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>

            {active.notes && (
              <div className="mt-8 pt-5 border-t border-[#1f2937]">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-2">
                  备注 · Note
                </div>
                <div className="text-[13px] text-[#c9c0ae] leading-relaxed italic">
                  {active.notes}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#111827] p-6 md:p-8 flex flex-col">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-4">
              图示 · Diagram
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[240px]">
              {active.diagram ? (
                renderViz(active.diagram, accent)
              ) : (
                <div className="text-[#8A8175] italic text-sm font-mono">
                  ( no diagram for this protocol )
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export default function App() {
  const [active, setActive] = useState("datalink");
  const layer = active === "datalink" ? DATA_LINK : NETWORK;
  const tone = active === "datalink" ? "orange" : "cyan";
  const accent = active === "datalink" ? "#FF8C42" : "#5EEAD4";

  useEffect(() => {
    if (document.getElementById("custom-fonts")) return;
    const link = document.createElement("link");
    link.id = "custom-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,400&family=Noto+Serif+SC:wght@300;400;600;900&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundColor: "#0A0E17",
        color: "#EDE4D3",
        fontFamily: '"Noto Serif SC", "Fraunces", Georgia, serif',
      }}
    >
      <GridBg />

      <div
        className="relative max-w-[1180px] mx-auto px-6 md:px-10 py-10 md:py-14"
        style={{ zIndex: 1 }}
      >
        {/* ---------- Masthead ---------- */}
        <header className="flex items-start justify-between pb-8 border-b border-[#1f2937]">
          <div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-[#8A8175] uppercase mb-2">
              Computer Networks · Field Notes № 02
            </div>
            <div
              className="font-mono text-[11px] text-[#8A8175]"
              style={{ letterSpacing: "0.12em" }}
            >
              L2 / L3 · 协议 · 算法 · 机制
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[0.35em] text-[#8A8175] uppercase">
              2026 · 修订版
            </div>
          </div>
        </header>

        {/* ---------- Hero ---------- */}
        <section className="pt-12 pb-16 md:pt-16 md:pb-20 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <h1
              className="leading-[0.95] mb-6"
              style={{
                fontFamily: '"Fraunces", "Noto Serif SC", serif',
                fontWeight: 300,
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              在
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>
                {" "}两层{" "}
              </span>
              之间 ——
              <br />
              <span style={{ color: "#FF8C42", fontStyle: "italic" }}>交换</span>
              <span className="text-[#8A8175] font-light mx-3">/</span>
              <span style={{ color: "#5EEAD4", fontStyle: "italic" }}>路由</span>
            </h1>
            <p
              className="text-[#c9c0ae] text-lg leading-relaxed max-w-2xl"
              style={{ fontWeight: 300 }}
            >
              数据链路层回答的是「这个帧从哪个端口出去」，
              网络层回答的是「这个分组要交给哪个下一跳」。
              两个问题看上去相似，协议与算法却走向了完全不同的方向。
            </p>
          </div>
          <div className="md:col-span-4 md:border-l md:border-[#1f2937] md:pl-6 flex flex-col justify-end">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8A8175] mb-3">
              本册内容
            </div>
            <ul className="font-mono text-[13px] text-[#c9c0ae] space-y-2">
              <li className="flex items-baseline gap-3">
                <span className="text-[#FF8C42]">01</span>
                <span>L2 数据链路层 · 6 协议 / 6 机制</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[#5EEAD4]">02</span>
                <span>L3 网络层 · 8 协议 / 6 机制</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[#EDE4D3]">03</span>
                <span>四大路由算法对照</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[#EDE4D3]">04</span>
                <span>两层对照 + 跨层协议（ARP / NDP / MPLS）</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- Layer Toggle ---------- */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-[1px] bg-[#1f2937]">
            {[DATA_LINK, NETWORK].map((L) => {
              const isActive = active === L.id;
              const c = L.id === "datalink" ? "#FF8C42" : "#5EEAD4";
              return (
                <button
                  key={L.id}
                  onClick={() => setActive(L.id)}
                  className="text-left p-8 md:p-10 transition-all duration-300 group"
                  style={{
                    backgroundColor: isActive ? "#1A2332" : "#111827",
                    borderTop: `2px solid ${isActive ? c : "transparent"}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="font-mono text-[11px] tracking-[0.3em]"
                      style={{ color: c }}
                    >
                      {L.num} · {L.en.toUpperCase()}
                    </div>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.3}
                      color={isActive ? c : "#8A8175"}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div
                    className="text-4xl md:text-5xl mb-3"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <span style={{ color: isActive ? c : "#EDE4D3" }}>
                      {L.name}
                    </span>
                  </div>
                  <div
                    className="text-[#c9c0ae] text-sm leading-relaxed"
                    style={{ fontStyle: "italic" }}
                  >
                    {L.motto}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {L.keywords.map((k) => (
                      <span
                        key={k}
                        className="font-mono text-[10px] tracking-wider px-2 py-1"
                        style={{
                          color: isActive ? c : "#8A8175",
                          border: `1px solid ${isActive ? c : "#2a3343"}`,
                          opacity: isActive ? 0.9 : 0.7,
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------- Current Layer Content ---------- */}
        <section className="mb-24" key={layer.id}>
          <div
            className="flex items-end justify-between pb-5 mb-12 border-b border-[#1f2937]"
            style={{ animation: "fade 0.4s ease" }}
          >
            <div>
              <NumBadge n={`${layer.num} / ${layer.en}`} tone={tone} />
              <h2
                className="text-3xl md:text-4xl mt-3"
                style={{
                  fontFamily: '"Fraunces", "Noto Serif SC", serif',
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontStyle: "italic", color: accent }}>
                  {active === "datalink" ? "Local switching" : "Global routing"}
                </span>
                <span className="text-[#c9c0ae]"> · </span>
                {layer.name}全景
              </h2>
            </div>
            <div className="hidden md:block max-w-xs text-right">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-1">
                一句话
              </div>
              <div className="text-sm text-[#c9c0ae]" style={{ fontStyle: "italic" }}>
                {layer.long}
              </div>
            </div>
          </div>

          {/* 01 · Protocols (tabs) */}
          <div className="mb-20" style={{ animation: "fade 0.45s ease" }}>
            <SectionLabel tone={tone}>01 · 协议详解 — 逐个看</SectionLabel>
            <ProtocolTabs protocols={layer.protocols} accent={accent} />
          </div>

          {/* 02 · Mechanisms */}
          <div className="mb-20">
            <SectionLabel tone={tone}>02 · 核心机制 / 算法</SectionLabel>
            <div className="grid md:grid-cols-2 gap-[1px] bg-[#1f2937]">
              {layer.mechanisms.map((m, i) => (
                <div key={m.name} className="bg-[#111827] p-6 md:p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[11px]" style={{ color: accent }}>
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span
                      className="font-mono text-[9px] tracking-[0.2em] uppercase px-1.5 py-0.5"
                      style={{ color: "#8A8175", border: "1px solid #2a3343" }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <div
                    className="text-xl md:text-2xl mb-3"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.name}
                  </div>
                  <div className="text-sm text-[#c9c0ae] leading-relaxed">{m.idea}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 03 · Mechanism visualizations */}
          <div>
            <SectionLabel tone={tone}>03 · 机制可视化</SectionLabel>
            {active === "datalink" ? (
              <div className="grid md:grid-cols-2 gap-[1px] bg-[#1f2937]">
                <div className="bg-[#111827] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Cable size={14} strokeWidth={1.3} color="#FF8C42" />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "#FF8C42" }}
                    >
                      MAC 自学习
                    </span>
                  </div>
                  <div
                    className="text-xl mb-5"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontStyle: "italic",
                    }}
                  >
                    交换机如何建立转发表
                  </div>
                  <MacLearningViz />
                </div>
                <div className="bg-[#111827] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch size={14} strokeWidth={1.3} color="#FF8C42" />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "#FF8C42" }}
                    >
                      生成树
                    </span>
                  </div>
                  <div
                    className="text-xl mb-5"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontStyle: "italic",
                    }}
                  >
                    从环路拓扑选出一棵树
                  </div>
                  <SpanningTreeViz />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-[1px] bg-[#1f2937]">
                <div className="bg-[#111827] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Waves size={14} strokeWidth={1.3} color="#5EEAD4" />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "#5EEAD4" }}
                    >
                      Dijkstra · SPF
                    </span>
                  </div>
                  <div
                    className="text-xl mb-5"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontStyle: "italic",
                    }}
                  >
                    从源点计算最短路径树
                  </div>
                  <DijkstraViz />
                </div>
                <div className="bg-[#111827] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio size={14} strokeWidth={1.3} color="#5EEAD4" />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "#5EEAD4" }}
                    >
                      BGP · Path Vector
                    </span>
                  </div>
                  <div
                    className="text-xl mb-5"
                    style={{
                      fontFamily: '"Fraunces", "Noto Serif SC", serif',
                      fontStyle: "italic",
                    }}
                  >
                    跨自治系统的策略选路
                  </div>
                  <PathVectorViz />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ---------- Chapter 03 · Algorithms ---------- */}
        <section className="mb-24">
          <div className="flex items-end justify-between pb-5 mb-10 border-b border-[#1f2937]">
            <div>
              <NumBadge n="Chapter 03 · 路由算法" tone="cyan" />
              <h2
                className="text-3xl md:text-4xl mt-3"
                style={{
                  fontFamily: '"Fraunces", "Noto Serif SC", serif',
                  fontWeight: 300,
                }}
              >
                四大
                <span style={{ fontStyle: "italic", color: "#5EEAD4" }}>
                  {" "}路由算法{" "}
                </span>
                并置
              </h2>
            </div>
            <div className="hidden md:block text-[#8A8175] font-mono text-[11px]">
              DISTANCE · STATE · PATH · DUAL
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-[1px] bg-[#1f2937]">
            {ALGORITHMS.map((a, i) => (
              <div
                key={a.id}
                className="bg-[#111827] p-7 md:p-8 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 text-[120px] font-light leading-none opacity-[0.04] select-none"
                  style={{ fontFamily: '"Fraunces", serif', color: "#5EEAD4" }}
                >
                  {i + 1}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "#5EEAD4" }}
                  >
                    Algorithm · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  className="text-3xl mb-1"
                  style={{
                    fontFamily: '"Fraunces", "Noto Serif SC", serif',
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ fontStyle: "italic" }}>{a.sub}</span>
                </div>
                <div className="text-[#8A8175] text-sm mb-5">
                  {a.name} · 代表协议{" "}
                  <span style={{ color: "#5EEAD4", fontFamily: "monospace" }}>
                    {a.by}
                  </span>
                </div>
                <div
                  className="text-[#c9c0ae] text-[15px] leading-relaxed mb-5"
                  style={{ fontStyle: "italic", fontWeight: 300 }}
                >
                  「{a.gist}」
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px] font-mono">
                  <div>
                    <div className="text-[#8A8175] text-[10px] tracking-widest uppercase mb-1">
                      度量
                    </div>
                    <div className="text-[#EDE4D3]">{a.metric}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8175] text-[10px] tracking-widest uppercase mb-1">
                      收敛
                    </div>
                    <div className="text-[#EDE4D3]">{a.converge}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8175] text-[10px] tracking-widest uppercase mb-1">
                      环路
                    </div>
                    <div className="text-[#EDE4D3]">{a.loop}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8175] text-[10px] tracking-widest uppercase mb-1">
                      主要缓解
                    </div>
                    <div className="text-[#EDE4D3]">{a.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Chapter 04 · Comparison + Cross-layer ---------- */}
        <section className="mb-24">
          <div className="flex items-end justify-between pb-5 mb-10 border-b border-[#1f2937]">
            <div>
              <NumBadge n="Chapter 04 · 两层对照" tone="orange" />
              <h2
                className="text-3xl md:text-4xl mt-3"
                style={{
                  fontFamily: '"Fraunces", "Noto Serif SC", serif',
                  fontWeight: 300,
                }}
              >
                交换
                <span className="text-[#8A8175] mx-3 font-light">vs</span>
                路由
              </h2>
            </div>
          </div>

          {/* 04.1 Comparison matrix */}
          <div className="mb-16">
            <SectionLabel>04.1 · 对照矩阵</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#1f2937] relative">
              <div className="p-6 md:p-8" style={{ backgroundColor: "#0f0b09" }}>
                <div
                  className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: "#FF8C42" }}
                >
                  L2 · DATA LINK
                </div>
                <div
                  className="text-2xl mb-6"
                  style={{
                    fontFamily: '"Fraunces", "Noto Serif SC", serif',
                    fontStyle: "italic",
                  }}
                >
                  同一链路内的流动
                </div>
                {[
                  ["地址", "MAC 地址 · 48 bit"],
                  ["设备", "交换机 · 桥"],
                  ["范围", "广播域 · VLAN"],
                  ["转发键", "(VLAN, MAC) → 端口"],
                  ["建表方式", "自学习 · 泛洪"],
                  ["防环", "STP 生成树"],
                  ["冗余", "LACP 聚合"],
                  ["典型问题", "广播风暴"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-[#2a1d15] last:border-0 text-sm gap-4"
                  >
                    <span className="text-[#8A8175] font-mono text-[11px] tracking-wider uppercase shrink-0">
                      {k}
                    </span>
                    <span className="text-[#EDE4D3] text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 md:p-8" style={{ backgroundColor: "#081015" }}>
                <div
                  className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: "#5EEAD4" }}
                >
                  L3 · NETWORK
                </div>
                <div
                  className="text-2xl mb-6"
                  style={{
                    fontFamily: '"Fraunces", "Noto Serif SC", serif',
                    fontStyle: "italic",
                  }}
                >
                  跨网段的抵达
                </div>
                {[
                  ["地址", "IP 地址 · 32 / 128 bit"],
                  ["设备", "路由器 · 三层交换机"],
                  ["范围", "跨网段 · 跨自治系统"],
                  ["转发键", "最长前缀匹配"],
                  ["建表方式", "路由协议学习"],
                  ["防环", "TTL · 路径属性"],
                  ["冗余", "ECMP · 备份路径"],
                  ["典型问题", "环路 · 黑洞 · 次优路径"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-[#132027] last:border-0 text-sm gap-4"
                  >
                    <span className="text-[#8A8175] font-mono text-[11px] tracking-wider uppercase shrink-0">
                      {k}
                    </span>
                    <span className="text-[#EDE4D3] text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-[#111827] px-3 py-2 border border-[#1f2937]"
                aria-hidden
              >
                <span
                  className="font-mono text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "#FF8C42" }}
                >
                  L2
                </span>
                <span className="text-[#8A8175]">⇄</span>
                <span
                  className="font-mono text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "#5EEAD4" }}
                >
                  L3
                </span>
              </div>
            </div>
          </div>

          {/* 04.2 Cross-layer protocols */}
          <div>
            <SectionLabel>04.2 · 跨层协议 — 两层之间的粘合剂</SectionLabel>
            <p
              className="text-[#c9c0ae] text-[14px] leading-relaxed max-w-3xl mb-8"
              style={{ fontWeight: 300, fontStyle: "italic" }}
            >
              有些协议并不「干净」地落在某一层里——它们在二层和三层之间搬运信息，
              或者在两者之间插入一个新的交换平面。这里单独把它们挑出来看。
            </p>

            <div className="space-y-8">
              {CROSS_LAYER.map((p, i) => (
                <div key={p.id}>
                  <div className="flex items-end justify-between pb-3 mb-5 border-b border-[#1f2937]">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#EDE4D3] mb-2">
                        {String(i + 1).padStart(2, "0")} · {p.code} · {p.layers}
                      </div>
                      <div
                        className="text-2xl md:text-3xl"
                        style={{
                          fontFamily: '"Fraunces", "Noto Serif SC", serif',
                          fontWeight: 300,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <span style={{ color: "#EDE4D3" }}>{p.name}</span>
                        <span className="text-[#8A8175] font-light mx-3">—</span>
                        <span style={{ fontStyle: "italic" }}>{p.tagline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[1.1fr_1fr] gap-[1px] bg-[#1f2937]">
                    <div className="bg-[#111827] p-6 md:p-8">
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-3">
                        作用
                      </div>
                      <p
                        className="text-[#EDE4D3] text-[15px] leading-relaxed mb-7"
                        style={{ fontWeight: 300 }}
                      >
                        {p.purpose}
                      </p>

                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-4">
                        工作原理
                      </div>
                      <ol className="space-y-4 mb-7">
                        {p.how.map((s, j) => (
                          <li key={j} className="flex gap-4">
                            <span
                              className="font-mono text-[11px] pt-[3px] shrink-0"
                              style={{ color: "#EDE4D3", minWidth: "1.6em" }}
                            >
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <div
                                className="text-[14px] text-[#EDE4D3] mb-1"
                                style={{ fontWeight: 500 }}
                              >
                                {s.t}
                              </div>
                              <div className="text-[13px] text-[#c9c0ae] leading-relaxed">
                                {s.d}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>

                      <div className="pt-5 border-t border-[#1f2937]">
                        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-2">
                          为什么「跨层」
                        </div>
                        <div className="text-[13px] text-[#c9c0ae] leading-relaxed italic">
                          {p.why_cross}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111827] p-6 md:p-8 flex flex-col">
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175] mb-4">
                        图示
                      </div>
                      <div className="flex-1 flex items-center justify-center min-h-[240px]">
                        {p.diagram ? (
                          renderViz(p.diagram, "#EDE4D3")
                        ) : (
                          <div className="text-[#8A8175] italic text-sm font-mono">
                            ( no diagram )
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Quick Reference ---------- */}
        <section className="mb-16">
          <div className="flex items-end justify-between pb-5 mb-10 border-b border-[#1f2937]">
            <div>
              <NumBadge n="Appendix · 速记" tone="orange" />
              <h2
                className="text-3xl md:text-4xl mt-3"
                style={{
                  fontFamily: '"Fraunces", "Noto Serif SC", serif',
                  fontWeight: 300,
                }}
              >
                一眼
                <span style={{ fontStyle: "italic" }}> 抓主干</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-[1px] bg-[#1f2937]">
            {[
              { k: "二层交换机", v: "MAC 学习 · 泛洪 · STP · VLAN · LACP", c: "#FF8C42" },
              { k: "RIP", v: "距离向量 · Bellman-Ford · 跳数", c: "#5EEAD4" },
              { k: "OSPF / IS-IS", v: "链路状态 · Dijkstra · 分区域", c: "#5EEAD4" },
              { k: "BGP", v: "路径向量 · AS-PATH · 策略选路", c: "#5EEAD4" },
              { k: "EIGRP", v: "DUAL · 可行后继 · 快速收敛", c: "#5EEAD4" },
              { k: "IP 转发", v: "最长前缀匹配 · ECMP · CIDR 汇总", c: "#5EEAD4" },
              { k: "ARP / NDP", v: "IP → MAC · 广播问 · 单播答 · 写缓存", c: "#EDE4D3" },
              { k: "MPLS", v: "2.5 层 · 标签交换 · Push / Swap / Pop", c: "#EDE4D3" },
              { k: "两层一句话", v: "L2 问端口 · L3 问下一跳", c: "#EDE4D3" },
            ].map((r) => (
              <div key={r.k} className="bg-[#111827] p-5">
                <div
                  className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                  style={{ color: r.c }}
                >
                  {r.k}
                </div>
                <div
                  className="text-[15px] text-[#EDE4D3]"
                  style={{
                    fontFamily: '"Fraunces", "Noto Serif SC", serif',
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {r.v}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="pt-8 border-t border-[#1f2937] flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8175]">
            END · L2 问「哪个端口」 · L3 问「哪个下一跳」
          </div>
          <div className="flex items-center gap-2 text-[#8A8175]">
            <Circle size={6} fill="#FF8C42" stroke="#FF8C42" />
            <Circle size={6} fill="#5EEAD4" stroke="#5EEAD4" />
            <Circle size={6} fill="#EDE4D3" stroke="#EDE4D3" />
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::selection {
          background: ${active === "datalink" ? "#FF8C42" : "#5EEAD4"};
          color: #0A0E17;
        }
        ::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2a3343;
        }
      `}</style>
    </div>
  );
}
