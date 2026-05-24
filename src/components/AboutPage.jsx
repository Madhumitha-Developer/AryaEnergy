import React from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './AboutPage.css';

const FOCUS_AREAS = [
  'Artificial Intelligence',
  'Clean Tech + Renewables',
  'Infrastructure and City Innovation',
];

const PILLARS = [
  {
    num: '01',
    label: 'Visionary Thinking',
    desc: 'Bridging ambitious ideas with the structural and strategic clarity needed to execute at scale.',
  },
  {
    num: '02',
    label: 'Relational Intelligence',
    desc: 'Understanding the human dynamics underneath every organizational challenge — team, culture, trust.',
  },
  {
    num: '03',
    label: 'Practical Execution',
    desc: 'A decade of hands-on leadership across startups, city infrastructure, and clean energy projects.',
  },
];

export default function AboutPage() {
  const ref1 = useFadeRef();
  const ref2 = useFadeRef();
  const ref3 = useFadeRef();

  const handleBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="about-page">
      {/* ── Hero banner ── */}
      <section className="about-hero" ref={ref1}>
        <div className="about-hero__inner">
          <div className="about-hero__left">
            <div className="section-tag fade-up">Meet Our Founder</div>
            <h1 className="about-hero__h1 fade-up fade-up-delay-1">
              Anya <em>Eydman</em>
            </h1>
            <p className="about-hero__subtitle fade-up fade-up-delay-2">
              Trust Infrastructure Advisor &amp; The Midwife of Innovation
            </p>
            <div className="divider fade-up fade-up-delay-2" />
            <p className="about-hero__lead fade-up fade-up-delay-3">
              Strategist, storyteller, and former startup co-founder with over a decade of
              experience leading innovative infrastructure, economic development, and energy
              optimization projects across New York City.
            </p>
            <button
              className="btn-primary about-hero__cta fade-up fade-up-delay-4"
              onClick={handleBooking}
            >
              Connect with Anya
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="about-hero__right fade-up fade-up-delay-2">
            <div className="about-hero__images">
              <div className="about-img-wrap about-img-wrap--main">
                <img
                  src="https://images.squarespace-cdn.com/content/v1/659aca954f6d2e51140b5f9e/2bfc0b2e-5abf-4f6b-860e-2f43b418c65a/DSCF6002.jpeg"
                  alt="Anya Eydman"
                  className="about-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="about-img-fallback" style={{ display: 'none' }}>
                  <span>AE</span>
                </div>
              </div>

              <div className="about-img-wrap about-img-wrap--secondary">
                <img
                  src="https://images.squarespace-cdn.com/content/v1/659aca954f6d2e51140b5f9e/ccf7cf2a-30c3-46db-baa4-aba89fe37697/DSCF7025.jpeg"
                  alt="Anya Eydman speaking"
                  className="about-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="about-img-fallback about-img-fallback--sm" style={{ display: 'none' }}>
                  <span>AE</span>
                </div>
              </div>

              {/* Floating badge */}
              <div className="about-hero__badge fade-up fade-up-delay-4">
                <div className="badge-dot" />
                <span>Available for advisory</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bio section ── */}
      <section className="about-bio" ref={ref2}>
        <div className="about-bio__inner">
          <div className="about-bio__note">
            <div className="section-tag fade-up">A Note from Our Founder</div>
            <h2 className="section-h2 fade-up fade-up-delay-1">
              Building systems that serve both people and place
            </h2>
            <div className="divider fade-up fade-up-delay-1" />

            <div className="about-bio__body">
              <p className="fade-up fade-up-delay-2">
                I'm a mother, a storyteller, and a strategic leader who knows what it means
                to invest in something with love and conviction — and see it through.
              </p>
              <p className="fade-up fade-up-delay-2">
                Over the years, I've worked on innovative infrastructure and economic
                stability projects for the City of New York, building systems that serve both
                people and place. I've launched an e-commerce business from the ground up,
                worked as an executive coach helping founders and changemakers step into their
                leadership, and I've been a co-founder of a clean energy startup, focused on
                microgrids and energy optimization.
              </p>
              <p className="fade-up fade-up-delay-3">
                Across every chapter, I've built partnerships, told powerful stories, and
                helped shape the future one meaningful project at a time.
              </p>
              <p className="about-bio__emphasis fade-up fade-up-delay-3">
                Now, I'm here to support companies working at the intersection of:
              </p>
            </div>

            <ul className="about-focus-list fade-up fade-up-delay-4">
              {FOCUS_AREAS.map((area) => (
                <li key={area}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Pull quote */}
          <div className="about-bio__quote fade-up fade-up-delay-3">
            <div className="about-bio__quote-mark">"</div>
            <blockquote>
              From building e-commerce ventures to advising founders through executive
              coaching, Anya bridges visionary thinking with practical execution.
            </blockquote>
            <div className="about-bio__quote-attr">
              <div className="about-bio__quote-name">Anya Eydman</div>
              <div className="about-bio__quote-title">Trust Infrastructure Advisor</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars section ── */}
      <section className="about-pillars" ref={ref3}>
        <div className="about-pillars__inner">
          <div className="about-pillars__header">
            <div className="section-tag fade-up">What I Bring</div>
            <h2 className="section-h2 fade-up fade-up-delay-1">
              Three pillars of advisory
            </h2>
          </div>

          <div className="about-pillars__grid">
            {PILLARS.map(({ num, label, desc }, i) => (
              <div
                key={num}
                className={`about-pillar-card fade-up fade-up-delay-${i + 1}`}
              >
                <div className="about-pillar-card__num">{num}</div>
                <div className="about-pillar-card__label">{label}</div>
                <div className="about-pillar-card__desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__h2 fade-up">
            Ready to build the trust your organization runs on?
          </h2>
          <p className="about-cta__sub fade-up fade-up-delay-1">
            Schedule a discovery call to explore how Anya's advisory can accelerate your
            leadership and organizational momentum.
          </p>
          <button
            className="btn-primary fade-up fade-up-delay-2"
            onClick={handleBooking}
          >
            Book a discovery call
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
