import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Loader, Type } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { AIInputWithLoading } from './ui/ai-input-with-loading';
import { AIVoiceInput } from './ui/ai-voice-input';
import useVoiceStore from '@/store/voiceStore';

const VoiceInterface = ({ onCancel, onStopListening, onTextSubmit }) => {
  const { isOpen, uiState, interimTranscript } = useVoiceStore();
  const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'text'

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
        return inputMode === 'text' ? 'Type your expense or switch to voice' : 'Click mic to speak or switch to text';
    }
  };

  const handleTextSubmit = async (text) => {
    if (onTextSubmit) {
      await onTextSubmit(text);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          
          {/* Compact Popup Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 mx-4">
              {/* Header with Close and Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Add Expense</h3>
                <div className="flex items-center gap-2">
                  {/* Mode Toggle */}
                  <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
                    <button
                      onClick={() => setInputMode('voice')}
                      className={`p-2 rounded-md transition-all ${
                        inputMode === 'voice'
                          ? 'bg-[#3EA6FF] text-white'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setInputMode('text')}
                      className={`p-2 rounded-md transition-all ${
                        inputMode === 'text'
                          ? 'bg-[#3EA6FF] text-white'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                      title="Text input"
                    >
                      <Type className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Close Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8" 
                    onClick={onCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-2">
                <AnimatePresence mode="wait">
                  {inputMode === 'voice' ? (
                    <motion.div
                      key="voice"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AIVoiceInput
                        onStart={onStopListening}
                        onToggle={(isRecording) => {
                          if (isRecording) {
                            // Start recording logic
                          } else {
                            onStopListening?.();
                          }
                        }}
                        isRecording={uiState === 'listening'}
                        visualizerBars={40}
                        className="py-2"
                      />
                      {interimTranscript && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl"
                        >
                          <p className="text-sm text-white/50 mb-1">Transcript:</p>
                          <p className="text-white">{interimTranscript}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AIInputWithLoading
                        placeholder="e.g., 500 for groceries, 1200 for dinner"
                        onSubmit={handleTextSubmit}
                        loadingDuration={2000}
                        className="py-2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-white/40 text-center">
                {getHelperText()}
              </p>

              {/* Processing State */}
              {uiState === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center justify-center gap-2 text-[#3EA6FF]"
                >
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing your expense...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoiceInterface;