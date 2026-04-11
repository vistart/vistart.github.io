import { useState, useEffect, useRef, useCallback } from "react";

const C = {
    bg: "#080d1a", panel: "#0c1422", border: "#192840",
    accent: "#00d4ff", accent2: "#ff6b35", accent3: "#39ff14",
    muted: "#3d5570", text: "#c0d8ef", dim: "#4e6e8e",
    client: "#00d4ff", server: "#ff6b35",
    tcp: "#a78bfa", tls: "#fbbf24", http: "#39ff14",
    ipv4: "#f472b6", ipv6: "#34d399",
    syn: "#a78bfa", ack: "#60a5fa", fin: "#fb923c", data: "#39ff14",
    win: "#fbbf24",
};

const ISN_C = 1000, ISN_S = 5000;
const REQ_BYTES = 400, RESP1 = 600, RESP2 = 600;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function Tag({ color, children, xs }) {
    return (
        <span style={{
            display: "inline-block",
            background: color + "20", border: `1px solid ${color}50`,
            color, borderRadius: 3,
            padding: xs ? "1px 5px" : "2px 8px",
            fontSize: xs ? 9 : 11,
            fontFamily: "monospace", fontWeight: 700, letterSpacing: .8,
        }}>{children}</span>
    );
}

function SectionTitle({ children }) {
    return (
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: 3, fontFamily: "monospace", marginBottom: 10, marginTop: 4 }}>
            {children}
        </div>
    );
}

function PacketRow({ label, flags = [], from, color, seq, ack, win, bytes, delay = 0, lpad, rpad }) {
    const startPct = from === "client" ? lpad : rpad;
    const endPct = from === "client" ? rpad : lpad;
    const [pct, setPct] = useState(startPct);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => {
            setVis(true);
            requestAnimationFrame(() => setTimeout(() => setPct(endPct), 30));
        }, delay);
        return () => clearTimeout(t1);
    }, []);

    if (!vis) return null;

    const flagStr = flags.join(" | ");
    return (
        <div style={{ position: "relative", height: 38, marginBottom: 2 }}>
            <div style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                left: `${Math.min(lpad, rpad)}%`, width: `${Math.abs(rpad - lpad)}%`,
                height: 1, background: color + "22",
            }} />
            <div style={{
                position: "absolute", left: `${pct}%`, transform: "translateX(-50%)",
                transition: `left ${.5 + (bytes || 0) / 4000}s cubic-bezier(.4,0,.2,1)`,
                background: color + "18", border: `1px solid ${color}80`,
                borderRadius: 5, padding: "3px 10px",
                fontSize: 11, fontFamily: "monospace", color, whiteSpace: "nowrap",
                boxShadow: `0 0 10px ${color}30`, zIndex: 2,
            }}>
                <span style={{ fontWeight: 700 }}>{label}</span>
                {flagStr && <span style={{ color: C.dim, marginLeft: 5, fontSize: 10 }}>[{flagStr}]</span>}
                {bytes && <span style={{ color: C.data, marginLeft: 5, fontSize: 9 }}>+{bytes}B</span>}
            </div>
            {(seq !== undefined || ack !== undefined) && (
                <div style={{
                    position: "absolute", left: `${pct}%`, transform: "translateX(-50%)", top: 24,
                    transition: `left ${.5 + (bytes || 0) / 4000}s cubic-bezier(.4,0,.2,1)`,
                    fontSize: 9, fontFamily: "monospace", color: C.dim, whiteSpace: "nowrap", zIndex: 2,
                }}>
                    {seq !== undefined && <span style={{ color: C.accent }}>seq={seq} </span>}
                    {ack !== undefined && <span style={{ color: C.accent2 }}>ack={ack} </span>}
                    {win !== undefined && <span style={{ color: C.win }}>win={win}</span>}
                </div>
            )}
        </div>
    );
}

