import { useState, useEffect } from "react";

// ─── palette shortcuts ───────────────────────────────────────────
const C = {
  blue:"#185FA5", dkBlue:"#0C447C", green:"#0F6E56", dkGreen:"#085041",
  purple:"#3C3489", ltPurple:"#534AB7", amber:"#854F0B", red:"#A32D2D",
  teal:"#1D9E75", coral:"#993C1D", pink:"#8B3A6E", orange:"#9A4F10",
};

// ─── Scenario handshake data ─────────────────────────────────────
const SCENARIOS = {
  browser:{
    label:"浏览器 HTTPS", icon:"🌐",
    clientLabel:"浏览器", serverLabel:"Web 服务器",
    clientColor:C.blue, serverColor:C.green,
    desc:"最常见的TLS场景。浏览器内置了操作系统/自身的受信任根CA证书存储，可以自动验证服务器证书链，无需手动配置。",
    steps:[
      { from:"C", msg:"Client Hello", color:C.blue,
        detail:"客户端发送以下信息：\n\n① TLS 版本：如 TLS 1.2 / TLS 1.3\n② Client Random：32字节随机数（防重放攻击）\n③ Cipher Suites：支持的密码套件列表\n   如 TLS_AES_256_GCM_SHA384（TLS1.3）\n④ 扩展字段（Extensions）：\n   • SNI（Server Name Indication）：指定目标域名\n   • ALPN：协议协商（HTTP/2、HTTP/1.1）\n   • SessionTicket：会话复用支持" },
      { from:"S", msg:"Server Hello", color:C.green,
        detail:"服务器从客户端列表中选择并返回：\n\n① 选定的 TLS 版本\n② 选定的 Cipher Suite\n③ Server Random：服务器端随机数\n④ Session ID（TLS 1.2）或 KeyShare（TLS 1.3）\n\nTLS 1.3 改进：Server Hello 之后消息立即加密，安全性更高。" },
      { from:"S", msg:"Certificate", color:C.green,
        detail:"服务器发送 X.509 证书（PEM/DER格式），包含：\n\n• Subject：证书主体（域名/组织）\n• SubjectAltName（SAN）：覆盖的域名列表\n• Public Key：服务器公钥（RSA/ECDSA）\n• Issuer：颁发机构（CA）\n• Validity：有效期（NotBefore ~ NotAfter）\n• Signature：CA 的数字签名\n\n可能同时发送证书链（Intermediate CA 证书）。" },
      { from:"S", msg:"Server Hello Done", color:C.green,
        detail:"（仅 TLS 1.2）服务器通知客户端：Hello 握手阶段完成，等待客户端响应。\n\nTLS 1.3 不需要此消息，握手更精简（1-RTT）。" },
      { local:"C", msg:"验证服务器证书", color:C.amber,
        detail:"浏览器/操作系统执行完整证书链验证：\n\n① 证书链构建：Leaf Cert → Intermediate CA → Root CA\n② 签名验证：用 CA 公钥验证每层证书的签名\n③ 有效期：当前时间必须在 NotBefore ~ NotAfter 内\n④ 域名匹配：检查 SAN 字段（或 CN）是否匹配当前域名\n⑤ 吊销检查：\n   • OCSP Stapling（在线证书状态协议）\n   • CRL（证书吊销列表）\n⑥ CT 日志：证书透明度验证（现代浏览器）\n\n任何一步失败 → 显示「您的连接不是私密连接」警告。" },
      { from:"C", msg:"Client Key Exchange", color:C.blue,
        detail:"TLS 1.2（RSA 密钥交换）：\n  客户端生成 Pre-master Secret（48字节），用服务器公钥加密发送。\n\nTLS 1.2/1.3（ECDHE 密钥交换，推荐）：\n  基于椭圆曲线 Diffie-Hellman，提供前向保密（PFS）。\n\n双方各自计算：\n  Master Secret = PRF(pre_master, \"master secret\",\n                      ClientRandom + ServerRandom)\n\n从 Master Secret 派生：Session Key、IV 等。" },
      { from:"C", msg:"Change Cipher Spec + Finished", color:C.blue,
        detail:"Change Cipher Spec：通知服务器，之后的消息都将使用协商好的加密密钥和算法传输。\n\nFinished（加密）：对所有握手消息做哈希，用会话密钥加密发送，验证握手完整性。" },
      { from:"S", msg:"Change Cipher Spec + Finished", color:C.green,
        detail:"服务器同样切换到加密模式，并发送加密的 Finished 消息。\n\n两端 Finished 消息均验证成功后，握手正式完成。" },
      { done:true, msg:"🔒 加密通信建立", color:C.dkGreen,
        detail:"握手完成！建立了端到端加密通道：\n\n加密方式：对称加密（AES-256-GCM / ChaCha20-Poly1305）\n完整性保护：AEAD 认证加密，每条消息均有 MAC\n抗重放：TLS Record 序列号 + 随机 IV\n前向保密：ECDHE 密钥交换（即使私钥泄露，历史记录安全）\n\n之后所有 HTTPS 数据均在此加密隧道中传输，ISP/中间人无法读取或篡改。" },
    ],
  },
  browser_mtls:{
    label:"浏览器 mTLS", icon:"🛡️",
    clientLabel:"浏览器（含客户端证书）", serverLabel:"需要身份认证的服务器",
    clientColor:C.pink, serverColor:C.dkBlue,
    desc:"浏览器双向TLS认证：服务器不仅验证证书，还要求浏览器出示客户端证书来证明用户/设备身份。常见于企业内网、政务系统、网银 U盾、VPN门户等高安全场景。",
    steps:[
      { from:"C", msg:"Client Hello", color:C.pink,
        detail:"浏览器发起握手，与普通 HTTPS 相同。\n\n浏览器侧准备：\n• 客户端证书存储在操作系统证书库中\n  - Windows：证书管理器（certmgr.msc）\n  - macOS：Keychain Access（钥匙串访问）\n  - Linux：NSS 数据库 / p11-kit\n• 或存储在硬件设备中：\n  - USB Token / 智能卡（U盾）\n  - YubiKey / 企业 HSM\n  - 通过 PKCS#11 接口与浏览器通信" },
      { from:"S", msg:"Server Hello + Certificate", color:C.dkBlue,
        detail:"服务器正常发送握手响应和自身证书，供浏览器验证服务器身份。\n\n浏览器验证过程与普通 HTTPS 完全相同：\n• 证书链到达受信任的根 CA\n• 域名与 SAN/CN 匹配\n• 有效期检查\n• OCSP/CRL 吊销检查" },
      { from:"S", msg:"Certificate Request ⭐", color:C.dkBlue,
        detail:"🔑 浏览器 mTLS 核心消息！\n\n服务器在 TLS 握手中主动要求浏览器提供客户端证书：\n\n消息内容：\n① 接受的 CA 列表（AcceptableCAs）\n   → 服务器只接受特定 CA 签发的客户端证书\n② 支持的证书类型（rsa_sign / ecdsa_sign）\n③ 支持的签名算法\n\n浏览器行为：\n→ 在本地证书库中寻找符合 CA 列表的证书\n→ 如有多个匹配证书，弹出选择对话框\n→ 如有硬件 token（U盾），触发 PIN 码输入" },
      { local:"C", msg:"🖱️ 浏览器弹出证书选择对话框", color:C.amber,
        detail:"这是浏览器 mTLS 独有的用户交互环节：\n\n① 浏览器匹配可用证书\n   → 过滤出由服务器接受的 CA 颁发的证书\n   → 过滤未过期的证书\n\n② 弹出选择框（如有多张）\n   → 用户选择要使用的证书\n   → 常见于企业内网，每台设备有唯一证书\n\n③ 如使用硬件 Token / U盾：\n   → 弹出 PIN 码输入界面\n   → 私钥存储在硬件中，从不导出\n   → 签名操作在硬件内部完成（PKCS#11 接口）\n\n④ 用户选择/确认后，浏览器继续握手\n   → 拒绝选择 → 握手失败，服务器拒绝连接" },
      { from:"C", msg:"Client Certificate ⭐", color:C.pink,
        detail:"🔑 浏览器向服务器发送客户端证书！\n\n证书中的身份标识字段（服务器用于授权）：\n• CN（Common Name）：\n   - 个人证书：如 \"Zhang San\" 或员工工号\n   - 设备证书：如 \"laptop-001.corp.example.com\"\n   - 服务账号：如 \"payment-service\"\n• O（Organization）：部门/组织\n• OU（Org Unit）：岗位/角色\n• SAN Email：如 zhangsan@example.com\n\n企业常见应用：\n• 员工入职时，IT 部门签发个人设备证书\n• 政务系统：CA 机构颁发的个人数字证书（如 EID）\n• 网银 U盾：银行为客户颁发的证书存入 USB 硬件" },
      { from:"C", msg:"Client Key Exchange + Certificate Verify ⭐", color:C.pink,
        detail:"① Client Key Exchange：协商会话密钥（同普通 TLS）\n\n② Certificate Verify（关键！）：\n   浏览器用客户端私钥对握手记录签名，发送给服务器。\n\n私钥的来源（决定安全级别）：\n• 软件证书：私钥存储在 OS 证书库（文件加密保护）\n• 硬件 Token / U盾：\n   - 私钥存储在安全芯片中，永远不离开硬件\n   - 签名操作在芯片内部完成\n   - 即使电脑被黑，攻击者也无法导出私钥\n   - 安全级别远高于软件证书\n\n此步骤证明客户端确实持有私钥，而非仅仅拥有证书副本。" },
      { local:"S", msg:"服务器验证客户端证书 + 授权 ⭐", color:C.dkBlue,
        detail:"服务器执行以下验证和授权决策：\n\n① 证书链验证：由受信任的 CA 签发\n② Certificate Verify 签名校验：确认私钥所有权\n③ 有效期检查\n④ 吊销状态（CRL / OCSP）\n⑤ 授权决策（基于证书字段）：\n   • 检查 CN/OU/O 字段 → 映射到用户角色\n   • SAN Email → 查询用户数据库\n   • 自定义 VerifyPeerCertificate 回调\n\n典型授权模式：\n• 企业 VPN：CN = 员工编号 → 查 LDAP/AD 判断权限\n• 政务系统：证书 SN → 查身份认证库\n• 网银：客户证书序列号 → 绑定银行账户\n\n验证失败 → TLS Alert: bad_certificate → 拒绝连接" },
      { from:"C", msg:"Change Cipher Spec + Finished", color:C.pink,
        detail:"双方切换到加密模式，完成握手。\n\n此时双方已完成双向身份验证：\n• 浏览器已验证服务器身份（防钓鱼/中间人）\n• 服务器已验证用户/设备身份（防未授权访问）" },
      { from:"S", msg:"Change Cipher Spec + Finished", color:C.dkBlue,
        detail:"服务器确认握手完成，切换加密通信。" },
      { done:true, msg:"🔒 双向认证浏览器会话建立", color:C.dkGreen,
        detail:"浏览器 mTLS 建立成功！\n\n安全保障：\n• 服务器身份已验证（防中间人 / 防钓鱼）\n• 用户/设备身份已验证（防未授权访问，无需密码！）\n• 端到端加密通信\n• 强认证：无法被密码泄露、钓鱼攻击击穿\n\n对比密码登录的优势：\n• 私钥从不通过网络传输（与密码根本不同）\n• 硬件 Token 可防止私钥被恶意软件窃取\n• 可与 HTTP Session 结合：握手建立后服务器创建 Session Cookie\n\n典型应用：\n• 企业 VPN 门户（Cisco AnyConnect / OpenVPN + 证书）\n• 政府/金融内部系统\n• 中国网银 U盾（USB Key 认证）\n• 企业零信任（BeyondCorp / ZTA）\n• 企业 Wi-Fi 认证（802.1X / EAP-TLS）" },
    ],
  },
  server:{
    label:"服务器间 TLS", icon:"🖥️",
    clientLabel:"客户端服务", serverLabel:"目标服务（DB/API）",
    clientColor:C.blue, serverColor:C.teal,
    desc:"服务与服务之间的TLS通信：应用连接数据库、Redis，微服务间调用，Docker Engine，gRPC等。与浏览器的核心区别是：程序没有内置的公共CA证书库，需要显式配置信任。",
    steps:[
      { from:"C", msg:"Client Hello", color:C.blue,
        detail:"发起方是程序进程，而非浏览器。常见场景：\n\n• Go: tls.Dial() / http.Client with TLS\n• Python: requests(verify=\"ca.crt\")\n• PostgreSQL client: sslmode=verify-full\n• Redis client: TLS 配置\n• gRPC: credentials.NewTLS()\n• Docker client: --tlsverify\n• MySQL: ssl-ca=ca.pem\n\n握手消息格式与浏览器完全相同。" },
      { from:"S", msg:"Certificate", color:C.teal,
        detail:"目标服务器的证书，类型可能是：\n\n① 公共 CA 签发（适合对外 API）\n   → 程序使用系统根证书库自动验证\n\n② 企业私有 CA 签发（推荐内网场景）\n   → 需配置信任该私有 CA 的根证书\n\n③ 自签名证书（开发/测试环境）\n   → 需将该证书加入信任列表\n\n数据库（PostgreSQL、MySQL）、消息队列、\netcd、Docker Engine 常使用自签名或私有CA证书。" },
      { local:"C", msg:"⚠️ 证书验证（关键差异）", color:C.amber,
        detail:"与浏览器最大不同：程序没有内置的公共 CA 根证书库。\n\n需要显式配置（以 Go 为例）：\n\n// 信任私有 CA\npool := x509.NewCertPool()\npool.AppendCertsFromPEM(caCertPEM)\ntlsCfg := &tls.Config{RootCAs: pool}\n\n// 信任自签名证书（将证书本身作为CA）\npool.AppendCertsFromPEM(serverCertPEM)\n\n⛔ 禁止生产环境使用：\nInsecureSkipVerify: true  // 完全跳过验证！\n\nDocker TLS 配置路径：\n/etc/docker/certs.d/<host>/ca.crt" },
      { from:"C", msg:"Key Exchange + 密钥协商", color:C.blue,
        detail:"密钥交换过程与浏览器TLS完全相同，协商出对称加密密钥。" },
      { done:true, msg:"🔒 服务间加密通信", color:C.dkGreen,
        detail:"建立加密通道后的服务间数据传输示例：\n\n• PostgreSQL：SQL 查询/结果在 TLS 隧道传输\n  连接串：postgres://host/db?sslmode=verify-full&sslrootcert=ca.crt\n\n• Redis：RESP 协议数据加密传输\n  配置：tls.enable=true, tls.ca=/path/ca.crt\n\n• gRPC：Protobuf 数据加密传输\n  credentials.NewTLS(&tls.Config{RootCAs: pool})\n\n• Kubernetes：组件间使用 TLS 通信\n  kubeconfig 中配置 certificate-authority-data\n\n• Istio Sidecar：自动注入 TLS，业务无感知" },
    ],
  },
  mtls:{
    label:"服务间 mTLS", icon:"🔐",
    clientLabel:"客户端（含证书）", serverLabel:"服务器（含证书）",
    clientColor:C.purple, serverColor:C.ltPurple,
    desc:"双向TLS认证（Mutual TLS）：不仅服务器需要向客户端证明身份，客户端也必须向服务器出示证书。双方都验证对方的证书，实现双向身份认证。",
    steps:[
      { from:"C", msg:"Client Hello", color:C.purple,
        detail:"握手开始，与普通 TLS 相同。\n\n客户端需要预先准备：\n• 自己的证书（client.crt）— 用于向服务器证明身份\n• 自己的私钥（client.key）— 用于 Certificate Verify\n• 服务端 CA 证书（ca.crt）— 用于验证服务器证书" },
      { from:"S", msg:"Server Hello + Certificate", color:C.ltPurple,
        detail:"服务器发送自己的证书（服务端身份证明），同单向 TLS。\n\nmTLS 场景中，服务端和客户端的证书通常由同一个私有 CA 颁发，形成统一的信任体系（PKI）。\n\n例如 Kubernetes 集群中，所有组件（API Server、kubelet、etcd）的证书均由 Kubernetes CA 签发。" },
      { from:"S", msg:"Certificate Request ⭐", color:C.ltPurple,
        detail:"🔑 mTLS 核心握手消息！\n\n服务器通过 CertificateRequest 消息告知客户端：\n① 我需要你的证书来验证你的身份\n② 我接受以下 CA 颁发的客户端证书（ClientCAs 列表）\n③ 支持的证书类型（RSA / ECDSA）\n\nGo 服务器配置：\nClientAuth: tls.RequireAndVerifyClientCert\nClientCAs: clientCAPool\n\n如果客户端没有合适的证书 → TLS 握手失败，连接被拒绝。" },
      { from:"S", msg:"Server Hello Done", color:C.ltPurple,
        detail:"（TLS 1.2）服务器 Hello 阶段结束，等待客户端发送证书。" },
      { local:"C", msg:"验证服务器证书", color:C.amber,
        detail:"客户端验证服务器证书，流程同单向 TLS：\n① 证书链验证\n② 签名有效性\n③ 有效期\n④ 服务器标识（SNI匹配）" },
      { from:"C", msg:"Client Certificate ⭐", color:C.purple,
        detail:"🔑 客户端向服务器发送自己的证书！\n\n证书内容（Subject 字段可用于标识客户端身份）：\n• CN (Common Name)：如 \"my-service\" 或 \"system:node:worker-1\"\n• O (Organization)：如 \"system:nodes\"（Kubernetes RBAC 使用）\n• OU (Org Unit)：如 \"payment-service\"\n\nKubernetes 中客户端证书 CN/O 字段直接映射到 RBAC 权限，\n是 Kubernetes 认证授权的核心机制之一。" },
      { from:"C", msg:"Client Key Exchange", color:C.purple,
        detail:"标准密钥交换过程，协商会话密钥。" },
      { from:"C", msg:"Certificate Verify ⭐", color:C.purple,
        detail:"🔑 关键步骤：证明客户端真正持有私钥！\n\n客户端用自己的私钥对之前所有握手消息的摘要进行数字签名，\n并将签名发送给服务器。\n\n这防止了证书伪造攻击：\n攻击者即使有客户端证书（公钥），没有对应私钥，\n也无法生成有效的 CertificateVerify 签名。\n\n签名算法与证书公钥类型匹配（RSA-PKCS1v15 / ECDSA）。" },
      { local:"S", msg:"验证客户端证书 ⭐", color:C.ltPurple,
        detail:"服务器验证客户端证书（授权决策）：\n\n① 证书链：是否由受信的 ClientCA 签发\n② 有效期检查\n③ Certificate Verify 签名验证（证明私钥所有权）\n④ 自定义授权逻辑（可选）：\n   • 检查 CN/OU/SAN 是否在白名单\n   • 自定义 VerifyPeerCertificate 回调\n   • 对比 CRL 或 OCSP\n\n验证失败 → TLS Alert: bad_certificate\n连接被立即关闭，不返回任何业务数据。" },
      { done:true, msg:"🔒 双向认证通道建立", color:C.dkGreen,
        detail:"双方身份均已通过证书加密验证！\n\n安全保障：\n• 服务器身份已验证（防中间人）\n• 客户端身份已验证（只有持有有效客户端证书的服务才能连接）\n• 端到端加密（防窃听和篡改）\n\n典型应用场景：\n• 零信任网络（Zero Trust Architecture）\n• 服务网格（Istio/Linkerd 自动 mTLS）\n• Kubernetes 组件间通信\n• 金融/支付 API（高安全要求）\n• IoT 设备到云端双向认证\n• gRPC 服务间调用\n• HashiCorp Vault Agent Auth\n• etcd 集群节点间通信" },
    ],
  },
};

