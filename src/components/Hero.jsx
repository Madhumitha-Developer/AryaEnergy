import React, { useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero() {
  const cardRef = useRef(null);

  const handleExplore = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Subtle parallax on hero-right orbs
  useEffect(() => {
    const handleMouse = (e) => {
      const card = cardRef.current;
      if (!card) return;
      const { innerWidth: W, innerHeight: H } = window;
      const dx = (e.clientX / W - 0.5) * 12;
      const dy = (e.clientY / H - 0.5) * 8;
      card.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="hero">
      {/* ── Left ── */}
      <div className="hero__left">
        <div className="hero__tag fade-up">Executive &amp; Organizational Advisory</div>

        <h1 className="hero__h1 fade-up fade-up-delay-1">
          Build the{' '}
          <em>Trust Infrastructure</em>{' '}
          your organization runs on
        </h1>

        <p className="hero__sub fade-up fade-up-delay-2">
          Strategic leadership advisory rooted in practical execution, relational
          intelligence, and organizational systems awareness — not theory, but real
          issues in real time.
        </p>

        <div className="hero__actions fade-up fade-up-delay-3">
          <button className="btn-primary" onClick={handleExplore}>
            Explore services
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-outline" onClick={handleBooking}>
            Book intro call
          </button>
        </div>

        <div className="hero__social-proof fade-up fade-up-delay-4">
          <div className="proof-item">
            <span className="proof-num">5-Phase</span>
            <span className="proof-label">Framework</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-num">C-Suite</span>
            <span className="proof-label">Clientele</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-num">Real-Time</span>
            <span className="proof-label">Advisory</span>
          </div>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="hero__right">
        {/* Background orbs */}
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />

        <div className="hero__card-wrap" ref={cardRef}>
          <div className="hero__card">
            <div className="hero__card-header">
              <div>
                <div className="hero__card-name">Anya Eydman</div>
                <div className="hero__card-title">Trust Infrastructure Advisor</div>
              </div>
              <div className="hero__card-badge">
                <span className="badge-dot" />
                Available
              </div>
            </div>

            <div className="hero__divider" />

            {[
              { label: 'Specialty', value: 'Executive leadership architecture & organizational alignment' },
              { label: 'Serves',    value: 'C-suite, Sales teams, Marketing orgs, Leadership teams' },
              { label: 'Framework', value: '5-phase Trust Infrastructure — from diagnosis to revenue expansion' },
            ].map(({ label, value }) => (
              <div className="hero__stat" key={label}>
                <div className="hero__stat-label">{label}</div>
                <div className="hero__stat-val">{value}</div>
              </div>
            ))}

            <button className="hero__card-cta" onClick={handleBooking}>
              Schedule a discovery call
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
