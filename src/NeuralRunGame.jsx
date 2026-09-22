import React, { useCallback, useEffect, useRef, useState } from "react";
import { Gamepad2, RotateCcw, Shield, Zap } from "lucide-react";

function spawnEnemy() {
  return { id: Math.random(), x: 8 + Math.random() * 84, y: -8, speed: 0.18 + Math.random() * 0.16, size: 3 + Math.random() * 2, kind: Math.random() > 0.72 ? "bug" : "data" };
}
function spawnOrb() { return { id: Math.random(), x: 10 + Math.random() * 80, y: -5, speed: 0.12 + Math.random() * 0.08 }; }

export default function NeuralRunGame() {
  const [running, setRunning] = useState(false), [score, setScore] = useState(0), [best, setBest] = useState(0);
  const [health, setHealth] = useState(100), [level, setLevel] = useState(1), [combo, setCombo] = useState(0);
  const [player, setPlayer] = useState(50), [enemies, setEnemies] = useState([]), [orbs, setOrbs] = useState([]);
  const [gameOver, setGameOver] = useState(false), [flash, setFlash] = useState(false);
  const keys = useRef({ left: false, right: false });
  const last = useRef(0), spawnClock = useRef(0), orbClock = useRef(0), scoreRef = useRef(0);

  const reset = useCallback(() => {
    scoreRef.current = 0; setScore(0); setHealth(100); setLevel(1); setCombo(0); setPlayer(50);
    setEnemies([]); setOrbs([]); setGameOver(false); setRunning(true); last.current = performance.now(); spawnClock.current = 0; orbClock.current = 0;
  }, []);

  useEffect(() => {
    const onKey = (e, down) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) { keys.current.left = down; e.preventDefault(); }
      if (["ArrowRight", "d", "D"].includes(e.key)) { keys.current.right = down; e.preventDefault(); }
      if ((e.key === " " || e.key === "Enter") && down && !running) reset();
    };
    const down = (e) => onKey(e, true), up = (e) => onKey(e, false);
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [reset, running]);

  useEffect(() => {
    if (!running) return undefined;
    let raf = 0;
    const loop = (now) => {
      const dt = Math.min(32, now - last.current), step = dt / 16.67;
      last.current = now;
      const difficulty = 1 + Math.floor(scoreRef.current / 250) * 0.22;
      setLevel(Math.min(12, 1 + Math.floor(scoreRef.current / 250)));
      setPlayer((p) => Math.max(8, Math.min(92, p + ((keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0)) * 1.7 * step)));
      spawnClock.current += dt; orbClock.current += dt;
      if (spawnClock.current > Math.max(260, 760 / difficulty)) { spawnClock.current = 0; setEnemies((v) => [...v.slice(-18), spawnEnemy()]); }
      if (orbClock.current > 1250) { orbClock.current = 0; setOrbs((v) => [...v.slice(-5), spawnOrb()]); }

      setEnemies((items) => {
        let hit = false; const next = [];
        for (const e of items) {
          const y = e.y + e.speed * difficulty * step;
          if (y > 84 && y < 96 && Math.abs(e.x - player) < 7) { hit = true; continue; }
          if (y <= 106) next.push({ ...e, y });
        }
        if (hit) { setHealth((h) => Math.max(0, h - 18)); setCombo(0); setFlash(true); window.setTimeout(() => setFlash(false), 120); }
        return next;
      });
      setOrbs((items) => {
        const next = [];
        for (const o of items) {
          const y = o.y + o.speed * step;
          if (y > 82 && y < 96 && Math.abs(o.x - player) < 8) { scoreRef.current += 50 + combo * 10; setScore(scoreRef.current); setCombo((c) => c + 1); continue; }
          if (y <= 106) next.push({ ...o, y });
        }
        return next;
      });
      if (health <= 0) { setRunning(false); setGameOver(true); setBest((b) => Math.max(b, scoreRef.current)); return; }
      scoreRef.current += dt * 0.035; setScore(Math.floor(scoreRef.current));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, player, health, combo]);

  const damage = flash ? " damage" : "";
  return <div className="glass-card neural-card">
    <div className="section-kicker"><Gamepad2 size={15} /> EASTER EGG · NEURAL RUN</div>
    <div className="neural-header">
      <div><span>SCORE</span><strong>{Math.floor(score)}</strong></div><div><span>BEST</span><strong>{best}</strong></div>
      <div><span>LEVEL</span><strong>{level}</strong></div><div><span>COMBO</span><strong>x{Math.max(1, combo)}</strong></div>
    </div>
    <div className={`neural-board${damage}`}>
      <div className="scanlines" /><div className="lane lane-a" /><div className="lane lane-b" /><div className="lane lane-c" />
      {orbs.map((o) => <div key={o.id} className="energy-orb" style={{ left: `${o.x}%`, top: `${o.y}%` }} />)}
      {enemies.map((e) => <div key={e.id} className={`enemy ${e.kind}`} style={{ left: `${e.x}%`, top: `${e.y}%`, width: `${e.size}%`, height: `${e.size}%` }}>{e.kind === "bug" ? "×" : ""}</div>)}
      <div className="drone" style={{ left: `${player}%` }}><div className="drone-core" /><div className="drone-wing left" /><div className="drone-wing right" /></div>
      {!running && <div className="neural-overlay"><div className="game-logo"><span>NEURAL</span> RUN</div><p>{gameOver ? "SYSTEM CRASHED · RUN IT BACK" : "DODGE THE BUGS · COLLECT ENERGY · SURVIVE"}</p><button className="primary-btn" onClick={reset}>{gameOver ? <><RotateCcw size={16} /> Restart</> : <><Zap size={16} /> Initialize</>}</button><small>← A / D → or arrow keys · mobile: use the controls below</small></div>}
      {running && <div className="health-wrap"><Shield size={13} /><div><i style={{ width: `${health}%` }} /></div><span>{health}%</span></div>}
    </div>
    <div className="mobile-controls">
      <button onPointerDown={() => { keys.current.left = true; }} onPointerUp={() => { keys.current.left = false; }} onPointerLeave={() => { keys.current.left = false; }}>←</button>
      <span>DRONE CONTROL</span>
      <button onPointerDown={() => { keys.current.right = true; }} onPointerUp={() => { keys.current.right = false; }} onPointerLeave={() => { keys.current.right = false; }}>→</button>
    </div>
  </div>;
}
