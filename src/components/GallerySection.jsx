import React, { useState, useEffect, useCallback } from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './GallerySection.css';

/**
 * GallerySection — "Anya in Action"
 *
 * Drop your images into /public/gallery/ and list them here.
 * Each item can have a caption and a category tag.
 *
 * Supported categories: 'Speaking' | 'Events' | 'Community' | 'Media'
 */
const PHOTOS = [
  {
    src:      '/gallery/pic_1.jpg',
    caption:  'At the Bahá\'í International Community',
    category: 'Community',
    span:     'wide',   // 'wide' | 'tall' | 'square' (controls grid placement)
  },
  {
    src:      '/gallery/pic_2.jpg',
    caption:  'Speaking on purpose-driven leadership',
    category: 'Speaking',
    span:     'tall',
  },
  {
    src:      '/gallery/pic_3.jpg',
    caption:  'Roundtable on equity & innovation',
    category: 'Events',
    span:     'wide',
  },
  // ── Add more photos below ──────────────────────────────────────
  // {
  //   src:      '/gallery/pic_4.jpg',
  //   caption:  'Your caption here',
  //   category: 'Speaking',
  //   span:     'square',
  // },
];

const CATEGORIES = ['All', ...Array.from(new Set(PHOTOS.map((p) => p.category)))];

export default function GallerySection() {
  const ref = useFadeRef();

  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox]             = useState(null); // index | null
  const [loaded, setLoaded]                 = useState({});

  const filtered = activeCategory === 'All'
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === activeCategory);

  // Keyboard navigation for lightbox
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % filtered.length);
    if (e.key === 'ArrowLeft')  setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const openLightbox  = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = (e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + filtered.length) % filtered.length); };
  const next = (e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % filtered.length); };

  return (
    <section id="gallery" className="gallery-section" ref={ref}>

      {/* ── Header ── */}
      <div className="gallery-section__header fade-up">
        <div className="section-tag">Gallery</div>
        <h2 className="section-h2">Anya in Action</h2>
        <div className="divider" />
        <p className="section-sub">
          Speaking engagements, community leadership, and moments of connection
          from across Anya's journey in green energy and workforce consulting.
        </p>
      </div>

      {/* ── Filter pills ── */}
      <div className="gallery-filters fade-up">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`gallery-filter${activeCategory === cat ? ' gallery-filter--active' : ''}`}
            onClick={() => { setActiveCategory(cat); setLightbox(null); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Masonry grid ── */}
      <div className="gallery-grid fade-up">
        {filtered.map((photo, idx) => (
          <div
            key={photo.src}
            className={`gallery-item gallery-item--${photo.span || 'square'}`}
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            aria-label={`View: ${photo.caption}`}
          >
            {/* Skeleton shimmer while image loads */}
            {!loaded[photo.src] && <div className="gallery-item__skeleton" />}
            <img
              src={photo.src}
              alt={photo.caption}
              className={`gallery-item__img${loaded[photo.src] ? ' gallery-item__img--loaded' : ''}`}
              onLoad={() => setLoaded((prev) => ({ ...prev, [photo.src]: true }))}
              loading="lazy"
            />
            <div className="gallery-item__overlay">
              <span className="gallery-item__category">{photo.category}</span>
              <p className="gallery-item__caption">{photo.caption}</p>
              <span className="gallery-item__zoom">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button className="gallery-lb__close" onClick={closeLightbox} aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Prev */}
          {filtered.length > 1 && (
            <button className="gallery-lb__nav gallery-lb__nav--prev" onClick={prev} aria-label="Previous image">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="gallery-lb__inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].caption}
              className="gallery-lb__img"
            />
            <div className="gallery-lb__meta">
              <span className="gallery-lb__category">{filtered[lightbox].category}</span>
              <p className="gallery-lb__caption">{filtered[lightbox].caption}</p>
              <span className="gallery-lb__counter">{lightbox + 1} / {filtered.length}</span>
            </div>
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button className="gallery-lb__nav gallery-lb__nav--next" onClick={next} aria-label="Next image">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
