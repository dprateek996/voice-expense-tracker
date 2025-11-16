import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = ({ onResult, onEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      finalTranscriptRef.current = '';
      setIsListening(true);
    };

    // The key change: when listening ends, call the onEnd callback with the final result.
    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) {
        onEnd(finalTranscriptRef.current);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      finalTranscriptRef.current = ''; // Reset final transcript on each new result event
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptChunk + ' ';
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      if (onResult) {
        onResult({ 
          finalTranscript: finalTranscriptRef.current.trim(), 
          interimTranscript 
        });
      }
    };

    recognitionRef.current = recognition;
    return () => recognitionRef.current?.abort(); // Use abort for a clean shutdown
  }, [onResult, onEnd]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, startListening, stopListening };
};