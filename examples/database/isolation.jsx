import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');`;

const C = {
  bg:"#0d1117", surf:"#161b22", surf2:"#1c2333", surf3:"#21262d",
  bd:"#30363d", bd2:"#21262d",
  T1:"#3fb950", T2:"#58a6ff",
  txt:"#e6edf3", mut:"#8b949e",
  red:"#f85149", amb:"#e3b341", grn:"#3fb950",
  RU:"#f85149", RC:"#e3b341", RR:"#58a6ff", S:"#3fb950",
};
const LVL = ["RU","RC","RR","S"];
const LVL_NAME = { RU:"Read Uncommitted", RC:"Read Committed", RR:"Repeatable Read", S:"Serializable" };
const LVL_FULL = { RU:"READ UNCOMMITTED", RC:"READ COMMITTED", RR:"REPEATABLE READ", S:"SERIALIZABLE" };
const LVL_BG   = { RU:"rgba(248,81,73,.12)", RC:"rgba(227,179,65,.12)", RR:"rgba(88,166,255,.12)", S:"rgba(63,185,80,.12)" };
const LVL_BD   = { RU:"rgba(248,81,73,.4)", RC:"rgba(227,179,65,.4)", RR:"rgba(88,166,255,.4)", S:"rgba(63,185,80,.4)" };
const OP_C     = { begin:"#8b949e", read:"#58a6ff", write:"#e3b341", commit:"#3fb950", rollback:"#f85149" };

// resolve(val, lid) → string | null
function rv(val, lid) {
  if (!val) return null;
  if (typeof val === "string") return val;
  return val[lid] ?? val.all ?? null;
}