function FlowDiagram({ phase, httpVer, ipVer, closeMode }) {
    const LPAD = 22, RPAD = 78;
    const [packets, setPackets] = useState([]);
    const keyRef = useRef(0);

    const emit = useCallback((props, delay) => {
        const id = keyRef.current++;
        setPackets(prev => [...prev, { ...props, id, delay, lpad: LPAD, rpad: RPAD }]);
    }, []);

    useEffect(() => {
        setPackets([]);
        keyRef.current = 0;
        let base = 0;
        const D = 620;

        if (phase === "handshake") {
            emit({ label: "SYN", flags: ["SYN"], from: "client", color: C.syn, seq: ISN_C, win: 65535 }, base); base += D;
            emit({ label: "SYN-ACK", flags: ["SYN", "ACK"], from: "server", color: C.syn, seq: ISN_S, ack: ISN_C + 1, win: 65535 }, base); base += D;
            emit({ label: "ACK + HTTP Request", flags: ["ACK", "PSH"], from: "client", color: C.http, seq: ISN_C + 1, ack: ISN_S + 1, win: 65535, bytes: REQ_BYTES }, base); base += D;
            emit({ label: "ACK", flags: ["ACK"], from: "server", color: C.ack, seq: ISN_S + 1, ack: ISN_C + 1 + REQ_BYTES, win: 65535 }, base);
        } else if (phase === "transfer") {
            const c1 = ISN_C + 1 + REQ_BYTES, s1 = ISN_S + 1;
            if (httpVer === "1") {
                emit({ label: "← 200 OK  chunk-1", flags: ["ACK", "PSH"], from: "server", color: C.http, seq: s1, ack: c1, win: 65535, bytes: RESP1 }, base); base += D;
                emit({ label: "ACK →", flags: ["ACK"], from: "client", color: C.ack, seq: c1, ack: s1 + RESP1, win: 65535 }, base); base += D;
                emit({ label: "← 200 OK  chunk-2", flags: ["ACK", "PSH"], from: "server", color: C.http, seq: s1 + RESP1, ack: c1, win: 65535, bytes: RESP2 }, base); base += D;
                emit({ label: "ACK →", flags: ["ACK"], from: "client", color: C.ack, seq: c1, ack: s1 + RESP1 + RESP2, win: 65535 }, base); base += D;
                emit({ label: "← WINDOW_UPDATE", flags: ["ACK"], from: "client", color: C.win, seq: c1, ack: s1 + RESP1 + RESP2, win: 131070 }, base);
            } else {
                emit({ label: "HEADERS [Stream 1]", flags: ["END_HEADERS"], from: "client", color: C.http, seq: c1, ack: s1, win: 65535 }, base); base += 300;
                emit({ label: "HEADERS [Stream 3]", flags: ["END_HEADERS"], from: "client", color: "#22d3ee", seq: c1 + 20, ack: s1, win: 65535 }, base); base += D;
                emit({ label: "DATA [Stream 1]", flags: ["END_STREAM"], from: "server", color: C.http, seq: s1, ack: c1 + 40, win: 65535, bytes: RESP1 }, base); base += 300;
                emit({ label: "DATA [Stream 3]", flags: ["END_STREAM"], from: "server", color: "#22d3ee", seq: s1 + RESP1, ack: c1 + 40, win: 65535, bytes: 200 }, base); base += D;
                emit({ label: "WINDOW_UPDATE [conn]", flags: [], from: "client", color: C.win, seq: c1 + 40, ack: s1 + RESP1 + 200, win: 131070 }, base);
            }
        } else if (phase === "close") {
            const cSeq = ISN_C + 1 + REQ_BYTES, sSeq = ISN_S + 1 + RESP1 + RESP2;
            if (closeMode === "half") {
                emit({ label: "FIN", flags: ["FIN", "ACK"], from: "client", color: C.fin, seq: cSeq, ack: sSeq }, base); base += D;
                emit({ label: "ACK  (半关闭完成)", flags: ["ACK"], from: "server", color: C.ack, seq: sSeq, ack: cSeq + 1 }, base); base += D;
                emit({ label: "← 剩余数据", flags: ["ACK", "PSH"], from: "server", color: C.http, seq: sSeq, ack: cSeq + 1, bytes: 120 }, base); base += D;
                emit({ label: "ACK →", flags: ["ACK"], from: "client", color: C.ack, seq: cSeq + 1, ack: sSeq + 120 }, base); base += D;
                emit({ label: "FIN", flags: ["FIN", "ACK"], from: "server", color: C.fin, seq: sSeq + 120, ack: cSeq + 1 }, base); base += D;
                emit({ label: "ACK  [TIME_WAIT]", flags: ["ACK"], from: "client", color: C.ack, seq: cSeq + 1, ack: sSeq + 121 }, base);
            } else {
                emit({ label: "FIN", flags: ["FIN", "ACK"], from: "client", color: C.fin, seq: cSeq, ack: sSeq }, base); base += D;
                emit({ label: "ACK", flags: ["ACK"], from: "server", color: C.ack, seq: sSeq, ack: cSeq + 1 }, base); base += D;
                emit({ label: "FIN", flags: ["FIN", "ACK"], from: "server", color: C.fin, seq: sSeq, ack: cSeq + 1 }, base); base += D;
                emit({ label: "ACK  [TIME_WAIT 2MSL]", flags: ["ACK"], from: "client", color: C.ack, seq: cSeq + 1, ack: sSeq + 1 }, base);
            }
        }
    }, [phase, httpVer, ipVer, closeMode]);

    return (
        <div style={{ background: "#060b16", borderRadius: 8, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", marginBottom: 10 }}>
                <div style={{ width: `${LPAD}%`, display: "flex", justifyContent: "flex-end", paddingRight: 8 }}>
                    <div style={{ background: C.client + "18", border: `1px solid ${C.client}44`, borderRadius: 5, padding: "4px 12px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.client, boxShadow: `0 0 8px ${C.client}20` }}>CLIENT</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ width: `${100 - RPAD}%`, display: "flex", justifyContent: "flex-start", paddingLeft: 8 }}>
                    <div style={{ background: C.server + "18", border: `1px solid ${C.server}44`, borderRadius: 5, padding: "4px 12px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.server, boxShadow: `0 0 8px ${C.server}20` }}>SERVER</div>
                </div>
            </div>
            <div style={{ position: "relative", minHeight: 240, borderTop: `1px dashed ${C.border}`, borderBottom: `1px dashed ${C.border}`, padding: "10px 0" }}>
                <div style={{ position: "absolute", left: `${LPAD}%`, top: 0, bottom: 0, width: 1, background: C.client + "30" }} />
                <div style={{ position: "absolute", left: `${RPAD}%`, top: 0, bottom: 0, width: 1, background: C.server + "30" }} />
                {packets.map(p => <PacketRow key={p.id} {...p} />)}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                {[{ color: C.syn, label: "SYN/握手" }, { color: C.ack, label: "ACK/确认" }, { color: C.http, label: "HTTP数据" }, { color: C.fin, label: "FIN/断连" }, { color: C.win, label: "窗口控制" }].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: C.dim }}>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SlidingWindowViz() {
    const [step, setStep] = useState(0);
    const SEG = 8;
    const states = [
        { title: "初始状态：窗口大小 = 4", desc: "发送方可以发送 4 个段而无需等待 ACK（窗口大小 = 4）", segs: [{ label: "ACK'd", color: "#1f4a1f" }, { label: "Send", color: C.http }, { label: "Send", color: C.http }, { label: "Send", color: C.http }, { label: "Send", color: C.http }, { label: "Blocked", color: C.muted, blocked: true }, { label: "Blocked", color: C.muted, blocked: true }, { label: "Blocked", color: C.muted, blocked: true }], window: [1, 2, 3, 4] },
        { title: "发送 seg1~4，等待 ACK", desc: "四个段全部发出，尚未收到 ACK —— 「已发送未确认」占满整个窗口", segs: [{ label: "ACK'd", color: "#1f4a1f" }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "Blocked", color: C.muted, blocked: true }, { label: "Blocked", color: C.muted, blocked: true }, { label: "Blocked", color: C.muted, blocked: true }], window: [1, 2, 3, 4] },
        { title: "收到 ACK(ack=seq2) —— 窗口滑动", desc: "接收方确认了 seg1，窗口向右滑动 1 格，现在可以发送 seg5", segs: [{ label: "ACK'd", color: "#1f4a1f" }, { label: "ACK'd", color: "#1f4a1f" }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "Send", color: C.http }, { label: "Blocked", color: C.muted, blocked: true }, { label: "Blocked", color: C.muted, blocked: true }], window: [2, 3, 4, 5] },
        { title: "收到 ACK(ack=seq4) —— 累计确认", desc: "TCP 累计确认：一个 ACK 可确认多个段（seg2~3 一起确认），窗口再滑动 2 格", segs: [{ label: "ACK'd", color: "#1f4a1f" }, { label: "ACK'd", color: "#1f4a1f" }, { label: "ACK'd", color: "#1f4a1f" }, { label: "ACK'd", color: "#1f4a1f" }, { label: "In-flight", color: C.tls }, { label: "In-flight", color: C.tls }, { label: "Send", color: C.http }, { label: "Send", color: C.http }], window: [4, 5, 6, 7] },
    ];
    const cur = states[step];
    const segW = 100 / SEG;
    return (
        <div style={{ background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{cur.title}</div>
                    <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{cur.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setStep(s => Math.max(0, s - 1))} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: "monospace", fontSize: 11 }}>◀</button>
                    <span style={{ color: C.dim, fontFamily: "monospace", fontSize: 11, alignSelf: "center" }}>{step + 1}/{states.length}</span>
                    <button onClick={() => setStep(s => Math.min(states.length - 1, s + 1))} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontFamily: "monospace", fontSize: 11 }}>▶</button>
                </div>
            </div>
            <div style={{ display: "flex", height: 44, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                {cur.segs.map((seg, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: seg.color + (seg.blocked ? "18" : "28"), border: `1px solid ${seg.color}50`, borderLeft: i === 0 ? undefined : "none", transition: "background .4s" }}>
                        <span style={{ fontSize: 9, fontFamily: "monospace", color: seg.blocked ? C.muted : seg.color, fontWeight: 700 }}>{seg.label === "ACK'd" ? "✓" : seg.label === "In-flight" ? "✈" : seg.label === "Send" ? "→" : "✗"}</span>
                        <span style={{ fontSize: 8, color: C.dim, fontFamily: "monospace" }}>s{i + 1}</span>
                    </div>
                ))}
            </div>
            <div style={{ height: 16, position: "relative", marginBottom: 12 }}>
                {cur.window.length > 0 && (
                    <div style={{ position: "absolute", left: `${cur.window[0] * segW}%`, width: `${cur.window.length * segW}%`, border: `2px solid ${C.win}`, borderRadius: 3, height: "100%", background: C.win + "10" }}>
                        <span style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: C.win, fontFamily: "monospace", whiteSpace: "nowrap" }}>← 发送窗口 ({cur.window.length} 段) →</span>
                    </div>
                )}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[{ color: "#1f4a1f", label: "已确认 (ACK'd)" }, { color: C.tls, label: "已发送未确认 (In-flight)" }, { color: C.http, label: "可发送 (in window)" }, { color: C.muted, label: "窗口外 (blocked)" }, { color: C.win, label: "当前窗口" }].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                        <span style={{ fontSize: 10, color: C.dim, fontFamily: "monospace" }}>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Packet format bit-field diagram ──────────────────────────────────────
// ─── Field detail database ────────────────────────────────────────────────
const FIELD_DB = {
    // ── IPv4 ──────────────────────────────────────────────────────────────
    "Ver=4": {
        full: "Version（版本号）",
        bits: 4, layer: "IPv4",
        desc: "标识 IP 协议版本。值固定为 4，表示 IPv4。路由器据此选择解析规则。",
        detail: "4 位字段，位于 IP 首部第 1 字节的高 4 位。收到值为 6 的包则按 IPv6 解析，其余值丢弃并可能回 ICMP 参数问题报文。",
        phase: { handshake: "SYN 包中 Ver=4，路由器确认协议版本后转发", transfer: "数据段中与握手相同，保持 Ver=4", close: "FIN 包中同样携带 Ver=4" },
        related: [
            { field: "IHL", rel: "共同描述 IP 首部的版本和长度，路由器先读 Ver 再读 IHL 来定位 TCP 首部" },
            { field: "Protocol=6", rel: "Ver 决定哪个字段存放上层协议号（IPv4 用 Protocol，IPv6 用 Next Header）" },
        ],
    },
    "IHL": {
        full: "Internet Header Length（首部长度）",
        bits: 4, layer: "IPv4",
        desc: "以 32 位字（4 字节）为单位的 IP 首部长度。最小值 5（即 20 字节），最大值 15（即 60 字节，含 40 字节选项）。",
        detail: "TCP/IP 栈用 IHL 计算 TCP 首部的起始偏移：TCP offset = IP packet start + IHL × 4。若携带 IP 选项（如时间戳、路由记录），IHL > 5。",
        phase: { handshake: "通常 IHL=5（20B），握手时可能含时间戳选项使 IHL=6", transfer: "IHL=5，数据段通常不含 IP 选项", close: "IHL=5，与握手包相同" },
        related: [
            { field: "Ver=4", rel: "IHL 只在 IPv4 中存在；IPv6 首部固定 40B，无此字段" },
            { field: "Total Length", rel: "Payload 长度 = Total Length − IHL×4 − TCP首部长度" },
        ],
    },
    "DSCP": {
        full: "Differentiated Services Code Point（差分服务代码点）",
        bits: 6, layer: "IPv4",
        desc: "QoS 优先级标记。路由器据此实施流量调度（排队、限速、丢弃策略）。替代了原始 IP 首部的 ToS 字段高 6 位。",
        detail: "常见值：0（BE 尽力）、46（EF 加速转发，适合音视频）、34（AF41，视频会议）。HTTP 连接通常 DSCP=0，企业网中 HTTPS 流量可能被标记为更高优先级。",
        phase: { handshake: "SYN 一般 DSCP=0，部分 OS 对 SYN 包设置特定 DSCP", transfer: "应用可通过 setsockopt(IP_TOS) 设置，影响全部数据段", close: "FIN 包沿用连接的 DSCP 设置" },
        related: [
            { field: "ECN", rel: "DSCP 占高 6 位，ECN 占低 2 位，合称原 ToS 字节（RFC 2474）" },
            { field: "Window Size", rel: "DSCP 高优先级 + 大窗口 = 高吞吐低延迟路径的双重保障" },
        ],
    },
    "ECN": {
        full: "Explicit Congestion Notification（显式拥塞通知）",
        bits: 2, layer: "IPv4",
        desc: "路由器在检测到拥塞时，将 ECN 置为 11（CE），通知端点降速——无需丢包即可感知拥塞。",
        detail: "需要两端都支持（握手时 TCP SYN 携带 ECE+CWR 标志协商）。路由器置 CE 后，接收方在 ACK 中置 ECE，发送方置 CWR 确认已降速。",
        phase: { handshake: "SYN: ECN=10(ECT0) 或 01(ECT1) 表示支持；SYN-ACK 回应是否协商成功", transfer: "拥塞时路由器将 ECN 改为 11(CE)，接收方 ACK 中 ECE=1 通知发送方", close: "FIN 包通常 ECN=00，无需拥塞通知" },
        related: [
            { field: "ECE", rel: "接收方将 IP 中 ECN=CE 转化为 TCP ACK 的 ECE 标志，通知发送方" },
            { field: "CWR", rel: "发送方收到 ECE 后降低拥塞窗口，并在下一包置 CWR=1 确认" },
            { field: "NS", rel: "NS(Nonce Sum) 防止接收方欺骗性地清除 CE 标记，保护 ECN 机制完整性" },
        ],
    },
    "Total Length": {
        full: "Total Length（总长度）",
        bits: 16, layer: "IPv4",
        desc: "整个 IP 数据报的长度（字节），含 IP 首部 + TCP 首部 + 数据。最大 65535 字节，实际受链路 MTU 限制（通常 1500B）。",
        detail: "TCP 层通过 MSS（最大段大小）控制每段大小，使 IP 报文不超过 MTU，避免分片。Total Length - IHL×4 = TCP段长度（含TCP首部）。",
        phase: { handshake: "SYN 无数据，约 60B（20IP+20TCP+20选项）", transfer: "数据段最大约 1500B（MTU），TCP 分段确保不超出", close: "FIN 无数据，约 40~60B" },
        related: [
            { field: "IHL", rel: "TCP 首部偏移 = IHL×4；TCP段长 = Total Length - IHL×4" },
            { field: "Fragment Offset", rel: "超过 MTU 时 IP 分片，每个分片有自己的 Total Length" },
            { field: "Sequence Number", rel: "TCP 用 seq 追踪字节偏移，与 IP Total Length 共同确定数据范围" },
        ],
    },
    "Identification": {
        full: "Identification（标识符）",
        bits: 16, layer: "IPv4",
        desc: "用于标识同一个 IP 数据报的所有分片。目标主机用 Identification + Source IP 来将分片重组成原始报文。",
        detail: "现代网络通常设置 DF（Don't Fragment）标志，禁止分片，Identification 字段意义不大。若强制分片，同一数据报的所有分片有相同 Identification。",
        phase: { handshake: "SYN 包设置 DF=1，Identification 为随机值（通常不分片）", transfer: "TCP 用 MSS 控制分段大小避免 IP 分片；若分片，此字段关键", close: "FIN 小包通常设 DF=1，不分片" },
        related: [
            { field: "Flags", rel: "Flags.DF=1 禁止分片（此时 Identification 不重要）；DF=0 允许分片（Identification 必须唯一）" },
            { field: "Fragment Offset", rel: "同一 Identification 的不同分片通过 Fragment Offset 排序重组" },
        ],
    },
    "Flags": {
        full: "Flags（分片标志）",
        bits: 3, layer: "IPv4",
        desc: "3 位标志：bit0 保留(=0)；bit1 DF（Don't Fragment，禁止分片）；bit2 MF（More Fragments，后面还有分片）。",
        detail: "现代 HTTPS 连接通常 DF=1，依赖 PMTUD（路径 MTU 发现）自动适配链路 MTU。若路由器需要分片且 DF=1，会丢包并回 ICMP「需要分片」消息（Type 3 Code 4）。",
        phase: { handshake: "SYN 包 DF=1，MF=0；开启 PMTUD 探测路径最小 MTU", transfer: "数据段 DF=1；TCP MSS 协商确保不超出 MTU", close: "FIN 包 DF=1，MF=0" },
        related: [
            { field: "Identification", rel: "MF=1 时 Identification 用于分片重组" },
            { field: "Fragment Offset", rel: "MF=1 时 Fragment Offset 指示本分片在原始数据中的位置" },
            { field: "Total Length", rel: "DF=1 + 超大报文 → ICMP 反馈，TCP 降低 MSS 重试" },
        ],
    },
    "Fragment Offset": {
        full: "Fragment Offset（分片偏移）",
        bits: 13, layer: "IPv4",
        desc: "以 8 字节为单位，表示本分片数据相对于原始 IP 数据报起始的偏移量。重组时用于排序。",
        detail: "第一个分片 Offset=0，后续分片 Offset=(前分片数据长度)/8。最大偏移 8191×8=65528 字节，与 Total Length 最大值吻合。",
        phase: { handshake: "通常不分片，Offset=0", transfer: "若发生分片（少见），Offset 标记每段位置", close: "FIN 包不分片，Offset=0" },
        related: [
            { field: "Flags", rel: "Flags.MF=0 且 Offset=0 → 未分片或最后一片" },
            { field: "Identification", rel: "重组时按 Identification 分组，再按 Fragment Offset 排序" },
        ],
    },
    "TTL": {
        full: "Time To Live（存活时间 / 跳数限制）",
        bits: 8, layer: "IPv4",
        desc: "报文最多经过的路由器跳数。每经过一个路由器减 1，归零时丢弃并回 ICMP Time Exceeded（Type 11），防止报文无限循环。",
        detail: "Linux 默认 TTL=64，Windows=128，网络设备=255。traceroute 正是利用 TTL 从 1 递增，每次触发 ICMP TTL Exceeded 来探测路径。",
        phase: { handshake: "SYN 出发时 TTL=64（Linux），每经一跳减1；对端看到的 TTL 可推算大致跳数", transfer: "数据段 TTL 与握手包相同，连接内保持不变", close: "FIN 包 TTL 同上，通常不变" },
        related: [
            { field: "Hop Limit", rel: "IPv6 中 Hop Limit 是 TTL 的等价字段，语义完全相同但名字更准确（从未以时间为单位）" },
            { field: "Header Checksum", rel: "每跳 TTL 减 1 后，路由器必须重新计算 Header Checksum（IPv6 无此开销）" },
        ],
    },
    "Protocol=6 (TCP)": {
        full: "Protocol（上层协议号）",
        bits: 8, layer: "IPv4",
        desc: "标识 IP Payload 中的上层协议。值 6 = TCP，17 = UDP，1 = ICMP，89 = OSPF。目标主机据此将 Payload 交给对应协议栈。",
        detail: "与端口号共同构成「套接字」标识：IP层靠 Protocol 找到 TCP 栈，TCP 层靠端口号找到具体进程。防火墙可通过此字段实现协议级过滤。",
        phase: { handshake: "所有阶段均为 6（TCP）；TLS 在 TCP 之上，不体现在 Protocol 字段", transfer: "Protocol=6 贯穿连接全程", close: "FIN 包 Protocol=6，与握手包完全相同" },
        related: [
            { field: "Next Header=6 (TCP)", rel: "IPv6 中的等价字段；支持扩展头链，Next Header 可先指向扩展头再指向 TCP" },
            { field: "Source Port / Destination Port", rel: "Protocol=6 → 交给 TCP 栈 → 再由端口号路由到进程" },
        ],
    },
    "Header Checksum": {
        full: "Header Checksum（首部校验和）",
        bits: 16, layer: "IPv4",
        desc: "仅覆盖 IP 首部（不含数据）的 16 位反码求和。路由器每跳修改 TTL 后必须重新计算，增加了转发开销。",
        detail: "算法：将首部（含校验和字段置0）按 16 位分组求反码和，结果存入校验和字段。接收方对整个首部（含校验和）再求反码和，结果应为全 1（0xFFFF）。IPv6 去掉了此字段，校验交给链路层（Ethernet CRC）和传输层（TCP Checksum）。",
        phase: { handshake: "SYN 到服务器经过的每个路由器都会重算（TTL减1）", transfer: "数据段每跳重算，高速转发场景是性能瓶颈", close: "FIN 包同样每跳重算" },
        related: [
            { field: "TTL", rel: "TTL 每减 1，Checksum 必须更新（路由器硬件通常用增量更新算法）" },
            { field: "Checksum (TCP)", rel: "IP Checksum 只保护 IP 首部；TCP Checksum 保护 TCP 首部+数据+伪首部（含 IP 地址）" },
        ],
    },
    "Source IP (32-bit)": {
        full: "Source IP Address（源 IP 地址）",
        bits: 32, layer: "IPv4",
        desc: "发送方的 IPv4 地址（32位，通常写为点分十进制如 192.168.1.10）。NAT 设备会将私有地址替换为公网地址。",
        detail: "TCP 的「连接四元组」由 {srcIP, srcPort, dstIP, dstPort} 确定。NAT 替换 srcIP 时，也会同步更新 IP Checksum 和 TCP Checksum（伪首部含 IP 地址）。",
        phase: { handshake: "SYN 包 srcIP = 客户端 IP（经 NAT 后为公网 IP）", transfer: "数据段 srcIP 保持不变；HTTP/3 的连接 ID 可让连接在 IP 变化后存活", close: "FIN 包 srcIP 与握手包相同" },
        related: [
            { field: "Destination IP (32-bit)", rel: "srcIP + dstIP + TCP 四元组唯一标识一条连接" },
            { field: "Checksum (TCP)", rel: "TCP 伪首部包含 srcIP 和 dstIP，IP 地址变化（如 NAT）必须同步更新 TCP Checksum" },
            { field: "Source IPv6", rel: "IPv6 将地址扩展到 128 位（4×32 位行），消除了 NAT 的必要性" },
        ],
    },
    "Destination IP (32-bit)": {
        full: "Destination IP Address（目标 IP 地址）",
        bits: 32, layer: "IPv4",
        desc: "接收方的 IPv4 地址。路由器根据此字段查找路由表，决定下一跳。",
        detail: "服务器可有多个虚拟主机（VIP），负载均衡器根据 dstIP 将流量分发到后端。HTTPS 中 dstIP 决定使用哪个 TLS 证书（SNI 扩展辅助）。",
        phase: { handshake: "SYN 包 dstIP = 服务器 IP，路由器逐跳转发", transfer: "dstIP 贯穿连接不变（TCP 连接期间无法切换 IP）", close: "FIN 包 dstIP 与握手包相同" },
        related: [
            { field: "Source IP (32-bit)", rel: "路由决策依赖 dstIP；回程包中 srcIP 和 dstIP 互换" },
            { field: "TTL", rel: "TTL 限制了报文能到达的最大跳数，间接限制了 dstIP 的可达范围" },
        ],
    },

    // ── IPv6 ──────────────────────────────────────────────────────────────
    "Ver=6": {
        full: "Version（版本号）",
        bits: 4, layer: "IPv6",
        desc: "标识 IPv6 协议，值固定为 6。路由器据此按 IPv6 规则（40B 固定首部）解析报文，不同于 IPv4 的可变长首部。",
        detail: "双栈（Dual Stack）设备同时支持 IPv4 和 IPv6，根据 Ver 字段决定用哪套协议栈处理。6to4、Teredo 等隧道技术将 IPv6 包封装在 IPv4 里传输。",
        phase: { handshake: "SYN 包 Ver=6，路由器按 IPv6 转发规则处理（无 Checksum，无分片）", transfer: "数据段 Ver=6，固定首部提升转发效率", close: "FIN 包 Ver=6，同上" },
        related: [
            { field: "Next Header=6 (TCP)", rel: "Ver=6 决定首部为 40B 固定；Next Header 替代 IPv4 Protocol 字段指向上层协议" },
            { field: "Hop Limit", rel: "Ver=6 对应 Hop Limit（无校验和，路由器减 Hop Limit 无需重算 Checksum，提升性能）" },
        ],
    },
    "Traffic Class": {
        full: "Traffic Class（流量类别）",
        bits: 8, layer: "IPv6",
        desc: "等价于 IPv4 的 ToS 字节（DSCP 6位 + ECN 2位）。高 6 位为 DSCP QoS 标记，低 2 位为 ECN 拥塞通知。",
        detail: "语义与 IPv4 DSCP/ECN 完全相同，命名改为 Traffic Class 以更清晰体现用途。双栈迁移时，Traffic Class 和 IPv4 ToS 字段可直接映射。",
        phase: { handshake: "通常 Traffic Class=0，SYN 标准尽力转发", transfer: "应用可通过 setsockopt(IPV6_TCLASS) 设置", close: "FIN 包继承连接的 Traffic Class" },
        related: [
            { field: "ECN", rel: "低 2 位 ECN 的语义与 IPv4 ECN 完全相同" },
            { field: "Flow Label", rel: "Traffic Class 按包设置 QoS；Flow Label 标识整个流，更粗粒度" },
        ],
    },
    "Flow Label": {
        full: "Flow Label（流标签）",
        bits: 20, layer: "IPv6",
        desc: "20 位标签，标识同一「流」（通常是一条 TCP 连接）的所有报文。路由器可据此做等价多路径（ECMP）负载均衡，而不必解析传输层端口。",
        detail: "发送方随机生成非零 Flow Label，连接期间保持不变。核心路由器（MPLS 骨干网）可用 Flow Label 替代五元组哈希做负载均衡，减少深度包检测开销。",
        phase: { handshake: "OS 生成随机 Flow Label，SYN 包携带，连接期间不变", transfer: "数据段 Flow Label = SYN 的 Flow Label，路由器一致性转发同一流", close: "FIN 包保持相同 Flow Label，确保经过同一路径" },
        related: [
            { field: "Source IPv6", rel: "负载均衡器通常用 {srcIP, dstIP, srcPort, dstPort, Flow Label} 五元组哈希选路" },
            { field: "Traffic Class", rel: "Flow Label 标识流；Traffic Class 标记优先级。两者互补，共同支撑 IPv6 QoS" },
        ],
    },
    "Payload Length": {
        full: "Payload Length（有效载荷长度）",
        bits: 16, layer: "IPv6",
        desc: "IPv6 固定首部（40B）之后的数据长度，包含扩展头 + TCP 首部 + 应用数据。不含固定首部本身（与 IPv4 Total Length 含首部的计算方式不同）。",
        detail: "最大 65535 字节。Jumbogram（超大包，RFC 2675）通过逐跳选项扩展头支持更大 Payload（32 位长度），用于高性能内部网络。",
        phase: { handshake: "SYN 约 40B（TCP 20B + 选项 20B），Payload Length=40", transfer: "数据段 Payload Length 最大约 1460B（MTU 1500 - TCP 20）", close: "FIN 约 20B，Payload Length=20" },
        related: [
            { field: "Total Length", rel: "IPv4: Total Length 含首部（最小 20）；IPv6: Payload Length 不含固定首部（从 40 之后算）" },
            { field: "Next Header=6 (TCP)", rel: "若存在扩展头，Payload Length 包含扩展头；TCP 首部起点需逐链追踪 Next Header" },
        ],
    },
    "Next Header=6 (TCP)": {
        full: "Next Header（下一首部）",
        bits: 8, layer: "IPv6",
        desc: "标识紧跟在 IPv6 固定首部之后的首部类型。值 6 = TCP，17 = UDP，43 = 路由扩展头，44 = 分片扩展头，59 = 无下一首部。",
        detail: "IPv6 用「扩展头链」替代 IPv4 选项字段，每个扩展头有自己的 Next Header 字段，形成链式结构：IPv6固定头 → 扩展头1 → 扩展头2 → TCP。路由器只处理「逐跳选项」扩展头，其余直接跳过，提升转发效率。",
        phase: { handshake: "无扩展头时 Next Header=6（直接是 TCP）", transfer: "若路径有 IPv6 分片（少见），Next Header=44（分片头）→ 44 头的 Next Header=6", close: "Next Header=6，同握手" },
        related: [
            { field: "Protocol=6 (TCP)", rel: "IPv4 用 Protocol；IPv6 用 Next Header——语义相同，但 Next Header 支持扩展头链" },
            { field: "Payload Length", rel: "Payload Length 包含全部扩展头；Next Header 链决定 TCP 首部实际偏移" },
        ],
    },
    "Hop Limit": {
        full: "Hop Limit（跳数限制）",
        bits: 8, layer: "IPv6",
        desc: "等价于 IPv4 的 TTL。每经过一个路由器减 1，归零时丢弃并回 ICMPv6 Time Exceeded。防止报文无限循环。",
        detail: "IPv6 将「Time To Live」改名为「Hop Limit」更准确（从未真正以时间为单位）。关键优势：路由器减 Hop Limit 后无需重算首部校验和（IPv6 无此字段），转发速度更快。",
        phase: { handshake: "Linux 默认出发 Hop Limit=64，macOS/Windows=128", transfer: "数据段 Hop Limit 与握手包相同，连接期间不变", close: "FIN 包 Hop Limit 同上" },
        related: [
            { field: "TTL", rel: "语义完全相同；IPv6 省去了每跳更新 Checksum 的开销" },
            { field: "Header Checksum", rel: "IPv6 无首部校验和，Hop Limit 减 1 后无需重算，路由器转发更高效" },
        ],
    },

    "Source IPv6": {
        full: "Source Address（源 IPv6 地址）",
        bits: 128, layer: "IPv6",
        desc: "发送方的 128 位 IPv6 地址，以大端序（网络字节序）传输——最高有效字节最先发送。图中 4 行从上到下对应地址的「组1-2 → 组3-4 → 组5-6 → 组7-8」，与平时书写 2001:0db8:85a3::8a2e:0370:7334 的顺序完全一致，并非倒序。",
        detail: "IPv6 地址通常写作 8 组 16 进制，如 2001:0db8:85a3::8a2e:0370:7334。最高 64 位（前两行）是网络前缀（/64 子网），最低 64 位（后两行）是接口标识符（Interface ID，通常由 MAC 地址 EUI-64 派生或随机生成）。IPv6 地址空间为 2^128，彻底消除了 NAT 的必要。",
        phase: {
            handshake: "SYN 中 Source Address 是客户端的全局单播地址（GUA）或链路本地地址；不经过 NAT，地址不变",
            transfer: "数据段 Source Address 与握手包相同，连接期间不可变（变化则需重建连接；HTTP/3 QUIC 可通过 Connection ID 迁移）",
            close: "FIN 包 Source Address 同握手，对端用此地址识别连接",
        },
        related: [
            { field: "Destination IPv6", rel: "{srcIP, dstIP, srcPort, dstPort} 四元组唯一标识一条 TCP 连接；IPv6 无 NAT，地址即真实终端" },
            { field: "Flow Label", rel: "负载均衡器以 {src, dst, srcPort, dstPort, Flow Label} 五元组哈希，确保同一连接的包走同一路径" },
            { field: "Checksum (TCP)", rel: "TCP 伪首部包含 Source + Destination IPv6 地址（各 128 位），地址变化必须同步更新 TCP Checksum" },
        ],
    },

    "Destination IPv6": {
        full: "Destination Address（目标 IPv6 地址）",
        bits: 128, layer: "IPv6",
        desc: "接收方的 128 位 IPv6 地址，同样以大端序从高位到低位正序排列。图中 4 行对应目标地址的「组1-2 → 组7-8」，与书写顺序一致。路由器按最长前缀匹配（LPM）查找此字段并逐跳转发。",
        detail: "IPv6 路由表使用最长前缀匹配（LPM）。常见地址类型：全局单播（2000::/3）、链路本地（fe80::/10）、多播（ff00::/8）。多播地址可替代 IPv4 广播，如 ff02::1 = 所有节点，ff02::2 = 所有路由器。",
        phase: {
            handshake: "SYN 中 Destination Address 是服务器的 IPv6 地址；DNS AAAA 记录解析所得",
            transfer: "数据段 Destination Address 不变；CDN 场景中 Anycast 地址可让不同区域的客户端路由到就近节点",
            close: "FIN 包 Destination Address 与握手相同",
        },
        related: [
            { field: "Source IPv6", rel: "回程包时 src 和 dst 互换；IPv6 不经 NAT，地址对称性使 P2P 连接更简单" },
            { field: "Hop Limit", rel: "Hop Limit 限制报文能到达的最大跳数，间接限制 Destination 的可达范围" },
            { field: "Next Header=6 (TCP)", rel: "到达 Destination 后，按 Next Header=6 将包交给 TCP 栈，再由端口号路由到进程" },
        ],
    },

    // ── TCP ───────────────────────────────────────────────────────────────
    "Source Port": {
        full: "Source Port（源端口）",
        bits: 16, layer: "TCP",
        desc: "客户端随机选择的临时端口（通常 32768–60999，称为 Ephemeral Port），标识本次连接在客户端的「插座」。",
        detail: "OS 从 /proc/sys/net/ipv4/ip_local_port_range 中选取可用端口。同一客户端可与同一服务器建立多条连接，每条连接 srcPort 不同。NAT 设备会在必要时改写 srcPort 以避免冲突。",
        phase: { handshake: "SYN 中 srcPort 确定后连接期间不变，是四元组的组成部分", transfer: "数据段 srcPort = SYN 的 srcPort，NAT 追踪此值做反向映射", close: "FIN 包 srcPort 同上；TIME_WAIT 期间此端口被占用，不可复用" },
        related: [
            { field: "Destination Port", rel: "四元组 {srcIP, srcPort, dstIP, dstPort} 唯一标识连接" },
            { field: "Sequence Number (32-bit)", rel: "srcPort 区分连接；seq 区分同一连接内的字节顺序" },
        ],
    },
    "Destination Port": {
        full: "Destination Port（目标端口）",
        bits: 16, layer: "TCP",
        desc: "服务端监听的端口号，标识上层服务：80=HTTP，443=HTTPS，22=SSH，3306=MySQL 等。",
        detail: "服务器用 SO_REUSEPORT 可让多个进程/线程共享同一端口，内核按四元组哈希分发连接。防火墙常用 dstPort 做应用层过滤规则。",
        phase: { handshake: "SYN dstPort=443（HTTPS），服务器 accept() 后建立连接", transfer: "数据段 dstPort 不变；HTTP 请求的 Host 头和 TLS SNI 在应用层进一步路由", close: "FIN 包 dstPort=443，服务器识别连接后处理挥手" },
        related: [
            { field: "Source Port", rel: "连接四元组的另一组成；srcPort 是临时的，dstPort 是知名/注册端口" },
            { field: "Protocol=6 (TCP)", rel: "IP层的 Protocol=6 将包交给 TCP 栈，TCP 栈再用 dstPort 找到对应服务进程" },
        ],
    },
    "Sequence Number (32-bit)": {
        full: "Sequence Number（序列号）",
        bits: 32, layer: "TCP",
        desc: "标识本段数据中第一个字节在发送方字节流中的位置。从 ISN（初始序列号）开始，每发送 N 字节递增 N；SYN 和 FIN 各消耗 1 个序号。",
        detail: "ISN 由 OS 随机生成（RFC 6528 用时间+哈希防猜测攻击）。序号空间为 32 位，约 4GB 后回绕（Wrap-around）；高速网络可在数秒内回绕，需用 TCP Timestamps 选项辅助区分新旧数据。",
        phase: {
            handshake: `SYN: seq=ISN_C(${ISN_C})；SYN-ACK: seq=ISN_S(${ISN_S})；ACK+数据: seq=ISN_C+1(${ISN_C + 1})`,
            transfer: `数据 chunk-1: seq=${ISN_S + 1}；chunk-2: seq=${ISN_S + 1 + RESP1}（每段 += 字节数）`,
            close: `FIN: seq=最后一字节+1；FIN 消耗 1 个序号，TIME_WAIT 等待对端的 ACK(seq+1)`,
        },
        related: [
            { field: "Acknowledgment Number (32-bit)", rel: "ACK 中 ack = 期望的下一个 seq；两者配合实现可靠有序传输" },
            { field: "Window Size", rel: "发送方最多发送 seq + Window Size 范围内的数据，不能超出接收方窗口" },
            { field: "SYN", rel: "SYN=1 时 seq 是 ISN；SYN=0 时 seq 是数据字节偏移" },
        ],
    },
    "Acknowledgment Number (32-bit)": {
        full: "Acknowledgment Number（确认号）",
        bits: 32, layer: "TCP",
        desc: "当 ACK=1 时有效，表示「我已收到此序号之前的所有字节，期待从此序号开始的数据」。即 ack = 已收到的最后字节 seq + 1。",
        detail: "TCP 使用「累计确认」：一个 ACK 可以确认多个连续到达的段。若中间有丢失（乱序），ack 停在第一个未收到字节处。SACK 选项可辅助标记已收到的不连续区间。",
        phase: {
            handshake: `SYN-ACK: ack=${ISN_C + 1}（确认 SYN 的 seq=${ISN_C}，SYN 消耗1）；ACK: ack=${ISN_S + 1}`,
            transfer: `Server ACK: ack=${ISN_C + 1 + REQ_BYTES}（确认请求体）；Client ACK: ack=${ISN_S + 1 + RESP1}（chunk1后）`,
            close: `ACK(FIN): ack = FIN.seq + 1（FIN 消耗1序号）`,
        },
        related: [
            { field: "Sequence Number (32-bit)", rel: "ack 总是追踪对方的 seq：ack = 对方最大 seq + 1" },
            { field: "ACK", rel: "ACK 标志位=1 时，Acknowledgment Number 字段才有效" },
            { field: "Window Size", rel: "接收方在 ACK 中同时更新 Window Size，通知发送方可用缓冲区" },
        ],
    },
    "DO": {
        full: "Data Offset（数据偏移 / 首部长度）",
        bits: 4, layer: "TCP",
        desc: "以 32 位字（4 字节）为单位的 TCP 首部长度，指示 TCP Payload（数据）从何处开始。最小值 5（20字节基本首部），最大值 15（60字节，含 40 字节选项）。",
        detail: "类似 IPv4 的 IHL 字段。握手时 TCP 携带 MSS、Window Scale、Timestamps、SACK Permitted 等选项，DO 通常为 8~10（32~40 字节）。数据传输时若无选项则 DO=5。",
        phase: { handshake: "SYN 含大量选项，DO=8~10", transfer: "若无选项 DO=5；若有 Timestamps 选项 DO=8", close: "FIN 通常 DO=5（无选项）" },
        related: [
            { field: "IHL", rel: "IP 层的 IHL 定位 TCP 首部起点；TCP 层的 DO 再定位 TCP Payload 起点" },
            { field: "Options（MSS...）", rel: "DO > 5 说明存在 Options；Options 长度 = (DO-5)×4 字节" },
        ],
    },
    "Rsv": {
        full: "Reserved（保留位）",
        bits: 3, layer: "TCP",
        desc: "RFC 793 定义的 3 位保留字段，必须设为 0。发送方设非零值可能导致对端丢弃或 RST。",
        detail: "历史上此处曾有 6 位保留，随着 NS(RFC 3540)、ECE/CWR(RFC 3168) 等标志位被定义，保留位逐渐缩减至 3 位。",
        phase: { handshake: "Rsv=0，握手报文标准发送", transfer: "Rsv=0", close: "Rsv=0" },
        related: [
            { field: "NS", rel: "NS 是从保留位中划出的第 1 位（RFC 3540），现在保留位仅剩 3 位" },
            { field: "ECE", rel: "ECE 和 CWR 也是从早期保留位中划出的（RFC 3168）" },
        ],
    },
    "NS": {
        full: "Nonce Sum（随机数和）",
        bits: 1, layer: "TCP",
        desc: "RFC 3540 定义，用于 ECN 保护机制（ECN Nonce）。防止接收方在 ECN 协商中欺骗性地清除 CE 标记——通过 Nonce 校验可检测此行为。",
        detail: "握手时双方在 SYN/SYN-ACK 中置 NS=1 来协商 ECN Nonce 支持。实际部署较少（需要路由器和两端同时支持），但作为 ECN 安全补充被定义在 RFC 3540 中。补全 TCP 第四行至 32 位（DO 4b + Rsv 3b + NS 1b + 8 Flags + Window 16b = 32b）。",
        phase: { handshake: "支持 ECN Nonce 时 SYN 中 NS=1", transfer: "数据传输时 NS 用于累计 ECN Nonce 校验", close: "FIN 中通常 NS=0" },
        related: [
            { field: "ECE", rel: "NS 保护 ECE 的完整性；接收方不能偷偷清除 CE 标记来伪造「无拥塞」" },
            { field: "ECN", rel: "NS 是 IP 层 ECN 在 TCP 层的安全扩展" },
            { field: "Rsv", rel: "NS 是从 Rsv 中独立出来的，使第四行恰好凑齐 32 bit" },
        ],
    },
    "CWR": {
        full: "Congestion Window Reduced（拥塞窗口已缩减）",
        bits: 1, layer: "TCP",
        desc: "发送方收到 ECE=1（对端告知路径有拥塞）后，降低拥塞窗口，并在下一个报文中置 CWR=1，通知接收方「我已响应拥塞，请停止发 ECE」。",
        detail: "ECN 完整流程：① 路由器将 IP ECN 置 CE → ② 接收方 ACK 中 ECE=1 → ③ 发送方降速 + CWR=1 → ④ 接收方停发 ECE。CWR 是对 ECE 的确认，防止发送方持续降速。",
        phase: { handshake: "SYN 中 CWR=1 + ECE=1 表示支持 ECN（SYN-ACK 回应）", transfer: "拥塞响应时 CWR=1；正常传输 CWR=0", close: "FIN 中 CWR=0" },
        related: [
            { field: "ECE", rel: "CWR 是对 ECE 的应答：ECE=1 → 发送方降速 + CWR=1 → 接收方停发 ECE" },
            { field: "Window Size", rel: "CWR 触发后发送方降低拥塞窗口，实际发送量 = min(cwnd, rwnd)" },
        ],
    },
    "ECE": {
        full: "ECN-Echo（ECN 回显）",
        bits: 1, layer: "TCP",
        desc: "接收方将 IP 层收到的 ECN=CE（路由器标记拥塞）转化为 TCP ACK 中的 ECE=1，通知发送方路径上存在拥塞。",
        detail: "在 SYN 中 ECE=1 表示「我支持 ECN」（握手协商）；数据传输时 ECE=1 表示「我收到了 CE 标记的包，路径有拥塞」。",
        phase: { handshake: "SYN: ECE=1 + CWR=1（请求 ECN）；SYN-ACK: ECE=1（同意 ECN）", transfer: "收到 CE 标记包时 ACK 中 ECE=1；发送方降速后 CWR=1 清除", close: "FIN 中 ECE=0" },
        related: [
            { field: "CWR", rel: "ECE 和 CWR 配对：ECE 上报拥塞，CWR 确认已处理" },
            { field: "ECN", rel: "IP 层 ECN 字段被路由器标记为 CE 后，TCP 接收方将其转化为 ECE" },
        ],
    },
    "URG": {
        full: "Urgent（紧急）",
        bits: 1, layer: "TCP",
        desc: "URG=1 时 Urgent Pointer 字段有效，表示报文中包含需要优先处理的紧急数据（带外数据）。",
        detail: "在 HTTP 连接中极少使用。Telnet/SSH 的 Ctrl+C 中断信号曾用 URG 实现。现代应用通常用独立连接或应用层协议传递紧急消息，URG 机制已基本废弃。",
        phase: { handshake: "URG=0", transfer: "HTTP 传输中 URG=0；若需紧急中断通常直接发 RST", close: "URG=0" },
        related: [
            { field: "Urgent Pointer", rel: "URG=1 时 Urgent Pointer 指向紧急数据末尾偏移量" },
            { field: "PSH", rel: "PSH 要求立即推送到应用；URG 要求优先处理——语义不同" },
        ],
    },
    "ACK": {
        full: "Acknowledgment（确认）",
        bits: 1, layer: "TCP",
        desc: "ACK=1 时 Acknowledgment Number 字段有效。连接建立后几乎所有报文都置 ACK=1（SYN 的第一个包例外）。",
        detail: "ACK=0 只出现在三次握手的第一个 SYN 包。此后所有包（含 SYN-ACK、数据、FIN、RST 应答）都有 ACK=1。ACK 本身不消耗序号，可与数据「搭便车」（Piggybacking）。",
        phase: { handshake: "SYN: ACK=0；SYN-ACK: ACK=1；第3次ACK+数据: ACK=1", transfer: "所有数据段和 ACK 均 ACK=1", close: "FIN+ACK: ACK=1；最后 ACK: ACK=1" },
        related: [
            { field: "Acknowledgment Number (32-bit)", rel: "ACK=1 时 Acknowledgment Number 才有效；两者总是一起出现" },
            { field: "SYN", rel: "SYN=1 且 ACK=0：握手第一包；SYN=1 且 ACK=1：SYN-ACK" },
        ],
    },
    "PSH": {
        full: "Push（推送）",
        bits: 1, layer: "TCP",
        desc: "PSH=1 要求接收方 TCP 栈立即将缓冲区数据推送给应用层，不等待缓冲区填满。",
        detail: "不携带 PSH 时，TCP 接收方可能将数据积攒在缓冲区等待更多数据（Nagle 算法）。HTTP 请求/响应通常在最后一个段置 PSH=1，减少延迟。",
        phase: { handshake: "SYN 不含数据，PSH=0", transfer: "最后一个数据段 PSH=1，通知接收方立即处理 HTTP 报文", close: "FIN 中 PSH=0（无数据）" },
        related: [
            { field: "Sequence Number (32-bit)", rel: "PSH=1 的段 seq 标记数据起点；应用层收到后可完整处理" },
            { field: "Window Size", rel: "PSH 推送数据；窗口控制推送速度——两者共同影响吞吐和延迟" },
        ],
    },
    "RST": {
        full: "Reset（复位）",
        bits: 1, layer: "TCP",
        desc: "RST=1 立即终止连接，不进行四次挥手。接收方收到 RST 后销毁 TCB，释放所有资源。通常由进程崩溃、端口不可达、连接无效触发。",
        detail: "RST 不消耗序号，不需要 ACK 确认。RST 的 seq 必须落在接收方的窗口内，否则被丢弃（防止 RST 攻击）。TIME_WAIT 状态收到有效 RST 可提前关闭，跳过 2MSL 等待。",
        phase: { handshake: "若服务器拒绝连接（端口未开），回 RST+ACK", transfer: "进程崩溃或异常时发 RST，立即中断传输", close: "正常关闭用 FIN；RST 是强制关闭的替代路径" },
        related: [
            { field: "FIN", rel: "FIN 是优雅关闭（有序，消耗序号，需 ACK）；RST 是强制关闭（立即，无需 ACK）" },
            { field: "Sequence Number (32-bit)", rel: "RST 的 seq 必须在对方窗口内才被接受，防止伪造 RST 攻击" },
        ],
    },
    "SYN": {
        full: "Synchronize（同步）",
        bits: 1, layer: "TCP",
        desc: "SYN=1 表示这是连接建立请求，携带发送方的 ISN（初始序列号）。三次握手中只有前两个包（SYN 和 SYN-ACK）置 SYN=1。",
        detail: "SYN 消耗 1 个序号（视为发送了 1 字节虚拟数据），确保 SYN-ACK 的 ack = ISN+1。SYN Flood 攻击即大量发 SYN 而不完成握手，耗尽服务器半连接队列；SYN Cookie 是防御手段。",
        phase: { handshake: `SYN: seq=${ISN_C}, SYN=1, ACK=0；SYN-ACK: seq=${ISN_S}, SYN=1, ACK=1, ack=${ISN_C + 1}`, transfer: "数据段 SYN=0", close: "FIN 包 SYN=0" },
        related: [
            { field: "Sequence Number (32-bit)", rel: "SYN=1 时 seq 是 ISN；ISN 消耗 1 序号，下一包 seq = ISN+1" },
            { field: "ACK", rel: "SYN+ACK=0 是握手第一包；SYN+ACK=1 是 SYN-ACK" },
            { field: "Window Size", rel: "SYN 中携带的 Window Size 是初始接收窗口；Window Scale 选项扩大实际窗口" },
        ],
    },
    "FIN": {
        full: "Finish（结束）",
        bits: 1, layer: "TCP",
        desc: "FIN=1 表示发送方已发完所有数据，请求关闭发送方向。FIN 消耗 1 个序号。TCP 是全双工，FIN 只关闭单向——另一方向需要对端也发 FIN。",
        detail: "四次挥手：① FIN → ② ACK ③ FIN → ④ ACK。半关闭（Half-Close）：发 FIN 后仍可接收数据，直到对端也发 FIN。FIN_WAIT_2 状态需要设置超时，防止永久等待。",
        phase: { handshake: "握手包 FIN=0", transfer: "数据段 FIN=0；响应发完后才 FIN", close: `Client FIN: seq=${ISN_C + 1 + REQ_BYTES}；Server FIN: seq=${ISN_S + 1 + RESP1 + RESP2}；各自消耗1序号` },
        related: [
            { field: "RST", rel: "FIN 优雅关闭（有序、消耗序号、需 ACK）；RST 强制关闭（立即、无需 ACK）" },
            { field: "Sequence Number (32-bit)", rel: "FIN 消耗 1 序号，对端 ACK 的 ack = FIN.seq + 1" },
            { field: "ACK", rel: "FIN 通常与 ACK 同时置位（FIN+ACK），确认对端的同时关闭自己的发送方向" },
        ],
    },
    "Window Size": {
        full: "Window Size（窗口大小）",
        bits: 16, layer: "TCP",
        desc: "接收方当前可接收的字节数（接收缓冲区剩余空间）。发送方最多可有「窗口大小」字节在途（未确认）。这是 TCP 流量控制的核心机制。",
        detail: "实际窗口 = Window Size × 2^(Window Scale)。Window Scale 在握手时协商（TCP 选项），最大扩大 2^14 = 16384 倍，支持高达 1GB 的窗口。窗口=0 时发送方暂停，用 Zero Window Probe 探测恢复。",
        phase: {
            handshake: "SYN 声明初始接收窗口（如 65535）；Window Scale 选项协商扩大因子",
            transfer: `数据 ACK 中 Window Size 持续更新；接收缓冲区满时降为 0（Zero Window）`,
            close: "FIN+ACK 中仍携带 Window Size，直到连接完全关闭",
        },
        related: [
            { field: "Acknowledgment Number (32-bit)", rel: "接收方在每个 ACK 中同时更新 Window Size，通知发送方可用空间" },
            { field: "Sequence Number (32-bit)", rel: "发送方约束：seq ≤ ack + Window Size（不能超出窗口）" },
            { field: "CWR", rel: "Window Size 是接收窗口（rwnd）；拥塞窗口（cwnd）是发送方维护的，CWR 触发 cwnd 缩减" },
        ],
    },
    "Checksum (TCP)": {
        full: "TCP Checksum（校验和）",
        bits: 16, layer: "TCP",
        desc: "覆盖「伪首部 + TCP 首部 + TCP 数据」的 16 位反码求和。伪首部包含源/目标 IP、Protocol=6、TCP 段长，将网络层信息纳入传输层校验。",
        detail: "NAT 修改 IP 地址后，必须同步更新 TCP Checksum（因为 IP 地址在伪首部中）。与 IP Header Checksum 的区别：IP Checksum 只保护 IP 首部；TCP Checksum 保护整个 TCP 段（含数据）。",
        phase: { handshake: "SYN/SYN-ACK 的 TCP Checksum 包含 IP 地址信息", transfer: "每个数据段都有独立 Checksum；网卡硬件（TSO/GSO）可卸载计算", close: "FIN 包 Checksum 同样覆盖伪首部" },
        related: [
            { field: "Header Checksum", rel: "IP Checksum 保护 IP 首部；TCP Checksum 保护 TCP 段（含数据），两层独立校验" },
            { field: "Source IP (32-bit)", rel: "IP 地址变化（NAT）必须同步更新 TCP Checksum（伪首部含 IP 地址）" },
        ],
    },
    "Urgent Pointer": {
        full: "Urgent Pointer（紧急指针）",
        bits: 16, layer: "TCP",
        desc: "仅在 URG=1 时有效，表示紧急数据末尾相对于当前 seq 的偏移量（字节）。标记应用层需要立即处理的数据范围。",
        detail: "HTTP 连接中极少使用。历史上 Telnet 用此机制传递中断信号（Ctrl+C）。现代网络编程中，应用层通常自己定义优先消息格式，不依赖 URG/紧急指针。",
        phase: { handshake: "Urgent Pointer=0（URG=0 时忽略）", transfer: "HTTP 传输中 Urgent Pointer=0", close: "FIN 包 Urgent Pointer=0" },
        related: [
            { field: "URG", rel: "URG=0 时 Urgent Pointer 无意义；URG=1 时 Urgent Pointer 指向紧急数据末尾" },
        ],
    },
    "Options（MSS...）": {
        full: "TCP Options（可选字段）",
        bits: 0, layer: "TCP",
        desc: "变长字段，包含扩展 TCP 功能的选项。握手（SYN/SYN-ACK）时携带，协商整个连接的能力。常见选项：MSS、Window Scale、SACK Permitted、Timestamps、TFO。",
        detail: "选项长度 = (DO-5)×4 字节（最多 40B）。格式：Kind(1B) + Length(1B) + Value(nB)。数据传输段通常只携带 Timestamps（若已协商），握手段携带全部能力选项。",
        phase: {
            handshake: "SYN 携带 MSS（最大段大小）、Window Scale(扩窗)、SACK Permitted、Timestamps；SYN-ACK 回应",
            transfer: "若握手协商了 Timestamps，每个数据段都携带时间戳（RTT 测量 + PAWS 保护）",
            close: "FIN 通常不携带选项",
        },
        related: [
            { field: "DO", rel: "DO 字段值决定 Options 的长度：Options bytes = (DO-5)×4" },
            { field: "Window Size", rel: "Window Scale 选项扩大 Window Size 字段的实际含义（× 2^scale）" },
            { field: "Sequence Number (32-bit)", rel: "Timestamps 选项包含发送时间戳，用于精确 RTT 测量和 PAWS（防回绕序号保护）" },
        ],
    },
};

// ─── Interactive BitField ──────────────────────────────────────────────────
function BitField({ label, bits, color, span = 1, fieldId, selected, hovered, onSelect, onHover }) {
    const isActive = selected || hovered;
    return (
        <div
            onClick={() => onSelect && onSelect(fieldId || label)}
            onMouseEnter={() => onHover && onHover(fieldId || label)}
            onMouseLeave={() => onHover && onHover(null)}
            title={FIELD_DB[fieldId || label]?.full || label}
            style={{
                gridColumn: `span ${span}`,
                background: isActive ? color + "35" : color + "18",
                border: `1px solid ${isActive ? color + "cc" : color + "40"}`,
                borderRadius: 3, padding: "4px 2px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 38,
                cursor: "pointer",
                transform: isActive ? "scaleY(1.06)" : "none",
                boxShadow: isActive ? `0 0 8px ${color}55` : "none",
                transition: "all .15s",
                zIndex: isActive ? 2 : 1,
                position: "relative",
            }}
        >
            <div style={{ fontSize: 9, fontFamily: "monospace", color: isActive ? color : color + "cc", fontWeight: 700, textAlign: "center", wordBreak: "break-all", lineHeight: 1.2 }}>{label}</div>
            {bits > 0 && <div style={{ fontSize: 8, color: isActive ? color + "cc" : C.dim, fontFamily: "monospace" }}>{bits}b</div>}
        </div>
    );
}

// ─── Field detail panel ────────────────────────────────────────────────────
function FieldDetailPanel({ fieldId, phase, color }) {
    if (!fieldId) return (
        <div style={{ background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: C.dim, fontSize: 11, fontFamily: "monospace" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>☝️</div>
                悬浮或点击上方任意字段，查看详细说明
            </div>
        </div>
    );

    const info = FIELD_DB[fieldId];
    if (!info) return (
        <div style={{
            background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 7,
            padding: "14px 16px", minHeight: 80, display: "flex", alignItems: "center"
        }}>
            <span style={{ fontSize: 11, color: C.dim, fontFamily: "monospace" }}>
                字段 <span style={{ color: C.accent }}>{fieldId}</span> 暂无详细说明
            </span>
        </div>
    );

    const phaseKey = phase === "handshake" ? "handshake" : phase === "transfer" ? "transfer" : "close";
    const phaseVal = info.phase?.[phaseKey];

    return (
        <div style={{ background: "#060b16", border: `1px solid ${color}44`, borderRadius: 7, padding: "14px 16px", animation: "fadeIn .2s ease" }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "monospace" }}>{fieldId}</span>
                <span style={{ fontSize: 11, color: C.dim }}>{info.full}</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <Tag xs color={color}>{info.layer}</Tag>
                    {info.bits > 0 && <Tag xs color={C.dim}>{info.bits} bit</Tag>}
                </span>
            </div>

            {/* Description */}
            <div style={{ fontSize: 11, color: C.text, lineHeight: 1.8, marginBottom: 10, padding: "8px 12px", background: color + "0e", borderRadius: 5, borderLeft: `3px solid ${color}` }}>
                {info.desc}
            </div>

            {/* Detail */}
            <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.7, marginBottom: 10 }}>{info.detail}</div>

            <div style={{ display: "grid", gridTemplateColumns: phaseVal ? "1fr 1fr" : "1fr", gap: 10 }}>
                {/* Current phase value */}
                {phaseVal && (
                    <div style={{ background: "#0a1422", border: `1px solid ${color}30`, borderRadius: 5, padding: "8px 12px" }}>
                        <div style={{ fontSize: 9, color: color, letterSpacing: 2, fontFamily: "monospace", marginBottom: 5 }}>当前阶段 ({phaseKey === "handshake" ? "握手" : phaseKey === "transfer" ? "传输" : "断连"})</div>
                        <div style={{ fontSize: 10, color: C.text, lineHeight: 1.7, fontFamily: "monospace" }}>{phaseVal}</div>
                    </div>
                )}

                {/* Related fields */}
                {info.related && info.related.length > 0 && (
                    <div style={{ background: "#0a1422", border: `1px solid ${C.border}`, borderRadius: 5, padding: "8px 12px" }}>
                        <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 5 }}>与其他字段的配合</div>
                        {info.related.map((r, i) => (
                            <div key={i} style={{ marginBottom: 5, paddingBottom: 5, borderBottom: i < info.related.length - 1 ? `1px solid ${C.border}30` : "none" }}>
                                <span style={{ fontSize: 10, color: color, fontFamily: "monospace", fontWeight: 700 }}>{r.field}</span>
                                <span style={{ fontSize: 10, color: C.dim, marginLeft: 6 }}>{r.rel}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Packet format diagram ─────────────────────────────────────────────────
function HeaderDiagram({ phase, ipVer, httpVer }) {
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);

    const active = hovered || selected;
    const activeColor = active && FIELD_DB[active] ? (
        FIELD_DB[active].layer === "IPv4" ? C.ipv4 :
            FIELD_DB[active].layer === "IPv6" ? C.ipv6 : C.tcp
    ) : C.accent;

    const COLS = 32;
    const gs = { display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1, marginBottom: 2 };

    const bf = (label, bits, color, span, fieldId) => (
        <BitField key={fieldId || label} label={label} bits={bits} color={color} span={span}
            fieldId={fieldId || label}
            selected={selected === (fieldId || label)}
            hovered={hovered === (fieldId || label)}
            onSelect={setSelected}
            onHover={setHovered}
        />
    );

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <Tag color={ipVer === "6" ? C.ipv6 : C.ipv4}>{ipVer === "6" ? "IPv6" : "IPv4"} 报头</Tag>
                <Tag color={C.tcp}>TCP 报头</Tag>
                {phase === "transfer" && <Tag color={C.http}>HTTP Payload</Tag>}
                <span style={{ fontSize: 10, color: C.dim, alignSelf: "center", marginLeft: 4 }}>← 点击或悬浮字段查看详解</span>
            </div>

            {/* ── IPv4 ── */}
            {ipVer === "4" && (
                <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: C.ipv4, fontFamily: "monospace", marginBottom: 4 }}>IPv4 首部（20 字节固定）</div>
                    <div style={gs}>
                        {bf("Ver=4", 4, C.ipv4, 4)} {bf("IHL", 4, C.ipv4, 4)} {bf("DSCP", 6, C.ipv4, 6)} {bf("ECN", 2, C.ipv4, 2)} {bf("Total Length", 16, C.ipv4, 16)}
                    </div>
                    <div style={gs}>
                        {bf("Identification", 16, C.ipv4, 16)} {bf("Flags", 3, C.ipv4, 3)} {bf("Fragment Offset", 13, C.ipv4, 13)}
                    </div>
                    <div style={gs}>
                        {bf("TTL", 8, C.ipv4, 8)} {bf("Protocol=6 (TCP)", 8, C.tcp, 8)} {bf("Header Checksum", 16, C.ipv4, 16)}
                    </div>
                    <div style={gs}>{bf("Source IP (32-bit)", 32, C.ipv4, 32)}</div>
                    <div style={gs}>{bf("Destination IP (32-bit)", 32, C.ipv4, 32)}</div>
                </div>
            )}

            {/* ── IPv6 ── */}
            {ipVer === "6" && (
                <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: C.ipv6, fontFamily: "monospace", marginBottom: 4 }}>IPv6 首部（40 字节固定，无校验和）</div>
                    <div style={gs}>{bf("Ver=6", 4, C.ipv6, 4)} {bf("Traffic Class", 8, C.ipv6, 8)} {bf("Flow Label", 20, C.ipv6, 20)}</div>
                    <div style={gs}>{bf("Payload Length", 16, C.ipv6, 16)} {bf("Next Header=6 (TCP)", 8, C.tcp, 8)} {bf("Hop Limit", 8, C.ipv6, 8)}</div>
                    {/* ── 传输顺序说明 ── */}
                    <div style={{
                        fontSize: 9, color: C.dim, fontFamily: "monospace", margin: "4px 0 2px",
                        padding: "3px 8px", background: C.ipv6 + "0a", borderRadius: 3
                    }}>
                        ↓ 按网络字节序（大端）正序排列，与地址书写一致：2001:0db8:85a3:0000 : 0000:8a2e:0370:7334
                    </div>
                    {/* Source: 4 rows × 32 bit — each row = 2 groups × 16 bit */}
                    {[
                        { label: "Source Address  组1-2（最高 32 位）", ex: "e.g. 2001:0db8" },
                        { label: "Source Address  组3-4", ex: "e.g. 85a3:0000" },
                        { label: "Source Address  组5-6", ex: "e.g. 0000:8a2e" },
                        { label: "Source Address  组7-8（最低 32 位）", ex: "e.g. 0370:7334" },
                    ].map((row, i) => (
                        <div key={"src" + i} style={gs}>
                            <BitField
                                label={row.label} bits={32} color={C.ipv6} span={32}
                                fieldId="Source IPv6"
                                selected={selected === "Source IPv6"}
                                hovered={hovered === "Source IPv6"}
                                onSelect={setSelected}
                                onHover={setHovered}
                            />
                        </div>
                    ))}
                    {/* Destination: same layout */}
                    {[
                        { label: "Destination Address  组1-2（最高 32 位）", ex: "e.g. 2606:2800" },
                        { label: "Destination Address  组3-4", ex: "e.g. 0220:0001" },
                        { label: "Destination Address  组5-6", ex: "e.g. 0248:1893" },
                        { label: "Destination Address  组7-8（最低 32 位）", ex: "e.g. 25c8:1946" },
                    ].map((row, i) => (
                        <div key={"dst" + i} style={gs}>
                            <BitField
                                label={row.label} bits={32} color={C.ipv6} span={32}
                                fieldId="Destination IPv6"
                                selected={selected === "Destination IPv6"}
                                hovered={hovered === "Destination IPv6"}
                                onSelect={setSelected}
                                onHover={setHovered}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ── TCP ── */}
            <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 10, color: C.tcp, fontFamily: "monospace", marginBottom: 4 }}>
                    TCP 首部（20 字节固定），当前：<Tag xs color={phase === "handshake" ? C.syn : phase === "close" ? C.fin : C.http}>{phase === "handshake" ? "SYN / SYN-ACK" : phase === "close" ? "FIN / ACK" : "PSH / ACK"}</Tag>
                </div>
                <div style={gs}>{bf("Source Port", 16, C.tcp, 16)} {bf("Destination Port", 16, C.tcp, 16)}</div>
                <div style={gs}>{bf("Sequence Number (32-bit)", 32, C.accent, 32)}</div>
                <div style={gs}>{bf("Acknowledgment Number (32-bit)", 32, C.accent2, 32)}</div>
                <div style={gs}>
                    {bf("DO", 4, C.tcp, 4)}
                    {bf("Rsv", 3, C.dim, 3)}
                    {bf("NS", 1, C.dim, 1)}
                    {[
                        { n: "CWR", hi: false }, { n: "ECE", hi: false }, { n: "URG", hi: false },
                        { n: "ACK", hi: phase === "handshake" || phase === "close" || phase === "transfer" },
                        { n: "PSH", hi: phase === "transfer" },
                        { n: "RST", hi: false },
                        { n: "SYN", hi: phase === "handshake" },
                        { n: "FIN", hi: phase === "close" },
                    ].map(f => bf(f.n, 1, f.hi ? (f.n === "SYN" ? C.syn : f.n === "FIN" ? C.fin : f.n === "ACK" ? C.ack : C.http) : C.dim, 1))}
                    {bf("Window Size", 16, C.win, 16)}
                </div>
                <div style={gs}>{bf("Checksum", 16, C.tcp, 16, "Checksum (TCP)")} {bf("Urgent Pointer", 16, C.dim, 16)}</div>
                <div style={gs}>{bf("Options（MSS / SACK / Timestamps / Window Scale…）握手时携带，数据传输时通常省略", 0, C.dim, 32, "Options（MSS...）")}</div>
                {phase === "transfer" && (
                    <div style={gs}>{bf(`HTTP${httpVer === "2" ? " /2 Frame" : " /1.1"} Payload（应用层数据）`, 0, C.http, 32)}</div>
                )}
            </div>

            {/* ── Detail panel ── */}
            <div style={{ marginTop: 14 }}>
                <FieldDetailPanel fieldId={active} phase={phase} color={activeColor} />
            </div>

            {/* ── IPv4 vs IPv6 note ── */}
            <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180, background: C.ipv4 + "10", border: `1px solid ${C.ipv4}30`, borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.ipv4, marginBottom: 4 }}>IPv4 与 TCP 配合</div>
                    <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.8, fontFamily: "monospace" }}>• 首部校验和：路由器逐跳验证<br />• Protocol=6 指向 TCP<br />• 分片重组在目标主机完成<br />• TTL 防止环路无限转发</div>
                </div>
                <div style={{ flex: 1, minWidth: 180, background: C.ipv6 + "10", border: `1px solid ${C.ipv6}30`, borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.ipv6, marginBottom: 4 }}>IPv6 与 TCP 配合</div>
                    <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.8, fontFamily: "monospace" }}>• 无首部校验和（交给链路层）<br />• Next Header=6 (TCP) 或扩展头链<br />• Flow Label 区分不同 TCP 连接<br />• Hop Limit 替代 TTL</div>
                </div>
            </div>
        </div>
    );
}

