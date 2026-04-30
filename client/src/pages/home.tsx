import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Nav from "@/components/nav";
import aiSprintLogo from "@/ai-sprint-logo.png";
import {
  curriculumL1, curriculumL2,
  weekOverviewsL1, weekOverviewsL2,
  type Category, type DayLesson,
} from "@/data/curriculum";
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, Filter,
  Clock, Trophy, Brain, ArrowUpRight, Flame, PlayCircle,
  Sparkles, Target, Lock,
} from "lucide-react";
import type { DayProgress } from "@shared/schema";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/components/auth-provider";

// ── Level theme ────────────────────────────────────────────────
const L1_COLOR = "#0d7c8a"; // Teal — Basic
const L2_COLOR = "#e8820c"; // Orange — Advanced

// ── Category colors per level ──────────────────────────────────
const L1_CATEGORY_COLORS: Record<string, string> = {
  Foundations: "#0d7c8a",
  Bookkeeping: "#2f6fa8",
  Reporting: "#7a5fc0",
  "Tax & Compliance": "#c07a2f",
  "Controls & Ethics": "#2f8c5c",
  Mixed: "#8c4a2f",
};

const L2_CATEGORY_COLORS: Record<string, string> = {
  Strategy: "#e8820c",
  Workflows: "#c4620a",
  Reporting: "#a0510a",
  "Controls & Governance": "#7a3e08",
  Advisory: "#5a2e05",
  Mixed: "#8c4a2f",
};

// ── Filter types ───────────────────────────────────────────────
type FilterL1 = "all" | "foundations" | "bookkeeping" | "reporting" | "controls-ethics" | "tax-compliance";
type FilterL2 = "all" | "strategy" | "workflows" | "reporting" | "controls-governance" | "advisory";
type FilterType = FilterL1 | FilterL2;

function matchesFilterL1(day: DayLesson, filter: FilterType) {
  if (filter === "all") return true;
  if (filter === "foundations")     return day.category === "Foundations";
  if (filter === "bookkeeping")     return day.category === "Bookkeeping";
  if (filter === "reporting")       return day.category === "Reporting";
  if (filter === "controls-ethics") return day.category === "Controls & Ethics";
  if (filter === "tax-compliance")  return day.category === "Tax & Compliance";
  return true;
}

function matchesFilterL2(day: DayLesson, filter: FilterType) {
  if (filter === "all") return true;
  if (filter === "strategy")             return day.category === "Strategy";
  if (filter === "workflows")            return day.category === "Workflows";
  if (filter === "reporting")            return day.category === "Reporting";
  if (filter === "controls-governance")  return day.category === "Controls & Governance";
  if (filter === "advisory")             return day.category === "Advisory";
  return true;
}

