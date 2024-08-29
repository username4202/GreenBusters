import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleGetStartedClick = () => {
    navigate('/submission'); // '/submission' 경로로 이동
  };

  const handleVerifyClick = () => {
    navigate('/verification'); // '/verification' 경로로 이동
  };
  return (
    <div className="main-page">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1>
            🌿 <br />
            <br />
            GreenBusters<br />
            Revolutionize Green Verification <br />
            With Blockchain <br /> <br />
          </h1>
          <div className="header-buttons">
            <button className="btn-primary" onClick={handleGetStartedClick}>Get Started</button>
            <button className="btn-secondary" onClick={handleVerifyClick}>Verification</button>
          </div>
        </div>
      </header>

      {/* Core Features Section */}
      <section className="core-features">
        <h2>Core Features</h2>
        <div className="features-content">
          <img src="../assets/Profile.jpg" alt="Feature Visual" />
          <div className="features-list">
            <h3>Transparent Verification</h3>
            <p>Make eco-conscious decisions with verified data.</p>
            <h3>Blockchain Security</h3>
            <p>Experience tamper-proof green data.</p>
            <h3>Company Accessibility</h3>
            <p>Enable companies to submit eco data.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to foster authentic green actions? Join us!</h2>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleGetStartedClick}>Start Verifying</button>
          <button className="btn-secondary">Explore More</button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Have Some Questions?</h2>
        <div className="faq-content">
          <div className="faq-item">
            <h3>How to get started?</h3>
            <p>Just hit 'Get Started'. It's as easy as a breeze.</p>
          </div>
          <div className="faq-item">
            <h3>Is blockchain secure enough?</h3>
            <p>Absolutely! It's as secure as Fort Knox.</p>
          </div>
          <div className="faq-item">
            <h3>What is the verification process?</h3>
            <p>Companies provide data, and we verify it. Transparent and simple.</p>
          </div>
          <div className="faq-item">
            <h3>How to avoid greenwashing?</h3>
            <p>Stick with us. We'll expose those pesky greenwashers.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 GreenBusters. We bust greenwashers.</p>
        <p>Generated on Thursday, August 29, 2024</p>
      </footer>
    </div>
  );
};

export default MainPage;
