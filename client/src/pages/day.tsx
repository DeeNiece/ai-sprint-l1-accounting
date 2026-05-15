// ── AI Sprint · Accounting ───────────────────────────────────────────────────
// File: day.tsx  |  Repo: accounting
// Last updated: May 2026
//
// CERTIFICATE FEATURE:
//   - trackDayComplete() fires POST action:"complete" to AppScript on mark complete
//   - fetchCompletedDays() calls doGet to check completed days in Sheets
//   - generateCertificate() renders Canvas PNG — teal (L1 Basic) or orange (L2 Advanced)
//   - Certificate card in sidebar: locked until all 28 days of the current level complete
//   - DayCopyButton: copies social caption for Facebook/LinkedIn manual paste

import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Nav from "@/components/nav";
import {
  curriculumL1,
  curriculumL2,
  weekOverviewsL1,
  weekOverviewsL2,
} from "@/data/curriculum";
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
  X,
} from "lucide-react";
import DayChat from "@/components/day-chat";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/i18n";
import { useRegion, isToolBlocked, getAlternatives } from "@/hooks/useRegion";
import PromptLab from "@/components/PromptLab";

// ── AI Sprint · Day Tracking ──────────────────────────────────────────────────
const TRACKING_URL = "https://script.google.com/macros/s/AKfycbz9h5e7GBuM54OWLTw9QJnyOW_sSTqMqzMVY63aqxlsZVdnJVS9phi-qXeocG6veADv/exec";

async function trackDayOpen(user: any, dayNum: string | number, level: string, course: string) {
  try {
    await fetch(TRACKING_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        email:       user?.email       || "unknown",
        displayName: user?.displayName || "",
        course:      course,
        day:         String(dayNum),
        action:      "open",
        level:       level,
      }),
    });
  } catch {
    // Silent fail — never interrupts the user
  }
}

// ── Track lesson marked as complete ──────────────────────────────────────────
async function trackDayComplete(user: any, dayNum: string | number, level: string, course: string) {
  try {
    await fetch(TRACKING_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        email:       user?.email       || "unknown",
        displayName: user?.displayName || "",
        course:      course,
        day:         String(dayNum),
        action:      "complete",
        level:       level,
      }),
    });
  } catch { /* silent fail */ }
}

// ── Check completed days via AppScript doGet ──────────────────────────────────
async function fetchCompletedDays(email: string, course: string): Promise<string[]> {
  try {
    const url = `${TRACKING_URL}?email=${encodeURIComponent(email)}&course=${encodeURIComponent(course)}`;
    const res  = await fetch(url);
    const data = await res.json();
    return data.success ? (data.completedDays as string[]) : [];
  } catch {
    return [];
  }
}

