import Nav from "@/components/nav";

export default function TermsPage() {
  return (
    <div className="page-wrap">
      <Nav />

      <main className="inner-page">
        <header className="inner-page-header">
          <div className="inner-page-badge">Legal & Accessibility</div>
          <h1 className="inner-page-title">Terms</h1>
          <p className="inner-page-sub">
            These general terms describe expected use of the AI Sprint platform.
          </p>
        </header>

        <section className="day-section">
          <h2 className="section-heading">Platform use</h2>
          <div className="why-box">
            <p className="why-text">
              AI Sprint is provided as a guided learning platform. Users are expected
              to use the platform lawfully, respectfully, and in ways that do not
              disrupt service or misuse content.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Accounts and access</h2>
          <div className="why-box">
            <p className="why-text">
              Access to some features may depend on account status, purchase status,
              or platform permissions. Users are responsible for maintaining the
              security of their own accounts.
            </p>
          </div>
        </section>

        <section className="day-section">
          <h2 className="section-heading">Updates</h2>
          <div className="why-box">
            <p className="why-text">
              AI Sprint may update features, lessons, policies, or product structure
              over time as the platform evolves.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
