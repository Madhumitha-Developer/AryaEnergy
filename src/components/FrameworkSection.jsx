import React from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './FrameworkSection.css';

const PHASES = [
  {
    num: '01',
    name: 'Stakeholder Mapping',
    desc: 'Deep listening to surface real bottlenecks, influence pathways, and monetizable opportunities hidden in plain sight.',
  },
  {
    num: '02',
    name: 'Pattern Recognition',
    desc: 'Identify repeatable breakdowns and invisible inefficiencies normalized over time into standard workflow.',
  },
  {
    num: '03',
    name: 'Trust Infrastructure Analysis',
    desc: 'Who is least heard in decisions? What pattern creates the most hidden cost? Where does strategy break down?',
  },
  {
    num: '04',
    name: 'Structured Action Flow',
    desc: 'Clarify the problem, secure early buy-in, design for dependability, and accelerate alignment across stakeholders.',
  },
  {
    num: '05',
    name: 'Revenue Expansion',
    desc: 'Surface service gaps, structure new offerings, and activate internal advisors to support expanded delivery.',
  },
];

export default function FrameworkSection() {
  const ref = useFadeRef();

  return (
    <section id="framework" className="framework-section" ref={ref}>
      <div className="framework-section__intro fade-up">
        <div className="section-tag">The Framework</div>
        <h2 className="section-h2">Five phases. One operating system for trust.</h2>
        <div className="divider" />
      </div>

      <div className="phases-grid">
        {PHASES.map((phase, i) => (
          <div
            className={`phase-card fade-up fade-up-delay-${i + 1}`}
            key={phase.num}
          >
            <div className="phase-card__connector" />
            <div className="phase-card__num">{phase.num}</div>
            <div className="phase-card__name">{phase.name}</div>
            <div className="phase-card__desc">{phase.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
