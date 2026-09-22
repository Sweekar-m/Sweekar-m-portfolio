import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Github, Linkedin, Mail, ExternalLink, Code2, Zap, Gamepad2, X } from "lucide-react";
import "./App.css";

const skills = {
  Languages: ["Python", "JavaScript", "C (working knowledge)"],
  "AI / ML": ["Large Language Models (LLMs)", "RAG", "Prompt Engineering", "Tool Calling", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "FasterWhisper", "OCR", "NLP basics"],
  Backend: ["Flask", "FastAPI", "Flask-SocketIO", "REST APIs", "WebSockets", "Async Python", "JWT Authentication", "Microservice-style modular architecture"],
  Frontend: ["React.js", "HTML", "CSS", "JavaScript"],
  "Platforms & Tools": ["Git", "Linux", "Supabase (PostgreSQL)", "Swagger UI", "Vercel", "Prometheus", "PyQt5/6", "OpenRouter API", "Gemini API"],
  Concepts: ["API performance optimization", "observability/monitoring", "data ingestion & semantic retrieval", "streaming responses", "CI workflows"],
};

const projects = [
  {
    title: "Personal AI Developer Knowledge Base",
    tech: ["Python", "SQLite", "Vector Search", "NVIDIA Nemotron API"],
    points: [
      "Local-first AI developer assistant indexing source code, docs, and persistent conversation history into a searchable knowledge base.",
      "Hybrid retrieval combining keyword search, semantic/vector search, and metadata filtering for codebase-aware Q&A.",
      "Context engine merging retrieved code, prior conversations, and project knowledge before LLM inference for cross-session continuity.",
      "Persistent SQLite-based conversation/project memory across app restarts.",
      "Integrated NVIDIA Nemotron via an OpenAI-compatible API with streaming inference and reasoning-token handling.",
      "Incremental indexing via file hashing/metadata to skip unchanged files.",
    ],
  },
  {
    title: "SoulOS — Multi-LLM Desktop AI Assistant",
    tech: ["Python", "PyQt5", "Flask", "OpenRouter API"],
    points: [
      "Desktop AI assistant with multi-model routing, tool execution, and persistent session memory.",
      "Custom intent-routing pipeline handling 200+ categorized user actions.",
      "Dynamic model selection and real-time frontend/backend communication.",
      "QR-based remote connectivity for cross-device interaction.",
    ],
  },
  {
    title: "AI Portfolio Assistant",
    tech: ["Python", "Flask", "RAG", "Whisper"],
    points: [
      "Real-time voice and text interaction assistant.",
      "RAG pipeline for document ingestion, semantic retrieval, and contextual response generation.",
      "Streaming responses and conversational querying through Flask APIs.",
    ],
  },
  {
    title: "Stealth Multimodal Assistant",
    tech: ["Python", "FasterWhisper", "OCR", "WebSockets"],
    points: [
      "Background AI assistant combining real-time speech transcription with OCR-based screen understanding.",
      "VAD audio processing with real-time WebSocket streaming.",
      "Context-aware routing across multiple interaction modes.",
    ],
  },
  {
    title: "SlideNova — AI Presentation Generator",
    tech: ["Python", "Gemini API", "PyQt6"],
    points: [
      "Desktop app generating fully structured PowerPoint presentations from natural language prompts.",
      "Multiple slide themes, automated end-to-end generation workflow.",
      "Packaged and deployed for standalone desktop distribution.",
    ],
  },
];

