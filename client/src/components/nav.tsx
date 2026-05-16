// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: nav.tsx  |  Repo: accounting
// Last updated: May 2026
//
// Navigation bar with:
//   - Dark/light mode support (useTheme)
//   - Level switcher (Basic / Advanced)
//   - User menu with rank, progress, and plan info
//   - Mobile drawer menu
//   - Live activity ticker
//   - Optional onOpenAuth callback to trigger AuthModal from parent page

import { Link, useLocation } from "wouter";
import logoImg from "@assets/ai-sprint-logo.jpg";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import {
  Sun, Moon, LogOut, Settings, HelpCircle,
  Layers, Flame, KeyRound, CreditCard, User, ChevronDown,
  Wrench, FolderKanban, Terminal, LayoutDashboard, Rocket, BarChart2,
  Menu, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import type { DayProgress } from "@shared/schema";

const THEME_COLOR = "#0d7c8a"; // Accounting primary teal

// ── Helper functions for ticker ────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-04-15T00:00:00Z").getTime();
function getDaysPassed() {
  return Math.max(0, Math.floor((Date.now() - LAUNCH_DATE) / (1000 * 60 * 60 * 24)));
}

function getDynamicTicker() {
  const days = getDaysPassed();
  return [
    `🔥 Sarah just finished Day ${Math.min(28, 4 + Math.floor(days / 3))}!`,
    `🏆 Alex unlocked 'Prompt Pro'!`,
    `🚀 Emily started the Advanced track!`,
    `🔥 Dee_Niece is on a ${Math.min(28, 3 + Math.floor(days / 5))}-day streak!`,
  ];
}

interface NavProps {
  onOpenAuth?: (mode: "login" | "register") => void;
}

export default function Nav({ onOpenAuth }: NavProps) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  // ── Level detection: from URL (day pages) or localStorage ─────────────────
  function getLevelFromUrl(): "1" | "2" {
    const match = location.match(/\/day\/L([12])-/);
    if (match) return match[1] as "1" | "2";
    try {
      const stored = localStorage.getItem("accounting_level");
      if (stored === "2") return "2";
    } catch {}
    return "1";
  }

  const [activeLevel, setActiveLevelState] = useState<"1" | "2">(getLevelFromUrl);
  const LEVEL_COLOR = activeLevel === "2" ? "#e8820c" : THEME_COLOR;
  const LEVEL_LABEL = activeLevel === "2" ? "Advanced Track" : "Basic Track";

  // Sync activeLevel when URL changes
  useEffect(() => {
    const urlLevel = getLevelFromUrl();
    if (urlLevel !== activeLevel) {
      setActiveLevelState(urlLevel);
      try { localStorage.setItem("accounting_level", urlLevel); } catch {}
    }
  }, [location]);

  // ── Switch level and navigate to home page (dashboard) ────────────────────
  function switchLevel(lvl: "1" | "2") {
    try { localStorage.setItem("accounting_level", lvl); } catch {}
    setActiveLevelState(lvl);
    setLocation("/");  // Force home page to reload with the new level
    setLevelOpen(false);
    setMobileMenuOpen(false);
  }

  // ── UI state ─────────────────────────────────────────────────────────────
  const [levelOpen, setLevelOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
    enabled: !!user,
  });

  // Completed days for the CURRENT level (dayNumber must be prefixed with L1- or L2-)
  const completedCount = progressData.filter((p) => {
    const dayStr = String(p.dayNumber);
    return (activeLevel === "1" && dayStr.startsWith("L1-") && p.completed) ||
           (activeLevel === "2" && dayStr.startsWith("L2-") && p.completed);
  }).length;

  // Rank logic (based on completed days)
  let rankTitle = "AI Curious";
  if (completedCount >= 28) rankTitle = "AI Accounting Legend";
  else if (completedCount >= 21) rankTitle = "Advisory Pro";
  else if (completedCount >= 14) rankTitle = "Workflow Architect";
  else if (completedCount >= 7) rankTitle = "Prompt Accountant";

  const tickerMessages = getDynamicTicker();
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % tickerMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  // Close dropdowns on route change
  useEffect(() => {
    setBlueprintOpen(false);
    setCommandOpen(false);
    setLevelOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Theme‑aware colours
  const textPrimary = isDark ? "white" : "#1a1a2e";
  const textMuted = isDark ? "#aaa" : "#4a5568";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const bgSurface = isDark ? "rgba(22,23,30,0.95)" : "#ffffff";

  return (
    <>
      <style>{`
        @keyframes pulse-teal {
          0% { box-shadow: 0 0 0 0 rgba(13,124,138,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(13,124,138,0); }
          100% { box-shadow: 0 0 0 0 rgba(13,124,138,0); }
        }
        .pulse-icon { animation: pulse-teal 2s infinite; border-radius: 50%; }
        .nav-dropdown {
          position: absolute; top: calc(100% + 10px); left: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px; padding: 8px; min-width: 200px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); z-index: 100;
          display: flex; flex-direction: column; gap: 4px;
          backdrop-filter: blur(12px);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          text-decoration: none; color: var(--color-text); border-radius: 8px;
          font-size: 0.85rem; font-weight: 500; transition: background 0.2s;
        }
        .dropdown-item:hover { background: rgba(13,124,138,0.1); color: ${THEME_COLOR}; }
        .level-switcher { position: relative; }
        .level-switcher-btn {
          display: flex; align-items: center; gap: 8px; padding: 6px 12px;
          border-radius: 40px; font-size: 0.8rem; font-weight: 600;
          background: var(--color-surface-offset); border: 1px solid var(--color-border);
          cursor: pointer; transition: all 0.2s;
        }
        .level-switcher-dropdown {
          position: absolute; top: 100%; right: 0; margin-top: 8px;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: 12px; padding: 6px; min-width: 180px;
          z-index: 100; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          backdrop-filter: blur(12px);
        }
        .level-switcher-item {
          display: flex; align-items: center; gap: 10px; padding: 8px 12px;
          border-radius: 8px; font-size: 0.85rem; font-weight: 500;
          cursor: pointer; transition: background 0.15s; width: 100%;
          background: none; border: none; text-align: left;
        }
        .level-switcher-item:hover { background: rgba(13,124,138,0.1); }
        .level-switcher-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* Mobile styles */
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .level-switcher { display: none !important; }
          .nav-user { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
        .mobile-drawer-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.55); z-index: 200;
          backdrop-filter: blur(4px);
        }
        .mobile-drawer-overlay.open { display: block; }
        .mobile-drawer {
          position: fixed; top: 0; right: -100%;
          width: min(320px, 85vw); height: 100dvh;
          background: var(--color-surface);
          border-left: 1px solid var(--color-border);
          z-index: 201; display: flex; flex-direction: column;
          transition: right 0.3s cubic-bezier(0.16,1,0.3,1);
          overflow-y: auto;
          box-shadow: -12px 0 40px rgba(0,0,0,0.3);
        }
        .mobile-drawer.open { right: 0; }
        .mobile-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .mobile-drawer-body {
          flex: 1; padding: 1rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.25rem;
          overflow-y: auto;
        }
        .mobile-drawer-footer {
          padding: 1rem 1.25rem; border-top: 1px solid var(--color-border);
          display: flex; flex-direction: column; gap: 0.5rem;
          flex-shrink: 0;
        }
        .mobile-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.75rem 0.875rem; border-radius: var(--radius-md);
          font-size: var(--text-sm); font-weight: 500;
          color: var(--color-text-muted); text-decoration: none;
          transition: all 0.15s; width: 100%;
          background: none; border: none; text-align: left; cursor: pointer;
        }
        .mobile-nav-item:hover { background: var(--color-surface-offset); color: var(--color-text); }
        .mobile-nav-item.active { background: rgba(13,124,138,0.1); color: ${THEME_COLOR}; font-weight: 600; }
        .mobile-section-label {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-faint);
          padding: 0.75rem 0.875rem 0.25rem; margin-top: 0.5rem;
        }
        .mobile-divider { height: 1px; background: var(--color-border); margin: 0.5rem 0; }
        .mobile-rank-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 0.75rem 0.875rem; background: var(--color-surface-offset);
          border-radius: var(--radius-md); margin-bottom: 0.5rem;
        }
      `}</style>

      <header className="nav-header" style={{
        background: bgSurface,
        borderBottom: `1px solid ${borderColor}`,
        padding: "0.75rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}>
        <div className="nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>

          {/* LEFT: Logo */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Link href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <img src={logoImg} alt="AI Sprint" className="nav-logo-img" style={{ height: "40px" }} />
              <div className="nav-logo-sub" style={{ fontSize: "0.75rem", color: textMuted, fontWeight: 700 }}>
                Accounting · {LEVEL_LABEL.replace(" Track", "")}
              </div>
            </Link>
          </div>

          {/* CENTER: Main Nav (desktop only) */}
          <nav className="nav-links" style={{ flex: 1, display: "flex", justifyContent: "center", gap: "24px" }}>
            <Link href="/" className={`nav-link ${location === "/" ? "active" : ""}`} style={{ color: location === "/" ? THEME_COLOR : textMuted, textDecoration: "none", fontWeight: 500 }}>
              {t("nav.journey")}
            </Link>

            {/* The Blueprint dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setBlueprintOpen(!blueprintOpen); setCommandOpen(false); }}
                className={`nav-link ${["/toolkit", "/portfolio", "/systems", "/services"].includes(location) ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: textMuted }}
              >
                <Rocket size={16} className="pulse-icon" style={{ color: THEME_COLOR }} />
                The Blueprint
                <ChevronDown size={14} style={{ transform: blueprintOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
              </button>
              {blueprintOpen && (
                <div className="nav-dropdown" onMouseLeave={() => setBlueprintOpen(false)}>
                  <Link href="/systems" className="dropdown-item"><Terminal size={16} style={{ color: THEME_COLOR }} /> AI Workflows</Link>
                  <Link href="/portfolio" className="dropdown-item"><FolderKanban size={16} style={{ color: THEME_COLOR }} /> Portfolio Targets</Link>
                  <Link href="/toolkit" className="dropdown-item"><Wrench size={16} style={{ color: THEME_COLOR }} /> Accountant Toolkit</Link>
                  <Link href="/services" className="dropdown-item"><BarChart2 size={16} style={{ color: THEME_COLOR }} /> Client Services</Link>
                </div>
              )}
            </div>

            {/* Command Center dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setCommandOpen(!commandOpen); setBlueprintOpen(false); }}
                className={`nav-link ${["/settings", "/faq"].includes(location) ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: textMuted }}
              >
                <LayoutDashboard size={16} /> Command Center
                <ChevronDown size={14} style={{ transform: commandOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
              </button>
              {commandOpen && (
                <div className="nav-dropdown" onMouseLeave={() => setCommandOpen(false)}>
                  <Link href="/settings" className="dropdown-item"><Settings size={16} /> {t("nav.settings")}</Link>
                  <Link href="/faq" className="dropdown-item"><HelpCircle size={16} /> Help & FAQ</Link>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Controls */}
          <div className="nav-controls" style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
            {user && (
              <div className="level-switcher">
                <button
                  className="level-switcher-btn"
                  onClick={() => { setLevelOpen(!levelOpen); setUserMenuOpen(false); }}
                  style={{ borderColor: LEVEL_COLOR, color: LEVEL_COLOR }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: LEVEL_COLOR, flexShrink: 0 }} />
                  {LEVEL_LABEL} ▾
                </button>
                {levelOpen && (
                  <div className="level-switcher-dropdown" onMouseLeave={() => setLevelOpen(false)}>
                    <button
                      className="level-switcher-item"
                      onClick={() => switchLevel("1")}
                      style={{ color: activeLevel === "1" ? THEME_COLOR : textMuted, fontWeight: activeLevel === "1" ? 700 : 500 }}
                    >
                      <span className="level-switcher-dot" style={{ background: THEME_COLOR }} />
                      Basic Track
                      {activeLevel === "1" && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
                    </button>
                    <button
                      className="level-switcher-item"
                      onClick={() => switchLevel("2")}
                      style={{ color: activeLevel === "2" ? "#e8820c" : textMuted, fontWeight: activeLevel === "2" ? 700 : 500 }}
                    >
                      <span className="level-switcher-dot" style={{ background: "#e8820c" }} />
                      Advanced Track
                      {activeLevel === "2" && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && (
              <div className="nav-user" style={{ position: "relative" }}>
                <button
                  className="level-switcher-btn"
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setLevelOpen(false); }}
                  style={{ background: "transparent", border: `1px solid ${borderColor}`, borderRadius: "8px", padding: "4px 10px", color: textPrimary }}
                >
                  <User size={14} />
                  <span className="nav-user-name" style={{ marginLeft: "4px" }}>{user.displayName}</span>
                  <ChevronDown size={12} style={{ marginLeft: "4px", opacity: 0.5 }} />
                </button>
                {userMenuOpen && (
                  <div className="level-switcher-dropdown" style={{ minWidth: "220px", padding: "12px", right: 0 }} onMouseLeave={() => setUserMenuOpen(false)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 4px", borderBottom: `1px solid ${borderColor}`, marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f97316", fontWeight: 800 }}>
                        <Flame size={16} fill="#f97316" stroke="#f97316" /> {completedCount}
                      </div>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: THEME_COLOR }}>{rankTitle}</div>
                    </div>
                    <div className="level-switcher-item" style={{ cursor: "default", opacity: 0.8 }}>
                      <CreditCard size={14} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-faint)" }}>Current Plan</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: THEME_COLOR }}>Accounting · {LEVEL_LABEL}</span>
                      </div>
                    </div>
                    <div style={{ height: "1px", background: borderColor, margin: "8px 0" }} />
                    <Link href="/settings/password" className="level-switcher-item" onClick={() => setUserMenuOpen(false)}>
                      <KeyRound size={14} /> Reset Password
                    </Link>
                    <Link href="/pricing" className="level-switcher-item" onClick={() => setUserMenuOpen(false)}>
                      <CreditCard size={14} /> Pricing & Upgrades
                    </Link>
                    <div style={{ height: "1px", background: borderColor, margin: "8px 0" }} />
                    <button onClick={logout} className="level-switcher-item" style={{ width: "100%", color: "#dc2626", background: "none", border: "none", textAlign: "left" }}>
                      <LogOut size={14} /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Dark/light toggle */}
            <button onClick={toggle} className="icon-btn" style={{ background: "none", border: "none", cursor: "pointer", color: textPrimary }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!user && (
              <>
                <button
                  onClick={() => onOpenAuth?.("login")}
                  style={{ background: "transparent", border: `1px solid ${borderColor}`, borderRadius: "8px", padding: "6px 12px", cursor: "pointer", color: textPrimary }}
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth?.("register")}
                  style={{ background: THEME_COLOR, border: "none", borderRadius: "8px", padding: "6px 16px", cursor: "pointer", color: "white", fontWeight: 700 }}
                >
                  Start Journey
                </button>
              </>
            )}

            {/* Hamburger – mobile only */}
            <button
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              style={{ background: "none", border: "none", cursor: "pointer", color: textPrimary }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay and drawer */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`} role="dialog" aria-label="Navigation menu" style={{ background: bgSurface }}>
        <div className="mobile-drawer-header">
          <Link href="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <img src={logoImg} alt="AI Sprint" className="nav-logo-img" style={{ height: "32px" }} />
            <div style={{ fontSize: "0.75rem", color: textMuted }}>Accounting</div>
          </Link>
          <button className="icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", color: textPrimary }}>
            <X size={20} />
          </button>
        </div>
        <div className="mobile-drawer-body">
          {user && (
            <div className="mobile-rank-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#ff6b6b", fontWeight: 800 }}>
                <Flame size={16} /> {completedCount}
              </div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: THEME_COLOR }}>{rankTitle}</div>
            </div>
          )}

          <div className="mobile-section-label">Navigation</div>
          <Link href="/" className={`mobile-nav-item ${location === "/" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={16} /> {t("nav.journey")}
          </Link>

          {user && (
            <>
              <div className="mobile-section-label">Track</div>
              <button
                className={`mobile-nav-item ${activeLevel === "1" ? "active" : ""}`}
                onClick={() => { switchLevel("1"); setMobileMenuOpen(false); }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: THEME_COLOR, flexShrink: 0 }} /> Basic Track
                {activeLevel === "1" && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
              </button>
              <button
                className={`mobile-nav-item ${activeLevel === "2" ? "active" : ""}`}
                onClick={() => { switchLevel("2"); setMobileMenuOpen(false); }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8820c", flexShrink: 0 }} /> Advanced Track
                {activeLevel === "2" && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
              </button>
            </>
          )}

          <div className="mobile-section-label">The Blueprint</div>
          <Link href="/systems" className={`mobile-nav-item ${location === "/systems" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Terminal size={16} style={{ color: THEME_COLOR }} /> AI Workflows
          </Link>
          <Link href="/portfolio" className={`mobile-nav-item ${location === "/portfolio" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <FolderKanban size={16} style={{ color: THEME_COLOR }} /> Portfolio Targets
          </Link>
          <Link href="/toolkit" className={`mobile-nav-item ${location === "/toolkit" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Wrench size={16} style={{ color: THEME_COLOR }} /> Accountant Toolkit
          </Link>
          <Link href="/services" className={`mobile-nav-item ${location === "/services" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <BarChart2 size={16} style={{ color: THEME_COLOR }} /> Client Services
          </Link>

          <div className="mobile-section-label">Command Center</div>
          <Link href="/settings" className={`mobile-nav-item ${location === "/settings" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Settings size={16} /> {t("nav.settings")}
          </Link>
          <Link href="/faq" className={`mobile-nav-item ${location === "/faq" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <HelpCircle size={16} /> Help & FAQ
          </Link>
        </div>

        {user && (
          <div className="mobile-drawer-footer" style={{ paddingBottom: "80px" }}>
            <Link href="/settings/password" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <KeyRound size={16} /> Reset Password
            </Link>
            <Link href="/pricing" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <CreditCard size={16} /> Pricing & Upgrades
            </Link>
            <div className="mobile-divider" />
            <button onClick={toggle} className="mobile-nav-item">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-nav-item" style={{ color: "#dc2626" }}>
              <LogOut size={16} /> {t("nav.logout")}
            </button>
          </div>
        )}
      </div>

      {/* Live ticker – only for logged‑in users and when drawer closed */}
      {user && !mobileMenuOpen && (
        <div style={{
          position: "fixed", bottom: "20px", left: "20px",
          background: "rgba(26,27,38,0.8)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "10px 15px", borderRadius: "50px",
          display: "flex", alignItems: "center", gap: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 1000,
          fontSize: "0.85rem", fontWeight: 500,
        }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: THEME_COLOR, borderRadius: "50%", boxShadow: `0 0 8px ${THEME_COLOR}` }} />
          <span key={tickerIdx} style={{ animation: "fadeIn 0.5s ease-in-out", color: "white" }}>
            {tickerMessages[tickerIdx]}
          </span>
        </div>
      )}
    </>
  );
}