// ─── Plaintext vs Encrypted phase data ──────────────────────────
const PLAIN_PHASES = {
  tls12: [
    { layer:"TCP", phase:"建立连接", items:[
      { label:"TCP SYN / SYN-ACK / ACK", vis:"plain", note:"完全明文：源IP、目的IP、端口号" },
    ]},
    { layer:"TLS握手", phase:"握手阶段（明文）", items:[
      { label:"Client Hello", vis:"plain", note:"明文：TLS版本、支持的密码套件、SNI域名⚠️、Client Random" },
      { label:"Server Hello", vis:"plain", note:"明文：选定版本、选定密码套件、Server Random、Session ID" },
      { label:"Certificate（服务器证书）", vis:"plain", note:"明文：服务器域名/组织信息、公钥、CA签名 — 中间人可看到完整证书！" },
      { label:"Certificate Request（mTLS）", vis:"plain", note:"明文：服务器接受的CA列表" },
      { label:"Server Hello Done", vis:"plain", note:"明文：1字节通知消息" },
      { label:"Client Certificate（mTLS，TLS1.2）", vis:"plain", note:"⚠️ TLS 1.2 中客户端证书明文传输！包含客户端身份信息" },
      { label:"Client Key Exchange", vis:"plain", note:"明文：加密后的Pre-master Secret（RSA）或ECDH公钥参数" },
      { label:"Change Cipher Spec", vis:"plain", note:"明文：1字节通知消息（0x01）" },
    ]},
    { layer:"TLS握手", phase:"握手末尾（加密）", items:[
      { label:"Finished（客户端）", vis:"enc", note:"加密：握手摘要，用协商的会话密钥加密" },
      { label:"Finished（服务器）", vis:"enc", note:"加密：握手摘要，用协商的会话密钥加密" },
    ]},
    { layer:"应用数据", phase:"加密通信阶段", items:[
      { label:"HTTP 请求头（含 Cookie/Authorization）", vis:"enc", note:"加密：所有HTTP头部均不可见" },
      { label:"HTTP 请求体（POST数据/JSON）", vis:"enc", note:"加密：表单数据、密码、业务数据均不可见" },
      { label:"HTTP 响应体（HTML/JSON/文件）", vis:"enc", note:"加密：响应内容不可见" },
      { label:"URL路径 / Query参数", vis:"enc", note:"加密：/login?user=abc 等路径不可见（仅域名可见）" },
    ]},
    { layer:"永远可见", phase:"TLS 无法隐藏的信息", items:[
      { label:"IP 地址（源和目的）", vis:"always", note:"IP层信息，TLS无法加密" },
      { label:"TCP 端口号（如443）", vis:"always", note:"传输层信息，TLS无法加密" },
      { label:"SNI 域名（Server Name）", vis:"always", note:"⚠️ Client Hello 中明文发送，用于服务器选择证书；可暴露你访问的网站（ECH可解决）" },
      { label:"数据包大小和时序", vis:"always", note:"流量分析：即使加密，包大小和时序可推测行为" },
      { label:"TLS 握手版本和密码套件", vis:"always", note:"Client Hello 中明文，可用于指纹识别客户端" },
    ]},
  ],
  tls13: [
    { layer:"TCP", phase:"建立连接", items:[
      { label:"TCP SYN / SYN-ACK / ACK", vis:"plain", note:"完全明文，同 TLS 1.2" },
    ]},
    { layer:"TLS握手", phase:"握手阶段（部分加密，TLS 1.3改进）", items:[
      { label:"Client Hello", vis:"plain", note:"明文：TLS版本、密码套件、SNI⚠️、KeyShare（DH公钥）" },
      { label:"Server Hello", vis:"plain", note:"明文：选定版本、密码套件、ServerKeyShare" },
      { label:"Certificate（服务器证书）", vis:"enc13", note:"🔒 TLS 1.3 改进！Certificate 已加密，中间人看不到证书内容" },
      { label:"CertificateVerify", vis:"enc13", note:"🔒 加密传输" },
      { label:"Certificate Request（mTLS）", vis:"enc13", note:"🔒 TLS 1.3 中 CertificateRequest 也已加密" },
      { label:"Client Certificate（mTLS）", vis:"enc13", note:"🔒 TLS 1.3 改进！客户端证书也加密，身份信息不泄露" },
      { label:"Finished", vis:"enc13", note:"🔒 加密" },
    ]},
    { layer:"应用数据", phase:"加密通信阶段", items:[
      { label:"所有 HTTP/HTTPS 应用数据", vis:"enc", note:"加密，同 TLS 1.2" },
    ]},
    { layer:"永远可见", phase:"TLS 1.3 仍无法隐藏", items:[
      { label:"IP 地址和端口", vis:"always", note:"TLS 1.3 同样无法加密" },
      { label:"SNI 域名", vis:"always", note:"⚠️ 仍然明文！ECH（Encrypted Client Hello）是草案中的解决方案，尚未普及" },
      { label:"数据量和时序", vis:"always", note:"TLS 1.3 新增 padding 机制可混淆数据长度，但不完全" },
    ]},
  ],
};

