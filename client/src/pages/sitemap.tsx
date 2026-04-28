import { Link } from "wouter";
import Nav from "@/components/nav";

export default function SitemapPage() {
  return (
    <div className="page-wrap">
      <Nav />

      <main className="inner-page">
        <header className="inner-page-header">
          <div className="inner-page-badge">Legal & Accessibility</div>
          <h1 className="inner-page-title">Sitemap</h1>
          <p className="inner-page-sub">
            Quick links to the main pages available in AI Sprint.
          </p>
        </header>

        <section className="toolkit-category">
          <h2 className="toolkit-cat-heading">Main pages</h2>

          <div className="toolkit-grid">
            <Link href="/" className="toolkit-card">
              <div className="toolkit-name">Home</div>
              <div className="toolkit-desc">Main dashboard and learning overview.</div>
            </Link>

            <Link href="/faq" className="toolkit-card">
              <div className="toolkit-name">FAQ</div>
              <div className="toolkit-desc">Common questions and learner support.</div>
            </Link>

            <Link href="/help" className="toolkit-card">
              <div className="toolkit-name">Help</div>
              <div className="toolkit-desc">Support guidance and platform help.</div>
            </Link>

            <Link href="/pricing" className="toolkit-card">
              <div className="toolkit-name">Pricing</div>
              <div className="toolkit-desc">Pricing and access information.</div>
            </Link>

            <Link href="/toolkit" className="toolkit-card">
              <div className="toolkit-name">Toolkit</div>
              <div className="toolkit-desc">AI tools and learning resources.</div>
            </Link>

            <Link href="/portfolio" className="toolkit-card">
              <div className="toolkit-name">Portfolio</div>
              <div className="toolkit-desc">Portfolio progress and outcomes.</div>
            </Link>

            <Link href="/settings" className="toolkit-card">
              <div className="toolkit-name">Settings</div>
              <div className="toolkit-desc">Profile, theme, and experience settings.</div>
            </Link>
          </div>
        </section>

        <section className="toolkit-category">
          <h2 className="toolkit-cat-heading">Policy pages</h2>

          <div className="toolkit-grid">
            <Link href="/accessibility" className="toolkit-card">
              <div className="toolkit-name">Accessibility Statement</div>
            </Link>

            <Link href="/privacy" className="toolkit-card">
              <div className="toolkit-name">Privacy Policy</div>
            </Link>

            <Link href="/terms" className="toolkit-card">
              <div className="toolkit-name">Terms</div>
            </Link>

            <Link href="/cookie-settings" className="toolkit-card">
              <div className="toolkit-name">Cookie Settings</div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
