// ── AI Sprint · Mastering Accounting with AI ────────────────────────────────────────────────
// File: landing.tsx | Repo: ai-sprint-l1-accounting
// Last updated: May 2026
// Hero: Cinematic full-bleed (Hero_Image_AI_Accounting.png)
//       Image path: client/public/assets/Hero_Image_AI_Accounting.png
// Dark mode: locked — toggle hidden, all light-mode CSS preserved & reversible
// Contact: /api/contact → Resend (RESEND_API_KEY in Railway env vars)
//
// ⚠️  RAILWAY REMINDER: Add RESEND_API_KEY to this service's environment variables

import { useState, useEffect, useRef } from "react";
import logoImg from "@/ai-sprint-logo.png";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/i18n";
import bannerVideo from "@/assets/Challenge-Badge Trim_small.mp4";
import {
  Mail, Lock, UserCircle, ArrowRight, AlertCircle,
  Eye, EyeOff, X, Send, CheckCircle2,
} from "lucide-react";

const THEME_COLOR = "#0d7c8a";
const L2_COLOR = "#e8820c";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

const LEVEL_THEMES = {
  "1": {
    color: THEME_COLOR,
    name: "Basic",
    label: "Basic · Foundation",
    annotation: "AI-ACCT-BASIC",
    days: "28 DAYS",
    tagline: "Master the accounting AI foundations every finance professional needs.",
    heroHeadline: "In 28 days, become the accountant who confidently works with AI.",
    heroSub: "Built for accountants, bookkeepers, and finance professionals who want to work smarter with AI — without losing the professional judgement that matters.",
    urgency: "423 accountants enrolled in the Basic track this month",
    cta: "Start the Basic Track →",
    dividerMarks: ["↔ 28 DAYS", "📊 BASIC TRACK", "15 MIN/DAY"],
    sectionLabel: "ACCOUNTING + AI · BASIC TRACK",
    sectionH2: "The practical way to master accounting with AI in 2026",
  },
  "2": {
    color: L2_COLOR,
    name: "Advanced",
    label: "Advanced · Advisory",
    annotation: "AI-ACCT-ADVANCED",
    days: "28 DAYS",
    tagline: "Build advisory-level AI skills that transform how you serve clients.",
    heroHeadline: "In 28 days, become the accountant who uses AI to deliver advisory-level insight.",
    heroSub: "Level 2 is for finance professionals ready to move beyond basics — AI audits, operating models, and client-ready advisory deliverables.",
    urgency: "187 finance professionals enrolled in the Advanced track this month",
    cta: "Start the Advanced Track →",
    dividerMarks: ["↔ 28 DAYS", "📈 ADVANCED TRACK", "15 MIN/DAY"],
    sectionLabel: "ACCOUNTING + AI · ADVANCED TRACK",
    sectionH2: "Build advisory AI skills that clients will pay a premium for",
  },
};

