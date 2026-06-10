// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: pricing.tsx | Repo: accounting
// Last updated: June 2026
//
// PRICING UPDATE: Single $59 price grants both tracks (56 days total)
// USD_PRICES/PLANS removed — COURSE_PRICE_USD=59 is the only purchase option
//
// Course structure:
// - Level 1: Basic (28 days) — AI-powered accounting fundamentals & workflows
// - Level 2: Advanced (28 days) — professional automation, governance & CFO-level reporting
// - Total: 56 days of curriculum, 8 weeks, 2 completion certificates
//
// ── THEME SYSTEM ─────────────────────────────────────────────────────────────
// Theme is read from useTheme() — the same React context the Nav uses.
// Dark  → near-black bg (#0d0d14)  + light text (#e8e6f4 / #9896b0)
// Light → white/light-gray bg      + dark text  (#111827 / #374151)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import Nav from "@/components/nav";
import {
  CheckCircle2, Lock, CreditCard,
  Mail, Send, AlertCircle, UserCircle,
  BookOpen, TrendingUp,
} from "lucide-react";

// ── Course pricing constants ─────────────────────────────────────────────────
const COURSE_PRICE_USD = 59;
const COURSE_ORIG_USD  = 75; // crossed-out original

const L1_COLOR = "#0d7c8a";  // Basic track
const L2_COLOR = "#e8820c";  // Advanced track

// ── Pricing Page ──────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) setLoading(null); };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // ── Hide Nav when rendered inside iframe (e.g. pricing popout) ──────────
  useEffect(() => {
    if (window.self !== window.top) {
      document.documentElement.classList.add("in-iframe");
    }
  }, []);


  const licensed = user?.licensedLevels || [];
  const ownsAll  = licensed.some(l => ["accounting-bundle", "accounting-basic", "accounting-advanced"].includes(l));



                <button

                <div>={{ fontSize: "0.75rem", color: liveRateClr, textAlign: "center" }}>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Level Comparison Section ───────────────────────────────────── */}
        <LevelComparison />

        {/* Error */}
        {error && (
          <div style={{ maxWidth: 680, margin: "24px auto 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 18px", color: "#ef4444", fontSize: "0.88rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Footer note */}
        <div style={{ textAlign: "center", padding: "48px 20px 60px", fontSize: "0.8rem", color: footerClr, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Lock size={14} />
          Secure payments via Stripe · Lifetime access · Email used at purchase is your account
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Need team pricing? <a href="mailto:support@aisprint.app" style={{ color: L1_COLOR, textDecoration: "underline" }}>Contact sales</a></span>
        </div>
      </main>

      <ContactSection />
    </div>
  );
}