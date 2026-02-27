import React, { useState } from "react";
import { generateResponse } from "./api";
import ReactMarkdown from "react-markdown";

// ── Inline styles ──────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
    background: "#060608",
    minHeight: "100vh",
    color: "#e8e8e8",
    overflowX: "hidden",
  },

  /* ── HEADER ── */
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(6,6,8,0.82)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    padding: "0 40px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogo: {
    fontSize: 26,
    letterSpacing: 6,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: 700,
    textShadow: "0 0 24px rgba(138,90,245,0.7)",
  },
  headerNav: {
    display: "flex",
    gap: 32,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  headerNavLink: {
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Oswald', sans-serif",
  },

  /* ── HERO ── */
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "100px 24px 60px",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(138,90,245,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(138,90,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(138,90,245,0.06) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
    maskImage:
      "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
  },
  heroTag: {
    display: "inline-block",
    border: "1px solid rgba(138,90,245,0.45)",
    color: "#a47bff",
    fontSize: 11,
    letterSpacing: 5,
    textTransform: "uppercase",
    padding: "5px 18px",
    borderRadius: 2,
    marginBottom: 28,
    fontFamily: "'Oswald', sans-serif",
    background: "rgba(138,90,245,0.07)",
  },
  heroTitle: {
    fontSize: "clamp(48px, 8vw, 96px)",
    fontWeight: 700,
    letterSpacing: 8,
    lineHeight: 1,
    textTransform: "uppercase",
    margin: "0 0 16px",
    background: "linear-gradient(135deg, #ffffff 30%, #a47bff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    fontSize: 16,
    letterSpacing: 3,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    marginBottom: 0,
  },

  /* ── FEATURES STRIP ── */
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 1,
    background: "rgba(255,255,255,0.04)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    margin: "40px 0",
  },
  featureCard: {
    background: "#0a0a0e",
    padding: "36px 28px",
    borderRight: "1px solid rgba(255,255,255,0.04)",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    background: "linear-gradient(135deg, #3d1f8a, #6b3fd4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    boxShadow: "0 8px 24px rgba(107,63,212,0.35)",
    fontSize: 18,
  },
  featureTitle: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 8,
    fontFamily: "'Oswald', sans-serif",
  },
  featureDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.38)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    lineHeight: 1.6,
    letterSpacing: 0.5,
  },

  /* ── MAIN CARD ── */
  mainSection: {
    padding: "20px 24px 80px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background:
      "linear-gradient(145deg, #111116 0%, #0d0d12 50%, #0a0a0f 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
    padding: "48px 48px 40px",
    boxShadow:
      "0 0 0 1px rgba(138,90,245,0.08), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: "linear-gradient(90deg, transparent, #8a5af5, transparent)",
  },
  cardGlow: {
    position: "absolute",
    top: -60,
    left: "50%",
    transform: "translateX(-50%)",
    width: 300,
    height: 120,
    background:
      "radial-gradient(ellipse, rgba(138,90,245,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: "#a47bff",
    marginBottom: 6,
    fontFamily: "'Oswald', sans-serif",
  },
  cardHeading: {
    fontSize: 28,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 32,
    fontWeight: 700,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'Oswald', sans-serif",
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 3,
    color: "#e8e8e8",
    fontSize: 15,
    padding: "16px 18px",
    resize: "vertical",
    outline: "none",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    letterSpacing: 0.5,
    lineHeight: 1.7,
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    width: "100%",
    marginTop: 20,
    padding: "16px",
    background: "linear-gradient(135deg, #5a28d4 0%, #8a5af5 100%)",
    border: "none",
    borderRadius: 3,
    color: "#fff",
    fontSize: 13,
    letterSpacing: 5,
    textTransform: "uppercase",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s",
    boxShadow:
      "0 8px 32px rgba(138,90,245,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
  },

  /* ── RESULT ── */
  resultOuter: {
    marginTop: 32,
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 3,
    overflow: "hidden",
  },
  resultHeader: {
    padding: "10px 18px",
    background: "rgba(138,90,245,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  resultDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#8a5af5",
    boxShadow: "0 0 8px #8a5af5",
  },
  resultLabel: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'Oswald', sans-serif",
  },
  resultBody: {
    padding: "24px 20px",
    background: "rgba(255,255,255,0.015)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    fontSize: 15,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.3,
  },

  /* ── STATS ── */
  statsBar: {
    background: "rgba(138,90,245,0.06)",
    borderTop: "1px solid rgba(138,90,245,0.12)",
    borderBottom: "1px solid rgba(138,90,245,0.12)",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 24,
    padding: "32px 40px",
  },
  stat: { textAlign: "center" },
  statNum: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: 4,
    color: "#fff",
    textShadow: "0 0 20px rgba(138,90,245,0.5)",
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'Oswald', sans-serif",
    marginTop: 4,
  },

  /* ── HOW IT WORKS ── */
  howSection: {
    padding: "60px 40px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    maxWidth: 960,
    margin: "0 auto",
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: "#a47bff",
    marginBottom: 8,
    fontFamily: "'Oswald', sans-serif",
  },
  sectionHeading: {
    fontSize: "clamp(24px, 4vw, 42px)",
    letterSpacing: 5,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: 700,
    marginBottom: 48,
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 24,
  },
  step: {
    background: "#0d0d12",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 4,
    padding: "32px 24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  stepNum: {
    fontSize: 48,
    fontWeight: 700,
    color: "rgba(138,90,245,0.15)",
    lineHeight: 1,
    marginBottom: 16,
    letterSpacing: 2,
  },
  stepTitle: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 10,
    fontFamily: "'Oswald', sans-serif",
  },
  stepDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.38)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    lineHeight: 1.6,
  },

  /* ── TESTIMONIALS ── */
  testiSection: {
    padding: "60px 40px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  testiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    maxWidth: 1000,
    margin: "0 auto",
  },
  testiCard: {
    background: "#0d0d12",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 4,
    padding: "28px 24px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
  },
  testiText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    lineHeight: 1.7,
    marginBottom: 20,
    fontStyle: "italic",
  },
  testiAuthor: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#a47bff",
    fontFamily: "'Oswald', sans-serif",
  },

  /* ── FOOTER ── */
  footer: {
    background: "#060608",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    padding: "48px 40px 24px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 40,
    maxWidth: 1100,
    margin: "0 auto 40px",
  },
  footerBrand: {
    fontSize: 22,
    letterSpacing: 6,
    color: "#fff",
    fontWeight: 700,
    marginBottom: 12,
    textShadow: "0 0 16px rgba(138,90,245,0.5)",
  },
  footerTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.28)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    lineHeight: 1.6,
  },
  footerColTitle: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginBottom: 16,
    fontFamily: "'Oswald', sans-serif",
  },
  footerLinks: { listStyle: "none", padding: 0, margin: 0 },
  footerLink: {
    fontSize: 13,
    color: "rgba(255,255,255,0.28)",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    marginBottom: 10,
    cursor: "pointer",
  },
  footerBottom: {
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: 20,
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  footerCopy: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 2,
    fontFamily: "'Oswald', sans-serif",
  },
};