// ── Auth Modal with Dark/Light Mode Support (Fixed) ─────────────────────────
function AuthModal({ onClose, defaultMode = "register", isDark }: { onClose: () => void; defaultMode?: "login" | "register"; isDark: boolean }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseUrl, setPurchaseUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Theme-aware styles
  const modalBg = isDark ? "#1e293b" : "#ffffff";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "rgba(0,0,0,0.3)" : "#f1f5f9";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1";
  const inputTextColor = isDark ? "white" : "#0f172a";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const overlayBg = isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPurchaseUrl(null);
    setLoading(true);

    try {
      let result = null;
      if (mode === "login") {
        result = await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError(t("auth.nameRequired"));
          setLoading(false);
          return;
        }
        result = await register(email, password, displayName);
      }

      // Success: result is null or false? In many implementations, success returns null/undefined.
      // If result contains an error property, treat as error.
      if (result && typeof result === "object" && "message" in result) {
        setError(result.message || String(result));
        if ("purchaseUrl" in result && result.purchaseUrl) {
          setPurchaseUrl(result.purchaseUrl);
        }
        setLoading(false);
        return;
      }

      // No error -> success, close modal
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="lp-modal-overlay" onMouseDown={handleOverlayClick} style={{ background: overlayBg }}>
      <div className="lp-modal-card" style={{
        background: modalBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "16px",
        maxWidth: "480px",
        width: "90%",
        margin: "auto",
        padding: "1.5rem",
        position: "relative",
        boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
      }}>
        <button className="lp-modal-close" onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: "12px", right: "12px",
          background: "none", border: "none", cursor: "pointer", color: textMuted
        }}>
          <X size={18} />
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <img src={logoImg} alt="AI Sprint" className="auth-logo-img" style={{ maxWidth: "120px" }} />
          <div className="auth-tagline" style={{ color: textMuted }}>
            Master Accounting. Leverage AI. Stay Ahead.
          </div>
        </div>

        <h1 className="auth-heading" style={{ color: textColor, fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>
          {mode === "login" ? "Welcome Back to Accounting in the AI Era" : t("auth.createAccount")}
        </h1>

        <p className="auth-subtext" style={{ color: textMuted, marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center" }}>
          {mode === "login" ? t("auth.loginSubtext") : t("auth.signupSubtext")}
        </p>

        {error && (
          <div className="auth-error" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {purchaseUrl && (
          <div className="auth-error" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <AlertCircle size={14} />
            <span>You may need a valid license. <a href={purchaseUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", fontWeight: 600, color: "#fca5a5" }}>View Pricing →</a></span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="modal-name" style={{ color: textColor, display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                <UserCircle size={14} /> {t("auth.nameLabel")}
              </label>
              <input
                id="modal-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: inputBg,
                  border: inputBorder,
                  color: inputTextColor,
                  outline: "none",
                }}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="modal-email" style={{ color: textColor, display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              <Mail size={14} /> {t("auth.emailLabel")}
            </label>
            <input
              id="modal-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: inputBg,
                border: inputBorder,
                color: inputTextColor,
                outline: "none",
              }}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="modal-password" style={{ color: textColor, display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
              <Lock size={14} /> {t("auth.passwordLabel")}
            </label>
            <div className="auth-pw-wrap" style={{ position: "relative" }}>
              <input
                id="modal-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "register"
                    ? t("auth.passwordPlaceholder")
                    : t("auth.loginPasswordPlaceholder")
                }
                required
                minLength={mode === "register" ? 6 : 1}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: inputBg,
                  border: inputBorder,
                  color: inputTextColor,
                  outline: "none",
                }}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((s) => !s)}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: textMuted,
                  cursor: "pointer",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              background: "#3ab8c8",
              color: "#000",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
              boxShadow: "0 4px 14px rgba(58, 184, 200, 0.4)",
            }}
          >
            {loading
              ? t("auth.pleaseWait")
              : mode === "login"
              ? t("auth.login")
              : t("auth.createAccountBtn")}
            {!loading && <ArrowRight size={16} />}
          </button>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <div style={{ position: "relative", margin: "20px 0" }}>
              <hr style={{ border: "none", borderTop: `1px solid ${borderColor}` }} />
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: modalBg,
                  backdropFilter: "blur(10px)",
                  padding: "0 10px",
                  fontSize: "0.75rem",
                  color: textMuted,
                  fontWeight: 600,
                }}
              >
                OR
              </span>
            </div>

            <a
              href="/api/auth/google"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: "#f0f0f0",
                color: "#000",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                width="20"
                alt="Google"
              />
              {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
            </a>
          </div>
        </form>

        <div className="auth-switch" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: textMuted }}>
          {mode === "login" ? (
            <>
              <p>
                {t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setPurchaseUrl(null);
                  }}
                  style={{ background: "none", border: "none", color: "#3ab8c8", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                >
                  {t("auth.signup")}
                </button>
              </p>

              <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: textMuted }}>
                Having trouble logging in?{" "}
                <a
                  href="mailto:support@aisprint.app"
                  style={{ textDecoration: "underline", textUnderlineOffset: "2px", color: THEME_COLOR }}
                >
                  Contact Support
                </a>
              </p>
            </>
          ) : (
            <p>
              {t("auth.hasAccount")}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setPurchaseUrl(null);
                }}
                style={{ background: "none", border: "none", color: "#3ab8c8", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                {t("auth.login")}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Contact Support Section with Dark/Light Mode ────────────────────────────
function ContactSection({ isDark }: { isDark: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labelColor = isDark ? "#ddd" : "#333";
  const inputTextColor = isDark ? "white" : "#111";
  const inputBg = isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.15)";
  const formBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const formBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    fd.get("name")    as string,
          email:   fd.get("email")   as string,
          message: fd.get("message") as string,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) { setSubmitted(true); form.reset(); }
      else setError(json.error || "Something went wrong. Please email support@aisprint.app");
    } catch {
      setError("Network error. Please email support@aisprint.app directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#111",
      }}
      className="lp-contact-section"
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#0d7c8a",
              background: "rgba(13, 124, 138, 0.1)",
              border: "1px solid rgba(13, 124, 138, 0.2)",
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: 16,
            }}
          >
            <Mail size={12} /> Contact Support
          </div>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 800,
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Need help? We're here.
          </h2>
          <p style={{ color: "#888", fontSize: "1rem", margin: 0 }}>
            Send us a message and we'll get back to you at{" "}
            <a
              href="mailto:support@aisprint.app"
              style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              support@aisprint.app
            </a>
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: 16,
              padding: "40px 32px",
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h3 className="lp-contact-success-title" style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
              Message sent!
            </h3>
            <p className="lp-contact-success-text" style={{ margin: 0 }}>
              We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                marginTop: 20,
                background: "none",
                border: "1px solid #333",
                color: "#888",
                padding: "8px 20px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: formBg,
              border: formBorder,
              borderRadius: 16,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* contact sent via /api/contact → Resend */}

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="contact-name"
                className="lp-form-label"
                style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor, display: "flex", alignItems: "center", gap: 6 }}
              >
                <UserCircle size={13} /> Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                required
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: inputBorder,
                  background: inputBg,
                  color: inputTextColor,
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="contact-email"
                className="lp-form-label"
                style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Mail size={13} /> Your Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: inputBorder,
                  background: inputBg,
                  color: inputTextColor,
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="contact-message"
                className="lp-form-label"
                style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Describe your issue or question…"
                required
                rows={5}
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: inputBorder,
                  background: inputBg,
                  color: inputTextColor,
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "13px",
                borderRadius: 8,
                border: "none",
                background: submitting ? "#555" : "#0d7c8a",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s",
                boxShadow: submitting ? "none" : "0 4px 14px rgba(13, 124, 138, 0.35)",
              }}
            >
              <Send size={15} />
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [activeTab, setActiveTab] = useState<"1" | "2">("1");
  // Dark mode locked — always dark. All lp-light CSS preserved & reversible.
  const [isDark, _setIsDark] = useState(true);
  const setIsDark = (_val: boolean) => {}; // no-op — re-enable to restore toggle
  const themeData = LEVEL_THEMES[activeTab];
  const THEME = themeData.color;

  const cursorRef = useRef<HTMLDivElement>(null);

  // Scrambled H1
  const [scrambledH1, setScrambledH1] = useState(LEVEL_THEMES["1"].heroHeadline);

  // Animated stat counters
  const [s28, setS28] = useState(0);
  const [s15, setS15] = useState(0);
  const [sEnrolled, setSEnrolled] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsFired = useRef(false);

  // Ticker messages
  const TICKS: Record<"1"|"2", string[]> = {
    "1": [
      "📊 Sarah completed her month-end close checklist · Day 16",
      "🏆 Daniel unlocked Workflow Architect rank · Basic",
      "✅ Priya just finished her AI prompt library · Day 26",
      "📋 Marcus built a bank reconciliation workflow · Week 2",
      "✨ 423 accountants enrolled in the Basic track this month",
      "🔥 Yuki is on a 10-day streak · Basic track",
    ],
    "2": [
      "📈 Sarah delivered her first AI audit report to a client",
      "🏆 Daniel unlocked Advisory Pro rank · Advanced",
      "✅ Priya built her AI-ready operating model · Week 4",
      "📋 Marcus landed a new advisory client using the framework",
      "✨ 187 professionals enrolled in the Advanced track this month",
      "🔥 Yuki is on a 14-day streak · Advanced track",
    ],
  };
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  const [revealCards, setRevealCards] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [revealTestimonials, setRevealTestimonials] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const deliverablesScrollRef = useRef<HTMLDivElement>(null);
  const sevenDayScrollRef = useRef<HTMLDivElement>(null);
  const testiScrollRef = useRef<HTMLDivElement>(null);

  function openAuth(mode: "login" | "register" = "register") {
    setAuthMode(mode);
    setShowAuth(true);
  }

  // Cursor glow
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.setProperty("--cx", `${e.clientX}px`);
      el.style.setProperty("--cy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // H1 scramble
  useEffect(() => {
    const target = LEVEL_THEMES[activeTab].heroHeadline;
    let frame = 0;
    const total = 30;
    const iv = setInterval(() => {
      setScrambledH1(target.split("").map((char, i) => {
        if (char === " ") return " ";
        if (frame / total > i / target.length + 0.1) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      frame++;
      if (frame > total) { setScrambledH1(target); clearInterval(iv); }
    }, 45);
    return () => clearInterval(iv);
  }, [activeTab]);

  // Stat counters
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || statsFired.current) return;
      statsFired.current = true;
      const run = (setter: (v: number) => void, target: number, dur: number) => {
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setter(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      run(setS28, 28, 1000);
      run(setS15, 15, 800);
      run(setSEnrolled, 423, 1200);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ticker rotation
  useEffect(() => {
    setTickerIdx(0);
    const iv = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => { setTickerIdx(i => (i + 1) % TICKS[activeTab].length); setTickerVisible(true); }, 350);
    }, 4000);
    return () => clearInterval(iv);
  }, [activeTab]);

  // Scroll reveal
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealCards(true);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [activeTab]);

  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealTestimonials(true);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-scroll for carousels
  useEffect(() => {
    function makeCardScroller(getEl: () => HTMLDivElement | null, intervalMs: number) {
      let timer: ReturnType<typeof setInterval> | null = null;
      let paused = false;
      function advance() {
        const el = getEl();
        if (!el || paused) return;
        const step = el.clientWidth;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        if (atEnd) {
          el.style.scrollBehavior = "auto";
          el.scrollLeft = 0;
          requestAnimationFrame(() => { el.style.scrollBehavior = "smooth"; });
        } else {
          el.style.scrollBehavior = "smooth";
          el.scrollLeft += step;
        }
      }
      function start() { if (timer) return; timer = setInterval(advance, intervalMs); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      const el = getEl();
      if (el) {
        el.style.scrollBehavior = "smooth";
        el.addEventListener("mouseenter", () => { paused = true; });
        el.addEventListener("mouseleave", () => { paused = false; });
        el.addEventListener("touchstart", () => { paused = true; }, { passive: true });
        el.addEventListener("touchend", () => { setTimeout(() => { paused = false; }, 1500); }, { passive: true });
      }
      start();
      return stop;
    }
    const cleanups = [
      makeCardScroller(() => deliverablesScrollRef.current, 2800),
      makeCardScroller(() => sevenDayScrollRef.current,     2600),
      makeCardScroller(() => testiScrollRef.current,        3200),
    ];
    return () => cleanups.forEach(c => c?.());
  }, []);

  return (
    <div className={`lp-root${isDark ? "" : " lp-light"}`} style={{
      background: isDark ? "#0d0d14" : "#f4f6fb",
      color: isDark ? "#e8e6f4" : "#1a1a2e",
      minHeight: "100vh",
    } as any}>

      {/* Cursor glow */}
      <div ref={cursorRef} style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(600px at var(--cx,50%) var(--cy,50%), rgba(13,124,138,.07), transparent 70%)",
      }} />

      {/* Ledger grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(13,124,138,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(13,124,138,.03) 1px,transparent 1px)`,
        backgroundSize: "100% 28px, 80px 28px",
        maskImage: "linear-gradient(to bottom,rgba(0,0,0,.55) 0%,transparent 55%)",
        WebkitMaskImage: "linear-gradient(to bottom,rgba(0,0,0,.55) 0%,transparent 55%)",
      }} />

      {/* Live ticker pill */}
      <div className="lp-ticker" style={{
        position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
        zIndex:50, maxWidth:360, width:"calc(100% - 40px)",
        background:"rgba(13,15,26,.92)", border:"1px solid rgba(255,255,255,.1)",
        borderRadius:100, padding:"7px 16px",
        display:"flex", alignItems:"center", gap:10,
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)" as any,
        boxShadow:"0 4px 24px rgba(0,0,0,.4)",
        opacity: tickerVisible ? 1 : 0, transition:"opacity 0.35s ease" }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:THEME, boxShadow:`0 0 8px ${THEME}`, flexShrink:0, animation:"lpPulse 2s infinite" }}/>
        <span className="lp-ticker-text" style={{ fontSize:".75rem", color:"#aaa", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", flex:1 }}>{TICKS[activeTab][tickerIdx]}</span>
        <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:`${THEME_COLOR}99`, flexShrink:0, fontFamily:"monospace" }}>LIVE</span>
      </div>

      <style>{`
        @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes lpHeroReveal { from{transform:scale(1.06);opacity:.7} to{transform:scale(1);opacity:1} }
        @keyframes lpRise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        /* Portrait mobile — ~1/5 of face visible on right edge */
        @media(max-width:768px) and (orientation:portrait){
          .lp-acct-cin-bg{ background-position:55% center !important; }
        }
        /* Landscape mobile */
        @media(max-width:900px) and (orientation:landscape){
          .lp-acct-cin-bg{ background-position:70% center !important; }
          .lp-acct-cin-content{ padding:5rem 1.4rem 4rem !important; }
        }
        /* Scramble target — reserve space */
        .lp-acct-cin-h1{ display:block; min-height:0.97em; line-height:0.97; }
        .lp-reveal { opacity:0; transform:translateY(24px); transition:opacity .65s ease, transform .65s ease; }
        .lp-reveal.visible { opacity:1; transform:translateY(0); }
        [data-autoscroll]::-webkit-scrollbar { display: none; }

        /* ── DARK MODE ── */
        .lp-root { --lp-body: #c8c6e0; --lp-muted: #9896b0; --lp-card-bg: rgba(255,255,255,.04); --lp-card-border: rgba(255,255,255,.09); }
        .lp-root p, .lp-root li { color: var(--lp-body); }

        /* ── LIGHT MODE ── */
        .lp-light { --lp-body: #374151; --lp-muted: #6b7280; --lp-card-bg: #ffffff; --lp-card-border: rgba(0,0,0,.08); }
        .lp-light section { background: #f4f6fb !important; }
        .lp-light .lp-dark-section { background: #ffffff !important; }
        .lp-light .lp-section { background: #f4f6fb !important; }
        .lp-light .lp-cta-section { background: ${THEME_COLOR} !important; }
        .lp-light h1, .lp-light h2, .lp-light h3 { color: #111827 !important; }
        .lp-light p { color: #374151 !important; }
        .lp-light .lp-hero-sub { color: #4b5563 !important; }
        .lp-light .lp-hero-tagline { color: ${THEME_COLOR} !important; }
        .lp-light .lp-nav { background: rgba(255,255,255,.95) !important; border-bottom: 1px solid rgba(0,0,0,.07); }
        .lp-light .lp-btn-ghost { color: #374151 !important; border-color: rgba(0,0,0,.15) !important; }
        .lp-light .lp-hero-module-card { background: #ffffff !important; border-color: rgba(0,0,0,.09) !important; color: #374151 !important; }
        .lp-light .lp-hero-h1 { color: #111827 !important; }
        .lp-light .lp-hero-outline { color: #374151 !important; border-color: rgba(0,0,0,.2) !important; }
        .lp-light .lp-why-card { background: #ffffff !important; border-color: rgba(13,124,138,.15) !important; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .lp-light .lp-card-title { color: #111827 !important; }
        .lp-light .lp-card-body { color: #4b5563 !important; }
        .lp-light .lp-two-col { background: #f4f6fb !important; }
        .lp-light .lp-col-block { background: #ffffff !important; border-color: rgba(0,0,0,.08) !important; box-shadow: 0 2px 12px rgba(0,0,0,.05); }
        .lp-light .lp-col-heading { color: #111827 !important; }
        .lp-light .lp-col-body { color: #4b5563 !important; }
        .lp-light .lp-check-item { color: #374151 !important; }
        .lp-light .lp-check-icon { color: ${THEME_COLOR} !important; }
        .lp-light .lp-seven-day-section { background: #f4f6fb !important; }
        .lp-light .lp-seven-day-section h2 { color: #111827 !important; }
        .lp-light .lp-seven-day-section p { color: #6b7280 !important; }
        .lp-light .lp-day-card { background: #ffffff !important; border-color: rgba(0,0,0,.09) !important; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
        .lp-light .lp-day-title { color: #111827 !important; }
        .lp-light .lp-day-hint { color: #9ca3af !important; }
        .lp-light .lp-testi-section { background: #f4f6fb !important; }
        .lp-light .lp-testi-section h2 { color: #111827 !important; }
        .lp-light .lp-testi-section p { color: #6b7280 !important; }
        .lp-light .lp-testi-card { background: #ffffff !important; border-color: rgba(0,0,0,.08) !important; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .lp-light .lp-testi-text { color: #374151 !important; }
        .lp-light .lp-testi-name { color: #111827 !important; }
        .lp-light .lp-testi-role { color: #9ca3af !important; }
        .lp-light .lp-join-banner { color: #111827 !important; }
        .lp-light .lp-join-banner span { color: #374151 !important; }
        .lp-light .lp-contact-section { background: #f4f6fb !important; }
        .lp-light .lp-contact-section h2 { color: #111827 !important; }
        .lp-light .lp-contact-section p { color: #4b5563 !important; }
        .lp-light .lp-contact-form { background: #ffffff !important; border-color: rgba(0,0,0,.08) !important; }
        .lp-light .lp-form-label { color: #374151 !important; }
        .lp-light input, .lp-light textarea { background: #f9fafb !important; color: #111827 !important; border-color: rgba(0,0,0,.12) !important; }
        .lp-light .lp-ticker { background: rgba(255,255,255,.95) !important; border-color: rgba(0,0,0,.1) !important; }
        .lp-light .lp-ticker-text { color: #374151 !important; }
        .lp-light .lp-human-section { background: #ffffff !important; }
        .lp-light .lp-human-section h2 { color: #111827 !important; }
        .lp-light .lp-human-section p { color: #4b5563 !important; }
        .lp-light .lp-human-bullet { color: #374151 !important; }
        .lp-root:not(.lp-light) .lp-swipe-hint { color: #9896b0 !important; }
        .lp-light .lp-swipe-hint { color: #374151 !important; }

        /* deliverable cards */
        .lp-root:not(.lp-light) .lp-deliverable-card { background: #0d0f1a !important; box-shadow: none !important; }
        .lp-root:not(.lp-light) .lp-deliverable-card.c1 { border-color: rgba(13,124,138,0.20) !important; }
        .lp-root:not(.lp-light) .lp-deliverable-card.c2 { border-color: rgba(13,124,138,0.22) !important; }
        .lp-root:not(.lp-light) .lp-deliverable-card.c3 { border-color: rgba(232,130,12,0.18) !important; }
        .lp-root:not(.lp-light) .lp-hero-card-title { color: #e8e6f4 !important; }
        .lp-root:not(.lp-light) .lp-hero-card-sub { color: #9896b0 !important; }
        .lp-root:not(.lp-light) .svg-bg { fill: #050810 !important; }
        .lp-root:not(.lp-light) .svg-inner-bg { fill: #070d18 !important; }
        .lp-root:not(.lp-light) .svg-text { fill: #c8c6d8 !important; }
        .lp-light .lp-deliverable-card { background: #ffffff !important; box-shadow: 0 4px 12px rgba(0,0,0,.05) !important; }
        .lp-light .lp-deliverable-card.c1 { border-color: rgba(13,124,138,0.20) !important; }
        .lp-light .lp-deliverable-card.c2 { border-color: rgba(13,124,138,0.22) !important; }
        .lp-light .lp-deliverable-card.c3 { border-color: rgba(232,130,12,0.18) !important; }
        .lp-light .lp-hero-card-title { color: #111827 !important; }
        .lp-light .lp-hero-card-sub { color: #6b7280 !important; }
        .lp-light .svg-bg { fill: #f4f6fb !important; }
        .lp-light .svg-inner-bg { fill: #ffffff !important; }
        .lp-light .svg-text { fill: #374151 !important; }


        /* check lists */
        .lp-light .lp-check-item { color: #374151 !important; }
        .lp-light .lp-check-icon { color: #0d7c8a !important; }
        /* testimonials */
        .lp-light .lp-testi-section { background: #f4f6fb !important; }
        .lp-light .lp-testi-section h2 { color: #111827 !important; }
        .lp-light .lp-testi-section p { color: #6b7280 !important; }
        .lp-light .lp-testi-card { background: #ffffff !important; border-color: rgba(0,0,0,.08) !important; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .lp-light .lp-testi-text { color: #374151 !important; }
        .lp-light .lp-testi-name { color: #111827 !important; }
        .lp-light .lp-testi-role { color: #9ca3af !important; }
        /* join banner */
        .lp-light .lp-join-banner { color: #111827 !important; }
        .lp-light .lp-join-banner span { color: #374151 !important; }
        /* contact section */
        .lp-light .lp-contact-section { background: #f4f6fb !important; }
        .lp-light .lp-contact-title { color: #111827 !important; }
        .lp-light .lp-contact-subtext { color: #4b5563 !important; }
        .lp-light .lp-contact-success-title { color: #111827 !important; }
        .lp-light .lp-contact-success-text { color: #6b7280 !important; }
        .lp-light .lp-contact-form { background: #ffffff !important; border: 1px solid rgba(0,0,0,.08) !important; box-shadow: 0 10px 30px rgba(0,0,0,.05); }
        .lp-light .lp-form-label { color: #374151 !important; }
        .lp-light input, .lp-light textarea { background: #f9fafb !important; color: #111827 !important; border-color: rgba(0,0,0,.12) !important; }
        .lp-light .lp-ticker { background: rgba(255,255,255,.95) !important; border-color: rgba(0,0,0,.1) !important; }
        .lp-contact-input::placeholder { color: rgba(255,255,255,0.55); }
        .lp-light .lp-contact-input::placeholder { color: rgba(17,17,17,0.45); }
        .lp-light .lp-contact-input { box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .lp-light .lp-contact-input:focus, .lp-contact-input:focus { border-color: #0d7c8a !important; box-shadow: 0 0 0 3px rgba(13,124,138,0.15); }

        /* ── HERO STATS ── */
        .lp-light .lp-stats { background: rgba(0,0,0,.04) !important; border: 1px solid rgba(0,0,0,.08) !important; backdrop-filter: none !important; }
        .lp-light .lp-stats .lp-stat-num { color: #111827 !important; text-shadow: none !important; }
        .lp-light .lp-stats .lp-stat-label { color: #6b7280 !important; }
        .lp-light .lp-stats .lp-stat-divider { background: rgba(0,0,0,.15) !important; }
        .lp-light .lp-stats .lp-stat { color: #111827 !important; }

        /* ── THEME TOGGLE BUTTON ── */
        .lp-theme-toggle {
          width: 42px; height: 22px; border-radius: 100px;
          border: 1px solid rgba(13,124,138,.4);
          background: rgba(13,124,138,.12);
          cursor: pointer; position: relative;
          display: flex; align-items: center; padding: 0 2px;
          transition: background .3s, border-color .3s;
          flex-shrink: 0;
        }
        .lp-theme-toggle:hover { border-color: ${THEME_COLOR}; }
        .lp-theme-toggle-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: linear-gradient(135deg, #00857a, #00c9b1);
          transition: transform .3s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 2px 5px rgba(0,0,0,.25);
        }
        .lp-theme-toggle.light .lp-theme-toggle-thumb {
          transform: translateX(20px);
          background: linear-gradient(135deg, #f97316, #fdba74);
        }
      `}</style>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} isDark={isDark} />}

      {/* Nav */}
      <nav
        className="lp-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="lp-nav-logo">
          <a href="https://aisprint.app" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={logoImg} alt="AI Sprint" className="lp-nav-logo-img" />
          </a>
        </div>

        <div className="lp-nav-actions">
          {/* Dark mode locked — toggle hidden. Re-enable by uncommenting:
          <button
            className={`lp-theme-toggle${isDark ? "" : " light"}`}
            onClick={() => setIsDark((d) => !d)}
            aria-label="Toggle dark/light mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="lp-theme-toggle-thumb" />
          </button> */}

          <button className="lp-btn-ghost" onClick={() => openAuth("login")}>
            Log In
          </button>

          <button
            className="lp-btn-primary"
            style={{ background: THEME }}
            onClick={() => openAuth("register")}
          >
            {activeTab === "2" ? "Start Level 2 Journey →" : "Start Level 1 Journey →"}
          </button>
        </div>
      </nav>

      {/* ── CINEMATIC HERO — full-bleed accounting image ─────────────────────── */}
      <section style={{ position:"relative", width:"100%", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", zIndex:1, contain:"layout style" }}>

        {/* Background image */}
        <div className="lp-acct-cin-bg" style={{
          position:"absolute", inset:0,
          backgroundImage:"url('/assets/Hero_Image_AI_Accounting.png')",
          backgroundSize:"cover",
          backgroundPosition:"70% center",
          backgroundRepeat:"no-repeat",
          animation:"lpHeroReveal 1.4s cubic-bezier(.22,1,.36,1) forwards",
        }} />

        {/* Left gradient overlay */}
        <div style={{
          position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(105deg, rgba(13,13,20,.95) 0%, rgba(13,13,20,.85) 30%, rgba(13,13,20,.52) 56%, rgba(13,13,20,.15) 76%, transparent 100%)",
        }} />

        {/* Bottom vignette */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:200, zIndex:1,
          background:"linear-gradient(to bottom, transparent, rgba(13,13,20,.97) 85%, #0d0d14 100%)",
        }} />

        {/* Content — left aligned */}
        <div className="lp-acct-cin-content" style={{
          position:"relative", zIndex:2,
          maxWidth:620, padding:"10rem 2.5rem 7rem",
          display:"flex", flexDirection:"column",
        }}>

          {/* Level selector pills */}
          <div style={{ display:"flex", gap:8, marginBottom:"1.4rem", animation:"lpRise .7s ease both", flexWrap:"wrap" }}>
            {(["1","2"] as const).map(lvl => {
              const color = LEVEL_THEMES[lvl].color;
              return (
                <button key={lvl} onClick={() => setActiveTab(lvl)} style={{
                  fontSize:".72rem", fontWeight:700, color,
                  background: activeTab === lvl ? `${color}28` : `${color}12`,
                  border:`1px solid ${activeTab === lvl ? color : `${color}45`}`,
                  borderRadius:100, padding:"5px 14px", cursor:"pointer",
                  transition:"all .2s",
                  boxShadow: activeTab === lvl ? `0 0 14px ${color}44` : "none",
                }}>{LEVEL_THEMES[lvl].label}</button>
              );
            })}
          </div>

          {/* Eyebrow */}
          <p style={{ fontSize:"clamp(.72rem,1.5vw,.85rem)", color:"rgba(200,200,220,.65)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:".8rem", marginTop:0, animation:"lpRise .75s .05s ease both" }}>
            Built for accountants, bookkeepers &amp; finance professionals.
          </p>

          {/* H1 — scrambled */}
          <h1 className="lp-acct-cin-h1" style={{
            fontFamily:"monospace", fontWeight:900,
            fontSize:"clamp(1.7rem,5vw,3.5rem)",
            lineHeight:.97, letterSpacing:"-.02em",
            color:"white", margin:"0 0 1rem",
          }}>{scrambledH1}</h1>

          {/* Tagline */}
          <p style={{ color:THEME, fontWeight:700, fontSize:".9rem", letterSpacing:".4px", margin:"0 0 .5rem", animation:"lpRise .85s .15s ease both" }}>
            {themeData.tagline}
          </p>

          {/* Sub */}
          <p style={{ color:"rgba(200,200,220,.75)", lineHeight:1.7, fontSize:".95rem", maxWidth:500, margin:"0 0 1.4rem", animation:"lpRise .9s .18s ease both" }}>
            {themeData.heroSub}
          </p>

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, color:THEME, background:`${THEME}1a`, border:`1px solid ${THEME}44`, borderRadius:100, padding:"5px 14px", fontSize:".7rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", width:"fit-content", margin:"0 0 1.6rem", animation:"lpRise .85s .12s ease both" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:THEME, boxShadow:`0 0 6px ${THEME}`, display:"inline-block", animation:"lpPulse 2s infinite" }} />
            ⚡ Accounting · AI · 28 Days
          </div>

          {/* CTA row */}
          <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap", marginBottom:"1.8rem", animation:"lpRise 1s .25s ease both" }}>
            <button
              style={{ background:THEME, color:"#fff", border:"none", padding:".9rem 2.2rem", borderRadius:100, fontWeight:800, fontSize:".9rem", cursor:"pointer", boxShadow:`0 8px 28px ${THEME}55`, transition:"transform .2s, box-shadow .2s", letterSpacing:".5px", whiteSpace:"nowrap" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 14px 36px ${THEME}66`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=""; (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 8px 28px ${THEME}55`; }}
              onClick={() => openAuth("register")}
            >{themeData.cta}</button>
            {activeTab === "2" && (
              <button
                onClick={() => setActiveTab("1")}
                style={{ color:"rgba(200,200,220,.8)", background:"transparent", border:"1px solid rgba(255,255,255,.18)", borderRadius:100, padding:".75rem 1.6rem", fontSize:".82rem", fontWeight:600, cursor:"pointer", transition:"border-color .2s, color .2s", whiteSpace:"nowrap" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=THEME; (e.currentTarget as HTMLButtonElement).style.color=THEME; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.18)"; (e.currentTarget as HTMLButtonElement).style.color="rgba(200,200,220,.8)"; }}
              >Start with Basic first</button>
            )}
          </div>

          {/* Stats strip */}
          <div ref={statsRef} style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:".9rem 0", width:"fit-content", animation:"lpRise 1.1s .35s ease both" }}>
            {([{num:s28,label:"Days"},{num:s15,label:"Min/Day"},{num:sEnrolled,label:"Enrolled"},{num:2,label:"Levels"}] as const).map((s,i,arr) => (
              <div key={i} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ textAlign:"center", padding:"0 1.3rem" }}>
                  <div style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.5rem", color:THEME, lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontSize:".6rem", letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(200,200,220,.45)", marginTop:".25rem", fontWeight:600 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width:1, height:32, background:"rgba(255,255,255,.1)" }} />}
              </div>
            ))}
          </div>

          {/* Urgency pill */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"rgba(249,115,22,.08)", border:"1px solid rgba(249,115,22,.25)", borderRadius:"100px", padding:".28rem 1rem", fontSize:".68rem", letterSpacing:"1.5px", textTransform:"uppercase", color:"#fb923c", fontWeight:700, marginTop:"1.2rem", width:"fit-content", animation:"lpRise 1.1s .4s ease both" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", display:"inline-block", animation:"lpPulse 2s infinite" }} />
            {themeData.urgency}
          </div>

        </div>
      </section>

      {/* Finance ledger divider 1 */}
      <div style={{ display:"flex", alignItems:"center", padding:"0 24px 40px", zIndex:1, position:"relative" }}>
        <div style={{ flex:1, height:1, background:`${THEME}25` }} />
        <div style={{ display:"flex", gap:10, padding:"0 18px", flexWrap:"wrap", justifyContent:"center" }}>
          {themeData.dividerMarks.map((m,i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:"12px", letterSpacing:"2px", color:`${THEME}99` }}>[ {m} ]</span>
          ))}
        </div>
        <div style={{ flex:1, height:1, background:`${THEME}25` }} />
      </div>

      {/* Hero visual cards (unchanged) */}
      <section style={{ padding:"0 1.5rem 3.5rem", background:"transparent", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ maxWidth:400, width:"100%" }}>
            <div ref={deliverablesScrollRef} data-autoscroll="1" style={{ display:"flex", flexDirection:"row", overflow:"hidden", scrollbarWidth:"none" as any }}>
              {/* Card 1 – Prompt Library */}
              <div className="lp-deliverable-card c1" style={{ borderRadius:14, overflow:"hidden", borderStyle:"solid", borderWidth:"1px", display:"flex", flexDirection:"column", flex:"0 0 100%", minWidth:0 }}>
                <svg width="100%" height="168" viewBox="0 0 220 168" aria-label="Accountant prompt library deliverable">
                  <rect className="svg-bg" width="220" height="168"/>
                  <text x="12" y="18" fill="#0d7c8a" fontSize="7" fontFamily="monospace" opacity=".8" letterSpacing="1">ACCOUNTANT PROMPT LIBRARY · v1.0</text>
                  <line x1="12" y1="22" x2="208" y2="22" stroke="#0a2030" strokeWidth=".5"/>
                  {[
                    { y:36, label:"01 · Transaction categorisation", cat:"BOOKKEEP" },
                    { y:54, label:"02 · Bank reconciliation review", cat:"RECONCILE" },
                    { y:72, label:"03 · Month-end close checklist", cat:"CLOSE" },
                    { y:90, label:"04 · Variance commentary draft", cat:"REPORT" },
                    { y:108, label:"05 · Client communication email", cat:"COMMS" },
                    { y:126, label:"06 · Expense policy checker", cat:"CONTROLS" },
                  ].map((r,i) => (
                    <g key={i}>
                      <rect x="12" y={r.y-11} width="196" height="14" rx="2" fill={i%2===0 ? "rgba(13,124,138,.06)" : "transparent"}/>
                      <text x="18" y={r.y} fill="#c8c6d8" fontSize="7.5" fontFamily="monospace">{r.label}</text>
                      <rect x="158" y={r.y-10} width="46" height="12" rx="2" fill="rgba(13,124,138,.15)"/>
                      <text x="181" y={r.y} fill="#0d7c8a" fontSize="6" fontFamily="monospace" textAnchor="middle">{r.cat}</text>
                    </g>
                  ))}
                  <text x="12" y="155" fill="#0d7c8a" fontSize="6" fontFamily="monospace" opacity=".5">AI SPRINT · DAY 26</text>
                  <circle cx="206" cy="151" r="4" fill="none" stroke="#0d7c8a" strokeWidth=".6" opacity=".5">
                    <animate attributeName="opacity" values=".5;1;.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", padding:"2px 8px", borderRadius:99, marginBottom:8, background:"rgba(13,124,138,.15)", color:"#0d7c8a" }}>Basic · Week 4</div>
                  <div className="lp-hero-card-title" style={{ fontSize:".82rem", fontWeight:700, marginBottom:".2rem" }}>Accountant prompt library</div>
                  <div className="lp-hero-card-sub" style={{ fontSize:".7rem", color:"#5a587a", letterSpacing:".4px" }}>Day 26 · Your reusable system</div>
                </div>
              </div>

              {/* Card 2 – Bank Reconciliation */}
              <div className="lp-deliverable-card c2" style={{ borderRadius:14, overflow:"hidden", borderStyle:"solid", borderWidth:"1px", display:"flex", flexDirection:"column", flex:"0 0 100%", minWidth:0 }}>
                <svg width="100%" height="168" viewBox="0 0 220 168" aria-label="Bank reconciliation workflow">
                  <rect className="svg-bg" width="220" height="168"/>
                  <text x="110" y="16" textAnchor="middle" fill="#0d7c8a" fontSize="7" fontFamily="monospace" opacity=".7" letterSpacing="1">BANK RECONCILIATION · WORKFLOW</text>
                  <line x1="12" y1="20" x2="208" y2="20" stroke="#0a2030" strokeWidth=".5"/>
                  <rect x="12" y="26" width="196" height="12" rx="2" fill="rgba(13,124,138,.12)"/>
                  <text x="18" y="35" fill="#0d7c8a" fontSize="6.5" fontFamily="monospace" opacity=".8">DATE</text>
                  <text x="65" y="35" fill="#0d7c8a" fontSize="6.5" fontFamily="monospace" opacity=".8">DESCRIPTION</text>
                  <text x="162" y="35" fill="#0d7c8a" fontSize="6.5" fontFamily="monospace" opacity=".8">AMOUNT</text>
                  <text x="196" y="35" fill="#0d7c8a" fontSize="6.5" fontFamily="monospace" opacity=".8">✓</text>
                  {[
                    { date:"01 May", desc:"Client payment", amt:"$4,200", match:true },
                    { date:"03 May", desc:"Office supplies", amt:"-$148", match:true },
                    { date:"05 May", desc:"Unknown debit", amt:"-$320", match:false },
                    { date:"08 May", desc:"Software sub.", amt:"-$89", match:true },
                    { date:"12 May", desc:"Invoice #1042", amt:"$2,800", match:true },
                  ].map((r,i) => (
                    <g key={i}>
                      <rect x="12" y={42+i*16} width="196" height="14" rx="1" fill={!r.match ? "rgba(239,68,68,.08)" : "transparent"}/>
                      <text x="18" y={52+i*16} fill={r.match ? "#c8c6d8" : "#f87171"} fontSize="6.5" fontFamily="monospace">{r.date}</text>
                      <text x="65" y={52+i*16} fill={r.match ? "#c8c6d8" : "#f87171"} fontSize="6.5" fontFamily="monospace">{r.desc}</text>
                      <text x="162" y={52+i*16} fill={r.match ? "#c8c6d8" : "#f87171"} fontSize="6.5" fontFamily="monospace">{r.amt}</text>
                      <text x="196" y={52+i*16} fill={r.match ? "#10b981" : "#ef4444"} fontSize="9" fontFamily="monospace">{r.match ? "✓" : "?"}</text>
                    </g>
                  ))}
                  <line x1="12" y1="124" x2="208" y2="124" stroke="#0a2030" strokeWidth=".5"/>
                  <rect x="12" y="128" width="196" height="16" rx="3" fill="rgba(13,124,138,.06)" stroke="rgba(13,124,138,.2)" strokeWidth=".4"/>
                  <text x="18" y="139" fill="#0d7c8a" fontSize="6.5" fontFamily="monospace">AI flagged 1 anomaly · $320 unmatched · review required</text>
                  <text x="12" y="160" fill="#0d7c8a" fontSize="6" fontFamily="monospace" opacity=".5">AI SPRINT · DAY 10</text>
                </svg>
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", padding:"2px 8px", borderRadius:99, marginBottom:8, background:"rgba(13,124,138,.15)", color:"#0d7c8a" }}>Basic · Week 2</div>
                  <div className="lp-hero-card-title" style={{ fontSize:".82rem", fontWeight:700, marginBottom:".2rem" }}>Bank reconciliation</div>
                  <div className="lp-hero-card-sub" style={{ fontSize:".7rem", color:"#5a587a", letterSpacing:".4px" }}>Day 10 · AI anomaly detection</div>
                </div>
              </div>

              {/* Card 3 – Month-End Close Checklist */}
              <div className="lp-deliverable-card c3" style={{ borderRadius:14, overflow:"hidden", borderStyle:"solid", borderWidth:"1px", display:"flex", flexDirection:"column", flex:"0 0 100%", minWidth:0 }}>
                <svg width="100%" height="168" viewBox="0 0 220 168" aria-label="Month-end close checklist">
                  <rect className="svg-bg" width="220" height="168"/>
                  <text x="12" y="18" fill="#e8820c" fontSize="7" fontFamily="monospace" opacity=".8" letterSpacing="1">MONTH-END CLOSE · MAY 2026</text>
                  <line x1="12" y1="22" x2="208" y2="22" stroke="#2a1200" strokeWidth=".5"/>
                  {[
                    { item:"Review all transactions", done:true },
                    { item:"Bank reconciliation", done:true },
                    { item:"Accruals & prepayments", done:true },
                    { item:"Variance analysis", done:true },
                    { item:"Management commentary", done:false },
                    { item:"CFO sign-off", done:false },
                  ].map((r,i) => (
                    <g key={i}>
                      <rect x="12" y={30+i*18} width="196" height="16" rx="3" fill={r.done ? "rgba(16,185,129,.06)" : "rgba(255,255,255,.02)"} stroke={r.done ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.04)"} strokeWidth=".4"/>
                      <rect x="18" y={33+i*18} width="10" height="10" rx="2" fill={r.done ? "#10b981" : "transparent"} stroke={r.done ? "#10b981" : "#555"} strokeWidth=".8"/>
                      {r.done && <text x="23" y={42+i*18} textAnchor="middle" fill="white" fontSize="7">✓</text>}
                      <text x="36" y={42+i*18} fill={r.done ? "#c8c6d8" : "#888"} fontSize="7.5" fontFamily="monospace" opacity={r.done ? 1 : .7}>{r.item}</text>
                      {r.done && <text x="198" y={42+i*18} fill="#10b981" fontSize="6" fontFamily="monospace" textAnchor="end">DONE</text>}
                    </g>
                  ))}
                  <rect x="12" y="142" width="196" height="14" rx="3" fill="rgba(232,130,12,.08)" stroke="rgba(232,130,12,.2)" strokeWidth=".5"/>
                  <text x="18" y="152" fill="#e8820c" fontSize="6.5" fontFamily="monospace">4/6 complete · Est. close: 3hrs remaining</text>
                  <text x="12" y="162" fill="#e8820c" fontSize="6" fontFamily="monospace" opacity=".5">AI SPRINT · DAY 16</text>
                </svg>
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", padding:"2px 8px", borderRadius:99, marginBottom:8, background:"rgba(232,130,12,.15)", color:"#e8820c" }}>Advanced · Week 1</div>
                  <div className="lp-hero-card-title" style={{ fontSize:".82rem", fontWeight:700, marginBottom:".2rem" }}>Month-end close checklist</div>
                  <div className="lp-hero-card-sub" style={{ fontSize:".7rem", color:"#5a587a", letterSpacing:".4px" }}>Day 16 · AI-assisted close</div>
                </div>
              </div>
            </div>
          </div>
          <p className="lp-swipe-hint" style={{ textAlign:"center", fontSize:".65rem", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:".8rem" }}>
            Sample deliverables — built by accountants in 15 minutes/day
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="lp-section" style={{ background: "#0d0d14" }}>
        <div className="lp-section-inner">
          <div className="lp-section-label" style={{ color: THEME }}>{themeData.sectionLabel}</div>
          <h2 className="lp-section-h2">{themeData.sectionH2}</h2>
          <p className="lp-section-sub">
            {activeTab === "1"
              ? "A structured, practical path to using AI in your daily accounting work — without the overwhelm."
              : "Level 2 builds on your foundation to deliver advisory AI skills — audits, operating models, and client deliverables that command premium rates."}
          </p>
          <div className="lp-why-grid" ref={cardsRef}>
            {(activeTab === "1" ? [
              { icon: "⏱", color: THEME_COLOR, bg: "rgba(13,124,138,.1)", title: "15 minutes a day", body: "Each lesson is structured: concept, walkthrough, and one practical accounting task.", delay: "0s" },
              { icon: "🧾", color: "#2f6fa8", bg: "rgba(47,111,168,.1)", title: "Real accounting workflows", body: "Learn how AI fits into bookkeeping, reconciliation, month-end close, and reporting.", delay: ".12s" },
              { icon: "🏆", color: L2_COLOR, bg: "rgba(232,130,12,.1)", title: "Build your prompt library", body: "Leave with 10+ reusable accounting prompts and a personal AI workflow — not just theory.", delay: ".24s" },
            ] : [
              { icon: "📊", color: L2_COLOR, bg: "rgba(232,130,12,.1)", title: "Strategic AI audits", body: "Use AI to identify automation opportunities and deliver structured recommendations to clients.", delay: "0s" },
              { icon: "🏛️", color: "#7c3aed", bg: "rgba(124,58,237,.1)", title: "AI-ready operating model", body: "Build a 90-day roadmap that transforms how your practice or client's finance function uses AI.", delay: ".12s" },
              { icon: "💼", color: "#2f6fa8", bg: "rgba(47,111,168,.1)", title: "Advisory-level deliverables", body: "Create client-ready reports, capability assessments, and AI governance frameworks.", delay: ".24s" },
            ]).map((c, i) => (
              <div key={i} className="lp-why-card lp-reveal visible"
                style={{ transition: `opacity .65s ease ${c.delay}, transform .65s ease ${c.delay}` }}>
                <div className="lp-why-icon" style={{ color: c.color, background: c.bg, fontSize: "1.4rem", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:12, marginBottom:"1rem" }}>{c.icon}</div>
                <h3 className="lp-card-title">{c.title}</h3>
                <p className="lp-card-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ledger divider 2 */}
      <div style={{ display:"flex", alignItems:"center", padding:"0 24px 0", zIndex:1, position:"relative" }}>
        <div style={{ flex:1, height:1, background:"rgba(13,124,138,.15)" }} />
        <div style={{ display:"flex", gap:10, padding:"0 18px" }}>
          {["REF: COURSE OUTCOMES", "SECTION B"].map((m,i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:"12px", letterSpacing:"2px", color:"rgba(13,124,138,.55)" }}>[ {m} ]</span>
          ))}
        </div>
        <div style={{ flex:1, height:1, background:"rgba(13,124,138,.15)" }} />
      </div>

      {/* What you'll learn + Who it's for */}
      <section className="lp-dark-section">
        <div className="lp-section-inner">
          <div className="lp-two-col">
            <div className="lp-col-block">
              <h3 className="lp-col-heading">What you'll learn</h3>
              <ul className="lp-check-list">
                {(activeTab === "1"
                  ? ["AI prompting for accounting tasks","Bookkeeping and reconciliation with AI","Month-end close and variance commentary","Internal controls and AI ethics in finance","Build a personal accountant prompt library"]
                  : ["Strategic AI audit methodology","AI-ready operating model design","Advisory deliverable frameworks","Client-facing AI governance policy","90-day transformation roadmap"]
                ).map((item,i) => (
                  <li key={i} className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> {item}</li>
                ))}
              </ul>
            </div>
            <div className="lp-col-block">
              <h3 className="lp-col-heading">Who it's for</h3>
              <ul className="lp-check-list">
                {(activeTab === "1"
                  ? ["No prior AI experience needed","Relevant for all accounting software users","Ideal foundation before the Advanced track"]
                  : ["Basic track graduates","Senior accountants & finance managers","Advisory-focused practitioners & firm owners"]
                ).map((item,i) => (
                  <li key={i} className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum preview — Days 1–7 */}
      <section className="lp-seven-day-section" style={{ padding:"60px 20px", background:"#111", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:THEME_COLOR, background:`rgba(13,124,138,.1)`, border:`1px solid rgba(13,124,138,.2)`, borderRadius:20, padding:"5px 14px", marginBottom:14 }}>
              What You'll Learn
            </div>
            <h2 style={{ fontSize:"clamp(1.5rem,3.5vw,2rem)", fontWeight:800, margin:"0 0 10px" }}>Your first 7 days, previewed</h2>
            <p style={{ color:"#888", fontSize:".92rem" }}>Every lesson is 15 minutes. Every day builds your accounting AI toolkit.</p>
          </div>
          <div ref={sevenDayScrollRef} style={{ display:"flex", flexDirection:"row", overflow:"hidden", scrollbarWidth:"none" as any }}>
            {(activeTab === "1" ? [
              { day:1, title:"What Accounting Looks Like in the AI Era", cat:"Foundations", color:THEME_COLOR },
              { day:2, title:"The Accounting Equation & Double-Entry — Refreshed", cat:"Foundations", color:THEME_COLOR },
              { day:3, title:"Reading Financial Statements with AI Assistance", cat:"Foundations", color:THEME_COLOR },
              { day:4, title:"The Modern Finance Tech Stack", cat:"Foundations", color:"#2f6fa8" },
              { day:5, title:"Your First AI Accounting Prompt", cat:"Apply", color:"#2f6fa8" },
              { day:6, title:"AI Errors in Accounting — What to Watch For", cat:"Controls", color:"#2f8c5c" },
              { day:7, title:"Mini-Project: AI Review Checklist & Finance Stack Map", cat:"Sprint 🏆", color:L2_COLOR },
            ] : [
              { day:1, title:"Advanced Prompting for Finance — Chains & Templates", cat:"Advanced", color:L2_COLOR },
              { day:2, title:"AI Audit Framework — The 5-Pillar Assessment", cat:"Advisory", color:L2_COLOR },
              { day:3, title:"Capability Scoring — Mapping Client AI Maturity", cat:"Advisory", color:"#7c3aed" },
              { day:4, title:"Automation Opportunity Identification", cat:"Strategy", color:"#2f6fa8" },
              { day:5, title:"Building the 90-Day Roadmap", cat:"Strategy", color:"#2f6fa8" },
              { day:6, title:"AI Governance & Controls for Advisory Firms", cat:"Controls", color:"#2f8c5c" },
              { day:7, title:"Mini-Project: AI Audit Report for a Real Client", cat:"Sprint 🏆", color:L2_COLOR },
            ]).map((d) => (
              <div key={d.day} className="lp-day-card" style={{
                display:"flex", alignItems:"center", gap:"1rem",
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
                borderRadius:12, padding:".85rem 1.2rem",
                flex:"0 0 100%", minWidth:0,
              }}>
                <div style={{ width:34, height:34, borderRadius:"50%", border:`2px solid ${d.color}`, color:d.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:".72rem", flexShrink:0, fontFamily:"monospace" }}>{d.day}</div>
                <div className="lp-day-title" style={{ flex:1, fontWeight:600, fontSize:".88rem" }}>{d.title}</div>
                <div style={{ fontSize:".65rem", fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:d.color, background:`${d.color}18`, borderRadius:100, padding:"3px 10px", whiteSpace:"nowrap" }}>{d.cat}</div>
              </div>
            ))}
          </div>
          <p className="lp-swipe-hint lp-day-hint" style={{ textAlign:"center", fontSize:".65rem", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:".5rem" }}>← swipe all 7 days →</p>
          <div style={{ textAlign:"center", marginTop:24 }}>
            <button onClick={() => openAuth("register")} style={{ background:"transparent", border:`1px solid ${THEME}80`, color:THEME, padding:"10px 28px", borderRadius:100, fontWeight:700, fontSize:".88rem", cursor:"pointer" }}>
              See all 28 days — start today →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-testi-section" style={{ padding:"60px 20px", background:"#0d0d14", borderTop:"1px solid rgba(255,255,255,.06)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:THEME_COLOR, background:`rgba(13,124,138,.1)`, border:`1px solid rgba(13,124,138,.2)`, borderRadius:20, padding:"5px 14px", marginBottom:14 }}>
              Student Stories
            </div>
            <h2 style={{ fontSize:"clamp(1.5rem,3.5vw,2rem)", fontWeight:800, color:"inherit", margin:"0 0 10px" }}>Real results from finance professionals</h2>
            <p style={{ color:"#888", fontSize:".95rem" }}>Accountants who went from AI-curious to AI-confident.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"row", overflow:"hidden", scrollbarWidth:"none" as any }}
            ref={(el) => { (testimonialsRef as any).current = el; (testiScrollRef as any).current = el; }}>
            {[
              { text:"Month-end close used to take 3 days. I'd been doing it the same way for 8 years. After the AI accounting sprint I'm done in under 6 hours. My CFO thinks I hired someone. I didn't.", name:"Daniel M.", role:"Senior Accountant, Sydney", initials:"DM", color:THEME_COLOR, photo:"/assets/testimonials/face-e.png" },
              { text:"I came in skeptical — I've been an accountant for 12 years and I've seen every productivity trend come and go. By Day 14 I had prompts that saved me 2 hours a week on reconciliations alone.", name:"Sarah K.", role:"Practice Owner, London", initials:"SK", color:"#2f6fa8", photo: null },
              { text:"The internal controls module alone was worth the entire course. My team now has a documented AI usage policy for client work. That's table stakes in 2026.", name:"Yuki S.", role:"Audit Manager, Tokyo", initials:"YS", color:L2_COLOR, photo:"/assets/testimonials/face-f.png" },
            ].map((t, i) => (
              <div key={i} className={`lp-testi-card lp-reveal ${revealTestimonials ? "visible" : ""}`} style={{
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)",
                borderRadius:16, padding:"1.4rem 1.5rem",
                display:"flex", flexDirection:"column", gap:"1rem",
                transition:`opacity .65s ease ${i*.15}s, transform .65s ease ${i*.15}s`,
                flex: "0 0 100%", minWidth: 0,
              }}>
                <div style={{ fontSize:".78rem", fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}33`, borderRadius:100, padding:"3px 10px", width:"fit-content" }}>Accounting · {activeTab === "1" ? "Basic" : "Advanced"}</div>
                <div className="lp-testi-text" style={{ color:"#ddd", fontSize:".88rem", lineHeight:1.7, fontStyle:"italic" }}>"{t.text}"</div>
                <div style={{ display:"flex", alignItems:"center", gap:".7rem", marginTop:"auto" }}>
                  {t.photo
                    ? <img src={t.photo} alt={t.name} style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0, border:`2px solid ${t.color}33` }} />
                    : <div style={{ width:36, height:36, borderRadius:"50%", background:`${t.color}22`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".78rem", flexShrink:0 }}>{t.initials}</div>
                  }
                  <div>
                    <div className="lp-testi-name" style={{ fontSize:".82rem", fontWeight:700, color:"inherit" }}>{t.name}</div>
                    <div className="lp-testi-role" style={{ fontSize:".72rem", color:"#666" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="lp-swipe-hint" style={{ textAlign:"center", fontSize:".65rem", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:".5rem" }}>← swipe for more →</p>
        </div>
      </section>

      <ContactSection isDark={isDark} />

      {/* Humanising section */}
      <section className="lp-human-section" style={{ padding:"60px 20px", background:"#0d0d14", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"820px", margin:"0 auto", display:"flex", flexDirection:"row", alignItems:"center", gap:"3rem", flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 260px", maxWidth:"100%" }}>
            <img src="/assets/testimonials/face-e.png" alt="Accountant using AI at work"
              style={{ width:"100%", borderRadius:20, objectFit:"cover", objectPosition:"center top",
                boxShadow:"0 20px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(13,124,138,.15)",
                border:"1px solid rgba(13,124,138,.2)" }} />
          </div>
          <div style={{ flex:1, minWidth:240 }}>
            <div style={{ fontSize:".7rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:THEME_COLOR, marginBottom:"1rem" }}>✦ Who this is for</div>
            <h2 style={{ fontSize:"clamp(1.4rem,3vw,1.9rem)", fontWeight:800, color:"inherit", lineHeight:1.25, marginBottom:"1rem" }}>
              You don't need to be a tech person.<br/>You need to be a better accountant.
            </h2>
            <p style={{ color:"var(--lp-body,#9896b0)", lineHeight:1.75, fontSize:".95rem", marginBottom:"1.25rem" }}>
              AI Sprint Accounting is built for finance professionals who want AI to make their actual work faster and sharper — not replace their judgement.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:".6rem", marginBottom:"1.5rem" }}>
              {[
                "Perfect if you work in accounting, bookkeeping, or finance",
                "Built around real workflows — reconciliation, close, reporting",
                "15 minutes a day — less than your morning commute",
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", gap:".65rem", alignItems:"flex-start" }}>
                  <span style={{ color:THEME_COLOR, fontWeight:800, flexShrink:0, marginTop:2 }}>✓</span>
                  <span className="lp-human-bullet" style={{ color:"var(--lp-body,#c8c6e0)", fontSize:".9rem", lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openAuth("register")}
              style={{ background:THEME_COLOR, color:"white", border:"none", padding:".75rem 1.8rem",
                borderRadius:100, fontWeight:700, fontSize:".9rem", cursor:"pointer",
                boxShadow:`0 8px 24px rgba(13,124,138,.3)` }}>
              {themeData.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA divider */}
      <div className="lp-join-banner" style={{ display:"flex", alignItems:"center", padding:"40px 24px 0", zIndex:1, position:"relative" }}>
        <div style={{ flex:1, height:1, background:`rgba(13,124,138,.35)` }}/>
        <div style={{ display:"flex", gap:10, padding:"0 18px" }}>
          {["START TODAY", activeTab === "1" ? "START BASIC TRACK" : "START ADVANCED TRACK"].map((m,i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:"12px", letterSpacing:"2px", color:THEME_COLOR, opacity:.7 }}>[ {m} ]</span>
          ))}
        </div>
        <div style={{ flex:1, height:1, background:`rgba(13,124,138,.35)` }}/>
      </div>

      {/* Final CTA */}
      <section id="lp-cta" className="lp-cta-section" style={{ background: THEME, paddingBottom: "60px" }}>
        <div className="lp-section-inner" style={{ textAlign: "center" }}>
          <h2 className="lp-cta-h2">
            {activeTab === "1" ? "Ready to become an AI-ready accountant?" : "Ready to deliver advisory-level AI work?"}
          </h2>
          <p className="lp-cta-sub" style={{ color:"rgba(255,255,255,.9)", fontWeight:600, fontSize:"1.05rem" }}>
            {activeTab === "1"
              ? "Join 423 accounting professionals building smarter workflows with AI — 15 minutes a day, 28 days, no fluff."
              : "Join 187 finance professionals building advisory AI skills that clients pay a premium for."}
          </p>
          <button className="lp-cta-btn" style={{ background:"#ffffff", color:THEME, fontWeight:"bold" }} onClick={() => openAuth("register")}>
            {themeData.cta}
          </button>
        </div>
      </section>

    </div>
  );
}