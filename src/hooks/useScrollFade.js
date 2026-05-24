import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to add/remove the 'visible' class
 * on elements with the 'fade-up' class inside the given container ref.
 */
export function useScrollFade(rootRef = null) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll('.fade-up');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [rootRef]);
}

/**
 * Returns a ref and a className string.
 * Add the ref to a container; all .fade-up children inside will animate.
 */
export function useFadeRef() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = ref.current.querySelectorAll('.fade-up');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}
