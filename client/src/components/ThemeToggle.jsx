import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const reduceMotion = useReducedMotion();
  const timerRefs = useRef([]);
  const [transition, setTransition] = useState(null);

  const isAnimating = transition !== null;
  const targetTheme = transition?.to ?? theme;

  const motionConfig = useMemo(() => ({
    durationMs: reduceMotion ? 180 : 560,
    flipDelayMs: reduceMotion ? 75 : 280,
    travel: reduceMotion ? 9 : 16,
    transition: reduceMotion
      ? { duration: 0.16, ease: 'linear' }
      : { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  }), [reduceMotion]);

  useEffect(() => () => {
    timerRefs.current.forEach((timerId) => window.clearTimeout(timerId));
    timerRefs.current = [];
  }, []);

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    timerRefs.current.push(timerId);
  };

  const startTransition = () => {
    if (isAnimating) return;

    const nextTheme = isDark ? 'light' : 'dark';
    setTransition({ from: theme, to: nextTheme });

    schedule(() => {
      setTheme(nextTheme);
    }, motionConfig.flipDelayMs);

    schedule(() => {
      setTransition(null);
      timerRefs.current = [];
    }, motionConfig.durationMs);
  };

  const sunPose = (() => {
    if (!isAnimating) {
      return isDark
        ? { y: motionConfig.travel, opacity: 0, scale: 0.94, rotate: -6 }
        : { y: 0, opacity: 1, scale: 1, rotate: 0 };
    }
    return transition.to === 'dark'
      ? { y: motionConfig.travel, opacity: 0, scale: 0.94, rotate: -6 }
      : { y: 0, opacity: 1, scale: 1, rotate: 0 };
  })();

  const moonPose = (() => {
    if (!isAnimating) {
      return isDark
        ? { y: 0, opacity: 1, scale: 1, rotate: 0 }
        : { y: motionConfig.travel, opacity: 0, scale: 0.94, rotate: 6 };
    }
    return transition.to === 'dark'
      ? { y: 0, opacity: 1, scale: 1, rotate: 0 }
      : { y: motionConfig.travel, opacity: 0, scale: 0.94, rotate: 6 };
  })();

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-live="polite"
      onClick={startTransition}
      disabled={isAnimating}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/12 bg-white text-slate-900 shadow-[0_6px_18px_rgba(16,24,40,0.16)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default dark:border-white/20 dark:bg-[#0f141a] dark:text-slate-100 dark:focus-visible:ring-slate-200/45 dark:focus-visible:ring-offset-[#0b1015]"
    >
      <span className="pointer-events-none absolute inset-[1px] overflow-hidden rounded-full">
        <Motion.span
          className="absolute inset-0"
          animate={{ opacity: targetTheme === 'light' ? 1 : 0 }}
          transition={motionConfig.transition}
          style={{
            background:
              'radial-gradient(circle at 50% 14%, rgba(255,255,255,0.95) 0%, rgba(232,238,246,0.95) 64%, rgba(217,225,236,0.96) 100%)',
          }}
        />
        <Motion.span
          className="absolute inset-0"
          animate={{ opacity: targetTheme === 'dark' ? 1 : 0 }}
          transition={motionConfig.transition}
          style={{
            background:
              'radial-gradient(circle at 50% 16%, rgba(55,65,81,0.6) 0%, rgba(22,30,41,0.96) 68%, rgba(13,18,26,0.98) 100%)',
          }}
        />
        <Motion.span
          className="absolute left-1/2 top-[57%] h-px w-[68%] -translate-x-1/2 rounded-full"
          animate={{ opacity: isAnimating ? 0.72 : 0.5 }}
          transition={motionConfig.transition}
          style={{
            backgroundColor:
              targetTheme === 'dark' ? 'rgba(203,213,225,0.45)' : 'rgba(71,85,105,0.26)',
          }}
        />
        <Motion.span
          className="absolute inset-x-0 bottom-0 h-[52%]"
          animate={{ opacity: targetTheme === 'dark' ? 1 : 0.86 }}
          transition={motionConfig.transition}
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(15,23,42,0.08) 45%, rgba(15,23,42,0.18) 100%)',
          }}
        />
      </span>

      <Motion.span
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
        animate={sunPose}
        transition={motionConfig.transition}
        style={{ color: targetTheme === 'dark' ? '#e2e8f0' : '#111827' }}
      >
        <Sun className="h-4 w-4" strokeWidth={1.95} />
      </Motion.span>

      <Motion.span
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
        animate={moonPose}
        transition={motionConfig.transition}
        style={{ color: targetTheme === 'dark' ? '#e2e8f0' : '#0f172a' }}
      >
        <Moon className="h-4 w-4" strokeWidth={1.95} />
      </Motion.span>
    </button>
  );
};

export default ThemeToggle;
