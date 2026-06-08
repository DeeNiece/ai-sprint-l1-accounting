// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: faq.tsx  |  Repo: accounting
// Last updated: June 2026
//
// Full dark/light mode support – adapts all colours dynamically.
// Uses useTheme() from theme-provider.

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Nav from "@/components/nav";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/i18n";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Key, 
  MessageSquare, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail, 
  CheckCircle2, 
  X, 
  Star,
  Send,
  AlertCircle,
  UserCircle,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

function FAQSection({ title, icon, items, accent, isDark }: { title: string; icon: React.ReactNode; items: FAQItem[]; accent?: string; isDark: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isRealTalk = !!accent;
  const accentColor = accent || "#0d7c8a";

  // Theme-aware colours for this section
  const cardBg = isDark ? "rgba(22, 23, 30, 0.4)" : "rgba(0, 0, 0, 0.02)";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "white" : "#1a1a2e";
  const textSecondary = isDark ? "#aaa" : "#4a5568";
  const accentBg = `rgba(13,124,138,0.08)`;

  return (
    <div className="faq-section" style={{ marginBottom: "2.5rem" }}>
      {isRealTalk && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: accentBg,
          border: `1px solid ${accentColor}33`,
          borderRadius: 100, padding: "4px 14px", marginBottom: "1rem",
          fontSize: ".7rem", fontWeight: 700, letterSpacing: "1.5px",
          textTransform: "uppercase" as any, color: accentColor,
        }}>
          ✦ The questions most people are actually thinking
        </div>
      )}
      <h2 className="faq-section-title" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: textPrimary }}>
        {icon} {title}
      </h2>
      <div className="faq-list" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => (
          <div key={i} className={`faq-item ${openIdx === i ? "open" : ""}`} style={{
            background: isRealTalk ? `${accentColor}08` : cardBg,
            border: `1px solid ${openIdx === i ? accentColor + "44" : isRealTalk ? accentColor + "22" : borderColor}`,
            borderRadius: "12px", overflow: "hidden", transition: "border-color .2s",
          }}>
            <button
              className="faq-question"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "none", border: "none", color: textPrimary, fontWeight: 600, cursor: "pointer", textAlign: "left", fontSize: isRealTalk ? "1rem" : undefined }}
            >
              <span>{item.q}</span>
              {openIdx === i ? <ChevronUp size={16} color={accentColor} /> : <ChevronDown size={16} color={isDark ? "#888" : "#aaa"} />}
            </button>
            {openIdx === i && (
              <div className="faq-answer" style={{ padding: "0 1.25rem 1.25rem", color: textSecondary, fontSize: "0.95rem", lineHeight: "1.7" }}>
                {item.a.split("\n").map((line, j) => (
                  line.trim() ? <p key={j} style={{ margin: "0 0 0.6rem 0" }}>{line}</p> : null
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Support Form – theme aware
function ContactSupportForm({ isDark }: { isDark: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = isDark ? "rgba(22, 23, 30, 0.4)" : "#ffffff";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0";
  const textPrimary = isDark ? "white" : "#1a1a2e";
  const textSecondary = isDark ? "#aaa" : "#4a5568";
  const inputBg = isDark ? "rgba(0,0,0,0.3)" : "#f8fafc";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1";
  const inputText = isDark ? "white" : "#1a1a2e";
  const labelColor = isDark ? "#aaa" : "#4a5568";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email:   (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError("Something went wrong. Please email us directly at support@aisprint.app");
      }
    } catch {
      setError("Network error. Please email us directly at support@aisprint.app");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{
        background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)",
        borderRadius: 16, padding: "40px 32px", textAlign: "center",
      }}>
        <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ color: textPrimary, margin: "0 0 8px", fontSize: "1.2rem" }}>Message sent!</h3>
        <p style={{ color: textSecondary, margin: 0 }}>We'll get back to you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          style={{ marginTop: 20, background: "none", border: `1px solid ${borderColor}`, color: textSecondary, padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: bgColor, border: `1px solid ${borderColor}`,
        borderRadius: 16, padding: "36px 32px",
        display: "flex", flexDirection: "column", gap: 18,
      }}
    >
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor, display: "flex", alignItems: "center", gap: 6 }}>
            <UserCircle size={13} /> Your Name
          </label>
          <input type="text" name="name" placeholder="Jane Doe" required
            style={{ padding: "11px 14px", borderRadius: 8, border: inputBorder, background: inputBg, color: inputText, fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor, display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={13} /> Your Email
          </label>
          <input type="email" name="email" placeholder="you@example.com" required
            style={{ padding: "11px 14px", borderRadius: 8, border: inputBorder, background: inputBg, color: inputText, fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: labelColor }}>Message</label>
        <textarea name="message" placeholder="Describe your issue or question…" required rows={5}
          style={{ padding: "11px 14px", borderRadius: 8, border: inputBorder, background: inputBg, color: inputText, fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
      </div>

      <button type="submit" disabled={submitting}
        style={{
          padding: "13px", borderRadius: 8, border: "none",
          background: submitting ? "#555" : "#0d7c8a",
          color: "white", fontWeight: 700, fontSize: "0.95rem",
          cursor: submitting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "background 0.2s",
          boxShadow: submitting ? "none" : "0 4px 14px rgba(13, 124, 138, 0.35)",
        }}
      >
        <Send size={15} />
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

export default function FAQPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reviewStatus, setReviewStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);

  const { data: liveReviews = [] } = useQuery<{ id: number; name: string; review: string; rating: number; createdAt: string }[]>({
    queryKey: ["/api/reviews"],
  });

  // Theme-aware colours
  const pageBg = isDark ? "#0a0a0c" : "#f8fafc";
  const pageBgGradient = isDark ? "radial-gradient(circle at 50% 0%, rgba(13, 124, 138, 0.05) 0%, #0a0a0c 100%)" : "none";
  const textPrimary = isDark ? "white" : "#1a1a2e";
  const textSecondary = isDark ? "#aaa" : "#4a5568";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const cardBg = isDark ? "rgba(22, 23, 30, 0.4)" : "#ffffff";
  const inputBg = isDark ? "rgba(0,0,0,0.3)" : "#f8fafc";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1";
  const inputText = isDark ? "white" : "#1a1a2e";
  const labelColor = isDark ? "#aaa" : "#4a5568";
  const reviewCardBg = isDark ? "rgba(22, 23, 30, 0.2)" : "#f1f5f9";
  const reviewText = isDark ? "#eee" : "#334155";
  const dividerColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  const sections = [
    {
      title: t("faq.realTalk"),
      icon: <MessageSquare size={18} color="#0d7c8a" />,
      accent: "#0d7c8a",
      items: [
        { q: t("faq.rt1"), a: t("faq.rt1a") },
        { q: t("faq.rt2"), a: t("faq.rt2a") },
        { q: t("faq.rt3"), a: t("faq.rt3a") },
        { q: t("faq.rt4"), a: t("faq.rt4a") },
        { q: t("faq.rt5"), a: t("faq.rt5a") },
        { q: t("faq.rt6"), a: t("faq.rt6a") },
      ],
    },
    {
      title: t("faq.gettingStarted"),
      icon: <HelpCircle size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
      ],
    },
    {
      title: t("faq.aiCoach"),
      icon: <MessageSquare size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q4"),            a: t("faq.a4") },
        { q: t("faq.q_promptlab"),   a: t("faq.a_promptlab") },
        { q: t("faq.q_builtin_ai"),  a: t("faq.a_builtin_ai") },
        { q: t("faq.q_daily_limit"), a: t("faq.a_daily_limit") },
        { q: t("faq.q_topic_limit"), a: t("faq.a_topic_limit") },
        { q: t("faq.q5"),            a: t("faq.a5") },
        { q: t("faq.q6"),            a: t("faq.a6") },
      ],
    },
    {
      title: t("faq.apiSetup"),
      icon: <Key size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q7"), a: t("faq.a7") },
        { q: t("faq.q8"), a: t("faq.a8") },
        { q: t("faq.q9"), a: t("faq.a9") },
        { q: t("faq.q10"), a: t("faq.a10") },
        { q: t("faq.q11"), a: t("faq.a11") },
      ],
    },
    {
      title: t("faq.costs"),
      icon: <CreditCard size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q12"), a: t("faq.a12") },
        { q: t("faq.q13"), a: t("faq.a13") },
        { q: t("faq.q14"), a: t("faq.a14") },
      ],
    },
    {
      title: t("faq.privacy"),
      icon: <Shield size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q15"), a: t("faq.a15") },
        { q: t("faq.q16"), a: t("faq.a16") },
        { q: t("faq.q17"), a: t("faq.a17") },
      ],
    },
    {
      title: t("faq.regional"),
      icon: <Globe size={18} color="#0d7c8a" />,
      items: [
        { q: t("faq.q18"), a: t("faq.a18") },
        { q: t("faq.q19"), a: t("faq.a19") },
      ],
    },
  ];

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewStatus("submitting");

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, review: message, rating }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setReviewStatus("success");
        form.reset();
        setRating(5);
        setTimeout(() => setReviewStatus("idle"), 4000);
      } else {
        setReviewStatus("error");
        setTimeout(() => setReviewStatus("idle"), 4000);
      }
    } catch {
      setReviewStatus("error");
      setTimeout(() => setReviewStatus("idle"), 4000);
    }
  };

  return (
    <div className="page-wrap" style={{ background: pageBgGradient || pageBg, minHeight: "100vh" }}>
      <Nav />
      <main className="faq-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        
        {/* Header */}
        <header className="faq-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(13, 124, 138, 0.1)', color: '#0d7c8a', marginBottom: '1.5rem' }}>
            <HelpCircle size={32} />
          </div>
          <h1 className="faq-title" style={{ fontSize: "2.5rem", fontWeight: 800, color: textPrimary, marginBottom: "1rem" }}>{t("faq.title")}</h1>
          <p className="faq-subtitle" style={{ color: textSecondary, fontSize: "1.1rem" }}>{t("faq.desc")}</p>
        </header>

        {/* FAQs */}
        <div style={{ marginBottom: "4rem" }}>
          {sections.map((s, i) => (
            <FAQSection key={i} title={s.title} icon={s.icon} items={s.items} accent={(s as any).accent} isDark={isDark} />
          ))}
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${dividerColor}`, margin: "4rem 0" }} />

        {/* Contact Support */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: textPrimary }}>
            <Mail size={20} color="#0d7c8a" /> Contact Support
          </h2>
          <p style={{ color: textSecondary, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We'll get back to you at{" "}
            <a href="mailto:support@aisprint.app" style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}>
              support@aisprint.app
            </a>
          </p>
          <ContactSupportForm isDark={isDark} />
        </section>

        {/* Submit Review Form */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: textPrimary }}>
            <Star size={20} color="#0d7c8a" /> Submit a Review
          </h2>
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: cardBg, border: `1px solid ${borderColor}`, padding: '2.5rem', borderRadius: '16px' }}>
            {/* Name + Email row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: labelColor }}>Your Name</label>
                <input type="text" name="name" placeholder="Jane Doe" required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: inputBg, border: inputBorder, borderRadius: '8px', color: inputText, boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: labelColor }}>Your Email</label>
                <input type="email" name="email" placeholder="you@example.com" required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: inputBg, border: inputBorder, borderRadius: '8px', color: inputText, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', color: labelColor }}>Rating</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    <Star size={24} fill={star <= rating ? "#f59e0b" : "transparent"} color={star <= rating ? "#f59e0b" : "#555"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: labelColor }}>Your Review</label>
              <textarea name="message" required rows={3} placeholder="How is your experience with the Accounting course?"
                style={{ width: '100%', padding: '0.75rem 1rem', background: inputBg, border: inputBorder, borderRadius: '8px', color: inputText, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <button type="submit" disabled={reviewStatus === "submitting"} style={{ background: reviewStatus === "submitting" ? '#444' : '#0d7c8a', color: 'white', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: reviewStatus === "submitting" ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {reviewStatus === "submitting" ? "Submitting..." : "Post Review"}
              </button>
              {reviewStatus === "success" && <p style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><CheckCircle2 size={16}/> Review submitted — thank you!</p>}
              {reviewStatus === "error" && <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><X size={16}/> Something went wrong. Please try again.</p>}
            </div>
          </form>
        </section>

        {/* Live Approved Reviews */}
        <section>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: textPrimary }}>Community Reviews</h3>
          {liveReviews.length === 0 ? (
            <p style={{ color: textSecondary, fontSize: "0.9rem" }}>No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {liveReviews.map((r) => (
                <div key={r.id} style={{ padding: "1.5rem", background: reviewCardBg, borderRadius: "12px", border: `1px solid ${borderColor}` }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.5rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "transparent"} color={i < r.rating ? "#f59e0b" : "#555"} />
                    ))}
                  </div>
                  <p style={{ color: reviewText, fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 0.5rem 0" }}>"{r.review}"</p>
                  <div style={{ fontSize: "0.8rem", color: textSecondary }}>— {r.name}</div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}