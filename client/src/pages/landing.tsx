import { useState } from "react";
import logoImg from "@/ai-sprint-logo.png";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/i18n";
import bannerVideo from "@/assets/Challenge-Badge Trim_small.mp4";
import {
  Mail,
  Lock,
  UserCircle,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Send,
  CheckCircle2,
} from "lucide-react";

function AuthModal({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let err: string | null = null;

    if (mode === "login") {
      const res = await login(email, password);
      if (res) err = res.message || String(res);
    } else {
      if (!displayName.trim()) {
        setError(t("auth.nameRequired"));
        setLoading(false);
        return;
      }
      const res = await register(email, password, displayName);
      if (res) err = res.message || String(res);
    }

    if (err) setError(err);
    setLoading(false);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="lp-modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="lp-modal-card">
        <button className="lp-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div
          className="auth-logo"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem",
          }}
        >
          <img src={logoImg} alt="AI Sprint" className="auth-logo-img" />
          <div className="auth-tagline" style={{ color: "#ddd" }}>
            Master Accounting. Leverage AI. Stay Ahead.
          </div>
        </div>

        {/* 
          All text inside the modal now has explicit inline styles 
          – no CSS classes can override these.
        */}
        <h1 className="auth-heading" style={{ color: "white", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>
          {mode === "login" ? "Welcome Back to Accounting in the AI Era" : t("auth.createAccount")}
        </h1>

        <p className="auth-subtext" style={{ color: "#ccc", marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center" }}>
          {mode === "login" ? t("auth.loginSubtext") : t("auth.signupSubtext")}
        </p>

        {error && (
          <div className="auth-error" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="modal-name" style={{ color: "white", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
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
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="modal-email" style={{ color: "white", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
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
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="modal-password" style={{ color: "white", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
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
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
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
                  color: "#aaa",
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
              <hr style={{ border: "none", borderTop: "1px solid #444" }} />
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(22, 23, 30, 0.8)",
                  backdropFilter: "blur(10px)",
                  padding: "0 10px",
                  fontSize: "0.75rem",
                  color: "#ccc",
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

        <div className="auth-switch" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "#ccc" }}>
          {mode === "login" ? (
            <>
              <p>
                {t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  style={{ background: "none", border: "none", color: "#3ab8c8", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                >
                  {t("auth.signup")}
                </button>
              </p>

              <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#aaa" }}>
                Having trouble logging in?{" "}
                <a
                  href="mailto:aisprint.app@outlook.com"
                  style={{ textDecoration: "underline", textUnderlineOffset: "2px", color: "#ccc" }}
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

// ── Contact Support Section (unchanged, but labels made lighter) ──
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setError("Something went wrong. Please try emailing us directly.");
      }
    } catch {
      setError("Network error. Please try emailing us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      style={{
        padding: "80px 20px",
        background: "var(--color-surface, #111)",
      }}
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
              color: "white",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Need help? We're here.
          </h2>
          <p style={{ color: "#888", fontSize: "1rem", margin: 0 }}>
            Send us a message and we'll get back to you at{" "}
            <a
              href="mailto:aisprint.app@outlook.com"
              style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              aisprint.app@outlook.com
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
            <h3 style={{ color: "white", margin: "0 0 8px", fontSize: "1.2rem" }}>
              Message sent!
            </h3>
            <p style={{ color: "#888", margin: 0 }}>
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
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <input type="hidden" name="access_key" value="9354c53d-f37d-4c31-845b-88286c03d1d4" />
            <input type="hidden" name="to" value="aisprint.app@outlook.com" />
            <input type="hidden" name="subject" value="Accounting Sprint Support Request" />
            <input type="hidden" name="from_name" value="AI Sprint Accounting Landing Page" />

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
                style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 6 }}
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
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
                style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 6 }}
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
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
                style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd" }}
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
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
  const THEME_COLOR = "#0d7c8a";

  return (
    <div className="lp-root">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <img src={logoImg} alt="AI Sprint" className="lp-nav-logo-img" />
        </div>

        <div className="lp-nav-actions">
          <button className="lp-btn-ghost" onClick={() => setShowAuth(true)}>
            Log In
          </button>
          <button className="lp-btn-primary" onClick={() => setShowAuth(true)}>
            Start Your Journey →
          </button>
        </div>
      </nav>

      <section className="lp-hero">
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "center", padding: "0 20px" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              maxWidth: "700px",
              borderRadius: "16px",
              boxShadow: `0 20px 40px rgba(124, 58, 237, 0.25)`,
              border: `1px solid rgba(124, 58, 237, 0.3)`,
            }}
          >
            <source src={bannerVideo} type="video/mp4" />
          </video>
        </div>

        <div className="lp-hero-badge" style={{ color: THEME_COLOR, background: "rgba(13, 124, 138, 0.1)", borderColor: "rgba(13, 124, 138, 0.2)" }}>
          ⚡ Accounting · AI · 28 Days
        </div>

        <h1 className="lp-hero-h1">{"In 28 days, become the accountant\nwho confidently works with AI."}</h1>
        <p className="lp-hero-tagline" style={{ color: THEME_COLOR }}>Master accounting fundamentals and AI workflows in just 15 minutes a day.</p>
        <p className="lp-hero-sub">
          Built for accountants, bookkeepers, and finance professionals who want to
          work smarter with AI — without losing the professional judgement that matters.
        </p>

        <div className="lp-hero-actions">
          <button className="lp-hero-cta" onClick={() => setShowAuth(true)}>
            Start the 28-Day Challenge →
          </button>
        </div>

        <div className="lp-stats">
          <div className="lp-stat">
            <span className="lp-stat-num">28</span>
            <span className="lp-stat-label">Days</span>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">15</span>
            <span className="lp-stat-label">Min/Day</span>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">Finance</span>
            <span className="lp-stat-label">Focused</span>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">Hands-On</span>
            <span className="lp-stat-label">Practical</span>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ background: "var(--color-surface)" }}>
        <div className="lp-section-inner">
          <div className="lp-section-label">ACCOUNTING + AI · BASIC TRACK</div>
          <h2 className="lp-section-h2">The practical way to master accounting with AI in 2026</h2>
          <p className="lp-section-sub">
            This 28-day Basic track is built for accountants and finance professionals who want a
            structured, practical path to using AI in their daily accounting work — without the overwhelm.
          </p>

          <div className="lp-why-grid">
            <div className="lp-why-card">
              <div className="lp-why-icon lp-why-icon--teal">⏱</div>
              <h3 className="lp-card-title">15 minutes a day</h3>
              <p className="lp-card-body">
                Each lesson is structured: concept, walkthrough, and one practical accounting task.
              </p>
            </div>

            <div className="lp-why-card">
              <div className="lp-why-icon lp-why-icon--purple">🧠</div>
              <h3 className="lp-card-title">Real accounting workflows</h3>
              <p className="lp-card-body">
                Learn how AI fits into bookkeeping, reconciliation, month-end close, and reporting.
              </p>
            </div>

            <div className="lp-why-card">
              <div className="lp-why-icon lp-why-icon--green">🏆</div>
              <h3 className="lp-card-title">Build your prompt library</h3>
              <p className="lp-card-body">
                Leave with 10+ reusable accounting prompts and a personal AI workflow — not just theory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-dark-section">
        <div className="lp-section-inner">
          <div className="lp-two-col">
            <div className="lp-col-block">
              <h3 className="lp-col-heading">What you'll learn</h3>
              <p className="lp-col-body">
                Accounting fundamentals, AI-assisted bookkeeping, reconciliation, 
                month-end close, prompting, controls, ethics, and reporting — all 2026 relevant.
              </p>
              <ul className="lp-check-list">
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> AI prompting for accounting tasks</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Bookkeeping and reconciliation with AI</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Month-end close and variance commentary</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Internal controls and AI ethics in finance</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Build a personal accountant prompt library</li>
              </ul>
            </div>

            <div className="lp-col-block">
              <h3 className="lp-col-heading">Who it's for</h3>
              <p className="lp-col-body">
                Accountants, bookkeepers, junior finance staff, and non-finance founders
                who want to use AI confidently in their daily finance work.
              </p>
              <ul className="lp-check-list">
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> No prior AI experience needed</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Relevant for all accounting software users</li>
                <li className="lp-check-item"><span className="lp-check-icon">✓</span> Ideal foundation before the Advanced track</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      <section className="lp-cta-section">
        <div className="lp-section-inner" style={{ textAlign: "center" }}>
          <h2 className="lp-cta-h2">Ready to become an AI-ready accountant?</h2>
          <p className="lp-cta-sub">
            Join accountants and finance professionals building smarter workflows
            with AI — 15 minutes a day, 28 days, no fluff.
          </p>
          <button className="lp-cta-btn" onClick={() => setShowAuth(true)}>
            Start the Basic Track →
          </button>
        </div>
      </section>
    </div>
  );
}