// ─── Scenario data ─────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id:"bank", emoji:"🏦", title:"银行信用评估", sub:"脏读场景",
    recTag:"RC 最低足够",
    desc:"T1（转账事务）修改账户余额尚未提交；T2（信用系统）同时读取余额用于评估。若 T2 读到 T1 未提交的数据，而 T1 随后回滚，则评估结论无效。",
    table:{ name:"accounts", cols:["id","owner","balance"],
      rows:[["A","Alice","¥1,000"],["B","Bob","¥200"]] },
    rec:"RC",
    recNote:"脏读是此场景唯一风险。Read Committed 精准防止，同时保留最高并发性能。无需更强的隔离级别。",
    steps:[
      { t:1, tx:"T1", op:"begin",    sql:"BEGIN",
        desc:"Alice 发起转账事务" },
      { t:2, tx:"T2", op:"begin",    sql:"BEGIN",
        desc:"信用系统发起查询事务" },
      { t:3, tx:"T1", op:"read",     sql:"SELECT balance FROM accounts WHERE id='A'",
        reads:{ all:"¥1,000" } },
      { t:4, tx:"T1", op:"write",    sql:"UPDATE accounts SET balance=500 WHERE id='A'",
        desc:"余额修改为 ¥500，未提交" },
      { t:5, tx:"T2", op:"read",     sql:"SELECT balance FROM accounts WHERE id='A'",
        reads:{ RU:"¥500 ← 未提交！", RC:"¥1,000", RR:"¥1,000", S:"¥1,000" },
        anomaly:["RU"], aLabel:"脏读" },
      { t:6, tx:"T1", op:"rollback", sql:"ROLLBACK",
        desc:"转账失败，余额回滚至 ¥1,000" },
      { t:7, tx:"T2", op:"commit",   sql:"COMMIT",
        desc:{ RU:"❌ 基于已回滚的 ¥500 完成评估，结论错误", RC:"✓ 基于真实的 ¥1,000，评估正确", RR:"✓ 正确", S:"✓ 正确" } },
    ],
    outcomes:{
      RU:{ ok:false, type:"脏读", desc:"T2 读到 T1 未提交的 ¥500，T1 回滚后余额仍为 ¥1,000。信用评估基于无效数据，结论完全错误。" },
      RC:{ ok:true, desc:"T2 只能看到已提交的值 ¥1,000，完全规避脏读。Read Committed 是此场景的最优选择。" },
      RR:{ ok:true, desc:"同 RC，额外保证事务内读取一致性。此场景 RC 已足够，RR 略显保守。" },
      S:{ ok:true, desc:"完全安全，但性能开销最大，此场景完全不必要。" },
    }
  },
  {
    id:"report", emoji:"📊", title:"月度财务报表", sub:"幻读场景",
    recTag:"RR 推荐",
    desc:"T1 正在生成月度报表，需多次查询（先 SUM 再 COUNT）保持数据一致；T2 同期插入新订单并提交，导致 T1 两次结果不同。",
    table:{ name:"orders", cols:["id","amount","month"],
      rows:[["1","¥20,000","2024-01"],["2","¥30,000","2024-01"]] },
    rec:"RR",
    recNote:"报表需要整个事务内的一致数据快照。Repeatable Read 通过 MVCC 快照防止幻读，保证多次查询基于同一版本数据。",
    steps:[
      { t:1, tx:"T1", op:"begin",  sql:"BEGIN  -- 生成报表" },
      { t:2, tx:"T1", op:"read",   sql:"SELECT SUM(amount) FROM orders WHERE month='2024-01'",
        reads:{ all:"¥50,000" }, desc:"报表第一步：汇总金额" },
      { t:3, tx:"T2", op:"begin",  sql:"BEGIN  -- 新订单入库" },
      { t:4, tx:"T2", op:"write",  sql:"INSERT INTO orders VALUES (3, 5000, '2024-01')" },
      { t:5, tx:"T2", op:"commit", sql:"COMMIT",
        desc:"新订单 ¥5,000 已提交" },
      { t:6, tx:"T1", op:"read",   sql:"SELECT COUNT(*) FROM orders WHERE month='2024-01'",
        reads:{ RU:"3 行 ← 幻读！", RC:"3 行 ← 幻读！", RR:"2 行 ✓", S:"2 行 ✓" },
        anomaly:["RU","RC"], aLabel:"幻读" },
      { t:7, tx:"T1", op:"commit", sql:"COMMIT",
        desc:{ RU:"❌ SUM=¥50,000 但 COUNT=3，数据矛盾！", RC:"❌ SUM=¥50,000 但 COUNT=3，数据矛盾！", RR:"✓ 始终基于事务快照，COUNT=2，完全一致", S:"✓ 完全一致" } },
    ],
    outcomes:{
      RU:{ ok:false, type:"幻读", desc:"T1 的 SUM 和 COUNT 查询看到不同行数，财务报表 SUM=¥50,000 但 COUNT=3，数据自相矛盾。" },
      RC:{ ok:false, type:"幻读", desc:"T2 插入并提交后，T1 后续查询看到新行。SUM 与 COUNT 不一致，报表有误。Read Committed 无法防止幻读。" },
      RR:{ ok:true, desc:"T1 持有事务开始时的一致快照，T2 的插入对 T1 完全不可见。SUM 与 COUNT 始终基于相同数据，报表正确。" },
      S:{ ok:true, desc:"完全安全。此场景用 Repeatable Read 已足够，无需 Serializable 的额外开销。" },
    }
  },
  {
    id:"flash", emoji:"⚡", title:"电商秒杀抢购", sub:"超卖场景",
    recTag:"S / FOR UPDATE",
    desc:"限量商品库存仅剩 1 件，Alice 和 Bob 同时发起购买，两个事务都读到 stock=1 并决定下单。",
    table:{ name:"products", cols:["id","name","stock"],
      rows:[["101","限量球鞋","1"]] },
    rec:"S",
    recNote:"Serializable 检测读写冲突并中止一个事务，防止超卖。生产中更常用 SELECT FOR UPDATE + RC，用显式行锁实现，性能更好。",
    steps:[
      { t:1, tx:"T1", op:"begin",  sql:"BEGIN  -- Alice" },
      { t:2, tx:"T2", op:"begin",  sql:"BEGIN  -- Bob" },
      { t:3, tx:"T1", op:"read",   sql:"SELECT stock FROM products WHERE id=101",
        reads:{ all:"stock = 1" } },
      { t:4, tx:"T2", op:"read",   sql:"SELECT stock FROM products WHERE id=101",
        reads:{ all:"stock = 1" } },
      { t:5, tx:"T1", op:"write",  sql:"UPDATE products SET stock=stock-1 WHERE id=101",
        desc:"Alice 扣减库存" },
      { t:6, tx:"T1", op:"commit", sql:"COMMIT",
        desc:"Alice 购买成功，stock=0" },
      { t:7, tx:"T2", op:"write",  sql:"UPDATE products SET stock=stock-1 WHERE id=101",
        desc:{ RU:"stock 变为 -1 ⚠", RC:"stock 变为 -1 ⚠", RR:"stock 变为 -1 ⚠（旧快照）", S:"序列化冲突，T2 被中止" },
        anomaly:["RU","RC","RR"], aLabel:"超卖" },
      { t:8, tx:"T2", op:"commit",
        sql:{ RU:"COMMIT", RC:"COMMIT", RR:"COMMIT", S:"ROLLBACK  -- 序列化失败" },
        opByLevel:{ S:"rollback" },
        desc:{ RU:"❌ Bob\"成功\"购买，stock=-1 超卖！", RC:"❌ Bob\"成功\"购买，stock=-1 超卖！", RR:"❌ 基于旧快照决策，stock=-1 超卖！", S:"✓ Bob 收到\"库存不足\"提示，无超卖" } },
    ],
    outcomes:{
      RU:{ ok:false, type:"超卖", desc:"两个事务都通过了 stock>0 检查，最终 stock=-1，超卖发生。" },
      RC:{ ok:false, type:"超卖", desc:"并发下两个事务同时通过检查。需使用 SELECT FOR UPDATE 显式加行锁才能在 RC 级别防止超卖。" },
      RR:{ ok:false, type:"超卖（写偏斜）", desc:"T2 基于事务开始时的快照（stock=1）作出决策，T1 提交后 T2 仍继续，造成超卖。MVCC 快照无法防止此类更新冲突。" },
      S:{ ok:true, desc:"Serializable 检测到 T1 对 T2 读取集合的写入造成序列化冲突，T2 被中止。Bob 收到库存不足提示并可重试，不会超卖。" },
    }
  },
  {
    id:"social", emoji:"💬", title:"社交平台动态", sub:"RC 足够",
    recTag:"RC 最优",
    desc:"T1 用户正在浏览动态列表，T2 有人发布新内容并提交。轻微的「新内容不立即可见」在社交场景中是完全可接受的。",
    table:{ name:"posts", cols:["id","author","content"],
      rows:[["1","Alice","今天天气真好"],["2","Bob","分享技术文章"]] },
    rec:"RC",
    recNote:"社交场景读操作密集、允许轻微时间差。Read Committed 在最大化并发性能的同时保证读到有效数据，是最优选择。",
    steps:[
      { t:1, tx:"T1", op:"begin",  sql:"BEGIN  -- 用户浏览动态" },
      { t:2, tx:"T1", op:"read",   sql:"SELECT * FROM posts ORDER BY created_at DESC LIMIT 20",
        reads:{ all:"2 条动态" }, desc:"加载初始动态列表" },
      { t:3, tx:"T2", op:"begin",  sql:"BEGIN  -- Carol 发新帖" },
      { t:4, tx:"T2", op:"write",  sql:"INSERT INTO posts VALUES (3,'Carol','Hello World!')" },
      { t:5, tx:"T2", op:"commit", sql:"COMMIT" },
      { t:6, tx:"T1", op:"read",   sql:"SELECT COUNT(*) FROM posts",
        reads:{ RU:"3", RC:"3（可见新帖）", RR:"2（快照）", S:"2（快照）" },
        desc:{ RC:"✓ 已提交的新帖可见，用户刷新后自然更新", RR:"也可接受，稍有延迟" } },
      { t:7, tx:"T1", op:"commit", sql:"COMMIT",
        desc:{ RU:"可接受（无脏数据风险）", RC:"✓ 最优：高并发 + 及时可见已提交内容", RR:"安全但对此场景过于保守", S:"安全但串行化开销完全不必要" } },
    ],
    outcomes:{
      RU:{ ok:true, desc:"此场景无并发写入冲突，RU 不引入实际问题，但不建议作为默认选项。" },
      RC:{ ok:true, desc:"最优选择：并发性能最高，已提交的新内容及时可见，完全满足社交动态的业务需求。" },
      RR:{ ok:true, desc:"安全，但事务内看不到新发布内容，对高频刷新场景略显保守，还增加了快照维护开销。" },
      S:{ ok:true, desc:"安全，但对读密集场景施加串行化约束，大幅降低并发能力，属于完全不必要的过度设计。" },
    }
  },
];

