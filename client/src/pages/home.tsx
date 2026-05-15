// ── AI Sprint · Accounting ────────────────────────────────────────────────
// File: home.tsx  |  Repo: accounting
// Last updated: May 2026

import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Nav from "@/components/nav";
import aiSprintLogo from "@/ai-sprint-logo.png";
import {
  curriculumL1,
  curriculumL2,
  weekOverviewsL1,
  weekOverviewsL2,
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
  Lock,
} from "lucide-react";
import type { DayProgress } from "@shared/schema";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/components/auth-provider";

// ── Level theme ────────────────────────────────────────────────
const L1_COLOR = "#0d7c8a";
const L2_COLOR = "#e8820c";

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
type FilterL1 =
  | "all"
  | "foundations"
  | "bookkeeping"
  | "reporting"
  | "controls-ethics"
  | "tax-compliance";

type FilterL2 =
  | "all"
  | "strategy"
  | "workflows"
  | "reporting"
  | "controls-governance"
  | "advisory";

type FilterType = FilterL1 | FilterL2;

function matchesFilterL1(day: DayLesson, filter: FilterType) {
  if (filter === "all") return true;
  if (filter === "foundations") return day.category === "Foundations";
  if (filter === "bookkeeping") return day.category === "Bookkeeping";
  if (filter === "reporting") return day.category === "Reporting";
  if (filter === "controls-ethics") return day.category === "Controls & Ethics";
  if (filter === "tax-compliance") return day.category === "Tax & Compliance";
  return true;
}

function matchesFilterL2(day: DayLesson, filter: FilterType) {
  if (filter === "all") return true;
  if (filter === "strategy") return day.category === "Strategy";
  if (filter === "workflows") return day.category === "Workflows";
  if (filter === "reporting") return day.category === "Reporting";
  if (filter === "controls-governance") return day.category === "Controls & Governance";
  if (filter === "advisory") return day.category === "Advisory";
  return true;
}

const TOTAL_DAYS = 28;

// ── Time-of-day greeting ───────────────────────────────────────
function getGreeting(name: string): string {
  const h = new Date().getHours();
  const first = name?.split(" ")[0] || name || "there";
  if (h < 12) return `Good morning, ${first} 👋`;
  if (h < 17) return `Good afternoon, ${first} 👋`;
  return `Good evening, ${first} 👋`;
}

