import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowUpRight, Radio, ChevronDown } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   THREE.JS · HERO BLACK HOLE
   black sphere · shader-based accretion disk · photon ring · stars
   ════════════════════════════════════════════════════════════════════ */
function HeroBlackHole() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 1000);
    camera.position.set(0, 1.4, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Event horizon (black sphere) ───────────────────────────────── */
    const horizon = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(horizon);

    /* ── Photon ring (thin bright torus at ~1.5 r_s) ───────────────── */
    const photonRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.32, 0.012, 16, 200),
      new THREE.MeshBasicMaterial({
        color: 0xffd9a3,
        transparent: true,
        opacity: 0.9,
      })
    );
    photonRing.rotation.x = Math.PI / 2.3;
    scene.add(photonRing);

    /* ── Accretion disk (shader-based) ─────────────────────────────── */
    const diskGeo = new THREE.RingGeometry(1.4, 4.0, 256, 8);
    const diskMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float uTime;
        // hash noise
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          float a = hash(i), b = hash(i+vec2(1.,0.));
          float c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
          vec2 u = f*f*(3.-2.*f);
          return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
        }
        void main() {
          // radial distance (0 inner edge, 1 outer edge)
          float r = length(vPos.xy);
          float t = (r - 1.4) / (4.0 - 1.4);
          float angle = atan(vPos.y, vPos.x);

          // heat gradient: white-hot inside → ember → fade
          vec3 cHot   = vec3(1.0, 0.95, 0.78);
          vec3 cEmber = vec3(1.0, 0.48, 0.18);
          vec3 cDark  = vec3(0.42, 0.10, 0.02);
          vec3 col = mix(cHot, cEmber, smoothstep(0.0, 0.45, t));
          col = mix(col, cDark, smoothstep(0.55, 1.0, t));

          // turbulence
          float n = noise(vec2(angle * 6.0 + uTime * 0.6, r * 8.0));
          col *= 0.7 + 0.6 * n;

          // doppler-like brightening on one side (relativistic beaming)
          float beam = 0.55 + 0.55 * sin(angle - uTime * 0.4);
          col *= 0.5 + 1.1 * beam;

          // alpha falloff
          float a = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.55, t);
          a *= 0.85;

          gl_FragColor = vec4(col, a);
        }
      `,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2.25;
    disk.rotation.z = 0.15;
    scene.add(disk);

    /* ── Inner glow halo around horizon ─────────────────────────────── */
    const haloGeo = new THREE.RingGeometry(1.0, 2.0, 128);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv; vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        void main() {
          float r = length(vPos.xy);
          float t = (r - 1.0) / 1.0;
          float a = smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.15, 1.0, t));
          vec3 col = mix(vec3(1.0, 0.6, 0.25), vec3(1.0, 0.3, 0.08), t);
          gl_FragColor = vec4(col, a * 0.55);
        }
      `,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.lookAt(camera.position);
    scene.add(halo);

    /* ── Background star field ───────────────────────────────────────── */
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      // distribute on a far sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 40;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      // warm/cool tints
      const tint = Math.random();
      if (tint < 0.7) {
        starCol[i * 3] = 0.95;
        starCol[i * 3 + 1] = 0.92;
        starCol[i * 3 + 2] = 0.82;
      } else if (tint < 0.9) {
        starCol[i * 3] = 0.85;
        starCol[i * 3 + 1] = 0.68;
        starCol[i * 3 + 2] = 0.34;
      } else {
        starCol[i * 3] = 0.5;
        starCol[i * 3 + 1] = 0.78;
        starCol[i * 3 + 2] = 0.85;
      }
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Animation ──────────────────────────────────────────────────── */
    let raf = 0;
    let mx = 0,
      my = 0;
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    mount.addEventListener("mousemove", onMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      diskMat.uniforms.uTime.value = t;
      disk.rotation.z = 0.15 + t * 0.05;
      photonRing.rotation.z = -t * 0.03;
      stars.rotation.y = t * 0.005;

      // gentle parallax
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (1.4 + my * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      halo.lookAt(camera.position);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    /* ── Resize ─────────────────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      renderer.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      photonRing.geometry.dispose();
      photonRing.material.dispose();
      horizon.geometry.dispose();
      horizon.material.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

/* ════════════════════════════════════════════════════════════════════
   THREE.JS · HAWKING RADIATION (scroll-driven)
   pair production at the horizon · particles escaping · mass loss
   ════════════════════════════════════════════════════════════════════ */
function HawkingRadiation({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Black hole ─────────────────────────────────────────────────── */
    const bh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(bh);

    /* ── Event horizon glow ────────────────────────────────────────── */
    const glowGeo = new THREE.SphereGeometry(1.04, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        uniform float uTime;
        uniform float uProgress;
        void main() {
          float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.0);
          vec3 col = mix(vec3(1.0, 0.45, 0.18), vec3(0.6, 0.85, 1.0), uProgress);
          gl_FragColor = vec4(col * fres, fres * (0.4 + 0.6 * uProgress));
        }
      `,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    /* ── Pair production particles ─────────────────────────────────── */
    const MAX = 800;
    const positions = new Float32Array(MAX * 3);
    const colors = new Float32Array(MAX * 3);
    const sizes = new Float32Array(MAX);
    const data = []; // {age, life, dir, speed, escaped}
    for (let i = 0; i < MAX; i++) {
      data.push({ age: Infinity, life: 0, dir: new THREE.Vector3(), speed: 0, escaped: false });
      sizes[i] = 0;
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    partGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const partMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {},
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, a);
        }
      `,
      vertexColors: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    /* ── Animation ──────────────────────────────────────────────────── */
    let raf = 0;
    const clock = new THREE.Clock();
    let lastSpawn = 0;

    const spawnPair = (rate) => {
      // find two free slots
      let n1 = -1, n2 = -1;
      for (let i = 0; i < MAX; i++) {
        if (data[i].age >= data[i].life) {
          if (n1 === -1) n1 = i;
          else { n2 = i; break; }
        }
      }
      if (n1 === -1 || n2 === -1) return;

      // random point on horizon surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.02;
      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      // outward normal
      const dir = new THREE.Vector3(px, py, pz).normalize();

      // particle 1: escapes outward (positive energy)
      data[n1].age = 0;
      data[n1].life = 4 + Math.random() * 2;
      data[n1].dir = dir.clone();
      data[n1].speed = 0.4 + Math.random() * 0.3;
      data[n1].escaped = true;
      positions[n1 * 3] = px;
      positions[n1 * 3 + 1] = py;
      positions[n1 * 3 + 2] = pz;

      // particle 2: falls in (negative energy partner)
      data[n2].age = 0;
      data[n2].life = 0.6 + Math.random() * 0.3;
      data[n2].dir = dir.clone().multiplyScalar(-1);
      data[n2].speed = 0.15;
      data[n2].escaped = false;
      positions[n2 * 3] = px;
      positions[n2 * 3 + 1] = py;
      positions[n2 * 3 + 2] = pz;
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);
      const progress = progressRef.current; // 0..1
      glowMat.uniforms.uTime.value = t;
      glowMat.uniforms.uProgress.value = progress;

      // mass loss: black hole shrinks slightly with progress
      const scale = 1 - progress * 0.18;
      bh.scale.setScalar(scale);
      glow.scale.setScalar(scale);

      // spawn rate scales with progress
      const spawnRate = 1 + progress * 35; // pairs per second
      lastSpawn += dt;
      const interval = 1 / spawnRate;
      while (lastSpawn > interval) {
        spawnPair(spawnRate);
        lastSpawn -= interval;
      }

      // update particles
      for (let i = 0; i < MAX; i++) {
        const d = data[i];
        if (d.age >= d.life) {
          sizes[i] = 0;
          continue;
        }
        d.age += dt;
        const cur = new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        const move = d.dir.clone().multiplyScalar(d.speed * dt);
        cur.add(move);
        positions[i * 3] = cur.x;
        positions[i * 3 + 1] = cur.y;
        positions[i * 3 + 2] = cur.z;

        const lifeT = d.age / d.life;
        const fade = Math.sin(lifeT * Math.PI); // bell curve
        if (d.escaped) {
          // warm orange-gold color (escaping radiation)
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.65 + 0.2 * fade;
          colors[i * 3 + 2] = 0.25 * fade;
          sizes[i] = 4 * fade * (0.6 + progress * 0.6);
        } else {
          // cool blue (negative-energy partner)
          colors[i * 3] = 0.45 * fade;
          colors[i * 3 + 1] = 0.7 * fade;
          colors[i * 3 + 2] = 1.0;
          sizes[i] = 3 * fade;
        }
      }
      partGeo.attributes.position.needsUpdate = true;
      partGeo.attributes.color.needsUpdate = true;
      partGeo.attributes.size.needsUpdate = true;

      // gentle camera drift
      camera.position.x = Math.sin(t * 0.15) * 0.4;
      camera.position.y = Math.cos(t * 0.1) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      partGeo.dispose();
      partMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      bh.geometry.dispose();
      bh.material.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return <div ref={mountRef} className="absolute inset-0" />;
}

/* ════════════════════════════════════════════════════════════════════
   MATH · pretty equation block (CSS, not LaTeX)
   ════════════════════════════════════════════════════════════════════ */
function Eq({ children, label }) {
  return (
    <div className="eq-block">
      <div className="eq-rule" />
      <div className="eq-body">{children}</div>
      {label && <div className="eq-label">{label}</div>}
    </div>
  );
}

// fraction component
function Frac({ num, den }) {
  return (
    <span className="frac">
      <span className="frac-num">{num}</span>
      <span className="frac-bar" />
      <span className="frac-den">{den}</span>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════ */
export default function BlackHoleResearch() {
  const [scrollY, setScrollY] = useState(0);
  const hawkingSectionRef = useRef(null);
  const hawkingProgressRef = useRef(0);
  const [hawkingProgress, setHawkingProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      // compute hawking section progress
      const sec = hawkingSectionRef.current;
      if (sec) {
        const rect = sec.getBoundingClientRect();
        const winH = window.innerHeight;
        // section top hits viewport top → 0; section bottom hits viewport bottom → 1
        const total = rect.height - winH;
        const scrolled = -rect.top;
        let p = scrolled / total;
        p = Math.max(0, Math.min(1, p));
        hawkingProgressRef.current = p;
        setHawkingProgress(p);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ────────────────────────────────────────────────────────────────
     DATA · comprehensive chronology with mathematical contributions
     ──────────────────────────────────────────────────────────────── */
  const prologue = [
    {
      year: "1687",
      who: "Isaac Newton",
      title: "万有引力定律",
      text: "牛顿在《原理》中确立平方反比律。引力首次被定量化 —— 黑洞所有早期推理都站在这块基石之上。",
      math: { lhs: "F", rhs: <Frac num={<>G M m</>} den={<>r<sup>2</sup></>} /> },
    },
    {
      year: "1783",
      who: "John Michell",
      title: "「暗星」的设想",
      text: "英国牧师米歇尔向皇家学会提交论文，首次设想引力强大到光也无法逃逸的恒星。他用逃逸速度公式估算：当天体半径 R ≤ 2GM/c² 时，光被囚禁。这一公式与 130 年后的史瓦西半径在数值上完全一致。",
      math: { lhs: <>v<sub>esc</sub></>, rhs: <>√(2<i>GM</i>/<i>r</i>)</> },
    },
    {
      year: "1796",
      who: "Pierre-Simon Laplace",
      title: "独立的法语推演",
      text: "拉普拉斯在《宇宙体系论》中独立得出相同结论，但因当时光的本质（粒子还是波）尚不清晰，他在第三版中删去了这一段。一个被删除的段落，成为黑洞史上的第一次「未发表」。",
    },
  ];

  const chapter1 = [
    {
      year: "1905",
      who: "Albert Einstein",
      title: "狭义相对论",
      text: "光速不变原理与相对性原理重塑了时间与空间。质能方程 E = mc² 暗示能量本身具有引力作用 —— 这是后来场方程的伏笔。",
      math: { lhs: "E", rhs: <>m c<sup>2</sup></> },
    },
    {
      year: "1908",
      who: "Hermann Minkowski",
      title: "时空连续体",
      text: "「从此空间与时间将单独沦为影子，唯有两者的某种结合才能保持独立的实在性。」闵可夫斯基把时间作为第四维度引入，给广义相对论提供了几何舞台。",
      math: { lhs: <>d s<sup>2</sup></>, rhs: <>−c<sup>2</sup>d t<sup>2</sup> + d x<sup>2</sup> + d y<sup>2</sup> + d z<sup>2</sup></> },
    },
    {
      year: "1915",
      who: "Albert Einstein · David Hilbert",
      title: "广义相对论场方程",
      text: "经过八年挣扎，爱因斯坦在 1915 年 11 月以一组方程把引力转化为时空曲率本身。同月希尔伯特用作用量原理独立给出等价推导。物质告诉时空如何弯曲，时空告诉物质如何运动。",
      math: {
        lhs: <>G<sub>μν</sub> + Λ g<sub>μν</sub></>,
        rhs: <><Frac num={<>8π G</>} den={<>c<sup>4</sup></>} /> T<sub>μν</sub></>,
      },
    },
  ];

  const chapter2 = [
    {
      year: "1916",
      who: "Karl Schwarzschild",
      title: "第一个精确解",
      text: "在俄国前线的战壕中，史瓦西仅用数周便求出场方程的第一个精确解 —— 描述球对称、不带电、不旋转质量周围的时空。三个月后他病逝于战壕。这个解中藏着事件视界。",
    },
    {
      year: "1916",
      who: "Hans Reissner",
      title: "带电黑洞解",
      text: "Reissner 求出带电球对称黑洞的解，1918 年由 Nordström 独立完成。第二个参数 Q 被引入。",
    },
    {
      year: "1924",
      who: "Arthur Eddington",
      title: "坐标的真相",
      text: "爱丁顿提出新坐标系，证明史瓦西半径 r = 2GM/c² 处的「奇异性」只是坐标选择不当的假象 —— 那里时空是光滑的，真正的奇点在 r = 0。",
    },
    {
      year: "1932",
      who: "Georges Lemaître",
      title: "可穿越的视界",
      text: "勒梅特构造了一个不在 r_s 处奇异的坐标系，明确指出视界并不阻止局部物理 —— 一位坠入者并不会感到任何「特殊」时刻。",
    },
  ];

  const chapter3 = [
    {
      year: "1931",
      who: "Subrahmanyan Chandrasekhar",
      title: "钱德拉塞卡极限",
      text: "19 岁的钱德拉塞卡在前往剑桥的航船上完成计算：电子简并压只能支撑约 1.4 倍太阳质量以下的白矮星。质量超过此值，坍缩不可避免。",
      math: { lhs: <>M<sub>Ch</sub></>, rhs: <>≈ 1.4 M<sub>☉</sub></> },
    },
    {
      year: "1939",
      who: "Tolman · Oppenheimer · Volkoff",
      title: "TOV 方程",
      text: "Tolman 与 Oppenheimer-Volkoff 推导了相对论性流体静力学平衡方程，给出中子星的质量上限。压力本身贡献引力 —— 这是相对论独有的反直觉机制。",
      math: {
        lhs: <>d p / d r</>,
        rhs: (
          <>−G[ρ + p/c<sup>2</sup>][m(r) + 4π r<sup>3</sup>p/c<sup>2</sup>] / r<sup>2</sup>(1 − 2Gm/rc<sup>2</sup>)</>
        ),
      },
    },
    {
      year: "1939",
      who: "Oppenheimer · Snyder",
      title: "持续坍缩",
      text: "奥本海默与斯尼德首次完整求解了一团均匀尘埃在自身引力下的坍缩。从远处观察者视角，坍缩在视界附近被「冻结」；从内部视角，奇点在有限固有时间内必然到来。",
    },
  ];

  const chapter4 = [
    {
      year: "1958",
      who: "David Finkelstein",
      title: "事件视界",
      text: "芬克尔斯坦提出新的坐标延拓，首次明确把 r = r_s 解释为单向因果膜：信息可以进入，但永不返回。「视界」这一物理概念正式诞生。",
    },
    {
      year: "1960",
      who: "Kruskal · Szekeres",
      title: "极大延拓",
      text: "Kruskal 与 Szekeres 独立给出史瓦西时空的极大延拓 —— 一个完整的时空图，包含了「白洞」与「平行宇宙」区域。",
    },
    {
      year: "1963",
      who: "Roy Kerr",
      title: "克尔解",
      text: "新西兰数学家克尔在德州的一次研讨会上宣布：他求出了旋转黑洞的精确解。这个解远比史瓦西复杂，引入了第二个参数 a = J/Mc。所有真实的黑洞都在旋转，克尔解才是它们真正的几何。",
      math: {
        lhs: <>d s<sup>2</sup></>,
        rhs: (
          <>−(1 − r<sub>s</sub>r/Σ) c<sup>2</sup>d t<sup>2</sup> + (Σ/Δ) d r<sup>2</sup> + Σ d θ<sup>2</sup> + ⋯</>
        ),
      },
    },
    {
      year: "1965",
      who: "Newman · Janis et al.",
      title: "Kerr-Newman 解",
      text: "新泽西的 Newman 团队推广克尔解到带电情形 —— 至此黑洞最一般的解 (M, J, Q) 完全被写出。",
    },
    {
      year: "1965",
      who: "Roger Penrose",
      title: "奇点定理",
      text: "彭罗斯引入「捕获面」概念，证明在合理能量条件下，引力坍缩必然导致奇点 —— 不是数学瑕疵，而是广义相对论自身的必然预言。这一工作让他获得 2020 年诺贝尔奖。",
    },
    {
      year: "1967",
      who: "John Wheeler",
      title: "「黑洞」之名",
      text: "惠勒在纽约的一次演讲中推广了「black hole」一词。在此之前，物理学家们用「冻结的星」、「坍缩天体」等冗长称呼。一个名字，让黑洞进入大众文化。",
    },
    {
      year: "1967 — 1975",
      who: "Israel · Carter · Robinson · Hawking",
      title: "无毛定理",
      text: "一系列定理证明：渐近平坦、稳态的黑洞由且仅由质量 M、角动量 J、电荷 Q 三个参数完全决定。一切其他信息 —— 电子、质子、爱情、记忆 —— 都被视界吞没。",
      math: { lhs: "BH", rhs: <>(M, J, Q)</> },
    },
  ];

  const chapter5 = [
    {
      year: "1971",
      who: "Stephen Hawking",
      title: "面积定理",
      text: "霍金证明：在经典广义相对论中，黑洞视界面积永不减少。两个黑洞合并后的总面积大于合并前之和。这强烈让人联想到熵的第二定律。",
      math: { lhs: <>d A / d t</>, rhs: <>≥ 0</> },
    },
    {
      year: "1973",
      who: "Jacob Bekenstein",
      title: "黑洞熵",
      text: "贝肯斯坦坚持认为黑洞必须具有熵，否则把热气体扔进黑洞将违反热力学第二定律。他提出熵正比于视界面积。这一想法当时被霍金否定 —— 直到一年后情况完全反转。",
      math: { lhs: <>S<sub>BH</sub></>, rhs: <>k<sub>B</sub> A / (4 ℓ<sub>P</sub><sup>2</sup>)</> },
    },
    {
      year: "1973",
      who: "Bardeen · Carter · Hawking",
      title: "黑洞热力学四定律",
      text: "三人将黑洞物理与热力学一一对应：第零定律（视界表面引力恒定 ↔ 温度均匀）、第一定律（dM = κ dA / 8π + ΩdJ ↔ dE = TdS - PdV）、第二定律（dA ≥ 0 ↔ dS ≥ 0）、第三定律（无法通过有限步骤达到 κ = 0）。",
    },
    {
      year: "1974",
      who: "Stephen Hawking",
      title: "霍金辐射",
      text: "霍金在弯曲时空中应用量子场论，证明黑洞不是完全黑的 —— 它发射温度为 T = ℏc³/(8πGMk_B) 的热辐射。这一刻，量子力学与广义相对论第一次正面相撞。",
      math: { lhs: <>T<sub>H</sub></>, rhs: <><Frac num={<>ℏ c<sup>3</sup></>} den={<>8π G M k<sub>B</sub></>} /></> },
    },
  ];

  const observations = [
    { year: "1964", title: "天鹅座 X-1", desc: "X 射线观测发现首颗恒星级黑洞候选体。1990 年霍金与索恩的著名打赌以霍金「认输」告终。" },
    { year: "1995 — 2002", title: "Sgr A* 的舞蹈", desc: "Genzel 与 Ghez 团队跟踪银河系中心恒星 S2 的轨道运动，确认中心存在 430 万倍太阳质量的致密天体。" },
    { year: "2015", title: "GW150914", desc: "LIGO 首次直接探测引力波 —— 14 亿光年外两个黑洞合并的最后 0.2 秒。验证了广义相对论强场预言。" },
    { year: "2019", title: "M87* 成像", desc: "事件视界望远镜（EHT）发布人类首张黑洞照片：65 亿倍太阳质量的视界剪影。" },
    { year: "2020", title: "诺贝尔加冕", desc: "彭罗斯（理论）、根策尔与盖兹（观测）共获诺贝尔物理学奖。" },
    { year: "2022", title: "Sgr A* 成像", desc: "EHT 公布银河系中心黑洞照片 —— 比 M87* 小 1500 倍但近 2000 倍，验证了 Kerr 度规的预言。" },
  ];

  const masses = [
    { key: "stellar", name: "恒星级黑洞", latin: "Stellar-mass", mass: "3 — 10²", unit: "M☉", origin: "由大质量恒星坍缩形成", sizeRem: 0.7 },
    { key: "intermediate", name: "中等质量黑洞", latin: "Intermediate-mass", mass: "10² — 10⁵", unit: "M☉", origin: "证据稀少，研究热点", sizeRem: 1.6 },
    { key: "supermassive", name: "超大质量黑洞", latin: "Supermassive", mass: "10⁶ — 10¹⁰", unit: "M☉", origin: "位于星系中心，驱动类星体", sizeRem: 3.6 },
  ];

  const frontiers = [
    { n: "01", title: "黑洞信息悖论", desc: "霍金辐射看似是热的，似乎抹除了所有信息。这与量子力学的幺正性矛盾。AdS/CFT、岛屿公式、ER=EPR 等正在尝试调和这一冲突。" },
    { n: "02", title: "中等质量黑洞", desc: "10² — 10⁵ M☉ 的黑洞如何形成？是恒星级吞噬而成，还是早期宇宙直接坍缩？这是星系演化的关键缺口。" },
    { n: "03", title: "多信使天文学", desc: "引力波 + 电磁波 + 中微子 + 宇宙射线 —— 同一事件的多窗口观测正在重塑天体物理学。" },
    { n: "04", title: "事件视界精细结构", desc: "下一代 EHT 与空间干涉计划目标：分辨光子环、检验无毛定理、寻找广义相对论的偏离。" },
    { n: "05", title: "量子引力", desc: "黑洞奇点必然意味着广义相对论在普朗克尺度失效。弦论、圈量子引力、因果集 —— 黑洞是它们共同的检验场。" },
  ];

  /* ──────────────────────────────────────────────────────────────── */
  return (
    <div className="bh-root">
      <style>{cssBlock}</style>

      {/* ambient grain */}
      <div className="grain" />

      {/* header */}
      <header className="masthead">
        <div className="masthead-l">
          <div className="logo-mark">
            <span className="logo-dot" />
          </div>
          <span className="mono kicker">Anthropic Observatory</span>
        </div>
        <div className="masthead-r mono">
          <span>VOL · 02</span>
          <span className="dot-sep" />
          <span>Singularity Series</span>
          <span className="dot-sep" />
          <span>2026</span>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-canvas-wrap">
          <HeroBlackHole />
        </div>

        <div className="hero-overlay">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="reveal" style={{ animationDelay: "0.1s" }}>
                <span className="rule rule-gold" />
                <span className="mono kicker tracked">A Cartography of the Invisible</span>
              </div>

              <h1 className="hero-title reveal" style={{ animationDelay: "0.25s" }}>
                <span className="line-1">黑洞，</span>
                <span className="line-2"><i>时空尽头</i></span>
                <span className="line-3">的几何与代数</span>
              </h1>

              <p className="hero-sub reveal" style={{ animationDelay: "0.4s" }}>
                从 1687 年牛顿写下平方反比律，到 1915 年爱因斯坦用十个非线性偏微分方程描述引力，
                再到 2019 年事件视界望远镜捕获的第一张照片 —— 这是一份关于黑洞研究的编年史，
                既是历史，也是一组方程。
              </p>

              <div className="hero-stats reveal" style={{ animationDelay: "0.55s" }}>
                <span>06 Chapters</span>
                <span className="dot-sep" />
                <span>20+ Theorems</span>
                <span className="dot-sep" />
                <span>Three.js · Live</span>
              </div>
            </div>
          </div>

          <div className="hero-scroll-cue">
            <span className="mono kicker">Scroll</span>
            <ChevronDown size={14} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ═══ PROLOGUE ═══ */}
      <Section
        part="序章 · Prologue"
        title={<>思想的<i>萌芽</i></>}
        intro="在广义相对论尚未诞生的一百多年前，黑洞的核心思想已经在牛顿引力的框架下浮现。"
      >
        <Timeline events={prologue} />
      </Section>

      {/* ═══ CHAPTER I · GR ═══ */}
      <Section
        part="第一章 · Chapter I"
        title={<>时空的<i>革命</i></>}
        intro="1905 年到 1915 年，爱因斯坦用十年时间把引力从「力」变成了「几何」。这是黑洞研究的根。"
        accent="cyan"
      >
        <Timeline events={chapter1} />
        <FeatureEquation
          caption="爱因斯坦场方程 · Einstein Field Equations"
          equation={
            <>
              <span className="big-eq-lhs">G<sub>μν</sub> + Λ g<sub>μν</sub></span>
              <span className="big-eq-eq">=</span>
              <span className="big-eq-rhs">
                <Frac num={<>8π G</>} den={<>c<sup>4</sup></>} /> <span className="ml-half">T<sub>μν</sub></span>
              </span>
            </>
          }
          notes={[
            ["G", "爱因斯坦张量，时空曲率"],
            ["Λ", "宇宙学常数"],
            ["g", "度规张量，定义距离"],
            ["T", "应力-能量张量，物质与能量"],
          ]}
        />
      </Section>

      {/* ═══ CHAPTER II · Schwarzschild ═══ */}
      <Section
        part="第二章 · Chapter II"
        title={<>第一个<i>解</i></>}
        intro="1916 年 1 月，俄国前线的战壕中，一封寄给爱因斯坦的信件改变了一切。"
      >
        <Timeline events={chapter2} />
        <FeatureEquation
          caption="史瓦西度规 · Schwarzschild Metric"
          equation={
            <>
              <span className="big-eq-lhs">d s<sup>2</sup></span>
              <span className="big-eq-eq">=</span>
              <span className="big-eq-rhs">
                −<span className="paren">(</span>1 − <Frac num={<>r<sub>s</sub></>} den={<>r</>} /><span className="paren">)</span> c<sup>2</sup>d t<sup>2</sup>
                {" + "}
                <Frac num={<>d r<sup>2</sup></>} den={<>1 − r<sub>s</sub>/r</>} />
                {" + "}r<sup>2</sup> dΩ<sup>2</sup>
              </span>
            </>
          }
          notes={[
            ["r_s", <>= 2GM/c<sup>2</sup>，史瓦西半径</>],
            ["dΩ²", <>= dθ² + sin²θ dφ²，球面立体角</>],
            ["r → r_s", "坐标奇异，光锥倾斜 90°"],
            ["r → 0", "真正的物理奇点"],
          ]}
        />
      </Section>

      {/* ═══ CHAPTER III · Collapse ═══ */}
      <Section
        part="第三章 · Chapter III"
        title={<>恒星的<i>命运</i></>}
        intro="数学解是一回事，物理实现是另一回事。1930 年代物理学家开始追问：什么样的恒星会坍缩成黑洞？"
        accent="gold"
      >
        <Timeline events={chapter3} />
      </Section>

      {/* ═══ CHAPTER IV · Golden Age ═══ */}
      <Section
        part="第四章 · Chapter IV"
        title={<>黄金<i>时代</i></>}
        intro="1958 — 1975，约二十年间，黑洞从抽象奇点成为可计算的物理对象。理论物理的一个英雄时代。"
      >
        <Timeline events={chapter4} />
        <FeatureEquation
          caption="无毛定理 · No-Hair Theorem"
          equation={
            <>
              <span className="big-eq-lhs">BH</span>
              <span className="big-eq-eq">↔</span>
              <span className="big-eq-rhs">
                <span className="triple">
                  <span>M</span>
                  <span className="comma">,</span>
                  <span>J</span>
                  <span className="comma">,</span>
                  <span>Q</span>
                </span>
              </span>
            </>
          }
          notes={[
            ["M", "总质量"],
            ["J", "总角动量"],
            ["Q", "总电荷"],
            ["其他", <>所有 multipole moments 由 (M, J, Q) 完全决定</>],
          ]}
        />
      </Section>

      {/* ═══ CHAPTER V · Thermodynamics ═══ */}
      <Section
        part="第五章 · Chapter V"
        title={<>黑洞<i>热力学</i></>}
        intro="1971 — 1974，三年内黑洞与热力学的对应关系被精确建立。这或许是现代物理学最深刻的发现之一。"
        accent="cyan"
      >
        <Timeline events={chapter5} />
        <FeatureEquation
          caption="贝肯斯坦-霍金熵 · Bekenstein–Hawking Entropy"
          equation={
            <>
              <span className="big-eq-lhs">S<sub>BH</sub></span>
              <span className="big-eq-eq">=</span>
              <span className="big-eq-rhs">
                <Frac num={<>k<sub>B</sub> c<sup>3</sup> A</>} den={<>4 ℏ G</>} />
              </span>
            </>
          }
          notes={[
            ["A", "事件视界面积"],
            ["ℓ_P", <>= √(ℏG/c³)，普朗克长度</>],
            ["1 bit", <>对应约 一个 ℓ<sub>P</sub><sup>2</sup> 的视界面元</>],
            ["", "熵正比于面积，而非体积 —— 全息原理的源头"],
          ]}
        />
        <FeatureEquation
          caption="霍金温度 · Hawking Temperature"
          equation={
            <>
              <span className="big-eq-lhs">T<sub>H</sub></span>
              <span className="big-eq-eq">=</span>
              <span className="big-eq-rhs">
                <Frac num={<>ℏ c<sup>3</sup></>} den={<>8π G M k<sub>B</sub></>} />
              </span>
            </>
          }
          notes={[
            ["太阳质量黑洞", <>T ≈ 6 × 10<sup>−8</sup> K（远低于宇宙微波背景）</>],
            ["恒星质量越大", "温度越低 —— 大黑洞更冷"],
            ["蒸发寿命", <>τ ∝ M<sup>3</sup>，太阳质量黑洞蒸发需 10<sup>67</sup> 年</>],
          ]}
        />
      </Section>

      {/* ═══ CHAPTER VI · HAWKING RADIATION (scroll-driven) ═══ */}
      <section ref={hawkingSectionRef} className="hawking-section">
        <div className="hawking-sticky">
          <div className="hawking-canvas-wrap">
            <HawkingRadiation progressRef={hawkingProgressRef} />
          </div>
          <div className="hawking-overlay">
            <div className="hawking-mono mono">
              <div className="hawking-progress-line">
                <div
                  className="hawking-progress-fill"
                  style={{ width: `${hawkingProgress * 100}%` }}
                />
              </div>
              <div className="hawking-progress-numbers">
                <span>M / M₀</span>
                <span>{(1 - hawkingProgress * 0.18).toFixed(3)}</span>
              </div>
              <div className="hawking-progress-numbers">
                <span>T_H</span>
                <span>{(1 / (1 - hawkingProgress * 0.18)).toFixed(3)} T₀</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hawking-scroll-content">
          <div className="hawking-step">
            <span className="mono kicker tracked">第六章 · Chapter VI</span>
            <h2 className="big-title">霍金的<i>辐射</i></h2>
            <p className="hawking-step-text">
              在事件视界之外，量子真空并非真空。虚粒子对不断产生又湮灭，
              这是量子场论最基本的图景。
            </p>
          </div>

          <div className="hawking-step">
            <h3 className="hawking-step-title">视界附近的对产生</h3>
            <p className="hawking-step-text">
              霍金在 1974 年的关键洞察是：当虚粒子对恰好诞生于事件视界两侧时，
              一个粒子可以在外部时空中获得正能量并飞出，
              另一个则被视界俘获，携带「负能量」落入。
            </p>
            <Eq label="对产生 → 实辐射">
              <span>|0⟩<sub>vac</sub></span>
              <span className="arrow">→</span>
              <span>|γ⟩<sub>esc</sub></span>
              <span>+</span>
              <span>|γ̃⟩<sub>fall</sub></span>
            </Eq>
          </div>

          <div className="hawking-step">
            <h3 className="hawking-step-title">质量损失</h3>
            <p className="hawking-step-text">
              落入的负能量降低黑洞质量。从外部观察者看来，
              黑洞向外发射了一束温度为 T_H 的近热辐射 —— 这就是霍金辐射。
              视界正在缓慢萎缩。
            </p>
            <Eq label="Stefan-Boltzmann · BH evaporation">
              <Frac num={<>d M</>} den={<>d t</>} />
              <span className="arrow">∝</span>
              <span>−1 / M<sup>2</sup></span>
            </Eq>
          </div>

          <div className="hawking-step">
            <h3 className="hawking-step-title">温度反向</h3>
            <p className="hawking-step-text">
              注意一个反直觉事实：黑洞质量越小，温度越高。
              蒸发是一个加速过程 —— 最后阶段以爆炸式的能量喷发结束。
              这与你的咖啡完全相反。
            </p>
            <Eq>
              <span>T<sub>H</sub></span>
              <span>∝</span>
              <span>1 / M</span>
              <span className="punct">,</span>
              <span>C</span>
              <span>=</span>
              <span>d M / d T</span>
              <span>&lt; 0</span>
            </Eq>
          </div>

          <div className="hawking-step">
            <h3 className="hawking-step-title">信息悖论</h3>
            <p className="hawking-step-text">
              如果辐射真是热的，那么任何关于落入物质的信息都将被抹除 ——
              这违反量子力学的幺正性。这就是黑洞信息悖论，
              至今仍是基础物理最深刻的悬而未决之问题。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER VII · OBSERVATIONS ═══ */}
      <Section
        part="第七章 · Chapter VII"
        title={<>看见<i>不可见者</i></>}
        intro="从 X 射线到引力波，从恒星轨迹到事件视界 —— 二十一世纪，黑洞终于从理论走入照片。"
      >
        <div className="obs-list">
          {observations.map((o, i) => (
            <div
              key={i}
              className="obs-row reveal"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="obs-year mono">{o.year}</div>
              <div className="obs-title">{o.title}</div>
              <div className="obs-desc">{o.desc}</div>
              <ArrowUpRight size={20} strokeWidth={1} className="obs-arrow" />
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ MASS CLASSIFICATION ═══ */}
      <Section
        part="第八章 · Chapter VIII"
        title={<>三种<i>质量尺度</i></>}
        intro="黑洞按质量大致划分为三类。它们的形成机制不同，在宇宙中扮演的角色也截然有别。"
      >
        <div className="mass-grid">
          {masses.map((m, i) => (
            <div key={m.key} className="mass-cell">
              <div className="mass-orb-wrap" style={{ height: `${m.sizeRem * 4 + 1}rem` }}>
                <div
                  className="mass-orb"
                  style={{
                    width: `${m.sizeRem * 4}rem`,
                    height: `${m.sizeRem * 4}rem`,
                  }}
                />
                <div
                  className="mass-ring"
                  style={{
                    width: `${m.sizeRem * 4 + 0.6}rem`,
                    height: `${m.sizeRem * 4 + 0.6}rem`,
                  }}
                />
              </div>
              <div className="mass-meta">
                <div className="mono kicker tracked accent-gold">
                  Class {String.fromCharCode(0x2160 + i)}
                </div>
                <h3 className="mass-name">{m.name}</h3>
                <div className="mass-latin">{m.latin}</div>
                <div className="mass-mass">
                  {m.mass} <span className="mass-unit">{m.unit}</span>
                </div>
                <p className="mass-origin">{m.origin}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mass-axis">
          <span className="mono kicker">Mass →</span>
          <div className="mass-axis-line" />
          <span className="mono kicker accent-gold">10¹⁰ M☉</span>
        </div>
      </Section>

      {/* ═══ EPILOGUE · FRONTIERS ═══ */}
      <Section
        part="尾声 · Epilogue"
        title={<>未尽的<i>边疆</i></>}
        intro="即便已能「看见」黑洞，关于它最深的问题仍未解答。这五个方向，正定义着未来十年的物理学。"
        accent="gold"
      >
        <ul className="frontier-list">
          {frontiers.map((f, i) => (
            <li
              key={i}
              className="frontier-row reveal"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="frontier-num mono">{f.n}</span>
              <div>
                <h4 className="frontier-title">{f.title}</h4>
                <p className="frontier-desc">{f.desc}</p>
              </div>
              <ArrowUpRight className="frontier-arrow" size={22} strokeWidth={1} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-quote">
          "From a thought experiment in 1783
          <br />
          to a photograph in 2019 ──
          <br />
          <span className="accent-ember">the invisible became visible.</span>"
        </div>
        <div className="footer-meta">
          <div>
            <div className="mono kicker">Compiled</div>
            <div className="footer-meta-val">May · 2026</div>
          </div>
          <div>
            <div className="mono kicker">References</div>
            <div className="footer-meta-val small">
              Schwarzschild (1916), Kerr (1963),<br />
              Bekenstein (1973), Hawking (1974),<br />
              EHT Collab. (2019, 2022)
            </div>
          </div>
        </div>
        <div className="footer-end">
          <span className="mono kicker">END · Singularity Series Vol. 02</span>
          <span className="mono kicker accent-gold">
            <Radio size={11} strokeWidth={1} className="inline-block mr-1" />
            Anthropic Observatory
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION wrapper · consistent layout
   ════════════════════════════════════════════════════════════════════ */
function Section({ part, title, intro, accent, children }) {
  return (
    <section className="bh-section">
      <div className="section-inner">
        <div className="section-head">
          <div className={`mono kicker tracked ${accent === "gold" ? "accent-gold" : accent === "cyan" ? "accent-cyan" : "accent-ember"}`}>
            § {part}
          </div>
          <h2 className="big-title">{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TIMELINE · era events
   ════════════════════════════════════════════════════════════════════ */
function Timeline({ events }) {
  return (
    <ol className="timeline">
      {events.map((e, i) => (
        <li
          key={i}
          className="timeline-row reveal"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className="timeline-dot-col">
            <div className="timeline-dot" />
          </div>
          <div className="timeline-year mono">{e.year}</div>
          <div className="timeline-content">
            <div className="timeline-who mono kicker">{e.who}</div>
            <h3 className="timeline-title">{e.title}</h3>
            <p className="timeline-text">{e.text}</p>
            {e.math && (
              <div className="inline-eq">
                <span className="inline-eq-lhs">{e.math.lhs}</span>
                <span className="inline-eq-eq">=</span>
                <span className="inline-eq-rhs">{e.math.rhs}</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FEATURE EQUATION · centerpiece display
   ════════════════════════════════════════════════════════════════════ */
function FeatureEquation({ caption, equation, notes }) {
  return (
    <div className="feature-eq">
      <div className="feature-eq-caption mono kicker tracked">{caption}</div>
      <div className="feature-eq-display">{equation}</div>
      {notes && (
        <ul className="feature-eq-notes">
          {notes.map(([sym, expl], i) => (
            <li key={i} className="feature-eq-note">
              <span className="feature-eq-sym">{sym}</span>
              <span className="feature-eq-expl">{expl}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CSS · all in one block to avoid Tailwind arbitrary-class issues
   ════════════════════════════════════════════════════════════════════ */
const cssBlock = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@300;400;500;600&display=swap');

:root {
  --void:    #06060a;
  --ink:     #0a0a12;
  --char:    #0d0d14;
  --ash:     #1a1a24;
  --smoke:   #4a4a55;
  --dust:    #6b6b78;
  --paper:   #a39580;
  --bone:    #d8cfb8;
  --pearl:   #f0e7d6;
  --ember:   #ff7a3a;
  --flame:   #ff9a5a;
  --gold:    #d4a857;
  --plasma:  #6ec6d4;
  --cyan:    #6ec6d4;
}

.bh-root {
  background: var(--void);
  color: var(--pearl);
  font-family: 'Noto Serif SC', 'Cormorant Garamond', serif;
  font-weight: 300;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* ── typography helpers ───────────────────────────────────────────── */
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 400; }
.kicker { font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: var(--ember); }
.tracked { letter-spacing: 0.4em; }
.accent-gold { color: var(--gold); }
.accent-ember { color: var(--ember); }
.accent-cyan { color: var(--cyan); }
.dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--smoke); display: inline-block; }
.rule { display: inline-block; width: 64px; height: 1px; vertical-align: middle; margin-right: 1rem; }
.rule-gold { background: var(--gold); }

/* italic accent */
.bh-root i { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--ember); font-weight: 400; }

/* ── grain ────────────────────────────────────────────────────────── */
.grain {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 100;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
}

/* ── reveal animation ─────────────────────────────────────────────── */
@keyframes reveal {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal { animation: reveal 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ── header ───────────────────────────────────────────────────────── */
.masthead {
  position: relative;
  z-index: 20;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 2rem;
}
@media (min-width: 768px) { .masthead { padding: 1.75rem 4rem; } }
.masthead-l { display: flex; align-items: center; gap: 0.75rem; }
.logo-mark {
  position: relative;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #000;
  box-shadow: 0 0 0 1px var(--gold), 0 0 12px rgba(212, 168, 87, 0.25);
}
.logo-dot {
  position: absolute; inset: 4px;
  border-radius: 50%;
  background: var(--void);
  box-shadow: inset 0 0 6px rgba(212, 168, 87, 0.5);
}
.masthead-r { display: none; gap: 1.5rem; align-items: center; color: var(--paper); font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; }
@media (min-width: 768px) { .masthead-r { display: flex; } }

/* ── HERO ─────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
}
.hero-canvas-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-canvas-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 65% 50%, transparent 30%, rgba(6, 6, 10, 0.85) 80%);
  z-index: 2;
  pointer-events: none;
}
.hero-overlay {
  position: relative;
  z-index: 3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem 8rem;
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 768px) { .hero-overlay { padding: 6rem 4rem 10rem; } }
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .hero-grid { grid-template-columns: 6fr 6fr; }
}
.hero-text { padding-right: 0; max-width: 640px; }

.hero-title {
  font-family: 'Noto Serif SC', 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2.5rem, 8vw, 5.4rem);
  line-height: 1.0;
  letter-spacing: -0.01em;
  margin-top: 2rem;
}
.hero-title .line-1, .hero-title .line-3 { display: block; color: var(--pearl); }
.hero-title .line-2 {
  display: block;
  font-style: italic;
  color: var(--ember);
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  text-shadow: 0 0 32px rgba(255, 122, 58, 0.35), 0 0 64px rgba(255, 122, 58, 0.15);
}
.hero-title i { color: var(--ember); }
.hero-sub {
  margin-top: 2.5rem;
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--paper);
  max-width: 580px;
  font-weight: 300;
}
.hero-stats {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 1.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--dust);
}
.hero-stats > span { padding: 0.25rem 0; }
.hero-scroll-cue {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--dust);
  animation: pulse 2.5s ease-in-out infinite;
}

/* ── generic section ──────────────────────────────────────────────── */
.bh-section {
  position: relative;
  z-index: 5;
  border-top: 1px solid var(--ash);
  background: var(--void);
}
.bh-section:nth-of-type(even) { background: var(--ink); }
.section-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 7rem 2rem;
}
@media (min-width: 768px) { .section-inner { padding: 8rem 4rem; } }

.section-head { margin-bottom: 4rem; max-width: 760px; }
.big-title {
  margin-top: 1.25rem;
  font-family: 'Noto Serif SC', serif;
  font-weight: 300;
  font-size: clamp(2.25rem, 5.5vw, 3.75rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--pearl);
}
.big-title i { color: var(--ember); }
.section-intro {
  margin-top: 1.25rem;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--paper);
  font-weight: 300;
  max-width: 640px;
}

/* ── timeline ─────────────────────────────────────────────────────── */
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 15.5px;
  top: 2.2rem;
  bottom: 2.2rem;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(255, 122, 58, 0.35) 5%,
    rgba(255, 122, 58, 0.35) 95%,
    transparent 100%);
  z-index: 0;
}
@media (min-width: 768px) {
  .timeline::before {
    left: 19.5px;
    top: 3rem;
    bottom: 3rem;
  }
}
.timeline-row {
  display: grid;
  grid-template-columns: 32px 80px 1fr;
  gap: 1.5rem;
  padding: 1.75rem 0;
  border-top: 1px solid var(--ash);
  position: relative;
  z-index: 1;
}
.timeline-row:last-child { border-bottom: 1px solid var(--ash); }
@media (min-width: 768px) {
  .timeline-row {
    grid-template-columns: 40px 110px 1fr;
    gap: 2.5rem;
    padding: 2.5rem 0;
  }
}

.timeline-dot-col {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}
.timeline-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--ember);
  box-shadow:
    0 0 0 4px var(--void),
    0 0 0 5px rgba(255, 122, 58, 0.35),
    0 0 18px rgba(255, 122, 58, 0.6);
  flex-shrink: 0;
  z-index: 2;
}
.bh-section:nth-of-type(even) .timeline-dot {
  box-shadow:
    0 0 0 4px var(--ink),
    0 0 0 5px rgba(255, 122, 58, 0.35),
    0 0 18px rgba(255, 122, 58, 0.6);
}

.timeline-year {
  color: var(--gold);
  font-size: 0.95rem;
  padding-top: 0.1rem;
  font-weight: 500;
}
.timeline-content { min-width: 0; }
.timeline-who { color: var(--dust); margin-bottom: 0.5rem; }
.timeline-title {
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  font-size: 1.25rem;
  color: var(--pearl);
  margin-bottom: 0.85rem;
  line-height: 1.4;
}
@media (min-width: 768px) {
  .timeline-title { font-size: 1.5rem; }
}
.timeline-text {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--paper);
  font-weight: 300;
  margin-bottom: 1rem;
}

/* inline equation in timeline */
.inline-eq {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 0.6rem;
  margin-top: 0.5rem;
  max-width: 100%;
  padding: 0.55rem 1rem;
  border: 1px solid var(--ash);
  border-left: 2px solid var(--cyan);
  background: rgba(110, 198, 212, 0.05);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.1rem;
  color: var(--bone);
  letter-spacing: 0.02em;
  line-height: 1.5;
}
.inline-eq-lhs { color: var(--cyan); font-weight: 500; }
.inline-eq-eq { color: var(--dust); font-style: normal; padding: 0 0.1rem; }
.inline-eq-rhs { word-break: break-word; }
.inline-eq sub { font-size: 0.7em; }
.inline-eq sup { font-size: 0.7em; }

/* ── feature equation block ───────────────────────────────────────── */
.feature-eq {
  margin-top: 4rem;
  padding: 2.5rem;
  border: 1px solid var(--ash);
  background: linear-gradient(180deg, rgba(110, 198, 212, 0.03), rgba(110, 198, 212, 0.01));
  position: relative;
}
.feature-eq::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  opacity: 0.4;
}
@media (min-width: 768px) { .feature-eq { padding: 3.5rem 4rem; } }
.feature-eq-caption {
  color: var(--cyan);
  margin-bottom: 2rem;
}
.feature-eq-display {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  color: var(--pearl);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
  margin-bottom: 2.5rem;
}
.big-eq-lhs { color: var(--cyan); font-weight: 500; }
.big-eq-eq { color: var(--dust); padding: 0 0.3rem; font-style: normal; }
.big-eq-rhs { display: inline-flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.feature-eq-display sub { font-size: 0.6em; }
.feature-eq-display sup { font-size: 0.6em; }
.paren { font-size: 1.2em; padding: 0 0.05rem; color: var(--bone); }
.ml-half { margin-left: 0.5rem; }

.triple { display: inline-flex; align-items: center; gap: 0.4rem; }
.triple .comma { color: var(--dust); font-style: normal; }

.feature-eq-notes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ash);
}
@media (min-width: 768px) {
  .feature-eq-notes { grid-template-columns: 1fr 1fr; gap: 1rem 2.5rem; }
}
.feature-eq-note {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  align-items: baseline;
  font-size: 0.92rem;
  font-weight: 300;
}
.feature-eq-sym {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.1rem;
  color: var(--cyan);
  font-weight: 500;
}
.feature-eq-expl { color: var(--paper); line-height: 1.6; }
.feature-eq-expl sub { font-size: 0.75em; }
.feature-eq-expl sup { font-size: 0.75em; }

/* ── fraction ─────────────────────────────────────────────────────── */
.frac {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin: 0 0.2rem;
  text-align: center;
  line-height: 1.1;
}
.frac-num, .frac-den {
  padding: 0 0.35rem;
  font-size: 0.85em;
}
.frac-bar {
  display: block;
  width: 100%;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
  margin: 0.15rem 0;
}

/* arrow & punct */
.arrow { color: var(--dust); font-style: normal; padding: 0 0.2rem; }
.punct { color: var(--dust); font-style: normal; }

/* ── HAWKING SECTION (scroll-driven, sticky canvas) ──────────────── */
.hawking-section {
  position: relative;
  border-top: 1px solid var(--ash);
  background: #050509;
}
.hawking-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  z-index: 1;
}
.hawking-canvas-wrap {
  position: absolute;
  inset: 0;
}
.hawking-canvas-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(5, 5, 9, 0.7) 80%),
    linear-gradient(90deg, rgba(5, 5, 9, 0.4), transparent 35%, transparent 65%, rgba(5, 5, 9, 0.4));
  pointer-events: none;
}
.hawking-overlay {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 5;
  pointer-events: none;
}
@media (min-width: 768px) { .hawking-overlay { left: 4rem; bottom: 3rem; } }

.hawking-mono {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  font-size: 11px;
  color: var(--paper);
}
.hawking-progress-line {
  height: 1px;
  width: 100%;
  background: var(--ash);
  position: relative;
  overflow: hidden;
}
.hawking-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ember), var(--gold));
  transition: width 0.05s linear;
}
.hawking-progress-numbers {
  display: flex;
  justify-content: space-between;
  letter-spacing: 0.15em;
}
.hawking-progress-numbers span:last-child { color: var(--ember); font-weight: 500; }

.hawking-scroll-content {
  position: relative;
  z-index: 2;
  margin-top: -100vh; /* overlay */
  pointer-events: none;
}
.hawking-step {
  pointer-events: auto;
  min-height: 90vh;
  max-width: 540px;
  padding: 25vh 2rem 2rem;
  margin-left: auto;
  margin-right: 6%;
}
@media (min-width: 768px) { .hawking-step { padding: 30vh 4rem 4rem; margin-right: 8%; } }
.hawking-step-title {
  margin-top: 1rem;
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 400;
  color: var(--pearl);
  line-height: 1.25;
}
.hawking-step-text {
  margin-top: 1.25rem;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--bone);
  font-weight: 300;
}

/* eq-block (used in hawking steps) */
.eq-block {
  margin-top: 1.75rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--ash);
  background: rgba(255, 122, 58, 0.04);
  position: relative;
}
.eq-rule {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 2px;
  background: var(--ember);
}
.eq-body {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.3rem;
  color: var(--pearl);
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
  line-height: 1.4;
}
.eq-body sub { font-size: 0.65em; }
.eq-body sup { font-size: 0.65em; }
.eq-label {
  margin-top: 0.85rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--ash);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--dust);
}

/* ── observations list ───────────────────────────────────────────── */
.obs-list {
  border-top: 1px solid var(--ash);
}
.obs-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--ash);
  transition: background 0.4s ease, padding-left 0.4s ease;
}
.obs-row:hover {
  background: rgba(255, 122, 58, 0.03);
  padding-left: 1rem;
}
@media (min-width: 768px) {
  .obs-row {
    grid-template-columns: 110px 240px 1fr 24px;
    align-items: baseline;
    gap: 2.5rem;
    padding: 2rem 0;
  }
}
.obs-year { color: var(--gold); font-size: 0.95rem; font-weight: 500; }
.obs-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--pearl);
}
.obs-desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--paper);
  font-weight: 300;
}
.obs-arrow {
  color: var(--smoke);
  transition: all 0.4s ease;
  justify-self: end;
}
.obs-row:hover .obs-arrow { color: var(--ember); transform: translate(2px, -2px); }

/* ── mass classes ─────────────────────────────────────────────────── */
.mass-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: end;
  padding: 2rem 0;
}
@media (min-width: 768px) {
  .mass-grid { grid-template-columns: 1fr 1fr 1fr; gap: 2rem; }
}
.mass-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mass-orb-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mass-orb {
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #000 0%, #000 55%, transparent 75%);
  box-shadow:
    0 0 24px rgba(255, 122, 58, 0.25),
    0 0 80px rgba(255, 122, 58, 0.12),
    inset 0 0 8px rgba(255, 122, 58, 0.15);
  transition: all 0.5s ease;
  z-index: 2;
}
.mass-cell:hover .mass-orb {
  box-shadow:
    0 0 36px rgba(255, 122, 58, 0.5),
    0 0 120px rgba(255, 122, 58, 0.25),
    inset 0 0 8px rgba(255, 122, 58, 0.25);
}
.mass-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--ember);
  border-radius: 50%;
  opacity: 0.35;
  transition: all 0.5s ease;
  z-index: 1;
}
.mass-cell:hover .mass-ring {
  opacity: 0.85;
  transform: translate(-50%, -50%) scale(1.05);
}

.mass-meta { margin-top: 2rem; }
.mass-name {
  margin-top: 0.75rem;
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--pearl);
}
.mass-latin {
  margin-top: 0.25rem;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 0.9rem;
  color: var(--dust);
}
.mass-mass {
  margin-top: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.05rem;
  color: var(--ember);
  font-weight: 500;
}
.mass-unit { color: var(--paper); }
.mass-origin {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--paper);
  font-weight: 300;
}
.mass-axis {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.mass-axis-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--ash), rgba(255, 122, 58, 0.4), var(--ember));
}

