import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const reduceMotion = useReducedMotion();
  const timersRef = useRef([]);
  const [transition, setTransition] = useState(null);

  const motionConfig = useMemo(() => ({
    durationMs: reduceMotion ? 180 : 560,
    flipDelayMs: reduceMotion ? 90 : 280,
    travel: reduceMotion ? 8 : 16,
    easing: reduceMotion ? { duration: 0.18, ease: 'linear' } : { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  }), [reduceMotion]);

  useEffect(() => () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = (fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  const isAnimating = transition !== null;
  const targetTheme = transition?.to ?? theme;

  const startTransition = () => {
    if (isAnimating) return;
    const nextTheme = isDark ? 'light' : 'dark';
    setTransition({ from: theme, to: nextTheme });

    schedule(() => {
      setTheme(nextTheme);
    }, motionConfig.flipDelayMs);

    schedule(() => {
      setTransition(null);
      timersRef.current = [];
    }, motionConfig.durationMs);
  };

  const sunPose = !isAnimating
    ? (isDark ? { y: motionConfig.travel, opacity: 0, scale: 0.94 } : { y: 0, opacity: 1, scale: 1 })
    : (transition.to === 'dark' ? { y: motionConfig.travel, opacity: 0, scale: 0.94 } : { y: 0, opacity: 1, scale: 1 });

  const moonPose = !isAnimating
    ? (isDark ? { y: 0, opacity: 1, scale: 1 } : { y: motionConfig.travel, opacity: 0, scale: 0.94 })
    : (transition.to === 'dark' ? { y: 0, opacity: 1, scale: 1 } : { y: motionConfig.travel, opacity: 0, scale: 0.94 });

  return (
    <button
      type="button"
      onClick={startTransition}
      disabled={isAnimating}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-transform duration-fast ease-out hover:scale-105 active:scale-95"
    >
      <span className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
        <Motion.span
          className="absolute inset-0"
          animate={{ opacity: targetTheme === 'light' ? 1 : 0 }}
          transition={motionConfig.easing}
          style={{ background: 'radial-gradient(circle at top, hsl(var(--surface-2)), hsl(var(--surface-1)))' }}
        />
        <Motion.span
          className="absolute inset-0"
          animate={{ opacity: targetTheme === 'dark' ? 1 : 0 }}
          transition={motionConfig.easing}
          style={{ background: 'radial-gradient(circle at top, hsl(var(--surface-3)), hsl(var(--surface-1)))' }}
        />

        <Motion.span
          className="absolute inset-0 flex items-center justify-center"
          animate={sunPose}
          transition={motionConfig.easing}
        >
          <Sun className="h-4 w-4" />
        </Motion.span>
        <Motion.span
          className="absolute inset-0 flex items-center justify-center"
          animate={moonPose}
          transition={motionConfig.easing}
        >
          <Moon className="h-4 w-4" />
        </Motion.span>
      </span>
    </button>
  );
};

export default ThemeToggle;
