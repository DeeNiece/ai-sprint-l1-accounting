import Nav from "@/components/nav";

export default function CookieSettingsPage() {
  return (
    <div className="page-wrap">
      <Nav />

      <main className="inner-page">
        <header className="inner-page-header">
          <div className="inner-page-badge">Legal & Accessibility</div>
          <h1 className="inner-page-title">Cookie Settings</h1>
          <p className="inner-page-sub">
            This page explains how cookie-related preferences may be handled on AI Sprint.
          </p>
        </header>

        <section className="day-section">
          <h2 className="section-heading">Essential usage</h2>
          <div className="why-box">
            <p className="why-text">
              Some site functionality may depend on essential browser or session behavior
              needed for login, navigation, preferences, and secure platform access.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Preference controls</h2>
          <div className="why-box">
            <p className="why-text">
              If additional cookie or preference controls are added later, this page can
              be expanded into a full settings panel for analytics, personalization,
              and related choices.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Current status</h2>
          <div className="why-box">
            <p className="why-text">
              At the moment, this page acts as the placeholder location for cookie-related
              disclosures and future preference controls.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
