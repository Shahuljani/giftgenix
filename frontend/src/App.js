import React, { useState, useEffect, useRef } from "react";
import { generateResponse } from "./api";
import ReactMarkdown from "react-markdown";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
    rel="stylesheet"
  />
);

/* ─── Global CSS injected once ─────────────────────────────────────────────── */
const GlobalCSS = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #03030a; overflow-x: hidden; }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #03030a; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c9a84c, #7b4f12); border-radius: 2px; }

      @keyframes rotateSlow { from { transform: rotateY(0deg) rotateX(10deg); } to { transform: rotateY(360deg) rotateX(10deg); } }
      @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
      @keyframes pulseGlow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      @keyframes shimmer { 0% { background-position: -400% 0; } 100% { background-position: 400% 0; } }
      @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
      @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
      @keyframes borderFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes crystalSpin {
        0% { transform: perspective(600px) rotateY(0deg) rotateX(15deg) rotateZ(5deg); }
        100% { transform: perspective(600px) rotateY(360deg) rotateX(15deg) rotateZ(5deg); }
      }
      @keyframes particleDrift {
        0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-100px) translateX(60px); opacity: 0; }
      }
      @keyframes holo {
        0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
        50% { background-position: 100% 50%; filter: hue-rotate(30deg); }
        100% { background-position: 0% 50%; filter: hue-rotate(0deg); }
      }
      @keyframes ringPulse {
        0%,100% { transform: scale(1); opacity:0.6; }
        50% { transform: scale(1.15); opacity:0.2; }
      }
      @keyframes dotBlink { 0%,80%,100% { opacity:0; } 40% { opacity:1; } }

      .nav-link {
        color: rgba(201,168,76,0.5);
        text-decoration: none;
        font-family: 'Rajdhani', sans-serif;
        font-size: 11px;
        letter-spacing: 3px;
        text-transform: uppercase;
        cursor: pointer;
        transition: color 0.3s, text-shadow 0.3s;
        position: relative;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px; left: 0;
        width: 0; height: 1px;
        background: linear-gradient(90deg, #c9a84c, #f0d080);
        transition: width 0.3s ease;
      }
      .nav-link:hover { color: #c9a84c; text-shadow: 0 0 20px rgba(201,168,76,0.6); }
      .nav-link:hover::after { width: 100%; }

      .feature-card-3d {
        background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
        border: 1px solid rgba(201,168,76,0.12);
        backdrop-filter: blur(20px);
        transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s;
        transform-style: preserve-3d;
        cursor: default;
      }
      .feature-card-3d:hover {
        transform: perspective(800px) rotateX(-5deg) rotateY(5deg) translateZ(20px);
        box-shadow: 20px 20px 60px rgba(0,0,0,0.7), -4px -4px 20px rgba(201,168,76,0.08), 0 0 40px rgba(201,168,76,0.05);
        border-color: rgba(201,168,76,0.3);
      }

      .stat-card {
        transition: transform 0.3s ease, box-shadow 0.3s;
      }
      .stat-card:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 30px 60px rgba(201,168,76,0.12);
      }

      .step-card {
        transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s;
        position: relative;
        overflow: hidden;
      }
      .step-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.4s;
      }
      .step-card:hover { transform: translateY(-12px); border-color: rgba(201,168,76,0.25); box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.06); }
      .step-card:hover::before { opacity: 1; }

      .testi-card {
        transition: transform 0.4s ease, border-color 0.3s, box-shadow 0.4s;
        position: relative; overflow: hidden;
      }
      .testi-card::after {
        content: '';
        position: absolute; top:0; left:-100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(201,168,76,0.04), transparent);
        transition: left 0.6s ease;
      }
      .testi-card:hover { transform: translateY(-6px); border-color: rgba(201,168,76,0.2); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
      .testi-card:hover::after { left: 100%; }

      .generate-btn {
        position: relative; overflow: hidden;
        transition: transform 0.2s, box-shadow 0.3s;
      }
      .generate-btn::before {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        transform: translateX(-100%);
        transition: transform 0.5s ease;
      }
      .generate-btn:hover:not(:disabled)::before { transform: translateX(100%); }
      .generate-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 16px 48px rgba(201,168,76,0.5), 0 0 80px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
      }
      .generate-btn:active:not(:disabled) { transform: translateY(0); }

      .prompt-textarea {
        transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
      }
      .prompt-textarea:focus {
        outline: none;
        border-color: rgba(201,168,76,0.4);
        box-shadow: 0 0 0 3px rgba(201,168,76,0.07), inset 0 2px 8px rgba(0,0,0,0.3);
        background: rgba(201,168,76,0.025);
      }

      .particle {
        position: fixed;
        width: 2px; height: 2px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
      }

      .scan-line {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 2px;
        background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
        animation: scanLine 8s linear infinite;
        pointer-events: none;
        z-index: 9999;
      }

      .result-content p { margin-bottom: 12px; line-height: 1.8; }
      .result-content ul { padding-left: 20px; margin-bottom: 12px; }
      .result-content li { margin-bottom: 8px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ─── 3D Crystal Gem SVG ─────────────────────────────────────────────────── */
const CrystalGem = ({ size = 120, style = {} }) => (
  <svg
    viewBox="0 0 200 220"
    width={size}
    height={size}
    style={{ filter: "drop-shadow(0 0 30px rgba(201,168,76,0.6)) drop-shadow(0 0 60px rgba(201,168,76,0.3))", ...style }}
  >
    <defs>
      <linearGradient id="gem-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5e19a" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#7b4f12" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gem-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3a2a08" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="gem-right" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f5e19a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#9a6f20" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="gem-bottom-left" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2a1a04" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="gem-bottom-right" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5e19a" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#4a2e08" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="gem-crown" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff9e0" stopOpacity="1" />
        <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.9" />
      </linearGradient>
      <filter id="gem-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Crown facets */}
    <polygon points="100,10 55,70 100,50" fill="url(#gem-crown)" />
    <polygon points="100,10 145,70 100,50" fill="url(#gem-right)" />
    <polygon points="100,10 55,70 30,55" fill="url(#gem-left)" />
    <polygon points="100,10 145,70 170,55" fill="url(#gem-top)" />
    <polygon points="30,55 55,70 100,50 70,45" fill="url(#gem-left)" opacity="0.8"/>
    <polygon points="170,55 145,70 100,50 130,45" fill="url(#gem-right)" opacity="0.8"/>
    {/* Girdle */}
    <polygon points="30,55 55,70 55,90 30,75" fill="url(#gem-left)" opacity="0.9"/>
    <polygon points="170,55 145,70 145,90 170,75" fill="url(#gem-right)" opacity="0.9"/>
    {/* Pavilion */}
    <polygon points="30,75 55,90 100,210" fill="url(#gem-bottom-left)" />
    <polygon points="170,75 145,90 100,210" fill="url(#gem-bottom-right)" />
    <polygon points="55,90 145,90 100,210" fill="url(#gem-top)" opacity="0.85" />
    {/* Table */}
    <polygon points="55,70 145,70 145,90 55,90" fill="url(#gem-top)" opacity="0.9" />
    {/* Highlight */}
    <polygon points="75,72 100,65 115,72 100,78" fill="rgba(255,250,220,0.85)" filter="url(#gem-glow)" />
    <ellipse cx="82" cy="74" rx="6" ry="3" fill="rgba(255,255,255,0.7)" />
  </svg>
);

/* ─── 3D Floating Orb ───────────────────────────────────────────────────────── */
const Orb = ({ x, y, size, delay, color }) => (
  <div style={{
    position: "absolute",
    left: x, top: y,
    width: size, height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, ${color}40, ${color}10 50%, transparent 70%)`,
    border: `1px solid ${color}25`,
    boxShadow: `0 0 ${size}px ${color}15, inset 0 0 ${size/2}px ${color}08`,
    animation: `floatY ${3 + delay}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: "none",
  }} />
);

