// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: pricing.tsx | Repo: accounting
// Last updated: June 2026
// Changes: Added Day 1 free trust line under subtitle; added "Try Day 1 for free" escape link below buy button
// Single $59 price grants both tracks (56 days total)
// Stripe only — PayMongo removed

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import Nav from "@/components/nav";
import {
  CheckCircle2, Lock, CreditCard,
  Mail, Send, AlertCircle, UserCircle,
  BookOpen, TrendingUp,
} from "lucide-react";

const COURSE_PRICE_USD = 59;
const COURSE_ORIG_USD  = 75;
const L1_COLOR = "#0d7c8a";
const L2_COLOR = "#e8820c";

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const bgColor     = isDark ? "rgba(255,255,255,0.03)" : "#f9fafb";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const labelClr    = isDark ? "#9896b0" : "#6b7280";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.15)";
  const textClr     = isDark ? "#e8e6f4" : "#111827";
  const mutedClr    = isDark ? "#9896b0" : "#6b7280";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSubmitting(true); setError(null);
    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value.trim(),
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };
    try {
      const res  = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok && json.ok) { setSubmitted(true); form.reset(); }
      else setError("Something went wrong. Please try emailing us directly.");
    } catch { setError("Network error. Please try emailing us directly."); }
    finally   { setSubmitting(false); }
  }

  return (
    <section style={{ maxWidth: 680, margin: "0 auto 60px", padding: "0 20px" }}>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, textAlign: "center", marginBottom: 24, color: isDark ? "#e8e6f4" : "#111827" }}>
        Questions? We're here to help
      </h2>
      {submitted ? (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "24px", textAlign: "center", color: "#22c55e" }}>
          <CheckCircle2 size={24} style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 600 }}>Message sent!</div>
          <div style={{ fontSize: "0.85rem", marginTop: 4, color: isDark ? "#9896b0" : "#6b7280" }}>We'll get back to you within 24 hours.</div>
          <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: "none", border: `1px solid ${isDark ? "#333" : "rgba(0,0,0,0.15)"}`, color: isDark ? "#888" : "#6b7280", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: labelClr, marginBottom: 6 }}>Name</label>
              <input name="name" required placeholder="Your name" style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 8, color: textClr, fontSize: "0.9rem", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: labelClr, marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required placeholder="you@email.com" style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 8, color: textClr, fontSize: "0.9rem", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: labelClr, marginBottom: 6 }}>Message</label>
            <textarea name="message" required rows={4} placeholder="Ask us anything about the course..." style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 8, color: textClr, fontSize: "0.9rem", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={submitting} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 28px", background: L1_COLOR, color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
            <Send size={15}/>{submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}

