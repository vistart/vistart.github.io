"""
DNS 递归解析演示服务
依赖: pip install fastapi uvicorn dnspython

启动: uvicorn dns_server:app --host 0.0.0.0 --port 8000 --reload
"""

import time
import random
from typing import Optional
import dns.query
import dns.message
import dns.name
import dns.rdatatype
import dns.resolver
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="DNS 解析演示服务", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_SERVERS = {
    "a.root-servers.net": "198.41.0.4",
    "b.root-servers.net": "170.247.170.2",
    "c.root-servers.net": "192.33.4.12",
    "f.root-servers.net": "192.5.5.241",
    "k.root-servers.net": "193.0.14.129",
    "m.root-servers.net": "202.12.27.33",
}

RECORD_TYPE_DESC = {
    "A":     "IPv4 地址",
    "AAAA":  "IPv6 地址",
    "MX":    "邮件交换服务器",
    "TXT":   "文本记录",
    "NS":    "权威域名服务器",
    "CNAME": "域名别名",
    "CAA":   "证书颁发机构授权",
    "SRV":   "服务位置记录",
}

SUPPORTED_TYPES = set(RECORD_TYPE_DESC.keys())


class CnameHop(BaseModel):
    from_name: str
    to_name: str
    ttl: int


class DnsStep(BaseModel):
    seq: int
    from_node: str
    to_node: str
    direction: str
    type: str
    msg: str
    note: str
    latency_ms: Optional[float]


class DnsInfo(BaseModel):
    domain: str
    record_type: str
    base_domain: str
    tld: str
    tld_server: str
    root_server: str
    ns1: str
    records: list[str]
    ttl: Optional[int]
    cname_chain: list[CnameHop]
    steps: list[DnsStep]
    total_ms: float


# ── 工具函数 ──────────────────────────────────────────────────────────────────

def query_ns(server_ip: str, qname: str, timeout: float = 3.0):
    """向指定服务器查询 NS 委派信息，返回 (ns_names, glue_ips)"""
    request = dns.message.make_query(qname, dns.rdatatype.NS)
    try:
        response = dns.query.udp(request, server_ip, timeout=timeout)
    except Exception as e:
        raise RuntimeError(f"查询 {server_ip} 失败: {e}")

    ns_names = []
    glue_ips = {}
    for rrset in list(response.answer) + list(response.authority):
        if rrset.rdtype == dns.rdatatype.NS:
            for rdata in rrset:
                ns_names.append(str(rdata.target).rstrip("."))
    for rrset in response.additional:
        if rrset.rdtype == dns.rdatatype.A:
            glue_ips[str(rrset.name).rstrip(".")] = str(rrset[0])
    return ns_names, glue_ips


def resolve_ns_ip(ns_name: str, glue: dict) -> Optional[str]:
    """从胶水记录或系统解析器获取 NS 的 IP"""
    if ns_name in glue:
        return glue[ns_name]
    try:
        return str(dns.resolver.resolve(ns_name, "A", lifetime=3)[0])
    except Exception:
        return None


def format_rdata(rdata, rtype: str) -> str:
    """将 rdata 对象格式化为可读字符串"""
    if rtype == "MX":
        return f"{rdata.preference} {str(rdata.exchange).rstrip('.')}"
    if rtype in ("NS", "CNAME"):
        return str(rdata.target).rstrip(".")
    if rtype == "SRV":
        return f"{rdata.priority} {rdata.weight} {rdata.port} {str(rdata.target).rstrip('.')}"
    if rtype == "CAA":
        return f"{rdata.flags} {rdata.tag.decode()} {rdata.value.decode()}"
    return str(rdata)