const TOTAL_DAYS = 28;

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const search = useSearch();
  const urlLevel = new URLSearchParams(search).get("level") === "2" ? "2" : "1";
  const [activeLevel, setActiveLevel] = useState<"1" | "2">(urlLevel);

  // Sync with URL when it changes (nav level switcher)
  useEffect(() => {
    setActiveLevel(urlLevel);
  }, [urlLevel]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [animatedPct, setAnimatedPct] = useState(0);
  const [showArrow, setShowArrow] = useState(true);
  const lessonsRef = useRef<HTMLElement>(null);

  const THEME       = activeLevel === "1" ? L1_COLOR : L2_COLOR;
  const THEME_ALPHA = activeLevel === "1" ? "rgba(13,124,138,0.12)" : "rgba(232,130,12,0.12)";
  const curriculum  = activeLevel === "1" ? curriculumL1 : curriculumL2;
  const weekOverviews = activeLevel === "1" ? weekOverviewsL1 : weekOverviewsL2;
  const catColors   = activeLevel === "1" ? L1_CATEGORY_COLORS : L2_CATEGORY_COLORS;
  const matchFilter = activeLevel === "1" ? matchesFilterL1 : matchesFilterL2;

  const licensed     = user?.licensedLevels || [];
  const hasBasic     = licensed.includes("accounting-basic")    || licensed.includes("accounting-bundle");
  const hasAdvanced  = licensed.includes("accounting-advanced") || licensed.includes("accounting-bundle");
  const hasAny       = hasBasic || hasAdvanced;
  const hasCurrentLevel = activeLevel === "1" ? hasBasic : hasAdvanced;

  // Redirect unlicensed users
  useEffect(() => {
    if (user && !hasAny) window.location.hash = "/pricing";
  }, [user, hasAny]);

  // Reset filter when switching levels
  useEffect(() => {
    setFilter("all");
    setExpandedWeek(1);
  }, [activeLevel]);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ dayId, completed }: { dayId: string; completed: boolean }) =>
      apiRequest("POST", `/api/progress/${dayId}`, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  const levelPrefix = `L${activeLevel}-`;

  const progressMap = useMemo(
    () => new Map(progressData.map((p) => [String(p.dayNumber), p.completed])),
    [progressData]
  );

  const completedCount = useMemo(
    () => progressData.filter((p) => String(p.dayNumber).startsWith(levelPrefix) && p.completed).length,
    [progressData, levelPrefix]
  );

  const pct = Math.round((completedCount / TOTAL_DAYS) * 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowArrow(!entry.isIntersecting),
      { root: null, threshold: 0.05 }
    );
    if (lessonsRef.current) observer.observe(lessonsRef.current);
    return () => { if (lessonsRef.current) observer.unobserve(lessonsRef.current); };
  }, []);

  const scrollToLessons = () => lessonsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    let frame: number;
    let startTimestamp: number | null = null;
    const duration = 700;
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(pct * eased));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [pct]);

  const nextLesson = useMemo(
    () => curriculum.find((d) => !progressMap.get(`${levelPrefix}${d.day}`)) ?? null,
    [progressMap, curriculum, levelPrefix]
  );

  const streak = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      if (progressMap.get(`${levelPrefix}${i}`)) count++;
      else break;
    }
    return count;
  }, [progressMap, levelPrefix]);

  if (user && !hasAny) return null;

  const filterButtons = activeLevel === "1"
    ? (["all", "foundations", "bookkeeping", "reporting", "controls-ethics", "tax-compliance"] as FilterL1[])
    : (["all", "strategy", "workflows", "reporting", "controls-governance", "advisory"] as FilterL2[]);

  const filterLabel = (f: FilterType) => ({
    all: "All Days",
    foundations: "Foundations",
    bookkeeping: "Bookkeeping",
    reporting: "Reporting",
    "controls-ethics": "Controls & Ethics",
    "tax-compliance": "Tax & Compliance",
    strategy: "Strategy",
    workflows: "Workflows",
    "controls-governance": "Controls & Governance",
    advisory: "Advisory",
  }[f] || f);

  return (
    <div className="page-wrap">
      <Nav />

      {/* Inject theme color as CSS variable for global class overrides */}
      <style>{`
        :root { --color-primary: ${THEME}; }
        .resume-cta { background: ${THEME} !important; box-shadow: 0 4px 20px ${THEME}55 !important; }
        .scroll-indicator { border-color: ${THEME} !important; color: ${THEME} !important; }
        .tagline-strip { color: ${THEME} !important; }
        .next-recommended { border-color: ${THEME} !important; box-shadow: 0 0 0 1px ${THEME} !important; }
        .filter-btn.active { border-color: ${THEME} !important; color: ${THEME} !important; background: ${THEME}1a !important; }
        .complete-btn.done { color: ${THEME} !important; }
        .week-celebration { color: ${THEME} !important; border-left-color: ${THEME} !important; }
        .view-day-btn { color: ${THEME} !important; border-color: ${THEME} !important; }
        .progress-bar-fill { background: ${THEME} !important; }
      `}</style>

      <section className="hero">
        <div className="hero-badge" style={{ color: THEME, borderColor: THEME + "44", background: THEME_ALPHA }}>
          {activeLevel === "1" ? "Accounting in the AI Era · Basic" : "Accounting in the AI Era · Advanced"}
        </div>
        <h1 className="hero-title">{t("home.heroTitle")}</h1>
        <p className="hero-sub">{t("home.heroDesc")}</p>

        {/* Level switcher tabs */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "1.5rem 0", flexWrap: "wrap" }}>
          {(["1", "2"] as const).map((lvl) => {
            const color = lvl === "1" ? L1_COLOR : L2_COLOR;
            const label = lvl === "1" ? "Basic · Foundations" : "Advanced · Senior";
            const licensed = lvl === "1" ? hasBasic : hasAdvanced;
            const active = activeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => licensed ? setActiveLevel(lvl) : window.location.hash = "/pricing"}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 22px", borderRadius: "50px",
                  cursor: "pointer",
                  border: `1.5px solid ${active ? color : "var(--color-border)"}`,
                  background: active ? `${color}1a` : "transparent",
                  color: active ? color : "var(--color-text-muted)",
                  fontWeight: 700, fontSize: "0.9rem",
                  transition: "all 0.2s", opacity: licensed ? 1 : 0.6,
                }}
              >
                {!licensed && <Lock size={13} />}
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                {label}
                {!licensed && <span style={{ fontSize: "0.7rem" }}>Upgrade</span>}
              </button>
            );
          })}
        </div>

        {/* Upgrade prompt if current level not licensed */}
        {!hasCurrentLevel && (
          <div style={{ background: THEME_ALPHA, border: `1px solid ${THEME}44`, borderRadius: "12px", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "1rem" }}>
            <Lock size={16} style={{ color: THEME }} />
            <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              {activeLevel === "1" ? "Basic" : "Advanced"} track is not included in your current plan.
            </span>
            <Link href="/pricing" style={{ color: THEME, fontWeight: 700, fontSize: "0.9rem", textDecoration: "underline" }}>
              Upgrade →
            </Link>
          </div>
        )}

        {/* Progress card */}
        <div className="progress-card progress-card-animated">
          <div className="progress-header">
            <span className="progress-label">
              {activeLevel === "1" ? "Basic Track" : "Advanced Track"} Progress
            </span>
            <span className="progress-pct">{animatedPct}% complete</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${animatedPct}%`, background: THEME }} />
          </div>
          <div className="progress-counts">
            <span>{completedCount} of {TOTAL_DAYS} days complete</span>
            {completedCount === TOTAL_DAYS && (
              <span className="progress-done">🎉 Track complete!</span>
            )}
          </div>
          <div className="hero-mini-stats">
            <div className="hero-mini-stat">
              <Flame size={14} />
              <span>{streak}-day streak</span>
            </div>
            <div className="hero-mini-stat">
              <Target size={14} />
              <span>{TOTAL_DAYS - completedCount} to go</span>
            </div>
          </div>
        </div>

        <p className="tagline-strip" style={{ color: THEME }}>Master Accounting. Leverage AI. Stay Ahead.</p>
      </section>

      {/* Resume strip */}
      {nextLesson && hasCurrentLevel && (
        <section className="resume-strip">
          <div className="resume-card">
            <div className="resume-card-left">
              <div className="resume-badge">
                <PlayCircle size={16} />
                Continue your journey
              </div>
              <h2 className="resume-title">
                Next up: Day {nextLesson.day} — {nextLesson.title}
              </h2>
              <p className="resume-text">{nextLesson.summary}</p>
              <div className="resume-meta">
                <span className="resume-pill">Week {nextLesson.week}</span>
                <span className="resume-pill" style={{ background: `${catColors[nextLesson.category] || THEME}22`, color: catColors[nextLesson.category] || THEME }}>
                  {nextLesson.category}
                </span>
              </div>
            </div>
            <Link href={`/day/${levelPrefix}${nextLesson.day}`} className="resume-cta"
              style={{ background: THEME, boxShadow: `0 4px 20px ${THEME}55` }}>
              Resume Lesson <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Why section */}
      <section className="why-section">
        <div className="why-inner">
          <h2 className="why-title">{t("why.title")}</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon" style={{ background: THEME_ALPHA, color: THEME }}><Clock size={24} /></div>
              <h3>{t("why.timeTitle")}</h3><p>{t("why.timeDesc")}</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ background: "#7a5fc022", color: "#7a5fc0" }}><Brain size={24} /></div>
              <h3>{t("why.learnTitle")}</h3><p>{t("why.learnDesc")}</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ background: "#2f8c5c22", color: "#2f8c5c" }}><Trophy size={24} /></div>
              <h3>{t("why.proTitle")}</h3><p>{t("why.proDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-inner">
          <span className="filters-label"><Filter size={14} />{t("home.filterBy")}</span>
          {filterButtons.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              style={filter === f ? { borderColor: THEME, color: THEME, background: THEME_ALPHA } : {}}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </section>

      {/* Lessons */}
      <main ref={lessonsRef} className="main-content">
        {[1, 2, 3, 4].map((week) => {
          const weekDays = curriculum.filter((d) => d.week === week && matchFilter(d, filter));
          if (weekDays.length === 0) return null;
          const overview = weekOverviews[week - 1];
          const isExpanded = expandedWeek === week;
          const completedInWeek = weekDays.filter((d) => progressMap.get(`${levelPrefix}${d.day}`)).length;
          const weekIsComplete = completedInWeek === weekDays.length && weekDays.length > 0;

          return (
            <section key={week} className="week-section">
              <div className="week-header" style={{ borderColor: overview.color }}>
                <div className="week-header-left">
                  <span className="week-num" style={{ background: overview.color }}>Week {week}</span>
                  <div>
                    <div className="week-title">{overview.title}</div>
                    <div className="week-progress-text">{completedInWeek}/{weekDays.length} days complete</div>
                  </div>
                </div>
                <button className="week-expand-btn" onClick={() => setExpandedWeek(isExpanded ? null : week)}>
                  {isExpanded ? <>Week overview <ChevronUp size={14} /></> : <>Week overview <ChevronDown size={14} /></>}
                </button>
              </div>

              {weekIsComplete && (
                <div className="week-celebration">
                  <Sparkles size={16} />
                  <span>Week {week} complete — strong work. You're building real momentum.</span>
                </div>
              )}

              {isExpanded && (
                <div className="week-overview-panel">
                  <div className="week-overview-title">What you will achieve this week</div>
                  <ul className="week-outcomes">
                    {overview.outcomes.map((outcome, idx) => (
                      <li key={idx} className="week-outcome">
                        <span className="outcome-dot" style={{ background: overview.color }} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="days-grid">
                {weekDays.map((day) => {
                  const dayId = `${levelPrefix}${day.day}`;
                  const done = !!progressMap.get(dayId);
                  const isNextRecommended = nextLesson?.day === day.day;
                  const color = catColors[day.category] || THEME;

                  return (
                    <div key={dayId} className={`day-card ${done ? "done" : ""} ${day.isMiniProject ? "mini-project" : ""} ${isNextRecommended ? "next-recommended" : ""}`}
                      style={isNextRecommended ? { borderColor: THEME, boxShadow: `0 0 0 1px ${THEME}` } : {}}>
                      <div className="day-card-top">
                        <div className="day-num-row">
                          <span className="day-num">Day {day.day}</span>
                          <span className={`category-badge ${day.isMiniProject ? "large" : ""}`} style={{ background: `${color}22`, color }}>
                            {day.category}
                          </span>
                          {day.isMiniProject && <span className="mini-badge large">Mini Project</span>}
                          {isNextRecommended && !done && <span className="mini-badge">Next</span>}
                        </div>
                        <button
                          className={`complete-btn ${done ? "done" : ""}`}
                          onClick={() => hasCurrentLevel && toggleMutation.mutate({ dayId, completed: !done })}
                          disabled={!hasCurrentLevel}
                          aria-label={done ? "Mark incomplete" : "Mark complete"}
                          style={done ? { color: THEME } : {}}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                      </div>

                      <Link href={`/day/${dayId}`} className="day-title-link">
                        <h3 className="day-title">{day.title}</h3>
                      </Link>

                      <p className="day-summary">{day.summary}</p>

                      {day.tools?.length ? (
                        <div className="day-tools">
                          {day.tools.slice(0, 3).map((tool, idx) => (
                            <span key={idx} className="tool-tag">{tool}</span>
                          ))}
                          {day.tools.length > 3 && <span className="tool-tag tool-more">+{day.tools.length - 3}</span>}
                        </div>
                      ) : null}

                      <div className="day-card-footer">
                        {hasCurrentLevel ? (
                          <Link href={`/day/${dayId}`} className="view-day-btn" style={{ color: THEME, borderColor: THEME }}>
                            View Lesson <ArrowUpRight size={14} />
                          </Link>
                        ) : (
                          <Link href="/pricing" className="view-day-btn" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
                            <Lock size={13} /> Upgrade to access
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Level path */}
      <section className="level-path py-12">
        <div className="level-path-inner">
          <h2 className="level-path-title">Your Two-Track Journey</h2>
          <div className="level-cards">
            <div
              className={`level-card ${activeLevel === "1" ? "current" : "level-card-next cursor-pointer"}`}
              onClick={() => hasBasic && setActiveLevel("1")}
              style={activeLevel === "1" ? { borderColor: L1_COLOR, boxShadow: `0 0 20px ${L1_COLOR}22` } : {}}
            >
              <div className="level-card-num">Basic Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">Accounting fundamentals, bookkeeping workflows, controls, and AI-assisted reporting.</p>
              {activeLevel === "1"
                ? <span className="level-card-tag">You are here</span>
                : <div className="level-card-cta">{hasBasic ? "← Switch to Basic" : "🔒 Upgrade"}</div>
              }
            </div>
            <div
              className={`level-card ${activeLevel === "2" ? "current" : "level-card-next cursor-pointer"}`}
              onClick={() => hasAdvanced ? setActiveLevel("2") : window.location.hash = "/pricing"}
              style={activeLevel === "2" ? { borderColor: L2_COLOR, boxShadow: `0 0 20px ${L2_COLOR}22` } : {}}
            >
              <div className="level-card-num">Advanced Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">AI close design, anomaly detection, forecasting, governance, and finance transformation.</p>
              {activeLevel === "2"
                ? <span className="level-card-tag">You are here</span>
                : <div className="level-card-cta">{hasAdvanced ? "Switch to Advanced →" : "🔒 Upgrade →"}</div>
              }
            </div>
          </div>
        </div>
      </section>

      <footer className="footer footer-rich">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img src={aiSprintLogo} alt="AI Sprint logo" className="footer-logo-img" />
              <div className="footer-brand-text">
                <p className="footer-title">{t("home.footerTitle")}</p>
                <p className="footer-sub">{t("home.footerDesc")}</p>
              </div>
            </div>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <p className="footer-group-title">Support</p>
              <div className="footer-links">
                <Link href="/faq" className="footer-link">Help & FAQ</Link>
                <Link href="/pricing" className="footer-link">Pricing</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div
        className={`scroll-indicator ${showArrow ? "visible" : "hidden"}`}
        onClick={scrollToLessons}
        title="Scroll to lessons"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scrollToLessons(); } }}
        style={{ borderColor: THEME, color: THEME }}
      >
        <span>Explore Journey</span>
        <ChevronDown size={20} />
      </div>
    </div>
  );
}