// ── Level Comparison ──────────────────────────────────────────────────────────
function LevelComparison() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cardBg     = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const headingClr = isDark ? "#e8e6f4" : "#111827";
  const featureClr = isDark ? "#ccc"    : "#374151";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto 40px", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: 700, color: headingClr, marginBottom: 24 }}>
        What's included in each level
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {[
          { color: L1_COLOR, icon: <BookOpen size={18}/>, title: "Level 1 · Basic (28 days)", items: ["AI-powered bookkeeping workflows", "Invoice and expense automation", "Financial statement analysis with AI", "Month-end close acceleration", "AI Coach: 5 messages/day included", "Completion certificate"] },
          { color: L2_COLOR, icon: <TrendingUp size={18}/>, title: "Level 2 · Advanced (28 days)", items: ["CFO-level reporting & forecasting", "AI governance & audit readiness", "Multi-entity consolidation with AI", "Board-level financial storytelling", "AI Coach: 5 messages/day included", "Completion certificate"] },
        ].map((level, i) => (
          <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: level.color, fontWeight: 700, marginBottom: 16 }}>
              {level.icon} {level.title}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {level.items.map((item, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: "0.875rem", color: featureClr }}>
                  <CheckCircle2 size={14} style={{ color: level.color, flexShrink: 0, marginTop: 2 }}/>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Pricing Page ─────────────────────────────────────────────────────────
export default function PricingPage() {
  const { user }  = useAuth();
  const { theme } = useTheme();
  const isDark    = theme === "dark";

  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) setLoading(null); };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (window.self !== window.top) document.documentElement.classList.add("in-iframe");
  }, []);

  const licensed = user?.licensedLevels || [];
  const ownsAll  = licensed.some(l => ["accounting-bundle", "accounting-basic", "accounting-advanced", "bundle"].includes(l));

  async function handlePurchase(planId: string) {
    if (!user) { window.location.href = "/#/auth"; return; }
    setLoading(planId); setError(null);
    try {
      const res  = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId }) });
      const data = await res.json();
      if (data.url) { setLoading(null); window.location.href = data.url; }
      else { setError(data.error || "Something went wrong. Please try again."); setLoading(null); }
    } catch { setError("Network error. Please try again."); setLoading(null); }
  }

  const pageBg     = isDark ? "#0d0d14"                : "#f4f6fb";
  const headingClr = isDark ? "#e8e6f4"                : "#111827";
  const bodyClr    = isDark ? "#9896b0"                : "#374151";
  const cardBg     = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const cardShadow = isDark ? "none"                   : "0 4px 24px rgba(0,0,0,0.08)";
  const priceClr   = isDark ? "#e8e6f4"                : "#111827";
  const strikeClr  = isDark ? "#555"                   : "#9ca3af";
  const featureClr = isDark ? "#ccc"                   : "#374151";
  const footerClr  = isDark ? "#555"                   : "#9ca3af";

  return (
    <div style={{ background: pageBg, color: headingClr, minHeight: "100vh", transition: "background 0.3s,color 0.3s" }}>
      <Nav />
      <style>{`html.in-iframe nav,html.in-iframe [class*="nav"],html.in-iframe header{display:none!important}html.in-iframe main{padding-top:0!important}`}</style>

      <main style={{ padding: "0 0 40px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "60px 20px 32px", maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 800, color: headingClr, lineHeight: 1.2, margin: "0 0 16px" }}>
            Accounting with AI — Complete 56-Day Course
          </h1>
          <p style={{ color: bodyClr, fontSize: "1.05rem", lineHeight: 1.7, margin: "0 auto 12px", maxWidth: 650 }}>
            Two levels, one price. Start with AI-powered bookkeeping fundamentals, graduate to CFO-level reporting and enterprise automation. 56 days of curriculum, 2 completion certificates.
          </p>
          <p style={{ color: "#0d7c8a", fontWeight: 600, fontSize: "0.9rem", margin: "0 auto 20px" }}>
            ✓ Day 1 is always free — try the course before you buy
          </p>
          {ownsAll && (
            <div style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", padding: "10px 16px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={16} /> You already own the full course — both levels unlocked
            </div>
          )}
        </div>

        {/* Pricing Card */}
        <div style={{ maxWidth: 720, margin: "0 auto 24px", borderRadius: 24, overflow: "hidden", background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
          <div style={{ background: `linear-gradient(135deg,${L1_COLOR},${L2_COLOR})`, textAlign: "center", padding: "12px 20px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", color: "white" }}>
            📊 Complete Bundle · Both Levels · Best Value
          </div>
          <div style={{ padding: "32px 36px" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: isDark ? "#e8e6f4" : "#111827", marginBottom: 8 }}>Accounting with AI — Basic + Advanced</div>
              <div style={{ fontSize: "0.9rem", color: isDark ? "#888" : "#6b7280" }}>56 days · 2 levels · 15 min/day · AI-powered accounting from basics to CFO-level</div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <span style={{ padding: "6px 18px", borderRadius: 100, background: `${L1_COLOR}22`, border: `1px solid ${L1_COLOR}66`, color: L1_COLOR, fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={14} /> L1 · Basic — Fundamentals & Automation
              </span>
              <span style={{ padding: "6px 18px", borderRadius: 100, background: `${L2_COLOR}22`, border: `1px solid ${L2_COLOR}66`, color: L2_COLOR, fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} /> L2 · Advanced — CFO-Level & Governance
              </span>
            </div>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: "4rem", fontWeight: 900, color: priceClr, lineHeight: 1 }}>${COURSE_PRICE_USD}</span>
                <span style={{ fontSize: "1.2rem", color: strikeClr, textDecoration: "line-through", marginLeft: 14 }}>${COURSE_ORIG_USD}</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: L1_COLOR, fontWeight: 700 }}>
                Save ${COURSE_ORIG_USD - COURSE_PRICE_USD} · {Math.round((1 - COURSE_PRICE_USD / COURSE_ORIG_USD) * 100)}% off · one-time · lifetime access
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {[
                { accent: L1_COLOR,    text: "Level 1 — Basic (28 days): bookkeeping, invoicing, expense automation, financial statements" },
                { accent: L2_COLOR,    text: "Level 2 — Advanced (28 days): CFO reporting, AI governance, multi-entity consolidation" },
                { accent: "#14b8a6",   text: "2 completion certificates — one per level, downloadable and shareable" },
                { accent: "#f59e0b",   text: "AI Coach included — 5 messages/day, focused on today's lesson" },
                { accent: "#8b5cf6",   text: "15 min/day — structured lessons that fit around your work schedule" },
                { accent: L1_COLOR,    text: "Lifetime access · all future updates · no renewals" },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, fontSize: "0.9rem", color: featureClr }}>
                  <CheckCircle2 size={16} style={{ color: item.accent, flexShrink: 0, marginTop: 2 }} />{item.text}
                </li>
              ))}
            </ul>

            {ownsAll ? (
              <div style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "14px 20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontWeight: 600 }}>
                <CheckCircle2 size={18} /> You own the full course — both levels unlocked
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420, margin: "0 auto" }}>
                <button
                  onClick={() => handlePurchase("accounting-bundle")}
                  disabled={!!loading}
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontSize: "1rem", padding: "14px 24px", borderRadius: 12, border: "none", background: L1_COLOR, color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, boxShadow: `0 4px 14px ${L1_COLOR}55` }}>
                  <CreditCard size={18} />{loading === "accounting-bundle" ? "Redirecting…" : `Pay with Card · $${COURSE_PRICE_USD} USD`}
                </button>
                <div style={{ textAlign: "center", fontSize: "0.85rem", color: isDark ? "#888" : "#6b7280" }}>
                  Not ready to buy?{" "}
                  <a href="/#/day/L1-1" style={{ color: L1_COLOR, fontWeight: 700, textDecoration: "none" }}>
                    Try Day 1 for free →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <LevelComparison />

        {error && (
          <div style={{ maxWidth: 680, margin: "24px auto 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 18px", color: "#ef4444", fontSize: "0.88rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ textAlign: "center", padding: "48px 20px 60px", fontSize: "0.8rem", color: footerClr, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Lock size={14} />
          Secure payments via Stripe · Lifetime access · Email used at purchase is your account
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Need team pricing? <a href="mailto:support@aisprint.app" style={{ color: L1_COLOR, textDecoration: "underline" }}>Contact sales</a></span>
        </div>
      </main>

      <ContactSection />
    </div>
  );
}