// ─── Sub-component: StepCard ───────────────────────────────────────────────────

function StepCard({ step, lid, cur, visible }) {
  const opStr  = step.opByLevel?.[lid] || step.op;
  const sqlStr = rv(step.sql, lid) || step.sql;
  const rdVal  = rv(step.reads, lid);
  const descStr= rv(step.desc, lid);
  const isAnom = step.anomaly?.includes(lid) ?? false;
  const oc     = OP_C[opStr] || C.mut;

  return (
    <div style={{
      background: isAnom ? "rgba(248,81,73,.08)" : cur ? "rgba(88,166,255,.05)" : "rgba(255,255,255,.02)",
      border:`1px solid ${isAnom ? "rgba(248,81,73,.45)" : cur ? "rgba(88,166,255,.25)" : C.bd2}`,
      borderRadius:8, padding:"8px 10px",
      transition:"border-color .3s, background .3s",
      width:"100%",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:6, flexWrap:"wrap" }}>
        <span style={{ fontSize:9, fontWeight:700, color:oc, textTransform:"uppercase",
          minWidth:46, paddingTop:1, letterSpacing:".04em" }}>{opStr}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.txt,
          wordBreak:"break-all", lineHeight:1.55, flex:1 }}>{sqlStr}</span>
      </div>
      {rdVal && (
        <div style={{
          fontFamily:"'JetBrains Mono',monospace", fontSize:11, marginTop:6,
          color: isAnom ? C.red : C.T1,
          background: isAnom ? "rgba(248,81,73,.1)" : "rgba(63,185,80,.08)",
          padding:"2px 8px", borderRadius:4,
        }}>{isAnom ? "⚠ " : "→ "}{rdVal}</div>
      )}
      {descStr && (
        <div style={{ fontSize:10, color:C.mut, marginTop:5, lineHeight:1.55 }}>{descStr}</div>
      )}
      {isAnom && step.aLabel && (
        <div style={{ fontSize:9, color:C.red, fontWeight:700, marginTop:4, letterSpacing:".05em" }}>
          ↑ {step.aLabel}
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function IsolationDemo() {
  const [scIdx, setScIdx]   = useState(0);
  const [lid, setLid]       = useState("RC");
  const [step, setStep]     = useState(-1);
  const [playing, setPlay]  = useState(false);
  const timer = useRef(null);

  const sc      = SCENARIOS[scIdx];
  const total   = sc.steps.length;
  const outcome = sc.outcomes[lid];

  useEffect(() => { setStep(-1); setPlay(false); }, [scIdx, lid]);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setStep(s => {
          if (s >= total - 1) { setPlay(false); return s; }
          return s + 1;
        });
      }, 1300);
    } else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [playing, total]);

  const atEnd   = step >= total - 1;
  const atStart = step < 0;

  // which recommended level is this scenario's rec
  const recColor = C[sc.rec];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.bg, color:C.txt,
      minHeight:"100vh", padding:"24px 20px 48px" }}>
      <style>{FONT}</style>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        button { font-family:inherit; cursor:pointer; }
        button:disabled { opacity:.35; cursor:default; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:${C.bd}; border-radius:2px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .outcome-card { animation: fadeIn .3s ease; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:26 }}>
        <h1 style={{ fontSize:21, fontWeight:600, letterSpacing:"-.5px", marginBottom:4 }}>
          事务隔离级别 · 场景演示
        </h1>
        <p style={{ fontSize:13, color:C.mut }}>选择场景和隔离级别，逐步观察并发事务的行为与异常</p>
      </div>

      {/* Scenario Selector */}
      <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
        {SCENARIOS.map((s, i) => {
          const active = i === scIdx;
          return (
            <button key={s.id} onClick={() => setScIdx(i)} style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"7px 14px", borderRadius:10,
              border:`1px solid ${active ? C.T2 : C.bd}`,
              background: active ? "rgba(88,166,255,.1)" : C.surf,
              color: active ? C.T2 : C.mut,
              fontSize:13, fontWeight: active ? 500 : 400,
              transition:"all .15s",
            }}>
              <span style={{ fontSize:15 }}>{s.emoji}</span>
              <span>{s.title}</span>
              <span style={{
                fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:500,
                background: active ? "rgba(88,166,255,.15)" : "rgba(139,148,158,.1)",
                color: active ? C.T2 : C.mut,
              }}>{s.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ display:"grid", gridTemplateColumns:"252px 1fr", gap:18, alignItems:"start" }}>

        {/* ── Left panel ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>

          {/* Description */}
          <div style={{ background:C.surf, border:`1px solid ${C.bd2}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:22, marginBottom:9 }}>{sc.emoji}</div>
            <h2 style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{sc.title}</h2>
            <p style={{ fontSize:12, color:C.mut, lineHeight:1.75 }}>{sc.desc}</p>
          </div>

          {/* Initial DB state */}
          <div style={{ background:C.surf, border:`1px solid ${C.bd2}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:10, color:C.mut, letterSpacing:".08em", textTransform:"uppercase",
              marginBottom:10, fontWeight:500 }}>初始数据</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace" }}>
              <div style={{ fontSize:10, color:C.mut, marginBottom:6 }}>TABLE {sc.table.name}</div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr>{sc.table.cols.map(c =>
                    <th key={c} style={{ padding:"3px 6px", textAlign:"left",
                      color:C.amb, borderBottom:`1px solid ${C.bd}`, fontWeight:500 }}>{c}</th>
                  )}</tr>
                </thead>
                <tbody>{sc.table.rows.map((row, i) =>
                  <tr key={i}>{row.map((cell, j) =>
                    <td key={j} style={{ padding:"3px 6px", color:C.txt,
                      borderBottom: i < sc.table.rows.length-1 ? `1px solid ${C.bd2}` : "none" }}>{cell}</td>
                  )}</tr>
                )}</tbody>
              </table>
            </div>
          </div>

          {/* Recommendation */}
          <div style={{
            background:"rgba(63,185,80,.06)", border:"1px solid rgba(63,185,80,.28)",
            borderRadius:12, padding:16,
          }}>
            <div style={{ fontSize:10, color:C.grn, letterSpacing:".08em", textTransform:"uppercase",
              marginBottom:9, fontWeight:600 }}>推荐隔离级别</div>
            <div style={{
              display:"inline-block", background:recColor, color:"#000",
              fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6,
              fontFamily:"'JetBrains Mono',monospace", marginBottom:10,
              letterSpacing:".02em",
            }}>{LVL_FULL[sc.rec]}</div>
            <p style={{ fontSize:12, color:C.mut, lineHeight:1.75 }}>{sc.recNote}</p>
          </div>

          {/* Level comparison mini */}
          <div style={{ background:C.surf, border:`1px solid ${C.bd2}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:10, color:C.mut, letterSpacing:".08em", textTransform:"uppercase",
              marginBottom:10, fontWeight:500 }}>各级别在此场景</div>
            {LVL.map(l => {
              const out = sc.outcomes[l];
              return (
                <div key={l} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:9 }}>
                  <span style={{
                    fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4,
                    background:LVL_BG[l], color:C[l], minWidth:30, textAlign:"center",
                    fontFamily:"'JetBrains Mono',monospace", flexShrink:0, marginTop:1,
                  }}>{l}</span>
                  <span style={{ fontSize:11, color: out.ok ? C.mut : C.red, lineHeight:1.5 }}>
                    {out.ok ? "✓ 安全" : `❌ ${out.type}`}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── Right panel ── */}
        <div style={{ background:C.surf, border:`1px solid ${C.bd2}`, borderRadius:12, overflow:"hidden" }}>

          {/* Level tabs */}
          <div style={{ display:"flex", gap:6, padding:"14px 18px", borderBottom:`1px solid ${C.bd2}`,
            flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:11, color:C.mut, marginRight:4 }}>模拟隔离级别：</span>
            {LVL.map(l => {
              const active = l === lid;
              return (
                <button key={l} onClick={() => setLid(l)} style={{
                  padding:"4px 12px", borderRadius:6,
                  border:`1px solid ${active ? C[l] : C.bd}`,
                  background: active ? LVL_BG[l] : "transparent",
                  color: active ? C[l] : C.mut,
                  fontSize:11, fontWeight:500,
                  fontFamily:"'JetBrains Mono',monospace",
                  transition:"all .15s",
                }}>{LVL_NAME[l]}</button>
              );
            })}
          </div>

          {/* Timeline */}
          <div style={{ padding:"18px 18px 6px" }}>

            {/* Column headers */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 46px 1fr", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ width:9, height:9, borderRadius:"50%", background:C.T1,
                  display:"inline-block", flexShrink:0 }}/>
                <span style={{ fontSize:13, fontWeight:500, color:C.T1 }}>事务 T1</span>
              </div>
              <div style={{ textAlign:"center" }}>
                <span style={{ fontSize:9, color:C.mut }}>时序</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7, justifyContent:"flex-end" }}>
                <span style={{ fontSize:13, fontWeight:500, color:C.T2 }}>事务 T2</span>
                <span style={{ width:9, height:9, borderRadius:"50%", background:C.T2,
                  display:"inline-block", flexShrink:0 }}/>
              </div>
            </div>

            {/* Steps */}
            <div style={{ position:"relative" }}>
              {/* Center axis */}
              <div style={{ position:"absolute", left:"calc(50% - .5px)", top:0, bottom:0,
                width:1, background:C.bd2, pointerEvents:"none" }}/>

              {sc.steps.map((s, i) => {
                const visible = i <= step;
                const cur     = i === step;
                return (
                  <div key={i} style={{
                    display:"grid", gridTemplateColumns:"1fr 46px 1fr",
                    marginBottom:6,
                    opacity: visible ? 1 : 0.16,
                    transition:"opacity .4s ease",
                  }}>
                    {/* T1 side */}
                    <div style={{ paddingRight:10, display:"flex", justifyContent:"flex-end" }}>
                      {s.tx === "T1" && <StepCard step={s} lid={lid} cur={cur} visible={visible} />}
                    </div>
                    {/* Time dot */}
                    <div style={{ display:"flex", justifyContent:"center", paddingTop:8 }}>
                      <div style={{
                        width:22, height:22, borderRadius:"50%", flexShrink:0, zIndex:1,
                        background: cur ? C.T2 : C.surf2,
                        border:`1px solid ${cur ? C.T2 : C.bd}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:9, fontWeight:700, color: cur ? "#000" : C.mut,
                        transition:"all .25s",
                      }}>{s.t}</div>
                    </div>
                    {/* T2 side */}
                    <div style={{ paddingLeft:10, display:"flex", justifyContent:"flex-start" }}>
                      {s.tx === "T2" && <StepCard step={s} lid={lid} cur={cur} visible={visible} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.bd2}`,
            display:"flex", alignItems:"center", gap:8 }}>
            {[
              { label:"↺ 重置",   fn:() => { setStep(-1); setPlay(false); }, dis:atStart && !playing },
              { label:"← 后退",   fn:() => setStep(s => Math.max(s-1,-1)), dis:atStart },
              { label: playing ? "⏸ 暂停" : "▶ 播放",
                fn:() => setPlay(p => !p),
                accent: true, playing,
                dis: atEnd && !playing },
              { label:"前进 →",   fn:() => setStep(s => Math.min(s+1, total-1)), dis:atEnd },
            ].map((b, idx) => (
              <button key={idx} onClick={b.dis ? undefined : b.fn} disabled={b.dis} style={{
                padding:"5px 11px", borderRadius:6, fontSize:12,
                border:`1px solid ${
                  b.accent && !b.playing ? "rgba(63,185,80,.5)" :
                  b.accent && b.playing  ? "rgba(248,81,73,.5)" : C.bd}`,
                background:
                  b.accent && !b.playing ? "rgba(63,185,80,.1)" :
                  b.accent && b.playing  ? "rgba(248,81,73,.1)" : "transparent",
                color:
                  b.accent && !b.playing ? C.grn :
                  b.accent && b.playing  ? C.red : C.mut,
                transition:"all .15s",
              }}>{b.label}</button>
            ))}
            <span style={{ marginLeft:"auto", fontSize:11, color:C.mut }}>
              {atStart ? "就绪" : `步骤 ${step+1} / ${total}`}
            </span>
          </div>

          {/* Outcome card */}
          {atEnd && (
            <div className="outcome-card" style={{
              margin:"0 18px 20px",
              background: outcome.ok ? "rgba(35,134,54,.1)" : "rgba(248,81,73,.08)",
              border:`1px solid ${outcome.ok ? "rgba(35,134,54,.35)" : "rgba(248,81,73,.35)"}`,
              borderRadius:10, padding:14,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                <span style={{ fontSize:18 }}>{outcome.ok ? "✅" : "❌"}</span>
                <span style={{ fontWeight:600, fontSize:14,
                  color: outcome.ok ? C.grn : C.red }}>
                  {outcome.ok ? "安全 — 无并发异常" : `异常：${outcome.type}`}
                </span>
              </div>
              <p style={{ fontSize:12, color:C.mut, lineHeight:1.75 }}>{outcome.desc}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}