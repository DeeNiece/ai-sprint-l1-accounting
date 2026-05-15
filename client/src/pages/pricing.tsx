// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: pricing.tsx  |  Repo: accounting
// Last updated: May 2026
//
// PRICING UPDATE: Single $59 price grants both tracks (56 days total)
// USD_PRICES/PLANS removed — COURSE_PRICE_USD=59, COURSE_ORIG_USD=75

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import Nav from "@/components/nav";
import { CheckCircle2, Zap, Lock, Star, BookOpen, CreditCard, Wallet, Mail, Send, AlertCircle, UserCircle, RefreshCw } from "lucide-react";

// ── USD base prices (cents for Stripe, display only here) ────────────────────
// Single $59 price grants both tracks
const COURSE_PRICE_USD = 59;
const COURSE_ORIG_USD  = 75;

// ── PayMongo now uses live rate – no hardcoded PHP amounts ───────────────────

function formatPhp(amount: number) {
  return "₱" + amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Live exchange rate hook ───────────────────────────────────────────────────
function useUsdToPhp() {
  const [rate, setRate]       = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function fetchRate() {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data?.rates?.PHP) {
        setRate(Math.round(data.rates.PHP * 100) / 100);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) +
          " " +
          now.toLocaleDateString("en-PH", { month: "short", day: "numeric" })
        );
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRate(); }, []);

  return { rate, loading, error, lastUpdated, refetch: fetchRate };
}



