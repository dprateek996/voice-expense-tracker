import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Mic, MicOff, Send, X, Loader2 } from 'lucide-react';
import useVoiceStore from '@/store/voiceStore';
import { useEffect, useState, useRef } from 'react';
import { playStartSound, playStopSound } from "@/lib/audioUtils";

const CommandInterface = ({
  isListening,
  transcript,
  startListening,
  stopListening,
  onTextSubmit
}) => {
  const { isOpen, uiState, close, setState } = useVoiceStore();
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    if (isListening) setState("listening");
    else if (uiState === "listening") setState("idle");
  }, [isListening, setState, uiState]);

  useEffect(() => {
    if (isListening && transcript) {
      setText(transcript);
      lastTranscriptRef.current = transcript;
    }
  }, [isListening, transcript]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setText('');
      lastTranscriptRef.current = '';
    }
  }, [isOpen]);

  const isProcessing = uiState === "refining" || uiState === "processing";

  const handleSubmit = async () => {
    const inputText = text.trim();
    if (!inputText || isProcessing) return;

    setState('processing');
    await onTextSubmit?.(inputText, 'text');
    setText('');
    close();
  };

  const handleMicClick = () => {
    if (isProcessing) return;

    if (isListening) {
      playStopSound();
      stopListening();
    } else {
      playStartSound();
      setText('');
      startListening();
      setState("listening");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <Motion.div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-sm font-medium text-foreground">
                      {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Add Expense'}
                    </span>
                  </div>
                  <button
                    onClick={close}
                    className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {isListening && (
                  <div className="px-4 py-3 bg-primary/5 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-primary rounded-full animate-[wave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-4 bg-primary rounded-full animate-[wave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }} />
                        <span className="w-1 h-5 bg-primary rounded-full animate-[wave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                        <span className="w-1 h-4 bg-primary rounded-full animate-[wave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }} />
                        <span className="w-1 h-3 bg-primary rounded-full animate-[wave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
                      </div>
                      <p className="text-sm text-foreground">
                        {transcript || 'Speak your expense...'}
                      </p>
                    </div>
                    <style>{`
                      @keyframes wave {
                        0%, 100% { transform: scaleY(1); }
                        50% { transform: scaleY(1.8); }
                      }
                    `}</style>
                  </div>
                )}
                <div className="flex items-end gap-2 p-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., ₹500 for groceries, ₹200 for coffee..."
                      disabled={isProcessing}
                      rows={1}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all disabled:opacity-50 text-sm"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleMicClick}
                    disabled={isProcessing}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isListening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || isProcessing}
                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Type or speak your expense • Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">Enter</kbd> to submit • <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">Esc</kbd> to close
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandInterface;
