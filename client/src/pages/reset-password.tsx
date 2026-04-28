import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ResetPassword() {
  const [location] = useLocation();
  const token = new URLSearchParams(window.location.hash.split("?")[1] || "").get("token") || "";
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setValid(false); return; }
    fetch(`/api/auth/reset-password/${token}`)
      .then((r) => r.json())
      .then((d) => { setValid(d.valid); setEmail(d.email || ""); })
      .catch(() => setValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) setDone(true);
    else { const d = await res.json(); setError(d.error || "Failed to reset password"); }
    setLoading(false);
  }

  if (valid === null) return <div className="auth-page"><div className="auth-card" style={{ textAlign: "center", color: "var(--color-muted)" }}>Verifying link...</div></div>;

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
            <div className="auth-logo-sub">Reset Password</div>
          </div>
        </div>

        {!valid ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <XCircle size={36} style={{ color: "hsl(var(--destructive))", margin: "0 auto 0.75rem" }} />
            <h3 style={{ margin: "0 0 0.5rem" }}>Link expired or invalid</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginBottom: "1rem" }}>This reset link has expired or already been used.</p>
            <Link href="/forgot-password" className="auth-info-link">Request a new link</Link>
          </div>
        ) : done ? (
          <div className="review-success" style={{ padding: "1rem 0" }}>
            <CheckCircle2 size={36} />
            <h3>Password updated!</h3>
            <p>Your password has been reset successfully.</p>
            <Link href="/auth" className="auth-info-link" style={{ marginTop: "0.5rem", display: "inline-block" }}>
              → Go to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Set new password</h1>
            {email && <p style={{ fontSize: "0.82rem", color: "var(--color-muted)", marginBottom: "1rem" }}>For account: <strong>{email}</strong></p>}
            {error && <div className="auth-error" style={{ marginBottom: "1rem" }}>{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label><Lock size={14} /> New password</label>
                <div className="auth-pw-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required minLength={6}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label><Lock size={14} /> Confirm password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Updating..." : "Set New Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
