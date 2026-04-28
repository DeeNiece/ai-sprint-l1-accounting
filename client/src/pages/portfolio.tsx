import Nav from "@/components/nav";
import { portfolioTargets, weekOverviews } from "@/data/curriculum";
import { useQuery } from "@tanstack/react-query";
import type { DayProgress } from "@shared/schema";
import { CheckCircle2, Target } from "lucide-react";
import { useLanguage } from "@/i18n";

const weekColors = ["#4f98a3", "#7a5fc0", "#c07a2f", "#2f8c5c"];

export default function PortfolioPage() {
  const { t } = useLanguage();
  const { data: progressData = [] } = useQuery<DayProgress[]>({
    queryKey: ["/api/progress"],
  });
  const completedCount = progressData.filter((p) => p.completed).length;
  const pct = Math.round((completedCount / 28) * 100);

  return (
    <div className="page-wrap">
      <Nav />
      <main className="inner-page">
        <div className="inner-page-header">
          <div className="inner-page-badge">{t("portfolio.title")}</div>
          <h1 className="inner-page-title">{t("portfolio.subtitle")}</h1>
          <p className="inner-page-sub">
            {t("portfolio.desc")}
          </p>
        </div>

        {/* Progress reminder */}
        <div className="portfolio-progress-bar">
          <div className="progress-header">
            <span>{t("portfolio.progress")}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Targets by week */}
        {[1, 2, 3, 4].map((week) => {
          const weekTargets = portfolioTargets.filter((t) => t.week === week);
          const color = weekColors[week - 1];
          const overview = weekOverviews[week - 1];
          return (
            <div key={week} className="portfolio-week">
              <div className="portfolio-week-header">
                <span className="week-num" style={{ background: color }}>{t("portfolio.weekLabel", { week })}</span>
                <span className="portfolio-week-title">{overview.title}</span>
              </div>
              <div className="portfolio-targets-grid">
                {weekTargets.map((target, i) => (
                  <div key={i} className="portfolio-target-card" data-testid={`card-portfolio-${i}`}>
                    <div className="portfolio-target-icon" style={{ color }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <div className="portfolio-target-title">{target.title}</div>
                      <div className="portfolio-target-desc">{target.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="portfolio-cta">
          <div className="portfolio-cta-icon"><CheckCircle2 size={28} /></div>
          <div className="portfolio-cta-title">{t("portfolio.earnedTitle")}</div>
          <p className="portfolio-cta-text">
            {t("portfolio.earnedDesc")}
          </p>
        </div>

        {/* What comes next */}
        <div className="next-level-box">
          <div className="next-level-label">{t("portfolio.nextLevel")}</div>
          <p>{t("portfolio.nextLevelDesc")}</p>
        </div>
      </main>
    </div>
  );
}
