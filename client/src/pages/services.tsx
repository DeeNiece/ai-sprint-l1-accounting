// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: services.tsx  |  Repo: accounting
// Last updated: May 2026
//
// Service ladder page with level switcher (Basic / Advanced / Full Suite)
// Full dark/light mode support – uses useTheme() from theme-provider.
// Displays services from curriculum (serviceLadder) and adapts colours dynamically.

import { useState } from "react";
import Nav from "@/components/nav";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import { Link } from "wouter";
import { serviceLadder } from "@/data/curriculum";
import { TrendingUp, CheckCircle2, DollarSign, Lock, Layers } from "lucide-react";

// ── Level theme colours ─────────────────────────────────────────────────────
const L1_COLOR = "#0d7c8a";   // Basic track (teal)
const L2_COLOR = "#e8820c";   // Advanced track (orange/amber)

// ── Level configuration for tabs ───────────────────────────────────────────
const LEVEL_TABS = [
  { id: "1" as const, label: "Basic Services", color: L1_COLOR, level: 1 },
  { id: "2" as const, label: "Advanced Services", color: L2_COLOR, level: 2 },
  { id: "both" as const, label: "Full Suite", color: "#7a5fc0", level: "both" },
];

export default function ServicesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [activeLevel, setActiveLevel] = useState<"1" | "2" | "both">("1");

  const licensed = user?.licensedLevels || [];
  const hasBasic = licensed.includes("accounting-basic") || licensed.includes("accounting-bundle");
  const hasAdvanced = licensed.includes("accounting-advanced") || licensed.includes("accounting-bundle");

  // Filter services based on selected tab
  const filteredServices = serviceLadder.filter(
    (s) => activeLevel === "both" ? true : s.level === (activeLevel === "1" ? 1 : 2) || s.level === "both"
  );

  const activeTab = LEVEL_TABS.find(t => t.id === activeLevel)!;
  const THEME = activeTab.color;
  const THEME_ALPHA = isDark ? `${THEME}0f` : `${THEME}0a`;
  const THEME_BORDER = isDark ? `${THEME}2a` : `${THEME}30`;

  // Theme‑aware colours
  const pageBg       = isDark ? "#0a0a0c" : "#f8fafc";
  const textPrimary  = isDark ? "white" : "#1a1a2e";
  const textMuted    = isDark ? "#aaa" : "#4a5568";
  const cardBg       = isDark ? "rgba(22,23,30,0.4)" : "#ffffff";
  const cardBorder   = isDark ? `1px solid ${THEME_BORDER}` : `1px solid ${THEME}40`;
  const descriptionBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";
  const sectionBg    = isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";
  const buttonBorder  = isDark ? "#444" : "#ccc";

  // Helper to get colour for a service card based on its level
  const getCardColor = (level: number | "both") => {
    if (level === 2) return L2_COLOR;
    if (level === "both") return "#7a5fc0";
    return L1_COLOR;
  };

  const getCardBg = (level: number | "both") => {
    const color = getCardColor(level);
    return isDark ? `${color}0f` : `${color}08`;
  };

  const levelLabel = activeLevel === "1"
    ? "Basic — AI Bookkeeping & Reporting Services"
    : activeLevel === "2"
      ? "Advanced — AI Finance Strategy & Governance Services"
      : "Full Service Suite — Basic + Advanced";

  return (
    <div className="page-wrap" style={{ background: pageBg, minHeight: "100vh" }}>
      <Nav />
      <div className="inner-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* ── Header with level switcher ──────────────────────────────────── */}
        <div className="inner-page-header" style={{
          textAlign: "center", padding: "3rem 1.5rem",
          background: THEME_ALPHA,
          border: `1px solid ${THEME_BORDER}`,
          borderRadius: "24px", marginBottom: "3rem",
        }}>
          <span className="inner-page-badge" style={{ background: THEME, color: "white", fontWeight: 800, display: "inline-block", padding: "0.25rem 1rem", borderRadius: "20px" }}>
            {activeTab.label}
          </span>
          <h1 className="inner-page-title" style={{ fontSize: "2.5rem", marginTop: "1rem", color: textPrimary }}>
            Service Ladder
          </h1>
          <p className="inner-page-desc" style={{ maxWidth: "600px", margin: "1rem auto 0", color: textMuted }}>
            The services you can offer after completing the accounting course — priced, packaged, and ready to deploy with your AI skills.
          </p>

          {/* Level switcher buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {LEVEL_TABS.map((tab) => {
              const active = activeLevel === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLevel(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 20px", borderRadius: "50px", cursor: "pointer",
                    border: `1.5px solid ${active ? tab.color : buttonBorder}`,
                    background: active ? `${tab.color}1a` : "transparent",
                    color: active ? tab.color : textMuted,
                    fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: tab.color, flexShrink: 0 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Service cards ───────────────────────────────────────────────── */}
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
              const color = getCardColor(tier.level);
              const colorAlpha = getCardBg(tier.level);
              const levelTag = tier.level === 1
                ? "Basic"
                : tier.level === 2
                  ? "Advanced"
                  : "Basic + Advanced";

              return (
                <div key={i} className="service-card" style={{
                  background: cardBg,
                  backdropFilter: isDark ? "blur(10px)" : "none",
                  border: cardBorder,
                  borderRadius: "20px",
                  padding: "2rem",
                  transition: "transform 0.2s ease",
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
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: textPrimary, lineHeight: 1.3 }}>
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
                    <p style={{ fontSize: "0.88rem", color: textMuted, margin: 0, lineHeight: 1.5 }}>
                      {tier.description}
                    </p>
                  </div>

                  <div style={{
                    fontSize: "0.72rem", fontWeight: 800, color: textPrimary,
                    textTransform: "uppercase", marginBottom: "0.75rem",
                    letterSpacing: "0.05em",
                  }}>
                    What's included
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {tier.examples.map((ex, j) => (
                      <li key={j} style={{
                        display: "flex", alignItems: "flex-start", gap: "10px",
                        fontSize: "0.84rem", color: textMuted, marginBottom: "10px",
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
                      <span style={{ fontSize: "0.75rem", color: textMuted }}>
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

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <section style={{
          marginTop: "4rem", padding: "2rem", background: sectionBg,
          borderRadius: "20px", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3 style={{ color: textPrimary, fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                Ready to offer these services?
              </h3>
              <p style={{ color: textMuted, fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
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