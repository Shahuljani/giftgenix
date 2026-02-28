import React, { useState, useEffect, useRef, useCallback } from "react";
import { generateResponse } from "./api";
import ReactMarkdown from "react-markdown";

/* ─── GLOBAL STYLES injected once ─────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #c9a84c;
    --gold-light: #f0d080;
    --gold-dim: rgba(201,168,76,0.18);
    --cream: #f5f0e8;
    --dark: #0c0a06;
    --dark2: #141209;
    --dark3: #1c1910;
    --ink: #2a2618;
    --mist: rgba(245,240,232,0.06);
    --mist2: rgba(245,240,232,0.12);
    --font-display: 'Playfair Display', serif;
    --font-mono: 'Space Mono', monospace;
    --font-body: 'Cormorant Garamond', serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--dark);
    color: var(--cream);
    font-family: var(--font-body);
    overflow-x: hidden;
    cursor: none;
  }

  .cursor-dot {
    position: fixed; top: 0; left: 0;
    width: 8px; height: 8px;
    background: var(--gold); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1px solid rgba(201,168,76,0.5); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, width 0.2s, height 0.2s, border-color 0.2s;
  }
  .cursor-ring.hovered { width: 56px; height: 56px; border-color: var(--gold); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }

  #bg-canvas {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0; pointer-events: none; opacity: 0.55;
  }

  .noise {
    position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .app-root { position: relative; z-index: 2; min-height: 100vh; }

  /* HEADER */
  .site-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 72px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; border-bottom: 1px solid rgba(201,168,76,0.1);
    background: rgba(12,10,6,0.8); backdrop-filter: blur(24px);
  }
  .header-logo {
    font-family: var(--font-display); font-size: 22px; font-weight: 900;
    letter-spacing: 0.15em; color: var(--cream); text-transform: uppercase; position: relative;
  }
  .header-logo span { color: var(--gold); }
  .header-logo::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
    height: 1px; background: linear-gradient(90deg, var(--gold), transparent);
  }
  .header-nav { display: flex; gap: 36px; list-style: none; align-items: center; }
  .header-nav a {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(245,240,232,0.4);
    text-decoration: none; cursor: none; transition: color 0.3s;
  }
  .header-nav a:hover { color: var(--gold); }
  .header-cta {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--dark); background: var(--gold);
    border: none; padding: 10px 24px; cursor: none;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    font-weight: 700; transition: background 0.3s;
  }
  .header-cta:hover { background: var(--gold-light); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 120px 24px 80px;
    position: relative; overflow: hidden;
  }
  .hero-eyebrow {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.5em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 32px;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .hero-title {
    font-family: var(--font-display); font-size: clamp(56px, 10vw, 130px);
    font-weight: 900; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: var(--cream); margin-bottom: 12px; opacity: 0; animation: fadeUp 0.9s 0.35s forwards;
  }
  .hero-title em {
    font-style: italic; color: transparent; -webkit-text-stroke: 1px var(--gold);
    display: block;
  }
  .hero-sub {
    font-family: var(--font-body); font-size: clamp(16px, 2vw, 20px);
    font-weight: 300; font-style: italic; color: rgba(245,240,232,0.45);
    letter-spacing: 0.05em; margin-bottom: 56px; max-width: 500px;
    opacity: 0; animation: fadeUp 0.9s 0.5s forwards;
  }
  .hero-badges {
    display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;
    margin-bottom: 64px; opacity: 0; animation: fadeUp 0.9s 0.65s forwards;
  }
  .hero-badge {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(245,240,232,0.5);
    border: 1px solid rgba(201,168,76,0.2); padding: 6px 16px;
    background: rgba(201,168,76,0.04);
  }
  .hero-scroll {
    position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeUp 0.9s 1s forwards;
  }
  .hero-scroll span {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.4em;
    text-transform: uppercase; color: rgba(245,240,232,0.25);
  }
  .scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  /* 3D GIFT BOX */
  .gift-3d-wrap {
    margin: 0 auto 48px; width: 160px; height: 160px; perspective: 600px;
    opacity: 0; animation: fadeUp 0.9s 0.4s forwards;
  }
  .gift-3d {
    width: 100%; height: 100%; position: relative;
    transform-style: preserve-3d; animation: rotateGift 8s linear infinite;
  }
  .gift-face {
    position: absolute; width: 120px; height: 120px;
    border: 1px solid rgba(201,168,76,0.3); background: rgba(201,168,76,0.04);
    backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
  }
  .gift-face::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(201,168,76,0.12); }
  .gift-face.front  { transform: translateZ(60px); }
  .gift-face.back   { transform: rotateY(180deg) translateZ(60px); }
  .gift-face.left   { transform: rotateY(-90deg) translateZ(60px); }
  .gift-face.right  { transform: rotateY(90deg) translateZ(60px); }
  .gift-face.top    { transform: rotateX(90deg) translateZ(60px); }
  .gift-face.bottom { transform: rotateX(-90deg) translateZ(60px); }
  .gift-ribbon-h {
    position: absolute; top: 50%; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: translateY(-50%);
  }
  .gift-ribbon-v {
    position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent); transform: translateX(-50%);
  }

  /* FEATURES */
  .features-section { padding: 80px 40px; border-top: 1px solid rgba(201,168,76,0.08); }
  .features-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2px;
  }
  .feature-tile {
    padding: 48px 36px; background: var(--dark2); border: 1px solid rgba(201,168,76,0.06);
    position: relative; overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.165,0.84,0.44,1), background 0.3s;
  }
  .feature-tile::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.4s;
  }
  .feature-tile:hover::before { opacity: 1; }
  .feature-tile:hover { transform: translateY(-4px); background: var(--dark3); }
  .feature-num {
    font-family: var(--font-display); font-size: 80px; font-weight: 900;
    color: rgba(201,168,76,0.06); line-height: 1; position: absolute;
    top: 16px; right: 20px; letter-spacing: -0.04em; user-select: none;
  }
  .feature-icon-3d { width: 56px; height: 56px; margin-bottom: 28px; position: relative; transform-style: preserve-3d; }
  .icon-cube {
    width: 40px; height: 40px; position: relative; transform-style: preserve-3d;
    transform: rotateX(20deg) rotateY(-30deg); transition: transform 0.5s ease;
  }
  .feature-tile:hover .icon-cube { transform: rotateX(30deg) rotateY(30deg); }
  .cube-face { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); }
  .cube-face.cf  { transform: translateZ(20px); }
  .cube-face.cb  { transform: rotateY(180deg) translateZ(20px); }
  .cube-face.cl  { transform: rotateY(-90deg) translateZ(20px); }
  .cube-face.cr  { transform: rotateY(90deg) translateZ(20px); }
  .cube-face.ct  { transform: rotateX(90deg) translateZ(20px); background: rgba(201,168,76,0.12); }
  .cube-face.cbo { transform: rotateX(-90deg) translateZ(20px); }
  .feature-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .feature-title-text { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--cream); margin-bottom: 14px; letter-spacing: 0.02em; }
  .feature-desc-text { font-family: var(--font-body); font-size: 16px; font-weight: 300; font-style: italic; color: rgba(245,240,232,0.38); line-height: 1.7; }

  /* GENERATOR */
  .generator-section { padding: 80px 24px 100px; display: flex; flex-direction: column; align-items: center; }
  .section-header { text-align: center; margin-bottom: 60px; }
  .section-eyebrow { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: clamp(36px, 5vw, 64px); font-weight: 900; color: var(--cream); text-transform: uppercase; letter-spacing: 0.04em; line-height: 0.95; }
  .section-title em { font-style: italic; color: var(--gold); }

  .generator-card-wrap { width: 100%; max-width: 760px; perspective: 1200px; }
  .generator-card {
    background: linear-gradient(145deg, #17140c 0%, #13110a 60%, #0f0d08 100%);
    border: 1px solid rgba(201,168,76,0.15); padding: 60px 60px 52px;
    position: relative; overflow: hidden; transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.165,0.84,0.44,1);
    box-shadow: 0 0 0 1px rgba(201,168,76,0.06), 0 40px 80px rgba(0,0,0,0.8), 0 80px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.12), inset 0 -1px 0 rgba(201,168,76,0.04);
  }
  .generator-card::before { content: ''; position: absolute; top: 16px; left: 16px; width: 32px; height: 32px; border-top: 1px solid rgba(201,168,76,0.4); border-left: 1px solid rgba(201,168,76,0.4); }
  .generator-card::after  { content: ''; position: absolute; bottom: 16px; right: 16px; width: 32px; height: 32px; border-bottom: 1px solid rgba(201,168,76,0.4); border-right: 1px solid rgba(201,168,76,0.4); }
  .card-top-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 10%, var(--gold) 50%, transparent 90%); opacity: 0.6; }
  .card-inner-glow { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 400px; height: 200px; background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%); pointer-events: none; }
  .card-watermark { position: absolute; bottom: 24px; right: 28px; font-family: var(--font-display); font-size: 80px; font-weight: 900; color: rgba(201,168,76,0.03); line-height: 1; user-select: none; letter-spacing: -0.04em; }
  .card-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; opacity: 0.8; }
  .card-heading { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--cream); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 40px; }

  .prompt-tabs { display: flex; margin-bottom: 24px; border: 1px solid rgba(201,168,76,0.12); }
  .prompt-tab { flex: 1; padding: 10px 16px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; background: transparent; border: none; border-right: 1px solid rgba(201,168,76,0.12); color: rgba(245,240,232,0.3); cursor: none; transition: all 0.3s; }
  .prompt-tab:last-child { border-right: none; }
  .prompt-tab.active { background: rgba(201,168,76,0.08); color: var(--gold); }

  .input-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .input-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(245,240,232,0.3); }
  .char-count { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; color: rgba(201,168,76,0.4); }

  .textarea-wrap { position: relative; }
  .prompt-textarea { width: 100%; background: rgba(245,240,232,0.02); border: 1px solid rgba(201,168,76,0.15); color: var(--cream); font-family: var(--font-body); font-size: 16px; font-weight: 300; font-style: italic; line-height: 1.8; padding: 20px 22px; resize: none; outline: none; transition: border-color 0.3s, box-shadow 0.3s; letter-spacing: 0.02em; }
  .prompt-textarea:focus { border-color: rgba(201,168,76,0.4); box-shadow: 0 0 0 3px rgba(201,168,76,0.06), 0 0 24px rgba(201,168,76,0.05); }
  .prompt-textarea::placeholder { color: rgba(245,240,232,0.2); }
  .textarea-scanner { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: 0; pointer-events: none; }

  .quick-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .quick-chip { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,232,0.35); border: 1px solid rgba(201,168,76,0.12); padding: 5px 12px; cursor: none; background: transparent; transition: all 0.2s; }
  .quick-chip:hover { background: rgba(201,168,76,0.07); color: var(--gold); border-color: rgba(201,168,76,0.3); }

  .submit-btn { width: 100%; margin-top: 28px; padding: 20px 32px; background: transparent; border: 1px solid var(--gold); color: var(--gold); font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.4em; text-transform: uppercase; cursor: none; position: relative; overflow: hidden; transition: color 0.4s; }
  .submit-btn::before { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-101%); transition: transform 0.4s cubic-bezier(0.165,0.84,0.44,1); }
  .submit-btn:hover::before { transform: translateX(0); }
  .submit-btn:hover { color: var(--dark); }
  .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .submit-btn span { position: relative; z-index: 1; }

  .loading-bar { height: 1px; background: rgba(201,168,76,0.15); margin-top: 20px; overflow: hidden; }
  .loading-fill { height: 100%; background: linear-gradient(90deg, transparent, var(--gold), transparent); animation: loadFill 1.4s ease-in-out infinite; }

  .result-outer { margin-top: 40px; border: 1px solid rgba(201,168,76,0.12); position: relative; overflow: hidden; animation: fadeUp 0.6s ease forwards; }
  .result-outer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: 0.5; }
  .result-header { display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: rgba(201,168,76,0.04); border-bottom: 1px solid rgba(201,168,76,0.08); }
  .result-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 10px var(--gold); animation: blink 2s ease-in-out infinite; }
  .result-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(245,240,232,0.35); }
  .result-body { padding: 32px 28px; background: rgba(245,240,232,0.01); font-family: var(--font-body); font-size: 17px; font-weight: 300; line-height: 1.85; color: rgba(245,240,232,0.8); letter-spacing: 0.02em; }

  /* STATS */
  .stats-section { border-top: 1px solid rgba(201,168,76,0.08); border-bottom: 1px solid rgba(201,168,76,0.08); padding: 60px 40px; background: rgba(201,168,76,0.025); }
  .stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 40px; text-align: center; }
  .stat-item { position: relative; }
  .stat-item::after { content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 1px; background: rgba(201,168,76,0.1); }
  .stat-item:last-child::after { display: none; }
  .stat-num { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); font-weight: 900; color: var(--cream); letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px; }
  .stat-num span { color: var(--gold); }
  .stat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(245,240,232,0.3); }

  /* HOW IT WORKS */
  .how-section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0; border: 1px solid rgba(201,168,76,0.08); margin-top: 60px; }
  .step-cell { padding: 48px 36px; border-right: 1px solid rgba(201,168,76,0.08); position: relative; overflow: hidden; transition: background 0.4s; }
  .step-cell:last-child { border-right: none; }
  .step-cell:hover { background: rgba(201,168,76,0.025); }
  .step-cell::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); opacity: 0; transition: opacity 0.4s; }
  .step-cell:hover::before { opacity: 0.4; }
  .step-index { font-family: var(--font-display); font-size: 72px; font-weight: 900; color: rgba(201,168,76,0.08); line-height: 1; margin-bottom: 24px; letter-spacing: -0.04em; transition: color 0.4s; }
  .step-cell:hover .step-index { color: rgba(201,168,76,0.15); }
  .step-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--cream); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; }
  .step-text { font-family: var(--font-body); font-size: 15px; font-weight: 300; font-style: italic; color: rgba(245,240,232,0.38); line-height: 1.7; }

  /* TESTIMONIALS */
  .testi-section { padding: 80px 40px 100px; border-top: 1px solid rgba(201,168,76,0.08); background: var(--dark2); }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; max-width: 1100px; margin: 60px auto 0; }
  .testi-card { background: var(--dark); border: 1px solid rgba(201,168,76,0.07); padding: 40px 36px; position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.165,0.84,0.44,1); }
  .testi-card::before { content: '"'; position: absolute; top: 16px; left: 24px; font-family: var(--font-display); font-size: 80px; color: rgba(201,168,76,0.06); line-height: 1; font-weight: 900; }
  .testi-card:hover { transform: translateY(-4px); }
  .testi-stars { display: flex; gap: 4px; margin-bottom: 20px; }
  .star { width: 10px; height: 10px; background: var(--gold); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); opacity: 0.8; }
  .testi-quote { font-family: var(--font-body); font-size: 17px; font-weight: 300; font-style: italic; color: rgba(245,240,232,0.55); line-height: 1.75; margin-bottom: 28px; }
  .testi-author { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .testi-role { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.2em; color: rgba(245,240,232,0.2); margin-top: 4px; }

  /* MARQUEE */
  .marquee-section { border-top: 1px solid rgba(201,168,76,0.08); border-bottom: 1px solid rgba(201,168,76,0.08); padding: 20px 0; overflow: hidden; background: rgba(201,168,76,0.02); }
  .marquee-track { display: flex; gap: 60px; animation: marquee 20s linear infinite; width: max-content; }
  .marquee-item { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(201,168,76,0.3); white-space: nowrap; display: flex; align-items: center; gap: 20px; }
  .marquee-item::after { content: ''; width: 4px; height: 4px; background: var(--gold); opacity: 0.4; transform: rotate(45deg); flex-shrink: 0; }

  /* FOOTER */
  .site-footer { background: #080604; border-top: 1px solid rgba(201,168,76,0.08); padding: 72px 48px 32px; }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-brand { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--cream); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
  .footer-brand span { color: var(--gold); }
  .footer-tagline { font-family: var(--font-body); font-size: 15px; font-weight: 300; font-style: italic; color: rgba(245,240,232,0.28); line-height: 1.7; max-width: 280px; }
  .footer-col-title { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(201,168,76,0.6); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(201,168,76,0.1); }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 12px; font-family: var(--font-body); font-size: 15px; font-weight: 300; color: rgba(245,240,232,0.3); cursor: none; transition: color 0.2s; }
  .footer-links li:hover { color: var(--gold); }
  .footer-bottom { border-top: 1px solid rgba(201,168,76,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(245,240,232,0.18); }

  /* MD */
  .md-body h1 { font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--cream); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px; }
  .md-body h2 { font-family: var(--font-display); font-size: 19px; color: var(--gold-light); margin: 24px 0 12px; letter-spacing: 0.04em; text-transform: uppercase; }
  .md-body h3 { font-family: var(--font-mono); font-size: 11px; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin: 20px 0 8px; }
  .md-body p { margin-bottom: 14px; }
  .md-body ul, .md-body ol { padding-left: 24px; margin-bottom: 14px; }
  .md-body li { margin-bottom: 8px; color: rgba(245,240,232,0.75); }
  .md-body strong { color: #d4c190; font-weight: 600; }
  .md-body em { color: rgba(245,240,232,0.6); }
  .md-body code { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.15); padding: 1px 6px; font-family: var(--font-mono); font-size: 12px; color: var(--gold-light); }
  .md-body blockquote { border-left: 2px solid var(--gold); padding-left: 16px; margin: 14px 0; font-style: italic; color: rgba(245,240,232,0.5); }
  .md-body hr { border: none; border-top: 1px solid rgba(201,168,76,0.12); margin: 20px 0; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes rotateGift { from { transform: rotateX(12deg) rotateY(0deg); } to { transform: rotateX(12deg) rotateY(360deg); } }
  @keyframes loadFill { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(100%); } }
  @keyframes scrollPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .site-header { padding: 0 20px; height: 60px; }
    .header-nav { display: none; }
    .hero { padding: 100px 20px 60px; }
    .generator-card { padding: 36px 24px 32px; }
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .features-section { padding: 60px 20px; }
    .how-section { padding: 60px 20px; }
    .steps-grid { grid-template-columns: 1fr 1fr; }
    .testi-section { padding: 60px 20px; }
    .stats-section { padding: 40px 20px; }
    .site-footer { padding: 48px 20px 24px; }
    .step-cell:nth-child(2n) { border-right: none; }
    .stat-item::after { display: none; }
  }
  @media (max-width: 480px) {
    .steps-grid { grid-template-columns: 1fr; }
    .step-cell { border-right: none; border-bottom: 1px solid rgba(201,168,76,0.08); }
    .hero-title { letter-spacing: 0; }
    .generator-card { padding: 28px 18px; }
    .prompt-tabs { overflow-x: auto; }
  }
