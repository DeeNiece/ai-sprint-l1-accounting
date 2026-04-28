import Nav from "@/components/nav";
import { starterToolkit } from "@/data/curriculum";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n";

const categories = Array.from(new Set(starterToolkit.map((tool) => tool.category)));

const catColors: Record<string, string> = {
  "AI Writing": "#4f98a3",
  "Design & Graphics": "#7a5fc0",
  "AI Images": "#c07a2f",
  "Automation": "#1d6fa5",
  "Productivity": "#2f8c5c",
  "Social Media": "#8c4a2f",
  "Image Editing": "#7a4f9a",
  "Coding": "#1d6fa5",
  "Design": "#c07a2f",
};

export default function ToolkitPage() {
  const { t } = useLanguage();
  return (
    <div className="page-wrap">
      <Nav />
      <main className="inner-page">
        <div className="inner-page-header">
          <div className="inner-page-badge">{t("toolkit.title")}</div>
          <h1 className="inner-page-title">{t("toolkit.subtitle")}</h1>
          <p className="inner-page-sub">
            {t("toolkit.desc")}
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="toolkit-category">
            <h2 className="toolkit-cat-heading" style={{ color: catColors[cat] || "#4f98a3" }}>{cat}</h2>
            <div className="toolkit-grid">
              {starterToolkit.filter((tool) => tool.category === cat).map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toolkit-card"
                  data-testid={`card-tool-${tool.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="toolkit-card-top">
                    <span className="toolkit-name">{tool.name}</span>
                    <ExternalLink size={14} className="toolkit-ext" />
                  </div>
                  <p className="toolkit-desc">{tool.desc}</p>
                  <span className="toolkit-cat-badge" style={{ background: (catColors[cat] || "#4f98a3") + "22", color: catColors[cat] || "#4f98a3" }}>
                    {tool.category}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="toolkit-note">
          {t("toolkit.tip")}
        </div>
      </main>
    </div>
  );
}