function ParticleBackground() {
  const ref = useRef(null);
  const settings = useRef({ flow: 1, pull: 0.8, spread: 50 });

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 180);
    camera.position.z = 78;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    host.appendChild(renderer.domElement);

    // Particle field: 20,000+ points with reusable GPU buffers and shader-driven motion.
    const count = window.innerWidth < 700 ? 22000 : 36000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    const cyan = new THREE.Color("#4CE0FF");
    const violet = new THREE.Color("#8A5CFF");
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(1, count - 1);
      const angle = t * Math.PI * 2 * 7;
      const radius = 6 + 28 * Math.pow(t, 0.75);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.55;
      const z = (t - 0.5) * 70 + Math.sin(angle * 0.6) * 4;
      const k = i * 3;
      positions[k] = x;
      positions[k + 1] = y;
      positions[k + 2] = z;
      base[k] = x;
      base[k + 1] = y;
      base[k + 2] = z;
      tempColor.copy(cyan).lerp(violet, Math.abs(Math.sin(t * Math.PI * 3)));
      colors[k] = tempColor.r;
      colors[k + 1] = tempColor.g;
      colors[k + 2] = tempColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.7,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    // Reusable vectors keep allocations out of the animation loop.
    const elapsed = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = elapsed.getElapsedTime() * settings.current.flow;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      // One tight math-only update over 20k+ particles; no object creation inside the loop.
      for (let i = 0; i < count; i += 1) {
        const t = i / Math.max(1, count - 1);
        const phase = t * Math.PI * 2 * 7 + time * 0.8;
        const wave = Math.sin(phase + t * 24) * 1.9;
        const cursorPull = settings.current.pull * Math.exp(-t * 2.2);
        const k = i * 3;
        const bx = base[k];
        const by = base[k + 1];
        const bz = base[k + 2];
        const dx = pointer.x * settings.current.spread - bx;
        const dy = pointer.y * settings.current.spread * 0.6 - by;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const swirl = Math.sin(time * 0.6 + t * 32) * 1.5;
        positions[k] = bx + Math.cos(phase) * wave + (dx / dist) * cursorPull * 2.3;
        positions[k + 1] = by + Math.sin(phase * 0.9) * wave * 0.55 + (dy / dist) * cursorPull * 1.7;
        positions[k + 2] = bz + swirl;
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.z = Math.sin(time * 0.035) * 0.09;
      points.rotation.y = Math.sin(time * 0.022) * 0.08;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="particle-bg" aria-hidden="true" />;
}