// ── ReactMarkdown custom renderers ───────────────────────────────────────────

const mdComponents = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: 22, letterSpacing: 3, color: "#fff", marginBottom: 12, fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700 }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: 18, letterSpacing: 3, color: "#c8aaff", marginBottom: 10, marginTop: 20, fontFamily: "'Bebas Neue', sans-serif" }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: 15, letterSpacing: 2, color: "#a47bff", marginBottom: 8, marginTop: 16, fontFamily: "'Oswald', sans-serif" }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ marginBottom: 12, lineHeight: 1.8, margin: "0 0 12px" }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6, color: "rgba(255,255,255,0.75)" }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "#d4b8ff", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "rgba(255,255,255,0.6)" }}>{children}</em>
  ),
  code: ({ children }) => (
    <code style={{ background: "rgba(138,90,245,0.15)", border: "1px solid rgba(138,90,245,0.2)", borderRadius: 3, padding: "1px 6px", fontSize: 13, color: "#c8aaff", fontFamily: "monospace" }}>
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: "3px solid #8a5af5", paddingLeft: 16, margin: "12px 0", color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "20px 0" }} />
  ),
};

// ── App ────────────────────────────────────────────────────────────────────────

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // ── MAIN LOGIC UNCHANGED ──
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

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@200;300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={styles.root}>

        {/* ────── HEADER ────── */}
        <header style={styles.header}>
          <span style={styles.headerLogo}>GiftGenix</span>
          <ul style={styles.headerNav}>
            {["Generate", "How It Works", "Features", "Docs"].map((n) => (
              <li key={n}>
                <a style={styles.headerNavLink}>{n}</a>
              </li>
            ))}
          </ul>
        </header>

        {/* ────── HERO ────── */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroGrid} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={styles.heroTag}>AI-Powered Gift Intelligence</div>
            <h1 style={styles.heroTitle}>GiftGenix</h1>
            <p style={styles.heroSub}>
              Precision-crafted gift recommendations, generated by AI
            </p>
          </div>
        </section>

        {/* ────── FEATURE STRIP ────── */}
        <div style={styles.features}>
          {[
            {
              icon: "◈",
              title: "Context Aware",
              desc: "Understands the person, occasion, and budget for precise results.",
            },
            {
              icon: "◆",
              title: "Instant Results",
              desc: "AI generates tailored ideas in seconds, not hours.",
            },
            {
              icon: "◇",
              title: "Deeply Personal",
              desc: "Beyond generic lists — specific, thoughtful, memorable gifts.",
            },
            {
              icon: "▣",
              title: "Any Occasion",
              desc: "Birthdays, weddings, holidays, anniversaries, and more.",
            },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ────── GENERATOR CARD ────── */}
        <section style={styles.mainSection}>
          <div style={styles.card}>
            <div style={styles.cardAccent} />
            <div style={styles.cardGlow} />

            <div style={styles.cardLabel}>Gift Generator</div>
            <div style={styles.cardHeading}>Describe Your Recipient</div>

            <div style={styles.labelRow}>
              <span style={styles.label}>Your Prompt</span>
              <span style={{ ...styles.label, color: "rgba(164,123,255,0.5)" }}>
                {prompt.length} chars
              </span>
            </div>

            <textarea
              rows={5}
              style={styles.textarea}
              placeholder="e.g. A 30-year-old woman who loves hiking, coffee, and photography. Budget around 50 USD. Birthday gift."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(138,90,245,0.5)";
                e.target.style.boxShadow = "0 0 0 3px rgba(138,90,245,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />

            <button
              style={{
                ...styles.button,
                ...(loading ? { opacity: 0.65, cursor: "not-allowed" } : {}),
              }}
              onClick={handleSubmit}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
            >
              {loading ? "Generating Ideas..." : "Generate Gift Ideas"}
            </button>

            {result && (
              <div style={styles.resultOuter}>
                <div style={styles.resultHeader}>
                  <div style={styles.resultDot} />
                  <span style={styles.resultLabel}>AI Response</span>
                </div>
                <div style={styles.resultBody}>
                  <ReactMarkdown components={mdComponents}>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ────── STATS ────── */}
        <div style={styles.statsBar}>
          {[
            { num: "10K+", label: "Gifts Generated" },
            { num: "98%", label: "Satisfaction Rate" },
            { num: "500+", label: "Occasions Covered" },
            { num: "< 3s", label: "Average Response" },
          ].map((s) => (
            <div key={s.label} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ────── HOW IT WORKS ────── */}
        <section style={styles.howSection}>
          <div style={styles.sectionLabel}>Process</div>
          <div style={styles.sectionHeading}>How It Works</div>
          <div style={styles.steps}>
            {[
              {
                n: "01",
                title: "Describe",
                desc: "Tell the AI about the recipient — their interests, personality, relationship, and budget.",
              },
              {
                n: "02",
                title: "Generate",
                desc: "Our language model analyzes context and produces curated, thoughtful gift recommendations.",
              },
              {
                n: "03",
                title: "Explore",
                desc: "Browse tailored suggestions with reasoning and purchase guidance for each idea.",
              },
              {
                n: "04",
                title: "Delight",
                desc: "Give a truly memorable gift — chosen with intelligence, not guesswork.",
              },
            ].map((s) => (
              <div key={s.n} style={styles.step}>
                <div style={styles.stepNum}>{s.n}</div>
                <div style={styles.stepTitle}>{s.title}</div>
                <div style={styles.stepDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ────── TESTIMONIALS ────── */}
        <section style={styles.testiSection}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={styles.sectionLabel}>What People Say</div>
            <div style={styles.sectionHeading}>Testimonials</div>
          </div>
          <div style={styles.testiGrid}>
            {[
              {
                text: "I used GiftGenix for my partner's birthday and the ideas were incredibly specific. It felt like the AI actually knew her.",
                author: "Priya M.",
              },
              {
                text: "Saved me hours of searching. The recommendations were thoughtful, budget-aware, and genuinely surprising.",
                author: "James R.",
              },
              {
                text: "Used it for corporate gifting. Clean, professional suggestions that impressed our clients.",
                author: "Aisha T.",
              },
            ].map((t) => (
              <div key={t.author} style={styles.testiCard}>
                <div style={styles.testiText}>"{t.text}"</div>
                <div style={styles.testiAuthor}>{t.author}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ────── FOOTER ────── */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerBrand}>GiftGenix</div>
              <div style={styles.footerTagline}>
                AI-powered gift recommendations engineered for precision,
                thoughtfulness, and delight.
              </div>
            </div>
            {[
              {
                title: "Product",
                links: ["Generator", "Features", "Pricing", "Changelog"],
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Examples", "Support"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Privacy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div style={styles.footerColTitle}>{col.title}</div>
                <ul style={styles.footerLinks}>
                  {col.links.map((l) => (
                    <li key={l} style={styles.footerLink}>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={styles.footerBottom}>
            <span style={styles.footerCopy}>
              2024 GiftGenix — All rights reserved
            </span>
            <span style={styles.footerCopy}>Built with AI</span>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;