function SeqTimeline({ phase, closeMode }) {
    const rows = phase === "handshake" ? [
        { from: "C→S", label: "SYN", flags: "SYN", seq: ISN_C, ack: "-", note: "ISN 由内核随机生成，防猜测攻击" },
        { from: "S→C", label: "SYN-ACK", flags: "SYN,ACK", seq: ISN_S, ack: ISN_C + 1, note: `确认 ISN_C，自己也宣告 ISN_S` },
        { from: "C→S", label: "ACK + 数据", flags: "ACK,PSH", seq: ISN_C + 1, ack: ISN_S + 1, note: `第3次握手携带 HTTP 请求(${REQ_BYTES}B)` },
        { from: "S→C", label: "ACK 数据", flags: "ACK", seq: ISN_S + 1, ack: ISN_C + 1 + REQ_BYTES, note: `确认 ${REQ_BYTES} 字节请求已收到` },
    ] : phase === "transfer" ? [
        { from: "S→C", label: "数据 chunk-1", flags: "ACK,PSH", seq: ISN_S + 1, ack: ISN_C + 1 + REQ_BYTES, bytes: RESP1, note: `服务端 seq 从握手后继续递增` },
        { from: "C→S", label: "ACK", flags: "ACK", seq: ISN_C + 1 + REQ_BYTES, ack: ISN_S + 1 + RESP1, note: "累计确认" },
        { from: "S→C", label: "数据 chunk-2", flags: "ACK,PSH", seq: ISN_S + 1 + RESP1, ack: ISN_C + 1 + REQ_BYTES, bytes: RESP2, note: "客户端 seq 不变（未发新数据）" },
        { from: "C→S", label: "ACK + 窗口更新", flags: "ACK", seq: ISN_C + 1 + REQ_BYTES, ack: ISN_S + 1 + RESP1 + RESP2, win: 131070, note: "Window Scale 扩大接收窗口" },
    ] : closeMode === "half" ? [
        { from: "C→S", label: "FIN", flags: "FIN,ACK", seq: ISN_C + 1 + REQ_BYTES, ack: ISN_S + 1 + RESP1 + RESP2, note: "半关闭：C 不再发送，仍可接收" },
        { from: "S→C", label: "ACK", flags: "ACK", seq: ISN_S + 1 + RESP1 + RESP2, ack: ISN_C + 2 + REQ_BYTES, note: "FIN 消耗 1 个序号" },
        { from: "S→C", label: "剩余数据", flags: "ACK,PSH", seq: ISN_S + 1 + RESP1 + RESP2, ack: ISN_C + 2 + REQ_BYTES, bytes: 120, note: "服务端仍可继续发送" },
        { from: "C→S", label: "ACK 数据", flags: "ACK", seq: ISN_C + 2 + REQ_BYTES, ack: ISN_S + 1 + RESP1 + RESP2 + 120, note: "客户端仍确认收到的数据" },
        { from: "S→C", label: "FIN", flags: "FIN,ACK", seq: ISN_S + 1 + RESP1 + RESP2 + 120, ack: ISN_C + 2 + REQ_BYTES, note: "服务端也关闭发送" },
        { from: "C→S", label: "ACK [TIME_WAIT]", flags: "ACK", seq: ISN_C + 2 + REQ_BYTES, ack: ISN_S + 2 + RESP1 + RESP2 + 120, note: "等待 2×MSL" },
    ] : [
        { from: "C→S", label: "FIN", flags: "FIN,ACK", seq: ISN_C + 1 + REQ_BYTES, ack: ISN_S + 1 + RESP1 + RESP2, note: "主动关闭方，FIN 消耗 1 序号" },
        { from: "S→C", label: "ACK", flags: "ACK", seq: ISN_S + 1 + RESP1 + RESP2, ack: ISN_C + 2 + REQ_BYTES, note: "被动方确认" },
        { from: "S→C", label: "FIN", flags: "FIN,ACK", seq: ISN_S + 1 + RESP1 + RESP2, ack: ISN_C + 2 + REQ_BYTES, note: "被动方也关闭发送方向" },
        { from: "C→S", label: "ACK [TIME_WAIT]", flags: "ACK", seq: ISN_C + 2 + REQ_BYTES, ack: ISN_S + 2 + RESP1 + RESP2, note: "进入 TIME_WAIT，等待 2MSL" },
    ];

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 11 }}>
                <thead>
                    <tr>{["方向", "报文", "Flags", "seq", "ack", "说明"].map(h => (
                        <th key={h} style={{ padding: "6px 10px", color: C.dim, textAlign: "left", borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>{h}</th>
                    ))}</tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}30` }}>
                            <td style={{ padding: "6px 10px" }}><Tag xs color={r.from.startsWith("C") ? C.client : C.server}>{r.from}</Tag></td>
                            <td style={{ padding: "6px 10px", color: C.text, fontWeight: 700 }}>{r.label}</td>
                            <td style={{ padding: "6px 10px" }}>{r.flags.split(",").map(f => (<span key={f} style={{ marginRight: 3 }}><Tag xs color={f === "SYN" ? C.syn : f === "FIN" ? C.fin : f === "ACK" ? C.ack : f === "PSH" ? C.http : C.win}>{f}</Tag></span>))}</td>
                            <td style={{ padding: "6px 10px", color: C.accent }}>{r.seq}</td>
                            <td style={{ padding: "6px 10px", color: C.accent2 }}>{r.ack}</td>
                            <td style={{ padding: "6px 10px", color: C.dim, fontSize: 10 }}>{r.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CompareTable() {
    const rows = [
        ["特性", "HTTP/1.1", "HTTP/2"],
        ["连接复用", "keep-alive（顺序）", "多路复用（并发流）"],
        ["头部格式", "明文，重复发送", "HPACK 二进制压缩"],
        ["HOL阻塞", "存在（请求串行）", "无（流独立）"],
        ["Server Push", "❌", "✅"],
        ["TLS", "可选", "实践必须 (ALPN h2)"],
        ["帧结构", "无", "DATA/HEADERS/SETTINGS…"],
        ["流控制", "TCP 窗口", "TCP + HTTP/2 流级别"],
        ["与IPv4/v6", "均支持", "均支持"],
    ];
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 11 }}>
            <thead><tr>{rows[0].map((h, i) => (<th key={i} style={{ padding: "7px 12px", background: i === 0 ? "#070c18" : i === 1 ? C.accent + "15" : C.accent2 + "15", color: i === 0 ? C.dim : i === 1 ? C.accent : C.accent2, textAlign: "left", borderBottom: `2px solid ${i === 1 ? C.accent : i === 2 ? C.accent2 : C.border}`, fontWeight: 700, letterSpacing: 1 }}>{h}</th>))}</tr></thead>
            <tbody>{rows.slice(1).map((row, ri) => (<tr key={ri} style={{ borderBottom: `1px solid ${C.border}40` }}>{row.map((cell, ci) => (<td key={ci} style={{ padding: "6px 12px", color: ci === 0 ? C.dim : C.text, background: ci === 0 ? "#060b16" : "transparent" }}>{cell}</td>))}</tr>))}</tbody>
        </table>
    );
}

// ─── Abnormal close scenarios data ────────────────────────────────────────
const SCENARIOS = [
    {
        id: "rst",
        label: "RST 强制复位",
        icon: "⚡",
        color: "#f87171",
        trigger: "服务器进程崩溃 / 端口不可达 / 防火墙拒绝",
        desc: "一端的 TCP 栈发送 RST 报文，立即撤销连接，不经过正常四次挥手。",
        packets: [
            { label: "DATA →", from: "client", color: C.http, note: "正在传输中" },
            { label: "RST ←", from: "server", color: "#f87171", note: "立即复位" },
        ],
        dropAt: null,
        timing: "毫秒级（收到 RST 即触发）",
        layers: {
            hw: { nic: "网卡正常转发 RST 报文，无感知", sw: "交换机按 MAC 表转发，不识别 RST", router: "路由器按路由表转发，不修改 RST 内容" },
            os: { state: "TCP_CLOSE", action: "收到 RST → 立即销毁 TCB（传输控制块），释放端口和缓冲区", errno: "ECONNRESET (104)" },
            browser: { detect: "立即感知（read/write 系统调用返回错误）", ui: "显示「ERR_CONNECTION_RESET」", retry: "通常不自动重试，需用户刷新" },
        },
        notes: ["RST 不消耗序号，无需 ACK", "RST 报文中 seq 必须在对方窗口内才会被接受（防伪造）", "TIME_WAIT 状态收到 RST 会直接关闭，跳过 2MSL 等待"],
    },
    {
        id: "physical",
        label: "物理链路中断",
        icon: "🔌",
        color: "#fb923c",
        trigger: "网线断开 / WiFi 信号丢失 / 光纤切断",
        desc: "链路层突然消失，双方 TCP 栈均不知道对方的状态，进入「半死连接」。",
        packets: [
            { label: "DATA →", from: "client", color: C.http, note: "已发出" },
            { label: "×  丢失（链路断）", from: "client", color: "#fb923c", lost: true, lostAt: 50, note: "物理层中断" },
            { label: "×  超时重传 #1", from: "client", color: "#fb923c", lost: true, lostAt: 40, note: "RTO 指数退避" },
            { label: "×  超时重传 #2", from: "client", color: "#fb923c", lost: true, lostAt: 40, note: "RTO×2" },
        ],
        timing: "秒~分钟级（取决于 Keepalive / RTO 配置）",
        layers: {
            hw: { nic: "载波检测失败（无信号），驱动上报 link down 事件", sw: "MAC 地址表老化后条目删除；检测到端口 link-down 触发 STP 收敛", router: "路由协议（OSPF/BGP）检测邻居失联，重新收敛路由表（秒~分钟）" },
            os: { state: "ESTABLISHED（不知道断了）", action: "内核持续重传，RTO 指数退避（初始200ms，最大120s），达到 tcp_retries2（默认15次）后报错", errno: "ETIMEDOUT (110)，约9~15分钟后" },
            browser: { detect: "依赖 TCP 超时或 Keepalive 探测（默认很慢）", ui: "页面「转圈」，最终显示「ERR_TIMED_OUT」或「ERR_NETWORK_CHANGED」（WiFi切换时）", retry: "部分请求（GET）会自动重试；POST 等幂等性不确定的请求通常不重试" },
        },
        notes: ["WiFi 重连后 IP 可能改变，旧 TCP 连接无法复用（HTTP/3 QUIC 可迁移）", "链路恢复后服务端仍认为连接 ESTABLISHED，客户端发新数据服务端回 RST", "可用 SO_KEEPALIVE 加速检测（Linux 默认 7200s/75s/9次）"],
    },
    {
        id: "nat",
        label: "NAT / 防火墙超时",
        icon: "🧱",
        color: "#facc15",
        trigger: "中间设备的连接状态表条目过期（通常空闲 30~300 秒后）",
        desc: "NAT/有状态防火墙悄悄丢弃新包，但不通知两端，形成「黑洞连接」。",
        packets: [
            { label: "← ← 长时间空闲 → →", from: "client", color: C.dim, note: "无数据交换" },
            { label: "DATA →（超时后）", from: "client", color: C.http, lost: true, lostAt: 55, note: "NAT 表项已删除，被丢弃" },
            { label: "×  超时重传", from: "client", color: "#facc15", lost: true, lostAt: 55, note: "NAT 继续丢包" },
        ],
        timing: "分钟级（NAT 超时后首次发包时触发，发现需要 RTO 多次重传）",
        layers: {
            hw: { nic: "网卡层面无异常", sw: "交换机无感知", router: "NAT 路由器：状态表条目过期后静默丢弃新包，不发 ICMP；企业防火墙行为类似" },
            os: { state: "ESTABLISHED（双方均认为连接正常）", action: "重传超时后报错，进程收到 BROKEN_PIPE 或 ETIMEDOUT", errno: "EPIPE (32) / ETIMEDOUT (110)" },
            browser: { detect: "发送请求时才发现（读写阻塞后超时）", ui: "请求卡住后显示超时", retry: "HTTP/1.1 Connection: keep-alive 重用连接时更容易命中此问题；HTTP/2 多路复用同样受影响" },
        },
        notes: ["解决方案：TCP Keepalive 或应用层心跳包（每隔 N 秒发一次），维持 NAT 表项活跃", "HTTP/1.1 服务器通常设置 Keep-Alive: timeout=75，让连接在 NAT 超时前关闭", "HTTP/2 的 PING 帧（RFC 7540 §6.7）可作为应用层 Keepalive"],
    },
    {
        id: "keepalive",
        label: "TCP Keepalive 探测",
        icon: "💓",
        color: "#34d399",
        trigger: "SO_KEEPALIVE 开启，连接长时间空闲后 OS 主动探测对端",
        desc: "TCP 协议栈定期发送探测包（不含数据），检测对端是否存活。",
        packets: [
            { label: "← 空闲 2 小时（默认）→", from: "client", color: C.dim, note: "keepidle" },
            { label: "Keepalive probe #1 →", from: "client", color: "#34d399", note: "seq=ISN-1（故意用旧seq触发ACK）" },
            { label: "← ACK（对端正常）", from: "server", color: C.ack, note: "keepalive 确认" },
            { label: "Keepalive probe #2 →", from: "client", color: "#34d399", note: "75s 后再探测" },
            { label: "× 无响应（对端已挂）", from: "server", color: "#f87171", lost: true, lostAt: 60, note: "keepintvl×keepcnt 后放弃" },
        ],
        timing: "可配置：tcp_keepalive_time(7200s) + tcp_keepalive_intvl(75s) × tcp_keepalive_probes(9)",
        layers: {
            hw: { nic: "正常转发探测包", sw: "探测包经过交换机时维持 NAT/防火墙状态表活跃", router: "路由器正常转发；部分防火墙会过滤无数据的 Keepalive 包" },
            os: { state: "ESTABLISHED → 探测期 → CLOSE", action: "内核定时器触发；全部探测无响应后销毁 TCB，通知应用层", errno: "ETIMEDOUT (110)" },
            browser: { detect: "上层应用通常不直接处理 Keepalive，由 OS 透明处理", ui: "若探测失败，挂起的请求报 ETIMEDOUT", retry: "连接池发现连接失效后，从池中移除并建立新连接" },
        },
        notes: ["Linux 可通过 setsockopt(SO_KEEPALIVE) 或 /proc/sys/net/ipv4/tcp_keepalive_* 调整", "Keepalive 探测包：seq = snd_nxt - 1，是一个「非法」序号，迫使对端回 ACK", "与 HTTP Keep-Alive（连接复用）是完全不同的概念，勿混淆"],
    },
    {
        id: "halfopen",
        label: "半开连接",
        icon: "🪢",
        color: "#c084fc",
        trigger: "一端（如服务器）崩溃重启，未发 FIN/RST；另一端仍认为连接正常",
        desc: "服务器重启后 TCB 已清空，客户端发数据时服务器回 RST，揭示「幽灵连接」。",
        packets: [
            { label: "← 服务器重启，TCB 丢失 →", from: "server", color: C.dim, note: "未发 FIN/RST" },
            { label: "DATA →（客户端不知道）", from: "client", color: C.http, note: "客户端仍认为连接正常" },
            { label: "← RST（服务器：我不认识你）", from: "server", color: "#f87171", note: "服务器无此连接记录" },
        ],
        timing: "客户端首次发送数据时立即发现（收到 RST）",
        layers: {
            hw: { nic: "正常转发，无感知", sw: "正常转发", router: "正常转发；若服务器 IP 变化则路由不通，另当别论" },
            os: { state: "客户端 ESTABLISHED → 收到 RST → CLOSED", action: "服务器：收到不认识的 seq 数据包，发送 RST；客户端：收到 RST，销毁 TCB", errno: "ECONNRESET (104)" },
            browser: { detect: "立即感知（数据发送后立即收到 RST）", ui: "「ERR_CONNECTION_RESET」", retry: "浏览器通常会对幂等请求（GET）自动重试，触发重新建立连接" },
        },
        notes: ["服务端进程重启比操作系统重启更危险：OS重启会发RST，进程重启可能不会（取决于SO_LINGER设置）", "用 TCP Keepalive 可提前检测到服务端重启（探测无响应）", "连接池需要实现「连接有效性检测」，防止从池中取出死连接"],
    },
    {
        id: "icmp",
        label: "ICMP 不可达 / 路由黑洞",
        icon: "🕳️",
        color: "#38bdf8",
        trigger: "目标主机/端口不可达（ICMP Type 3）；或路由器静默丢包",
        desc: "ICMP 差错报文可快速通知 TCP 栈；若中间设备过滤 ICMP，则退化为超时。",
        packets: [
            { label: "SYN →", from: "client", color: C.syn, note: "尝试连接" },
            { label: "× SYN 被路由器丢弃", from: "client", color: "#38bdf8", lost: true, lostAt: 60, note: "无路由 / ACL 丢弃" },
            { label: "← ICMP Port Unreachable", from: "server", color: "#38bdf8", note: "Type=3 Code=3（若未被过滤）" },
        ],
        timing: "ICMP 可达时毫秒级；ICMP 被过滤时退化为 SYN 超时（约75秒）",
        layers: {
            hw: { nic: "无感知", sw: "若 ACL 在交换机上，三层交换机拦截并可生成 ICMP；普通二层交换机不识别", router: "路由器无路由时丢包，并可生成 ICMP Dest Unreachable；防火墙通常过滤 ICMP（造成黑洞）" },
            os: { state: "SYN_SENT → 收到 ICMP → CLOSED", action: "收到 ICMP Unreachable → 立即关闭 socket；未收到 ICMP → SYN 重传（默认6次，约127s）", errno: "ECONNREFUSED (111) [ICMP] / ETIMEDOUT (110) [超时]" },
            browser: { detect: "ICMP 可达时快速失败；被过滤时等待超时", ui: "「ERR_CONNECTION_REFUSED」（快速）或「ERR_TIMED_OUT」（慢速）", retry: "连接失败通常不自动重试" },
        },
        notes: ["Path MTU Discovery（PMTUD）依赖 ICMP Type 3 Code 4（需要分片），被过滤会导致 PMTU 黑洞", "TCP 的 Black Hole Detection（RFC 4821）用 Packetization Layer PMTUD 绕过此问题", "现代 OS 对 ICMP 软错误（soft error）的处理比硬错误更保守，不会立即断开"],
    },
];

// ─── Scenario flow animation ───────────────────────────────────────────────
function ScenarioPacket({ label, from, color, note, lost, lostAt = 50, delay = 0, lpad = 18, rpad = 82 }) {
    const startPct = from === "client" ? lpad : rpad;
    const endPct = lost ? lostAt : (from === "client" ? rpad : lpad);
    const [pct, setPct] = useState(startPct);
    const [opacity, setOpacity] = useState(1);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => {
            setVis(true);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setPct(endPct);
                    if (lost) setTimeout(() => setOpacity(0), 400);
                }, 30);
            });
        }, delay);
        return () => clearTimeout(t1);
    }, []);

    if (!vis) return null;
    return (
        <div style={{ position: "relative", height: 36, marginBottom: 4 }}>
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `${Math.min(lpad, rpad)}%`, width: `${Math.abs(rpad - lpad)}%`, height: 1, background: color + "20" }} />
            <div style={{
                position: "absolute", left: `${pct}%`, transform: "translateX(-50%)",
                transition: "left 0.55s cubic-bezier(.4,0,.2,1), opacity 0.3s",
                opacity,
                background: color + (lost ? "25" : "18"),
                border: `1px solid ${color}${lost ? "60" : "80"}`,
                borderStyle: lost ? "dashed" : "solid",
                borderRadius: 5, padding: "3px 10px",
                fontSize: 11, fontFamily: "monospace", color, whiteSpace: "nowrap",
                boxShadow: lost ? "none" : `0 0 8px ${color}25`, zIndex: 2,
            }}>
                <span style={{ fontWeight: 700 }}>{label}</span>
                {note && <span style={{ color: C.dim, marginLeft: 6, fontSize: 9 }}>{note}</span>}
                {lost && <span style={{ marginLeft: 4 }}>💥</span>}
            </div>
        </div>
    );
}

// ─── Layer response card ───────────────────────────────────────────────────
function LayerCard({ icon, title, color, items }) {
    return (
        <div style={{ background: "#070c18", border: `1px solid ${color}33`, borderRadius: 7, padding: "12px 14px", flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "monospace" }}>{title}</span>
            </div>
            {items.map(({ label, value }, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 9, color: C.dim, fontFamily: "monospace", letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.6 }}>{value}</div>
                </div>
            ))}
        </div>
    );
}

// ─── Main scenario demo panel ──────────────────────────────────────────────
function ScenarioDemo() {
    const [selectedId, setSelectedId] = useState("rst");
    const [animKey, setAnimKey] = useState(0);
    const sc = SCENARIOS.find(s => s.id === selectedId);

    const select = (id) => { setSelectedId(id); setAnimKey(k => k + 1); };

    const hwItems = [
        { label: "NIC / 网卡", value: sc.layers.hw.nic },
        { label: "交换机", value: sc.layers.hw.sw },
        { label: "路由器 / NAT / 防火墙", value: sc.layers.hw.router },
    ];
    const osItems = [
        { label: "TCP 状态迁移", value: sc.layers.os.state },
        { label: "内核动作", value: sc.layers.os.action },
        { label: "errno", value: <Tag xs color="#f87171">{sc.layers.os.errno}</Tag> },
    ];
    const browserItems = [
        { label: "感知时机", value: sc.layers.browser.detect },
        { label: "用户界面", value: sc.layers.browser.ui },
        { label: "重试策略", value: sc.layers.browser.retry },
    ];

    return (
        <div>
            {/* Scenario selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
                {SCENARIOS.map(s => (
                    <div key={s.id} onClick={() => select(s.id)} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "9px 12px", borderRadius: 6, cursor: "pointer",
                        background: selectedId === s.id ? s.color + "18" : "#070c18",
                        border: `1px solid ${selectedId === s.id ? s.color + "66" : C.border}`,
                        transition: "all .2s",
                    }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: selectedId === s.id ? s.color : C.text }}>{s.label}</div>
                            <div style={{ fontSize: 9, color: C.dim, marginTop: 1, fontFamily: "monospace" }}>{s.timing.slice(0, 28)}…</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trigger + timing bar */}
            <div style={{ background: sc.color + "12", border: `1px solid ${sc.color}33`, borderRadius: 7, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 3 }}>触发原因</div>
                    <div style={{ fontSize: 12, color: sc.color, fontWeight: 700 }}>{sc.trigger}</div>
                    <div style={{ fontSize: 11, color: C.dim, marginTop: 4, lineHeight: 1.6 }}>{sc.desc}</div>
                </div>
                <div style={{ minWidth: 200 }}>
                    <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 3 }}>检测时延</div>
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{sc.timing}</div>
                </div>
            </div>

            {/* Packet flow animation */}
            <div style={{ background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 7, padding: "12px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 10 }}>报文交互</div>
                {/* Endpoint labels */}
                <div style={{ display: "flex", marginBottom: 8 }}>
                    <div style={{ width: "18%", display: "flex", justifyContent: "flex-end", paddingRight: 8 }}>
                        <div style={{ background: C.client + "18", border: `1px solid ${C.client}44`, borderRadius: 5, padding: "3px 10px", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.client }}>CLIENT</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 10, color: C.dim, fontFamily: "monospace", background: "#0d1a2a", border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 10px" }}>
                            ▤ Router / NAT / Firewall
                        </div>
                    </div>
                    <div style={{ width: "18%", display: "flex", justifyContent: "flex-start", paddingLeft: 8 }}>
                        <div style={{ background: C.server + "18", border: `1px solid ${C.server}44`, borderRadius: 5, padding: "3px 10px", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.server }}>SERVER</div>
                    </div>
                </div>
                <div style={{ position: "relative", minHeight: sc.packets.length * 40 + 20, borderTop: `1px dashed ${C.border}`, borderBottom: `1px dashed ${C.border}`, padding: "10px 0" }}>
                    <div style={{ position: "absolute", left: "18%", top: 0, bottom: 0, width: 1, background: C.client + "25" }} />
                    <div style={{ position: "absolute", left: "82%", top: 0, bottom: 0, width: 1, background: C.server + "25" }} />
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.border, borderLeft: "1px dashed" }} />
                    {sc.packets.map((p, i) => (
                        <ScenarioPacket key={`${animKey}-${i}`} {...p} delay={i * 700} lpad={18} rpad={82} />
                    ))}
                </div>
                <button onClick={() => setAnimKey(k => k + 1)} style={{ marginTop: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.dim, borderRadius: 4, padding: "4px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 10 }}>↺ 重播</button>
            </div>

            {/* Layer response panels */}
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>各层响应机制</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <LayerCard icon="🖧" title="网络硬件层" color="#60a5fa" items={hwItems} />
                <LayerCard icon="🐧" title="操作系统 / TCP 栈" color="#a78bfa" items={osItems} />
                <LayerCard icon="🌐" title="浏览器 / 应用层" color="#34d399" items={browserItems} />
            </div>

            {/* Tech notes */}
            <div style={{ background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>深入要点</div>
                {sc.notes.map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: sc.color, fontFamily: "monospace", flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 11, color: C.dim, lineHeight: 1.7 }}>{n}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const STEPS = [
    { id: 1, phase: "handshake", label: "建立连接 (TCP + TLS)", color: C.syn, desc: "TCP 三次握手 → TLS 握手。第三次 ACK 即可携带 HTTP 数据（合并减少 RTT）。序号/确认号/窗口从此建立。" },
    { id: 2, phase: "transfer", label: "数据传输（双向）", color: C.http, desc: "客户端/服务端各自维护独立序号空间。TCP 滑动窗口控制在途数据量，ACK 可累计确认多个段。" },
    { id: 3, phase: "close", label: "断开连接（四次挥手）", color: C.fin, desc: "支持半关闭（Half-Close）：一方发 FIN 后仍可接收数据，直到另一方也发 FIN。FIN 本身消耗 1 个序号。" },
    { id: 4, phase: "abnormal", label: "异常断开场景", color: "#f87171", desc: "6种真实场景：RST复位、物理断链、NAT超时、Keepalive探测、半开连接、ICMP不可达。分析硬件/OS/浏览器的各层响应。" },
];

export default function App() {
    const [httpVer, setHttpVer] = useState("1");
    const [ipVer, setIpVer] = useState("4");
    const [closeMode, setCloseMode] = useState("full");
    const [activeStep, setActiveStep] = useState(0);
    const [tab, setTab] = useState("flow");
    const step = STEPS[activeStep];

    const tabs = [
        { id: "flow", label: "流程动画" },
        { id: "seqtab", label: "序号详表" },
        { id: "window", label: "滑动窗口" },
        { id: "format", label: "报文格式" },
        { id: "compare", label: "版本对比" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'IBM Plex Mono','Fira Code',monospace" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap');
        *{box-sizing:border-box}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#080d1a}
        ::-webkit-scrollbar-thumb{background:#192840;border-radius:3px}
      `}</style>

            <div style={{ background: "linear-gradient(135deg,#0c1422,#060b16)", borderBottom: `1px solid ${C.border}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontSize: 10, color: C.dim, letterSpacing: 3, marginBottom: 3 }}>NETWORK PROTOCOL VISUALIZER</div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: -.5 }}>HTTP 连接全过程图解</h1>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
                        {["1", "2"].map(v => (<button key={v} onClick={() => setHttpVer(v)} style={{ padding: "6px 14px", background: httpVer === v ? (v === "1" ? C.accent : C.accent2) + "20" : "transparent", border: "none", color: httpVer === v ? (v === "1" ? C.accent : C.accent2) : C.dim, fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRight: v === "1" ? `1px solid ${C.border}` : "none", transition: "all .2s" }}>HTTP/{v === "1" ? "1.1" : "2.0"}</button>))}
                    </div>
                    <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
                        {["4", "6"].map(v => (<button key={v} onClick={() => setIpVer(v)} style={{ padding: "6px 14px", background: ipVer === v ? (v === "4" ? C.ipv4 : C.ipv6) + "20" : "transparent", border: "none", color: ipVer === v ? (v === "4" ? C.ipv4 : C.ipv6) : C.dim, fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRight: v === "4" ? `1px solid ${C.border}` : "none", transition: "all .2s" }}>IPv{v}</button>))}
                    </div>
                    {activeStep === 2 && (
                        <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
                            {[["full", "四次挥手"], ["half", "半关闭"]].map(([v, l]) => (<button key={v} onClick={() => setCloseMode(v)} style={{ padding: "6px 12px", background: closeMode === v ? C.fin + "20" : "transparent", border: "none", color: closeMode === v ? C.fin : C.dim, fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRight: v === "full" ? `1px solid ${C.border}` : "none", transition: "all .2s" }}>{l}</button>))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", height: "calc(100vh - 77px)" }}>
                <div style={{ width: 220, flexShrink: 0, background: "#070c18", borderRight: `1px solid ${C.border}`, padding: 14, overflowY: "auto" }}>
                    <SectionTitle>PHASES</SectionTitle>
                    {STEPS.map((s, i) => (
                        <div key={s.id} onClick={() => setActiveStep(i)} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "8px 9px", borderRadius: 6, cursor: "pointer", background: activeStep === i ? s.color + "14" : "transparent", border: `1px solid ${activeStep === i ? s.color + "44" : "transparent"}`, marginBottom: 4, transition: "all .25s" }}>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: activeStep === i ? s.color : "#192840", border: `2px solid ${activeStep === i ? s.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: activeStep === i ? C.bg : C.dim, flexShrink: 0, boxShadow: activeStep === i ? `0 0 8px ${s.color}55` : "none", transition: "all .25s" }}>{s.id}</div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: activeStep === i ? s.color : C.dim, transition: "color .25s" }}>{s.label}</div>
                                {activeStep === i && <div style={{ fontSize: 10, color: C.dim, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>}
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                        <SectionTitle>LEGEND</SectionTitle>
                        {[{ color: C.syn, label: "SYN / 握手" }, { color: C.ack, label: "ACK / 确认" }, { color: C.fin, label: "FIN / 断连" }, { color: C.http, label: "HTTP 数据" }, { color: C.win, label: "窗口控制" }, { color: C.tls, label: "TLS 加密" }, { color: C.ipv4, label: "IPv4" }, { color: C.ipv6, label: "IPv6" }].map(l => (
                            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                                <div style={{ width: 9, height: 9, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 10, color: C.dim }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.color, boxShadow: `0 0 7px ${step.color}`, animation: "pulse 2s infinite", flexShrink: 0 }} />
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: step.color, fontFamily: "'Space Grotesk',sans-serif" }}>Phase {step.id}：{step.label}</h2>
                        <Tag color={ipVer === "4" ? C.ipv4 : C.ipv6}>IPv{ipVer}</Tag>
                        <Tag color={httpVer === "2" ? C.accent2 : C.accent}>HTTP/{httpVer === "1" ? "1.1" : "2.0"}</Tag>
                        {activeStep === 2 && <Tag color={C.fin}>{closeMode === "half" ? "半关闭" : "四次挥手"}</Tag>}
                    </div>

                    {step.phase !== "abnormal" && (
                        <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden", width: "fit-content", marginBottom: 16 }}>
                            {tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 13px", background: tab === t.id ? C.accent + "18" : "transparent", border: "none", borderRight: `1px solid ${C.border}`, color: tab === t.id ? C.accent : C.dim, fontFamily: "monospace", fontSize: 11, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>{t.label}</button>))}
                        </div>
                    )}

                    {step.phase === "abnormal" && <ScenarioDemo />}

                    {step.phase !== "abnormal" && tab === "flow" && (
                        <div>
                            <FlowDiagram key={`${step.phase}-${httpVer}-${ipVer}-${closeMode}`} phase={step.phase} httpVer={httpVer} ipVer={ipVer} closeMode={closeMode} />
                            {step.phase === "handshake" && (
                                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    {[
                                        { title: "TCP 三次握手（第3次可携带数据）", color: C.syn, items: [`① SYN  → seq=${ISN_C}, win=65535`, `② ← SYN-ACK  seq=${ISN_S}, ack=${ISN_C + 1}`, `③ ACK+数据 → seq=${ISN_C + 1}, ack=${ISN_S + 1}, +${REQ_BYTES}B HTTP请求`, `TCP Fast Open 可在 SYN 阶段携带数据`] },
                                        { title: "TLS 1.3 握手（1-RTT）", color: C.tls, items: ["ClientHello（支持的密码套件 + key_share）", "← ServerHello + {EncryptedExts + Cert + Finished}", "Finished → （握手完成，开始加密传输）", "HTTP/2 通过 ALPN 扩展协商 h2 协议"] },
                                    ].map(box => (
                                        <div key={box.title} style={{ background: C.panel, border: `1px solid ${box.color}30`, borderRadius: 7, padding: 13 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: box.color, marginBottom: 8 }}>{box.title}</div>
                                            {box.items.map((s, i) => (<div key={i} style={{ fontSize: 10, color: C.dim, padding: "3px 0", borderBottom: `1px solid ${C.border}25`, lineHeight: 1.6, fontFamily: "monospace" }}>{s}</div>))}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {step.phase === "close" && (
                                <div style={{ marginTop: 14, background: C.panel, border: `1px solid ${C.fin}25`, borderRadius: 7, padding: 13 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: C.fin, marginBottom: 6 }}>{closeMode === "half" ? "半关闭（Half-Close）：一方关闭发送，另一方仍可发数据" : "四次挥手：完全关闭双向连接"}</div>
                                    <div style={{ fontSize: 10, color: C.dim, lineHeight: 2, fontFamily: "monospace" }}>
                                        {(closeMode === "half" ? ["→ FIN (Client 关闭发送方向，仍可接收)", "← ACK", "← 剩余数据（Server 仍在发送）", "→ ACK（Client 确认数据）", "← FIN（Server 也关闭）", "→ ACK [TIME_WAIT 2MSL]"] : ["→ FIN (主动关闭方)", "← ACK", "← FIN (被动方关闭)", "→ ACK [TIME_WAIT 2MSL]"]).map((s, i) => (<div key={i} style={{ borderLeft: `2px solid ${C.fin}40`, paddingLeft: 10, marginBottom: 3 }}>{s}</div>))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step.phase !== "abnormal" && tab === "seqtab" && (
                        <div>
                            <div style={{ marginBottom: 10, fontSize: 11, color: C.dim }}>客户端序号空间（<span style={{ color: C.client }}>ISN={ISN_C}</span>）与服务端序号空间（<span style={{ color: C.server }}>ISN={ISN_S}</span>）完全独立，互不干扰。</div>
                            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                                <SeqTimeline phase={step.phase} closeMode={closeMode} />
                            </div>
                            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                {[
                                    { color: C.accent, label: "seq（序列号）", desc: "发送方的当前字节偏移 = ISN + 已发字节数。FIN 和 SYN 各消耗 1 个序号。" },
                                    { color: C.accent2, label: "ack（确认号）", desc: "期望对方下一个 seq 值 = 已成功收到的最大 seq + 1。可累计确认多个段。" },
                                    { color: C.win, label: "win（窗口）", desc: "接收缓冲区剩余空间，控制对方最多能发多少字节而不超出接收能力。" },
                                ].map(b => (
                                    <div key={b.label} style={{ background: "#060b16", border: `1px solid ${b.color}30`, borderRadius: 6, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 5 }}>{b.label}</div>
                                        <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.7 }}>{b.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step.phase !== "abnormal" && tab === "window" && (
                        <div>
                            <div style={{ marginBottom: 10, fontSize: 11, color: C.dim }}>TCP 滑动窗口：发送方在未收到 ACK 的情况下，最多可以有「窗口大小」字节在途。窗口随 ACK 向右滑动。</div>
                            <SlidingWindowViz />
                            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[
                                    { color: C.win, title: "窗口扩展（Window Scale）", body: "握手时通过 TCP 选项协商 Window Scale 因子（0-14），实际窗口 = win × 2^scale。高带宽长延迟网络（BDP 大）必须使用。" },
                                    { color: C.accent2, title: "SACK（选择性确认）", body: "标准 ACK 只能累计确认连续字节。SACK 选项允许接收方告知发送方「哪些不连续区间已收到」，避免重复重传。" },
                                ].map(b => (
                                    <div key={b.title} style={{ background: C.panel, border: `1px solid ${b.color}30`, borderRadius: 7, padding: 13 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 6 }}>{b.title}</div>
                                        <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.8 }}>{b.body}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step.phase !== "abnormal" && tab === "format" && (
                        <div>
                            <div style={{ marginBottom: 10, fontSize: 11, color: C.dim }}>每格 = 1 bit，共 32 bit / 行。高亮字段为当前阶段关键标志位。悬停格子可查看字段说明。</div>
                            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                                <HeaderDiagram phase={step.phase} ipVer={ipVer} httpVer={httpVer} />
                            </div>
                        </div>
                    )}

                    {step.phase !== "abnormal" && tab === "compare" && (
                        <div>
                            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                                <CompareTable />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[
                                    { color: C.ipv4, title: "IPv4 首部与 TCP", items: ["首部 20B 固定 + 可变选项", "Protocol=6 标识上层为 TCP", "TTL 防环，Header Checksum 校验", "分片在中间路由器或目标主机重组", "NAT 常见，端口复用"] },
                                    { color: C.ipv6, title: "IPv6 首部与 TCP", items: ["首部 40B 固定，无 Checksum", "Next Header=6 (TCP) 或扩展头链", "Hop Limit 替代 TTL", "不允许路由器分片（Path MTU Discovery）", "Flow Label 可区分同源 TCP 连接"] },
                                ].map(b => (
                                    <div key={b.title} style={{ background: "#060b16", border: `1px solid ${b.color}30`, borderRadius: 7, padding: 13 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 8 }}>{b.title}</div>
                                        {b.items.map((s, i) => (<div key={i} style={{ fontSize: 10, color: C.dim, padding: "3px 0", borderBottom: `1px solid ${C.border}20`, lineHeight: 1.6 }}>• {s}</div>))}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, background: "#060b16", border: `1px solid ${C.border}`, borderRadius: 7, padding: 13 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, marginBottom: 6, letterSpacing: 1 }}>HTTP/3 与 QUIC 预告</div>
                                <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.8 }}>HTTP/3 基于 <span style={{ color: C.accent }}>QUIC</span>（UDP + TLS 1.3 内置），彻底消除 TCP 层队头阻塞；0-RTT 重连；连接迁移；IPv4/IPv6 均可运行（RFC 9114）。</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}