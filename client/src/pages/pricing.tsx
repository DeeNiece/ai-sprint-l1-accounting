import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import Nav from "@/components/nav";
import { CheckCircle2, Zap, Lock, Star, Layers, BookOpen, CreditCard, Wallet, Mail, Send, AlertCircle, UserCircle } from "lucide-react";

// PHP Price display reference
const PHP_PRICES: Record<string, string> = {
  "level1": "₱280",
  "level2": "₱395",
  "level3": "₱560",
  "bundle": "₱850",
  "bundle23": "₱675",
};

const PLANS = [
  {
    id: "level1",
    level: "1",
    name: "Level 1",
    subtitle: "Basic",
    price: "$5",
    color: "#0d7c8a",
    colorLight: "#0d7c8a22",
    icon: <BookOpen size={22} />,
    features: [
      "28-day AI basics curriculum",
      "Prompting, Canva, content creation",
      "AI Coach on every lesson",
      "Progress tracking",
      "Portfolio targets",
      "Starter toolkit",
    ],
  },
  {
    id: "level2",
    level: "2",
    name: "Level 2",
    subtitle: "Advanced",
    price: "$7",
    color: "#7a5fc0",
    colorLight: "#7a5fc022",
    icon: <Zap size={22} />,
    features: [
      "28-day advanced AI curriculum",
      "Client services & deliverables",
      "Automation & workflow design",
      "Sellable skill breakdown per day",
      "Service packaging guide",
      "Advanced portfolio targets",
    ],
    recommended: true,
  },
  {
    id: "level3",
    level: "3",
    name: "Level 3",
    subtitle: "Master",
    price: "$10",
    color: "#b8630a",
    colorLight: "#b8630a22",
    icon: <Layers size={22} />,
    features: [
      "28-day master AI curriculum",
      "AI systems & automation mastery",
      "Design-to-income pipeline",
      "System Created Today tracker",
      "Agency-level portfolio targets",
      "Full freelance launch prep",
    ],
  },
];

const BUNDLE = {
  id: "bundle",
  price: "$15",
  originalPrice: "$22",
  savings: "Save $7",
  savingsPct: "32% off",
};

const BUNDLE23 = {
  id: "bundle23",
  price: "$12",
  originalPrice: "$17",
  savings: "Save $5",
  savingsPct: "29% off",
};