// ─── Certificate types ───────────────────────────────────────────
const CERTS = [
  { name:"自签名", en:"Self-Signed", icon:"🔐", color:C.red,
    trust:"无公共信任，需手动配置", validity:"任意天数",
    pros:["立即生成，无需CA","完全免费","适合内网服务和mTLS","无需域名验证"],
    cons:["浏览器显示「不安全」警告","需手动分发到所有客户端","没有CRL/OCSP吊销机制","误配置易产生安全风险"],
    use:"开发/测试环境、数据库TLS、Docker Engine、服务间mTLS客户端证书",
    chain:["自签名证书\n（Issuer = Subject，自己签自己）"],
    chainColors:[C.red] },
  { name:"DV 证书", en:"Domain Validation", icon:"🌐", color:C.blue,
    trust:"公共 CA，浏览器自动信任", validity:"90天（Let's Encrypt）",
    pros:["浏览器自动信任","Let's Encrypt 完全免费","ACME 协议自动续期","分钟级颁发"],
    cons:["仅验证域名控制权","不含组织身份","无法用于内网IP/域名"],
    use:"个人网站、博客、开发工具对外接口",
    chain:["ISRG Root X1（Root CA）","Let's Encrypt R3（Intermediate）","域名证书（Leaf）"],
    chainColors:[C.dkGreen, C.green, C.teal] },
  { name:"OV 证书", en:"Organization Validation", icon:"🏢", color:C.green,
    trust:"公共 CA，需验证组织真实性", validity:"1-2年",
    pros:["包含组织身份信息","更高可信度","适合企业对外服务"],
    cons:["需人工审核（1-3天）","有费用","不如 DV 颁发快"],
    use:"企业官网、对外 API、电商平台",
    chain:["Root CA","Intermediate CA","组织证书（含 O 字段）"],
    chainColors:[C.dkGreen, C.green, C.teal] },
  { name:"EV 证书", en:"Extended Validation", icon:"🏦", color:C.purple,
    trust:"严格审核的公共 CA", validity:"1-2年",
    pros:["最严格的身份验证流程","法律实体信息完整","适合高安全合规场景"],
    cons:["严格审核（数天~数周）","费用高","现代浏览器视觉展示已弱化"],
    use:"银行、支付平台、金融机构",
    chain:["EV Root CA","EV Intermediate CA","EV 证书（含完整法律实体）"],
    chainColors:[C.purple, C.ltPurple, "#7F77DD"] },
  { name:"通配符", en:"Wildcard *.domain.com", icon:"✱", color:C.amber,
    trust:"公共 CA", validity:"1年",
    pros:["覆盖所有二级子域（*.example.com）","一张证书管理所有子域","降低运维复杂度"],
    cons:["不覆盖多级子域（a.b.example.com）","私钥泄露影响所有子域","Let's Encrypt 通配符需 DNS 验证"],
    use:"SaaS平台（api/www/mail.x.com）、多子域产品",
    chain:["Root CA","Intermediate CA","通配符证书（*.domain.com）"],
    chainColors:[C.dkGreen, C.green, C.amber] },
  { name:"私有 CA", en:"Private/Internal CA", icon:"🏛️", color:C.ltPurple,
    trust:"私有 CA 根证书（需统一分发）", validity:"自定义",
    pros:["完全自主控制颁发策略","支持内网IP和自定义域名","最适合大规模mTLS","可结合 cert-manager 自动化","适合 Kubernetes/服务网格"],
    cons:["需维护CA基础设施","根证书需分发到所有客户端","Root CA 私钥安全是核心挑战"],
    use:"企业内网全部服务、Kubernetes集群、零信任架构、服务网格、大规模mTLS",
    chain:["Private Root CA（离线保存私钥）","Private Intermediate CA（在线签发）","服务证书（Leaf）"],
    chainColors:[C.purple, C.ltPurple, "#7F77DD"] },
];

