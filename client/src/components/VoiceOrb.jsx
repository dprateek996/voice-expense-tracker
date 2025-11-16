import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Check, X } from 'lucide-react';

const VoiceOrb = ({ state, onClick }) => {
  // This is the CRITICAL FIX:
  // We are creating a local, derived state for the orb's specific visuals.
  // This separates the global UI state from the orb's animation state.
  const orbVisualState = {
    isListening: state === 'listening',
    isProcessing: state === 'processing',
    isSuccess: state === 'success',
    isError: state === 'error',
    isIdle: !['listening', 'processing', 'success', 'error'].includes(state),
  };

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* The soft, pulsing glow animation */}
      <AnimatePresence>
        {orbVisualState.isListening && (
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* The main orb button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40"
        animate={{
          backgroundColor: orbVisualState.isSuccess ? "#16a34a" : orbVisualState.isError ? "#dc2626" : "#f59e0b", // Green for success, Red for error, Amber for default
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {orbVisualState.isProcessing && (
            <motion.div key="processing" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <Loader2 className="h-8 w-8 animate-spin" />
            </motion.div>
          )}
          {orbVisualState.isSuccess && (
            <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <Check className="h-8 w-8" />
            </motion.div>
          )}
           {orbVisualState.isError && (
            <motion.div key="error" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <X className="h-8 w-8" />
            </motion.div>
          )}
          {(orbVisualState.isIdle || orbVisualState.isListening) && (
            <motion.div key="mic" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <Mic className="h-8 w-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default VoiceOrb;