import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFadeRef } from '../hooks/useScrollFade';
import './PodcastSection.css';

const EPISODES = [
  { ep: 'Ep. 12', title: 'Why trust is the last mile of your strategy', duration: '42:17', mins: '42 min' },
  { ep: 'Ep. 11', title: 'How organizational silence creates strategic debt', duration: '38:44', mins: '38 min' },
  { ep: 'Ep. 10', title: 'Mapping influence: the hidden org chart', duration: '51:03', mins: '51 min' },
];

// Generate random waveform heights once
const WAVE_BARS = Array.from({ length: 60 }, () => Math.floor(Math.random() * 28 + 6));

export default function PodcastSection() {
  const ref = useFadeRef();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeEp, setActiveEp] = useState(0);
  const intervalRef = useRef(null);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setPlaying(false); return 0; }
          return p + 0.15;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const handleEpChange = (i) => {
    setActiveEp(i);
    setProgress(0);
    setPlaying(false);
  };

  const ep = EPISODES[activeEp];

  // Format progress as time
  const totalSecs = ep.duration.split(':').reduce((a, b) => a * 60 + +b, 0);
  const elapsed = Math.floor((progress / 100) * totalSecs);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <section id="podcast" className="podcast-section" ref={ref}>
      <div className="podcast-section__inner">
        {/* Left */}
        <div className="podcast-section__left fade-up">
          <div className="section-tag">Podcast</div>
          <h2 className="section-h2">The Trust Infrastructure Conversations</h2>
          <div className="divider" />
          <p className="section-sub">
            Candid conversations on leadership, organizational dynamics, and building
            the systems that allow teams to move fast and stay aligned.
          </p>

          <div className="podcast-section__episode-list">
            {EPISODES.map((e, i) => (
              <button
                key={e.ep}
                className={`ep-item${i === activeEp ? ' ep-item--active' : ''}`}
                onClick={() => handleEpChange(i)}
              >
                <div className="ep-item__num">{e.ep}</div>
                <div className="ep-item__title">{e.title}</div>
                <div className="ep-item__dur">{e.mins}</div>
              </button>
            ))}
          </div>

          <button className="btn-primary podcast-section__cta">
            All episodes →
          </button>
        </div>

        {/* Player */}
        <div className="podcast-player fade-up fade-up-delay-2">
          <div className="podcast-player__ep-tag">Latest Episode</div>
          <div className="podcast-player__title">{ep.title}</div>
          <div className="podcast-player__meta">{ep.mins} · Trust Infrastructure Podcast</div>

          {/* Waveform */}
          <div className="podcast-player__waveform" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.min(100, Math.max(0, pct)));
          }}>
            {WAVE_BARS.map((h, i) => (
              <div
                key={i}
                className={`wave-bar${(i / WAVE_BARS.length) * 100 <= progress ? ' wave-bar--played' : ''}`}
                style={{ height: h }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="podcast-player__progress-track">
            <div
              className="podcast-player__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="podcast-player__controls">
            <button
              className="podcast-player__play"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <rect x="3" y="2" width="4" height="14" rx="1"/>
                  <rect x="11" y="2" width="4" height="14" rx="1"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M4 3l12 6-12 6V3z"/>
                </svg>
              )}
            </button>

            <div className="podcast-player__time">
              {mm}:{ss} / {ep.duration}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