// ─── Dev guide code snippets ─────────────────────────────────────
const CODE = {
  selfSigned:`# 生成自签名证书（带 SAN，现代浏览器要求）
openssl req -x509 \\
  -newkey rsa:4096 \\
  -keyout server.key -out server.crt \\
  -days 365 -nodes \\
  -subj "/CN=myservice/O=MyOrg" \\
  -addext "subjectAltName=DNS:myservice,DNS:localhost,IP:127.0.0.1"

# 查看生成的证书
openssl x509 -in server.crt -text -noout`,

  privateCA:`# ── Step 1：创建私有根 CA（Root CA）──────────────────────────
# 生成 Root CA 私钥（4096 位，保存在离线安全环境）
openssl genrsa -out ca.key 4096

# 生成自签名 Root CA 证书（有效期 10 年）
openssl req -new -x509 -key ca.key -out ca.crt -days 3650 \\
  -subj "/CN=My Private Root CA/O=MyOrg/C=CN"

# ── Step 2：生成服务器证书──────────────────────────────────────
openssl genrsa -out server.key 2048

# 生成 CSR（Certificate Signing Request）
openssl req -new -key server.key -out server.csr \\
  -subj "/CN=myservice.internal/O=MyOrg"

# 用 Root CA 签发服务器证书（含 SAN）
openssl x509 -req -in server.csr \\
  -CA ca.crt -CAkey ca.key -CAcreateserial \\
  -out server.crt -days 365 \\
  -extfile <(printf "subjectAltName=DNS:myservice.internal,DNS:myservice,IP:10.0.0.1")

# ── Step 3：生成客户端证书（mTLS）────────────────────────────
openssl genrsa -out client.key 2048
openssl req -new -key client.key -out client.csr \\
  -subj "/CN=payment-service/O=MyOrg/OU=backend"
openssl x509 -req -in client.csr \\
  -CA ca.crt -CAkey ca.key -CAcreateserial \\
  -out client.crt -days 365`,

  letsencrypt:`# ── Let's Encrypt（ACME 协议）─────────────────────────────────
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 方式①：Standalone（暂停 Web 服务使用 80 端口）
certbot certonly --standalone -d example.com -d www.example.com

# 方式②：Webroot（不中断现有 Web 服务）
certbot certonly --webroot -w /var/www/html -d example.com

# 方式③：DNS 验证（通配符证书 必须 使用此方式）
certbot certonly --manual --preferred-challenges=dns \\
  -d "*.example.com" -d "example.com"

# 证书文件位置：/etc/letsencrypt/live/example.com/
#   fullchain.pem  → 完整证书链（Leaf + Intermediate CA）
#   privkey.pem    → 私钥
#   cert.pem       → 仅叶证书

# 自动续期配置（加入 crontab 或 systemd timer）
echo "0 3 * * * certbot renew --quiet --deploy-hook 'nginx -s reload'" | crontab -`,

  goServer:`// ── Go 单向 TLS HTTP 服务器 ──────────────────────────────────
package main

import (
    "crypto/tls"
    "net/http"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api", handler)

    server := &http.Server{
        Addr:    ":8443",
        Handler: mux,
        TLSConfig: &tls.Config{
            MinVersion: tls.VersionTLS12, // 禁用 TLS 1.0/1.1
            // TLS 1.3 自动选择最强套件，1.2 可手动指定
            CipherSuites: []uint16{
                tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
                tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
            },
        },
    }
    // ListenAndServeTLS 自动加载证书和私钥
    server.ListenAndServeTLS("server.crt", "server.key")
}

// ── Go 单向 TLS 客户端（信任私有CA / 自签名）──────────────────
import (
    "crypto/tls"
    "crypto/x509"
    "net/http"
    "os"
)

func newTLSClient(caFile string) *http.Client {
    caCert, _ := os.ReadFile(caFile) // 读取 CA 证书
    pool := x509.NewCertPool()
    pool.AppendCertsFromPEM(caCert)

    return &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                RootCAs:    pool,          // 信任指定 CA
                ServerName: "myservice",   // SNI（当 IP 连接时需指定）
                // ⛔ 禁止生产使用：
                // InsecureSkipVerify: true
            },
        },
    }
}`,

  goMTLS:`// ── Go mTLS 服务器 ────────────────────────────────────────────
package main

import (
    "crypto/tls"
    "crypto/x509"
    "net/http"
    "os"
)

func newMTLSServer() *http.Server {
    // 加载服务器自己的证书
    serverCert, _ := tls.LoadX509KeyPair("server.crt", "server.key")

    // 加载客户端 CA（用于验证客户端证书）
    clientCAData, _ := os.ReadFile("ca.crt")
    clientCAPool := x509.NewCertPool()
    clientCAPool.AppendCertsFromPEM(clientCAData)

    return &http.Server{
        Addr: ":8443",
        TLSConfig: &tls.Config{
            Certificates: []tls.Certificate{serverCert},
            ClientCAs:    clientCAPool,
            // 关键配置：要求并严格验证客户端证书
            ClientAuth:   tls.RequireAndVerifyClientCert,
            MinVersion:   tls.VersionTLS12,
            // 可选：自定义验证逻辑
            VerifyPeerCertificate: func(rawCerts [][]byte, chains [][]*x509.Certificate) error {
                // 检查客户端 CN 是否在白名单中
                cert := chains[0][0]
                allowlist := map[string]bool{"payment-service": true, "order-service": true}
                if !allowlist[cert.Subject.CommonName] {
                    return fmt.Errorf("client CN %q not authorized", cert.Subject.CommonName)
                }
                return nil
            },
        },
    }
}

// ── Go mTLS 客户端 ─────────────────────────────────────────────
func newMTLSClient() *http.Client {
    // 加载客户端自己的证书（向服务器证明身份）
    clientCert, _ := tls.LoadX509KeyPair("client.crt", "client.key")
    // 加载服务端 CA（验证服务器身份）
    serverCAData, _ := os.ReadFile("ca.crt")
    pool := x509.NewCertPool()
    pool.AppendCertsFromPEM(serverCAData)

    return &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                Certificates: []tls.Certificate{clientCert}, // 发送客户端证书
                RootCAs:      pool,                           // 验证服务器
            },
        },
    }
}`,

  pythonTLS:`# ── Python 单向 TLS ────────────────────────────────────────────
import requests

# 连接使用自签名/私有CA证书的服务
resp = requests.get(
    "https://myservice:8443/api",
    verify="ca.crt",  # 指定 CA 证书路径（而非 False！）
)

# ── Python mTLS ────────────────────────────────────────────────
resp = requests.get(
    "https://myservice:8443/api",
    verify="ca.crt",                      # 验证服务器证书
    cert=("client.crt", "client.key"),    # 客户端证书（向服务器证明身份）
)

# ── 精细控制：使用 ssl.SSLContext ──────────────────────────────
import ssl

ctx = ssl.create_default_context(cafile="ca.crt")
ctx.load_cert_chain("client.crt", "client.key")  # 加载客户端证书（mTLS）
ctx.verify_mode = ssl.CERT_REQUIRED
ctx.check_hostname = True

# aiohttp 异步 mTLS
import aiohttp
connector = aiohttp.TCPConnector(ssl=ctx)
async with aiohttp.ClientSession(connector=connector) as session:
    resp = await session.get("https://myservice:8443/api")

# ── Python HTTPS 服务器（带 mTLS）─────────────────────────────
from http.server import HTTPServer, BaseHTTPRequestHandler
import ssl

server = HTTPServer(("", 8443), BaseHTTPRequestHandler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("server.crt", "server.key")
ctx.verify_mode = ssl.CERT_REQUIRED           # 要求客户端证书
ctx.load_verify_locations("ca.crt")           # 信任的客户端 CA
server.socket = ctx.wrap_socket(server.socket, server_side=True)
server.serve_forever()`,

  nodeJS:`// ── Node.js 单向 TLS 服务器 ───────────────────────────────────
const https = require("https");
const fs    = require("fs");

const server = https.createServer({
  key:  fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
  minVersion: "TLSv1.2",
}, (req, res) => res.end("Hello TLS!"));
server.listen(8443);

// ── Node.js mTLS 服务器 ────────────────────────────────────────
const mtlsServer = https.createServer({
  key:             fs.readFileSync("server.key"),
  cert:            fs.readFileSync("server.crt"),
  ca:              fs.readFileSync("ca.crt"),  // 客户端 CA
  requestCert:     true,                       // 要求客户端证书
  rejectUnauthorized: true,                    // 拒绝验证失败的客户端
}, (req, res) => {
  const cert = req.socket.getPeerCertificate();
  if (!cert.subject) return res.writeHead(401).end("No cert");
  console.log("Client CN:", cert.subject.CN);
  res.end(\`Authenticated as: \${cert.subject.CN}\`);
});

// ── Node.js mTLS 客户端 ────────────────────────────────────────
const req = https.request({
  hostname: "myservice",
  port:     8443,
  path:     "/api",
  key:      fs.readFileSync("client.key"),  // 客户端私钥
  cert:     fs.readFileSync("client.crt"),  // 客户端证书
  ca:       fs.readFileSync("ca.crt"),      // 信任的服务端 CA
}, res => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log("Response:", body));
});
req.end();`,

  manage:`# ── 证书检查工具箱 ────────────────────────────────────────────
# 查看证书详情（主体、SAN、有效期、签发者）
openssl x509 -in server.crt -text -noout

# 查看有效期
openssl x509 -in server.crt -noout -dates

# 验证证书和私钥匹配（两个 MD5 必须相同）
openssl x509 -noout -modulus -in server.crt | md5sum
openssl rsa  -noout -modulus -in server.key | md5sum

# 验证证书链完整性
openssl verify -CAfile ca.crt server.crt
# 带中间 CA：
openssl verify -CAfile root-ca.crt -untrusted intermediate.crt server.crt

# ── 在线检测远端服务器证书 ────────────────────────────────────
# 查看服务器证书链
openssl s_client -connect example.com:443 -servername example.com

# 测试 mTLS 连接（带客户端证书）
openssl s_client \\
  -connect myservice:8443 \\
  -cert client.crt -key client.key \\
  -CAfile ca.crt

# 检查证书剩余天数（一行命令）
echo | openssl s_client -servername example.com \\
  -connect example.com:443 2>/dev/null \\
  | openssl x509 -noout -enddate

# ── Kubernetes cert-manager（自动化证书管理）──────────────────
# 安装
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

# 定义 Certificate 资源（自动申请、存储、续期）
# apiVersion: cert-manager.io/v1
# kind: Certificate
# metadata:
#   name: myservice-tls
# spec:
#   secretName: myservice-tls-secret
#   issuerRef:
#     name: letsencrypt-prod
#     kind: ClusterIssuer
#   dnsNames:
#     - myservice.example.com

# ── 证书监控（Prometheus + blackbox_exporter）────────────────
# probe_ssl_earliest_cert_expiry 指标监控到期时间
# 告警示例：证书 < 30 天到期
# alert: CertExpiringSoon
# expr: probe_ssl_earliest_cert_expiry - time() < 86400 * 30`,
};

// ─── Sub-components ───────────────────────────────────────────────

