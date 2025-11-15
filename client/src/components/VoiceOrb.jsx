import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mic, X } from 'lucide-react';

const Orb = ({ state, onClick }) => {
  const size = 150;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
      animate={state === 'listening' ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: state === 'idle' 
            ? '0 0 20px 5px hsl(var(--primary) / 0.3), 0 0 40px 10px hsl(var(--primary) / 0.2)'
            : '0 0 30px 8px hsl(var(--primary) / 0.5), 0 0 60px 20px hsl(var(--primary) / 0.3)',
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="orb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#orb-gradient)"
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth={strokeWidth}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state === 'idle' && <Icon key="mic" icon={<Mic size={48} />} />}
          {state === 'listening' && <ListeningWave key="wave" />}
          {state === 'processing' && <ProcessingSpinner key="spinner" />}
          {state === 'success' && <Icon key="check" icon={<Check size={60} />} success />}
          {state === 'error' && <Icon key="error" icon={<X size={60} />} error />}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

const Icon = ({ icon, success = false, error = false }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`
      ${success ? 'text-green-400' : ''}
      ${error ? 'text-red-400' : ''}
    `}
  >
    {icon}
  </motion.div>
);

const ListeningWave = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full"
    >
        <svg width="100%" height="100%" viewBox="0 0 150 150">
            {[...Array(3)].map((_, i) => (
                <motion.path
                    key={i}
                    d="M 25 75 Q 75 25, 125 75 T 225 75"
                    fill="none"
                    stroke="hsla(var(--foreground), 0.3)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            "M 25 75 Q 75 50, 125 75 T 225 75",
                            "M 25 75 Q 75 100, 125 75 T 225 75",
                            "M 25 75 Q 75 50, 125 75 T 225 75",
                        ],
                    }}
                    transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </svg>
    </motion.div>
);

const ProcessingSpinner = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, rotate: 360 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{
      rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
      default: { type: 'spring' },
    }}
    style={{
      width: '80%',
      height: '80%',
      border: '6px solid transparent',
      borderTopColor: 'hsl(var(--foreground))',
      borderRadius: '50%',
    }}
  />
);

export default Orb;