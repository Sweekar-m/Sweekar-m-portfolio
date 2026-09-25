import React, { useState } from "react";
import { Github, Linkedin, Mail, ExternalLink, Menu, X, ArrowUpRight } from "lucide-react";
import FlappyBirdGame from "./FlappyBirdGame";
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
  { title: "Personal AI Developer Knowledge Base", service: "AI SYSTEMS", tech: ["Python", "SQLite", "Vector Search", "NVIDIA Nemotron API"], points: ["Local-first AI developer assistant indexing source code, docs, and persistent conversation history into a searchable knowledge base.", "Hybrid retrieval combining keyword search, semantic/vector search, and metadata filtering for codebase-aware Q&A.", "Context engine merges retrieved code, prior conversations, and project knowledge before LLM inference for cross-session continuity.", "Incremental indexing via file hashing and metadata skips unchanged files."] },
  { title: "SoulOS — Multi-LLM Desktop AI Assistant", service: "AI / AGENTS", tech: ["Python", "PyQt5", "Flask", "OpenRouter API"], points: ["Desktop AI assistant with multi-model routing, tool execution, and persistent session memory.", "Custom intent-routing pipeline handling 200+ categorized user actions.", "Dynamic model selection and real-time frontend/backend communication.", "QR-based remote connectivity for cross-device interaction."] },
  { title: "AI Portfolio Assistant", service: "RAG / VOICE", tech: ["Python", "Flask", "RAG", "Whisper"], points: ["Real-time voice and text interaction assistant.", "RAG pipeline for document ingestion, semantic retrieval, and contextual response generation.", "Streaming responses and conversational querying through Flask APIs."] },
  { title: "Stealth Multimodal Assistant", service: "MULTIMODAL AI", tech: ["Python", "FasterWhisper", "OCR", "WebSockets"], points: ["Background AI assistant combining real-time speech transcription with OCR-based screen understanding.", "VAD audio processing with real-time WebSocket streaming.", "Context-aware routing across multiple interaction modes."] },
  { title: "SlideNova — AI Presentation Generator", service: "GENERATIVE AI", tech: ["Python", "Gemini API", "PyQt6"], points: ["Desktop app generating fully structured PowerPoint presentations from natural language prompts.", "Multiple slide themes and automated end-to-end generation workflow.", "Packaged and deployed for standalone desktop distribution."] },
];

