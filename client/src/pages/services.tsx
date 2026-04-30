import { useState } from "react";
import Nav from "@/components/nav";
import { serviceLadder } from "@/data/curriculum";
import { useAuth } from "@/components/auth-provider";
import { TrendingUp, CheckCircle2, DollarSign, Lock, Layers } from "lucide-react";
import { Link } from "wouter";

// ── Level theme ────────────────────────────────────────────────
const L1_COLOR = "#0d7c8a"; // Teal — Basic
const L2_COLOR = "#e8820c"; // Orange — Advanced

export default function ServicesPage() {
  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<"1" | "2" | "both">("1");

  const licensed     = user?.licensedLevels || [];
  const hasBasic     = licensed.includes("accounting-basic")    || licensed.includes("accounting-bundle");
  const hasAdvanced  = licensed.includes("accounting-advanced") || licensed.includes("accounting-bundle");

  const THEME       = activeLevel === "2" ? L2_COLOR : L1_COLOR;
  const THEME_ALPHA = activeLevel === "2" ? "rgba(232,130,12,0.08)" : "rgba(13,124,138,0.08)";
  const THEME_BORDER = activeLevel === "2" ? "rgba(232,130,12,0.15)" : "rgba(13,124,138,0.15)";

  const filteredServices = serviceLadder.filter(
    (s) => s.level === activeLevel || s.level === "both"
  );

  const levelLabel = activeLevel === "1"
    ? "Basic — AI Bookkeeping & Reporting Services"
    : activeLevel === "2"
      ? "Advanced — AI Finance Strategy & Governance Services"
      : "Full Service Suite — Basic + Advanced";

  return (
    <div className="page-wrap">
      <Nav />
      <div className="inner-page">

        {/* Header */}
        <div className="inner-page-header" style={{
          textAlign: "center", padding: "3rem 1.5rem",
          background: THEME_ALPHA,
          border: `1px solid ${THEME_BORDER}`,
          borderRadius: "24px", marginBottom: "3rem",
        }}>
          <span className="inner-page-badge" style={{ background: THEME, color: "white", fontWeight: 800 }}>
            {activeLevel === "1" ? "Level 1 Basic" : activeLevel === "2" ? "Level 2 Advanced" : "Full Suite"}
          </span>
          <h1 className="inner-page-title" style={{ fontSize: "2.5rem", marginTop: "1rem" }}>
            Service Ladder
          </h1>
          <p className="inner-page-desc" style={{ maxWidth: "600px", margin: "1rem auto 0" }}>
            The services you can offer after completing the accounting course — priced, packaged, and ready to deploy with your AI skills.
          </p>

          {/* Level switcher */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {(["1", "2", "both"] as const).map((lvl) => {
              const color = lvl === "2" ? L2_COLOR : L1_COLOR;
              const label = lvl === "1" ? "Basic Services" : lvl === "2" ? "Advanced Services" : "Full Suite";
              const active = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 20px", borderRadius: "50px", cursor: "pointer",
                    border: `1.5px solid ${active ? color : "var(--color-border)"}`,
                    background: active ? `${color}1a` : "transparent",
                    color: active ? color : "var(--color-text-muted)",
                    fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section title */}
        <section className="services-section">
          <h2 className="services-section-title" style={{ display: "flex", alignItems: "center", gap: "10px", color: THEME }}>
            <TrendingUp size={20} /> {levelLabel}
          </h2>

          {/* Service cards */}
          <div className="services-grid" style={{
            display: "grid", gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            marginTop: "2rem",
          }}>
            {filteredServices.map((tier, i) => {
              const color = tier.level === 2 ? L2_COLOR : tier.level === "both" ? "#7a5fc0" : L1_COLOR;
              const colorAlpha = tier.level === 2
                ? "rgba(232,130,12,0.1)"
                : tier.level === "both"
                  ? "rgba(122,95,192,0.1)"
                  : "rgba(13,124,138,0.1)";
              const levelTag = tier.level === 1
                ? "Basic"
                : tier.level === 2
                  ? "Advanced"
                  : "Basic + Advanced";

              return (
                <div key={i} className="service-card" style={{
                  background: "rgba(22, 23, 30, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${color}22`,
                  borderRadius: "20px",
                  padding: "2rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Tier badge */}
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    padding: "6px 14px",
                    background: colorAlpha,
                    borderBottomLeftRadius: "12px",
                    fontSize: "0.68rem", fontWeight: 900,
                    color: color, letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}>
                    Tier {tier.tier} · {levelTag}
                  </div>

                  {/* Name + price */}
                  <div className="service-card-header" style={{ marginBottom: "1.25rem", paddingRight: "60px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "white", lineHeight: 1.3 }}>
                      {tier.name}
                    </h3>
                    <span style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "1.4rem", fontWeight: 900,
                      color: color, marginTop: "0.5rem",
                    }}>
                      <DollarSign size={16} />
                      {tier.price.replace("$", "")}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{
                    padding: "12px", background: "rgba(0,0,0,0.2)",
                    borderRadius: "8px", borderLeft: `3px solid ${color}`,
                    marginBottom: "1.25rem",
                  }}>
                    <p style={{ fontSize: "0.88rem", color: "#aaa", margin: 0, lineHeight: 1.5 }}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div style={{
                    fontSize: "0.72rem", fontWeight: 800, color: "white",
                    textTransform: "uppercase", marginBottom: "0.75rem",
                    letterSpacing: "0.05em",
                  }}>
                    What's included
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {tier.examples.map((ex, j) => (
                      <li key={j} style={{
                        display: "flex", alignItems: "flex-start", gap: "10px",
                        fontSize: "0.84rem", color: "#ccc", marginBottom: "10px",
                      }}>
                        <CheckCircle2 size={13} style={{ color, marginTop: "2px", flexShrink: 0 }} />
                        {ex}
                      </li>
                    ))}
                  </ul>

                  {/* Level unlock note */}
                  {tier.level !== "both" && (
                    <div style={{
                      marginTop: "1.25rem", padding: "8px 12px",
                      background: colorAlpha,
                      borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <Layers size={13} style={{ color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                        {tier.level === 1
                          ? "Unlocked after completing Basic track"
                          : "Unlocked after completing Advanced track"
                        }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Upgrade / progress nudge */}
        <section style={{ marginTop: "4rem", padding: "2rem", background: "rgba(0,0,0,0.2)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                Ready to offer these services?
              </h3>
              <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Complete your track to build the skills, portfolio pieces, and confidence to deliver each service at a professional level. Every deliverable in the course is designed to become a real client output.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
              {!hasBasic && (
                <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L1_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  <Lock size={14} /> Unlock Basic Track
                </Link>
              )}
              {!hasAdvanced && (
                <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L2_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  <Lock size={14} /> Unlock Advanced Track
                </Link>
              )}
              {hasBasic && hasAdvanced && (
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: L1_COLOR, color: "white", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  Continue Your Journey →
                </Link>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