def query_record(server_ip: str, qname: str, rtype_str: str, timeout: float = 3.0):
    """
    向权威服务器查询指定类型记录。
    返回 (records, ttl, cname_chain)
    """
    rdtype = dns.rdatatype.from_text(rtype_str)
    request = dns.message.make_query(qname, rdtype)
    try:
        response = dns.query.udp(request, server_ip, timeout=timeout)
    except Exception as e:
        raise RuntimeError(f"查询 {rtype_str} 记录失败: {e}")

    records = []
    ttl = None
    cname_chain: list[CnameHop] = []
    current_name = qname.rstrip(".")

    # 收集 answer 中所有 CNAME 跳
    for rrset in response.answer:
        if rrset.rdtype == dns.rdatatype.CNAME:
            target = str(rrset[0].target).rstrip(".")
            cname_chain.append(CnameHop(from_name=current_name, to_name=target, ttl=rrset.ttl))
            current_name = target

    # 收集目标类型的记录
    for rrset in response.answer:
        if rrset.rdtype == rdtype:
            ttl = rrset.ttl
            for rdata in rrset:
                records.append(format_rdata(rdata, rtype_str))

    # CNAME 指向外部域时，用系统解析器追最终 A/AAAA
    if cname_chain and not records and rtype_str in ("A", "AAAA"):
        final_target = cname_chain[-1].to_name
        try:
            ans = dns.resolver.resolve(final_target, rtype_str, lifetime=5)
            ttl = ans.rrset.ttl
            records = [str(r) for r in ans]
        except Exception:
            pass

    # CNAME 类型查询本身，直接返回别名目标
    if rtype_str == "CNAME" and not records and cname_chain:
        records = [cname_chain[-1].to_name]

    return records, ttl, cname_chain


def build_result_summary(rtype: str, records: list[str], cname_chain: list[CnameHop]) -> tuple[str, str]:
    """构造 Step 7 的短消息和详细说明"""
    if not records:
        return f"（未找到 {rtype} 记录）", f"权威服务器未返回任何 {rtype} 记录，该记录可能不存在"

    if cname_chain:
        chain_str = " → ".join([cname_chain[0].from_name] + [h.to_name for h in cname_chain])
        if rtype == "CNAME":
            msg = f"CNAME {records[0]}"
            note = (f"权威服务器返回 CNAME 别名记录。完整映射链：{chain_str}。"
                    f"客户端拿到 CNAME 后需再次解析目标域名的 A/AAAA 才能获得 IP，"
                    f"这次额外的查询对用户透明，由浏览器/解析器自动完成。")
        else:
            msg = f"CNAME→{rtype} {records[0]}"
            note = (f"权威服务器先返回 CNAME 跳转（{chain_str}），"
                    f"解析器沿链追踪，最终找到 {rtype} 记录：{', '.join(records)}。"
                    f"整个 CNAME 链对客户端透明，解析器自动完成所有跳转后再返回结果。")
        return msg, note

    if rtype == "A":
        extra = f"多条 A 记录可实现 DNS 轮询负载均衡。" if len(records) > 1 else ""
        msg = f"A {records[0]}" + (f" (+{len(records)-1}条)" if len(records) > 1 else "")
        note = f"权威服务器返回 IPv4 地址：{', '.join(records)}。{extra}"
    elif rtype == "AAAA":
        msg = f"AAAA {records[0][:22]}…" if len(records[0]) > 26 else f"AAAA {records[0]}"
        note = f"权威服务器返回 IPv6 地址：{', '.join(records)}。"
    elif rtype == "MX":
        msg = f"MX {records[0]}"
        note = (f"权威服务器返回 {len(records)} 条 MX 邮件交换记录，格式为「优先级 服务器」，"
                f"优先级数值越小越优先：{'; '.join(records)}。")
    elif rtype == "TXT":
        preview = records[0][:50] + "…" if len(records[0]) > 50 else records[0]
        msg = f'TXT "{preview}"'
        note = (f"权威服务器返回 {len(records)} 条 TXT 记录，"
                f"常见用途：SPF/DKIM 邮件安全、域名所有权验证（Google/GitHub）、DMARC 策略等。")
    elif rtype == "NS":
        msg = f"NS {records[0]}"
        note = f"权威服务器返回该域名的 NS 权威服务器列表（共 {len(records)} 条）：{', '.join(records)}。"
    elif rtype == "CAA":
        msg = f"CAA {records[0]}"
        note = (f"权威服务器返回 CAA 证书授权记录，"
                f"限制允许为该域名签发 TLS 证书的 CA 机构：{'; '.join(records)}。")
    elif rtype == "SRV":
        msg = f"SRV {records[0]}"
        note = (f"权威服务器返回 SRV 服务位置记录（格式：优先级 权重 端口 目标主机）："
                f"{'; '.join(records)}。")
    else:
        msg = f"{rtype} {records[0]}"
        note = f"权威服务器返回 {len(records)} 条 {rtype} 记录：{', '.join(records)}。"

    return msg, note