/* ── frontiers ────────────────────────────────────────────────────── */
.frontier-list { list-style: none; padding: 0; margin: 0; }
.frontier-row {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  gap: 1.5rem;
  align-items: baseline;
  padding: 2rem 0;
  border-top: 1px solid var(--ash);
  transition: all 0.4s ease;
}
.frontier-row:last-child { border-bottom: 1px solid var(--ash); }
.frontier-row:hover {
  padding-left: 1rem;
  background: rgba(255, 122, 58, 0.03);
}
@media (min-width: 768px) {
  .frontier-row { gap: 2.5rem; padding: 2.5rem 0; }
}
.frontier-num { color: var(--gold); font-size: 0.95rem; }
.frontier-title {
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  font-size: 1.25rem;
  color: var(--pearl);
}
@media (min-width: 768px) { .frontier-title { font-size: 1.5rem; } }
.frontier-desc {
  margin-top: 0.85rem;
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--paper);
  font-weight: 300;
  max-width: 56ch;
}
.frontier-arrow {
  color: var(--ember);
  opacity: 0;
  transform: translate(-8px, 8px);
  transition: all 0.4s ease;
}
.frontier-row:hover .frontier-arrow {
  opacity: 1;
  transform: translate(0, 0);
}

/* ── footer ───────────────────────────────────────────────────────── */
.footer {
  position: relative;
  z-index: 5;
  border-top: 1px solid var(--ash);
  background: var(--char);
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 3rem;
}
@media (min-width: 768px) { .footer { padding: 7rem 4rem 3rem; } }
.footer-quote {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.5rem, 3.5vw, 2.6rem);
  line-height: 1.35;
  color: var(--bone);
  max-width: 800px;
  letter-spacing: 0.01em;
}
.footer-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 4rem;
}
@media (min-width: 640px) {
  .footer-meta { grid-template-columns: 1fr 1fr; }
}
.footer-meta-val {
  margin-top: 0.5rem;
  color: var(--bone);
  font-size: 1rem;
}
.footer-meta-val.small { font-size: 0.9rem; line-height: 1.7; color: var(--paper); }
.footer-end {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ash);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 768px) {
  .footer-end { flex-direction: row; justify-content: space-between; align-items: center; }
}

.inline-block { display: inline-block; }
.mr-1 { margin-right: 0.25rem; }
`;
