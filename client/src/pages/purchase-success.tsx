import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Loader2 } from "lucide-react";
import Nav from "@/components/nav";
import { useAuth } from "@/components/auth-provider";

export default function PurchaseSuccessPage() {
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const sessionId = params.get("session_id");
    if (!sessionId) { setStatus("error"); return; }

    fetch(`/api/stripe/session/${sessionId}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.paid) {
          setLevels(data.licensedLevels || []);
          await refreshUser();
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="page-wrap">
      <Nav />
      <main className="purchase-success-page">
        {status === "loading" && (
          <div className="purchase-loading">
            <Loader2 size={32} className="spin" />
            <p>Confirming your payment…</p>
          </div>
        )}
        {status === "success" && (
          <div className="purchase-success-card">
            <CheckCircle2 size={56} className="purchase-success-icon" />
            <h1>Payment Confirmed!</h1>
            <p>Welcome to AI Sprint. You now have access to:</p>
            <div className="purchase-levels">
              {levels.map((l) => (
                <span key={l} className="purchase-level-badge">Level {l}</span>
              ))}
            </div>
            <p className="purchase-note">
              Your access is tied to <strong>this email address</strong>. Keep your login credentials safe.
            </p>
            <Link href="/" className="purchase-cta">Start Learning →</Link>
          </div>
        )}
        {status === "error" && (
          <div className="purchase-success-card">
            <h1>Something went wrong</h1>
            <p>We couldn't confirm your payment. If you were charged, contact support with your Stripe receipt.</p>
            <Link href="/" className="purchase-cta">Go Home</Link>
          </div>
        )}
      </main>
    </div>
  );
}