// ── Contact Support Section (unchanged) ──────────────────────────────────────
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
      const res  = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
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
    <section style={{ padding: "80px 20px", background: "#0f1016" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d7c8a", background: "rgba(13, 124, 138, 0.1)", border: "1px solid rgba(13, 124, 138, 0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
            <Mail size={12} /> Contact Support
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "white", margin: "0 0 12px", lineHeight: 1.2 }}>
            Need help? We're here.
          </h2>
          <p style={{ color: "#888", fontSize: "1rem", margin: 0 }}>
            Send us a message and we'll get back to you at{" "}
            <a href="mailto:support@aisprint.app" style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}>
              support@aisprint.app
            </a>
          </p>
        </div>

        {submitted ? (
          <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ color: "white", margin: "0 0 8px", fontSize: "1.2rem" }}>Message sent!</h3>
            <p style={{ color: "#888", margin: 0 }}>We'll get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: "none", border: "1px solid #333", color: "#888", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
            <input type="hidden" name="access_key" value="9354c53d-f37d-4c31-845b-88286c03d1d4" />
            <input type="hidden" name="to" value="support@aisprint.app" />
            <input type="hidden" name="subject" value="Accounting Sprint Support Request" />
            <input type="hidden" name="from_name" value="AI Sprint Accounting Pricing Page" />

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}><UserCircle size={13} /> Your Name</label>
              <input type="text" name="name" placeholder="Jane Doe" required style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}><Mail size={13} /> Your Email</label>
              <input type="email" name="email" placeholder="you@example.com" required style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa" }}>Message</label>
              <textarea name="message" placeholder="Describe your issue or question…" required rows={5} style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
            </div>

            <button type="submit" disabled={submitting} style={{ padding: "13px", borderRadius: 8, border: "none", background: submitting ? "#555" : "#0d7c8a", color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s", boxShadow: submitting ? "none" : "0 4px 14px rgba(13, 124, 138, 0.35)" }}>
              <Send size={15} />
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Live rate badge (unchanged) ──────────────────────────────────────────────
function RateBadge({ rate, loading, error, lastUpdated, refetch }: {
  rate: number | null;
  loading: boolean;
  error: boolean;
  lastUpdated: string;
  refetch: () => void;
}) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(13,124,138,0.08)", border: "1px solid rgba(13,124,138,0.2)",
      borderRadius: 20, padding: "5px 14px", fontSize: "0.78rem", color: "#aaa",
      marginBottom: 8,
    }}>
      {loading ? (
        <><RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> Fetching live rate…</>
      ) : error ? (
        <>
          <AlertCircle size={12} style={{ color: "#f97316" }} />
          <span style={{ color: "#f97316" }}>Rate unavailable — showing estimated PHP</span>
          <button onClick={refetch} style={{ background: "none", border: "none", color: "#0d7c8a", cursor: "pointer", fontSize: "0.78rem", padding: 0 }}>Retry</button>
        </>
      ) : (
        <>
          <span style={{ color: "#0d7c8a", fontWeight: 700 }}>Live rate</span>
          <span>$1 = {formatPhp(rate!)} · updated {lastUpdated}</span>
          <button onClick={refetch} style={{ background: "none", border: "none", color: "#0d7c8a", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
            <RefreshCw size={11} />
          </button>
        </>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main pricing page ─────────────────────────────────────────────────────────
export default function PricingPage() {
  const { user }  = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const { rate, loading: rateLoading, error: rateError, lastUpdated, refetch } = useUsdToPhp();

  const licensed = user?.licensedLevels || [];

  // ✅ Fix for back‑button lag: reset loading when page is restored from bfcache
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLoading(null);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  function livePhp(usd: number): string {
    if (!rate) {
      // fallback approximate values if rate not loaded yet
      const fallbackMap: Record<number, number> = { 25: 1450, 40: 2320, 55: 3190, 65: 3770 };
      return formatPhp(fallbackMap[usd] ?? usd * 56);
    }
    return formatPhp(Math.round(usd * rate));
  }

  async function handlePurchase(planId: string, provider: "stripe" | "paymongo") {
    setError(null);
    const loadingKey = `${provider}-${planId}`;
    setLoading(loadingKey);
    try {
      const res = await fetch(`/api/${provider}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || `Could not start ${provider} checkout. Please try again.`);
        setLoading(null);
        return;
      }
      // ✅ Clear loading BEFORE redirect to avoid bfcache issue
      setLoading(null);
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  const ownsAll = licensed.some(l => ["accounting-bundle", "accounting-basic", "accounting-advanced"].includes(l));

  return (
    <div className="page-wrap">
      <Nav />
      <main className="pricing-page">
        <div className="pricing-header">
          <div className="pricing-badge">One-Time Payment · Lifetime Access</div>
          <h1 className="pricing-title">Unlock Accounting in the AI Era</h1>
          <p className="pricing-desc">
            Pay once. Learn at your own pace. No subscriptions, no renewals.
          </p>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <RateBadge
              rate={rate}
              loading={rateLoading}
              error={rateError}
              lastUpdated={lastUpdated}
              refetch={refetch}
            />
          </div>

          {ownsAll && (
            <div style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", padding: "10px 16px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: 8, marginTop: "10px", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={16} /> You already own the full course — both tracks unlocked
            </div>
          )}

        {/* ── Single course card ── */}
        <div className="bundle-card" style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="bundle-badge" style={{ background: "linear-gradient(135deg,#0d7c8a,#e8820c)" }}>
            ⚡ Both Tracks · Best Value
          </div>
          <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: 6 }}>
              Complete Accounting with AI Course
            </div>
            <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: 24 }}>
              56 days · 2 tracks · Basic → Advanced
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <span style={{ padding: "6px 16px", borderRadius: 20, background: "rgba(13,124,138,0.15)", border: "1px solid rgba(13,124,138,0.4)", color: "#14b8a6", fontSize: "0.82rem", fontWeight: 700 }}>Basic Track</span>
              <span style={{ padding: "6px 16px", borderRadius: 20, background: "rgba(232,130,12,0.15)", border: "1px solid rgba(232,130,12,0.4)", color: "#f59e0b", fontSize: "0.82rem", fontWeight: 700 }}>Advanced Track</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: "3.5rem", fontWeight: 900, color: "white", lineHeight: 1 }}>${COURSE_PRICE_USD}</span>
              <span style={{ fontSize: "1.1rem", color: "#555", textDecoration: "line-through", marginLeft: 12 }}>${COURSE_ORIG_USD}</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#aaa", marginBottom: 4 }}>
              ≈ {livePhp(COURSE_PRICE_USD)} <span style={{ color: "#666", fontSize: "0.72rem" }}>(live rate)</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#0d7c8a", fontWeight: 700, marginBottom: 28 }}>
              Save ${COURSE_ORIG_USD - COURSE_PRICE_USD} · {Math.round((1 - COURSE_PRICE_USD / COURSE_ORIG_USD) * 100)}% off · one-time · no renewals
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", textAlign: "left", display: "inline-block" }}>
              {[
                { color: "#14b8a6", text: "Basic Track — 28 days: AI-powered accounting fundamentals & workflows" },
                { color: "#f59e0b", text: "Advanced Track — 28 days: professional automation & client-ready systems" },
                { color: "white",   text: "2 completion certificates — one per track" },
                { color: "white",   text: "Practical AI tools applied to real accounting scenarios" },
                { color: "white",   text: "Lifetime access · no renewals · no hidden fees" },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: "0.88rem", color: "#ccc" }}>
                  <CheckCircle2 size={15} style={{ color: item.color, flexShrink: 0, marginTop: 2 }} />
                  {item.text}
                </li>
              ))}
            </ul>
            {ownsAll ? (
              <div className="plan-owned-btn" style={{ justifyContent: "center" }}>
                <CheckCircle2 size={16} /> You own the full course
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400, margin: "0 auto" }}>
                <button className="bundle-buy-btn" onClick={() => handlePurchase("accounting-bundle", "stripe")} disabled={!!loading} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: "1rem", padding: "14px 20px" }}>
                  <CreditCard size={17} />
                  {loading === "stripe-accounting-bundle" ? "Redirecting…" : `Pay with Card · $${COURSE_PRICE_USD} USD`}
                </button>
                <button className="bundle-buy-btn" onClick={() => handlePurchase("accounting-bundle", "paymongo")} disabled={!!loading} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "#3b82f6", color: "white", fontSize: "1rem", padding: "14px 20px" }}>
                  <Wallet size={17} />
                  {loading === "paymongo-accounting-bundle" ? "Redirecting…" : `GCash / PayMaya · ${rate ? formatPhp(Math.round(COURSE_PRICE_USD * rate)) : "..."}`}
                </button>
                <div style={{ fontSize: "0.72rem", color: "#555", textAlign: "center" }}>
                  Live rate: 1 USD = {rate ? `₱${rate.toFixed(2)}` : "..."}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <div className="pricing-error">{error}</div>}

        <div className="pricing-footer">
          <Lock size={14} /> Secure payments via Stripe & Paymongo · No refunds · Email used at purchase is the only authorized account
        </div>
      </main>

      <ContactSection />
    </div>
  );
}