// ── Copy-caption button for share panel ──────────────────────────────────────
function HomeCopyButton({ text, accent }: { text: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{
        position: "absolute", top: "50%", right: "8px",
        transform: "translateY(-50%)",
        padding: "4px 10px",
        background: copied ? `${accent}33` : "rgba(255,255,255,0.07)",
        border: `1px solid ${copied ? accent : "rgba(255,255,255,0.15)"}`,
        borderRadius: "5px",
        color: copied ? accent : "var(--text-muted)",
        fontSize: "0.72rem", fontWeight: 700,
        cursor: "pointer", whiteSpace: "nowrap",
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied! ✓" : "Copy"}
    </button>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [activeLevel, setActiveLevel] = useState<"1" | "2">(() => {
    try {
      return localStorage.getItem("accounting_level") === "2" ? "2" : "1";
    } catch {
      return "1";
    }
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "accounting_level") {
        setActiveLevel(e.newValue === "2" ? "2" : "1");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const weekGridRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const weekCarouselRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [animatedPct, setAnimatedPct] = useState(0);
  const [showArrow, setShowArrow] = useState(true);
  const lessonsRef = useRef<HTMLElement>(null);
  const confettiFiredRef = useRef<Set<string>>(new Set());

  const THEME = activeLevel === "1" ? L1_COLOR : L2_COLOR;
  const THEME_ALPHA =
    activeLevel === "1" ? "rgba(13,124,138,0.12)" : "rgba(232,130,12,0.12)";
  const curriculum = activeLevel === "1" ? curriculumL1 : curriculumL2;
  const weekOverviews = activeLevel === "1" ? weekOverviewsL1 : weekOverviewsL2;
  const catColors = activeLevel === "1" ? L1_CATEGORY_COLORS : L2_CATEGORY_COLORS;
  const matchFilter = activeLevel === "1" ? matchesFilterL1 : matchesFilterL2;

  const licensed = user?.licensedLevels || [];
  const hasBasic =
    licensed.includes("accounting-basic") || licensed.includes("accounting-bundle");
  const hasAdvanced =
    licensed.includes("accounting-advanced") || licensed.includes("accounting-bundle");
  const hasAny = hasBasic || hasAdvanced;
  const hasCurrentLevel = activeLevel === "1" ? hasBasic : hasAdvanced;

  useEffect(() => {
    if (user && !hasAny) window.location.hash = "/pricing";
  }, [user, hasAny]);

  useEffect(() => {
    setFilter("all");
    setExpandedWeek(1);
  }, [activeLevel]);

  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      dayId,
      completed,
    }: {
      dayId: string;
      completed: boolean;
    }) => apiRequest("POST", `/api/progress/${dayId}`, { completed }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  const levelPrefix = `L${activeLevel}-`;

  const progressMap = useMemo(
    () => new Map(progressData.map((p) => [String(p.dayNumber), p.completed])),
    [progressData]
  );

  const completedCount = useMemo(
    () =>
      progressData.filter(
        (p) => String(p.dayNumber).startsWith(levelPrefix) && p.completed
      ).length,
    [progressData, levelPrefix]
  );

  const pct = Math.round((completedCount / TOTAL_DAYS) * 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowArrow(!entry.isIntersecting),
      { root: null, threshold: 0.05 }
    );
    if (lessonsRef.current) observer.observe(lessonsRef.current);
    return () => {
      if (lessonsRef.current) observer.unobserve(lessonsRef.current);
    };
  }, []);

  useEffect(() => {
    const weekMap: Record<number, [number, number]> = {
      1: [1, 7],
      2: [8, 14],
      3: [15, 21],
      4: [22, 28],
    };

    [1, 2, 3, 4].forEach((week) => {
      const [start, end] = weekMap[week];
      const weekDone = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      ).every((d) => progressMap.get(`${levelPrefix}${d}`));

      const key = `${activeLevel}-${week}`;
      if (weekDone && !confettiFiredRef.current.has(key)) {
        confettiFiredRef.current.add(key);
        const confetti = (window as any).confetti;
        if (typeof confetti === "function") {
          const isL1 = activeLevel === "1";
          const colors =
            week === 4
              ? [isL1 ? "#0d7c8a" : "#e8820c", "#fbbf24", "#ffffff"]
              : [isL1 ? "#0d7c8a" : "#e8820c", "#ffffff"];

          confetti({
            particleCount: week === 4 ? 180 : 80,
            spread: 70,
            origin: { y: 0.5 },
            colors,
          });
        }
      }
    });
  }, [progressMap, activeLevel, levelPrefix]);

  const scrollToLessons = () =>
    lessonsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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

  const lastVisitedDay = useMemo(() => {
    const completed = progressData
      .filter((p) => String(p.dayNumber).startsWith(levelPrefix) && p.completed)
      .map((p) => {
        const n = String(p.dayNumber).replace(levelPrefix, "");
        return Number(n);
      })
      .filter((n) => !Number.isNaN(n));

    return completed.length > 0 ? Math.max(...completed) : null;
  }, [progressData, levelPrefix]);

  // 🏆 CERTIFICATE STATE — declared before return null to satisfy React hook rules
  const TOTAL_DAYS_CERT = 28;
  const courseComplete = completedCount === TOTAL_DAYS_CERT;
  const [certGenerating,  setCertGenerating]  = useState(false);
  const [showSharePanel,  setShowSharePanel]  = useState(false);
  const isL1         = activeLevel === "1";
  const SOCIAL_CAPTION = isL1
    ? "🎓 I just completed the Accounting Basic track on AISprint.app — 28 days of AI-powered accounting fundamentals. Ready for Advanced! #AIAccounting #AISprint"
    : "🎓 I just completed the Accounting Advanced track on AISprint.app — 28 days of mastering AI workflows for professional accounting. #AIAccounting #AISprint";
  const SHARE_URL_CERT = "https://aisprint.app";

  const generateCertificate = async () => {
    setCertGenerating(true);
    const accent   = isL1 ? "#0d7c8a" : "#e8820c";
    const accentLt = isL1 ? "#14b8a6" : "#f59e0b";
    const bgFrom   = isL1 ? "#0a1628"  : "#1a0e00";
    const bgMid    = isL1 ? "#0d1f3c"  : "#2a1800";
    const bgTo     = isL1 ? "#071220"  : "#120a00";
    const trackLbl = isL1 ? "Basic Track" : "Advanced Track";
    const studentName = user?.displayName || user?.email || "Student";
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1400; canvas.height = 990;
      const ctx = canvas.getContext("2d")!;
      const bgGrad = ctx.createLinearGradient(0,0,1400,990);
      bgGrad.addColorStop(0,bgFrom); bgGrad.addColorStop(0.5,bgMid); bgGrad.addColorStop(1,bgTo);
      ctx.fillStyle=bgGrad; ctx.fillRect(0,0,1400,990);
      const g1=ctx.createRadialGradient(200,200,0,200,200,350); g1.addColorStop(0,`${accent}33`); g1.addColorStop(1,"transparent"); ctx.fillStyle=g1; ctx.fillRect(0,0,1400,990);
      const g2=ctx.createRadialGradient(1200,800,0,1200,800,300); g2.addColorStop(0,`${accent}22`); g2.addColorStop(1,"transparent"); ctx.fillStyle=g2; ctx.fillRect(0,0,1400,990);
      ctx.strokeStyle=accent; ctx.lineWidth=3; ctx.strokeRect(28,28,1344,934);
      ctx.strokeStyle=`${accent}59`; ctx.lineWidth=1; ctx.strokeRect(44,44,1312,902);
      [[56,56,1,1],[1344,56,-1,1],[56,934,1,-1],[1344,934,-1,-1]].forEach(([cx,cy,dx,dy]: number[]) => {
        ctx.strokeStyle=accent; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx,cy+dy*28); ctx.lineTo(cx,cy); ctx.lineTo(cx+dx*28,cy); ctx.stroke();
      });
      await new Promise<void>((resolve) => { const img=new Image(); img.onload=()=>{ const maxH=80,maxW=400,ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight); ctx.drawImage(img,(1400-img.naturalWidth*ratio)/2,52,img.naturalWidth*ratio,img.naturalHeight*ratio); resolve(); }; img.onerror=()=>resolve(); img.src="/assets/AISprint.app Logo_small_certificate.jpg"; });
      ctx.textAlign="center"; ctx.fillStyle=accent; ctx.font="bold 13px \'Georgia\', serif";
      ctx.fillText("C E R T I F I C A T E   O F   C O M P L E T I O N",700,165);
      ctx.strokeStyle=accent; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(480,178); ctx.lineTo(920,178); ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="italic 22px \'Georgia\', serif"; ctx.fillText("This certifies that",700,240);
      ctx.fillStyle="#ffffff"; ctx.font="bold 64px \'Georgia\', serif"; ctx.fillText(studentName,700,330);
      const nw=ctx.measureText(studentName).width; ctx.strokeStyle=`${accent}99`; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(700-nw/2,348); ctx.lineTo(700+nw/2,348); ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="italic 22px \'Georgia\', serif"; ctx.fillText("has successfully completed",700,400);
      ctx.fillStyle=accentLt; ctx.font="bold 42px \'Georgia\', serif"; ctx.fillText(`AI Accounting — ${trackLbl}`,700,468);
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="16px \'Georgia\', serif"; ctx.fillText("28-Day Accounting with AI Sprint · AISprint.app",700,506);
      ctx.strokeStyle=`${accent}4d`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(250,548); ctx.lineTo(1150,548); ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.65)"; ctx.font="italic 18px \'Georgia\', serif";
      ctx.fillText(isL1 ? "In recognition of dedication to mastering AI-powered accounting fundamentals." : "In recognition of mastery over advanced AI accounting workflows and professional systems.",700,592);
      const dateStr=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="12px \'Georgia\', serif"; ctx.fillText("DATE OF COMPLETION",380,680);
      ctx.fillStyle="#ffffff"; ctx.font="bold 20px \'Georgia\', serif"; ctx.fillText(dateStr,380,706);
      await new Promise<void>((resolve) => { const seal=new Image(); seal.onload=()=>{ const b=100,r=Math.min(b/seal.naturalWidth,b/seal.naturalHeight); ctx.drawImage(seal,700-seal.naturalWidth*r/2,672-seal.naturalHeight*r/2,seal.naturalWidth*r,seal.naturalHeight*r); resolve(); }; seal.onerror=()=>resolve(); seal.src="/assets/AISprint Logo Only_no Background_Certificate.png"; });
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="12px \'Georgia\', serif"; ctx.fillText("ISSUED BY",1020,680);
      ctx.fillStyle="#ffffff"; ctx.font="bold 20px \'Georgia\', serif"; ctx.fillText("AISprint.app",1020,706);
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="13px \'Georgia\', serif"; ctx.fillText("AI Education Platform",1020,726);
      ctx.fillStyle=`${accent}99`; ctx.font="12px \'Georgia\', serif";
      ctx.fillText("www.aisprint.app  ·  Empowering the next generation of AI practitioners",700,890);
      const link=document.createElement("a");
      link.download=`AISprint-Accounting-${trackLbl.replace(" ","-")}-Certificate-${studentName.replace(/\s+/g,"-")}.png`;
      link.href=canvas.toDataURL("image/png"); link.click();
    } finally { setCertGenerating(false); }
  };

  // ── License guard AFTER all hooks ────────────────────────────────────────
  if (user && !hasAny) return null;

  const filterButtons =
    activeLevel === "1"
      ? ([
          "all",
          "foundations",
          "bookkeeping",
          "reporting",
          "controls-ethics",
          "tax-compliance",
        ] as FilterL1[])
      : ([
          "all",
          "strategy",
          "workflows",
          "reporting",
          "controls-governance",
          "advisory",
        ] as FilterL2[]);

  const filterLabel = (f: FilterType) =>
    (
      {
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
      } as Record<string, string>
    )[f] || f;

  return (
    <div className="page-wrap">
      <style>{`
        .progress-bar-fill { background: ${THEME} !important; }
        .resume-cta {
          background: ${THEME} !important;
          box-shadow: 0 4px 20px ${THEME}80 !important;
        }
        .view-day-btn { color: ${THEME} !important; border-color: ${THEME} !important; }
        .complete-btn.done { color: ${THEME} !important; }
        .week-celebration { color: ${THEME} !important; border-left-color: ${THEME} !important; }
        .next-recommended {
          border-color: ${THEME} !important;
          box-shadow: 0 0 0 2px ${THEME}55, 0 4px 24px ${THEME}22 !important;
          background: linear-gradient(135deg, var(--color-surface), ${THEME}08) !important;
        }
        .next-recommended .day-title { color: ${THEME} !important; }
        .filter-btn.active {
          border-color: ${THEME} !important;
          color: ${THEME} !important;
          background: ${THEME}1a !important;
        }
        .scroll-indicator { border-color: ${THEME} !important; color: ${THEME} !important; }
        .tagline-strip { color: ${THEME} !important; }

        @keyframes lpPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.3); }
        }

        .week-section { overflow: visible !important; }
        .main-content { overflow: visible !important; }

        .week-carousel-wrap {
          position: relative;
          padding: 0 36px 8px;
          overflow: visible !important;
        }

        .week-carousel-inner {
          overflow: hidden;
          border-radius: 12px;
        }

        .days-grid {
          display: flex !important;
          flex-direction: row !important;
          overflow-x: auto !important;
          scroll-snap-type: x mandatory !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: none !important;
          gap: 16px !important;
          padding-bottom: 4px !important;
          scroll-behavior: smooth !important;
        }

        .days-grid::-webkit-scrollbar { display: none !important; }

        .days-grid .day-card {
          flex: 0 0 calc(33.33% - 12px) !important;
          min-width: 260px !important;
          scroll-snap-align: start !important;
        }

        .week-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(13,124,138,.12);
          border: 1px solid rgba(13,124,138,.35);
          color: var(--week-arrow-color, #0d7c8a);
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, border-color .2s, transform .2s, box-shadow .2s;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(0,0,0,.2);
          line-height: 1;
          padding: 0;
        }

        .week-arrow:hover {
          background: rgba(13,124,138,.28);
          border-color: var(--week-arrow-color, #0d7c8a);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 24px rgba(13,124,138,.25);
        }

        .week-arrow:active {
          background: rgba(13,124,138,.5);
          color: #f97316;
          border-color: #f97316;
        }

        .week-arrow-prev { left: 0; }
        .week-arrow-next { right: 0; }

        @media (max-width: 768px) {
          .week-arrow { display: none !important; }
          .week-carousel-wrap { padding: 0 0 8px; }
          .days-grid .day-card {
            flex: 0 0 85vw !important;
            min-width: 0 !important;
          }
        }

        .week-swipe-hint {
          font-size: .65rem;
          color: #555;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-align: center;
          margin-top: .4rem;
          display: none;
        }

        @media (max-width: 768px) {
          .week-swipe-hint { display: block; }
        }

        .home-greeting {
          font-size: clamp(1.1rem, 2.5vw, 1.35rem);
          font-weight: 700;
          margin-bottom: .5rem;
          opacity: .92;
        }

        .last-visited-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(255,255,255,.08);
          color: #aaa;
          margin-left: 6px;
          vertical-align: middle;
        }
      `}</style>

      <Nav />

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
        {user?.displayName && (
          <p className="home-greeting" style={{ color: THEME }}>
            {getGreeting(user.displayName)}
          </p>
        )}

        <div
          className="hero-badge"
          style={{ color: THEME, borderColor: `${THEME}44`, background: THEME_ALPHA }}
        >
          {activeLevel === "1"
            ? "Accounting in the AI Era · Basic"
            : "Accounting in the AI Era · Advanced"}
        </div>

        <h1 className="hero-title">{t("home.heroTitle")}</h1>
        <p className="hero-sub">{t("home.heroDesc")}</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            margin: "1.5rem 0",
            flexWrap: "wrap",
          }}
        >
          {(["1", "2"] as const).map((lvl) => {
            const color = lvl === "1" ? L1_COLOR : L2_COLOR;
            const label = lvl === "1" ? "Basic · Foundations" : "Advanced · Senior";
            const licensed = lvl === "1" ? hasBasic : hasAdvanced;
            const active = activeLevel === lvl;

            return (
              <button
                key={lvl}
                onClick={() => {
                  if (licensed) {
                    setActiveLevel(lvl);
                    try {
                      localStorage.setItem("accounting_level", lvl);
                    } catch {}
                  } else {
                    window.location.hash = "/pricing";
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "50px",
                  cursor: "pointer",
                  border: `1.5px solid ${active ? color : "var(--color-border)"}`,
                  background: active ? `${color}1a` : "transparent",
                  color: active ? color : "var(--color-text-muted)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  opacity: licensed ? 1 : 0.6,
                }}
              >
                {!licensed && <Lock size={13} />}
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                {label}
                {!licensed && <span style={{ fontSize: "0.7rem" }}>Upgrade</span>}
              </button>
            );
          })}
        </div>

        {!hasCurrentLevel && (
          <div
            style={{
              background: THEME_ALPHA,
              border: `1px solid ${THEME}44`,
              borderRadius: "12px",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Lock size={16} style={{ color: THEME }} />
            <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              {activeLevel === "1" ? "Basic" : "Advanced"} track is not included in
              your current plan.
            </span>
            <Link
              href="/pricing"
              style={{
                color: THEME,
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Upgrade →
            </Link>
          </div>
        )}

        <div className="progress-card progress-card-animated">
          <div className="progress-header">
            <span className="progress-label">
              {activeLevel === "1" ? "Basic Track" : "Advanced Track"} Progress
            </span>
            <span className="progress-pct">{animatedPct}% complete</span>
          </div>

          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${animatedPct}%`, background: THEME }}
            />
          </div>

          <div className="progress-counts">
            <span>
              {completedCount} of {TOTAL_DAYS} days complete
            </span>
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

        <p className="tagline-strip" style={{ color: THEME }}>
          Master Accounting. Leverage AI. Stay Ahead.
        </p>

        {/* 🏆 CERTIFICATE BANNER — only when all 28 days complete */}
        {courseComplete && (
          <div style={{ marginTop:"20px", background:`linear-gradient(135deg,${THEME}26,${THEME}1a)`, border:`1px solid ${THEME}66`, borderRadius:"14px", padding:"20px 24px", textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"6px" }}>
              <Award size={20} color={THEME} />
              <span style={{ fontSize:"1rem", fontWeight:700, color:THEME }}>
                {isL1 ? "Basic Track" : "Advanced Track"} Complete — Your Certificate is Ready!
              </span>
            </div>
            <p style={{ fontSize:"0.82rem", color:"var(--text-muted)", marginBottom:"16px", lineHeight:1.5 }}>
              You've completed all 28 lessons. Download your certificate and share your achievement.
            </p>
            <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={generateCertificate} disabled={certGenerating} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 20px", background:`linear-gradient(135deg,${THEME},${isL1?"#14b8a6":"#f59e0b"})`, color:"white", border:"none", borderRadius:"8px", fontWeight:700, fontSize:"0.88rem", cursor:certGenerating?"wait":"pointer" }}>
                <Download size={15} />{certGenerating?"Generating...":"Download Certificate"}
              </button>
              <button onClick={() => setShowSharePanel(!showSharePanel)} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 20px", background:showSharePanel?`${THEME}33`:"transparent", color:THEME, border:`1px solid ${THEME}80`, borderRadius:"8px", fontWeight:700, fontSize:"0.88rem", cursor:"pointer" }}>
                <Share2 size={15} />Share Your Win
              </button>
            </div>

            {showSharePanel && (
              <div style={{ marginTop:"16px", padding:"16px", background:"rgba(0,0,0,0.2)", borderRadius:"10px", border:`1px solid ${THEME}33` }}>
                <div style={{ position:"relative", marginBottom:"14px" }}>
                  <p style={{ fontSize:"0.78rem", color:"var(--text-muted)", fontStyle:"italic", lineHeight:1.6, margin:0, padding:"10px 90px 10px 12px", background:"rgba(255,255,255,0.04)", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.08)" }}>
                    "{SOCIAL_CAPTION}"
                  </p>
                  <HomeCopyButton text={SOCIAL_CAPTION} accent={THEME} />
                </div>

                <div style={{ display:"flex", alignItems:"flex-start", gap:"8px", background:"rgba(255,193,7,0.08)", border:"1px solid rgba(255,193,7,0.25)", borderRadius:"7px", padding:"8px 10px", marginBottom:"10px" }}>
                  <span style={{ fontSize:"0.9rem", flexShrink:0, marginTop:"1px" }}>📋</span>
                  <p style={{ fontSize:"0.74rem", color:"var(--text-muted)", margin:0, lineHeight:1.5 }}>
                    <strong style={{ color:"rgba(255,193,7,0.9)" }}>Facebook &amp; LinkedIn:</strong> Copy your caption above first, then click the button — paste it into the post dialog that opens.
                  </p>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", maxWidth:"380px", margin:"0 auto" }}>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL_CERT)}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"9px 12px",background:"#1877F2",color:"white",borderRadius:"7px",fontSize:"0.8rem",fontWeight:700,textDecoration:"none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>Facebook
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL_CERT)}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"9px 12px",background:"#0A66C2",color:"white",borderRadius:"7px",fontSize:"0.8rem",fontWeight:700,textDecoration:"none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SOCIAL_CAPTION)}&url=${encodeURIComponent(SHARE_URL_CERT)}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"9px 12px",background:"#000",color:"white",borderRadius:"7px",fontSize:"0.8rem",fontWeight:700,textDecoration:"none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X / Twitter
                  </a>
                  <a href={`https://www.threads.net/intent/post?text=${encodeURIComponent(SOCIAL_CAPTION + " " + SHARE_URL_CERT)}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"9px 12px",background:"#000",color:"white",borderRadius:"7px",fontSize:"0.8rem",fontWeight:700,textDecoration:"none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7.5c-1.333-3-3.667-4.5-7-4.5-5 0-8 3.5-8 8.5 0 3.038 1.667 5.5 5 7 1 .5 2.333.5 4 0"/><path d="M12 12c2 0 3.5.667 4 2 .333 1-.167 2.5-2 3-1 .5-2 .5-3 0"/><path d="M12 12V7"/></svg>Threads
                  </a>
                </div>
                <p style={{ fontSize:"0.72rem", color:"var(--text-muted)", marginTop:"10px", lineHeight:1.4 }}>
                  💡 Download your certificate first, then attach the image when posting for better engagement.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

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
                <span
                  className="resume-pill"
                  style={{
                    background: `${catColors[nextLesson.category] || THEME}22`,
                    color: catColors[nextLesson.category] || THEME,
                  }}
                >
                  {nextLesson.category}
                </span>
                {nextLesson.tools?.[0] && (
                  <span className="resume-pill subtle">{nextLesson.tools[0]}</span>
                )}
              </div>
            </div>

            <Link
              href={`/day/${levelPrefix}${nextLesson.day}`}
              className="resume-cta"
              style={{ background: THEME, boxShadow: `0 4px 20px ${THEME}55` }}
            >
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
              <div className="why-icon" style={{ background: THEME_ALPHA, color: THEME }}>
                <Clock size={24} />
              </div>
              <h3>{t("why.timeTitle")}</h3>
              <p>{t("why.timeDesc")}</p>
            </div>

            <div className="why-card">
              <div
                className="why-icon"
                style={{ background: "#7a5fc022", color: "#7a5fc0" }}
              >
                <Brain size={24} />
              </div>
              <h3>{t("why.learnTitle")}</h3>
              <p>{t("why.learnDesc")}</p>
            </div>

            <div className="why-card">
              <div
                className="why-icon"
                style={{ background: "#2f8c5c22", color: "#2f8c5c" }}
              >
                <Trophy size={24} />
              </div>
              <h3>{t("why.proTitle")}</h3>
              <p>{t("why.proDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="filters-section">
        <div className="filters-inner">
          <span className="filters-label">
            <Filter size={14} />
            {t("home.filterBy")}
          </span>

          {filterButtons.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              style={
                filter === f
                  ? { borderColor: THEME, color: THEME, background: THEME_ALPHA }
                  : {}
              }
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </section>

      <main ref={lessonsRef} className="main-content">
        {[1, 2, 3, 4].map((week) => {
          const weekDays = curriculum.filter(
            (d) => d.week === week && matchFilter(d, filter)
          );
          if (weekDays.length === 0) return null;

          const overview = weekOverviews[week - 1];
          const isExpanded = expandedWeek === week;
          const completedInWeek = weekDays.filter((d) =>
            progressMap.get(`${levelPrefix}${d.day}`)
          ).length;
          const weekIsComplete =
            completedInWeek === weekDays.length && weekDays.length > 0;

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
                    <>
                      Week overview <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Week overview <ChevronDown size={14} />
                    </>
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
                  <div className="week-overview-title">
                    What you will achieve this week
                  </div>
                  <ul className="week-outcomes">
                    {overview.outcomes.map((outcome, idx) => (
                      <li key={idx} className="week-outcome">
                        <span
                          className="outcome-dot"
                          style={{ background: overview.color }}
                        />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="week-carousel-wrap"
                ref={(el) => {
                  weekCarouselRefs.current[week] = el;
                }}
              >
                <button
                  className="week-arrow week-arrow-prev"
                  aria-label="Previous"
                  onClick={() => {
                    const g = weekGridRefs.current[week];
                    if (g) g.scrollBy({ left: -g.clientWidth * 0.85, behavior: "smooth" });
                  }}
                >
                  &#8592;
                </button>

                <div className="week-carousel-inner">
                  <div
                    className="days-grid"
                    ref={(el) => {
                      weekGridRefs.current[week] = el;
                    }}
                  >
                    {weekDays.map((day) => {
                      const dayId = `${levelPrefix}${day.day}`;
                      const done = !!progressMap.get(dayId);
                      const isNextRecommended = nextLesson?.day === day.day;
                      const color = catColors[day.category] || THEME;

                      return (
                        <div
                          key={dayId}
                          className={`day-card ${done ? "done" : ""} ${
                            day.isMiniProject ? "mini-project" : ""
                          } ${isNextRecommended ? "next-recommended" : ""}`}
                        >
                          <div className="day-card-top">
                            <div className="day-num-row">
                              <span className="day-num">Day {day.day}</span>

                              <span
                                className={`category-badge ${
                                  day.isMiniProject ? "large" : ""
                                }`}
                                style={{ background: `${color}22`, color }}
                              >
                                {day.category}
                              </span>

                              {day.isMiniProject && (
                                <span className="mini-badge large">Mini Project</span>
                              )}

                              {isNextRecommended && !done && (
                                <span className="mini-badge">Next</span>
                              )}

                              {lastVisitedDay === day.day && done && (
                                <span className="last-visited-tag">Last visited</span>
                              )}
                            </div>

                            <button
                              className={`complete-btn ${done ? "done" : ""}`}
                              onClick={() =>
                                hasCurrentLevel &&
                                toggleMutation.mutate({ dayId, completed: !done })
                              }
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
                                <span key={`${dayId}-tool-${idx}`} className="tool-tag">
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
                            {hasCurrentLevel ? (
                              <Link
                                href={`/day/${dayId}`}
                                className="view-day-btn"
                                style={{ color: THEME, borderColor: THEME }}
                              >
                                View Lesson <ArrowUpRight size={14} />
                              </Link>
                            ) : (
                              <Link
                                href="/pricing"
                                className="view-day-btn"
                                style={{
                                  color: "var(--color-text-muted)",
                                  borderColor: "var(--color-border)",
                                }}
                              >
                                <Lock size={13} /> Upgrade to access
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  className="week-arrow week-arrow-next"
                  aria-label="Next"
                  onClick={() => {
                    const g = weekGridRefs.current[week];
                    if (g) g.scrollBy({ left: g.clientWidth * 0.85, behavior: "smooth" });
                  }}
                >
                  &#8594;
                </button>
              </div>

              <p className="week-swipe-hint">&#8592; swipe to explore &#8594;</p>
            </section>
          );
        })}
      </main>

      <section className="level-path py-12">
        <div className="level-path-inner">
          <h2 className="level-path-title">Your Two-Track Journey</h2>
          <div className="level-cards">
            <div
              className={`level-card ${
                activeLevel === "1" ? "current" : "level-card-next"
              }`}
              onClick={() => {
                if (hasBasic) {
                  setActiveLevel("1");
                  try {
                    localStorage.setItem("accounting_level", "1");
                  } catch {}
                }
              }}
              style={
                activeLevel === "1"
                  ? { borderColor: L1_COLOR, boxShadow: `0 0 20px ${L1_COLOR}22` }
                  : undefined
              }
            >
              <div className="level-card-num">Basic Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">
                Accounting fundamentals, bookkeeping workflows, controls, and
                AI-assisted reporting.
              </p>
              {activeLevel === "1" ? (
                <span className="level-card-tag">You are here</span>
              ) : (
                <div className="level-card-cta">
                  {hasBasic ? "← Switch to Basic" : "🔒 Upgrade"}
                </div>
              )}
            </div>

            <div
              className={`level-card ${
                activeLevel === "2" ? "current" : "level-card-next"
              }`}
              onClick={() => {
                if (hasAdvanced) {
                  setActiveLevel("2");
                  try {
                    localStorage.setItem("accounting_level", "2");
                  } catch {}
                } else {
                  window.location.hash = "/pricing";
                }
              }}
              style={
                activeLevel === "2"
                  ? { borderColor: L2_COLOR, boxShadow: `0 0 20px ${L2_COLOR}22` }
                  : undefined
              }
            >
              <div className="level-card-num">Advanced Track</div>
              <h3 className="level-card-name">28 Days</h3>
              <p className="level-card-desc">
                AI close design, anomaly detection, forecasting, governance, and
                finance transformation.
              </p>
              {activeLevel === "2" ? (
                <span className="level-card-tag">You are here</span>
              ) : (
                <div className="level-card-cta">
                  {hasAdvanced ? "Switch to Advanced →" : "🔒 Upgrade →"}
                </div>
              )}
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
                <Link href="/faq" className="footer-link">
                  Help & FAQ
                </Link>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="footer-column">
              <p className="footer-group-title">Legal</p>
              <div className="footer-links">
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="footer-link">
                  Cookie Settings
                </Link>
                <Link href="/accessibility" className="footer-link">
                  Accessibility
                </Link>
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToLessons();
          }
        }}
        style={{ borderColor: THEME, color: THEME }}
      >
        <span>Explore Journey</span>
        <ChevronDown size={20} />
      </div>
    </div>
  );
}