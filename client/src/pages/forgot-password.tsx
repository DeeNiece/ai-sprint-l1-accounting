import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setSent(true);
    else setError("Something went wrong. Please try again.");
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" fill="var(--color-primary)" />
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 16 L18 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="auth-logo-text">
            <div className="auth-logo-title">AI Sprint</div>
            <div className="auth-logo-sub">Password Recovery</div>
          </div>
        </div>

        {sent ? (
          <div className="review-success" style={{ padding: "1rem 0" }}>
            <CheckCircle2 size={36} />
            <h3>Check your email</h3>
            <p>If an account exists for <strong>{email}</strong>, a password reset link has been sent. It expires in 1 hour.</p>
            <Link href="/auth" className="auth-info-link" style={{ marginTop: "0.5rem", display: "inline-block" }}>
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Forgot your password?</h1>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginBottom: "1.25rem" }}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && <div className="auth-error" style={{ marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email"><Mail size={14} /> Email address</label>
                <input
                  id="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link href="/auth" className="auth-info-link">← Back to login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
