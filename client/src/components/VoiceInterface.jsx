import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Loader } from 'lucide-react';
import { Button } from './ui/button';
import useVoiceStore from '@/store/voiceStore'; // It reads directly from the global store

const VoiceInterface = ({ onCancel, onStopListening }) => {
  const { isOpen, uiState, interimTranscript } = useVoiceStore();

  const getHelperText = () => {
    switch (uiState) {
      case 'listening':
        return interimTranscript || 'Listening...';
      case 'processing':
        return 'Understanding...';
      case 'refining':
        return 'Correcting transcript...';
      case 'confirming':
        return 'Confirmation required.';
      default:
        return 'Press the mic and say an expense...';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Layer 1: Glass Overlay
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-lg p-4"
        >
          {/* Close Button (top right) */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-muted-foreground" onClick={onCancel}>
              <X className="h-6 w-6" />
            </Button>
          </motion.div>

          {/* Layer 2: Center Stage */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl text-center"
          >
            {/* Live Transcript Preview */}
            <p className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground h-40">
              {getHelperText()}
            </p>
          </motion.div>

          {/* Layer 3: Action Strip */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-6 pb-12"
          >
            {/* The Glowing Microphone */}
            <div className="relative flex items-center justify-center">
              {uiState === 'listening' && (
                <motion.div
                  className="absolute w-24 h-24 bg-primary/20 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {uiState === 'processing' && (
                 <motion.div
                  className="absolute w-24 h-24 border-4 border-primary/50 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
              <Button size="icon" className="w-20 h-20 rounded-full bg-primary shadow-lg" onClick={uiState === 'listening' ? onStopListening : null} disabled={uiState !== 'listening'}>
                {uiState === 'processing' ? <Loader className="h-8 w-8 animate-spin" /> : <Mic className="h-8 w-8" />}
              </Button>
            </div>
            
            {/* Stop Button */}
            {uiState === 'listening' && (
              <Button variant="secondary" onClick={onStopListening}>
                Finish & Process
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceInterface;