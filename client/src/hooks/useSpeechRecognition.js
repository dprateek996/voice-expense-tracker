import { useState, useRef, useEffect } from 'react';

const useSpeechRecognition = ({ onResult, onEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false; // Stop after one utterance
    recognition.interimResults = true; // Allow interim results
    recognition.lang = 'en-US'; // Set language (adjust if needed)

    recognition.onstart = () => {
      console.log('Speech recognition started.');
      setIsListening(true);
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update final transcript
      finalTranscriptRef.current = finalTranscript;
      setTranscript(finalTranscript || interimTranscript);

      // Call onResult with the current transcript (interim or final)
      onResult(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      setIsListening(false);
      // Call onEnd with the final transcript
      onEnd(finalTranscriptRef.current);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      // Call onEnd with empty string on error
      onEnd('');
    };

    // Optional: Add a timeout to prevent hanging (e.g., 10 seconds)
    const timeoutId = setTimeout(() => {
      if (isListening) {
        console.log('Speech recognition timed out.');
        stopListening();
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onResult, onEnd]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return { isListening, startListening, stopListening, transcript };
};

export { useSpeechRecognition };