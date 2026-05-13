// ── AI Sprint · AI Strategy for Business Leaders ────────────────────────────────────────────────
// File: landing.tsx | Repo: ai-strategy
// Last updated: May 2025
import { useState, useEffect, useRef } from "react";
import logoImg from "@assets/ai-sprint-logo.jpg";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/i18n";
import {
  Mail, Lock, UserCircle, ArrowRight, AlertCircle,
  Eye, EyeOff, X, Brain, BarChart2, Shield,
  BookOpen, Target, Layers, Send, CheckCircle2,
} from "lucide-react";

const L1_COLOR = "#0d7c8a";
const L2_COLOR = "#d97706";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

// ── Auth Modal ────────────────────────────────────────────────────
function AuthModal({ onClose, defaultLevel, defaultMode = "register" }: { onClose: () => void; defaultLevel: "1" | "2"; defaultMode?: "login" | "register" }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const THEME = defaultLevel === "2" ? L2_COLOR : L1_COLOR;

  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseUrl, setPurchaseUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPurchaseUrl(null);
    setLoading(true);

    let err: string | null = null;

    if (mode === "login") {
      const res = await login(email, password);
      if (res) {
        err = res.message || String(res);
        if ("purchaseUrl" in res && res.purchaseUrl) setPurchaseUrl(res.purchaseUrl);
      } else { onClose(); return; }
    } else {
      if (!displayName.trim()) {
        setError(t("auth.nameRequired"));
        setLoading(false);
        return;
      }
      const res = await register(email, password, displayName);
      if (res) {
        err = res.message || String(res);
        if ("purchaseUrl" in res && res.purchaseUrl) setPurchaseUrl(res.purchaseUrl);
      } else { onClose(); return; }
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
        <button className="lp-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>

        {/* Logo & tagline — forced light text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <img src={logoImg} alt="AI Sprint" className="auth-logo-img" />
          <div className="auth-tagline" style={{ color: "#ddd" }}>Learn AI Fast. Stay Ahead Forever.</div>
        </div>

        {/* Headings — forced white */}
        <h1 className="auth-heading" style={{ color: "white", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>
          {mode === "login"
            ? `Welcome back to ${defaultLevel === "2" ? "Level 2 Advanced" : "Level 1 Basic"}`
            : t("auth.createAccount")
          }
        </h1>

        <p className="auth-subtext" style={{ color: "#ccc", marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center" }}>
          {mode === "login"
            ? defaultLevel === "2"
              ? "Build the AI strategy and governance skills that organizations need now."
              : "Build the AI fluency that makes you valuable in any AI conversation."
            : t("auth.signupSubtext")
          }
        </p>

        {/* Error messages */}
        {error && (
          <div className="auth-error" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {purchaseUrl && (
          <div className="auth-error" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <AlertCircle size={14} />
            <span>
              You may need a valid license for this level.{" "}
              <a href={purchaseUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", fontWeight: 600, color: "#fca5a5" }}>
                View Pricing & Upgrades →
              </a>
            </span>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
                placeholder="Your password"
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
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((s) => !s)}
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
            style={{ background: THEME, color: "#000", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "10px", boxShadow: `0 4px 14px ${THEME}66` }}
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>

          <div style={{ position: "relative", margin: "25px 0" }}>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
            <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "rgba(22, 23, 30, 0.8)", padding: "0 15px", fontSize: "0.7rem", color: "#ccc", fontWeight: 800, letterSpacing: "1px" }}>OR</span>
          </div>

          <a
            href="/api/auth/google"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "12px", borderRadius: "8px", background: "#f0f0f0", color: "#000", fontWeight: "bold", textDecoration: "none", transition: "transform 0.2s" }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
          </a>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "#ccc" }}>
          {mode === "login" ? (
            <>
              <p>
                Don't have an account?{" "}
                <button onClick={() => { setMode("register"); setError(null); setPurchaseUrl(null); }} style={{ background: "none", border: "none", color: THEME, fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                  Sign up
                </button>
              </p>
              <p style={{ marginTop: "1rem" }}>
                Having trouble?{" "}
                <a href="mailto:support@aisprint.app" style={{ textDecoration: "underline", color: "#aaa" }}>Contact Support</a>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(null); setPurchaseUrl(null); }} style={{ background: "none", border: "none", color: THEME, fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Contact Section (unchanged, but label colors improved) ──────
function ContactSection({ theme }: { theme: string }) {
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
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) { setSubmitted(true); form.reset(); }
      else setError("Something went wrong. Please try emailing us directly.");
    } catch {
      setError("Network error. Please try emailing us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="lp-contact-section" style={{ padding: "80px 20px", background: "#111" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme, background: `${theme}1a`, border: `1px solid ${theme}33`, borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
            <Mail size={12} /> Contact Support
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "inherit", margin: "0 0 12px", lineHeight: 1.2 }}>Need help? We're here.</h2>
          <p style={{ color: "#888", fontSize: "1rem", margin: 0 }}>
            Send us a message and we'll get back to you at{" "}
            <a href="mailto:support@aisprint.app" style={{ color: theme, textDecoration: "underline", textUnderlineOffset: 3 }}>support@aisprint.app</a>
          </p>
        </div>
        {submitted ? (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h3 className="lp-contact-success-title" style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>Message sent!</h3>
            <p className="lp-contact-success-text" style={{ margin: 0 }}>We'll get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: "none", border: "1px solid #333", color: "#888", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
            <input type="hidden" name="access_key" value="9354c53d-f37d-4c31-845b-88286c03d1d4" />
            <input type="hidden" name="subject" value="AI Sprint Strategy Course Support Request" />
            <input type="hidden" name="from_name" value="AI Sprint Strategy Course Landing Page" />
            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={14} /> {error}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="lp-form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 6 }}><UserCircle size={13} /> Your Name</label>
              <input type="text" name="name" placeholder="Jane Doe" required className="lp-contact-input" style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="lp-form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 6 }}><Mail size={13} /> Your Email</label>
              <input type="email" name="email" placeholder="you@example.com" required className="lp-contact-input" style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="lp-form-label" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ddd" }}>Message</label>
              <textarea name="message" placeholder="Describe your issue or question…" required rows={5} className="lp-contact-input lp-contact-textarea" style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
            </div>
            <button type="submit" disabled={submitting} style={{ padding: "13px", borderRadius: 8, border: "none", background: submitting ? "#555" : theme, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s", boxShadow: submitting ? "none" : `0 4px 14px ${theme}55` }}>
              <Send size={15} />
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Landing Page (unchanged except AuthModal integration) ────────
export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authLevel, setAuthLevel] = useState<"1" | "2">("1");
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [activeTab, setActiveTab] = useState<"1" | "2">("1");
  const THEME = activeTab === "2" ? L2_COLOR : L1_COLOR;

  // ── Cursor glow ──────────────────────────────────────────────
  const cursorRef = useRef<HTMLDivElement>(null);

  // ── H1 scramble — re-fires on tab change ─────────────────────
  const H1s = {
    "1": "In 28 days, go from AI-aware to AI-fluent — and lead with confidence.",
    "2": "In 28 days, become the leader who sets AI strategy, policy, and direction.",
  };
  const [scrambledH1, setScrambledH1] = useState(H1s["1"]);

  // ── Animated stat counters ────────────────────────────────────
  const [s28, setS28] = useState(0);
  const [s15, setS15] = useState(0);
  const [s2, setS2] = useState(0);
  const [s0, setS0] = useState(1);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsFired = useRef(false);

  // ── Ticker ────────────────────────────────────────────────────
  const TICKS: Record<"1"|"2", string[]> = {
    "1": [
      "🚀 Sarah just completed her AI Fluency audit · Day 14",
      "🏆 James unlocked Prompt Pro rank · Basic",
      "✨ 3 new business leaders enrolled in Basic today",
      "🧠 Emily mapped her team's AI risk framework · Week 2",
      "🔥 Dee is on a 9-day streak · Basic track",
    ],
    "2": [
      "📋 Sarah presented her AI governance policy to the board",
      "🏆 James unlocked AI Strategy Leader rank · Advanced",
      "✨ 187 executives enrolled in Advanced this month",
      "🧠 Emily launched her organisation's AI roadmap · Week 3",
      "🔥 Dee is on a 14-day streak · Advanced track",
    ],
  };
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  // ── Scroll reveal ─────────────────────────────────────────────
  const [revealCards, setRevealCards] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [revealTestimonials, setRevealTestimonials] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const testiScrollRef = useRef<HTMLDivElement>(null);

  function openAuth(level: "1" | "2", mode: "login" | "register" = "register") {
    setAuthLevel(level);
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

  // H1 scramble — re-fires on tab change
  useEffect(() => {
    const target = H1s[activeTab];
    let frame = 0;
    const total = 28;
    const iv = setInterval(() => {
      setScrambledH1(target.split("").map((char, i) => {
        if (char === " ") return " ";
        if (frame / total > i / target.length + 0.1) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      frame++;
      if (frame > total) { setScrambledH1(target); clearInterval(iv); }
    }, 40);
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
      run(setS2, 2, 600);
      run(setS0, 0, 400);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ticker — resets on tab change
  useEffect(() => {
    setTickerIdx(0);
    const iv = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => { setTickerIdx(i => (i + 1) % TICKS[activeTab].length); setTickerVisible(true); }, 350);
    }, 4000);
    return () => clearInterval(iv);
  }, [activeTab]);

  // Scroll reveal — feature cards
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealCards(true);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [activeTab]);

  // Scroll reveal — testimonials
  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealTestimonials(true);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── AUTO-SCROLL testimonials: one card at a time ──
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    let paused = false;
    function advance() {
      const el = testiScrollRef.current;
      if (!el || paused) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.style.scrollBehavior = "auto"; el.scrollLeft = 0;
        requestAnimationFrame(() => { el.style.scrollBehavior = "smooth"; });
      } else { el.style.scrollBehavior = "smooth"; el.scrollLeft += el.clientWidth; }
    }
    const el = testiScrollRef.current;
    if (el) {
      el.style.scrollBehavior = "smooth";
      el.addEventListener("mouseenter", () => { paused = true; });
      el.addEventListener("mouseleave", () => { paused = false; });
      el.addEventListener("touchstart", () => { paused = true; }, { passive: true });
      el.addEventListener("touchend", () => { setTimeout(() => { paused = false; }, 1500); }, { passive: true });
    }
    timer = setInterval(advance, 3200);
    return () => { if (timer) clearInterval(timer); };
  }, []);

  return (
    <div className={`lp-root${isDark ? "" : " lp-light"}`} style={{ "--color-primary": THEME, background: isDark ? "#0d0d14" : "#f4f6fb", color: isDark ? "#e8e6f4" : "#1a1a2e", minHeight: "100vh" } as any}>

      {/* Cursor glow */}
      <div ref={cursorRef} style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(600px at var(--cx,50%) var(--cy,50%), ${THEME}12, transparent 70%)`,
        transition: "background 0.4s ease",
      }} />

      {/* Circuit grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${THEME}06 1px,transparent 1px),linear-gradient(90deg,${THEME}06 1px,transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: "linear-gradient(to bottom,rgba(0,0,0,.6) 0%,transparent 55%)",
        WebkitMaskImage: "linear-gradient(to bottom,rgba(0,0,0,.6) 0%,transparent 55%)",
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
        <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:`${THEME}99`, flexShrink:0, fontFamily:"monospace" }}>LIVE</span>
      </div>

      <style>{`
        @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
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
        .lp-light .lp-cta-section { background: var(--color-primary) !important; }
        .lp-light h1, .lp-light h2, .lp-light h3 { color: #111827 !important; }
        .lp-light p { color: #374151 !important; }
        .lp-light .lp-hero-sub { color: #4b5563 !important; }
        .lp-light .lp-hero-tagline { color: var(--color-primary) !important; }
        .lp-light .lp-nav { background: rgba(255,255,255,.95) !important; border-bottom: 1px solid rgba(0,0,0,.07); }
        .lp-light .lp-btn-ghost { color: #374151 !important; border-color: rgba(0,0,0,.15) !important; }
        .lp-light .lp-hero-module-card { background: #ffffff !important; border-color: rgba(0,0,0,.09) !important; color: #374151 !important; }
        .lp-light .lp-hero-h1 { color: #111827 !important; }
        .lp-light .lp-hero-outline { color: #374151 !important; border-color: rgba(0,0,0,.2) !important; }
        .lp-light .lp-why-card { background: #ffffff !important; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .lp-light .lp-card-title { color: #111827 !important; }
        .lp-light .lp-card-body { color: #4b5563 !important; }
        .lp-light .lp-two-col { background: #f4f6fb !important; }
        .lp-light .lp-col-block { background: #ffffff !important; border-color: rgba(0,0,0,.08) !important; box-shadow: 0 2px 12px rgba(0,0,0,.05); }
        .lp-light .lp-col-heading { color: #111827 !important; }
        .lp-light .lp-col-body { color: #4b5563 !important; }
        .lp-light .lp-check-item { color: #374151 !important; }
        .lp-light .lp-check-icon { color: var(--color-primary) !important; }
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


        /* 7-day preview */
        .lp-light .lp-seven-day-section { background: #f4f6fb !important; }
        .lp-light .lp-seven-day-section h2 { color: #111827 !important; }
        .lp-light .lp-seven-day-section p { color: #6b7280 !important; }
        .lp-light .lp-day-card { background: #ffffff !important; border-color: rgba(0,0,0,.09) !important; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
        .lp-light .lp-day-title { color: #111827 !important; }
        .lp-light .lp-day-hint { color: #9ca3af !important; }
        /* contact — granular selectors */
        .lp-light .lp-contact-title { color: #111827 !important; }
        .lp-light .lp-contact-subtext { color: #4b5563 !important; }
        .lp-light .lp-contact-success-title { color: #111827 !important; }
        .lp-light .lp-contact-success-text { color: #6b7280 !important; }
        .lp-light .lp-contact-form { background: #ffffff !important; border: 1px solid rgba(0,0,0,.08) !important; box-shadow: 0 10px 30px rgba(0,0,0,.05); }
        .lp-contact-input::placeholder { color: rgba(255,255,255,0.55); }
        .lp-light .lp-contact-input::placeholder { color: rgba(17,17,17,0.45); }
        .lp-light .lp-contact-input { box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .lp-light .lp-contact-input:focus, .lp-contact-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.08); }


        .lp-light .lp-recommendation-text { color: #111827 !important; }
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
          transition: background .3s, border-color .3s; flex-shrink: 0;
        }
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

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultLevel={authLevel} defaultMode={authMode} />}

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
    <a
      href="https://aisprint.app"
      style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
    >
      <img src={logoImg} alt="AI Sprint" className="lp-nav-logo-img" />
    </a>
  </div>

  <div className="lp-nav-actions">
    <button
      className={`lp-theme-toggle${isDark ? "" : " light"}`}
      onClick={() => setIsDark((d) => !d)}
      aria-label="Toggle dark/light mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="lp-theme-toggle-thumb" />
    </button>

    <button className="lp-btn-ghost" onClick={() => openAuth(activeTab, "login")}>
      Log In
    </button>

    <button
      className="lp-btn-primary"
      style={{ background: THEME }}
      onClick={() => openAuth(activeTab, "register")}
    >
      {activeTab === "2" ? "Start Level 2 Journey →" : "Start Level 1 Journey →"}
    </button>
  </div>
</nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-badge" style={{ color: THEME, background: `${THEME}1a`, borderColor: `${THEME}44` }}>
          {activeTab === "2" ? "⚡ AI Leadership & Strategy" : "🚀 AI Fluency for Professionals"}
        </div>

        {/* Course identity block */}
        <div style={{
          margin: "1.2rem auto 0", padding: "22px 28px 20px",
          background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)",
          borderRadius: "16px", maxWidth: "680px", textAlign: "center", position: "relative",
        }}>
          <div style={{ position:"absolute", top:9, left:14, fontSize:13, fontFamily:"monospace", color:`${THEME}cc`, letterSpacing:"1.5px" }}>
            MODULE No. AI-STRAT-L0{activeTab}
          </div>
          <div style={{ position:"absolute", top:9, right:14, fontSize:13, fontFamily:"monospace", color:`${THEME}cc`, letterSpacing:"1.5px" }}>
            {activeTab === "1" ? "BASIC · 28 DAYS" : "ADVANCED · 28 DAYS"}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: "clamp(1.3rem,4vw,1.9rem)", fontWeight: 900, color: "inherit", letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.2, marginBottom: ".5rem" }}>
              AI Strategy for Business Leaders
            </div>
            <div style={{ fontSize: ".8rem", color: "#555", letterSpacing: ".06em", marginBottom: ".75rem", fontFamily: "monospace" }}>
              56-DAY COURSE · 15 MIN/DAY · 2 LEVELS
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setActiveTab("1")} style={{
                fontSize: ".82rem", fontWeight: 700, color: L1_COLOR,
                background: activeTab === "1" ? `${L1_COLOR}25` : `${L1_COLOR}12`,
                border: `1px solid ${activeTab === "1" ? L1_COLOR : `${L1_COLOR}25`}`,
                borderRadius: 100, padding: "3px 12px", cursor: "pointer", transition: "all 0.2s",
              }}>L1 · Basic · Days 1–28</button>
              <button onClick={() => setActiveTab("2")} style={{
                fontSize: ".82rem", fontWeight: 700, color: L2_COLOR,
                background: activeTab === "2" ? `${L2_COLOR}25` : `${L2_COLOR}12`,
                border: `1px solid ${activeTab === "2" ? L2_COLOR : `${L2_COLOR}25`}`,
                borderRadius: 100, padding: "3px 12px", cursor: "pointer", transition: "all 0.2s",
              }}>L2 · Advanced · Days 29–56</button>
            </div>
          </div>
        </div>

        <h1 className="lp-hero-h1" style={{ fontFamily: "monospace", letterSpacing: "-.01em" }}>{scrambledH1}</h1>
        <p className="lp-hero-tagline" style={{ color: THEME }}>
          {activeTab === "2" ? "Board-ready strategy. Governance. Agentic AI." : "Fluency. Prompting. Tools. Risk."}
        </p>
        <p className="lp-hero-sub">
          {activeTab === "2"
            ? "Level 2 is for professionals who already have AI fluency and are ready to design strategy, govern AI systems, and lead organizational transformation."
            : "Level 1 builds the AI foundation every professional needs — the language, tools, mindset, and risk awareness to stop being a passenger in AI conversations."
          }
        </p>

        {/* Audience line */}
        <p style={{
          fontSize: "0.88rem",
          color: "var(--color-text-muted, #888)",
          maxWidth: "520px",
          margin: "0 auto",
          lineHeight: 1.6,
          textAlign: "center",
          fontStyle: "italic",
        }}>
          Designed for non‑technical business leaders, marketing, and operations professionals. No coding required.
        </p>

        {/* Level tabs */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "2rem 0 1rem", flexWrap: "wrap" }}>
          {(["1", "2"] as const).map((lvl) => {
            const color = lvl === "1" ? L1_COLOR : L2_COLOR;
            const label = lvl === "1" ? "Level 1 · Basic" : "Level 2 · Advanced";
            const active = activeTab === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveTab(lvl)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 24px", borderRadius: "50px", cursor: "pointer",
                  border: `1.5px solid ${active ? color : "rgba(255,255,255,0.15)"}`,
                  background: active ? `${color}1a` : "transparent",
                  color: active ? color : "rgba(255,255,255,0.5)",
                  fontWeight: 700, fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="lp-hero-actions">
          <button className="lp-hero-cta" style={{ background: THEME }}
            onClick={() => openAuth(activeTab, "register")}>
            {activeTab === "2" ? "Start Level 2 Journey →" : "Start Level 1 Journey →"}
          </button>
          {activeTab === "2" && (
            <button className="lp-hero-outline" onClick={() => setActiveTab("1")}>
              Start with Level 1 first
            </button>
          )}
        </div>

        {/* Urgency pill */}
        <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0 0" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: ".45rem",
            background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.25)",
            borderRadius: "100px", padding: ".28rem 1rem",
            fontSize: ".72rem", letterSpacing: "1.5px", textTransform: "uppercase",
            color: "#fb923c", fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block", animation: "lpPulse 2s infinite" }} />
            {activeTab === "1" ? "412 business leaders enrolled in Basic this month" : "187 executives enrolled in Advanced this month"}
          </div>
        </div>

        {/* Animated stats */}
        <div className="lp-stats" ref={statsRef}>
          <div className="lp-stat"><span className="lp-stat-num">{s28}</span><span className="lp-stat-label">Days</span></div>
          <div className="lp-stat-divider" />
          <div className="lp-stat"><span className="lp-stat-num">{s15}</span><span className="lp-stat-label">Min/Day</span></div>
          <div className="lp-stat-divider" />
          <div className="lp-stat"><span className="lp-stat-num">{s2}</span><span className="lp-stat-label">Levels</span></div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">{s0}</span>
            <span className="lp-stat-label">Exp. Needed</span>
          </div>
        </div>
      </section>

      {/* Tech divider */}
      <div style={{ display:"flex", alignItems:"center", padding:"0 24px 40px", zIndex:1, position:"relative" }}>
        <div style={{ flex:1, height:1, background:`${THEME}25` }}/>
        <div style={{ display:"flex", gap:10, padding:"0 18px", flexWrap:"wrap", justifyContent:"center" }}>
          {["↔ 28 DAYS", `⚡ LEVEL 0${activeTab}`, "15 MIN/DAY"].map((m,i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:"12px", letterSpacing:"2px", color:`${THEME}88` }}>[ {m} ]</span>
          ))}
        </div>
        <div style={{ flex:1, height:1, background:`${THEME}25` }}/>
      </div>

      {/* What you'll learn */}
      <section className="lp-section" style={{ background: "#0d0d14" }}>
        <div className="lp-section-inner">
          <div className="lp-section-label" style={{ color: THEME }}>
            {activeTab === "2" ? "LEVEL 2 ADVANCED" : "LEVEL 1 BASIC"}
          </div>
          <h2 className="lp-section-h2">
            {activeTab === "2" ? "Lead AI strategy from the front" : "Build unshakeable AI fluency"}
          </h2>
          <p className="lp-section-sub">
            {activeTab === "2"
              ? "Level 2 is for professionals ready to move beyond using AI to designing, governing, and scaling it across their organization."
              : "Level 1 gives you everything you need to be the most AI‑capable person in any room — without writing a line of code."
            }
          </p>

          <div className="lp-why-grid" ref={cardsRef}>
            {activeTab === "1" ? (
              <>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease 0s, transform .65s ease 0s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><BookOpen size={24} /></div>
                  <h3 className="lp-card-title">AI fluency</h3>
                  <p className="lp-card-body">Understand LLMs, the tool landscape, and AI categories — so you're never lost in an AI conversation again.</p>
                </div>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease .12s, transform .65s ease .12s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><Target size={24} /></div>
                  <h3 className="lp-card-title">Prompting mastery</h3>
                  <p className="lp-card-body">Chain‑of‑thought, role prompting, few‑shot examples — build a reusable prompt library for your team.</p>
                </div>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease .24s, transform .65s ease .24s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><Shield size={24} /></div>
                  <h3 className="lp-card-title">Risk awareness</h3>
                  <p className="lp-card-body">Hallucinations, data privacy, EU AI Act basics — understand the risks before they become your problem.</p>
                </div>
              </>
            ) : (
              <>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease 0s, transform .65s ease 0s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><BarChart2 size={24} /></div>
                  <h3 className="lp-card-title">AI strategy</h3>
                  <p className="lp-card-body">Prioritize AI opportunities, build the business case, and produce a board‑ready 6‑month strategy.</p>
                </div>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease .12s, transform .65s ease .12s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><Shield size={24} /></div>
                  <h3 className="lp-card-title">Governance & compliance</h3>
                  <p className="lp-card-body">Design AI governance frameworks. Navigate EU AI Act and NIST RMF without a legal team.</p>
                </div>
                <div className={`lp-why-card lp-reveal ${revealCards ? "visible" : ""}`} style={{ transition:"opacity .65s ease .24s, transform .65s ease .24s" }}>
                  <div className="lp-why-icon" style={{ color: THEME, background: `${THEME}1a` }}><Layers size={24} /></div>
                  <h3 className="lp-card-title">Agentic AI leadership</h3>
                  <p className="lp-card-body">Design human‑in‑the‑loop workflows and govern autonomous AI systems — the critical skill of 2026.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What you'll build / who it's for */}
      <section className="lp-dark-section">
        <div className="lp-section-inner">
          <div className="lp-two-col">
            <div className="lp-col-block">
              <h3 className="lp-col-heading">What you'll build</h3>
              <ul className="lp-check-list">
                {activeTab === "1" ? (
                  <>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> 10‑prompt reusable library for your team</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Team AI use policy (1‑pager)</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> AI‑assisted weekly workflow map</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Agentic AI use case brief</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Personal AI Toolkit (capstone document)</li>
                  </>
                ) : (
                  <>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> AI opportunity matrix with ROI estimates</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> AI governance charter</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Agentic AI pilot design document</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Change management plan</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Board‑ready 6‑month AI strategy (capstone)</li>
                  </>
                )}
              </ul>
            </div>
            <div className="lp-col-block">
              <h3 className="lp-col-heading">Who it's for</h3>
              <ul className="lp-check-list">
                {activeTab === "1" ? (
                  <>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Professionals curious about AI</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Managers wanting to lead AI conversations</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Anyone who wants AI fluency without coding</li>
                  </>
                ) : (
                  <>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Level 1 graduates (or AI‑fluent professionals)</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Directors, VPs, and C‑suite leaders</li>
                    <li className="lp-check-item"><span className="lp-check-icon" style={{ color: THEME }}>✓</span> Strategy and transformation professionals</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisite callout for Level 2 */}
      {activeTab === "2" && (
        <section style={{ padding: "40px 20px", background: `${L1_COLOR}0d`, borderTop: `1px solid ${L1_COLOR}22`, borderBottom: `1px solid ${L1_COLOR}22` }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${L1_COLOR}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BookOpen size={20} color={L1_COLOR} />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="lp-recommendation-text" style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
                New to AI? Start with Level 1 first.
              </div>
              <div style={{ color: "#888", fontSize: "0.9rem" }}>
                Level 2 assumes AI fluency. If you're still building your AI foundation, Level 1 is your on‑ramp.
              </div>
            </div>
            <button
              onClick={() => setActiveTab("1")}
              style={{ padding: "10px 22px", borderRadius: 8, border: `1px solid ${L1_COLOR}`, color: L1_COLOR, background: "transparent", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 }}
            >
              Explore Level 1 →
            </button>
          </div>
        </section>
      )}

      <ContactSection theme={THEME} />

      {/* Testimonials */}
      <section className="lp-testi-section" style={{ padding:"60px 20px", background:"#0d0d14", borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:THEME, background:`${THEME}18`, border:`1px solid ${THEME}30`, borderRadius:20, padding:"5px 14px", marginBottom:14 }}>
              Student Stories
            </div>
            <h2 style={{ fontSize:"clamp(1.5rem,3.5vw,2rem)", fontWeight:800, color:"inherit", margin:"0 0 10px" }}>Real results from business leaders</h2>
            <p style={{ color:"#888", fontSize:".95rem" }}>Executives and professionals who went from AI-aware to AI-confident.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"row", overflow:"hidden", scrollbarWidth:"none" as any }}
            ref={(el) => { (testimonialsRef as any).current = el; (testiScrollRef as any).current = el; }}>
            {[
              { text:"I walked into a board meeting two weeks after finishing Level 1 and fielded every AI question from the directors. That used to terrify me. I'd been avoiding those conversations for a year. Now I'm the one setting the agenda.", name:"Marcus L.", role:"COO, London", initials:"ML", color:L1_COLOR, course:"Level 1 · Basic", photo:"/assets/testimonials/face-j.png" },
              { text:"The AI governance framework we built in Level 2 Week 3 became our company's actual AI policy. Legal signed off on it. I didn't expect to build something that real in a course. That alone was worth 10x the fee.", name:"James W.", role:"Strategy Director, Singapore", initials:"JW", color:L2_COLOR, course:"Level 2 · Advanced", photo: null },
              { text:"15 minutes a day felt almost too small to matter. By Week 4 I had a full AI opportunity matrix for my department. My VP used it verbatim in the quarterly strategy review.", name:"Priya M.", role:"Finance Manager, Toronto", initials:"PM", color:L1_COLOR, course:"Level 1 · Basic", photo: null },
            ].map((t, i) => (
              <div key={i} className={`lp-testi-card lp-reveal ${revealTestimonials ? "visible" : ""}`} style={{
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)",
                borderRadius:16, padding:"1.4rem 1.5rem",
                display:"flex", flexDirection:"column", gap:"1rem",
                transition:`opacity .65s ease ${i*.15}s, transform .65s ease ${i*.15}s`,
                flex:"0 0 100%", minWidth:0,
              }}>
                <div style={{ fontSize:".78rem", fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}33`, borderRadius:100, padding:"3px 10px", width:"fit-content" }}>{t.course}</div>
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

      {/* ── HUMANIZING IMAGE SECTION ── */}
      <section className="lp-human-section" style={{ padding:"60px 20px", background:"#0d0d14", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"820px", margin:"0 auto", display:"flex", flexDirection:"row", alignItems:"center", gap:"3rem", flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 260px", maxWidth:"100%" }}>
            <img src="/assets/testimonials/face-i.png" alt="Business leader learning AI strategy"
              style={{ width:"100%", borderRadius:20, objectFit:"cover", objectPosition:"center top",
                boxShadow:"0 20px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(13,124,138,.15)",
                border:`1px solid ${L1_COLOR}33` }} />
          </div>
          <div style={{ flex:1, minWidth:240 }}>
            <div style={{ fontSize:".7rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:THEME, marginBottom:"1rem" }}>✦ Who this is for</div>
            <h2 style={{ fontSize:"clamp(1.4rem,3vw,1.9rem)", fontWeight:800, color:"inherit", lineHeight:1.25, marginBottom:"1rem" }}>
              You don't need to be technical.<br/>You need to lead the conversation.
            </h2>
            <p style={{ color:"var(--lp-body,#9896b0)", lineHeight:1.75, fontSize:".95rem", marginBottom:"1.25rem" }}>
              AI Strategy Sprint is for business leaders who want to stop being passengers in AI conversations and start setting the direction. No coding. No jargon. Just the strategy, fluency, and governance skills that organizations need now.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:".6rem", marginBottom:"1.5rem" }}>
              {[
                "Perfect for managers, directors, and C-suite leaders",
                "2 levels — build fluency first, then master strategy and governance",
                "15 minutes a day — designed around an executive's schedule",
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", gap:".65rem", alignItems:"flex-start" }}>
                  <span style={{ color:THEME, fontWeight:800, flexShrink:0, marginTop:2 }}>✓</span>
                  <span className="lp-human-bullet" style={{ color:"var(--lp-body,#c8c6e0)", fontSize:".9rem", lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openAuth(activeTab, "register")}
              style={{ background:THEME, color:"white", border:"none", padding:".75rem 1.8rem",
                borderRadius:100, fontWeight:700, fontSize:".9rem", cursor:"pointer",
                boxShadow:`0 8px 24px ${THEME}44` }}>
              {activeTab === "2" ? "Start Level 2 Journey →" : "Start Level 1 Journey →"}
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA divider */}
      <div className="lp-join-banner" style={{ display:"flex", alignItems:"center", padding:"40px 24px 0" }}>
        <div style={{ flex:1, height:1, background:`${THEME}40`}}/>
        <div style={{ display:"flex", gap:10, padding:"0 18px" }}>
          {["START TODAY", `BEGIN LEVEL 0${activeTab}`].map((m,i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:"12px", letterSpacing:"2px", color:THEME, opacity:.7 }}>[ {m} ]</span>
          ))}
        </div>
        <div style={{ flex:1, height:1, background:`${THEME}40`}}/>
      </div>

      {/* CTA */}
      <section className="lp-cta-section" style={{ background: THEME, paddingBottom:"60px" }}>
        <div className="lp-section-inner" style={{ textAlign: "center" }}>
          <h2 className="lp-cta-h2">
            {activeTab === "2" ? "Ready to lead AI strategy?" : "Ready to build AI fluency?"}
          </h2>
          <p className="lp-cta-sub" style={{ color:"rgba(255,255,255,.9)", fontWeight:600, fontSize:"1.05rem" }}>
            {activeTab === "2"
              ? "Join 187 executives already building board-ready AI strategy — 15 minutes a day."
              : "Join 412 business leaders already building real AI fluency — 15 minutes a day."
            }
          </p>
          <button className="lp-cta-btn" style={{ background: "#ffffff", color: THEME, fontWeight: "bold" }}
            onClick={() => openAuth(activeTab, "register")}>
            {activeTab === "2" ? "Start Level 2 Journey →" : "Start Level 1 Journey →"}
          </button>
        </div>
      </section>
    </div>
  );
}
