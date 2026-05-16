// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: systems.tsx  |  Repo: accounting
// Last updated: May 2026
//
// Systems page with level switcher (Basic / Advanced)
// Full dark/light mode support using useTheme().
// Displays systems summaries, metrics, and portfolio targets per level.

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import Nav from "@/components/nav";
import { useTheme } from "@/components/theme-provider";
import {
  systemsSummaryL1,
  systemsSummaryL2,
  metricsToTrackL1,
  metricsToTrackL2,
  portfolioTargetsL1,
  portfolioTargetsL2,
} from "@/data/curriculum";
import { Layers, BarChart2, CheckCircle2, Settings } from "lucide-react";

const L1_COLOR = "#0d7c8a";
const L2_COLOR = "#e8820c";

function hasAccess(user: any) {
  const levels = user?.licensedLevels || [];
  return levels.includes("bundle") || levels.includes("accounting-bundle") ||
         levels.includes("1") || levels.includes("2");
}

export default function SystemsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeLevel, setActiveLevel] = useState<"1" | "2">("1");

  if (user && !hasAccess(user)) return null;

  const systemsSummary   = activeLevel === "1" ? systemsSummaryL1  : systemsSummaryL2;
  const metricsToTrack   = activeLevel === "1" ? metricsToTrackL1  : metricsToTrackL2;
  const portfolioTargets = activeLevel === "1" ? portfolioTargetsL1 : portfolioTargetsL2;

  const PAGE_H1       = activeLevel === "1" ? "Foundational Systems"       : "Advanced Workflows";
  const PAGE_DESC     = activeLevel === "1"
    ? "The essential AI-powered workflows and SOPs mastered in the Basic track."
    : "The complex multi-step automations, client-facing SOPs, and advanced AI integrations built in the Advanced track.";
  const METRICS_LABEL = activeLevel === "1" ? "Key Performance Indicators" : "Efficiency Metrics";
  const METRICS_DESC  = activeLevel === "1"
    ? null
    : "KPIs that measure the optimization of your advanced AI accounting services.";
  const THEME = activeLevel === "1" ? L1_COLOR : L2_COLOR;
  const THEME_ALPHA = activeLevel === "1" ? "rgba(13,124,138,0.06)" : "rgba(232,130,12,0.06)";
  const THEME_BORDER = activeLevel === "1" ? "rgba(13,124,138,0.15)" : "rgba(232,130,12,0.15)";

  // Theme-aware colours
  const pageBg = isDark ? "#0a0a0c" : "#f8fafc";
  const textPrimary = isDark ? "white" : "#1a1a2e";
  const textMuted = isDark ? "#aaa" : "#4a5568";
  const cardBg = isDark ? "rgba(22,23,30,0.4)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const sectionBg = isDark ? "rgba(0,0,0,0.2)" : "#f1f5f9";

  return (
    <div className="page-wrap" style={{ background: pageBg, minHeight: "100vh" }}>
      <Nav />
      <div className="inner-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div
          className="inner-page-header"
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            background: THEME_ALPHA,
            border: `1px solid ${THEME_BORDER}`,
            borderRadius: "24px",
            marginBottom: "3rem",
          }}
        >
          <span
            className="inner-page-badge"
            style={{ background: THEME, color: "white", fontWeight: 800, display: "inline-block", padding: "0.25rem 1rem", borderRadius: "20px" }}
          >
            Level {activeLevel} {activeLevel === "1" ? "Basic" : "Advanced"}
          </span>
          <h1 className="inner-page-title" style={{ fontSize: "2.5rem", marginTop: "1rem", color: textPrimary }}>
            {PAGE_H1}
          </h1>
          <p className="inner-page-desc" style={{ maxWidth: "600px", margin: "1rem auto 0", color: textMuted }}>
            {PAGE_DESC}
          </p>

          {/* Level switcher */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {(["1", "2"] as const).map((lvl) => {
              const color = lvl === "1" ? L1_COLOR : L2_COLOR;
              const active = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 20px",
                    borderRadius: "50px",
                    cursor: "pointer",
                    border: `1.5px solid ${active ? color : (isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1")}`,
                    background: active ? `${color}1a` : "transparent",
                    color: active ? color : textMuted,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  Level {lvl} · {lvl === "1" ? "Basic" : "Advanced"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Systems grid */}
        <section className="services-section">
          <div
            className="systems-weeks-grid"
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {systemsSummary.map((ws, i) => (
              <div
                key={i}
                className="system-week-card"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "20px",
                  padding: "1.5rem",
                }}
              >
                <span style={{ fontSize: "0.7rem", fontWeight: 900, color: THEME, textTransform: "uppercase" }}>
                  WEEK {ws.week}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: textPrimary, marginTop: "4px", marginBottom: "1rem" }}>
                  {ws.title}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {ws.systems.map((s, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "0.85rem",
                        color: textMuted,
                        marginBottom: "12px",
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: THEME, flexShrink: 0, marginTop: "2px" }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics section */}
        <section className="services-section" style={{ marginTop: "4rem" }}>
          <div
            style={{
              padding: "2rem",
              background: sectionBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "24px",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: THEME,
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              <BarChart2 size={20} /> {METRICS_LABEL}
            </h2>
            {METRICS_DESC && (
              <p style={{ color: textMuted, fontSize: "0.9rem", marginBottom: "0.5rem" }}>{METRICS_DESC}</p>
            )}
            <div
              className="metrics-grid"
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                marginTop: "2rem",
              }}
            >
              {metricsToTrack.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: cardBg,
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: `1px solid ${cardBorder}`,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: textPrimary,
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Settings size={14} style={{ color: THEME }} /> {m.metric}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: textMuted, lineHeight: 1.4 }}>{m.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio pieces section */}
        <section style={{ marginTop: "3rem" }}>
          <h2
            style={{
              color: THEME,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <Layers size={20} /> Portfolio Pieces You'll Create
          </h2>
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            {portfolioTargets
              
              .map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.75rem 1rem",
                    background: sectionBg,
                    borderRadius: "8px",
                    borderLeft: `3px solid ${THEME}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ color: textPrimary }}>{p.title}</strong>
                  <span style={{ color: textMuted, fontSize: "0.8rem" }}>— Week {p.week}</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}