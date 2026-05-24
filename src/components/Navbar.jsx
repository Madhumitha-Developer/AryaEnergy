import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About',     href: '#about',     page: 'about' },
  { label: 'Framework', href: '#framework', page: null },
  { label: 'Services',  href: '#services',  page: null },
  { label: 'Podcast',   href: '#podcast',   page: null },
  { label: 'Teams',     href: '#teams',     page: null },
];

export default function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBookClick = () => {
    if (page !== 'home' && setPage) setPage('home');
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, page !== 'home' ? 100 : 0);
  };

  const handleNavClick = (link) => {
    setMenuOpen(false);
    if (link.page && setPage) {
      setPage(link.page);
    } else if (!link.page) {
      if (page !== 'home' && setPage) setPage('home');
      setTimeout(() => {
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, page !== 'home' ? 100 : 0);
    }
  };

  const handleLogoClick = () => {
    if (setPage) setPage('home');
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Anya <span>Eydman</span>
      </div>

      <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.page ? undefined : link.href}
              className={page === link.page ? 'navbar__link--active' : ''}
              onClick={(e) => {
                if (link.page) e.preventDefault();
                handleNavClick(link);
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <button className="navbar__cta" onClick={handleBookClick}>
        Book a call
      </button>

      <button
        className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
