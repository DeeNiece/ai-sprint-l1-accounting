import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Nav from "@/components/nav";
import aiSprintLogo from "@/ai-sprint-logo.png";
import {
  curriculum,
  weekOverviews,
  type Category,
  type DayLesson,
} from "@/data/curriculum";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  Trophy,
  Brain,
  ArrowUpRight,
  Flame,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import type { DayProgress } from "@shared/schema";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/components/auth-provider";

// ── Accounting-specific filter types ─────────────────────────────────────────
type FilterType = "all" | "foundations" | "bookkeeping" | "reporting" | "controls-ethics" | "tax-compliance";

const TOTAL_DAYS = 28;

const categoryColors: Record<Category, string> = {
  Foundations:        "#0d7c8a",
  Bookkeeping:        "#2f6fa8",
  Reporting:          "#7a5fc0",
  "Tax & Compliance": "#c07a2f",
  "Controls & Ethics":"#2f8c5c",
  Mixed:              "#8c4a2f",
};

const categoryLabels: Record<Category, string> = {
  Foundations:        "Foundations",
  Bookkeeping:        "Bookkeeping",
  Reporting:          "Reporting",
  "Tax & Compliance": "Tax & Compliance",
  "Controls & Ethics":"Controls & Ethics",
  Mixed:              "Mixed",
};

