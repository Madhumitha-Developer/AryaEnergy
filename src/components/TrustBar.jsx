import React from 'react';
import './TrustBar.css';

const ITEMS = [
  'Executive Leadership',
  'Sales Teams',
  'Marketing Orgs',
  'Organizational Transformation',
  'Team Alignment',
  'Revenue Expansion',
];

export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar__track">
        {/* Duplicate for infinite scroll illusion */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div className="trust-bar__item" key={i}>
            <div className="trust-bar__dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
