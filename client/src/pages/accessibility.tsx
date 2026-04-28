import Nav from "@/components/nav";

export default function AccessibilityPage() {
  return (
    <div className="page-wrap">
      <Nav />

      <main className="inner-page">
        <header className="inner-page-header">
          <div className="inner-page-badge">Legal & Accessibility</div>
          <h1 className="inner-page-title">Accessibility Statement</h1>
          <p className="inner-page-sub">
            AI Sprint is committed to making the platform usable and accessible
            for as many learners as possible.
          </p>
        </header>

        <section className="day-section">
          <h2 className="section-heading">Our commitment</h2>
          <div className="why-box">
            <p className="why-text">
              We aim to provide a learning experience that is clear, readable,
              keyboard-friendly, and usable across modern devices and screen sizes.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Accessibility efforts</h2>
          <div className="why-box">
            <p className="why-text">
              We work to improve color contrast, readable typography, focus states,
              semantic page structure, and consistent navigation patterns throughout
              the platform.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Need help?</h2>
          <div className="why-box">
            <p className="why-text">
              If you encounter an accessibility barrier while using AI Sprint,
              please contact support through the Help or FAQ section so we can review
              and improve the experience.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
