// services.tsx
import { useState, useEffect } from "react";
import Nav from "@/components/nav";
import { serviceLadder } from "@/data/curriculum";
import { useAuth } from "@/components/auth-provider";
import { TrendingUp, CheckCircle2, DollarSign, Lock, Layers } from "lucide-react";
import { Link } from "wouter";

const L1_COLOR = "#0d7c8a";
const L2_COLOR = "#e8820c";

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

export default function ServicesPage() {
  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<"1" | "2" | "both">("1");
  const isDark = useIsDarkMode();

  const licensed = user?.licensedLevels || [];
  const hasBasic = licensed.includes("accounting-basic") || licensed.includes("accounting-bundle");
  const hasAdvanced = licensed.includes("accounting-advanced") || licensed.includes("accounting-bundle");

  const THEME = activeLevel === "2" ? L2_COLOR : L1_COLOR;
  const THEME_ALPHA = activeLevel === "2" ? "rgba(232,130,12,0.08)" : "rgba(13,124,138,0.08)";
  const THEME_BORDER = activeLevel === "2" ? "rgba(232,130,12,0.15)" : "rgba(13,124,138,0.15)";

  const activeLevelNum = activeLevel === "both" ? "both" : parseInt(activeLevel);
  const filteredServices = serviceLadder.filter(
    (s) => activeLevel === "both" ? true : s.level === activeLevelNum || s.level === "both"
  );

  const levelLabel = activeLevel === "1"
    ? "Basic — AI Bookkeeping & Reporting Services"
    : activeLevel === "2"
      ? "Advanced — AI Finance Strategy & Governance Services"
      : "Full Service Suite — Basic + Advanced";

  // Light mode uses dark text, dark mode uses light text
  const headingColor = isDark ? "#ffffff" : "#1a1a1a";
  const mutedColor = isDark ? "#aaaaaa" : "#555555";
  const cardBg = isDark ? "rgba(22, 23, 30, 0.4)" : "#ffffff";
  const cardBorderLight = isDark ? `${THEME}22` : `${THEME}40`;
  const descriptionBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";
  const sectionBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";

  return (
    <div className="page-wrap">
      <Nav />
      <div className="inner-page">

        <div className="inner-page-header" style={{
          textAlign: "center", padding: "3rem 1.5rem",
          background: THEME_ALPHA,
          border: `1px solid ${THEME_BORDER}`,
          borderRadius: "24px", marginBottom: "3rem",
        }}>
          <span className="inner-page-badge" style={{ background: THEME, color: "white", fontWeight: 800 }}>
            {activeLevel === "1" ? "Level 1 Basic" : activeLevel === "2" ? "Level 2 Advanced" : "Full Suite"}
          </span>
          <h1 className="inner-page-title" style={{ fontSize: "2.5rem", marginTop: "1rem", color: headingColor }}>
            Service Ladder
          </h1>
          <p className="inner-page-desc" style={{ maxWidth: "600px", margin: "1rem auto 0", color: mutedColor }}>
            The services you can offer after completing the accounting course — priced, packaged, and ready to deploy with your AI skills.
          </p>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {(["1", "2", "both"] as const).map((lvl) => {
              const color = lvl === "2" ? L2_COLOR : L1_COLOR;
              const label = lvl === "1" ? "Basic Services" : lvl === "2" ? "Advanced Services" : "Full Suite";
              const active = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 20px", borderRadius: "50px", cursor: "pointer",
                    border: `1.5px solid ${active ? color : (isDark ? "#444" : "#ccc")}`,
                    background: active ? `${color}1a` : "transparent",
                    color: active ? color : mutedColor,
                    fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="services-section">
          <h2 className="services-section-title" style={{ display: "flex", alignItems: "center", gap: "10px", color: THEME }}>
            <TrendingUp size={20} /> {levelLabel}
          </h2>

          <div className="services-grid" style={{
            display: "grid", gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            marginTop: "2rem",
          }}>
            {filteredServices.map((tier, i) => {
              const color = tier.level === 2 ? L2_COLOR : tier.level === "both" ? "#7a5fc0" : L1_COLOR;
              const colorAlpha = tier.level === 2
                ? "rgba(232,130,12,0.1)"
                : tier.level === "both"
                  ? "rgba(122,95,192,0.1)"
                  : "rgba(13,124,138,0.1)";
              const levelTag = tier.level === 1
                ? "Basic"
                : tier.level === 2
                  ? "Advanced"
                  : "Basic + Advanced";

              return (
                <div key={i} className="service-card" style={{
                  background: cardBg,
                  backdropFilter: isDark ? "blur(10px)" : "none",
                  border: `1px solid ${cardBorderLight}`,
                  borderRadius: "20px",
                  padding: "2rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  position: "relative", overflow: "hidden",
                  boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    padding: "6px 14px",
                    background: colorAlpha,
                    borderBottomLeftRadius: "12px",
                    fontSize: "0.68rem", fontWeight: 900,
                    color: color, letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}>
                    Tier {tier.tier} · {levelTag}
                  </div>

                  <div className="service-card-header" style={{ marginBottom: "1.25rem", paddingRight: "60px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: headingColor, lineHeight: 1.3 }}>
                      {tier.name}
                    </h3>
                    <span style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "1.4rem", fontWeight: 900,
                      color: color, marginTop: "0.5rem",
                    }}>
                      <DollarSign size={16} />
                      {tier.price.replace("$", "")}
                    </span>
                  </div>

                  <div style={{
                    padding: "12px", background: descriptionBg,
                    borderRadius: "8px", borderLeft: `3px solid ${color}`,
                    marginBottom: "1.25rem",
                  }}>
                    <p style={{ fontSize: "0.88rem", color: mutedColor, margin: 0, lineHeight: 1.5 }}>
                      {tier.description}
                    </p>
                  </div>

                  <div style={{
                    fontSize: "0.72rem", fontWeight: 800, color: headingColor,
                    textTransform: "uppercase", marginBottom: "0.75rem",
                    letterSpacing: "0.05em",
                  }}>
                    What's included
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {tier.examples.map((ex, j) => (
                      <li key={j} style={{
                        display: "flex", alignItems: "flex-start", gap: "10px",
                        fontSize: "0.84rem", color: mutedColor, marginBottom: "10px",
                      }}>
                        <CheckCircle2 size={13} style={{ color, marginTop: "2px", flexShrink: 0 }} />
                        {ex}
                      </li>
                    ))}
                  </ul>

                  {tier.level !== "both" && (
                    <div style={{
                      marginTop: "1.25rem", padding: "8px 12px",
                      background: colorAlpha,
                      borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <Layers size={13} style={{ color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: mutedColor }}>
                        {tier.level === 1
                          ? "Unlocked after completing Basic track"
                          : "Unlocked after completing Advanced track"
                        }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: "4rem", padding: "2rem", background: sectionBg, borderRadius: "20px", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3 style={{ color: headingColor, fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                Ready to offer these services?
              </h3>
              <p style={{ color: mutedColor, fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Complete your track to build the skills, portfolio pieces, and confidence to deliver each service at a professional level. Every deliverable in the course is designed to become a real client output.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
              {!hasBasic && (
                <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L1_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  <Lock size={14} /> Unlock Basic Track
                </Link>
              )}
              {!hasAdvanced && (
                <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L2_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  <Lock size={14} /> Unlock Advanced Track
                </Link>
              )}
              {hasBasic && hasAdvanced && (
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L1_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  Continue Your Journey →
                </Link>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
