import React from 'react';
import './Footer.css';

const NAV_COLS = [
  {
    heading: 'Services',
    links: ['Framework ($99)', 'Executive Advisory', 'Team Workshops', 'Enterprise'],
  },
  {
    heading: 'Resources',
    links: ['Podcast', 'Case Studies', 'Framework Guide', 'Blog'],
  },
  {
    heading: 'Connect',
    links: ['LinkedIn', 'Book a call', 'Contact', 'Newsletter'],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <div className="footer__brand">
            Anya <span>Eydman</span>
          </div>
          <div className="footer__tagline">
            Trust Infrastructure Advisory — helping organizations move at the speed of trust.
          </div>
          <a href="mailto:anya@trustinfrastructure.com" className="footer__email">
            anya@trustinfrastructure.com
          </a>
        </div>

        {NAV_COLS.map((col) => (
          <div className="footer__col" key={col.heading}>
            <h4 className="footer__col-heading">{col.heading}</h4>
            {col.links.map((link) => (
              <a href="#" className="footer__link" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="footer__copy">© 2026 Anya Eydman · Trust Infrastructure</div>
        <div className="footer__copy">Confidential – Advisory use only</div>
      </div>
    </footer>
  );
}
