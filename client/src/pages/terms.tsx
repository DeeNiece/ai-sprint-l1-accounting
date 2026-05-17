// ── AI Sprint · Accounting ──────────────────────────────
// File: terms.tsx | Repo: ai-accounting
// Last updated: May 2026
//
// Uses inline styles throughout — no dependency on external CSS classes
// (day-section, why-box, etc. do not exist in this repo's stylesheet).
// Theme via useTheme() — syncs instantly with Nav toggle, zero delay.
// ─────────────────────────────────────────────────────────────────────────────

import Nav from "@/components/nav";
import { useTheme } from "@/components/theme-provider";
import { Link } from "wouter";
import { ScrollText } from "lucide-react";

const ACCENT = "#0d7c8a";

export default function TermsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageBg      = isDark ? "radial-gradient(circle at 50% 0%, rgba(13,124,138,0.05) 0%, #0a0a0c 100%)" : "#f1f5f9";
  const headingClr  = isDark ? "#e2e8f0" : "#1a202c";
  const bodyClr     = isDark ? "#94a3b8" : "#4a5568";
  const cardBg      = isDark ? "#1e293b" : "#ffffff";
  const cardBorder  = isDark ? "#334155" : "#e2e8f0";
  const cardShadow  = isDark ? "none"    : "0 2px 12px rgba(0,0,0,0.06)";
  const badgeBg     = isDark ? `${ACCENT}18` : `${ACCENT}12`;

  const sections = [
    {
      title: "Platform use",
      body: "AI Sprint is provided as a guided learning platform. Users are expected to use the platform lawfully, respectfully, and in ways that do not disrupt service or misuse content.",
    },
    {
      title: "Accounts and access",
      body: "Access to some features may depend on account status, purchase status, or platform permissions. Users are responsible for maintaining the security of their own accounts.",
    },
    {
      title: "Purchases and refunds",
      body: "Course purchases are one-time payments that grant lifetime access to the purchased level(s). Due to the digital nature of the content, all sales are final and no refunds are issued after purchase.",
    },
    {
      title: "Intellectual property",
      body: "All course content, prompts, lesson structures, and materials are the intellectual property of AI Sprint. Users may not reproduce, resell, or redistribute course content without written permission.",
    },
    {
      title: "Updates",
      body: "AI Sprint may update features, lessons, policies, or product structure over time as the platform evolves. Continued use of the platform after changes constitutes acceptance of the updated terms.",
    },
  ];

  return (
    <div style={{ background: pageBg, minHeight: "100vh", color: headingClr, transition: "background 0.3s, color 0.3s" }}>
      <Nav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <header style={{ marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, background: badgeBg, border: `1px solid ${ACCENT}30`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
            Legal &amp; Accessibility
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ScrollText size={22} style={{ color: ACCENT }} />
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, margin: 0, color: headingClr }}>
              Terms of Service
            </h1>
          </div>
          <p style={{ color: bodyClr, fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 8px" }}>
            Last updated: May 2026
          </p>
          <p style={{ color: bodyClr, fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
            By using AI Sprint, you agree to these terms. Please read them carefully.
          </p>
        </header>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: "24px 28px", boxShadow: cardShadow }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: headingClr, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, display: "inline-block" }} />
                {s.title}
              </h2>
              <p style={{ color: bodyClr, fontSize: "0.95rem", lineHeight: 1.75, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "3rem" }}>
          <Link href="/" style={{ color: ACCENT, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
