// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: help.tsx  |  Repo: accounting
// Last updated: June 2026

import { useState } from "react";
import Nav from "@/components/nav";
import { Link } from "wouter";
import { CheckCircle2, X, Zap, HelpCircle, Mail, MessageSquare, Bot, Key } from "lucide-react";

export default function HelpPage() {
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSupportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionStatus("submitting");

    const form = event.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email:   (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (response.ok && json.ok) {
        setSubmissionStatus("success");
        event.currentTarget.reset();
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      setSubmissionStatus("error");
    } finally {
      setTimeout(() => setSubmissionStatus("idle"), 4000);
    }
  };

  const faqs = [
    { q: "How do I upgrade to the Advanced track?", a: "Click 'Pricing' in the top menu at any time to upgrade. Your progress will be saved." },
    { q: "Do I need an API key to use the AI Coach?", a: "No — the AI Coach and PromptLab both have a built-in AI you can use immediately with no setup. You get 5 AI Coach messages and 3 PromptLab runs per day. Add your own API key in Settings for unlimited use." },
    { q: "Why did the AI Coach stop responding?", a: "If you're using the built-in AI, you may have reached your daily limit (5 messages for AI Coach, 3 runs for PromptLab). Limits reset at midnight UTC. Add your own API key in Settings for unlimited access." },
    { q: "I lost my progress, what do I do?", a: "Make sure you are logged into the correct account. If your progress is still missing, please send us a message using the form below." },
  ];

  return (
    <div className="page-wrap">
      <Nav />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', minHeight: 'calc(100vh - 300px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(13, 124, 138, 0.1)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            <HelpCircle size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'inherit' }}>Help & FAQ</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Find answers to common questions or reach out to our support team directly.
          </p>
        </div>

        {/* Built-in AI callout */}
        <div style={{ marginBottom: '3rem', background: 'rgba(13, 124, 138, 0.06)', border: '1px solid rgba(13, 124, 138, 0.2)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}>
            <Bot size={20} color="#0d7c8a" /> AI Coach & PromptLab — Two Ways to Use
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(13, 124, 138, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#0d7c8a' }}>✦ Built-in AI (Free, no setup)</div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <li>5 AI Coach messages per day</li>
                <li>3 PromptLab runs per day</li>
                <li>Focused on today's lesson topic</li>
                <li>Resets at midnight UTC</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(13, 124, 138, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#0d7c8a' }}><Key size={14} /> BYOK — Bring Your Own API Key</div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <li>Unlimited messages & runs</li>
                <li>Ask about anything in the course</li>
                <li>~$0.001 per conversation</li>
                <li>Add your key in Settings →</li>
              </ul>
            </div>
          </div>
          <p style={{ margin: '1rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Each course gets its own daily allocation — enrolling in multiple courses gives you separate limits per course.
          </p>
        </div>

        {/* FAQs */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}><MessageSquare size={20} color="#0d7c8a"/> Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support Form */}
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}><Mail size={20} color="#0d7c8a"/> Contact Support</h2>
          <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 250px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Name</label>
                <input type="text" name="name" required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-offset)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }} />
              </div>
              <div style={{ flex: '1 1 250px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" name="email" required placeholder="you@email.com" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-offset)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Question or Query</label>
              <textarea name="message" required rows={5} placeholder="Describe your query here..." style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-offset)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <button type="submit" disabled={submissionStatus === "submitting"} style={{ background: submissionStatus === "submitting" ? 'var(--color-text-muted)' : 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.95rem', cursor: submissionStatus === "submitting" ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {submissionStatus === "submitting" ? "Sending..." : "Submit Message"}
              </button>

              {submissionStatus === "success" && <p style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16}/> Sent successfully.</p>}
              {submissionStatus === "error" && <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><X size={16}/> Something went wrong.</p>}
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer border-t mt-12 py-10 text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>Legal & Accessibility</div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/accessibility" style={{ color: 'inherit', textDecoration: 'none' }}>Accessibility</Link>
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>
              <Zap size={18} color="var(--color-primary)" /> AI Sprint
            </div>
            <div style={{ textAlign: 'center' }}>AI Sprint - Learn AI Fast. Stay Ahead Forever.</div>
            <div><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Cookie Settings</button></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
