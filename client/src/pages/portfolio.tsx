// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: portfolio.tsx  |  Repo: accounting
// Last updated: May 2026
//
// Portfolio page with level switcher (Basic / Advanced) and dark/light mode support.
// Progress bar reflects completed days for the selected level.
// Data imported from curriculum (portfolioTargets, weekOverviews, etc.)

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import Nav from "@/components/nav";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import type { DayProgress } from "@shared/schema";
import {
  portfolioTargets,
  weekOverviews,
  portfolioTargetsL2,
  weekOverviewsL2,
} from "@/data/curriculum";
import { CheckCircle2, Target } from "lucide-react";

// ── Helper to count completed days ──────────────────────────────────────────
// Accounting uses plain integer day numbers (1-28), not L#-# format
function getCompletedCountForLevel(
  progressData: DayProgress[],
  _level: "1" | "2"
): number {
  return progressData.filter((p) => p.completed).length;
}

// ── Week colours (shared for both levels) ───────────────────────────────────
const WEEK_COLORS = ["#4f98a3", "#7a5fc0", "#c07a2f", "#2f8c5c"];

// ── Level configuration ─────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  "1": {
    color: "#0d7c8a",
    label: "Basic",
    badge: "Basic Track",
    totalDays: 28,
  },
  "2": {
    color: "#e8820c",
    label: "Advanced",
    badge: "Advanced Track",
    totalDays: 28,
  },
};

