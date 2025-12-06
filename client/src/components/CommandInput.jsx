import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Type } from "lucide-react";
import { Button } from "./ui/button";
import { AIInputWithLoading } from "./ui/ai-input-with-loading";
import { AIVoiceInput } from "./ui/ai-voice-input";
import { playStartSound, playStopSound } from "@/lib/audioUtils";
import useVoiceStore from "@/store/voiceStore";

const CommandInput = ({
  onTextCommand,
  onVoiceCommand,
  isProcessing,
  isListening,
  transcript,
  startListening,
  stopListening,
  onTextSubmit
}) => {

  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'text'
  const voiceStore = useVoiceStore();
  const lastInterimRef = useRef("");

  // Sync transcript to text input while listening
  useEffect(() => {
    if (isListening && transcript) {
      setText(transcript);
      lastInterimRef.current = transcript;
    }
  }, [isListening, transcript]);

  // -------------------------------
  // Handle text submission from AI Input
  // -------------------------------
  const handleTextSubmit = async (textInput) => {
    if (!textInput.trim()) return;
    
    voiceStore.setState('processing');
    await onTextSubmit?.(textInput.trim(), 'text');
    voiceStore.close();
  };

  // -------------------------------
  // Handle voice toggle
  // -------------------------------
  const handleVoiceToggle = (isRecording) => {
    if (isProcessing) return;

    if (isRecording) {
      playStartSound();
      setText("");
      startListening();
      voiceStore.setState("listening");
    } else {
      playStopSound();
      const final = lastInterimRef.current || transcript;
      stopListening();
      
      if (final?.trim()) {
        onVoiceCommand(final.trim());
      }
    }
  };

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
          <button
            onClick={() => setInputMode('voice')}
            className={`p-2 rounded-md transition-all ${
              inputMode === 'voice'
                ? 'bg-[#3EA6FF] text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
            title="Voice input"
            type="button"
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
            type="button"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Area */}
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
              onToggle={handleVoiceToggle}
              isRecording={isListening}
              visualizerBars={40}
              className="py-2"
            />
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl"
              >
                <p className="text-sm text-white/50 mb-1">Transcript:</p>
                <p className="text-white">{transcript}</p>
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
  );
};

export default CommandInput;