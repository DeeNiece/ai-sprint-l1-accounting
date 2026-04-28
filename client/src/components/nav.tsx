import { Link, useLocation } from "wouter";
import logoImg from "@assets/ai-sprint-logo.jpg";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import {
  Sun, Moon, LogOut, Settings, HelpCircle, 
  Layers, Flame, KeyRound, CreditCard, User, ChevronDown,
  Wrench, FolderKanban, Terminal, LayoutDashboard, Rocket,
  Menu, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import type { DayProgress } from "@shared/schema";

const THEME_COLOR = "#0d7c8a"; // 🟢 Level 1 Teal

// --- Helper Functions ---
const LAUNCH_DATE = new Date("2026-04-15T00:00:00Z").getTime();
function getDaysPassed() { return Math.max(0, Math.floor((Date.now() - LAUNCH_DATE) / (1000 * 60 * 60 * 24))); }

function getDynamicTicker() {
  const days = getDaysPassed();
  return [
    `🔥 Sarah just finished Day ${Math.min(30, 4 + Math.floor(days / 3))}!`,
    `🏆 Alex unlocked 'Prompt Pro'!`,
    `🚀 Emily started the Master track!`,
    `🔥 Dee_Niece is on a ${Math.min(30, 3 + Math.floor(days / 5))}-day streak!`,
  ];
}

export default function Nav() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [loc] = useLocation();
  const { t } = useLanguage();

  const [levelOpen, setLevelOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
    enabled: !!user,
  });

  const completedCount = progressData.filter((p) => p.completed).length;

  // Rank Logic
  let rankTitle = "Advanced Novice";
  if (completedCount >= 28) { rankTitle = "AI Legend"; }
  else if (completedCount >= 21) { rankTitle = "Workflow Master"; }
  else if (completedCount >= 14) { rankTitle = "Automation Architect"; }
  else if (completedCount >= 7) { rankTitle = "Prompt Pro"; }

  const tickerMessages = getDynamicTicker();
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTickerIdx((prev) => (prev + 1) % tickerMessages.length), 4500);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  // Close everything on route change
  useEffect(() => {
    setBlueprintOpen(false);
    setCommandOpen(false);
    setLevelOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [loc]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <style>{`
        @keyframes pulse-teal {
          0% { box-shadow: 0 0 0 0 rgba(13, 124, 138, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(13, 124, 138, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 124, 138, 0); }
        }
        .pulse-icon { animation: pulse-teal 2s infinite; border-radius: 50%; }
        .nav-dropdown {
          position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: 12px; padding: 8px; min-width: 200px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); z-index: 100;
          display: flex; flex-direction: column; gap: 4px;
          backdrop-filter: blur(12px);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          text-decoration: none; color: var(--color-text); border-radius: 8px;
          font-size: 0.85rem; font-weight: 500; transition: background 0.2s;
        }
        .dropdown-item:hover { background: rgba(13, 124, 138, 0.1); color: ${THEME_COLOR}; }

        /* ── Hamburger (hidden on desktop) ── */
        .mobile-menu-btn { display: none; }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .level-switcher { display: none !important; }
          .nav-user { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }

        /* ── Overlay ── */
        .mobile-drawer-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.55); z-index: 200;
          backdrop-filter: blur(4px);
        }
        .mobile-drawer-overlay.open { display: block; }

        /* ── Drawer panel ── */
        .mobile-drawer {
          position: fixed; top: 0; right: -100%;
          width: min(320px, 85vw); height: 100dvh;
          background: var(--color-surface);
          border-left: 1px solid var(--color-border);
          z-index: 201; display: flex; flex-direction: column;
          transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
          box-shadow: -12px 0 40px rgba(0,0,0,0.3);
        }
        .mobile-drawer.open { right: 0; }

        .mobile-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .mobile-drawer-body {
          flex: 1; padding: 1rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.25rem;
          overflow-y: auto;
        }
        .mobile-drawer-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--color-border);
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
        .mobile-nav-item.active { background: rgba(13, 124, 138, 0.1); color: ${THEME_COLOR}; font-weight: 600; }
        .mobile-section-label {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-faint);
          padding: 0.75rem 0.875rem 0.25rem; margin-top: 0.5rem;
        }
        .mobile-divider { height: 1px; background: var(--color-border); margin: 0.5rem 0; }
        .mobile-rank-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 0.75rem 0.875rem;
          background: var(--color-surface-offset);
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text);
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(13, 124, 138, 0.1);
          color: ${THEME_COLOR};
        }
        .mobile-nav-sub {
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 4px;
        }
        .mobile-nav-sub-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: background 0.15s;
        }
        .mobile-nav-sub-item:hover { background: rgba(13, 124, 138, 0.08); color: ${THEME_COLOR}; }
        .mobile-divider {
          height: 1px;
          background: var(--color-border);
          margin: 8px 0;
        }
        .mobile-user-section {
          padding: 16px 20px;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 4px;
        }
        .mobile-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(13, 124, 138, 0.15);
          border: 2px solid ${THEME_COLOR};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${THEME_COLOR};
          flex-shrink: 0;
        }
        .mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #dc2626;
          background: rgba(220, 38, 38, 0.06);
          border: 1px solid rgba(220, 38, 38, 0.15);
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.15s;
        }
        .mobile-logout-btn:hover { background: rgba(220, 38, 38, 0.12); }

        /* --- Responsive breakpoint --- */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-user { display: none !important; }
          .level-switcher { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      <header className="nav-header">
        <div className="nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          
          {/* LEFT: Logo */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Link href="/" className="nav-logo">
              <img src={logoImg} alt="AI Sprint" className="nav-logo-img" />
              <div className="nav-logo-sub" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 700 }}>
                Level 1 · Basic
              </div>
            </Link>
          </div>

          {/* CENTER: Main Nav (desktop only) */}
          <nav className="nav-links" style={{ flex: 1, display: "flex", justifyContent: "center", gap: "24px" }}>
            <Link href="/" className={`nav-link ${loc === "/" ? "active" : ""}`}>{t("nav.journey")}</Link>

            {/* THE BLUEPRINT DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setBlueprintOpen(!blueprintOpen); setCommandOpen(false); }} className={`nav-link ${(loc === "/toolkit" || loc === "/portfolio" || loc === "/systems") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Rocket size={16} className="pulse-icon" style={{ color: THEME_COLOR }} /> The Blueprint <ChevronDown size={14} style={{ transform: blueprintOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
              </button>
              {blueprintOpen && (
                <div className="nav-dropdown" onMouseLeave={() => setBlueprintOpen(false)}>
                  <Link href="/systems" className="dropdown-item"><Terminal size={16} style={{ color: THEME_COLOR }} /> Built Systems</Link>
                  <Link href="/portfolio" className="dropdown-item"><FolderKanban size={16} style={{ color: THEME_COLOR }} /> Portfolio Targets</Link>
                  <Link href="/toolkit" className="dropdown-item"><Wrench size={16} style={{ color: THEME_COLOR }} /> Starter Toolkit</Link>
                </div>
              )}
            </div>

            {/* COMMAND CENTER DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setCommandOpen(!commandOpen); setBlueprintOpen(false); }} className={`nav-link ${(loc === "/settings" || loc === "/faq") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <LayoutDashboard size={16} /> Command Center <ChevronDown size={14} style={{ transform: commandOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
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
                <button className="level-switcher-btn" onClick={() => { setLevelOpen(!levelOpen); setUserMenuOpen(false); }}>
                  <Layers size={12} /> Level 1 ▾
                </button>
                {levelOpen && (
                  <div className="level-switcher-dropdown" onMouseLeave={() => setLevelOpen(false)}>
                    <a className="level-switcher-item active" href="#" onClick={(e) => e.preventDefault()}><span className="level-switcher-dot" style={{ background: THEME_COLOR }} /> Level 1 · Basic</a>
                    <a className="level-switcher-item" href="https://ai-sprint-l2-production.up.railway.app"><span className="level-switcher-dot" style={{ background: "#7c3aed" }} /> Level 2 · Advanced</a>
                    <a className="level-switcher-item" href="https://ai-sprint-l3-production.up.railway.app"><span className="level-switcher-dot" style={{ background: "#b8630a" }} /> Level 3 · Master</a>
                  </div>
                )}
              </div>
            )}

            {user && (
              <div className="nav-user" style={{ position: 'relative' }}>
                <button 
                  className="level-switcher-btn" 
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setLevelOpen(false); }}
                  style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4px 10px' }}
                >
                  <User size={14} />
                  <span className="nav-user-name" style={{ marginLeft: '4px' }}>{user.displayName}</span>
                  <ChevronDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} />
                </button>

                {userMenuOpen && (
                  <div className="level-switcher-dropdown" style={{ minWidth: '220px', padding: '12px', right: 0 }} onMouseLeave={() => setUserMenuOpen(false)}>
                    
                    {/* FLAME & RANKING */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', borderBottom: '1px solid var(--color-divider)', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 800 }}>
                        <Flame size={16} fill="#f97316" stroke="#f97316" /> {completedCount}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: THEME_COLOR }}>{rankTitle}</div>
                    </div>
                    
                    {/* PLAN INFO */}
                    <div className="level-switcher-item" style={{ cursor: 'default', opacity: 0.8 }}>
                      <CreditCard size={14} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Current Plan</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: THEME_COLOR }}>Level 1 · Basic</span>
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-divider)', margin: '8px 0' }} />
                    
                    {/* RESET PASSWORD & PRICING */}
                    <Link href="/settings/password" className="level-switcher-item" onClick={() => setUserMenuOpen(false)}>
                      <KeyRound size={14} /> Reset Password
                    </Link>
                    <Link href="/pricing" className="level-switcher-item" onClick={() => setUserMenuOpen(false)}>
                      <CreditCard size={14} /> Pricing & Upgrades
                    </Link>

                    <div style={{ height: '1px', background: 'var(--color-divider)', margin: '8px 0' }} />
                    
                    {/* LOG OUT */}
                    <button onClick={logout} className="level-switcher-item" style={{ width: '100%', color: '#dc2626', background: 'none', border: 'none', textAlign: 'left' }}>
                      <LogOut size={14} /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={toggle} className="icon-btn">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} /> }
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`} role="dialog" aria-label="Navigation menu">

        {/* Header */}
        <div className="mobile-drawer-header">
          <Link href="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src={logoImg} alt="AI Sprint" className="nav-logo-img" />
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 700 }}>
              Level 1 · Basic
            </div>
          </Link>
          <button className="icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="mobile-drawer-body">

          {user && (
            <div className="mobile-rank-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#ff6b6b", fontWeight: 800 }}>
                <Flame size={16} /> {completedCount}
              </div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: THEME_COLOR }}>{rankTitle}</div>
            </div>
          )}

          <div className="mobile-section-label">Navigation</div>
          <Link href="/" className={`mobile-nav-item ${loc === "/" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={16} /> {t("nav.journey")}
          </Link>

          {user && (
            <>
              <div className="mobile-section-label">Switch Level</div>
              <a className="mobile-nav-item active" href="#" onClick={(e) => e.preventDefault()} style={{ color: THEME_COLOR }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: THEME_COLOR, flexShrink: 0 }} /> Level 1 · Basic (current)
              </a>
              <a className="mobile-nav-item" href="https://ai-sprint-l2-production.up.railway.app">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} /> Level 2 · Advanced
              </a>
              <a className="mobile-nav-item" href="https://ai-sprint-l3-production.up.railway.app">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#b8630a", flexShrink: 0 }} /> Level 3 · Master
              </a>
            </>
          )}

          <div className="mobile-section-label">The Blueprint</div>
          <Link href="/systems" className={`mobile-nav-item ${loc === "/systems" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Terminal size={16} style={{ color: THEME_COLOR }} /> Built Systems
          </Link>
          <Link href="/portfolio" className={`mobile-nav-item ${loc === "/portfolio" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <FolderKanban size={16} style={{ color: THEME_COLOR }} /> Portfolio Targets
          </Link>
          <Link href="/toolkit" className={`mobile-nav-item ${loc === "/toolkit" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Wrench size={16} style={{ color: THEME_COLOR }} /> Starter Toolkit
          </Link>

          <div className="mobile-section-label">Command Center</div>
          <Link href="/settings" className={`mobile-nav-item ${loc === "/settings" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Settings size={16} /> {t("nav.settings")}
          </Link>
          <Link href="/faq" className={`mobile-nav-item ${loc === "/faq" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <HelpCircle size={16} /> Help & FAQ
          </Link>

        </div>

        {/* Footer */}
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
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="mobile-nav-item"
              style={{ color: "#dc2626" }}
            >
              <LogOut size={16} /> {t("nav.logout")}
            </button>
          </div>
        )}
      </div>

      {/* TICKER — hidden when mobile drawer is open */}
      {user && !mobileMenuOpen && (
        <div style={{
          position: "fixed", bottom: "20px", left: "20px", background: "rgba(26, 27, 38, 0.8)",
          backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", 
          padding: "10px 15px", borderRadius: "50px", display: "flex", alignItems: "center", 
          gap: "10px", boxShadow: "var(--shadow-md)", zIndex: 1000, fontSize: "0.85rem", fontWeight: 500,
        }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: THEME_COLOR, borderRadius: "50%", boxShadow: `0 0 8px ${THEME_COLOR}` }} />
          <span key={tickerIdx} style={{ animation: "fadeIn 0.5s ease-in-out", color: "white" }}>{tickerMessages[tickerIdx]}</span>
        </div>
      )}
    </>
  );
}
