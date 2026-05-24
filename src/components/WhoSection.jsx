import React from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './WhoSection.css';

const OUTCOMES = [
  { icon: 'Decision speed', text: 'More decisive without becoming reactive' },
  { icon: 'Authority',      text: 'More empathetic without losing standards' },
  { icon: 'Trust',          text: 'Deep team trust & communication clarity' },
  { icon: 'Velocity',       text: 'Political friction drops, momentum builds' },
  { icon: 'Resilience',     text: 'Stronger under pressure and complexity' },
  { icon: 'Culture',        text: 'Organizational culture stabilizes and scales' },
];

export default function WhoSection() {
  const ref = useFadeRef();

  return (
    <section id="about" className="who-section" ref={ref}>
      <div className="who-section__grid">
        <div className="who-section__left">
          <div className="section-tag fade-up">Who This Is For</div>
          <h2 className="section-h2 fade-up fade-up-delay-1">
            When intelligence and effort aren't enough
          </h2>
          <div className="divider fade-up fade-up-delay-1" />
          <p className="section-sub fade-up fade-up-delay-2">
            Executive performance is deeply influenced by how leaders process pressure,
            interpret complexity, regulate emotion, and build trust. I work on the
            architecture underneath — not the surface.
          </p>
          <p className="who-section__note fade-up fade-up-delay-3">
            This is not motivational coaching. It is strategic advisory that changes
            how teams move, decide, and build together — with measurable organizational
            impact.
          </p>
        </div>

        <div className="who-section__right">
          {OUTCOMES.map(({ icon, text }, i) => (
            <div
              className={`outcome-card fade-up fade-up-delay-${(i % 3) + 1}`}
              key={icon}
            >
              <div className="outcome-card__label">{icon}</div>
              <div className="outcome-card__text">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
