import Nav from "@/components/nav";

export default function PrivacyPage() {
  return (
    <div className="page-wrap">
      <Nav />

      <main className="inner-page">
        <header className="inner-page-header">
          <div className="inner-page-badge">Legal & Accessibility</div>
          <h1 className="inner-page-title">Privacy Policy</h1>
          <p className="inner-page-sub">
            This page explains the general types of information AI Sprint may use
            to operate the learning platform.
          </p>
        </header>

        <section className="day-section">
          <h2 className="section-heading">Information we use</h2>
          <div className="why-box">
            <p className="why-text">
              AI Sprint may use account details, learning progress, settings,
              language preferences, and platform interaction data to deliver
              lessons and improve the user experience.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Why we use it</h2>
          <div className="why-box">
            <p className="why-text">
              This information helps us support sign-in, save progress, personalize
              features, maintain platform security, and improve course delivery.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Your control</h2>
          <div className="why-box">
            <p className="why-text">
              If you have questions about your information or platform settings,
              please use the support channels provided on AI Sprint.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