const sections = ["ABOUT", "SKILLS", "EXPERIENCE", "WORK", "PLAYGROUND", "EDUCATION", "CONTACT"];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (label) => {
    const id = label.toLowerCase();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site">
      <header className="nav">
        <button className="wordmark" onClick={() => scrollTo("home")} aria-label="Back to home">SWEEKAR M</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {sections.map((item) => (
            <button key={item} onClick={() => scrollTo(item)}>{item}</button>
          ))}
          <a className="contact-nav" href="mailto:sweekar.m.work@gmail.com">CONTACT</a>
        </nav>
        <button className="mobile-nav" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-art" aria-hidden="true">
            <div className="prism prism-red"><i /></div>
            <div className="prism prism-blue"><i /></div>
            <div className="prism prism-green"><i /></div>
            <div className="prism prism-white"><i /></div>
            <div className="prism prism-small"><i /></div>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">AI SOFTWARE ENGINEER · PYTHON · LLM SYSTEMS</p>
            <h1>Building<br /><span>AI systems</span><br />that ship.</h1>
            <p className="hero-lead">I build AI-native products, backend systems, and developer tools around LLMs, RAG, agents, and reliable Python infrastructure.</p>
            <div className="hero-links">
              <button className="text-link" onClick={() => scrollTo("work")}>VIEW WORK <ArrowUpRight size={15} /></button>
              <a className="text-link" href="mailto:sweekar.m.work@gmail.com">sweekar.m.work@gmail.com <Mail size={15} /></a>
            </div>
          </div>

          <div className="hero-meta">
            <span>SCROLL TO EXPLORE</span>
            <span>BASED IN BENGALURU, INDIA</span>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-intro">
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">ABOUT</p>
              <p className="section-note">AI engineering meets production software.</p>
            </div>
          </div>
          <div className="statement">I work at the intersection of <em>AI systems</em> and practical software engineering.</div>
          <div className="two-col-copy">
            <p>AI-focused Software Engineer with hands-on experience building LLM-powered applications, Retrieval-Augmented Generation (RAG) pipelines, multi-agent workflows, and production backend systems in Python.</p>
            <p>My work spans backend architecture refactoring, asynchronous systems, authentication and security hardening, observability, streaming responses, and data retrieval systems.</p>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-intro">
            <span className="section-number">02</span>
            <div>
              <p className="eyebrow">SKILLS</p>
              <p className="section-note">The tools I use to turn ideas into working systems.</p>
            </div>
          </div>
          <div className="skill-list">
            {Object.entries(skills).map(([group, items]) => (
              <div className="skill-row" key={group}>
                <span className="skill-label">{group}</span>
                <div className="skill-items">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-intro">
            <span className="section-number">03</span>
            <div>
              <p className="eyebrow">EXPERIENCE</p>
              <p className="section-note">Shipping backend systems and improving how teams build.</p>
            </div>
          </div>
          <div className="experience-row">
            <div className="experience-date">2026 — PRESENT</div>
            <div>
              <h2>Backend Engineer Intern</h2>
              <p className="experience-company">CyberARC MSP / CarcMail</p>
              <div className="experience-tech">PYTHON · FASTAPI · SUPABASE · JWT · PROMETHEUS · ASYNCIO</div>
              <div className="experience-points">
                <p>Refactored a monolithic backend into a feature-first, vertical-slice architecture spanning 10+ domain modules.</p>
                <p>Improved authentication reliability and asynchronous request handling across backend workflows.</p>
                <p>Implemented Prometheus-compatible observability metrics for request volume, latency, errors, and background service health.</p>
                <p>Validated backend APIs and shipped production-ready changes through collaborative Git workflows.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section work-section">
          <div className="section-intro">
            <span className="section-number">04</span>
            <div>
              <p className="eyebrow">SELECTED WORK</p>
              <p className="section-note">Systems built around real technical problems.</p>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <button className="project-row" key={project.title} onClick={() => setSelected(project)}>
                <span className="project-number">0{index + 1}</span>
                <div className="project-main">
                  <h2>{project.title}</h2>
                  <p>{project.points[0]}</p>
                </div>
                <div className="project-side">
                  <span>{project.service}</span>
                  <ArrowUpRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="playground" className="section playground-section">
          <div className="section-intro">
            <span className="section-number">05</span>
            <div>
              <p className="eyebrow">PLAYGROUND</p>
              <p className="section-note">A small interactive corner of the portfolio.</p>
            </div>
          </div>
          <FlappyBirdGame />
        </section>

        <section id="education" className="section">
          <div className="section-intro">
            <span className="section-number">06</span>
            <div>
              <p className="eyebrow">EDUCATION</p>
              <p className="section-note">Formal foundation, hands-on practice.</p>
            </div>
          </div>
          <div className="education-list">
            <div className="education-row"><span>2022 — 2025</span><div><h2>Bachelor of Computer Applications</h2><p>SDM College, Ujire · CGPA 8.0</p></div></div>
            <div className="education-row"><span>2025 — 2027</span><div><h2>Master of Computer Applications</h2><p>PES University</p></div></div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-hero">
            <p className="eyebrow">07 · CONTACT</p>
            <h2>Let’s build<br />something useful.</h2>
            <a href="mailto:sweekar.m.work@gmail.com">sweekar.m.work@gmail.com <ArrowUpRight size={20} /></a>
          </div>
          <div className="contact-footer">
            <span>© {new Date().getFullYear()} SWEEKAR M</span>
            <div>
              <a href="https://github.com/Sweekar-m" target="_blank" rel="noreferrer"><Github size={17} /> GITHUB</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LINKEDIN</a>
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            <p className="eyebrow">PROJECT DETAILS</p>
            <h2>{selected.title}</h2>
            <div className="modal-tech">{selected.tech.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="modal-points">{selected.points.map((point) => <p key={point}>{point}</p>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
