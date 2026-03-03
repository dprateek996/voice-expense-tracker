import { useState, useRef, useEffect } from 'react';

const PICKED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
];

const getSupportedMimeType = () => {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') return null;
  const match = PICKED_MIME_TYPES.find((type) => window.MediaRecorder.isTypeSupported(type));
  return match || null;
};

const useSpeechRecognition = ({ onResult, onEnd, onError } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAudioBlob, setLastAudioBlob] = useState(null);
  const [lastError, setLastError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const transcriptRef = useRef('');

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  }, [onResult, onEnd, onError]);

  const emitError = (message, code = 'VOICE_ERROR') => {
    const payload = { message, code };
    setLastError(payload);
    onErrorRef.current?.(payload);
  };

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    const supportsSpeechRecognition = (
      typeof window !== 'undefined'
      && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
    setIsSupported(supportsSpeechRecognition);

    if (!supportsSpeechRecognition) {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      transcriptRef.current = '';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = (finalTranscript || interimTranscript).trim();
      setTranscript(currentTranscript);
      transcriptRef.current = currentTranscript;
      onResultRef.current?.(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startRecording = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      emitError('Audio capture is not supported in this browser.', 'VOICE_UNSUPPORTED');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
      return true;
    } catch {
      mediaRecorderRef.current = null;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      emitError('Microphone permission denied or unavailable.', 'MIC_PERMISSION_DENIED');
      return false;
    }
  };

  const stopRecording = () => new Promise((resolve) => {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;

    const cleanup = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
    };

    if (!recorder || recorder.state === 'inactive') {
      cleanup();
      resolve(null);
      return;
    }

    recorder.onstop = () => {
      const blob = audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        : null;

      audioChunksRef.current = [];
      cleanup();
      resolve(blob);
    };

    recorder.stop();
  });

  const startListening = async () => {
    if (isListening) return;

    setLastError(null);
    setLastAudioBlob(null);
    const recordingStarted = await startRecording();
    const hasRecognition = Boolean(recognitionRef.current);

    setTranscript('');
    transcriptRef.current = '';

    if (hasRecognition) {
      try {
        recognitionRef.current.start();
      } catch {
        if (!recordingStarted) {
          emitError('Unable to start voice recognition.', 'RECOGNITION_START_FAILED');
        }
      }
      return;
    }

    if (recordingStarted) {
      setIsListening(true);
      return;
    }

    emitError('Voice recognition is not supported on this browser.', 'VOICE_UNSUPPORTED');
  };

  const stopListening = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      setIsListening(false);
    }

    const audioBlob = await stopRecording();
    if (audioBlob) {
      setLastAudioBlob(audioBlob);
    }

    onEndRef.current?.({
      transcript: transcriptRef.current,
      audioBlob,
      mimeType: audioBlob?.type || null,
    });
  };

  return {
    isListening,
    isSupported,
    transcript,
    lastAudioBlob,
    lastError,
    startListening,
    stopListening,
  };
};

export { useSpeechRecognition };
export default useSpeechRecognition;