# ── API 端点 ──────────────────────────────────────────────────────────────────

@app.get("/resolve", response_model=DnsInfo)
async def resolve_domain(domain: str, record_type: str = "A"):
    """
    真实迭代解析指定域名的指定记录类型，返回完整逐跳过程。

    - **domain**: 待查询域名，如 www.google.com
    - **record_type**: 记录类型，支持 A / AAAA / MX / TXT / NS / CNAME / CAA / SRV（默认 A）
    """
    domain = domain.strip().lower().rstrip(".")
    record_type = record_type.upper().strip()

    if not domain or "." not in domain:
        raise HTTPException(400, "请提供有效域名，如 www.google.com")
    if record_type not in SUPPORTED_TYPES:
        raise HTTPException(400, f"不支持的记录类型 {record_type}，支持：{', '.join(sorted(SUPPORTED_TYPES))}")

    rtype_desc = RECORD_TYPE_DESC[record_type]
    steps: list[DnsStep] = []
    total_start = time.time()

    parts = domain.split(".")
    tld = parts[-1]
    base_domain = ".".join(parts[-2:]) if len(parts) >= 2 else domain

    # MX/TXT/CAA 通常挂在裸域，若用户直接输入了裸域则直接查
    auth_qname = domain

    # ── Step 1 ────────────────────────────────────────────────────────────────
    steps.append(DnsStep(
        seq=1, from_node="client", to_node="resolver",
        direction="right", type="Q",
        msg=f"递归查询 {domain} {record_type}",
        note=f"客户端向 DNS 解析器发起递归查询，请求 {domain} 的 {record_type}（{rtype_desc}）记录（UDP 53 端口）",
        latency_ms=None
    ))

    # ── Step 2: 解析器 → 根服务器 ─────────────────────────────────────────────
    root_name = random.choice(list(ROOT_SERVERS.keys()))
    root_ip = ROOT_SERVERS[root_name]

    t0 = time.time()
    try:
        tld_ns_names, tld_glue = query_ns(root_ip, tld + ".")
    except RuntimeError as e:
        raise HTTPException(502, str(e))
    root_latency = round((time.time() - t0) * 1000, 1)

    steps.append(DnsStep(
        seq=2, from_node="resolver", to_node="root",
        direction="right", type="Q",
        msg=f"谁负责 .{tld} 顶级域？",
        note=f"解析器缓存未命中，向根服务器 {root_name}（{root_ip}）发起迭代查询。根服务器不关心记录类型，只负责 TLD 委派",
        latency_ms=root_latency
    ))

    # ── Step 3: 根服务器 → 解析器 ─────────────────────────────────────────────
    tld_server_name = tld_ns_names[0] if tld_ns_names else "a.gtld-servers.net"
    steps.append(DnsStep(
        seq=3, from_node="root", to_node="resolver",
        direction="left", type="R",
        msg=f"→ {tld_server_name} (NS .{tld})",
        note=f"根服务器返回负责 .{tld} 的 TLD 服务器列表（共 {len(tld_ns_names)} 个），只是委派，并不包含最终答案",
        latency_ms=root_latency
    ))

    # ── Step 4: 解析器 → TLD 服务器 ───────────────────────────────────────────
    tld_ip = resolve_ns_ip(tld_server_name, tld_glue)
    if not tld_ip:
        raise HTTPException(502, f"无法解析 TLD 服务器 {tld_server_name} 的 IP")

    t0 = time.time()
    try:
        auth_ns_names, auth_glue = query_ns(tld_ip, base_domain + ".")
    except RuntimeError as e:
        raise HTTPException(502, str(e))
    tld_latency = round((time.time() - t0) * 1000, 1)

    steps.append(DnsStep(
        seq=4, from_node="resolver", to_node="tld",
        direction="right", type="Q",
        msg=f"{base_domain} 的 NS 记录？",
        note=(f"解析器向 TLD 服务器 {tld_server_name}（{tld_ip}）查询 {base_domain} 的权威服务器。"
              f"注意：无论查询 {record_type} 还是其他类型，步骤 2-5 始终固定查 NS 委派链"),
        latency_ms=tld_latency
    ))

    # ── Step 5: TLD 服务器 → 解析器 ───────────────────────────────────────────
    ns1_name = auth_ns_names[0] if auth_ns_names else f"ns1.{base_domain}"
    steps.append(DnsStep(
        seq=5, from_node="tld", to_node="resolver",
        direction="left", type="R",
        msg=f"→ {ns1_name} (NS)",
        note=f"TLD 服务器返回 {base_domain} 的权威 NS 列表（共 {len(auth_ns_names)} 个），委派给权威服务器处理",
        latency_ms=tld_latency
    ))

    # ── Step 6: 解析器 → 权威服务器 ───────────────────────────────────────────
    auth_ip = resolve_ns_ip(ns1_name, auth_glue)
    if not auth_ip:
        raise HTTPException(502, f"无法解析权威服务器 {ns1_name} 的 IP")

    t0 = time.time()
    try:
        records, final_ttl, cname_chain = query_record(auth_ip, auth_qname + ".", record_type)
    except RuntimeError as e:
        raise HTTPException(502, str(e))
    auth_latency = round((time.time() - t0) * 1000, 1)

    steps.append(DnsStep(
        seq=6, from_node="resolver", to_node="auth",
        direction="right", type="Q",
        msg=f"{auth_qname} {record_type} 记录？",
        note=(f"解析器向权威服务器 {ns1_name}（{auth_ip}）发起最终查询，"
              f"请求 {record_type}（{rtype_desc}）记录，这是整个递归查询中第一次真正指定记录类型"),
        latency_ms=auth_latency
    ))

    # ── Step 7: 权威服务器 → 解析器 ───────────────────────────────────────────
    ttl_display = final_ttl or 300
    result_msg, result_note = build_result_summary(record_type, records, cname_chain)
    full_note = result_note + f" TTL={ttl_display} 秒（约 {ttl_display // 60} 分钟）。"

    steps.append(DnsStep(
        seq=7, from_node="auth", to_node="resolver",
        direction="left", type="R",
        msg=f"{result_msg} TTL={ttl_display}",
        note=full_note,
        latency_ms=auth_latency
    ))

    # ── Step 8: 解析器 → 客户端 ───────────────────────────────────────────────
    total_ms = round((time.time() - total_start) * 1000, 1)
    final_display = records[0] if records else "（无记录）"

    steps.append(DnsStep(
        seq=8, from_node="resolver", to_node="client",
        direction="left", type="R",
        msg=f"{record_type} {final_display} ✓",
        note=f"解析器将结果缓存并返回给客户端，缓存 {ttl_display} 秒内有效。本次完整迭代查询耗时 {total_ms} ms",
        latency_ms=None
    ))

    return DnsInfo(
        domain=domain,
        record_type=record_type,
        base_domain=base_domain,
        tld=tld,
        tld_server=tld_server_name,
        root_server=root_name,
        ns1=ns1_name,
        records=records,
        ttl=final_ttl,
        cname_chain=cname_chain,
        steps=steps,
        total_ms=total_ms,
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {
        "service": "DNS 解析演示服务",
        "usage": "GET /resolve?domain=www.google.com&record_type=A",
        "supported_types": sorted(SUPPORTED_TYPES),
        "docs": "/docs",
    }