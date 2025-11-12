import { useCallback, useRef, useEffect } from 'react';
import useConversationStore from '@/store/conversationStore';

const useSpeechSynthesis = () => {
  const synthRef = useRef(null);
  const { voiceResponseEnabled } = useConversationStore();

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      console.error('Speech Synthesis not supported in this browser');
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current || !voiceResponseEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice options
    utterance.lang = options.lang || 'en-IN';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Try to use a female voice (more pleasant for notifications)
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started');
    };

    utterance.onend = () => {
      console.log('Speech ended');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    synthRef.current.speak(utterance);
  }, [voiceResponseEnabled]);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.resume();
    }
  }, []);

  return {
    isSupported: 'speechSynthesis' in window,
    speak,
    cancel,
    pause,
    resume,
    isSpeaking: synthRef.current?.speaking || false,
  };
};

export default useSpeechSynthesis;
