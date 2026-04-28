import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Nav from "@/components/nav";
import { curriculum, weekOverviews } from "@/data/curriculum";
import type { DayProgress } from "@shared/schema";
import {
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Wrench,
  Lightbulb,
  ListTodo,
  BookOpen,
  AlertTriangle,
  BellRing,
  X 
} from "lucide-react";
import DayChat from "@/components/day-chat";
import { useLanguage } from "@/i18n";
import { useRegion, isToolBlocked, getAlternatives } from "@/hooks/useRegion";
import PromptLab from "@/components/PromptLab";

// ✨ Floating 3D Celebration Component (Tailored for Level 1 TEAL Theme)
function FloatingCelebration({ message, subMessage, onComplete }: { message: string, subMessage?: string, onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); 
    }, 5000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { transform: translate(-50%, 40px) scale(0.8); opacity: 0; }
          15% { transform: translate(-50%, -15px) scale(1.1); opacity: 1; }
          30% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
          80% { transform: translate(-50%, -10px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -40px) scale(0.9); opacity: 0; }
        }
        .floating-3d-container {
          position: fixed;
          top: 35%;
          left: 50%;
          z-index: 9999;
          pointer-events: none;
          text-align: center;
          animation: floatUp 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          width: 90vw;
        }
        .floating-3d-text {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 4rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #fff;
          /* ✨ Level 1 Teal 3D Shadow Stack */
          text-shadow: 
            0 1px 0 #0b636e,
            0 2px 0 #0b636e,
            0 3px 0 #094f58,
            0 4px 0 #094f58,
            0 5px 0 #063b42,
            0 6px 10px rgba(0,0,0,0.5),
            0 15px 20px rgba(13, 124, 138, 0.5);
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .floating-3d-sub {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ccfbf1; /* Light teal/cyan */
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.4;
        }
        .celebration-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(13, 124, 138, 0.2) 0%, transparent 60%);
          animation: fadeInOut 5s ease-in-out forwards;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .floating-3d-text { font-size: 2.5rem; }
          .floating-3d-sub { font-size: 1rem; }
        }
      `}</style>
      <div className="celebration-backdrop" />
      <div className="floating-3d-container">
        <div className="floating-3d-text">{message}</div>
        {subMessage && <div className="floating-3d-sub">{subMessage}</div>}
      </div>
    </>
  );
}

type DayPageProps = {
  params?: {
    dayNum?: string;
  };
};

// 🎨 Level 1 Primary Colors
const categoryColors: Record<string, string> = {
  Design: "#0d7c8a",
  Graphics: "#c07a2f",
  Rendering: "#2fb87a",
  Automation: "#0d7c8a",
  Coding: "#1d6fa5",
  Mixed: "#8c4a2f",
};

function getWhatYouLearned(day: {
  title: string;
  summary: string;
  task: string;
  tools: string[];
}): string[] {
  const bullets: string[] = [];
  const summaryParts = day.summary.split(". ");

  if (summaryParts[0]) {
    bullets.push(summaryParts[0].trim().replace(/\.$/, "") + ".");
  }
  if (summaryParts[1]) {
    bullets.push(summaryParts[1].trim().replace(/\.$/, "") + ".");
  }
  if (day.tools.length > 0) {
    bullets.push(`Practiced using: ${day.tools.slice(0, 3).join(", ")}.`);
  }

  return bullets.slice(0, 3);
}

const weekGroups = [1, 2, 3, 4].map((w) => ({
  week: w,
  days: curriculum.filter((d) => d.week === w),
  overview: weekOverviews[w - 1],
}));

export default function DayPage({ params: propParams }: DayPageProps) {
  const { t } = useLanguage();
  const { blockedTools, countryCode } = useRegion();

  const [match, routeParams] = useRoute("/day/:dayNum");
  const activeParams = propParams?.dayNum ? propParams : routeParams;
  const dayNum = parseInt(activeParams?.dayNum ?? "1", 10);

  const [quizPassed, setQuizPassed] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<{main: string, sub: string} | null>(null);
  
  // ✨ STATE FOR THE REMINDER
  const [dismissReminder, setDismissReminder] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuizPassed(false);
    setDismissReminder(false); 
  }, [dayNum]);

  const day = curriculum.find((d) => d.day === dayNum);
  const prevDay = curriculum.find((d) => d.day === dayNum - 1);
  const nextDay = curriculum.find((d) => d.day === dayNum + 1);
  const weekOverview = day ? weekOverviews[day.week - 1] : null;

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  const progressMap = new Map(progressData.map((p) => [p.dayNumber, p.completed]));
  const done = !!progressMap.get(dayNum);
  const completedCount = progressData.filter((p) => p.completed).length;

  const toggleMutation = useMutation({
    mutationFn: ({ completed }: { completed: boolean }) =>
      apiRequest("POST", `/api/progress/${dayNum}`, { completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });

      if (variables.completed && (window as any).confetti) {
        const newCount = completedCount + 1;

        // ✨ 5-TIER GAMIFICATION LOGIC (Level 1 Specific Copy & Teal Colors)
        if (dayNum === 28) {
          setCelebrationMsg({
            main: "LEVEL 1 COMPLETE!",
            sub: "Congratulations, you have mastered the AI Basics! You are now ready for advanced systems in Level 2."
          });
          (window as any).confetti({ particleCount: 400, spread: 160, origin: { y: 0.4 }, colors: ["#0d7c8a", "#14b8a6", "#ffffff"] });
        } 
        else if (dayNum === 1) { 
          setCelebrationMsg({
            main: "LEVEL 1 UNLOCKED!",
            sub: "Welcome to the Basic track. 15 minutes a day to build your AI foundation. Let's get started."
          });
          (window as any).confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ["#0d7c8a", "#14b8a6", "#ffffff"] });
        }
        else if (dayNum % 7 === 0) { 
          setCelebrationMsg({
            main: "WEEK COMPLETE!",
            sub: "You just finished this week's foundation lessons. Keep the momentum going!"
          });
          (window as any).confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#0d7c8a", "#14b8a6"] });
        } 
        else if (dayNum % 7 === 3 || dayNum % 7 === 6) {
          setCelebrationMsg({
            main: "GREAT PROGRESS!",
            sub: "You're building solid habits. Keep up the excellent work!"
          });
          (window as any).confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ["#0d7c8a", "#14b8a6"] });
        }
        else {
          (window as any).confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#0d7c8a", "#14b8a6", "#ffffff"] });
        }

        if ([7, 14, 21, 28].includes(newCount)) {
          setShowLevelUp(true);
        }
      }
    },
  });

  // ✨ Auto-scroll helper for the reminder button
  const scrollToCompletion = () => {
    document.getElementById("completion-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!day) {
    return (
      <div className="page-wrap">
        <Nav />
        <div className="not-found" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ color: "white" }}>{t("day.notFound")}</h2>
          <Link href="/" style={{ color: "#0d7c8a", marginTop: "20px", display: "block" }}>
            {t("day.backToAll")}
          </Link>
        </div>
      </div>
    );
  }

  const catColor = categoryColors[day.category] || "#0d7c8a";

  return (
    <div className="page-wrap">
      {/* ✨ PULSE ANIMATION FOR REMINDER */}
      <style>{`
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(13, 124, 138, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(13, 124, 138, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 124, 138, 0); }
        }
      `}</style>

      <Nav />
      <div className="day-layout">
        <div className="day-content-col">
          <div className="day-breadcrumb">
            <Link href="/" className="back-link">
              <ArrowLeft size={14} /> {t("day.allDays")}
            </Link>
            <span className="breadcrumb-sep">·</span>
            <span>{t("day.weekDay", { week: day.week, day: day.day })}</span>
          </div>

          <header className="day-header">
            {day.isMiniProject && (
              <div className="mini-badge large" style={{ background: "#0d7c8a", color: "white" }}>
                {t("day.miniProject")}
              </div>
            )}
            <div className="day-meta-row">
              <span
                className="day-week-label"
                style={{
                  background: weekOverview?.color + "22",
                  color: weekOverview?.color,
                }}
              >
                {t("day.weekTitle", {
                  week: day.week,
                  title: weekOverview?.title || "",
                })}
              </span>
              <span
                className="category-badge large"
                style={{ background: catColor + "22", color: catColor }}
              >
                {day.category}
              </span>
            </div>
            <h1 className="day-page-title">
              <span className="day-num-prefix" style={{ color: "#0d7c8a" }}>
                {t("day.dayHeader", { day: day.day })}
              </span>{" "}
              {day.title}
            </h1>
            <div className="day-time-note">
              <Clock size={14} /> {t("day.duration")}
            </div>
          </header>

          <div className="day-grid">
            <div className="day-main">
              <section className="day-section">
                <h2 className="section-heading">{t("day.lessonTitle")}</h2>
                <p className="day-body">{day.summary}</p>
              </section>

              <section className="day-section task-section">
                <h2 className="section-heading">
                  <ListTodo size={18} /> {t("day.taskTitle")}
                </h2>
                <div className="task-box" style={{ borderLeft: "4px solid #0d7c8a" }}>
                  <p className="task-text">{day.task}</p>
                </div>
              </section>

              <section className="day-section">
                <PromptLab
                  key={day.day}
                  dayTitle={day.title}
                  badExample={`I need to finish the task for Day ${day.day}. Help me.`}
                  goodExample={`I am working on Day ${day.day} of the Level 1 AI Sprint: "${day.title}". The task is: ${day.task}. Give me a structured step-by-step framework to execute this successfully.`}
                />
              </section>

              <section className="day-section">
                <h2 className="section-heading">
                  <Lightbulb size={18} style={{ color: "#0d7c8a" }} /> {t("day.whyMatters")}
                </h2>
                <div className="why-box">
                  <p className="why-text">{day.whyItMatters}</p>
                </div>
              </section>

              {done && (
                <section className="day-section what-learned-section">
                  <h2
                    className="section-heading what-learned-heading"
                    style={{ color: "#2fb87a" }}
                  >
                    <BookOpen size={18} /> What You Learned Today
                  </h2>
                  <div
                    className="what-learned-box"
                    style={{
                      background: "rgba(47, 184, 122, 0.05)",
                      borderColor: "rgba(47, 184, 122, 0.2)",
                    }}
                  >
                    <ul className="what-learned-list">
                      {getWhatYouLearned(day).map((point, i) => (
                        <li key={i} className="what-learned-item">
                          <CheckCircle2 size={14} style={{ color: "#2fb87a" }} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="what-learned-congrats">
                      <span style={{ color: "#2fb87a", fontWeight: 700 }}>
                        Day {day.day} complete.
                      </span>{" "}
                      Momentum is key — next lesson ready.
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="day-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-heading">
                  <Wrench size={15} /> {t("day.suggestedTools")}
                </h3>
                <ul className="tools-list">
  {day.tools.map((tool) => {
    // 1. Check if this specific tool is blocked based on the user's region
    const blocked = isToolBlocked(tool, blockedTools);
    
    // 2. Fetch the alternatives for this tool
    const alts = getAlternatives(tool, countryCode);

    return (
      <li key={tool} className="tools-list-item" style={{ marginBottom: "10px" }}>
        {/* Tool Name */}
        <span style={{ fontWeight: 600 }}>{tool}</span>
        
        {/* Regional Block Warning & Alternatives */}
        {blocked && (
          <div className="tool-blocked-warning" style={{ 
            marginTop: "6px", 
            padding: "8px", 
            background: "rgba(239, 68, 68, 0.1)", // Light red background
            borderLeft: "3px solid #ef4444",      // Red accent line
            borderRadius: "0 4px 4px 0",
            fontSize: "0.8rem",
            color: "var(--text)",
            lineHeight: 1.4
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ef4444", fontWeight: "bold", marginBottom: "4px" }}>
              <AlertTriangle size={14} />
              <span>Blocked in your region</span>
            </div>
            
            {alts.length > 0 ? (
              <span className="tool-alts" style={{ display: "block", color: "var(--text-muted)" }}>
                Try: <strong style={{ color: "var(--text)" }}>{alts.slice(0, 2).join(" or ")}</strong>
              </span>
            ) : (
              <span className="tool-alts" style={{ display: "block", color: "var(--text-muted)" }}>
                Please use a VPN or local equivalent.
              </span>
            )}
          </div>
        )}
      </li>
    );
  })}
</ul>
              </div>

              {/* ✨ Added an ID so the reminder button can auto-scroll here */}
              <div
                id="completion-card"
                className="sidebar-card complete-card"
                style={{ borderTop: "4px solid #0d7c8a" }}
              >
                <h3 className="sidebar-heading">{t("day.finishQuestion")}</h3>

                {!done && (
                  <div
                    style={{
                      background: "var(--bg)",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        marginBottom: "10px",
                        fontWeight: 600,
                      }}
                    >
                      🧠 Did you execute today's task?
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setQuizPassed(true)}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: quizPassed ? "#0d7c8a" : "transparent",
                          color: quizPassed ? "white" : "var(--text)",
                          border: quizPassed ? "none" : "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Yes!
                      </button>
                      <button
                        onClick={() => setQuizPassed(false)}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          opacity: quizPassed ? 0.5 : 1,
                        }}
                      >
                        Not yet
                      </button>
                    </div>
                  </div>
                )}

                <button
                  data-testid="button-complete-day"
                  disabled={!done && !quizPassed}
                  className={`complete-big-btn ${done ? "done" : ""}`}
                  style={{
                    opacity: !done && !quizPassed ? 0.5 : 1,
                    cursor: !done && !quizPassed ? "not-allowed" : "pointer",
                    ...(quizPassed && !done && {
                      borderColor: "#0d7c8a",
                      color: "#0d7c8a",
                      background: "rgba(13, 124, 138, 0.08)",
                    }),
                  }}
                  onClick={() => toggleMutation.mutate({ completed: !done })}
                >
                  {done ? (
                    <>
                      <CheckCircle2 size={20} /> {t("day.markedComplete")}
                    </>
                  ) : (
                    <>
                      <Circle size={20} />{" "}
                      {quizPassed ? t("day.markComplete") : "Pass Quiz to Unlock"}
                    </>
                  )}
                </button>
                {done && <p className="complete-note">{t("day.completionNote")}</p>}
              </div>

              {weekOverview && (
                <div className="sidebar-card">
                  <h3 className="sidebar-heading" style={{ color: weekOverview.color }}>
                    {t("day.weekGoals", { week: day.week })}
                  </h3>
                  <ul className="week-outcomes-mini">
                    {weekOverview.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          <div className="day-nav">
            {prevDay ? (
              <Link href={`/day/${prevDay.day}`} className="day-nav-btn prev">
                <ArrowLeft size={16} />
                <div>
                  <div className="day-nav-label">{t("day.previous")}</div>
                  <div className="day-nav-title">
                    D{prevDay.day}: {prevDay.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextDay ? (
              <Link href={`/day/${nextDay.day}`} className="day-nav-btn next">
                <div>
                  <div className="day-nav-label">{t("day.next")}</div>
                  <div className="day-nav-title">
                    D{nextDay.day}: {nextDay.title}
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: "#0d7c8a" }} />
              </Link>
            ) : (
              <Link href="/" className="day-nav-btn next">
                <div>
                  <div className="day-nav-label">Sprint Finish</div>
                  <div className="day-nav-title">Dashboard</div>
                </div>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <aside className="day-lesson-list-col">
          <div className="lesson-list-header">Level 1 Curriculum</div>
          {weekGroups.map(({ week, days, overview }) => (
            <div key={week}>
              <div className="lesson-list-week" style={{ color: overview?.color }}>
                Week {week} · {overview?.title}
              </div>
              {days.map((d) => {
                const isDone = !!progressMap.get(d.day);
                const isActive = d.day === dayNum;
                return (
                  <Link
                    key={d.day}
                    href={`/day/${d.day}`}
                    className={`lesson-list-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                    style={
                      isActive
                        ? {
                            borderLeft: "3px solid #0d7c8a",
                            background: "rgba(13, 124, 138, 0.1)",
                          }
                        : {}
                    }
                  >
                    <span className="lesson-list-num">D{d.day}</span>
                    <span style={{ flex: 1 }}>{d.title}</span>
                    {isDone && (
                      <CheckCircle2 size={12} className="lesson-list-check" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>
      </div>

      <DayChat day={day} />

      {/* ✨ RENDER THE 3D CELEBRATION IF STATE EXISTS */}
      {celebrationMsg && (
        <FloatingCelebration 
          message={celebrationMsg.main} 
          subMessage={celebrationMsg.sub} 
          onComplete={() => setCelebrationMsg(null)} 
        />
      )}

      {/* 🏅 Level Up Modal */}
      {showLevelUp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
              border: "2px solid #0d7c8a",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "10px" }}>🏅</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "10px", color: "#0d7c8a" }}>
              Rank Upgraded!
            </h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>
              You've mastered a milestone in Level 1. Your new status is now reflected in your
              profile.
            </p>
            <button
              onClick={() => setShowLevelUp(false)}
              style={{
                padding: "12px 24px",
                background: "#0d7c8a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {/* ✨ FLOATING REMINDER: Appears on the bottom right if they haven't finished the day */}
      {!done && !dismissReminder && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "#0d7c8a",
            color: "white",
            padding: "12px 20px",
            borderRadius: "50px",
            boxShadow: "0 8px 20px rgba(13, 124, 138, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 600,
            zIndex: 9999, /* ✨ Absolute top layer */
            animation: "subtlePulse 2.5s infinite",
            cursor: "pointer",
          }}
          onClick={scrollToCompletion}
        >
          <BellRing size={18} />
          <span>Don't forget to pass today's quiz!</span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setDismissReminder(true);
            }}
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "none",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "8px",
              cursor: "pointer",
            }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