`;

/* ── ReactMarkdown renderers ── */
const mdComponents = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  p:  ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong>{children}</strong>,
  em:     ({ children }) => <em>{children}</em>,
  code:   ({ children }) => <code>{children}</code>,
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  hr: () => <hr />,
};

/* ── WebGL Background ── */
function BGCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; gl.viewport(0, 0, canvas.width, canvas.height); };
    resize();
    window.addEventListener("resize", resize);

    const vsrc = `attribute vec2 pos; void main() { gl_Position = vec4(pos, 0.0, 1.0); }`;
    const fsrc = `
      precision mediump float;
      uniform float time; uniform vec2 res;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      void main() {
        vec2 p = (gl_FragCoord.xy - res*0.5) / min(res.x, res.y);
        vec2 uv = gl_FragCoord.xy / res;
        float t = time * 0.18;
        float n = noise(p*2.8+t*0.5)*0.5 + noise(p*5.2-t*0.3)*0.25 + noise(p*11.0+t*0.7)*0.125;
        float r = length(p);
        float glow = exp(-r*2.2)*0.15;
        vec3 gold = vec3(0.79,0.67,0.30); vec3 dark = vec3(0.047,0.039,0.024);
        vec3 col = mix(dark, gold, n*0.22+glow);
        col += gold*(1.0-smoothstep(0.0,0.4,r))*0.06;
        float grid = step(0.98, fract(uv.x*22.0)) + step(0.98, fract(uv.y*14.0));
        col += vec3(0.8,0.67,0.3)*grid*0.04;
        gl_FragColor = vec4(col, 1.0);
      }
    `;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "pos");
    const timeLoc = gl.getUniformLocation(prog, "time");
    const resLoc = gl.getUniformLocation(prog, "res");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    let raf;
    const draw = (t) => { gl.uniform1f(timeLoc, t*0.001); gl.uniform2f(resLoc, canvas.width, canvas.height); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); raf = requestAnimationFrame(draw); };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas id="bg-canvas" ref={ref} />;
}

/* ── Cursor ── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring  = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (dotRef.current) { dotRef.current.style.left = mouse.current.x+"px"; dotRef.current.style.top = mouse.current.y+"px"; }
      if (ringRef.current) { ringRef.current.style.left = ring.current.x+"px"; ringRef.current.style.top = ring.current.y+"px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  return (<><div className="cursor-dot" ref={dotRef} /><div className="cursor-ring" ref={ringRef} /></>);
}

/* ── Gift 3D Box ── */
function GiftBox3D() {
  return (
    <div className="gift-3d-wrap">
      <div className="gift-3d">
        {["front","back","left","right","top","bottom"].map(f => (
          <div key={f} className={`gift-face ${f}`}>
            <div className="gift-ribbon-h" /><div className="gift-ribbon-v" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Icon Cube ── */
function IconCube() {
  return (
    <div className="feature-icon-3d">
      <div className="icon-cube">
        {["cf","cb","cl","cr","ct","cbo"].map(f => <div key={f} className={`cube-face ${f}`} />)}
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const cardRef = useRef(null);

  const tabs  = ["Describe Recipient", "Set Occasion", "Set Budget"];
  const chips = ["Birthday", "Wedding", "Anniversary", "Corporate", "Holiday", "Graduation", "Romantic", "Kids"];

  /* ── MAIN LOGIC UNCHANGED ── */
  const handleSubmit = async () => {
    if (!prompt) return alert("Enter a prompt");
    setLoading(true); setResult("");
    try {
      const res = await generateResponse({ prompt });
      setResult(res.data.result || res.data.error);
    } catch { setResult("Server error."); }
    setLoading(false);
  };

  /* 3D card tilt */
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width/2)) / (rect.width/2);
    const dy = (e.clientY - (rect.top + rect.height/2)) / (rect.height/2);
    card.style.transform = `rotateY(${dx*4}deg) rotateX(${-dy*3}deg)`;
  }, []);
  const handleMouseLeave = useCallback(() => { if (cardRef.current) cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)"; }, []);

  const appendChip = (chip) => setPrompt(p => p ? `${p}, ${chip}` : chip);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <BGCanvas />
      <div className="noise" />
      <Cursor />

      <div className="app-root">

        {/* HEADER */}
        <header className="site-header">
          <div className="header-logo">Gift<span>Genix</span></div>
          <ul className="header-nav">
            {["Generate","How It Works","Features","Docs"].map(n => <li key={n}><a>{n}</a></li>)}
          </ul>
          <button className="header-cta">Try Free</button>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">AI-Powered Gift Intelligence</div>
          <GiftBox3D />
          <h1 className="hero-title">Gift<em>Genix</em></h1>
          <p className="hero-sub">Precision-crafted gift recommendations, generated by artificial intelligence</p>
          <div className="hero-badges">
            {["Context-Aware AI","Instant Results","Any Occasion","Budget-Sensitive"].map(b => <span key={b} className="hero-badge">{b}</span>)}
          </div>
          <div className="hero-scroll"><span>Scroll</span><div className="scroll-line" /></div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-section">
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, ri) =>
              ["Birthday Gifts","Wedding Ideas","Anniversary Surprises","Corporate Gifting","Holiday Presents","Graduation Gifts","Romantic Gestures","Personalized Picks"].map(t => (
                <span key={`${t}-${ri}`} className="marquee-item">{t}</span>
              ))
            )}
          </div>
        </div>

        {/* FEATURES */}
        <section className="features-section">
          <div className="features-inner">
            {[
              { label: "Intelligence", title: "Context Aware",  desc: "Understands the person, occasion, and budget for precision-grade results every time." },
              { label: "Speed",        title: "Instant Output", desc: "AI generates tailored, thoughtful ideas in seconds — not hours of browsing." },
              { label: "Depth",        title: "Deeply Personal",desc: "Beyond generic lists. Specific, memorable, and emotionally resonant gift ideas." },
              { label: "Versatility",  title: "Any Occasion",  desc: "Birthdays, weddings, holidays, anniversaries, corporate events and beyond." },
            ].map((f, i) => (
              <div key={f.title} className="feature-tile">
                <div className="feature-num">{String(i+1).padStart(2,"0")}</div>
                <IconCube />
                <div className="feature-label">{f.label}</div>
                <div className="feature-title-text">{f.title}</div>
                <div className="feature-desc-text">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GENERATOR */}
        <section className="generator-section">
          <div className="section-header">
            <div className="section-eyebrow">Gift Generator</div>
            <h2 className="section-title">Describe Your<br /><em>Recipient</em></h2>
          </div>
          <div className="generator-card-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="generator-card" ref={cardRef}>
              <div className="card-top-line" />
              <div className="card-inner-glow" />
              <div className="card-watermark">GG</div>
              <div className="card-label">Gift Generator</div>
              <div className="card-heading">Craft Your Request</div>

              <div className="prompt-tabs">
                {tabs.map((t, i) => (
                  <button key={t} className={`prompt-tab${activeTab===i?" active":""}`} onClick={() => setActiveTab(i)}>{t}</button>
                ))}
              </div>

              <div className="input-meta">
                <span className="input-label">Your Prompt</span>
                <span className="char-count">{prompt.length} chars</span>
              </div>
              <div className="textarea-wrap">
                <textarea
                  className="prompt-textarea" rows={5}
                  placeholder="e.g. A 30-year-old woman who loves hiking, coffee, and photography. Budget around $50. Birthday gift."
                  value={prompt} onChange={e => setPrompt(e.target.value)}
                />
                <div className="textarea-scanner" />
              </div>

              <div className="quick-chips">
                {chips.map(c => <button key={c} className="quick-chip" onClick={() => appendChip(c)}>{c}</button>)}
              </div>

              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                <span>{loading ? "Generating Ideas..." : "Generate Gift Ideas"}</span>
              </button>

              {loading && <div className="loading-bar"><div className="loading-fill" /></div>}

              {result && (
                <div className="result-outer">
                  <div className="result-header">
                    <div className="result-dot" />
                    <span className="result-label">AI Response</span>
                  </div>
                  <div className="result-body md-body">
                    <ReactMarkdown components={mdComponents}>{result}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-section">
          <div className="stats-inner">
            {[
              { num: "10", suffix: "K+", label: "Gifts Generated" },
              { num: "98", suffix: "%",  label: "Satisfaction Rate" },
              { num: "500",suffix: "+",  label: "Occasions Covered" },
              { num: "< 3",suffix: "s",  label: "Average Response" },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div style={{ textAlign: "center" }}>
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title">How It <em>Works</em></h2>
          </div>
          <div className="steps-grid">
            {[
              { n: "01", name: "Describe",  text: "Tell the AI about the recipient — their interests, personality, relationship, and budget." },
              { n: "02", name: "Generate",  text: "Our language model analyzes context and produces curated, thoughtful gift recommendations." },
              { n: "03", name: "Explore",   text: "Browse tailored suggestions with reasoning and purchase guidance for each idea." },
              { n: "04", name: "Delight",   text: "Give a truly memorable gift — chosen with intelligence, not guesswork." },
            ].map(s => (
              <div key={s.n} className="step-cell">
                <div className="step-index">{s.n}</div>
                <div className="step-name">{s.name}</div>
                <div className="step-text">{s.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testi-section">
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="section-eyebrow">What People Say</div>
            <h2 className="section-title">Testimonials</h2>
          </div>
          <div className="testi-grid">
            {[
              { text: "I used GiftGenix for my partner's birthday and the ideas were incredibly specific. It felt like the AI actually knew her.", author: "Priya M.", role: "Product Designer" },
              { text: "Saved me hours of searching. The recommendations were thoughtful, budget-aware, and genuinely surprising.", author: "James R.", role: "Startup Founder" },
              { text: "Used it for corporate gifting. Clean, professional suggestions that impressed our clients.", author: "Aisha T.", role: "Marketing Director" },
            ].map(t => (
              <div key={t.author} className="testi-card">
                <div className="testi-stars">{[...Array(5)].map((_,i) => <div key={i} className="star" />)}</div>
                <div className="testi-quote">{t.text}</div>
                <div className="testi-author">{t.author}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">Gift<span>Genix</span></div>
                <div className="footer-tagline">AI-powered gift recommendations engineered for precision, thoughtfulness, and delight.</div>
              </div>
              {[
                { title: "Product",   links: ["Generator","Features","Pricing","Changelog"] },
                { title: "Resources", links: ["Documentation","API Reference","Examples","Support"] },
                { title: "Company",   links: ["About","Blog","Privacy","Terms"] },
              ].map(col => (
                <div key={col.title}>
                  <div className="footer-col-title">{col.title}</div>
                  <ul className="footer-links">{col.links.map(l => <li key={l}>{l}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="footer-bottom">
              <span className="footer-copy">2024 GiftGenix — All rights reserved</span>
              <span className="footer-copy">Built with AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}