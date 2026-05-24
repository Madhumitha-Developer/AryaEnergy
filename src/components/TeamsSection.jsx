import React from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './TeamsSection.css';

const TEAMS = [
  {
    name: 'Leadership & Executive',
    desc: 'Address isolation at the top. Rebuild candor, sharpen decision architecture, and restore stakeholder trust in your leadership presence.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    name: 'Sales Teams',
    desc: 'Map deal stakeholders, reduce political friction, accelerate buy-in, and turn pipeline stalls into momentum with clear action ownership.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    name: 'Marketing Orgs',
    desc: 'Align messaging to organizational reality, identify communication gaps between teams, and build campaigns that move at the speed of trust.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
];

export default function TeamsSection() {
  const ref = useFadeRef();

  return (
    <section id="teams" className="teams-section" ref={ref}>
      <div className="teams-section__intro fade-up">
        <div className="section-tag teams-section__tag">Implementation</div>
        <h2 className="section-h2 teams-section__h2">
          Built for every team in the room
        </h2>
        <p className="section-sub teams-section__sub">
          The Trust Infrastructure framework applies across every function — from the
          boardroom to the sales floor.
        </p>
      </div>

      <div className="teams-grid">
        {TEAMS.map((team, i) => (
          <div
            className={`team-card fade-up fade-up-delay-${i + 1}`}
            key={team.name}
          >
            <div className="team-card__icon">
              {team.icon}
            </div>
            <div className="team-card__name">{team.name}</div>
            <div className="team-card__desc">{team.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
