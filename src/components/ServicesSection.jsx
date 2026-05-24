import React from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './ServicesSection.css';

const SERVICES = [
  {
    num: '01 — Framework',
    name: 'Trust Infrastructure Framework',
    desc: 'Full access to the documented methodology, self-guided implementation guide, and resource library.',
    price: '$99',
    period: 'one-time',
    features: [
      'Complete framework documentation',
      'Self-guided implementation',
      'Resource library access',
      'Team meeting facilitation guide',
    ],
    cta: 'Get framework access',
    featured: false,
  },
  {
    num: '02 — Advisory',
    name: 'Executive Advisory',
    desc: 'Personalized 1-on-1 leadership assessment, stakeholder mapping, and 30-day strategic support.',
    price: '$499',
    period: 'per engagement',
    features: [
      '1-on-1 consultation session',
      'Custom framework assessment',
      '30-day implementation support',
      'Direct email access',
    ],
    cta: 'Schedule consultation',
    featured: true,
    badge: 'Most popular',
  },
  {
    num: '03 — Enterprise',
    name: 'Organizational Transformation',
    desc: 'Full organizational implementation with stakeholder mapping, pattern analysis, and 90-day execution support.',
    price: 'Custom',
    period: 'pricing',
    features: [
      'Stakeholder mapping & analysis',
      'Pattern recognition study',
      'Structured action planning',
      '90-day execution support',
      'Quarterly check-ins',
    ],
    cta: 'Request discovery call',
    featured: false,
  },
];

export default function ServicesSection() {
  const ref = useFadeRef();

  const handleCta = (svc) => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="services-section" ref={ref}>
      <div className="services-section__header fade-up">
        <div>
          <div className="section-tag">Advisory Services</div>
          <h2 className="section-h2">Choose your path</h2>
        </div>
        <p className="services-section__note">
          Each engagement begins with deep listening — your challenges shape the approach
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((svc, i) => (
          <div
            key={svc.name}
            className={`service-card fade-up fade-up-delay-${i + 1}${svc.featured ? ' service-card--featured' : ''}`}
          >
            {svc.badge && (
              <div className="service-card__badge">{svc.badge}</div>
            )}
            <div className="service-card__num">{svc.num}</div>
            <div className="service-card__name">{svc.name}</div>
            <div className="service-card__desc">{svc.desc}</div>

            <div className="service-card__price">
              {svc.price}
              <span>{svc.period}</span>
            </div>

            <ul className="service-card__features">
              {svc.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button
              className="service-card__btn"
              onClick={() => handleCta(svc)}
            >
              {svc.cta} →
            </button>

            {/* Hover accent line */}
            <div className="service-card__accent" />
          </div>
        ))}
      </div>
    </section>
  );
}