// ── Contact Support Section (teal — Level 1 theme) ─────────────
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
            <input type="hidden" name="subject" value="AI Sprint Support Request" />
            <input type="hidden" name="from_name" value="AI Sprint Pricing Page" />

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

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const licensed = user?.licensedLevels || [];

  async function handlePurchase(planId: string, provider: 'stripe' | 'paymongo') {
    setError(null);
    setLoading(`${provider}-${planId}`);
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
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="page-wrap">
      <Nav />
      <main className="pricing-page">
        <div className="pricing-header">
          <div className="pricing-badge">One-Time Payment · Lifetime Access</div>
          <h1 className="pricing-title">Unlock Your AI Sprint Journey</h1>
          <p className="pricing-desc">
            Pay once. Learn at your own pace. No subscriptions, no renewals.
          </p>
          {licensed.length > 0 && (
            <div className="pricing-owned-note" style={{ background: '#1a7a4a22', color: '#1a7a4a', padding: '10px', borderRadius: '8px', display: 'inline-block', marginTop: '10px' }}>
              <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} />
              You already own: {licensed.map(l => `Level ${l}`).join(", ")}
            </div>
          )}
        </div>

        {/* All 3 Levels Bundle card */}
        <div className="bundle-card">
          <div className="bundle-badge"><Star size={14} /> Best Value</div>
          <div className="bundle-content">
            <div className="bundle-left">
              <div className="bundle-title">All 3 Levels Bundle</div>
              <div className="bundle-desc">Complete AI mastery — Basic → Advanced → Master</div>
              <ul className="bundle-perks">
                <li><CheckCircle2 size={13} /> All 84 lessons across 3 levels</li>
                <li><CheckCircle2 size={13} /> Single account, all levels</li>
                <li><CheckCircle2 size={13} /> Lifetime access</li>
              </ul>
            </div>
            <div className="bundle-right">
              <div className="bundle-price">
                <span className="bundle-amount">{BUNDLE.price}</span>
                <span className="bundle-original">{BUNDLE.originalPrice}</span>
              </div>
              <div className="bundle-save">{BUNDLE.savings} <span className="bundle-pct">· {BUNDLE.savingsPct}</span></div>

              {licensed.length === 3 ? (
                <div className="plan-owned-btn" style={{ marginTop: '15px' }}><CheckCircle2 size={16} /> Owned</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', width: '100%' }}>
                  <button className="bundle-buy-btn" onClick={() => handlePurchase("bundle", "stripe")} disabled={!!loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} />
                    {loading === "stripe-bundle" ? "Redirecting…" : "Pay with Card (USD)"}
                  </button>
                  <button className="bundle-buy-btn" onClick={() => handlePurchase("bundle", "paymongo")} disabled={!!loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#3b82f6', color: 'white' }}>
                    <Wallet size={16} />
                    {loading === "paymongo-bundle" ? "Redirecting…" : `GCash / PayMaya (${PHP_PRICES["bundle"]})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level 2 + Level 3 Bundle card */}
        <div className="bundle-card bundle-card--l23">
          <div className="bundle-badge bundle-badge--purple"><Zap size={14} /> Advanced + Master</div>
          <div className="bundle-content">
            <div className="bundle-left">
              <div className="bundle-title">Level 2 + Level 3 Bundle</div>
              <div className="bundle-desc">Advanced & Master track — skip if you already own Level 1</div>
              <ul className="bundle-perks">
                <li><CheckCircle2 size={13} /> 56 lessons across Level 2 &amp; 3</li>
                <li><CheckCircle2 size={13} /> Client services, automation &amp; agency-level skills</li>
                <li><CheckCircle2 size={13} /> Lifetime access</li>
              </ul>
            </div>
            <div className="bundle-right">
              <div className="bundle-price">
                <span className="bundle-amount">{BUNDLE23.price}</span>
                <span className="bundle-original">{BUNDLE23.originalPrice}</span>
              </div>
              <div className="bundle-save">{BUNDLE23.savings} <span className="bundle-pct">· {BUNDLE23.savingsPct}</span></div>

              {licensed.includes("2") && licensed.includes("3") ? (
                <div className="plan-owned-btn" style={{ marginTop: '15px' }}><CheckCircle2 size={16} /> Owned</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', width: '100%' }}>
                  <button className="bundle-buy-btn bundle-buy-btn--purple" onClick={() => handlePurchase("bundle23", "stripe")} disabled={!!loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} />
                    {loading === "stripe-bundle23" ? "Redirecting…" : "Pay with Card (USD)"}
                  </button>
                  <button className="bundle-buy-btn" onClick={() => handlePurchase("bundle23", "paymongo")} disabled={!!loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#3b82f6', color: 'white' }}>
                    <Wallet size={16} />
                    {loading === "paymongo-bundle23" ? "Redirecting…" : `GCash / PayMaya (${PHP_PRICES["bundle23"]})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Individual plan cards */}
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const isOwned = licensed.includes(plan.level);
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
                <div className="plan-price">{plan.price}</div>
                <div className="plan-price-note">one-time · no refunds</div>
                <ul className="plan-features" style={{ marginBottom: '25px' }}>
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={13} style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  {isOwned ? (
                    <div className="plan-owned-btn"><CheckCircle2 size={16} /> Owned</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button className="plan-buy-btn" style={{ background: plan.color, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} onClick={() => handlePurchase(plan.id, "stripe")} disabled={!!loading}>
                        <CreditCard size={14} />
                        {loading === `stripe-${plan.id}` ? "Redirecting…" : "Pay with Card (USD)"}
                      </button>
                      <button className="plan-buy-btn" style={{ background: 'transparent', border: `1px solid ${plan.color}`, color: plan.color, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} onClick={() => handlePurchase(plan.id, "paymongo")} disabled={!!loading}>
                        <Wallet size={14} />
                        {loading === `paymongo-${plan.id}` ? "Redirecting…" : `GCash / PayMaya (${PHP_PRICES[plan.id]})`}
                      </button>
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

      {/* ✅ Contact Support — appended below pricing, teal Level 1 theme */}
      <ContactSection />
    </div>
  );
}