function Tabs({ items, active, onChange, accentColor }) {
  return (
    <div style={{ display:"flex", gap:4, borderBottom:"0.5px solid var(--color-border-tertiary)", marginBottom:20, flexWrap:"wrap" }}>
      {items.map(item => {
        const isActive = item.key === active;
        return (
          <button key={item.key} onClick={() => onChange(item.key)}
            style={{
              fontSize:13, padding:"8px 14px", cursor:"pointer",
              background:"transparent", border:"none",
              borderBottom:`2px solid ${isActive ? (accentColor||"var(--color-text-primary)") : "transparent"}`,
              color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              fontWeight: isActive ? 500 : 400, marginBottom:-0.5, borderRadius:0,
              transition:"all 0.15s",
            }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function PillBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize:12, padding:"5px 14px", borderRadius:20,
      background: active ? color+"22" : "transparent",
      color: active ? color : "var(--color-text-secondary)",
      border:`1px solid ${active ? color+"77" : "var(--color-border-tertiary)"}`,
      cursor:"pointer", fontWeight: active ? 500 : 400, transition:"all 0.15s",
    }}>{label}</button>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position:"relative", margin:"10px 0" }}>
      <div style={{
        background:"var(--color-background-secondary)",
        border:"0.5px solid var(--color-border-tertiary)",
        borderRadius:"var(--border-radius-md)",
        padding:"12px 16px", fontFamily:"var(--font-mono)", fontSize:12,
        lineHeight:1.75, overflowX:"auto", color:"var(--color-text-primary)",
        whiteSpace:"pre",
      }}>{code}</div>
      <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1500); }}
        style={{
          position:"absolute", top:8, right:8,
          fontSize:11, padding:"2px 8px", cursor:"pointer",
          background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-secondary)",
          borderRadius:"var(--border-radius-md)",
          color:"var(--color-text-secondary)",
        }}>
        {copied ? "✓ 已复制" : "复制"}
      </button>
    </div>
  );
}

// Handshake diagram
function HandshakeViz({ scenarioKey }) {
  const scenario = SCENARIOS[scenarioKey];
  const steps = scenario.steps;
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setCur(0); setPlaying(false); }, [scenarioKey]);

  useEffect(() => {
    if (!playing) return;
    if (cur >= steps.length-1) { setPlaying(false); return; }
    const t = setTimeout(() => setCur(c => c+1), 2200);
    return () => clearTimeout(t);
  }, [playing, cur, steps.length]);

  const step = steps[cur];
  const isFirst = cur === 0;
  const isLast = cur === steps.length-1;

  return (
    <div style={{ display:"flex", gap:16 }}>
      {/* Step list sidebar */}
      <div style={{ width:200, flexShrink:0 }}>
        <div style={{ fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>握手步骤</div>
        {steps.map((s, i) => {
          const isCur = i === cur;
          const isDone = i < cur;
          return (
            <div key={i} onClick={() => { setPlaying(false); setCur(i); }}
              style={{
                display:"flex", alignItems:"flex-start", gap:8,
                padding:"5px 8px", borderRadius:"var(--border-radius-md)",
                cursor:"pointer", marginBottom:2,
                background: isCur ? s.color+"18" : "transparent",
                border: isCur ? `1px solid ${s.color}44` : "1px solid transparent",
                transition:"all 0.2s",
              }}>
              <div style={{
                width:18, height:18, borderRadius:"50%", flexShrink:0, marginTop:1,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, fontWeight:500,
                background: isDone ? C.dkGreen+"22" : isCur ? s.color+"22" : "var(--color-background-secondary)",
                color: isDone ? C.dkGreen : isCur ? s.color : "var(--color-text-tertiary)",
                border:`1px solid ${isDone ? C.dkGreen+"66" : isCur ? s.color+"66" : "var(--color-border-tertiary)"}`,
              }}>
                {isDone ? "✓" : s.done ? "🔒" : i+1}
              </div>
              <div style={{ fontSize:11.5, lineHeight:1.4,
                color: isCur ? s.color : isDone ? "var(--color-text-secondary)" : "var(--color-text-tertiary)",
                fontWeight: isCur ? 500 : 400,
              }}>
                {s.msg.replace(" ⭐","")}
                {s.msg.includes("⭐") && <span style={{ color:C.amber, marginLeft:3 }}>★</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main viz area */}
      <div style={{ flex:1, minWidth:0 }}>
        {/* Client/Server header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          {[
            { label:scenario.clientLabel, sub:"CLIENT", color:scenario.clientColor, active:!step.done && (step.from==="C" || step.local==="C") },
            { label:scenario.serverLabel, sub:"SERVER", color:scenario.serverColor, active:!step.done && (step.from==="S" || step.local==="S") },
          ].map(box => (
            <div key={box.sub} style={{
              padding:"10px 12px", borderRadius:"var(--border-radius-lg)", textAlign:"center",
              border:`${box.active ? 2 : 0.5}px solid ${box.active ? box.color : "var(--color-border-tertiary)"}`,
              background: box.active ? box.color+"12" : "var(--color-background-secondary)",
              transition:"all 0.3s",
            }}>
              <div style={{ fontSize:20, marginBottom:3 }}>{box.sub==="CLIENT" ? "💻" : "🖥️"}</div>
              <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)" }}>{box.label}</div>
              <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)" }}>{box.sub}</div>
            </div>
          ))}
        </div>

        {/* Arrow / action area */}
        <div style={{
          padding:"16px 20px", borderRadius:"var(--border-radius-lg)",
          border:`1px solid ${step.color}44`, background:step.color+"08",
          marginBottom:10, minHeight:72, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", transition:"all 0.3s",
        }}>
          {step.done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, marginBottom:4 }}>🔒</div>
              <div style={{ fontSize:13, fontWeight:500, color:step.color }}>加密通道建立成功</div>
            </div>
          ) : step.local ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:8 }}>
                {step.local === "C" ? "⬅ 客户端本地操作" : "服务器本地操作 ➡"}
              </div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"7px 18px", borderRadius:20,
                background:step.color+"22", border:`1.5px dashed ${step.color}`,
                color:step.color, fontSize:12.5, fontWeight:500,
              }}>
                ⚙️ {step.msg.replace(" ⭐","").replace("⚠️ ","").replace("🖱️ ","")}
                {step.msg.includes("⭐") && <span style={{ color:C.amber }}>★</span>}
              </div>
            </div>
          ) : (
            <div style={{ width:"100%" }}>
              <div style={{
                display:"flex", alignItems:"center", gap:0,
                flexDirection: step.from==="C" ? "row" : "row-reverse",
              }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:step.color, flexShrink:0 }} />
                <div style={{ flex:1, height:2.5, background:step.color, opacity:0.7, margin:"0 2px" }} />
                <div style={{
                  width:0, height:0, flexShrink:0,
                  borderTop:"7px solid transparent", borderBottom:"7px solid transparent",
                  ...(step.from==="C"
                    ? { borderLeft:`12px solid ${step.color}` }
                    : { borderRight:`12px solid ${step.color}` }),
                }} />
              </div>
              <div style={{ textAlign:"center", marginTop:8, fontSize:13, fontWeight:500, color:step.color }}>
                {step.msg.replace(" ⭐","")}
                {step.msg.includes("⭐") && <span style={{ color:C.amber, marginLeft:4 }}>★ 关键</span>}
              </div>
            </div>
          )}
        </div>

        {/* Detail */}
        <div style={{
          padding:"12px 16px",
          background:"var(--color-background-secondary)",
          border:"0.5px solid var(--color-border-tertiary)",
          borderRadius:"var(--border-radius-md)",
          fontSize:12.5, lineHeight:1.85,
          color:"var(--color-text-primary)", whiteSpace:"pre-line",
          fontFamily:"var(--font-sans)", minHeight:80,
          marginBottom:14,
        }}>
          {step.detail}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => { setPlaying(false); setCur(0); }}
            style={{ fontSize:12, padding:"5px 12px", cursor:"pointer" }}>
            ⟳ 重置
          </button>
          <button onClick={() => { setPlaying(false); setCur(c => Math.max(0,c-1)); }}
            disabled={isFirst}
            style={{ fontSize:12, padding:"5px 12px", cursor:isFirst?"not-allowed":"pointer", opacity:isFirst?0.4:1 }}>
            ← 上一步
          </button>
          <button onClick={() => {
            if (playing) { setPlaying(false); }
            else if (isLast) { setCur(0); setPlaying(true); }
            else { setPlaying(true); }
          }}
            style={{
              fontSize:12, padding:"5px 16px", cursor:"pointer",
              background: playing ? C.amber+"22" : step.color+"22",
              color: playing ? C.amber : step.color,
              border:`1px solid ${playing ? C.amber+"88" : step.color+"88"}`,
              borderRadius:"var(--border-radius-md)", fontWeight:500,
            }}>
            {playing ? "⏸ 暂停" : isLast ? "↺ 重播" : "▶ 自动播放"}
          </button>
          <button onClick={() => { setPlaying(false); setCur(c => Math.min(steps.length-1,c+1)); }}
            disabled={isLast}
            style={{ fontSize:12, padding:"5px 12px", cursor:isLast?"not-allowed":"pointer", opacity:isLast?0.4:1 }}>
            下一步 →
          </button>
        </div>
      </div>
    </div>
  );
}

// Certificate view
function CertView() {
  const [sel, setSel] = useState(0);
  const cert = CERTS[sel];
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        {CERTS.map((c,i) => (
          <PillBtn key={i} label={`${c.icon} ${c.name}`} active={sel===i} color={c.color} onClick={()=>setSel(i)} />
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1.4fr)", gap:20 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>证书链</div>
          {cert.chain.map((item, i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"stretch" }}>
              <div style={{
                padding:"9px 14px", borderRadius:"var(--border-radius-md)", textAlign:"center",
                border:`1px solid ${cert.chainColors[i]}${i===0?"99":"55"}`,
                background:`${cert.chainColors[i]}${i===0?"18":"0d"}`,
                fontSize:12, lineHeight:1.4, whiteSpace:"pre-line",
                color: i===0 ? cert.chainColors[i] : "var(--color-text-primary)",
                fontWeight: i===0 ? 500 : 400,
              }}>
                {i===0?"🏛️":i===cert.chain.length-1?"📄":"🔗"} {item}
              </div>
              {i < cert.chain.length-1 &&
                <div style={{ textAlign:"center", color:"var(--color-text-tertiary)", fontSize:18, lineHeight:1.4 }}>↓</div>}
            </div>
          ))}
          <div style={{ marginTop:16, padding:"10px 12px", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:4 }}>信任方式</div>
            <div style={{ fontSize:12.5, color:"var(--color-text-primary)" }}>🔐 {cert.trust}</div>
          </div>
          <div style={{ marginTop:10, padding:"10px 12px", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:4 }}>有效期</div>
            <div style={{ fontSize:12.5, color:"var(--color-text-primary)" }}>📅 {cert.validity}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>适用场景</div>
          <div style={{ fontSize:12.5, padding:"9px 12px", borderRadius:"var(--border-radius-md)", background:cert.color+"12", border:`1px solid ${cert.color}33`, color:"var(--color-text-primary)", marginBottom:14, lineHeight:1.6 }}>
            {cert.use}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <div style={{ fontSize:12, color:C.green, fontWeight:500, marginBottom:7 }}>✓ 优点</div>
              {cert.pros.map((p,i) => <div key={i} style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:5, lineHeight:1.45 }}>• {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize:12, color:C.red, fontWeight:500, marginBottom:7 }}>✗ 局限</div>
              {cert.cons.map((c,i) => <div key={i} style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:5, lineHeight:1.45 }}>• {c}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dev guide view
