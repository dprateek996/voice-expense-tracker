import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const VoiceVisualizer = ({ state, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="relative w-full h-40 flex items-center justify-center cursor-pointer"
      style={{ perspective: '800px' }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && <LineWaveIndicator key="idle" state="idle" />}
        {state === 'listening' && <LineWaveIndicator key="listening" state="listening" />}
        {state === 'processing' && <ProcessingIndicator key="processing" />}
        {state === 'success' && <FeedbackIndicator key="success" type="success" />}
        {state === 'error' && <FeedbackIndicator key="error" type="error" />}
      </AnimatePresence>
    </motion.div>
  );
};

const LineWaveIndicator = ({ state }) => {
  const isListening = state === 'listening';
  const width = 200;
  const height = 80;

  const wavePath = "M 0 40 Q 50 0, 100 40 T 200 40";
  const flatPath = "M 0 40 L 200 40";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={flatPath}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
          animate={{ d: isListening ? wavePath : flatPath }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {isListening && (
             <motion.path
              d={wavePath}
              stroke="hsl(var(--primary-glow))"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: [
                  "M 0 40 Q 50 0, 100 40 T 200 40",
                  "M 0 40 Q 50 80, 100 40 T 200 40",
                  "M 0 40 Q 50 0, 100 40 T 200 40",
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          )}
        </motion.path>
      </svg>
    </motion.div>
  );
};

const ProcessingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    className="w-4 h-4 bg-primary rounded-full"
    transition={{ type: 'spring' }}
  >
    <motion.div
      className="w-full h-full bg-primary rounded-full"
      animate={{ scale: [1, 1.5, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.div>
);

const FeedbackIndicator = ({ type }) => {
  const isSuccess = type === 'success';
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={isSuccess ? 'text-green-400' : 'text-red-400'}
    >
      {isSuccess ? <Check size={40} /> : <X size={40} />}
    </motion.div>
  );
};

export default VoiceVisualizer;