/* ─── Animated Particles ─────────────────────────────────────────────────── */
const Particles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${8 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    size: `${1 + Math.random() * 2}px`,
    color: Math.random() > 0.5 ? "rgba(201,168,76,0.6)" : "rgba(240,208,128,0.4)",
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `particleDrift ${p.duration} ease-in infinite`,
            animationDelay: p.delay,
            boxShadow: `0 0 4px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── 3D Ring decoration ─────────────────────────────────────────────────── */
const Ring3D = ({ style = {} }) => (
  <div style={{
    width: 200, height: 200,
    borderRadius: "50%",
    border: "1px solid rgba(201,168,76,0.2)",
    boxShadow: "inset 0 0 30px rgba(201,168,76,0.05), 0 0 30px rgba(201,168,76,0.05)",
    animation: "ringPulse 4s ease-in-out infinite",
    position: "absolute",
    ...style,
  }}>
    <div style={{
      position: "absolute",
      inset: 15,
      borderRadius: "50%",
      border: "1px solid rgba(201,168,76,0.1)",
      animation: "ringPulse 4s ease-in-out infinite",
      animationDelay: "0.5s",
    }} />
  </div>
);

/* ─── Markdown Components ─────────────────────────────────────────────────── */
const mdComponents = {
  h1: ({ children }) => <h1 style={{ fontSize: 22, color: "#f0d080", marginBottom: 12, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: 2 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: 18, color: "#c9a84c", marginBottom: 10, marginTop: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: 15, color: "#d4b060", marginBottom: 8, marginTop: 16, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 2 }}>{children}</h3>,
  p: ({ children }) => <p style={{ marginBottom: 12, lineHeight: 1.8, color: "rgba(230,210,160,0.85)" }}>{children}</p>,
  ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 8, color: "rgba(230,210,160,0.8)" }}>{children}</li>,
  strong: ({ children }) => <strong style={{ color: "#f0d080", fontWeight: 600 }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: "rgba(201,168,76,0.8)" }}>{children}</em>,
  code: ({ children }) => <code style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, padding: "1px 6px", fontSize: 13, color: "#f0d080", fontFamily: "'Space Mono', monospace" }}>{children}</code>,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: "2px solid #c9a84c", paddingLeft: 16, margin: "12px 0", color: "rgba(201,168,76,0.7)", fontStyle: "italic" }}>{children}</blockquote>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(201,168,76,0.15)", margin: "20px 0" }} />,
};

/* ─── Main App ────────────────────────────────────────────────────────────── */
function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  /* ── MAIN LOGIC UNCHANGED ── */
  const handleSubmit = async () => {
    if (!prompt) return alert("Enter a prompt");
    setLoading(true);
    setResult("");
    try {
      const res = await generateResponse({ prompt });
      setResult(res.data.result || res.data.error);
    } catch (err) {
      setResult("Server error.");
    }
    setLoading(false);
  };

  /* Parallax on hero */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY, currentTarget } = e;
      const rect = document.documentElement.getBoundingClientRect();
      const xPct = (clientX / rect.width - 0.5) * 20;
      const yPct = (clientY / rect.height - 0.5) * 10;
      heroRef.current.style.transform = `perspective(1200px) rotateX(${-yPct * 0.3}deg) rotateY(${xPct * 0.2}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <FontLink />
      <GlobalCSS />

      {/* Scan line effect */}
      <div className="scan-line" />
      <Particles />

      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        background: "#03030a",
        minHeight: "100vh",
        color: "#e8e0c8",
        overflowX: "hidden",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ── HEADER ── */}
        <header style={{
          position: "sticky",
          top: 0, zIndex: 100,
          background: "rgba(3,3,10,0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          padding: "0 48px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Left ornament */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 28, height: 28, position: "relative" }}>
              <CrystalGem size={28} />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              letterSpacing: 8,
              color: "#c9a84c",
              fontWeight: 600,
              textShadow: "0 0 30px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)",
              background: "linear-gradient(135deg, #f5e19a, #c9a84c, #7b4f12)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>GIFTGENIX</span>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Decorative line */}
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3))", marginRight: 24 }} />
            {["Generate", "How It Works", "Features", "Docs"].map((n, i) => (
              <a key={n} className="nav-link" style={{ padding: "4px 16px" }}>{n}</a>
            ))}
          </div>
        </header>

        {/* ── HERO ── */}
        <section style={{
          position: "relative",
          textAlign: "center",
          padding: "110px 24px 80px",
          overflow: "hidden",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Layered atmospheric backgrounds */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 40% 60% at 20% 80%, rgba(120,80,20,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 40% 60% at 80% 80%, rgba(201,168,76,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
          }} />

          {/* Floating orbs */}
          <Orb x="8%" y="20%" size={180} delay={0} color="#c9a84c" />
          <Orb x="78%" y="15%" size={120} delay={1.5} color="#d4a84c" />
          <Orb x="60%" y="65%" size={80} delay={0.8} color="#f0d080" />
          <Orb x="12%" y="70%" size={100} delay={2} color="#c9a84c" />

          {/* Ring decorations */}
          <Ring3D style={{ left: "5%", top: "10%", width: 160, height: 160 }} />
          <Ring3D style={{ right: "8%", bottom: "15%", width: 120, height: 120, animationDelay: "2s" }} />

          {/* 3D Floating gem */}
          <div
            ref={heroRef}
            style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column",
              alignItems: "center",
              transformStyle: "preserve-3d",
              transition: "transform 0.1s ease-out",
              opacity: mounted ? 1 : 0,
              animation: mounted ? "fadeUp 1s ease forwards" : "none",
            }}
          >
            <div style={{
              animation: "floatY 4s ease-in-out infinite",
              marginBottom: 32,
              filter: "drop-shadow(0 40px 80px rgba(201,168,76,0.3))",
            }}>
              <CrystalGem size={140} />
            </div>

            {/* Overline tag */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#c9a84c",
              fontSize: 10,
              letterSpacing: 6,
              textTransform: "uppercase",
              padding: "6px 24px",
              borderRadius: 1,
              marginBottom: 32,
              fontFamily: "'Rajdhani', sans-serif",
              background: "rgba(201,168,76,0.04)",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ width: 20, height: 1, background: "rgba(201,168,76,0.5)" }} />
              AI-Powered Gift Intelligence
              <span style={{ width: 20, height: 1, background: "rgba(201,168,76,0.5)" }} />
            </div>

            {/* Hero title with 3D text shadow */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(56px, 10vw, 120px)",
              fontWeight: 700,
              letterSpacing: 12,
              lineHeight: 0.95,
              textTransform: "uppercase",
              margin: "0 0 20px",
              background: "linear-gradient(135deg, #fff9e8 0%, #f0d080 30%, #c9a84c 60%, #7b4f12 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 24px rgba(201,168,76,0.4))",
              textShadow: "none",
            }}>
              GiftGenix
            </h1>

            {/* Decorative rule */}
            <div style={{
              width: 180,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
              margin: "0 auto 20px",
            }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: 20,
              letterSpacing: 4,
              color: "rgba(201,168,76,0.55)",
              textTransform: "uppercase",
            }}>
              Precision-crafted gift recommendations, generated by AI
            </p>
          </div>
        </section>

        {/* ── FEATURE STRIP ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 1,
          background: "rgba(201,168,76,0.06)",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          margin: "0 0 0",
        }}>
          {[
            {
              icon: (
                <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                  <circle cx="20" cy="20" r="14" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5"/>
                  <circle cx="20" cy="20" r="8" stroke="rgba(201,168,76,0.6)" strokeWidth="1" strokeDasharray="3 3"/>
                  <circle cx="20" cy="20" r="3" fill="#c9a84c"/>
                  <line x1="20" y1="6" x2="20" y2="2" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5"/>
                  <line x1="20" y1="38" x2="20" y2="34" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5"/>
                  <line x1="6" y1="20" x2="2" y2="20" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5"/>
                  <line x1="38" y1="20" x2="34" y2="20" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5"/>
                </svg>
              ),
              title: "Context Aware",
              desc: "Understands the person, occasion, and budget for precise results.",
            },
            {
              icon: (
                <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                  <polygon points="20,4 24,16 37,16 27,24 31,37 20,29 9,37 13,24 3,16 16,16" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" fill="rgba(201,168,76,0.08)"/>
                </svg>
              ),
              title: "Instant Results",
              desc: "AI generates tailored ideas in seconds, not hours.",
            },
            {
              icon: (
                <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                  <path d="M20 8 L28 14 L28 26 L20 32 L12 26 L12 14 Z" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
                  <path d="M20 12 L25 16 L25 24 L20 28 L15 24 L15 16 Z" stroke="rgba(201,168,76,0.5)" strokeWidth="1" fill="rgba(201,168,76,0.08)"/>
                  <circle cx="20" cy="20" r="2" fill="#c9a84c"/>
                </svg>
              ),
              title: "Deeply Personal",
              desc: "Beyond generic lists — specific, thoughtful, memorable gifts.",
            },
            {
              icon: (
                <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                  <rect x="8" y="8" width="24" height="24" rx="2" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
                  <rect x="13" y="4" width="2" height="8" rx="1" fill="rgba(201,168,76,0.8)"/>
                  <rect x="25" y="4" width="2" height="8" rx="1" fill="rgba(201,168,76,0.8)"/>
                  <line x1="8" y1="16" x2="32" y2="16" stroke="rgba(201,168,76,0.4)" strokeWidth="1"/>
                  <rect x="12" y="20" width="5" height="5" rx="0.5" fill="rgba(201,168,76,0.6)"/>
                  <rect x="23" y="20" width="5" height="5" rx="0.5" fill="rgba(201,168,76,0.4)"/>
                </svg>
              ),
              title: "Any Occasion",
              desc: "Birthdays, weddings, holidays, anniversaries, and more.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card-3d" style={{
              background: "#07070f",
              padding: "40px 32px",
              borderRight: "1px solid rgba(201,168,76,0.06)",
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 4,
                background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                border: "1px solid rgba(201,168,76,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
                boxShadow: "0 8px 24px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)",
              }}>
                {f.icon}
              </div>
              <div style={{
                fontSize: 13, letterSpacing: 4, textTransform: "uppercase",
                color: "#c9a84c", marginBottom: 10, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              }}>{f.title}</div>
              <div style={{
                fontSize: 13, color: "rgba(201,168,76,0.4)",
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.7, letterSpacing: 0.5,
              }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── GENERATOR CARD ── */}
        <section style={{
          padding: "80px 24px 80px",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* Background glow behind card */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 800, height: 400,
            background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            width: "100%", maxWidth: 740,
            background: "linear-gradient(145deg, rgba(15,12,5,0.98) 0%, rgba(10,8,3,0.95) 100%)",
            border: "1px solid rgba(201,168,76,0.12)",
            borderRadius: 2,
            padding: "56px 56px 48px",
            boxShadow: "0 0 0 1px rgba(201,168,76,0.05), 0 60px 120px rgba(0,0,0,0.8), 0 0 80px rgba(201,168,76,0.04), inset 0 1px 0 rgba(201,168,76,0.08)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent line - animated */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent 0%, #7b4f12 20%, #c9a84c 50%, #f5e19a 60%, #c9a84c 75%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }} />
            {/* Corner ornaments */}
            <div style={{ position: "absolute", top: 16, left: 16, width: 16, height: 16, borderTop: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
            <div style={{ position: "absolute", top: 16, right: 16, width: 16, height: 16, borderTop: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, width: 16, height: 16, borderBottom: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
            <div style={{ position: "absolute", bottom: 16, right: 16, width: 16, height: 16, borderBottom: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />

            {/* Card inner glow */}
            <div style={{
              position: "absolute", top: -40, left: "50%",
              transform: "translateX(-50%)",
              width: 280, height: 100,
              background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              fontSize: 10, letterSpacing: 6, textTransform: "uppercase",
              color: "rgba(201,168,76,0.6)", marginBottom: 8,
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ width: 24, height: 1, background: "rgba(201,168,76,0.4)" }} />
              Gift Generator
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38, letterSpacing: 3, textTransform: "uppercase",
              color: "#e8d8a8", marginBottom: 40, fontWeight: 600,
              textShadow: "0 0 40px rgba(201,168,76,0.2)",
            }}>
              Describe Your Recipient
            </h2>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,168,76,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
                Your Prompt
              </span>
              <span style={{
                fontSize: 10, letterSpacing: 2,
                color: prompt.length > 0 ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.25)",
                fontFamily: "'Space Mono', monospace",
                transition: "color 0.3s",
              }}>
                {prompt.length} <span style={{ opacity: 0.5 }}>chars</span>
              </span>
            </div>

            <textarea
              rows={5}
              className="prompt-textarea"
              style={{
                width: "100%",
                background: "rgba(201,168,76,0.02)",
                border: "1px solid rgba(201,168,76,0.12)",
                borderRadius: 2,
                color: "rgba(230,210,160,0.9)",
                fontSize: 15,
                padding: "18px 20px",
                resize: "vertical",
                outline: "none",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: 0.5,
                lineHeight: 1.8,
                boxSizing: "border-box",
              }}
              placeholder="e.g. A 30-year-old woman who loves hiking, coffee, and photography. Budget around 50 USD. Birthday gift."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              className="generate-btn"
              style={{
                width: "100%",
                marginTop: 24,
                padding: "18px",
                background: loading
                  ? "rgba(201,168,76,0.2)"
                  : "linear-gradient(135deg, #7b4f12 0%, #c9a84c 50%, #f5e19a 100%)",
                border: loading ? "1px solid rgba(201,168,76,0.2)" : "none",
                borderRadius: 2,
                color: loading ? "rgba(201,168,76,0.5)" : "#1a0f00",
                fontSize: 12,
                letterSpacing: 6,
                textTransform: "uppercase",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 32px rgba(201,168,76,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  Generating
                  <span>
                    <span style={{ animation: "dotBlink 1.4s infinite", animationDelay: "0s" }}>.</span>
                    <span style={{ animation: "dotBlink 1.4s infinite", animationDelay: "0.2s" }}>.</span>
                    <span style={{ animation: "dotBlink 1.4s infinite", animationDelay: "0.4s" }}>.</span>
                  </span>
                </>
              ) : (
                <>
                  <CrystalGem size={16} style={{ filter: "none" }} />
                  Generate Gift Ideas
                </>
              )}
            </button>

            {result && (
              <div style={{
                marginTop: 36,
                border: "1px solid rgba(201,168,76,0.12)",
                borderRadius: 2,
                overflow: "hidden",
                animation: "fadeUp 0.5s ease",
              }}>
                <div style={{
                  padding: "12px 20px",
                  background: "rgba(201,168,76,0.05)",
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#c9a84c",
                    boxShadow: "0 0 12px #c9a84c, 0 0 24px rgba(201,168,76,0.5)",
                    animation: "pulseGlow 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontSize: 10, letterSpacing: 4, textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)", fontFamily: "'Rajdhani', sans-serif",
                  }}>AI Response</span>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: i === 0 ? "#c9a84c" : "rgba(201,168,76,0.2)",
                        opacity: 0.7,
                      }} />
                    ))}
                  </div>
                </div>
                <div className="result-content" style={{
                  padding: "28px 24px",
                  background: "rgba(201,168,76,0.015)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "rgba(230,210,160,0.85)",
                  letterSpacing: 0.3,
                }}>
                  <ReactMarkdown components={mdComponents}>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── STATS ── */}
        <div style={{
          background: "linear-gradient(90deg, rgba(201,168,76,0.04) 0%, rgba(201,168,76,0.07) 50%, rgba(201,168,76,0.04) 100%)",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 0,
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.03), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 4s linear infinite",
            pointerEvents: "none",
          }} />
          {[
            { num: "10K+", label: "Gifts Generated" },
            { num: "98%", label: "Satisfaction Rate" },
            { num: "500+", label: "Occasions Covered" },
            { num: "< 3s", label: "Average Response" },
          ].map((s, i) => (
            <div key={s.label} className="stat-card" style={{
              textAlign: "center",
              padding: "40px 48px",
              borderRight: i < 3 ? "1px solid rgba(201,168,76,0.08)" : "none",
              flex: "1 1 200px",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42, fontWeight: 700, letterSpacing: 2,
                color: "#c9a84c",
                textShadow: "0 0 30px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15)",
                marginBottom: 4,
              }}>{s.num}</div>
              <div style={{
                fontSize: 10, letterSpacing: 4, textTransform: "uppercase",
                color: "rgba(201,168,76,0.35)", fontFamily: "'Rajdhani', sans-serif",
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section style={{
          padding: "80px 48px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          maxWidth: 1100,
          margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#c9a84c", fontFamily: "'Rajdhani', sans-serif" }}>Process</div>
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            letterSpacing: 4, textTransform: "uppercase",
            color: "#e8d8a8", fontWeight: 700, marginBottom: 56,
          }}>How It Works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { n: "01", title: "Describe", desc: "Tell the AI about the recipient — their interests, personality, relationship, and budget." },
              { n: "02", title: "Generate", desc: "Our language model analyzes context and produces curated, thoughtful gift recommendations." },
              { n: "03", title: "Explore", desc: "Browse tailored suggestions with reasoning and purchase guidance for each idea." },
              { n: "04", title: "Delight", desc: "Give a truly memorable gift — chosen with intelligence, not guesswork." },
            ].map((s) => (
              <div key={s.n} className="step-card" style={{
                background: "linear-gradient(145deg, #090910, #060609)",
                border: "1px solid rgba(201,168,76,0.08)",
                borderRadius: 2,
                padding: "36px 28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 64, fontWeight: 700,
                  color: "rgba(201,168,76,0.08)",
                  lineHeight: 1, marginBottom: 20,
                  textShadow: "0 0 40px rgba(201,168,76,0.15)",
                }}>{s.n}</div>
                {/* Step indicator line */}
                <div style={{
                  width: 24, height: 2,
                  background: "linear-gradient(90deg, #c9a84c, transparent)",
                  marginBottom: 16,
                }} />
                <div style={{
                  fontSize: 14, letterSpacing: 4, textTransform: "uppercase",
                  color: "#d4b868", marginBottom: 12,
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                }}>{s.title}</div>
                <div style={{
                  fontSize: 14, color: "rgba(201,168,76,0.38)",
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.7,
                }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{
          padding: "60px 48px 80px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#c9a84c", fontFamily: "'Rajdhani', sans-serif" }}>What People Say</div>
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: 4,
              textTransform: "uppercase", color: "#e8d8a8", fontWeight: 700, marginBottom: 48,
            }}>Testimonials</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                { text: "I used GiftGenix for my partner's birthday and the ideas were incredibly specific. It felt like the AI actually knew her.", author: "Priya M." },
                { text: "Saved me hours of searching. The recommendations were thoughtful, budget-aware, and genuinely surprising.", author: "James R." },
                { text: "Used it for corporate gifting. Clean, professional suggestions that impressed our clients.", author: "Aisha T." },
              ].map((t, i) => (
                <div key={t.author} className="testi-card" style={{
                  background: "#07070e",
                  border: "1px solid rgba(201,168,76,0.07)",
                  borderRadius: 2,
                  padding: "32px 28px",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  position: "relative",
                }}>
                  {/* Quote mark */}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 80, lineHeight: 0.8,
                    color: "rgba(201,168,76,0.06)",
                    position: "absolute", top: 16, right: 20,
                    userSelect: "none",
                  }}>"</div>
                  <div style={{
                    fontSize: 15, color: "rgba(201,168,76,0.5)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic",
                    position: "relative", zIndex: 1,
                  }}>"{t.text}"</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
                      border: "1px solid rgba(201,168,76,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#c9a84c", fontFamily: "'Cormorant Garamond', serif",
                    }}>
                      {t.author[0]}
                    </div>
                    <div style={{
                      fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
                      color: "#c9a84c", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                    }}>{t.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: "#020208",
          borderTop: "1px solid rgba(201,168,76,0.08)",
          padding: "64px 48px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Footer top accent */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            maxWidth: 1100,
            margin: "0 auto 48px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CrystalGem size={32} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24, letterSpacing: 6, fontWeight: 700,
                  background: "linear-gradient(135deg, #f5e19a, #c9a84c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}>GiftGenix</span>
              </div>
              <div style={{
                fontSize: 14, color: "rgba(201,168,76,0.28)",
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.7, fontStyle: "italic",
              }}>
                AI-powered gift recommendations engineered for precision, thoughtfulness, and delight.
              </div>
              {/* Divider */}
              <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)", marginTop: 24 }} />
            </div>

            {[
              { title: "Product", links: ["Generator", "Features", "Pricing", "Changelog"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Examples", "Support"] },
              { title: "Company", links: ["About", "Blog", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{
                  fontSize: 10, letterSpacing: 4, textTransform: "uppercase",
                  color: "rgba(201,168,76,0.5)", marginBottom: 20,
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((l) => (
                    <li key={l} style={{
                      fontSize: 13, color: "rgba(201,168,76,0.25)",
                      fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                      marginBottom: 12, cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(201,168,76,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(201,168,76,0.25)"}
                    >{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid rgba(201,168,76,0.06)",
            paddingTop: 24,
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <span style={{ fontSize: 11, color: "rgba(201,168,76,0.2)", letterSpacing: 3, fontFamily: "'Rajdhani', sans-serif" }}>
              2024 GIFTGENIX — ALL RIGHTS RESERVED
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", boxShadow: "0 0 8px rgba(201,168,76,0.8)", animation: "pulseGlow 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(201,168,76,0.2)", letterSpacing: 3, fontFamily: "'Rajdhani', sans-serif" }}>BUILT WITH AI</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;