function DevView() {
  const [section, setSection] = useState("gen");
  const [lang, setLang] = useState("go");

  const sections = [
    { key:"gen", label:"🔧 证书生成" },
    { key:"oneway", label:"🔒 单向 TLS" },
    { key:"mtls", label:"🔐 双向 mTLS" },
    { key:"manage", label:"📊 证书管理" },
  ];

  const codeMap = {
    oneway: { go:CODE.goServer, python:CODE.pythonTLS, node:CODE.nodeJS },
    mtls:   { go:CODE.goMTLS,   python:CODE.pythonTLS, node:CODE.nodeJS },
  };

  return (
    <div>
      <Tabs items={sections} active={section} onChange={setSection} accentColor={C.ltPurple} />

      {section === "gen" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <PillBtn label="自签名（开发/内网）" active={lang==="self"} color={C.red} onClick={()=>setLang("self")} />
            <PillBtn label="私有CA + 服务证书（推荐内网）" active={lang==="ca"} color={C.ltPurple} onClick={()=>setLang("ca")} />
            <PillBtn label="Let's Encrypt（公网）" active={lang==="le"} color={C.green} onClick={()=>setLang("le")} />
          </div>
          {lang==="self" && <><div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>适合开发测试、Docker、数据库 TLS、mTLS 客户端证书。不适合对外公开服务（浏览器警告）。</div><CodeBlock code={CODE.selfSigned} /></>}
          {lang==="ca"  && <><div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>企业内网推荐方案：建立私有 PKI，用同一个 CA 颁发所有内部服务证书，统一信任管理。同时可颁发 mTLS 客户端证书。</div><CodeBlock code={CODE.privateCA} /></>}
          {lang==="le"  && <><div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>免费的公共 CA，适合所有对外暴露的服务，支持自动续期。</div><CodeBlock code={CODE.letsencrypt} /></>}
        </div>
      )}

      {(section === "oneway" || section === "mtls") && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <PillBtn label="Go" active={lang==="go"} color={C.teal} onClick={()=>setLang("go")} />
            <PillBtn label="Python" active={lang==="python"} color={C.blue} onClick={()=>setLang("python")} />
            <PillBtn label="Node.js" active={lang==="node"} color={C.green} onClick={()=>setLang("node")} />
          </div>
          {section === "oneway" && (
            <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>
              单向TLS：只有服务器出示证书。客户端需配置信任的CA（或证书本身）。
            </div>
          )}
          {section === "mtls" && (
            <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8, padding:"8px 12px", borderRadius:"var(--border-radius-md)", background:C.ltPurple+"12", border:`1px solid ${C.ltPurple}33` }}>
              双向mTLS：服务器需配置 <code style={{ fontFamily:"var(--font-mono)", fontSize:11 }}>ClientAuth: RequireAndVerifyClientCert</code>；客户端需同时配置客户端证书（client.crt/key）和服务端CA。
            </div>
          )}
          <CodeBlock code={codeMap[section][lang]} />
        </div>
      )}

      {section === "manage" && (
        <div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:10 }}>
            证书管理核心工作：检查有效期、验证证书链、监控到期时间、自动续期。生产环境推荐使用 cert-manager（Kubernetes）或 Vault PKI Secrets Engine。
          </div>
          <CodeBlock code={CODE.manage} />
        </div>
      )}
    </div>
  );
}

// ─── Plaintext vs Encrypted View ────────────────────────────────
function VisTag({ vis }) {
  const map = {
    plain:   { label:"明文可见",    bg:C.red+"18",      border:C.red+"66",      color:C.red,      icon:"👁" },
    enc:     { label:"已加密",      bg:C.dkGreen+"14",  border:C.dkGreen+"55",  color:C.dkGreen,  icon:"🔒" },
    enc13:   { label:"TLS1.3 加密", bg:C.teal+"14",     border:C.teal+"55",     color:C.teal,     icon:"🔒+" },
    always:  { label:"永远明文",    bg:C.amber+"14",    border:C.amber+"55",    color:C.amber,    icon:"⚠️" },
  };
  const m = map[vis];
  return (
    <span style={{
      fontSize:10, padding:"2px 7px", borderRadius:10, fontWeight:500,
      background:m.bg, border:`1px solid ${m.border}`, color:m.color,
      whiteSpace:"nowrap",
    }}>{m.icon} {m.label}</span>
  );
}