// Floating Celebration Component (same as before)
function FloatingCelebration({
  message,
  subMessage,
  onComplete,
}: {
  message: string;
  subMessage?: string;
  onComplete: () => void;
}) {
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
          text-shadow: 0 1px 0 #0b636e, 0 2px 0 #0b636e, 0 3px 0 #094f58,
            0 4px 0 #094f58, 0 5px 0 #063b42, 0 6px 10px rgba(0,0,0,0.5),
            0 15px 20px rgba(13,124,138,0.5);
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .floating-3d-sub {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ccfbf1;
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
          background: radial-gradient(circle at center, rgba(13,124,138,0.2) 0%, transparent 60%);
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

// Level 1 & Level 2 colors (extend as needed)
const categoryColors: Record<string, string> = {
  Foundations: "#0d7c8a",
  Bookkeeping: "#2f6fa8",
  Reporting: "#7a5fc0",
  "Tax & Compliance": "#c07a2f",
  "Controls & Ethics": "#2f8c5c",
  Mixed: "#8c4a2f",
  // Level 2 categories (optional mappings)
  Strategy: "#e8820c",
  Workflows: "#c4620a",
  "Controls & Governance": "#a0510a",
  Advisory: "#7a3e08",
};

function getWhatYouLearned(day: {
  title: string;
  summary: string;
  task: string;
  tools: string[];
}): string[] {
  const bullets: string[] = [];
  const summaryParts = day.summary.split(". ");
  if (summaryParts[0]) bullets.push(summaryParts[0].trim().replace(/\.$/, "") + ".");
  if (summaryParts[1]) bullets.push(summaryParts[1].trim().replace(/\.$/, "") + ".");
  if (day.tools.length > 0)
    bullets.push(`Practiced using: ${day.tools.slice(0, 3).join(", ")}.`);
  return bullets.slice(0, 3);
}

// ── Copy-caption button for share panel ──────────────────────────────────────
function DayCopyButton({ caption }: { caption: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(caption).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{
        position: "absolute", top: "50%", right: "8px",
        transform: "translateY(-50%)",
        padding: "4px 10px",
        background: copied ? "rgba(13,124,138,0.2)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${copied ? "#0d7c8a" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "5px",
        color: copied ? "#0d7c8a" : "var(--text-muted)",
        fontSize: "0.72rem", fontWeight: 700,
        cursor: "pointer", whiteSpace: "nowrap",
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied! ✓" : "Copy"}
    </button>
  );
}

export default function DayPage({ params: propParams }: DayPageProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { blockedTools, countryCode } = useRegion();

  // --- Parse level and day number from URL like "/day/L1-1" or "/day/L2-5" ---
  const [match, routeParams] = useRoute("/day/:dayNum");
  const activeParams = propParams?.dayNum ? propParams : routeParams;
  const rawParam = activeParams?.dayNum ?? "1";

  let level: 1 | 2 = 1;
  let dayNum = 1;

  if (rawParam.includes("-")) {
    const parts = rawParam.split("-");
    const levelPart = parts[0].toUpperCase();
    if (levelPart === "L1") level = 1;
    else if (levelPart === "L2") level = 2;
    dayNum = parseInt(parts[1], 10);
  } else {
    dayNum = parseInt(rawParam, 10);
  }
  if (isNaN(dayNum)) dayNum = 1;

  // Select correct curriculum and week overviews based on level
  const curriculum = level === 1 ? curriculumL1 : curriculumL2;
  const weekOverviews = level === 1 ? weekOverviewsL1 : weekOverviewsL2;

  const day = curriculum.find((d) => d.day === dayNum);
  const prevDay = curriculum.find((d) => d.day === dayNum - 1);
  const nextDay = curriculum.find((d) => d.day === dayNum + 1);
  const weekOverview = day ? weekOverviews[day.week - 1] : null;

  const weekGroups = [1, 2, 3, 4].map((w) => ({
    week: w,
    days: curriculum.filter((d) => d.week === w),
    overview: weekOverviews[w - 1],
  }));

  const [quizPassed, setQuizPassed] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<{
    main: string;
    sub: string;
  } | null>(null);
  const [dismissReminder, setDismissReminder] = useState(false);

  // 🏆 CERTIFICATE STATE — declared before any early return (React hook rules)
  const [gsCompletedDays, setGsCompletedDays] = useState<string[]>([]);
  const [certGenerating, setCertGenerating] = useState(false);
  const TOTAL_DAYS_CERT = 28;
  const allDaysComplete = gsCompletedDays.length >= TOTAL_DAYS_CERT;

  // ── Track day open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (user && dayNum) {
      trackDayOpen(user, dayNum, String(level), "Accounting");
    }
  }, [dayNum, level]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuizPassed(false);
    setDismissReminder(false);
  }, [dayNum, level]);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  // Progress is currently not level-aware; you may extend later.
  const progressMap = new Map(progressData.map((p) => [p.dayNumber, p.completed]));
  const done = !!progressMap.get(dayNum);
  const completedCount = progressData.filter((p) => p.completed).length;

  // ── Fetch completed days from AppScript for certificate gate ──────────────
  useEffect(() => {
    if (user?.email) {
      const courseName = level === 1 ? "Accounting L1" : "Accounting L2";
      fetchCompletedDays(user.email, courseName).then(setGsCompletedDays);
    }
  }, [user?.email, completedCount, level]);

  const toggleMutation = useMutation({
    mutationFn: ({ completed }: { completed: boolean }) =>
      apiRequest("POST", `/api/progress/${dayNum}`, { completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });

      // 🏆 Fire complete tracking to AppScript
      if (variables.completed && user) {
        const courseName = level === 1 ? "Accounting L1" : "Accounting L2";
        trackDayComplete(user, dayNum, String(level), courseName);
      }

      if (variables.completed && (window as any).confetti) {
        const newCount = completedCount + 1;

        // Celebrations (customizable per level)
        if (level === 1 && dayNum === 28) {
          setCelebrationMsg({
            main: "BASIC COMPLETE!",
            sub: "Congratulations! You have completed the Basic track. Ready for Advanced?",
          });
          (window as any).confetti({
            particleCount: 400,
            spread: 160,
            origin: { y: 0.4 },
            colors: ["#0d7c8a", "#14b8a6", "#ffffff"],
          });
        } else if (level === 2 && dayNum === 28) {
          setCelebrationMsg({
            main: "ADVANCED MASTER!",
            sub: "You've mastered Advanced Accounting with AI. Exceptional work!",
          });
          (window as any).confetti({
            particleCount: 500,
            spread: 180,
            origin: { y: 0.4 },
            colors: ["#e8820c", "#14b8a6", "#ffffff"],
          });
        } else if (dayNum === 1 && level === 1) {
          setCelebrationMsg({
            main: "CHALLENGE UNLOCKED!",
            sub: "Welcome to Mastering Accounting in 28 Days. Let's go.",
          });
          (window as any).confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#0d7c8a", "#14b8a6", "#ffffff"],
          });
        } else if (dayNum % 7 === 0) {
          setCelebrationMsg({
            main: "WEEK COMPLETE!",
            sub: "Keep the momentum going!",
          });
          (window as any).confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#0d7c8a", "#14b8a6"],
          });
        } else if (dayNum % 7 === 3 || dayNum % 7 === 6) {
          setCelebrationMsg({
            main: "GREAT PROGRESS!",
            sub: "You're building solid habits.",
          });
          (window as any).confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#0d7c8a", "#14b8a6"],
          });
        } else {
          (window as any).confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#0d7c8a", "#14b8a6", "#ffffff"],
          });
        }

        if ([7, 14, 21, 28].includes(newCount)) {
          setShowLevelUp(true);
        }
      }
    },
  });

  // 🏆 CERTIFICATE GENERATOR ─────────────────────────────────────────────────
  // Theme adapts: teal for L1 Basic, orange for L2 Advanced
  const generateCertificate = async () => {
    setCertGenerating(true);
    const isL1     = level === 1;
    const accent   = isL1 ? "#0d7c8a" : "#e8820c";
    const accentLt = isL1 ? "#14b8a6" : "#f59e0b";
    const bgFrom   = isL1 ? "#0a1628"  : "#1a0e00";
    const bgMid    = isL1 ? "#0d1f3c"  : "#2a1800";
    const bgTo     = isL1 ? "#071220"  : "#120a00";
    const trackLbl = isL1 ? "Basic Track" : "Advanced Track";
    const filename = isL1
      ? `AISprint-Accounting-Basic-Certificate-${(user?.displayName || "Student").replace(/\s+/g, "-")}.png`
      : `AISprint-Accounting-Advanced-Certificate-${(user?.displayName || "Student").replace(/\s+/g, "-")}.png`;

    try {
      const canvas  = document.createElement("canvas");
      canvas.width  = 1400; canvas.height = 990;
      const ctx     = canvas.getContext("2d")!;

      const bgGrad = ctx.createLinearGradient(0, 0, 1400, 990);
      bgGrad.addColorStop(0, bgFrom); bgGrad.addColorStop(0.5, bgMid); bgGrad.addColorStop(1, bgTo);
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, 1400, 990);

      const g1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 350);
      g1.addColorStop(0, `${accent}33`); g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, 1400, 990);
      const g2 = ctx.createRadialGradient(1200, 800, 0, 1200, 800, 300);
      g2.addColorStop(0, `${accent}22`); g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, 1400, 990);

      ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.strokeRect(28, 28, 1344, 934);
      ctx.strokeStyle = `${accent}59`; ctx.lineWidth = 1; ctx.strokeRect(44, 44, 1312, 902);
      [[56,56,1,1],[1344,56,-1,1],[56,934,1,-1],[1344,934,-1,-1]].forEach(([cx,cy,dx,dy]: number[]) => {
        ctx.strokeStyle = accent; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy+dy*28); ctx.lineTo(cx,cy); ctx.lineTo(cx+dx*28,cy); ctx.stroke();
      });

      await new Promise<void>((resolve) => {
        const img = new Image(); img.onload = () => {
          const maxH=80,maxW=400,ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
          ctx.drawImage(img,(1400-img.naturalWidth*ratio)/2,52,img.naturalWidth*ratio,img.naturalHeight*ratio); resolve();
        }; img.onerror=()=>resolve(); img.src="/assets/AISprint.app Logo_small_certificate.jpg";
      });

      ctx.textAlign="center"; ctx.fillStyle=accent; ctx.font="bold 13px \'Georgia\', serif";
      ctx.fillText("C E R T I F I C A T E   O F   C O M P L E T I O N", 700, 165);
      ctx.strokeStyle=accent; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(480,178); ctx.lineTo(920,178); ctx.stroke();

      ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="italic 22px \'Georgia\', serif";
      ctx.fillText("This certifies that", 700, 240);

      const studentName = user?.displayName || user?.email || "Student";
      ctx.fillStyle="#ffffff"; ctx.font="bold 64px \'Georgia\', serif";
      ctx.fillText(studentName, 700, 330);
      const nw=ctx.measureText(studentName).width;
      ctx.strokeStyle=`${accent}99`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(700-nw/2,348); ctx.lineTo(700+nw/2,348); ctx.stroke();

      ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="italic 22px \'Georgia\', serif";
      ctx.fillText("has successfully completed", 700, 400);

      ctx.fillStyle=accentLt; ctx.font="bold 42px \'Georgia\', serif";
      ctx.fillText(`AI Accounting — ${trackLbl}`, 700, 468);

      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="16px \'Georgia\', serif";
      ctx.fillText("28-Day Accounting with AI Sprint · AISprint.app", 700, 506);

      ctx.strokeStyle=`${accent}4d`; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(250,548); ctx.lineTo(1150,548); ctx.stroke();

      ctx.fillStyle="rgba(255,255,255,0.65)"; ctx.font="italic 18px \'Georgia\', serif";
      const congrats = isL1
        ? "In recognition of dedication to mastering AI-powered accounting fundamentals."
        : "In recognition of mastery over advanced AI accounting workflows and professional systems.";
      ctx.fillText(congrats, 700, 592);

      const dateStr=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="12px \'Georgia\', serif";
      ctx.fillText("DATE OF COMPLETION", 380, 680);
      ctx.fillStyle="#ffffff"; ctx.font="bold 20px \'Georgia\', serif";
      ctx.fillText(dateStr, 380, 706);

      await new Promise<void>((resolve) => {
        const seal=new Image(); seal.onload=()=>{
          const b=100,r=Math.min(b/seal.naturalWidth,b/seal.naturalHeight);
          ctx.drawImage(seal,700-seal.naturalWidth*r/2,672-seal.naturalHeight*r/2,seal.naturalWidth*r,seal.naturalHeight*r); resolve();
        }; seal.onerror=()=>resolve(); seal.src="/assets/AISprint Logo Only_no Background_Certificate.png";
      });

      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="12px \'Georgia\', serif";
      ctx.fillText("ISSUED BY", 1020, 680);
      ctx.fillStyle="#ffffff"; ctx.font="bold 20px \'Georgia\', serif";
      ctx.fillText("AISprint.app", 1020, 706);
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="13px \'Georgia\', serif";
      ctx.fillText("AI Education Platform", 1020, 726);

      ctx.fillStyle=`${accent}99`; ctx.font="12px \'Georgia\', serif";
      ctx.fillText("www.aisprint.app  ·  Empowering the next generation of AI practitioners", 700, 890);

      const link=document.createElement("a");
      link.download=filename; link.href=canvas.toDataURL("image/png"); link.click();
    } finally { setCertGenerating(false); }
  };

  const scrollToCompletion = () => {
    document
      .getElementById("completion-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Error: no curriculum (should not happen)
  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="page-wrap">
        <Nav />
        <div className="not-found" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ color: "white" }}>⚠️ Curriculum data not loaded</h2>
          <Link href="/" style={{ color: "#0d7c8a", marginTop: "20px", display: "block" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!day) {
    return (
      <div className="page-wrap">
        <Nav />
        <div className="not-found" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ color: "white" }}>{t("day.notFound")}</h2>
          <p style={{ color: "#ccc", marginTop: "10px" }}>
            Day {dayNum} for Level {level} not found.
          </p>
          <Link href="/" style={{ color: "#0d7c8a", marginTop: "20px", display: "block" }}>
            {t("day.backToAll")}
          </Link>
        </div>
      </div>
    );
  }

  const catColor = categoryColors[day.category] || "#0d7c8a";
  const trackName = level === 1 ? "Basic" : "Advanced";

  return (
    <div className="page-wrap">
      <style>{`
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(13,124,138,0.6); }
          70% { box-shadow: 0 0 0 15px rgba(13,124,138,0); }
          100% { box-shadow: 0 0 0 0 rgba(13,124,138,0); }
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
                  goodExample={`I am working on Day ${day.day} of the Mastering Accounting in 28 Days — ${trackName} challenge: "${day.title}". The task is: ${day.task}. Give me a structured step-by-step framework to execute this successfully as an accountant.`}
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
                      background: "rgba(47,184,122,0.05)",
                      borderColor: "rgba(47,184,122,0.2)",
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
                    const blocked = isToolBlocked(tool, blockedTools);
                    const alts = getAlternatives(tool, countryCode);
                    return (
                      <li key={tool} className="tools-list-item" style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: 600 }}>{tool}</span>
                        {blocked && (
                          <div
                            className="tool-blocked-warning"
                            style={{
                              marginTop: "6px",
                              padding: "8px",
                              background: "rgba(239,68,68,0.1)",
                              borderLeft: "3px solid #ef4444",
                              borderRadius: "0 4px 4px 0",
                              fontSize: "0.8rem",
                              color: "var(--text)",
                              lineHeight: 1.4,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#ef4444",
                                fontWeight: "bold",
                                marginBottom: "4px",
                              }}
                            >
                              <AlertTriangle size={14} />
                              <span>Blocked in your region</span>
                            </div>
                            {alts.length > 0 ? (
                              <span
                                className="tool-alts"
                                style={{ display: "block", color: "var(--text-muted)" }}
                              >
                                Try:{" "}
                                <strong style={{ color: "var(--text)" }}>
                                  {alts.slice(0, 2).join(" or ")}
                                </strong>
                              </span>
                            ) : (
                              <span
                                className="tool-alts"
                                style={{ display: "block", color: "var(--text-muted)" }}
                              >
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
                      background: "rgba(13,124,138,0.08)",
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

              {/* 🏆 CERTIFICATE CARD — theme adapts to current level */}
              <div
                className="sidebar-card"
                style={{
                  borderTop: `4px solid ${allDaysComplete ? (level === 1 ? "#14b8a6" : "#f59e0b") : "rgba(255,255,255,0.1)"}`,
                  opacity: allDaysComplete ? 1 : 0.85,
                  transition: "all 0.3s ease",
                }}
              >
                <h3 className="sidebar-heading" style={{ color: allDaysComplete ? (level === 1 ? "#14b8a6" : "#f59e0b") : "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                  {allDaysComplete ? <Award size={16} /> : <Lock size={16} />}
                  Your Certificate
                </h3>

                {/* Sample preview */}
                <div style={{ position: "relative", marginBottom: "14px", borderRadius: "6px", overflow: "hidden", border: `1px solid ${level === 1 ? "rgba(13,124,138,0.25)" : "rgba(232,130,12,0.25)"}` }}>
                  <img
                    src="/assets/sample-certificate.png"
                    alt="Sample AISprint Accounting certificate"
                    style={{ width: "100%", display: "block", filter: allDaysComplete ? "none" : "blur(2px) brightness(0.6)", transition: "filter 0.4s ease" }}
                  />
                  {!allDaysComplete && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <Lock size={22} color={level === 1 ? "#14b8a6" : "#f59e0b"} />
                      <span style={{ fontSize: "0.75rem", color: level === 1 ? "#14b8a6" : "#f59e0b", fontWeight: 700, letterSpacing: "0.5px" }}>
                        {gsCompletedDays.length}/{TOTAL_DAYS_CERT} LESSONS COMPLETE
                      </span>
                    </div>
                  )}
                </div>

                {allDaysComplete ? (
                  <>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
                      🎉 All 28 lessons complete! Download your personalized certificate and share your achievement.
                    </p>

                    <button
                      onClick={generateCertificate}
                      disabled={certGenerating}
                      style={{ width: "100%", padding: "10px 14px", background: level === 1 ? "linear-gradient(135deg,#0d7c8a,#14b8a6)" : "linear-gradient(135deg,#e8820c,#f59e0b)", color: "white", border: "none", borderRadius: "8px", cursor: certGenerating ? "wait" : "pointer", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", letterSpacing: "0.3px", marginBottom: "14px" }}
                    >
                      <Download size={15} />
                      {certGenerating ? "Generating..." : "Download Certificate"}
                    </button>

                    {/* Share divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>SHARE YOUR WIN</span>
                      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                    </div>

                    {/* Caption + copy */}
                    <div style={{ position: "relative", marginBottom: "10px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5, fontStyle: "italic", margin: 0, padding: "8px 80px 8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {level === 1
                          ? "🎓 I just completed the Accounting Basic track on AISprint.app — 28 days of AI-powered accounting fundamentals. Ready for Advanced! #AIAccounting #AISprint"
                          : "🎓 I just completed the Accounting Advanced track on AISprint.app — 28 days of mastering AI workflows for professional accounting. #AIAccounting #AISprint"}
                      </p>
                      <DayCopyButton caption={level === 1 ? "🎓 I just completed the Accounting Basic track on AISprint.app — 28 days of AI-powered accounting fundamentals. Ready for Advanced! #AIAccounting #AISprint" : "🎓 I just completed the Accounting Advanced track on AISprint.app — 28 days of mastering AI workflows for professional accounting. #AIAccounting #AISprint"} />
                    </div>

                    {/* FB/LinkedIn notice */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "7px", background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "6px", padding: "7px 9px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>📋</span>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                        <strong style={{ color: "rgba(255,193,7,0.9)" }}>Facebook &amp; LinkedIn:</strong> Copy caption above first, then paste into the post dialog that opens.
                      </p>
                    </div>

                    {/* Social buttons */}
                    {(() => {
                      const caption = level === 1 ? "🎓 I just completed the Accounting Basic track on AISprint.app — 28 days of AI-powered accounting fundamentals. Ready for Advanced! #AIAccounting #AISprint" : "🎓 I just completed the Accounting Advanced track on AISprint.app — 28 days of mastering AI workflows for professional accounting. #AIAccounting #AISprint";
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://aisprint.app")}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"8px 10px",background:"#1877F2",color:"white",borderRadius:"6px",fontSize:"0.78rem",fontWeight:700,textDecoration:"none" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>Facebook
                          </a>
                          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aisprint.app")}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"8px 10px",background:"#0A66C2",color:"white",borderRadius:"6px",fontSize:"0.78rem",fontWeight:700,textDecoration:"none" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn
                          </a>
                          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent("https://aisprint.app")}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"8px 10px",background:"#000",color:"white",borderRadius:"6px",fontSize:"0.78rem",fontWeight:700,textDecoration:"none" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X / Twitter
                          </a>
                          <a href={`https://www.threads.net/intent/post?text=${encodeURIComponent(caption + " https://aisprint.app")}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"8px 10px",background:"#000",color:"white",borderRadius:"6px",fontSize:"0.78rem",fontWeight:700,textDecoration:"none" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7.5c-1.333-3-3.667-4.5-7-4.5-5 0-8 3.5-8 8.5 0 3.038 1.667 5.5 5 7 1 .5 2.333.5 4 0"/><path d="M12 12c2 0 3.5.667 4 2 .333 1-.167 2.5-2 3-1 .5-2 .5-3 0"/><path d="M12 12V7"/></svg>Threads
                          </a>
                        </div>
                      );
                    })()}
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "10px", lineHeight: 1.4 }}>
                      💡 Download your certificate first, then attach the image when posting.
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    Complete all 28 lessons to unlock your certificate.{" "}
                    <span style={{ color: level === 1 ? "#0d7c8a" : "#e8820c", fontWeight: 600 }}>
                      {gsCompletedDays.length}/{TOTAL_DAYS_CERT} done.
                    </span>
                  </p>
                )}
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
              <Link
                href={`/day/L${level}-${prevDay.day}`}
                className="day-nav-btn prev"
              >
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
              <Link
                href={`/day/L${level}-${nextDay.day}`}
                className="day-nav-btn next"
              >
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
          <div className="lesson-list-header">
            Accounting · {trackName} Curriculum
          </div>
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
                    href={`/day/L${level}-${d.day}`}
                    className={`lesson-list-item${isActive ? " active" : ""}${
                      isDone ? " done" : ""
                    }`}
                    style={
                      isActive
                        ? {
                            borderLeft: "3px solid #0d7c8a",
                            background: "rgba(13,124,138,0.1)",
                          }
                        : {}
                    }
                  >
                    <span className="lesson-list-num">D{d.day}</span>
                    <span style={{ flex: 1 }}>{d.title}</span>
                    {isDone && <CheckCircle2 size={12} className="lesson-list-check" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>
      </div>

      <DayChat day={day} />

      {celebrationMsg && (
        <FloatingCelebration
          message={celebrationMsg.main}
          subMessage={celebrationMsg.sub}
          onComplete={() => setCelebrationMsg(null)}
        />
      )}

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
              You've mastered a milestone. Your new status is reflected in your profile.
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
            boxShadow: "0 8px 20px rgba(13,124,138,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 600,
            zIndex: 9999,
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