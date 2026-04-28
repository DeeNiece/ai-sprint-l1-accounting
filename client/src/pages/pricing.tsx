import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import Nav from "@/components/nav";
import { CheckCircle2, Zap, Lock, Star, BookOpen, CreditCard, Wallet, Mail, Send, AlertCircle, UserCircle, RefreshCw } from "lucide-react";

// ── USD base prices (cents for Stripe, display only here) ────────────────────
const USD_PRICES: Record<string, number> = {
  "accounting-basic":    5,
  "accounting-advanced": 7,
  "accounting-bundle":   10,
};

// ── PayMongo fixed PHP amounts (centavos) — always used for actual checkout ──
// These are the authoritative amounts sent to PayMongo.
// The live rate below is display-only to show the approximate PHP equivalent.
const PAYMONGO_PHP_FIXED: Record<string, number> = {
  "accounting-basic":    28000,
  "accounting-advanced": 39500,
  "accounting-bundle":   56000,
};

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
      // Free tier — no API key needed, updates every 24h
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

const PLANS = [
  {
    id: "accounting-basic",
    level: "accounting-basic",
    name: "Basic",
    subtitle: "28-Day Challenge",
    usd: 5,
    color: "#0d7c8a",
    colorLight: "#0d7c8a22",
    icon: <BookOpen size={22} />,
    features: [
      "28 days of accounting foundations",
      "AI prompting for accountants",
      "Bookkeeping & reconciliation workflows",
      "Month-end close with AI",
      "AI Coach on every lesson",
      "Progress tracking & toolkit",
    ],
  },
  {
    id: "accounting-advanced",
    level: "accounting-advanced",
    name: "Advanced",
    subtitle: "28-Day Challenge",
    usd: 7,
    color: "#7a5fc0",
    colorLight: "#7a5fc022",
    icon: <Zap size={22} />,
    features: [
      "28 days advanced accounting track",
      "Fraud detection & anomaly analysis",
      "Financial reporting & disclosures",
      "FP&A, forecasting & scenario analysis",
      "AI governance & controls framework",
      "Capstone: AI-Ready Accounting Blueprint",
    ],
    recommended: true,
  },
];

const BUNDLE_USD     = 10;
const BUNDLE_ORIG_USD = 12;

// ── Contact Support Section ───────────────────────────────────────────────────
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
            <a href="mailto:aisprint.app@outlook.com" style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}>
              aisprint.app@outlook.com
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
            <input type="hidden" name="to" value="aisprint.app@outlook.com" />
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