function matchesFilter(day: DayLesson, filter: FilterType) {
  if (filter === "all") return true;
  if (filter === "foundations") return day.category === "Foundations";
  if (filter === "bookkeeping") return day.category === "Bookkeeping";
  if (filter === "reporting") return day.category === "Reporting";
  if (filter === "controls-ethics") return day.category === "Controls & Ethics";
  if (filter === "tax-compliance") return day.category === "Tax & Compliance";
  return true;
}

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [animatedPct, setAnimatedPct] = useState(0);

  // LICENSE GUARD: If the user does not own accounting-basic, send them to /pricing.
  useEffect(() => {
    if (user && !user.licensedLevels?.includes("accounting-basic") && !user.licensedLevels?.includes("accounting-bundle")) {
      window.location.hash = "/pricing";
    }
  }, [user]);

  const [showArrow, setShowArrow] = useState(true);
  const lessonsRef = useRef<HTMLElement>(null);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ day, completed }: { day: number; completed: boolean }) =>
      apiRequest("POST", `/api/progress/${day}`, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const progressMap = useMemo(
    () => new Map(progressData.map((p) => [p.dayNumber, p.completed])),
    [progressData]
  );

  const completedCount = useMemo(
    () => progressData.filter((p) => p.completed).length,
    [progressData]
  );

  const pct = Math.round((completedCount / TOTAL_DAYS) * 100);
  const weeks = [1, 2, 3, 4];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowArrow(false);
        } else {
          setShowArrow(true);
        }
      },
      { root: null, threshold: 0.05 }
    );
    if (lessonsRef.current) observer.observe(lessonsRef.current);
    return () => { if (lessonsRef.current) observer.unobserve(lessonsRef.current); };
  }, []);

  const scrollToLessons = () => {
    if (lessonsRef.current) {
      lessonsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const nextLesson = useMemo(() => {
    return curriculum.find((day) => !progressMap.get(day.day)) ?? null;
  }, [progressMap]);

  const streak = useMemo(() => {
    const completedDays = [...progressData]
      .filter((p) => p.completed)
      .map((p) => p.dayNumber)
      .sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i < completedDays.length; i++) {
      if (completedDays[i] === i + 1) count += 1;
      else break;
    }
    return count;
  }, [progressData]);

  const handleTrackJump = (url: string, trackName: string) => {
    const message =
      pct < 100
        ? `You've completed ${pct}% of the Basic track. Finishing Basic first makes ${trackName} much easier!\n\nIf you see a blank screen, you may need to purchase that track first.\n\nGo to ${trackName}?`
        : `Ready for ${trackName}? Let's go!`;
    if (window.confirm(message)) window.location.href = url;
  };

  // Render nothing while the license redirect is in progress
  if (user && !user.licensedLevels?.includes("accounting-basic") && !user.licensedLevels?.includes("accounting-bundle")) {
    return null;
  }

  return (
    <div className="page-wrap">
      <Nav />

      <section className="hero">
        <div className="hero-badge">{t("home.heroTag")}</div>
        <h1 className="hero-title">{t("home.heroTitle")}</h1>
        <p className="hero-sub">{t("home.heroDesc")}</p>

        <div className="progress-card progress-card-animated">
          <div className="progress-header">
            <span className="progress-label">{t("home.overallProgress")}</span>
            <span className="progress-pct">{t("home.pctComplete", { pct: animatedPct })}</span>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${animatedPct}%` }} />
          </div>

          <div className="progress-counts">
            <span>{t("home.daysComplete", { completed: completedCount })}</span>
            {completedCount === TOTAL_DAYS && (
              <span className="progress-done">{t("home.levelComplete")}</span>
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

        <p className="tagline-strip">Master Accounting. Leverage AI. Stay Ahead.</p>
      </section>

      {nextLesson && (
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
                <span
                  className="resume-pill"
                  style={{
                    background: `${categoryColors[nextLesson.category]}22`,
                    color: categoryColors[nextLesson.category],
                  }}
                >
                  {categoryLabels[nextLesson.category]}
                </span>
                {nextLesson.tools?.[0] && (
                  <span className="resume-pill subtle">{nextLesson.tools[0]}</span>
                )}
              </div>
            </div>

            <Link href={`/day/${nextLesson.day}`} className="resume-cta">
              Resume Lesson <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      )}

      <section className="why-section">
        <div className="why-inner">
          <h2 className="why-title">{t("why.title")}</h2>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon" style={{ background: "#0d7c8a22", color: "#0d7c8a" }}>
                <Clock size={24} />
              </div>
              <h3>{t("why.timeTitle")}</h3>
              <p>{t("why.timeDesc")}</p>
            </div>

            <div className="why-card">
              <div className="why-icon" style={{ background: "#7a5fc022", color: "#7a5fc0" }}>
                <Brain size={24} />
              </div>
              <h3>{t("why.learnTitle")}</h3>
              <p>{t("why.learnDesc")}</p>
            </div>

            <div className="why-card">
              <div className="why-icon" style={{ background: "#2f8c5c22", color: "#2f8c5c" }}>
                <Trophy size={24} />
              </div>
              <h3>{t("why.proTitle")}</h3>
              <p>{t("why.proDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accounting-specific filters ───────────────────────────────────── */}
      <section className="filters-section">
        <div className="filters-inner">
          <span className="filters-label">
            <Filter size={14} />
            {t("home.filterBy")}
          </span>

          {(["all", "foundations", "bookkeeping", "reporting", "controls-ethics", "tax-compliance"] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all"              ? "All Days"
                : f === "foundations"    ? "Foundations"
                : f === "bookkeeping"    ? "Bookkeeping"
                : f === "reporting"      ? "Reporting"
                : f === "controls-ethics"? "Controls & Ethics"
                : "Tax & Compliance"}
              </button>
            )
          )}
        </div>
      </section>

      <main ref={lessonsRef} className="main-content">
        {weeks.map((week) => {
          const weekDays = curriculum.filter(
            (day) => day.week === week && matchesFilter(day, filter)
          );

          if (weekDays.length === 0) return null;

          const overview = weekOverviews[week - 1];
          const isExpanded = expandedWeek === week;
          const completedInWeek = weekDays.filter((day) => progressMap.get(day.day)).length;
          const weekIsComplete = completedInWeek === weekDays.length && weekDays.length > 0;

          return (
            <section key={week} className="week-section">
              <div className="week-header" style={{ borderColor: overview.color }}>
                <div className="week-header-left">
                  <span className="week-num" style={{ background: overview.color }}>
                    Week {week}
                  </span>

                  <div>
                    <div className="week-title">{overview.title}</div>
                    <div className="week-progress-text">
                      {completedInWeek}/{weekDays.length} days complete
                    </div>
                  </div>
                </div>

                <button
                  className="week-expand-btn"
                  onClick={() => setExpandedWeek(isExpanded ? null : week)}
                >
                  {isExpanded ? (
                    <>Week overview <ChevronUp size={14} /></>
                  ) : (
                    <>Week overview <ChevronDown size={14} /></>
                  )}
                </button>
              </div>

              {weekIsComplete && (
                <div className="week-celebration">
                  <Sparkles size={16} />
                  <span>
                    Week {week} complete — strong work. You're building real momentum.
                  </span>
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
                  const done = !!progressMap.get(day.day);
                  const isNextRecommended = nextLesson?.day === day.day;

                  return (
                    <div
                      key={day.day}
                      className={`day-card ${done ? "done" : ""} ${
                        day.isMiniProject ? "mini-project" : ""
                      } ${isNextRecommended ? "next-recommended" : ""}`}
                    >
                      <div className="day-card-top">
                        <div className="day-num-row">
                          <span className="day-num">Day {day.day}</span>

                          <span
                            className={`category-badge ${day.isMiniProject ? "large" : ""}`}
                            style={{
                              background: `${categoryColors[day.category]}22`,
                              color: categoryColors[day.category],
                            }}
                          >
                            {categoryLabels[day.category]}
                          </span>

                          {day.isMiniProject && (
                            <span className="mini-badge large">Mini Project</span>
                          )}

                          {isNextRecommended && !done && (
                            <span className="mini-badge">Next</span>
                          )}
                        </div>

                        <button
                          className={`complete-btn ${done ? "done" : ""}`}
                          onClick={() =>
                            toggleMutation.mutate({ day: day.day, completed: !done })
                          }
                          aria-label={done ? "Mark incomplete" : "Mark complete"}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                      </div>

                      <Link href={`/day/${day.day}`} className="day-title-link">
                        <h3 className="day-title">{day.title}</h3>
                      </Link>

                      <p className="day-summary">{day.summary}</p>

                      {day.tools?.length ? (
                        <div className="day-tools">
                          {day.tools.slice(0, 3).map((tool, idx) => (
                            <span key={`${day.day}-tool-${idx}`} className="tool-tag">
                              {tool}
                            </span>
                          ))}
                          {day.tools.length > 3 && (
                            <span className="tool-tag tool-more">
                              +{day.tools.length - 3}
                            </span>
                          )}
                        </div>
                      ) : null}

                      <div className="day-card-footer">
                        <Link href={`/day/${day.day}`} className="view-day-btn">
                          View Lessons <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── Two-Track Journey ─────────────────────────────────────────────── */}
      <section className="level-path py-12">
        <div className="level-path-inner">
          <h2 className="level-path-title">Your Two-Track Journey</h2>

          <div className="level-cards">
            <div className="level-card current">
              <div className="level-card-num">Basic Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">
                Accounting fundamentals, bookkeeping workflows, controls, and AI-assisted reporting.
              </p>
              <span className="level-card-tag">You are here</span>
            </div>

            <div
              className="level-card level-card-next"
              onClick={() =>
                handleTrackJump("https://ai-sprint-l2-accounting-production.up.railway.app", "Advanced Track")
              }
            >
              <div className="level-card-num">Advanced Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">
                AI-assisted close design, anomaly detection, forecasting, governance, and finance transformation.
              </p>
              <div className="level-card-cta">Explore Advanced →</div>
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

            <div className="footer-column">
              <p className="footer-group-title">Legal & Accessibility</p>
              <div className="footer-links">
                <Link href="/accessibility" className="footer-link">Accessibility Statement</Link>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/sitemap" className="footer-link">Sitemap</Link>
                <Link href="/terms" className="footer-link">Terms</Link>
                <Link href="/cookie-settings" className="footer-link">Cookie Settings</Link>
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToLessons();
          }
        }}
      >
        <span>Explore Journey</span>
        <ChevronDown size={20} />
      </div>

    </div>
  );
}
