import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import useVoiceStore from '@/store/voiceStore';
import VoiceWaveform from './VoiceWaveform';
import { useEffect } from 'react';
import CommandInput from './CommandInput';

const CommandInterface = ({
  onTextCommand,
  onVoiceCommand,
  isListening,
  transcript,
  startListening,
  stopListening,
  onTextSubmit
}) => {
  const { isOpen, uiState, close, setState } = useVoiceStore();

  // sync UI state
  useEffect(() => {
    if (isListening) setState("listening");
    else if (uiState === "listening") setState("idle");
  }, [isListening]);

  const isProcessing = uiState === "refining" || uiState === "processing";

  const getHelperText = () => {
    switch (uiState) {
      case "refining": return "Checking that for you...";
      case "processing": return "Adding to your ledger...";
      default: return "What did you spend on?";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Compact Popup Card */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
          >
            <div className="bg-gradient-to-br from-neutral-900/98 to-black/98 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-6 relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3EA6FF]/5 via-transparent to-transparent rounded-3xl" />
              <div className="relative z-10">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-4">{getHelperText()}</h3>

              {/* Content Area */}
              <div className="mb-4">
                {isListening ? (
                  <div className="flex items-center justify-center py-8">
                    <VoiceWaveform />
                  </div>
                ) : isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-[#3EA6FF]" />
                  </div>
                ) : null}
              </div>

              {/* Command Input */}
              <CommandInput
                onTextCommand={onTextCommand}
                onVoiceCommand={onVoiceCommand}
                isProcessing={isProcessing}
                isListening={isListening}
                transcript={transcript}
                startListening={startListening}
                stopListening={stopListening}
                onTextSubmit={onTextSubmit}
              />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandInterface;