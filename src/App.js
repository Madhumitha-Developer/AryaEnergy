import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import WhoSection from './components/WhoSection';
import ServicesSection from './components/ServicesSection';
import FrameworkSection from './components/FrameworkSection';
import TeamsSection from './components/TeamsSection';
import PodcastSection from './components/PodcastSection';
import GallerySection from './components/GallerySection';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import { useScrollFade } from './hooks/useScrollFade';

export default function App() {
  // Register global scroll observer for all .fade-up elements
  useScrollFade();

  const [confirmed, setConfirmed] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState(null);
  const [page, setPage] = useState('home'); // 'home' | 'about'

  // Immediately mark above-fold elements as visible
  useEffect(() => {
    const immediateEls = document.querySelectorAll('.hero .fade-up');
    const show = () => immediateEls.forEach((el) => el.classList.add('visible'));
    const raf = requestAnimationFrame(show);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />

      {page === 'about' ? (
        <>
          <AboutPage />
          <BookingSection
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            confirmedDetails={confirmedDetails}
            setConfirmedDetails={setConfirmedDetails}
          />
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <TrustBar />
          <WhoSection />
          <ServicesSection />
          <FrameworkSection />
          <TeamsSection />
          <PodcastSection />
          <GallerySection />
          <BookingSection
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            confirmedDetails={confirmedDetails}
            setConfirmedDetails={setConfirmedDetails}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
