// src/components/dashboard/VoiceInput.jsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';

const VoiceInput = ({ onTranscriptChange, disabled = false }) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Update parent component with transcript
  useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-900/20 p-3 rounded-md">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={handleToggleListening}
          disabled={disabled}
          variant={isListening ? "destructive" : "default"}
          className={`
            ${isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-purple-600 hover:bg-purple-700'
            }
            text-white
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Voice Input
            </>
          )}
        </Button>

        {isListening && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-red-500 animate-pulse rounded-full" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-red-500 animate-pulse rounded-full" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-4 bg-red-500 animate-pulse rounded-full" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>Listening...</span>
          </div>
        )}
      </div>

      {/* Show interim transcript while speaking */}
      {interimTranscript && (
        <div className="text-sm text-gray-400 italic bg-gray-700/50 p-2 rounded-md">
          {interimTranscript}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
