import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Nav from "@/components/nav";
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

function FAQSection({ title, icon, items }: { title: string; icon: React.ReactNode; items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="faq-section" style={{ marginBottom: "2rem" }}>
      <h2 className="faq-section-title" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
        {icon} {title}
      </h2>
      <div className="faq-list" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => (
          <div key={i} className={`faq-item ${openIdx === i ? "open" : ""}`} style={{ background: "rgba(22, 23, 30, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", overflow: "hidden" }}>
            <button 
              className="faq-question" 
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "none", border: "none", color: "white", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
            >
              <span>{item.q}</span>
              {openIdx === i ? <ChevronUp size={16} color="#0d7c8a" /> : <ChevronDown size={16} color="#888" />}
            </button>
            {openIdx === i && (
              <div className="faq-answer" style={{ padding: "0 1.25rem 1.25rem", color: "#aaa", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {item.a.split("\n").map((line, j) => (
                  <p key={j} style={{ margin: "0 0 0.5rem 0" }}>{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ NEW: Matches the same Web3Forms contact block used on landing.tsx
function ContactSupportForm() {
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
        setError("Something went wrong. Please email us directly at aisprint.app@outlook.com");
      }
    } catch {
      setError("Network error. Please email us directly at aisprint.app@outlook.com");
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
        <h3 style={{ color: "white", margin: "0 0 8px", fontSize: "1.2rem" }}>Message sent!</h3>
        <p style={{ color: "#888", margin: 0 }}>We'll get back to you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          style={{ marginTop: 20, background: "none", border: "1px solid #333", color: "#888", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}
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
        background: "rgba(22, 23, 30, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 16, padding: "36px 32px",
        display: "flex", flexDirection: "column", gap: 18,
      }}
    >
      <input type="hidden" name="access_key" value="9354c53d-f37d-4c31-845b-88286c03d1d4" />
      <input type="hidden" name="to" value="aisprint.app@outlook.com" />
      <input type="hidden" name="subject" value="AI Sprint Support Request" />
      <input type="hidden" name="from_name" value="AI Sprint FAQ Page" />

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Name + Email row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}>
            <UserCircle size={13} /> Your Name
          </label>
          <input type="text" name="name" placeholder="Jane Doe" required
            style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={13} /> Your Email
          </label>
          <input type="email" name="email" placeholder="you@example.com" required
            style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Message */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aaa" }}>Message</label>
        <textarea name="message" placeholder="Describe your issue or question…" required rows={5}
          style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
      </div>

      {/* Submit */}
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
  const [reviewStatus, setReviewStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);

  // Live approved reviews from the database
  const { data: liveReviews = [] } = useQuery<{ id: number; name: string; review: string; rating: number; createdAt: string }[]>({
    queryKey: ["/api/reviews"],
  });

  const sections = [
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
        { q: t("faq.q4"), a: t("faq.a4") },
        { q: t("faq.q5"), a: t("faq.a5") },
        { q: t("faq.q6"), a: t("faq.a6") },
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
    <div className="page-wrap" style={{ background: "radial-gradient(circle at 50% 0%, rgba(13, 124, 138, 0.05) 0%, #0a0a0c 100%)", minHeight: "100vh" }}>
      <Nav />
      <main className="faq-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        
        {/* Header */}
        <header className="faq-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(13, 124, 138, 0.1)', color: '#0d7c8a', marginBottom: '1.5rem' }}>
            <HelpCircle size={32} />
          </div>
          <h1 className="faq-title" style={{ fontSize: "2.5rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>{t("faq.title")}</h1>
          <p className="faq-subtitle" style={{ color: "#aaa", fontSize: "1.1rem" }}>{t("faq.desc")}</p>
        </header>

        {/* FAQs */}
        <div style={{ marginBottom: "4rem" }}>
          {sections.map((s, i) => (
            <FAQSection key={i} title={s.title} icon={s.icon} items={s.items} />
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "4rem 0" }} />

        {/* ✅ NEW: Contact Support — same style as landing.tsx */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: "white" }}>
            <Mail size={20} color="#0d7c8a" /> Contact Support
          </h2>
          <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We'll get back to you at{" "}
            <a href="mailto:aisprint.app@outlook.com" style={{ color: "#0d7c8a", textDecoration: "underline", textUnderlineOffset: 3 }}>
              aisprint.app@outlook.com
            </a>
          </p>
          <ContactSupportForm />
        </section>

        {/* Submit Review Form */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: "white" }}>
            <Star size={20} color="#0d7c8a" /> Submit a Review
          </h2>
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(22, 23, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '2.5rem', borderRadius: '16px' }}>
            {/* Name + Email row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: "#aaa" }}>Your Name</label>
                <input type="text" name="name" placeholder="Jane Doe" required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: "#aaa" }}>Your Email</label>
                <input type="email" name="email" placeholder="you@example.com" required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', color: "#aaa" }}>Rating</label>
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
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: "#aaa" }}>Your Review</label>
              <textarea name="message" required rows={3} placeholder="How is your experience with Level 1?"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: "white" }}>Community Reviews</h3>
          {liveReviews.length === 0 ? (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {liveReviews.map((r) => (
                <div key={r.id} style={{ padding: "1.5rem", background: "rgba(22, 23, 30, 0.2)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.5rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "transparent"} color={i < r.rating ? "#f59e0b" : "#555"} />
                    ))}
                  </div>
                  <p style={{ color: "#eee", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 0.5rem 0" }}>"{r.review}"</p>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>— {r.name}</div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
