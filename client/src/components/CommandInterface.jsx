import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import VoiceWaveform from './VoiceWaveform';
import { useState, useEffect } from 'react';

const CommandInput = ({ onTextCommand, onMicClick, isListening, isProcessing, transcript }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(transcript);
  }, [transcript]);

  const handleSubmit = (e) => { e.preventDefault(); if (text.trim()) { onTextCommand(text.trim()); setText(''); } };
  const placeholder = isListening ? "Listening..." : "Log an expense or tap the mic";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} disabled={isProcessing} className="h-14 pl-5 pr-28 text-lg rounded-full bg-muted border-border focus-visible:ring-primary focus-visible:ring-2" />
        <div className="absolute right-4 flex items-center gap-2">
          {text && !isListening && (<Button type="submit" size="icon" className="w-10 h-10 rounded-full bg-primary" disabled={isProcessing}><Send className="h-5 w-5" /></Button>)}
          <Button type="button" size="icon" onClick={onMicClick} className={`w-10 h-10 rounded-full ${isListening ? 'bg-destructive' : 'bg-primary'}`} disabled={isProcessing}><Mic className="h-5 w-5" /></Button>
        </div>
      </div>
    </form>
  );
};

const CommandInterface = ({ isOpen, uiState, onClose, onTextCommand, isListening, startListening, stopListening, transcript }) => {
  const isProcessing = uiState === 'processing';
  const getHelperText = () => { switch (uiState) { case 'processing': return 'Adding to your ledger...'; case 'listening': return null; default: return 'What did you spend on?'; } };
  const toggleListening = isListening ? stopListening : startListening;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col justify-end bg-background/90 backdrop-blur-lg p-4" onClick={onClose}>
          <motion.div className="w-full" onClick={(e) => e.stopPropagation()} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
            <div className="flex-1 flex flex-col items-center justify-center text-center pb-8 min-h-[12rem]">
              {isListening ? <VoiceWaveform /> : ( <> {isProcessing && <Loader2 className="animate-spin h-8 w-8 text-muted-foreground mb-4" />} <p className="text-xl font-medium text-muted-foreground">{getHelperText()}</p> </> )}
            </div>
            <CommandInput onTextCommand={onTextCommand} onMicClick={toggleListening} isListening={isListening} isProcessing={isProcessing} transcript={transcript} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandInterface;  