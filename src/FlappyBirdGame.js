import React, { useEffect, useRef, useState } from "react";
import "./FlappyBirdGame.css";

const WIDTH = 760;
const HEIGHT = 340;
const BIRD_X = 150;
const BIRD_R = 14;
const GRAVITY = 0.42;
const FLAP = -7.2;
const PIPE_W = 62;
const GAP = 125;
const BEST_KEY = "sweekar-neural-flight-best";

const readBest = () => {
  try { return Number(localStorage.getItem(BEST_KEY) || 0); } catch { return 0; }
};
const saveBest = value => {
  try { localStorage.setItem(BEST_KEY, String(value)); } catch { /* storage may be unavailable */ }
};

export default function FlappyBirdGame() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const bestRef = useRef(readBest());
  const gameRef = useRef({ birdY: HEIGHT / 2, velocity: 0, pipes: [], score: 0, started: false, over: false, last: 0, speed: 2.7, trail: [] });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(bestRef.current);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);

  const reset = () => {
    gameRef.current = { birdY: HEIGHT / 2, velocity: 0, pipes: [{ x: WIDTH + 80, gapY: 145 + Math.random() * 75, passed: false }], score: 0, started: true, over: false, last: performance.now(), speed: 2.7, trail: [] };
    setScore(0); setOver(false); setStarted(true);
  };
  const flap = () => {
    const game = gameRef.current;
    if (!game.started || game.over) { reset(); return; }
    game.velocity = FLAP;
    for (let i = 0; i < 5; i += 1) game.trail.push({ x: BIRD_X - 10 - i * 7, y: game.birdY + (Math.random() - 0.5) * 8, life: 1 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = WIDTH * dpr; canvas.height = HEIGHT * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);
    const draw = now => {
      const game = gameRef.current; const dt = Math.min(2, (now - game.last) / 16.67 || 1); game.last = now;
      const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT); bg.addColorStop(0, "#070d20"); bg.addColorStop(1, "#090616"); ctx.fillStyle = bg; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.strokeStyle = "rgba(76,224,255,.055)"; ctx.lineWidth = 1;
      for (let x = 0; x < WIDTH; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke(); }
      for (let y = 0; y < HEIGHT; y += 38) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke(); }
      ctx.fillStyle = "rgba(76,224,255,.035)"; ctx.fillRect(0, (now * 0.035) % HEIGHT, WIDTH, 2);
      if (game.started && !game.over) {
        game.velocity += GRAVITY * dt; game.birdY += game.velocity * dt; game.speed = Math.min(5.4, 2.7 + game.score * 0.06); game.pipes.forEach(pipe => { pipe.x -= game.speed * dt; });
        if (game.pipes.length === 0 || game.pipes[game.pipes.length - 1].x < WIDTH - 250) game.pipes.push({ x: WIDTH + 35, gapY: 105 + Math.random() * 120, passed: false });
        game.pipes = game.pipes.filter(pipe => pipe.x > -PIPE_W - 20);
        for (const pipe of game.pipes) {
          if (!pipe.passed && pipe.x + PIPE_W < BIRD_X) { pipe.passed = true; game.score += 1; setScore(game.score); if (game.score > bestRef.current) { bestRef.current = game.score; setBest(game.score); saveBest(game.score); } }
          const hitX = BIRD_X + BIRD_R > pipe.x && BIRD_X - BIRD_R < pipe.x + PIPE_W;
          const hitY = game.birdY - BIRD_R < pipe.gapY - GAP / 2 || game.birdY + BIRD_R > pipe.gapY + GAP / 2;
          if (hitX && hitY) game.over = true;
        }
        if (game.birdY - BIRD_R < 0 || game.birdY + BIRD_R > HEIGHT) game.over = true;
        if (game.over) setOver(true);
      }
      game.trail = game.trail.filter(dot => dot.life > 0); game.trail.forEach(dot => { dot.x -= 1.2 * dt; dot.life -= 0.055 * dt; });
      game.trail.forEach(dot => { ctx.globalAlpha = Math.max(0, dot.life * 0.55); ctx.fillStyle = "#4CE0FF"; ctx.beginPath(); ctx.arc(dot.x, dot.y, 3 * dot.life, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
      for (const pipe of game.pipes) {
        const topH = pipe.gapY - GAP / 2; const bottomY = pipe.gapY + GAP / 2;
        const drawPipe = (x, y, h, capY) => { const grad = ctx.createLinearGradient(x, 0, x + PIPE_W, 0); grad.addColorStop(0, "#4CE0FF"); grad.addColorStop(.5, "#B9FBFF"); grad.addColorStop(1, "#8A5CFF"); ctx.fillStyle = grad; ctx.shadowBlur = 15; ctx.shadowColor = "#4CE0FF"; ctx.fillRect(x, y, PIPE_W, h); ctx.fillRect(x - 5, capY, PIPE_W + 10, 13); ctx.shadowBlur = 0; ctx.fillStyle = "rgba(5,7,13,.16)"; ctx.fillRect(x + 9, y, 6, h); };
        drawPipe(pipe.x, 0, topH, topH - 13); drawPipe(pipe.x, bottomY, HEIGHT - bottomY, bottomY);
      }
      ctx.save(); ctx.translate(BIRD_X, game.birdY); ctx.rotate(Math.max(-0.55, Math.min(1.05, game.velocity * 0.065))); ctx.shadowBlur = 22; ctx.shadowColor = "#4CE0FF";
      const birdGrad = ctx.createLinearGradient(-16, -16, 16, 16); birdGrad.addColorStop(0, "#B9FBFF"); birdGrad.addColorStop(.5, "#4CE0FF"); birdGrad.addColorStop(1, "#8A5CFF"); ctx.fillStyle = birdGrad; ctx.beginPath(); ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = "#05070D"; ctx.beginPath(); ctx.arc(6, -5, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#8A5CFF"; ctx.beginPath(); ctx.moveTo(12, 1); ctx.lineTo(24, 5); ctx.lineTo(12, 8); ctx.closePath(); ctx.fill(); ctx.restore();
      if (!game.started || game.over) { ctx.fillStyle = "rgba(5,7,13,.63)"; ctx.fillRect(0, 0, WIDTH, HEIGHT); ctx.textAlign = "center"; ctx.fillStyle = "#B9FBFF"; ctx.font = "800 30px Inter, system-ui, sans-serif"; ctx.fillText(game.over ? "RUN TERMINATED" : "NEURAL FLIGHT", WIDTH / 2, HEIGHT / 2 - 22); ctx.fillStyle = "#9AA4B2"; ctx.font = "500 12px Inter, system-ui, sans-serif"; ctx.fillText(game.over ? `Score ${game.score} · Tap or press SPACE to restart` : "Tap / click / SPACE to flap", WIDTH / 2, HEIGHT / 2 + 12); }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    const key = event => { if (event.code === "Space" || event.code === "ArrowUp") { event.preventDefault(); flap(); } };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); window.removeEventListener("keydown", key); };
  }, []);

  return <div className="glass-card flappy-card"><div className="section-kicker">NEURAL FLIGHT · FLAPPY MODE</div><div className="game-top"><div><span>Score</span><strong>{score}</strong></div><div><span>Best</span><strong>{best}</strong></div><div><span>Control</span><strong>SPACE / ↑</strong></div></div><button className="flappy-board" onClick={flap} aria-label="Play Neural Flight"><canvas ref={canvasRef} /></button><div className="game-hint">Tap, click, or press <b>SPACE</b> / <b>↑</b> to flap · Your best score is saved on this device.</div><button className="primary-btn game-start" onClick={started && !over ? flap : reset}>{started && !over ? "Flap" : over ? "Restart run" : "Start run"}</button></div>;
}