function PlaintextView() {
  const [ver, setVer] = useState("tls12");
  const [showMTLS, setShowMTLS] = useState(false);
  const phases = PLAIN_PHASES[ver];

  const layerColors = { "TCP":C.blue, "TLS握手":C.purple, "应用数据":C.dkGreen, "永远可见":C.amber };

  return (
    <div>
      {/* Legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:16, padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize:12, color:"var(--color-text-secondary)", marginRight:4 }}>图例：</span>
        {[
          { vis:"plain",  desc:"握手期间明文传输" },
          { vis:"enc",    desc:"已加密（不可读）" },
          { vis:"enc13",  desc:"TLS 1.3 新增加密" },
          { vis:"always", desc:"TLS 无法隐藏" },
        ].map(l => (
          <div key={l.vis} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <VisTag vis={l.vis} />
            <span style={{ fontSize:11, color:"var(--color-text-tertiary)" }}>{l.desc}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <PillBtn label="TLS 1.2" active={ver==="tls12"} color={C.blue} onClick={()=>setVer("tls12")} />
        <PillBtn label="TLS 1.3（更安全）" active={ver==="tls13"} color={C.teal} onClick={()=>setVer("tls13")} />
        <div style={{ width:1, height:20, background:"var(--color-border-tertiary)" }} />
        <PillBtn label={showMTLS ? "✓ 含 mTLS 差异" : "含 mTLS 差异"} active={showMTLS} color={C.purple} onClick={()=>setShowMTLS(v=>!v)} />
      </div>

      {ver==="tls13" && (
        <div style={{ padding:"8px 14px", marginBottom:14, borderRadius:"var(--border-radius-md)", background:C.teal+"12", border:`1px solid ${C.teal}33`, fontSize:12, color:"var(--color-text-primary)" }}>
          🔒+ <strong>TLS 1.3 重大改进</strong>：Server Hello 之后的所有握手消息（含服务器证书、mTLS客户端证书）均已加密。中间人无法读取证书内容，更好保护服务器和客户端的身份信息。
        </div>
      )}

      {/* Phase table */}
      {phases.map((section, si) => (
        <div key={si} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{
              fontSize:10, fontWeight:600, letterSpacing:0.5, padding:"2px 8px", borderRadius:4,
              background: layerColors[section.layer]+"18", color: layerColors[section.layer],
              border:`1px solid ${layerColors[section.layer]}44`, textTransform:"uppercase",
            }}>{section.layer}</div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)", fontWeight:500 }}>{section.phase}</div>
          </div>
          <div style={{ borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden" }}>
            {section.items
              .filter(item => {
                if (!showMTLS && (item.label.includes("mTLS") || item.label.includes("Certificate Request") || item.label.includes("Client Certificate"))) return false;
                return true;
              })
              .map((item, ii, arr) => (
                <div key={ii} style={{
                  display:"grid", gridTemplateColumns:"1fr auto", gap:10,
                  padding:"8px 12px", alignItems:"start",
                  borderBottom: ii < arr.length-1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                  background: item.vis==="plain" ? C.red+"06" : item.vis==="always" ? C.amber+"06" : item.vis==="enc13" ? C.teal+"06" : "transparent",
                }}>
                  <div>
                    <div style={{ fontSize:12.5, color:"var(--color-text-primary)", marginBottom:3, fontWeight: item.vis==="always" ? 500 : 400 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize:11.5, color:"var(--color-text-tertiary)", lineHeight:1.5 }}>{item.note}</div>
                  </div>
                  <VisTag vis={item.vis} />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Summary callout */}
      <div style={{ padding:"12px 16px", borderRadius:"var(--border-radius-md)", background:C.amber+"10", border:`1px solid ${C.amber}33`, marginTop:8 }}>
        <div style={{ fontSize:12.5, fontWeight:500, color:C.amber, marginBottom:6 }}>⚠️ SNI 隐私警告</div>
        <div style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.7 }}>
          SNI（Server Name Indication）在 Client Hello 中以<strong>明文</strong>发送，意味着即使使用 HTTPS，ISP、防火墙、网络监控设备都能看到你正在访问哪个域名（如 mail.google.com），只是无法看到具体内容。<br />
          <strong>ECH（Encrypted Client Hello）</strong>是 IETF 草案标准，可加密 SNI，但目前尚未广泛部署。
        </div>
      </div>
    </div>
  );
}

// ─── Wireshark View ──────────────────────────────────────────────
const WS_CODE = {
  noKey: `# Wireshark 抓包到的 TLS 流量（未解密状态）
# 你能看到的内容：

Frame 1: TCP SYN                          ← 完全可见
  Src: 192.168.1.100:54321
  Dst: 93.184.216.34:443

Frame 4: TLSv1.3 Record Layer             ← 部分可见
  Content Type: Handshake (22)
  Version: TLS 1.0 (0x0301)              ← 兼容字段，实际是 TLS 1.3
  Length: 512
  Handshake Protocol: Client Hello
    Version: TLS 1.2 (0x0303)
    Random: 3a f2 9c 01 ... (32 bytes)
    Session ID: (empty)
    Cipher Suites (8 suites):
      TLS_AES_128_GCM_SHA256 (0x1301)
      TLS_AES_256_GCM_SHA384 (0x1302)
      ...
    Extension: server_name
      Server Name: example.com           ← ⚠️ 域名明文可见！

Frame 5: TLSv1.3 Record Layer
  Content Type: Handshake (22)
  Handshake Protocol: Server Hello
    Random: 7b 4a ...
    Cipher Suite: TLS_AES_256_GCM_SHA384

# 之后的数据包（加密后）：
Frame 6-N: TLSv1.3 Record Layer
  Content Type: Application Data (23)    ← 类型可见
  Length: 1420                           ← 大小可见
  Encrypted Application Data:
    [ENCRYPTED DATA - 无法读取]          ← 内容不可见
    eb 2c 4f 9a 00 11 22 33 44 55 ...`,

  rsaKey: `# 方法一：加载服务器 RSA 私钥解密
# ⚠️ 重要限制：只适用于 RSA 密钥交换（无 PFS）
# 现代 TLS 1.3 和启用了 ECDHE 的 TLS 1.2 此方法无效！

# 判断是否可用（抓包查看 Key Exchange）：
# - TLS_RSA_WITH_AES_256_CBC_SHA       ← RSA 交换，可解密 ✓
# - TLS_ECDHE_RSA_WITH_AES_256_GCM     ← ECDHE，此方法无效 ✗
# - TLS_AES_256_GCM_SHA384（TLS1.3）   ← 此方法无效 ✗

# Wireshark 操作步骤：
# 1. Edit → Preferences
# 2. Protocols → TLS
# 3. RSA Keys → Edit → Add
#    填写：
#      IP Address:  93.184.216.34   (服务器IP)
#      Port:        443
#      Protocol:    http
#      Key File:    /path/to/server.key  (PEM 格式私钥)
#      Password:    (如果私钥有密码)
# 4. 点击 OK，Wireshark 自动解密已捕获的流量

# 命令行解密（tshark）：
tshark -r capture.pcapng \\
  -o "tls.keys_list:0.0.0.0,443,http,server.key" \\
  -Y tls \\
  -T fields -e http.request.uri -e http.response.code`,

  sslKeylog: `# 方法二：SSLKEYLOGFILE（推荐，适用所有场景含 TLS 1.3 / ECDHE）
# 原理：浏览器/程序将每次握手的会话密钥写入日志文件
# Wireshark 加载该日志后即可解密

# ── Step 1：启动时设置环境变量 ──────────────────────────────────

# macOS / Linux
export SSLKEYLOGFILE=/tmp/tls-keys.log

# Chrome / Chromium
SSLKEYLOGFILE=/tmp/tls-keys.log google-chrome

# Firefox（也支持 SSLKEYLOGFILE 环境变量）
SSLKEYLOGFILE=/tmp/tls-keys.log firefox

# curl
SSLKEYLOGFILE=/tmp/tls-keys.log curl https://example.com

# Python（使用 pyOpenSSL 或 urllib3）
# 需配合 wireshark-keys 等库导出密钥

# Node.js（v12+）
NODE_OPTIONS=--tls-keylog=/tmp/tls-keys.log node app.js

# Windows（PowerShell）
$env:SSLKEYLOGFILE = "C:\\tls-keys.log"
Start-Process chrome

# ── Step 2：日志文件内容（示例）─────────────────────────────────
# 格式：<label> <ClientRandom> <Secret>
CLIENT_RANDOM 3af29c017b4a... 9f1b2c3d4e5f...  ← 会话密钥
CLIENT_HANDSHAKE_TRAFFIC_SECRET 3af29c... abc123...
SERVER_HANDSHAKE_TRAFFIC_SECRET 3af29c... def456...
CLIENT_TRAFFIC_SECRET_0 3af29c... 789abc...
SERVER_TRAFFIC_SECRET_0 3af29c... 012def...

# ── Step 3：Wireshark 加载密钥日志 ──────────────────────────────
# Edit → Preferences → Protocols → TLS
# (Pre)-Master-Secret log filename: /tmp/tls-keys.log
# 点击 OK → 流量自动解密

# 命令行（tshark）：
tshark -r capture.pcapng \\
  -o "tls.keylog_file:/tmp/tls-keys.log" \\
  -Y "http2 or http" \\
  -T fields \\
  -e http2.headers.path \\
  -e http.cookie`,

  afterDecrypt: `# 解密后 Wireshark 能看到什么？（以 HTTPS 访问为例）

# ── HTTP/1.1 ──────────────────────────────────────────────────
GET /api/v1/user/profile HTTP/1.1
Host: api.example.com
Cookie: session=eyJhbGciOi...    ← ⚠️ Cookie 完全可见
Authorization: Bearer eyJhbGci... ← ⚠️ JWT Token 完全可见
User-Agent: Mozilla/5.0 ...
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: csrf_token=abc123; HttpOnly; Secure
{"user_id": 42, "email": "user@example.com", "balance": 1000.00}
                                   ← ⚠️ 响应体完全可见

# ── HTTP/2（解密后展示为伪头部）──────────────────────────────
:method: POST
:path: /api/payment
:authority: pay.example.com
content-type: application/json
authorization: Bearer eyJ...      ← 完全可见

{"amount": 500, "to_account": "6225...1234", "password": "123456"}
                                   ← ⚠️ 所有 POST 数据可见

# 这说明：
# 1. HTTPS 只加密"在途"数据（防中间人）
# 2. 拥有私钥 或 部署了 TLS 终止代理（如 Nginx/企业防火墙）
#    的一方仍能看到明文
# 3. 企业 DLP/WAF 系统正是通过 TLS 终止实现内容审查`,
};

function WiresharkView() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { key:"overview",    label:"📦 抓包内容" },
    { key:"rsa",         label:"🔑 RSA私钥解密" },
    { key:"keylog",      label:"📋 SSLKEYLOG（推荐）" },
    { key:"decrypted",   label:"🔓 解密后内容" },
  ];

  return (
    <div>
      <Tabs items={tabs} active={tab} onChange={setTab} accentColor={C.teal} />

      {tab === "overview" && (
        <div>
          <div style={{ padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:C.blue+"10", border:`1px solid ${C.blue}33`, marginBottom:16, fontSize:12.5, lineHeight:1.7, color:"var(--color-text-primary)" }}>
            <strong>未解密时的 Wireshark 抓包</strong>，你能看到 TLS 握手的框架，但无法看到加密后的应用数据内容。以下展示一次完整的 TLS 1.3 HTTPS 连接抓包内容。
          </div>

          {/* Packet flow visual */}
          <div style={{ marginBottom:16 }}>
            {[
              { n:1,  dir:"→", color:C.blue,    label:"TCP SYN",                  vis:"plain", note:"src=192.168.1.100:54321 dst=93.184.216.34:443" },
              { n:2,  dir:"←", color:C.green,   label:"TCP SYN-ACK",              vis:"plain", note:"TCP 握手，完全明文" },
              { n:3,  dir:"→", color:C.blue,    label:"TCP ACK",                  vis:"plain", note:"TCP 连接建立完成" },
              { n:4,  dir:"→", color:C.blue,    label:"TLS Client Hello",         vis:"plain", note:"⚠️ SNI: example.com 可见；密码套件列表可见" },
              { n:5,  dir:"←", color:C.green,   label:"TLS Server Hello",         vis:"plain", note:"选定密码套件可见；之后加密" },
              { n:6,  dir:"←", color:C.dkGreen, label:"Change Cipher Spec",       vis:"plain", note:"1字节通知，之后全部加密" },
              { n:7,  dir:"←", color:C.dkGreen, label:"Application Data [ENC]",   vis:"enc",   note:"实际是：Certificate + CertificateVerify + Finished（TLS 1.3 加密）" },
              { n:8,  dir:"→", color:C.dkGreen, label:"Application Data [ENC]",   vis:"enc",   note:"实际是：Finished（握手结束）" },
              { n:"9+",dir:"⇄", color:C.dkGreen,"label":"Application Data [ENC]", vis:"enc",   note:"HTTP 请求/响应，完全加密，只能看到包长度和时序" },
            ].map((p, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"28px 20px 1fr auto", gap:8,
                padding:"6px 10px", marginBottom:2, alignItems:"center",
                borderRadius:"var(--border-radius-md)",
                background: p.vis==="plain" ? C.red+"06" : C.dkGreen+"06",
                border:"0.5px solid var(--color-border-tertiary)",
              }}>
                <div style={{ fontSize:10, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", textAlign:"right" }}>#{p.n}</div>
                <div style={{ fontSize:13, textAlign:"center", color: p.dir==="→" ? C.blue : p.dir==="←" ? C.green : C.dkGreen }}>{p.dir}</div>
                <div>
                  <div style={{ fontSize:12.5, color:"var(--color-text-primary)", fontWeight: p.vis==="plain"?500:400 }}>{p.label}</div>
                  <div style={{ fontSize:11, color:"var(--color-text-tertiary)" }}>{p.note}</div>
                </div>
                <VisTag vis={p.vis} />
              </div>
            ))}
          </div>

          <CodeBlock code={WS_CODE.noKey} />
        </div>
      )}

      {tab === "rsa" && (
        <div>
          <div style={{ padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:C.amber+"10", border:`1px solid ${C.amber}44`, marginBottom:14, fontSize:12.5, lineHeight:1.7 }}>
            <strong>⚠️ 重大限制</strong>：RSA 私钥解密<strong>只适用于 RSA 密钥交换</strong>（如 <code style={{fontFamily:"var(--font-mono)",fontSize:11}}>TLS_RSA_WITH_AES_256_CBC_SHA</code>）。现代 TLS 1.3 和使用 ECDHE 的 TLS 1.2 <strong>无法</strong>用此方法解密，因为前向保密（PFS）保证私钥泄露不影响历史流量。
          </div>

          {/* Steps */}
          {[
            { n:1, title:"确认密钥交换类型", body:"在 Wireshark 中找到 Server Hello 包，查看协商的 Cipher Suite：\n• 包含 RSA（不含 ECDHE/DHE）→ 可用此方法\n• 包含 ECDHE/DHE 或 TLS 1.3 → 请使用 SSLKEYLOG 方法" },
            { n:2, title:"Wireshark 加载私钥", body:"Edit → Preferences → Protocols → TLS → RSA Keys → 点击 Edit → Add\n\n填写字段：\n  IP Address: 服务器 IP（如 93.184.216.34）\n  Port: 443\n  Protocol: http（让 Wireshark 解析 HTTP）\n  Key File: /path/to/server.key（PEM 格式 RSA 私钥）\n  Password: 如私钥有密码保护则填写" },
            { n:3, title:"验证解密成功", body:"点击 OK 后，Wireshark 会自动重新解析已捕获的包。\n成功标志：\n• TLS 包旁边出现 Decrypted TLS 子标签\n• 可以看到 HTTP/1.1 或 HTTP/2 的明文内容\n失败：可能因为 ECDHE/PFS，或私钥不匹配" },
          ].map(s => (
            <div key={s.n} style={{ display:"flex", gap:12, marginBottom:14 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:C.blue+"22", border:`1px solid ${C.blue}55`, color:C.blue, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{s.n}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)", marginBottom:5 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"var(--color-text-secondary)", whiteSpace:"pre-line", lineHeight:1.7 }}>{s.body}</div>
              </div>
            </div>
          ))}

          <CodeBlock code={WS_CODE.rsaKey} />
        </div>
      )}

      {tab === "keylog" && (
        <div>
          <div style={{ padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:C.teal+"10", border:`1px solid ${C.teal}33`, marginBottom:14, fontSize:12.5, lineHeight:1.7 }}>
            <strong>✅ 推荐方案：SSLKEYLOGFILE</strong> — 适用于所有 TLS 版本（含 TLS 1.3）、所有密钥交换算法（含 ECDHE/前向保密）。原理是在握手时将协商的会话密钥同步写入文件，而非依赖静态私钥推导。
          </div>

          {/* How it works */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:8 }}>工作原理示意</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              {[
                { icon:"🌐", label:"Chrome / Firefox / curl" },
                { arrow:"→" },
                { icon:"📋", label:"写入 SSLKEYLOGFILE\n会话密钥日志" },
                { arrow:"→" },
                { icon:"🦈", label:"Wireshark 加载\n密钥日志解密" },
              ].map((item, i) => item.arrow ? (
                <div key={i} style={{ fontSize:18, color:"var(--color-text-tertiary)" }}>→</div>
              ) : (
                <div key={i} style={{ padding:"8px 12px", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", textAlign:"center", fontSize:11.5, lineHeight:1.6, whiteSpace:"pre-line" }}>
                  <div style={{ fontSize:20 }}>{item.icon}</div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {[
            { n:1, title:"设置环境变量，启动浏览器/程序", body:"在启动 Chrome、Firefox、curl 或 Node.js 之前设置 SSLKEYLOGFILE 环境变量（见下方代码）。之后该程序发起的所有 TLS 连接的会话密钥都会追加写入此文件。" },
            { n:2, title:"同时用 Wireshark 开始抓包", body:"先启动 Wireshark 抓包，再启动浏览器访问目标网站。确保抓包和密钥日志同时进行，两者时间对齐。" },
            { n:3, title:"Wireshark 加载密钥日志文件", body:"Edit → Preferences → Protocols → TLS\n找到 (Pre)-Master-Secret log filename 字段\n填入 SSLKEYLOGFILE 的路径（如 /tmp/tls-keys.log）\n点击 OK，Wireshark 立即用日志中的密钥解密流量。" },
            { n:4, title:"查看解密后的 HTTP 内容", body:"解密成功后，在 Wireshark 中右键任意 TLS Application Data 包 →\nFollow → TLS Stream，即可看到明文的 HTTP 请求和响应。" },
          ].map(s => (
            <div key={s.n} style={{ display:"flex", gap:12, marginBottom:14 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:C.teal+"22", border:`1px solid ${C.teal}55`, color:C.teal, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{s.n}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)", marginBottom:5 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"var(--color-text-secondary)", whiteSpace:"pre-line", lineHeight:1.7 }}>{s.body}</div>
              </div>
            </div>
          ))}

          <CodeBlock code={WS_CODE.sslKeylog} />

          <div style={{ marginTop:14, padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:C.red+"0a", border:`1px solid ${C.red}33`, fontSize:12, lineHeight:1.7, color:"var(--color-text-secondary)" }}>
            <strong style={{color:C.red}}>🔐 安全注意</strong>：SSLKEYLOGFILE 包含能解密所有流量的会话密钥，需妥善保管，用完即删。切勿在生产服务器上长期开启，仅限本地调试使用。
          </div>
        </div>
      )}

      {tab === "decrypted" && (
        <div>
          <div style={{ padding:"10px 14px", borderRadius:"var(--border-radius-md)", background:C.dkGreen+"10", border:`1px solid ${C.dkGreen}33`, marginBottom:14, fontSize:12.5, lineHeight:1.7 }}>
            解密成功后，Wireshark 能看到完整的 HTTP 请求和响应，包括所有头部、Cookie、JWT Token、以及 POST 请求体。这也是为什么企业 DLP/WAF 防火墙可以进行内容审查的原因。
          </div>
          <CodeBlock code={WS_CODE.afterDecrypt} />

          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:12.5, fontWeight:500, color:"var(--color-text-primary)", marginBottom:10 }}>解密能力对比</div>
            <div style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", overflow:"hidden" }}>
              {[
                { method:"无私钥 / 无密钥日志", can:"SNI域名、包大小、时序、TLS版本", cannot:"HTTP路径、请求头、Cookie、POST数据、响应体", color:C.red },
                { method:"RSA 私钥（无PFS）", can:"全部握手消息、HTTP请求/响应明文、Cookie/Token", cannot:"使用 ECDHE/DHE 的历史流量（前向保密）", color:C.amber },
                { method:"SSLKEYLOGFILE", can:"全部 TLS 内容（含TLS1.3/ECDHE）、HTTP请求/响应、所有头部和body", cannot:"未在 SSLKEYLOGFILE 启动期间抓到的流量", color:C.dkGreen },
                { method:"TLS 终止代理（Nginx/企业防火墙）", can:"所有明文内容（在代理侧）", cannot:"代理本身的上下游隧道外部流量", color:C.blue },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"180px 1fr 1fr", gap:1,
                  borderBottom: i < arr.length-1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                }}>
                  <div style={{ padding:"8px 10px", background:row.color+"12", borderRight:"0.5px solid var(--color-border-tertiary)", fontSize:11.5, fontWeight:500, color:row.color, display:"flex", alignItems:"center" }}>{row.method}</div>
                  <div style={{ padding:"8px 10px", borderRight:"0.5px solid var(--color-border-tertiary)", fontSize:11.5, color:C.dkGreen, lineHeight:1.5 }}>✓ {row.can}</div>
                  <div style={{ padding:"8px 10px", fontSize:11.5, color:C.red, lineHeight:1.5 }}>✗ {row.cannot}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────
export default function TLSDemo() {
  const [tab, setTab] = useState("handshake");
  const [scenario, setScenario] = useState("browser");

  const mainTabs = [
    { key:"handshake", label:"🔄 握手流程" },
    { key:"certs",     label:"📜 证书类型" },
    { key:"plaintext", label:"🔍 明文/加密" },
    { key:"wireshark", label:"🦈 Wireshark" },
    { key:"dev",       label:"💻 开发实战" },
  ];

  const scenarioList = Object.entries(SCENARIOS).map(([k,v]) => ({ key:k, label:`${v.icon} ${v.label}` }));

  return (
    <div style={{ fontFamily:"var(--font-sans)", color:"var(--color-text-primary)", padding:"0 0 32px" }}>
      {/* Header */}
      <div style={{ paddingBottom:16, borderBottom:"0.5px solid var(--color-border-tertiary)", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:500, marginBottom:6 }}>TLS / SSL 认证与传输演示</div>
        <div style={{ fontSize:13.5, color:"var(--color-text-secondary)" }}>
          交互式讲解握手流程 · 四大场景（含浏览器 mTLS）· 明文/加密分析 · Wireshark 抓包解密 · 开发实战
        </div>
      </div>

      {/* Main tabs */}
      <Tabs items={mainTabs} active={tab} onChange={setTab} />

      {/* ── 握手流程 Tab ── */}
      {tab === "handshake" && (
        <div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>选择 TLS 场景</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
              {scenarioList.map(s => (
                <button key={s.key} onClick={() => setScenario(s.key)} style={{
                  fontSize:13, padding:"7px 16px", borderRadius:"var(--border-radius-md)", cursor:"pointer",
                  background: scenario===s.key ? SCENARIOS[s.key].clientColor+"18" : "var(--color-background-secondary)",
                  color: scenario===s.key ? SCENARIOS[s.key].clientColor : "var(--color-text-secondary)",
                  border:`1px solid ${scenario===s.key ? SCENARIOS[s.key].clientColor+"55" : "var(--color-border-tertiary)"}`,
                  fontWeight: scenario===s.key ? 500 : 400, transition:"all 0.15s",
                }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{
              fontSize:12.5, color:"var(--color-text-secondary)", padding:"9px 14px",
              borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)",
              border:"0.5px solid var(--color-border-tertiary)",
              borderLeft:`3px solid ${SCENARIOS[scenario].clientColor}`,
            }}>
              {SCENARIOS[scenario].desc}
            </div>
          </div>
          <HandshakeViz scenarioKey={scenario} />
        </div>
      )}

      {/* ── 证书类型 Tab ── */}
      {tab === "certs" && <CertView />}

      {/* ── 明文/加密 Tab ── */}
      {tab === "plaintext" && <PlaintextView />}

      {/* ── Wireshark Tab ── */}
      {tab === "wireshark" && <WiresharkView />}

      {/* ── 开发实战 Tab ── */}
      {tab === "dev" && <DevView />}
    </div>
  );
}
