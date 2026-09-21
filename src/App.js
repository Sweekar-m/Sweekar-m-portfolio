import React, { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Bot, Code2, Github, Linkedin, Mail, Moon, Rocket, Sparkles, Sun, Terminal, X } from 'lucide-react';
import './App.css';

const projects = [
  ['01','Knowledge Base','LOCAL AI / RAG','Codebase-aware retrieval with vector search, BM25, AST chunking and persistent developer memory.',['Python','FAISS','SQLite','Tree-sitter'],'violet'],
  ['02','SoulOS','MULTI-LLM / DESKTOP','Desktop AI orchestration with model routing, tools, persistent sessions and 200+ categorized actions.',['Python','PyQt5','Flask','OpenRouter'],'cyan'],
  ['03','Stealth Assistant','MULTIMODAL AI','Background assistant combining live transcription, OCR screen understanding, VAD and WebSockets.',['Whisper','OCR','WebSockets'],'rose'],
  ['04','SlideNova','GEN-AI','Natural-language prompts into structured PowerPoint presentations with themes and automated generation.',['Python','Gemini','PyQt6'],'amber']
];
const skills=['Python','FastAPI','Flask','React','LLMs','RAG','LangGraph','PyTorch','OpenCV','PostgreSQL','Supabase','Docker'];
const phase=h=>h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'golden':'night';

function Scene(){
  const mx=useMotionValue(0),my=useMotionValue(0),rx=useSpring(useTransform(my,[-500,500],[10,-10]),{stiffness:80}),ry=useSpring(useTransform(mx,[-500,500],[-12,12]),{stiffness:80});
  return <motion.div className="scene" onMouseMove={e=>{mx.set(e.clientX-innerWidth/2);my.set(e.clientY-innerHeight/2)}} onMouseLeave={()=>{mx.set(0);my.set(0)}} style={{rotateX:rx,rotateY:ry}}>
    <div className="grid3d"/><div className="sun3d"/><div className="ring ring1"/><div className="ring ring2"/>
    <motion.div className="cube" animate={{rotateX:360,rotateY:360,rotateZ:180}} transition={{duration:22,repeat:Infinity,ease:'linear'}}><span/><span/><span/><span/><span/><span/></motion.div>
    {['LLM','RAG','API','AI','PYTHON','AGENTS'].map((x,i)=><motion.span key={x} className={'node n'+i} animate={{y:[0,-12,0],opacity:[.55,1,.55]}} transition={{duration:2+i*.35,repeat:Infinity}}>{x}</motion.span>)}
    <div className="core3d"><Bot size={42}/><small>BUILD / THINK / SHIP</small></div>
  </motion.div>
}

export default function App(){
  const [now,setNow]=useState(new Date()),[manual,setManual]=useState(null),[selected,setSelected]=useState(null),[menu,setMenu]=useState(false);
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(t)},[]);
  const auto=useMemo(()=>phase(now.getHours()),[now]),theme=manual||auto;
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
  return <div className="site">
    <header className="nav"><button className="brand" onClick={()=>go('top')}><b>SM</b><span>Sweekar M.</span></button><nav className={menu?'links open':'links'}>{['work','about','stack','contact'].map(x=><button key={x} onClick={()=>go(x)}>{x}</button>)}</nav><div className="navtools"><span className="time"><i/> {manual?manual==='day'?'LIGHT':'DARK':auto==='golden'?'GOLDEN HOUR':auto.toUpperCase()}</span><button className="circle" onClick={()=>setManual(manual==='day'?'night':'day')}>{manual==='day'?<Moon size={16}/>:<Sun size={16}/>}</button><button className="circle menu" onClick={()=>setMenu(!menu)}>{menu?<X size={16}/>:<Sparkles size={16}/>}</button></div></header>
    <main id="top">
      <section className="hero wrap"><div className="copy"><p className="eyebrow"><span/> AI SOFTWARE ENGINEER · BENGALURU</p><h1>I build software<br/>with a <em>brain.</em></h1><p className="lead">AI systems, developer tools and production backends — built from first principles and shipped for real.</p><div className="buttons"><button className="primary" onClick={()=>go('work')}>Enter the lab <ArrowUpRight size={18}/></button><a className="secondary" href="mailto:sweekar.m.work@gmail.com">Talk to me <Mail size={17}/></a></div><div className="numbers"><span><b>200+</b> AI actions</span><span><b>10+</b> backend modules</span><span><b>8.0</b> BCA CGPA</span></div></div><Scene/></section>
      <section className="ticker"><div><Sparkles size={15}/> CURRENTLY BUILDING <b>AI-native developer tooling</b></div><div><Rocket size={15}/> FOCUS <b>Agents · Retrieval · Systems</b></div><div><Terminal size={15}/> MODE <b>Ship it.</b></div></section>
      <section id="work" className="wrap section"><div className="heading"><small>01</small><div><h2>Things I’ve built.</h2><p>Not landing-page demos. Systems designed around a real technical problem.</p></div></div><div className="projects">{projects.map(([n,t,k,d,tags,a])=><motion.button key={t} className={'project '+a} whileHover={{y:-8,rotateX:2}} onClick={()=>setSelected({t,k,d,tags})}><span className="num">{n}</span><div className="projectshape"/><small>{k}</small><h3>{t}</h3><p>{d}</p><div className="tags">{tags.map(x=><span key={x}>{x}</span>)}</div></motion.button>)}</div></section>
      <section id="about" className="wrap section"><div className="about"><div className="heading"><small>02</small><div><h2>Engineer first.<br/>AI everywhere.</h2></div></div><p className="bigcopy">I work at the intersection of applied AI and serious software engineering — retrieval, model routing, APIs, auth, observability and modular architecture.</p><div className="experience"><div><small>2026 → NOW</small><b>Backend Engineer Intern</b><span>CyberARC MSP / CarcMail · Python · FastAPI · Supabase · JWT</span></div><div><small>2022 → 2025</small><b>Bachelor of Computer Applications</b><span>SDM College, Ujire · CGPA 8.0</span></div></div></div></section>
      <section id="stack" className="wrap section"><div className="heading"><small>03</small><div><h2>My toolbox.</h2><p>The technologies I reach for when something needs to actually work.</p></div></div><div className="skillcloud">{skills.map((x,i)=><motion.span key={x} whileHover={{scale:1.08,rotate:i%2?2:-2}}><Code2 size={14}/>{x}</motion.span>)}</div></section>
      <section id="contact" className="wrap contact"><div className="contactinner"><div><small>04 · OPEN TO BUILDING</small><h2>Have a weird problem?<br/><em>Good.</em></h2><p>Let’s make it a system.</p></div><div className="contactbuttons"><a className="primary invert" href="mailto:sweekar.m.work@gmail.com">Email me <Mail size={18}/></a><a className="circle dark" href="https://github.com/Sweekar-m" target="_blank" rel="noreferrer"><Github size={18}/></a><a className="circle dark" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={18}/></a></div></div><footer>© {now.getFullYear()} Sweekar M. <span>React · Framer Motion · curiosity</span></footer></section>
    </main>
    <AnimatePresence>{selected&&<motion.div className="modalbg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><motion.div className="modal" initial={{y:30,scale:.96}} animate={{y:0,scale:1}} onClick={e=>e.stopPropagation()}><button className="close circle" onClick={()=>setSelected(null)}><X size={17}/></button><small>{selected.k}</small><h2>{selected.t}</h2><p>{selected.d}</p><div className="tags">{selected.tags.map(x=><span key={x}>{x}</span>)}</div></motion.div></motion.div>}</AnimatePresence>
  </div>
}