// ── Live rate badge ───────────────────────────────────────────────────────────
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

  // Convert USD to live PHP (display only — PayMongo uses fixed centavo amounts)
  function livePhp(usd: number): string {
    if (!rate) {
      // Fall back to fixed PayMongo amounts converted to display
      const fixedMap: Record<number, number> = { 5: 280, 7: 395, 10: 560, 12: 672 };
      return formatPhp(fixedMap[usd] ?? usd * 56);
    }
    return formatPhp(Math.round(usd * rate));
  }

  async function handlePurchase(planId: string, provider: "stripe" | "paymongo") {
    setError(null);
    setLoading(`${provider}-${planId}`);
    try {
      const res  = await fetch(`/api/${provider}/checkout`, {
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
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  const ownsBasic    = licensed.includes("accounting-basic");
  const ownsAdvanced = licensed.includes("accounting-advanced");
  const ownsBundle   = licensed.includes("accounting-bundle");
  const ownsAll      = (ownsBasic || ownsBundle) && (ownsAdvanced || ownsBundle);

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

          {/* Live rate badge */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <RateBadge
              rate={rate}
              loading={rateLoading}
              error={rateError}
              lastUpdated={lastUpdated}
              refetch={refetch}
            />
          </div>

          {licensed.length > 0 && (
            <div style={{ background: "#1a7a4a22", color: "#1a7a4a", padding: "10px", borderRadius: "8px", display: "inline-block", marginTop: "10px" }}>
              <CheckCircle2 size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "5px" }} />
              You already own: {[
                ownsBasic  || ownsBundle ? "Basic"    : null,
                ownsAdvanced || ownsBundle ? "Advanced" : null,
              ].filter(Boolean).join(", ")}
            </div>
          )}
        </div>

        {/* ── Bundle card ───────────────────────────────────────────────── */}
        <div className="bundle-card">
          <div className="bundle-badge"><Star size={14} /> Best Value</div>
          <div className="bundle-content">
            <div className="bundle-left">
              <div className="bundle-title">Basic + Advanced Bundle</div>
              <div className="bundle-desc">Complete 56-day accounting transformation — both tracks included</div>
              <ul className="bundle-perks">
                <li><CheckCircle2 size={13} /> All 56 lessons across both tracks</li>
                <li><CheckCircle2 size={13} /> Foundations through advisory skills</li>
                <li><CheckCircle2 size={13} /> Lifetime access · no renewals</li>
              </ul>
            </div>
            <div className="bundle-right">
              <div className="bundle-price">
                <span className="bundle-amount">${BUNDLE_USD}</span>
                <span className="bundle-original">${BUNDLE_ORIG_USD}</span>
              </div>

              {/* Live PHP equivalent */}
              <div style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 4, marginBottom: 4 }}>
                ≈ {livePhp(BUNDLE_USD)} <span style={{ color: "#666", fontSize: "0.72rem" }}>(live rate)</span>
              </div>

              <div className="bundle-save">
                Save ${BUNDLE_ORIG_USD - BUNDLE_USD}{" "}
                <span className="bundle-pct">· {Math.round((1 - BUNDLE_USD / BUNDLE_ORIG_USD) * 100)}% off</span>
              </div>

              {ownsAll ? (
                <div className="plan-owned-btn" style={{ marginTop: 15 }}><CheckCircle2 size={16} /> Owned</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 15, width: "100%" }}>
                  <button
                    className="bundle-buy-btn"
                    onClick={() => handlePurchase("accounting-bundle", "stripe")}
                    disabled={!!loading}
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
                  >
                    <CreditCard size={16} />
                    {loading === "stripe-accounting-bundle" ? "Redirecting…" : `Pay with Card · $${BUNDLE_USD} USD`}
                  </button>
                  <button
                    className="bundle-buy-btn"
                    onClick={() => handlePurchase("accounting-bundle", "paymongo")}
                    disabled={!!loading}
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "#3b82f6", color: "white" }}
                  >
                    <Wallet size={16} />
                    {loading === "paymongo-accounting-bundle"
                      ? "Redirecting…"
                      : `GCash / PayMaya · ${formatPhp(PAYMONGO_PHP_FIXED["accounting-bundle"] / 100)}`}
                  </button>
                  <div style={{ fontSize: "0.72rem", color: "#555", textAlign: "center" }}>
                    PHP amount fixed at checkout · live rate shown above for reference
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Individual plan cards ─────────────────────────────────────── */}
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const isOwned = licensed.includes(plan.level) || ownsBundle;

            return (
              <div
                key={plan.id}
                className={`plan-card${plan.recommended ? " recommended" : ""}`}
                style={{ borderColor: plan.recommended ? plan.color : undefined }}
              >
                {plan.recommended && (
                  <div className="plan-recommended-badge" style={{ background: plan.color }}>
                    Most Popular
                  </div>
                )}
                <div className="plan-icon" style={{ background: plan.colorLight, color: plan.color }}>
                  {plan.icon}
                </div>
                <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
                <div className="plan-subtitle">{plan.subtitle}</div>

                {/* USD price */}
                <div className="plan-price">${plan.usd}</div>

                {/* Live PHP equivalent */}
                <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: 2 }}>
                  ≈ {livePhp(plan.usd)}{" "}
                  <span style={{ fontSize: "0.7rem", color: "#555" }}>(live rate)</span>
                </div>

                <div className="plan-price-note">one-time · no refunds</div>

                <ul className="plan-features" style={{ marginBottom: 25 }}>
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={13} style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "auto" }}>
                  {isOwned ? (
                    <div className="plan-owned-btn"><CheckCircle2 size={16} /> Owned</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        className="plan-buy-btn"
                        style={{ background: plan.color, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                        onClick={() => handlePurchase(plan.id, "stripe")}
                        disabled={!!loading}
                      >
                        <CreditCard size={14} />
                        {loading === `stripe-${plan.id}` ? "Redirecting…" : `Card · $${plan.usd} USD`}
                      </button>
                      <button
                        className="plan-buy-btn"
                        style={{ background: "transparent", border: `1px solid ${plan.color}`, color: plan.color, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                        onClick={() => handlePurchase(plan.id, "paymongo")}
                        disabled={!!loading}
                      >
                        <Wallet size={14} />
                        {loading === `paymongo-${plan.id}`
                          ? "Redirecting…"
                          : `GCash / PayMaya · ${formatPhp(PAYMONGO_PHP_FIXED[plan.id] / 100)}`}
                      </button>
                      <div style={{ fontSize: "0.7rem", color: "#555", textAlign: "center" }}>
                        PHP fixed at checkout · ≈ {livePhp(plan.usd)} today
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
