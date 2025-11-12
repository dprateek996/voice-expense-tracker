import { useEffect, useRef, useCallback } from 'react';
import useConversationStore from '@/store/conversationStore';

const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const { 
    setIsListening, 
    setCurrentTranscript,
    addUserMessage 
  } = useConversationStore();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // English (India) for better rupee recognition
    recognition.maxAlternatives = 3;

    // Event handlers
    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
      setCurrentTranscript('');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      setCurrentTranscript(transcript);

      // If this is a final result
      if (event.results[current].isFinal) {
        console.log('Final transcript:', transcript);
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setCurrentTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [setIsListening, setCurrentTranscript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !useConversationStore.getState().isListening) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && useConversationStore.getState().isListening) {
      recognitionRef.current.stop();
      // Do not route transcript to chat here; handled by VoiceOrb for expense
    }
  }, []);

  const cancelListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setCurrentTranscript('');
    }
  }, [setCurrentTranscript]);

  return {
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    startListening,
    stopListening,
    cancelListening,
  };
};

export default useSpeechRecognition;
