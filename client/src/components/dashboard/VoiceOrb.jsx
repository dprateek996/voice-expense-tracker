import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import useConversationStore from '@/store/conversationStore';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import VoiceResponsePanel from './VoiceResponsePanel';
import { useState, useEffect } from 'react';
import { playClickSound } from '@/lib/playClickSound';


const VoiceOrb = ({ onVoiceExpense }) => {
  const { isListening, isProcessing, currentTranscript } = useConversationStore();
  const { isSupported, startListening, stopListening } = useSpeechRecognition();
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [voiceResponseType, setVoiceResponseType] = useState('info');

  const handleOrbClick = () => {
    playClickSound();
    if (isListening) {
      stopListening();
    } else if (!isProcessing) {
      startListening();
    }
  };

  // Simulate response after voice input (replace with actual API call)
  const handleVoiceResult = async (transcript) => {
    if (!transcript) return;
    setVoiceResponseType('info');
    setVoiceResponse('Processing your request...');
    try {
      if (onVoiceExpense) {
        const result = await onVoiceExpense(transcript);
        setVoiceResponseType('success');
        setVoiceResponse('Expense added successfully!');
      } else {
        setVoiceResponseType('info');
        setVoiceResponse('Voice command processed.');
      }
    } catch (err) {
      setVoiceResponseType('error');
      setVoiceResponse('Failed to process voice input.');
    }
  };


  // Listen for transcript change and show response when finalized
  useEffect(() => {
    if (!isListening && currentTranscript) {
      handleVoiceResult(currentTranscript);
    }
    // eslint-disable-next-line
  }, [isListening, currentTranscript]);

  const getOrbState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const orbState = getOrbState();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Voice Orb */}
      <div className="relative flex items-center justify-center">
        {/* Animated rings for listening state */}
        {isListening && (
          <>
            <motion.div
              className="absolute w-64 h-64 rounded-full border-2 border-primary-400/30"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute w-64 h-64 rounded-full border-2 border-primary-400/30"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.7,
              }}
            />
            <motion.div
              className="absolute w-64 h-64 rounded-full border-2 border-primary-400/30"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1.4,
              }}
            />
          </>
        )}

        {/* Glow layers */}
        <div
          className={cn(
            'absolute w-56 h-56 rounded-full transition-all duration-500',
            orbState === 'listening' && 'animate-breathe glow-teal-strong',
            orbState === 'processing' && 'glow-teal opacity-50',
            orbState === 'idle' && 'glow-teal opacity-30'
          )}
          style={{
            background: 'radial-gradient(circle, rgba(77, 212, 193, 0.4) 0%, rgba(42, 157, 143, 0.1) 70%, transparent 100%)',
          }}
        />

        {/* Main Orb */}
        <motion.button
          onClick={handleOrbClick}
          disabled={!isSupported || isProcessing}
          className={cn(
            'relative w-48 h-48 rounded-full flex items-center justify-center cursor-pointer',
            'transition-all duration-300 shadow-2xl',
            'bg-gradient-orb',
            orbState === 'listening' && 'scale-110 glow-teal-strong',
            orbState === 'processing' && 'scale-105 opacity-80',
            orbState === 'idle' && 'hover:scale-105 hover:glow-teal',
            !isSupported && 'opacity-50 cursor-not-allowed'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {/* Rotating accent ring */}
          {orbState === 'listening' && (
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-400/60 animate-rotate-ring" />
          )}

          {/* Icon */}
          <div className="text-dark-500">
            {isProcessing ? (
              <Loader2 className="w-16 h-16 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-16 h-16 animate-pulse" />
            ) : (
              <Mic className="w-16 h-16" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Status Text */}
      <div className="mt-8 text-center space-y-2">
        <motion.h2
          className="text-2xl font-bold text-gradient"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {orbState === 'listening' && 'Listening...'}
          {orbState === 'processing' && 'Processing...'}
          {orbState === 'idle' && 'Click to Speak'}
        </motion.h2>

        {/* Live Transcript */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass px-6 py-3 rounded-full max-w-md"
          >
            <p className="text-foreground text-sm">{currentTranscript}</p>
          </motion.div>
        )}

        {/* Helper Text */}
        {!isListening && !isProcessing && (
          <p className="text-muted-foreground text-sm max-w-md">
            Try: "Add 200 rupees for groceries" or "Show my expenses this week"
          </p>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <p className="text-red-400 text-sm">
            ⚠️ Voice recognition not supported in this browser
          </p>
        )}
      </div>

      {/* Voice Response Panel */}
      <VoiceResponsePanel
        response={voiceResponse}
        type={voiceResponseType}
        onClose={() => setVoiceResponse(null)}
      />
    </div>
  );
};

export default VoiceOrb;
