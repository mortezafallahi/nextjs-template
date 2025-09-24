'use client';

import { useEffect, useState } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  scrollUpThreshold?: number;
  scrollDownThreshold?: number;
  initialDirection?: 'up' | 'down';
  changeColorThreshold?: number;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const {
    threshold = 10,
    scrollUpThreshold = threshold,
    scrollDownThreshold = threshold,
    initialDirection = 'up',
    changeColorThreshold = Number.MAX_SAFE_INTEGER,
  } = options;

  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(
    initialDirection
  );
  const [prevOffset, setPrevOffset] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const difference = scrollY - prevOffset;

      setIsScrolled(scrollY > changeColorThreshold);

      if (scrollY <= 10) {
        setVisible(true);
        setScrollDirection('up');
      } else if (difference > scrollDownThreshold) {
        setVisible(false);
        setScrollDirection('down');
      } else if (difference < -scrollUpThreshold) {
        setVisible(true);
        setScrollDirection('up');
      }

      setPrevOffset(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    updateScrollDirection();

    return () => window.removeEventListener('scroll', onScroll);
  }, [prevOffset, scrollUpThreshold, scrollDownThreshold]);

  return { scrollDirection, visible, isScrolled };
}
