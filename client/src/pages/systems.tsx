// systems.tsx
import { useState, useEffect } from "react";
import Nav from "@/components/nav";
import { systemsSummaryL1, systemsSummaryL2, metricsToTrack, portfolioTargets } from "@/data/curriculum";
import { Layers, BarChart2, CheckCircle2, Settings, TrendingUp } from "lucide-react";

// Colors
const L1_COLOR = "#0d7c8a"; // Teal — Basic
const L2_COLOR = "#e8820c"; // Orange — Advanced

// Helper to detect dark mode
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(isDarkMode);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', check);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', check);
    };
  }, []);
  return isDark;
}

export default function SystemsPage() {
  const [activeLevel, setActiveLevel] = useState<"1" | "2">("1");
  const isDark = useIsDarkMode();

  // Choose the right systems summary based on active level
  const systemsSummary = activeLevel === "1" ? systemsSummaryL1 : systemsSummaryL2;
  const THEME = activeLevel === "1" ? L1_COLOR : L2_COLOR;
  const THEME_ALPHA = activeLevel === "1" ? "rgba(13,124,138,0.05)" : "rgba(232,130,12,0.05)";
  const THEME_BORDER = activeLevel === "1" ? "rgba(13,124,138,0.15)" : "rgba(232,130,12,0.15)";

  // Dynamic text colors
  const headingColor = isDark ? "white" : "#1a1a1a";
  const mutedColor = isDark ? "#aaa" : "#555";
  const cardBg = isDark ? "rgba(22, 23, 30, 0.4)" : "rgba(245, 245, 250, 0.8)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const sectionBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";

  return (
    <div className="page-wrap">
      <Nav />
      <div className="inner-page">
        <div className="inner-page-header" style={{ 
          textAlign: 'center', padding: '3rem 1.5rem', 
          background: THEME_ALPHA, 
          border: `1px solid ${THEME_BORDER}`, 
          borderRadius: '24px', marginBottom: '3rem'
        }}>
          <span className="inner-page-badge" style={{ background: THEME, color: 'white', fontWeight: 800 }}>
            Level {activeLevel} {activeLevel === "1" ? "Basic" : "Advanced"}
          </span>
          <h1 className="inner-page-title" style={{ fontSize: '2.5rem', marginTop: '1rem', color: headingColor }}>
            Foundational Systems
          </h1>
          <p className="inner-page-desc" style={{ maxWidth: '600px', margin: '1rem auto 0', color: mutedColor }}>
            The essential AI-powered workflows and standard operating procedures (SOPs) mastered in the {activeLevel === "1" ? "Basic" : "Advanced"} track.
          </p>

          {/* Level switcher */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => setActiveLevel("1")}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px', borderRadius: '50px',
                border: `1.5px solid ${activeLevel === "1" ? L1_COLOR : (isDark ? "#444" : "#ccc")}`,
                background: activeLevel === "1" ? `${L1_COLOR}1a` : 'transparent',
                color: activeLevel === "1" ? L1_COLOR : mutedColor,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: L1_COLOR }} />
              Level 1 · Basic
            </button>
            <button
              onClick={() => setActiveLevel("2")}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px', borderRadius: '50px',
                border: `1.5px solid ${activeLevel === "2" ? L2_COLOR : (isDark ? "#444" : "#ccc")}`,
                background: activeLevel === "2" ? `${L2_COLOR}1a` : 'transparent',
                color: activeLevel === "2" ? L2_COLOR : mutedColor,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: L2_COLOR }} />
              Level 2 · Advanced
            </button>
          </div>
        </div>

        <section className="services-section">
          <div className="systems-weeks-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {systemsSummary.map((ws, i) => (
              <div key={i} className="system-week-card" style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '20px', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: THEME }}>WEEK {ws.week}</span>
                <h3 style={{ color: headingColor, marginTop: '4px' }}>{ws.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  {ws.systems.map((s, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: mutedColor, marginBottom: '12px' }}>
                      <CheckCircle2 size={14} style={{ color: THEME, flexShrink: 0 }} /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics section stays the same but with light mode support */}
        <section className="services-section" style={{ marginTop: '4rem' }}>
          <div style={{ padding: '2rem', background: sectionBg, border: `1px solid ${cardBorder}`, borderRadius: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: THEME }}>
              <BarChart2 size={20}/> Key Performance Indicators
            </h2>
            <div className="metrics-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '2rem' }}>
              {metricsToTrack.map((m, i) => (
                <div key={i} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
                  <h4 style={{ fontSize: '0.9rem', color: headingColor, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={14} style={{ color: THEME }} /> {m.metric}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: mutedColor }}>{m.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Optional: Add portfolio targets section to show what you'll build */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ color: THEME, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} /> Portfolio Pieces You'll Create
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {portfolioTargets.filter(p => p.level === parseInt(activeLevel)).map((p, i) => (
              <div key={i} style={{ padding: '0.75rem', background: sectionBg, borderRadius: '8px', borderLeft: `3px solid ${THEME}` }}>
                <strong style={{ color: headingColor }}>{p.title}</strong>
                <span style={{ color: mutedColor, fontSize: '0.8rem', marginLeft: '12px' }}>— Week {p.week}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
