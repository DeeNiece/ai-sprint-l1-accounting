import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/i18n";
import {
  Mail,
  Lock,
  UserCircle,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLocation } from "wouter";
import logoImg from "@assets/ai-sprint-logo.jpg";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let err: string | null;

    if (mode === "login") {
      err = await login(email, password);
    } else {
      if (!displayName.trim()) {
        setError(t("auth.nameRequired"));
        setLoading(false);
        return;
      }
      err = await register(email, password, displayName);
    }

    if (err) {
      setError(err);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 50%, rgba(13, 124, 138, 0.15) 0%, #0a0a0c 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(22, 23, 30, 0.35)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "40px",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <img
            src={logoImg}
            alt="AI Sprint"
            style={{ width: "48px", height: "48px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          />
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #888)", fontWeight: 500 }}>
            Learn AI Fast. Stay Ahead Forever.
          </div>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", color: "white", textAlign: "center" }}>
          {mode === "login" ? "Welcome Back to Level 1" : t("auth.createAccount")}
        </h1>
        <p style={{ color: "white", marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center" }}>
          {mode === "login" ? "Log in to continue your AI learning journey." : t("auth.signupSubtext")}
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "register" && (
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, color: "#aaa", marginBottom: "6px" }}>
                <UserCircle size={14} /> {t("auth.nameLabel")}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, color: "white", marginBottom: "6px" }}>
              <Mail size={14} /> {t("auth.emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 600, color: "white", marginBottom: "6px" }}>
              <Lock size={14} /> {t("auth.passwordLabel")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                minLength={mode === "register" ? 6 : 1}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#888", cursor: "pointer" }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              background: "#3ab8c8",
              color: "#000",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(58, 184, 200, 0.4)",
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>

          <div style={{ position: "relative", margin: "25px 0" }}>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
            <span
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(22, 23, 30, 0.8)",
                backdropFilter: "blur(10px)",
                padding: "0 15px",
                fontSize: "0.7rem",
                color: "#666",
                fontWeight: 800,
                letterSpacing: "1px",
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
              transition: "transform 0.2s",
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
          </a>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "#888" }}>
          {mode === "login" ? (
            <>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => { setMode("register"); setError(null); }}
                  style={{ background: "none", border: "none", color: "#3ab8c8", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                >
                  Sign up
                </button>
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                <a href="mailto:aisprint.app@outlook.com" style={{ color: "#666", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  Contact Admin
                </a>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError(null); }}
                style={{ background: "none", border: "none", color: "#3ab8c8", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
