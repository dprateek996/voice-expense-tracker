import { useState, useRef, useEffect } from 'react';

const useSpeechRecognition = ({ onResult, onEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  // Use refs for callbacks to avoid effect re-execution
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
  }, [onResult, onEnd]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started.');
      setIsListening(true);
      setTranscript('');
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

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      if (onResultRef.current) {
        onResultRef.current(currentTranscript);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      setIsListening(false);
      // Only call onEnd if we have a transcript (prevents empty submissions on error/cancel)
      // We need to access the latest transcript state, but inside this closure it might be stale.
      // However, since we are not using continuous mode, the last onresult should have set it.
      // Better approach: pass the final result directly if available, or use a ref to track it.
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []); // Empty dependency array - initialize once

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
      // Manually trigger onEnd with current transcript when stopped by user
      if (onEndRef.current) {
        // We pass the current transcript state. 
        // Note: This might be slightly out of sync if called immediately after a result, 
        // but for user-initiated stop, it's usually fine.
        // A better way is to track the latest transcript in a ref.
        onEndRef.current(transcript);
      }
    }
  };

  // Update the transcript ref whenever state changes so stopListening can access it
  const transcriptRef = useRef('');
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Override stopListening to use the ref
  const stopListeningWithResult = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      if (onEndRef.current) {
        onEndRef.current(transcriptRef.current);
      }
    }
  };

  return { isListening, startListening, stopListening: stopListeningWithResult, transcript };
};

export { useSpeechRecognition };