function hasAccess(user: any) {
  const levels = user?.licensedLevels || [];
  return levels.includes("bundle") || levels.includes("accounting-bundle") ||
         levels.includes("1") || levels.includes("2");
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeLevel, setActiveLevel] = useState<"1" | "2">("1");

  if (user && !hasAccess(user)) return null;

  const levelCfg = LEVEL_CONFIG[activeLevel];
  const THEME_COLOR = levelCfg.color;

  // Fetch progress data (dayNumber strings like "L1-1", "L2-7", etc.)
  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  const completedCount = getCompletedCountForLevel(progressData, activeLevel);
  const pct = Math.round((completedCount / levelCfg.totalDays) * 100);

  // Select data based on active level
  const targets = activeLevel === "1" ? portfolioTargets : portfolioTargetsL2;
  const overviews = activeLevel === "1" ? weekOverviews : weekOverviewsL2;

  // Theme‑aware colours
  const pageBg       = isDark ? "#0a0a0c" : "#f8fafc";
  const textPrimary  = isDark ? "white" : "#1a1a2e";
  const textMuted    = isDark ? "#aaa" : "#4a5568";
  const cardBg       = isDark ? "rgba(22,23,30,0.4)" : "#ffffff";
  const cardBorder   = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const progressBg   = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const progressFill = THEME_COLOR;
  const badgeBg      = THEME_COLOR;

  return (
    <div className="page-wrap" style={{ background: pageBg, minHeight: "100vh" }}>
      <Nav />
      <main className="inner-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Header with level switcher */}
        <div className="inner-page-header" style={{
          textAlign: "center", padding: "3rem 1.5rem",
          background: isDark ? "rgba(22,23,30,0.4)" : "#ffffff",
          border: `1px solid ${cardBorder}`,
          borderRadius: "24px", marginBottom: "3rem",
        }}>
          <div className="inner-page-badge" style={{ background: badgeBg, color: "white", fontWeight: 800, display: "inline-block", padding: "0.25rem 1rem", borderRadius: "20px" }}>
            {levelCfg.badge}
          </div>
          <h1 className="inner-page-title" style={{ fontSize: "2.5rem", marginTop: "1rem", color: textPrimary }}>
            {t("portfolio.subtitle") || "Portfolio Targets"}
          </h1>
          <p className="inner-page-sub" style={{ maxWidth: "600px", margin: "0.5rem auto 0", color: textMuted }}>
            {t("portfolio.desc") || "By the end of each track, you'll have these real deliverables – evidence of your AI accounting skills."}
          </p>

          {/* Level switcher buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
            {(["1", "2"] as const).map((lvl) => {
              const cfg = LEVEL_CONFIG[lvl];
              const active = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 22px", borderRadius: "50px", cursor: "pointer",
                    border: `1.5px solid ${active ? cfg.color : (isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1")}`,
                    background: active ? `${cfg.color}1a` : "transparent",
                    color: active ? cfg.color : (isDark ? "rgba(255,255,255,0.5)" : "#4a5568"),
                    fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                  {cfg.label} Track
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenge Progress bar */}
        <div className="portfolio-progress-bar" style={{ marginBottom: "2rem" }}>
          <div className="progress-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: textMuted }}>
            <span>Challenge Progress – {levelCfg.label} Track</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-bg" style={{ background: progressBg, borderRadius: "4px", height: "8px" }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: progressFill, borderRadius: "4px", height: "100%" }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: textMuted, marginTop: "0.25rem", textAlign: "right" }}>
            {completedCount} of {levelCfg.totalDays} days completed
          </div>
        </div>

        {/* Targets by week */}
        {[1, 2, 3, 4].map((week) => {
          const weekTargets = targets.filter((t) => t.week === week);
          const color = WEEK_COLORS[week - 1];
          const overview = overviews[week - 1];
          if (!weekTargets.length) return null;

          return (
            <div key={week} className="portfolio-week" style={{ marginBottom: "2.5rem" }}>
              <div className="portfolio-week-header" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <span className="week-num" style={{ background: color, color: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                  Week {week}
                </span>
                <span className="portfolio-week-title" style={{ fontWeight: 700, color: textPrimary }}>{overview?.title}</span>
              </div>
              <div className="portfolio-targets-grid" style={{
                display: "grid", gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}>
                {weekTargets.map((target, i) => (
                  <div key={i} className="portfolio-target-card" style={{
                    background: cardBg, border: `1px solid ${cardBorder}`,
                    borderRadius: "16px", padding: "1.5rem",
                    display: "flex", gap: "1rem", alignItems: "flex-start",
                  }}>
                    <div className="portfolio-target-icon" style={{ color, flexShrink: 0 }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <div className="portfolio-target-title" style={{ fontWeight: 700, color: textPrimary, marginBottom: "0.5rem" }}>
                        {target.title}
                      </div>
                      <div className="portfolio-target-desc" style={{ fontSize: "0.85rem", color: textMuted, lineHeight: 1.5 }}>
                        {target.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="portfolio-cta" style={{
          marginTop: "3rem", padding: "2rem", background: cardBg,
          border: `1px solid ${cardBorder}`, borderRadius: "20px", textAlign: "center",
        }}>
          <div className="portfolio-cta-icon" style={{ marginBottom: "1rem", color: THEME_COLOR }}>
            <CheckCircle2 size={28} />
          </div>
          <div className="portfolio-cta-title" style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.5rem", color: textPrimary }}>
            {t("portfolio.earnedTitle") || "You've earned every one of these"}
          </div>
          <p className="portfolio-cta-text" style={{ color: textMuted, maxWidth: "600px", margin: "0 auto" }}>
            {t("portfolio.earnedDesc") || "Complete the 28 days and you'll have real, showable work samples — not just certificates. Put these in a portfolio to demonstrate your AI accounting expertise."}
          </p>
        </div>

        {/* What comes next – level‑specific message */}
        <div className="next-level-box" style={{
          marginTop: "2rem", padding: "1.5rem", background: cardBg,
          border: `1px solid ${cardBorder}`, borderRadius: "20px", textAlign: "center",
        }}>
          <div className="next-level-label" style={{ fontWeight: 700, marginBottom: "0.5rem", color: textPrimary }}>
            {t(`portfolio.nextLevel.${activeLevel}`) || (activeLevel === "1" ? "Ready for the Advanced Track?" : "Advanced complete — you're ready for real client work.")}
          </div>
          <p style={{ color: textMuted, margin: 0 }}>
            {t(`portfolio.nextLevelDesc.${activeLevel}`) || (activeLevel === "1" ? "The Advanced track builds on these fundamentals with AI audits, operating models, and advisory deliverables." : "You now have the systems to deliver enterprise-level AI accounting services. Start offering advisory work at premium rates.")}
          </p>
        </div>

      </main>
    </div>
  );
}