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
  startListening,
  stopListening
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
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-background/90 backdrop-blur-lg p-4 sm:p-6"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <div className="flex-1 flex flex-col items-center justify-center pb-8 min-h-[10rem] sm:min-h-[12rem]">
              {isListening ? (
                <VoiceWaveform />
              ) : (
                <>
                  {isProcessing && <Loader2 className="animate-spin h-8 w-8 mb-3" />}
                  <p className="text-lg sm:text-xl text-muted-foreground text-center px-4">{getHelperText()}</p>
                </>
              )}
            </div>

            <CommandInput
              onTextCommand={onTextCommand}
              onVoiceCommand={onVoiceCommand}
              isProcessing={isProcessing}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandInterface;