import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="landing">
      <header className="hero">
        <div className="w-full flex ">
          <h2 className="title">Educational Grant Platform</h2>
          <p className="subtitle">
            Find grants, simplify applications and manage recipients — all in one place.
          </p>
          <div className="ctas">
            <a className="ctaPrimary" href="/student-dashboard">
              Find Your Grant
            </a>
            <a className="ctaSecondary" href="/grant-management/create">
              Manage Your Grants
            </a>
          </div>
        </div>
        <div className="heroVisual" aria-hidden>
          <div className="card">
            <strong>For Students</strong>
            <p>Auto-filtered matches, saved profiles and one-click applications.</p>
          </div>
          <div className="card">
            <strong>For Providers</strong>
            <p>Smart screening, ranking and streamlined selection tools.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <h2 className="sectionTitle">Why this matters</h2>
        <div className="grid">
          <div className="cardFeature">
            <h3>Students</h3>
            <ul>
              <li>Discover grants matching your profile</li>
              <li>Save and reuse personal data for faster applications</li>
              <li>Clear eligibility guidance</li>
            </ul>
          </div>
          <div className="cardFeature">
            <h3>Providers</h3>
            <ul>
              <li>Reduce ineligible applications with pre-filtering</li>
              <li>Automated ranking & assessments</li>
              <li>Secure applicant data management</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sectionAlt">
        <h2 className="sectionTitle">How it works</h2>
        <ol className="steps">
          <li>
            <strong>Create a profile</strong>
            <p>Students store details once. Providers create grant templates.</p>
          </li>
          <li>
            <strong>Find & match</strong>
            <p>Automatic eligibility checks surface the best matches.</p>
          </li>
          <li>
            <strong>Apply & decide</strong>
            <p>One-click applications and provider-side ranking tools.</p>
          </li>
        </ol>
      </section>

      <section className="features">
        <h2 className="sectionTitle">Key features</h2>
        <div className="featuresGrid">
          <div className="featureItem">
            <div className="featureIcon">🔍</div>
            <h4>Discoverable Grants</h4>
            <p>Centralized catalog with powerful search and filters.</p>
          </div>
          <div className="featureItem">
            <div className="featureIcon">⚙️</div>
            <h4>Smart Eligibility</h4>
            <p>Automatic checks prevent invalid submissions.</p>
          </div>
          <div className="featureItem">
            <div className="featureIcon">📁</div>
            <h4>Profile Vault</h4>
            <p>Save documents and answers for reuse across applications.</p>
          </div>
          <div className="featureItem">
            <div className="featureIcon">📊</div>
            <h4>Provider Tools</h4>
            <p>Streamlined management, rankings, and selection workflows.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerInner">
          <div className="brand">Educational Grant Platform</div>
          <nav className="footerNav">
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
          </nav>
        </div>
        <div className="copy">© {new Date().getFullYear()} Educational Grant Platform</div>
      </footer>
    </div>
  );
};

export default LandingPage;