function Game() {
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(20);
  const [target, setTarget] = useState({ left: 50, top: 50 });

  useEffect(() => {
    if (!active) return undefined;
    const interval = window.setInterval(() => {
      setTime((value) => {
        if (value <= 1) {
          setActive(false);
          setBest((current) => Math.max(current, score));
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [active, score]);

  const start = () => {
    setScore(0);
    setTime(20);
    setActive(true);
    setTarget({ left: 50 + Math.random() * 38 - 19, top: 50 + Math.random() * 38 - 19 });
  };

  const hit = () => {
    setScore((value) => value + 1);
    setTarget({ left: 10 + Math.random() * 80, top: 15 + Math.random() * 70 });
  };

  return (
    <div className="glass-card game-card">
      <div className="section-kicker"><Gamepad2 size={15} /> EASTER EGG · CATCH THE PARTICLE</div>
      <div className="game-top">
        <div><span>Score</span><strong>{score}</strong></div>
        <div><span>Best</span><strong>{best}</strong></div>
        <div><span>Time</span><strong>{time}s</strong></div>
      </div>
      <div className="game-board">
        {!active && (
          <div className="game-overlay">
            <span>20 seconds. One target at a time.</span>
            <button className="primary-btn" onClick={start}>{time === 0 ? "Play again" : "Start game"}</button>
          </div>
        )}
        {active && <button className="game-target" style={target} onClick={hit} aria-label="Catch particle" />}
      </div>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  return (
    <div className="site">
      <ParticleBackground />
      <div className="grid-overlay" />

      <header className="topbar glass-card">
        <button className="brand" onClick={() => scrollTo("home")}>
          <span className="brand-mark">SM</span>
          <span>Sweekar M</span>
        </button>
        <nav className={menu ? "nav-links open" : "nav-links"}>
          {["About", "Skills", "Experience", "Projects", "Education", "Contact"].map((item) => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase())}>{item}</button>
          ))}
        </nav>
        <button className="menu-btn" onClick={() => setMenu((value) => !value)}>{menu ? <X size={18} /> : <Code2 size={18} />}</button>
      </header>

      <main>
        <section id="home" className="hero shell">
          <div className="glass-card hero-card reveal">
            <div className="status-line"><span /> AI SOFTWARE ENGINEER · BENGALURU, KARNATAKA</div>
            <p className="hero-overline">SWEekar M</p>
            <h1>Building <span>AI systems</span><br />that actually ship.</h1>
            <p className="hero-role">AI Software Engineer | Backend Systems | Python | LLM &amp; RAG Engineering</p>
            <p className="hero-summary">AI-focused Software Engineer with hands-on experience building LLM-powered applications, Retrieval-Augmented Generation (RAG) pipelines, multi-agent workflows, and production backend systems in Python.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollTo("projects")}>Explore projects <ExternalLink size={16} /></button>
              <a className="ghost-btn" href="mailto:sweekar.m.work@gmail.com">sweekar.m.work@gmail.com <Mail size={16} /></a>
            </div>
            <div className="hero-stats">
              <div><strong>200+</strong><span>AI actions</span></div>
              <div><strong>10+</strong><span>backend modules</span></div>
              <div><strong>8.0</strong><span>BCA CGPA</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="shell section">
          <div className="section-head glass-card reveal"><span>01</span><div><h2>About</h2><p>AI engineering meets production software.</p></div></div>
          <div className="glass-card content-card reveal">
            <p>AI-focused Software Engineer with hands-on experience building LLM-powered applications, Retrieval-Augmented Generation (RAG) pipelines, multi-agent workflows, and production backend systems in Python. Experience includes backend architecture refactoring, asynchronous systems design, authentication and security hardening (JWT), and Prometheus-based observability instrumentation.</p>
            <p>Skilled in REST API design, WebSockets, containerized development workflows, and Machine Learning / Deep Learning frameworks (TensorFlow, PyTorch, Scikit-learn). Comfortable working in Linux environments and Git-based collaborative development. Seeking to apply AI and backend engineering skills to enterprise-scale systems and Hybrid Cloud AI solutions.</p>
          </div>
        </section>

        <section id="skills" className="shell section">
          <div className="section-head glass-card reveal"><span>02</span><div><h2>Technical Skills</h2><p>A practical stack for AI-native products and reliable APIs.</p></div></div>
          <div className="skill-grid">
            {Object.entries(skills).map(([group, items]) => (
              <div className="glass-card skill-card reveal" key={group}>
                <div className="skill-title"><Zap size={15} /> {group}</div>
                <div className="chips">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="shell section">
          <div className="section-head glass-card reveal"><span>03</span><div><h2>Professional Experience</h2><p>Production backend engineering, reliability, and observability.</p></div></div>
          <div className="glass-card timeline-card reveal">
            <div className="timeline-meta"><span>2026 — Present</span><b>Backend Engineer Intern</b><strong>CyberARC MSP / CarcMail</strong></div>
            <div className="timeline-tech">Python · FastAPI · Supabase (PostgreSQL) · JWT · Prometheus · asyncio · REST APIs</div>
            <div className="experience-points">
              <p>Refactored a monolithic backend into a feature-first, vertical-slice architecture spanning 10+ domain modules, improving maintainability and developer velocity.</p>
              <p>Improved backend reliability and API performance by optimizing authentication flows and asynchronous request handling.</p>
              <p>Implemented Prometheus-compatible observability metrics covering request volume, latency, error rates, and background service health.</p>
              <p>Validated and tested backend APIs, resolved merge conflicts in a collaborative Git workflow, and shipped production-ready features following engineering best practices.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="shell section">
          <div className="section-head glass-card reveal"><span>04</span><div><h2>Projects</h2><p>Systems built around real technical problems.</p></div></div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <button className="glass-card project-card reveal" key={project.title} onClick={() => setSelected(project)}>
                <div className="project-index">0{index + 1}</div>
                <div className="project-glow" />
                <h3>{project.title}</h3>
                <div className="chips">{project.tech.map((t) => <span key={t}>{t}</span>)}</div>
                <p>{project.points[0]}</p>
                <span className="project-link">Open details <ExternalLink size={15} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="shell section">
          <div className="section-head glass-card reveal"><span>05</span><div><h2>Playground</h2><p>A tiny interaction hidden inside the command center.</p></div></div>
          <Game />
        </section>

        <section id="education" className="shell section">
          <div className="section-head glass-card reveal"><span>06</span><div><h2>Education</h2><p>Formal foundation, hands-on practice.</p></div></div>
          <div className="education-grid">
            <div className="glass-card education-card reveal"><span>2025 — 2027 · PURSUING</span><h3>Master of Computer Applications (MCA)</h3><p>PES University</p></div>
            <div className="glass-card education-card reveal"><span>2022 — 2025 · CGPA 8.0</span><h3>Bachelor of Computer Applications (BCA)</h3><p>SDM College, Ujire</p></div>
          </div>
        </section>

        <section id="contact" className="shell section contact-section">
          <div className="glass-card contact-card reveal">
            <div><div className="status-line"><span /> 04 · CONTACT</div><h2>Let’s build something useful.</h2><p>Bengaluru, Karnataka</p></div>
            <div className="contact-actions">
              <a className="primary-btn" href="mailto:sweekar.m.work@gmail.com">Email <Mail size={17} /></a>
              <a className="icon-btn" href="https://github.com/Sweekar-m" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
              <a className="icon-btn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
          <footer>© {new Date().getFullYear()} Sweekar M <span>React · Three.js · AI engineering</span></footer>
        </section>
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="glass-card modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}><X size={18} /></button>
            <div className="status-line"><span /> PROJECT DETAILS</div>
            <h2>{selected.title}</h2>
            <div className="chips">{selected.tech.map((t) => <span key={t}>{t}</span>)}</div>
            <div className="modal-points">{selected.points.map((point) => <p key={point}>• {point}</p>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
