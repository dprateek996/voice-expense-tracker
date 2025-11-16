import { useState, useRef } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { playStartSound, playStopSound } from "@/lib/audioUtils";
import useVoiceStore from "@/store/voiceStore";

const CommandInput = ({
  onTextCommand,
  onVoiceCommand,
  isProcessing,
  isListening,
  startListening,
  stopListening
}) => {

  const [text, setText] = useState("");
  const voiceStore = useVoiceStore();
  const lastInterimRef = useRef("");

  // -------------------------------
  // Handle speech recognition result
  // -------------------------------
  const handleResult = ({ finalTranscript, interimTranscript }) => {
    if (interimTranscript) {
      lastInterimRef.current = interimTranscript;
      setText(interimTranscript);
    }

    if (finalTranscript) {
      playStopSound();
      stopListening();
      onVoiceCommand(finalTranscript.trim());
    }
  };

  // -------------------------------
  // Manual invocation from parent
  // -------------------------------
  const handleEnd = (finalTranscript) => {
    const final = finalTranscript || lastInterimRef.current;
    if (final?.trim()) {
      onVoiceCommand(final.trim());
    }
  };

  // -------------------------------
  // Text submission
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onTextCommand(text.trim());
    setText("");
    voiceStore.close();
  };

  // -------------------------------
  // Handle mic toggle
  // -------------------------------
  const toggleListening = () => {
    if (isProcessing) return;

    if (isListening) {
      playStopSound();
      stopListening();
    } else {
      playStartSound();
      setText("");
      startListening();
      voiceStore.setState("listening");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2 sm:gap-3">

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isListening
              ? "Listening... Speak clearly!"
              : "Type or say: '500 for groceries'"
          }
          disabled={isProcessing}
          className="flex-1 h-12 sm:h-14 pl-4 sm:pl-5 pr-20 sm:pr-28 text-base sm:text-lg rounded-full bg-muted border-border 
                     focus-visible:ring-primary focus-visible:ring-2"
        />

        <div className="flex items-center gap-1 sm:gap-2">

          {text && !isListening && (
            <Button
              type="submit"
              size="icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90"
              disabled={isProcessing}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            onClick={toggleListening}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors ${
              isListening ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            }`}
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 px-4">
        {isListening ? "Tap mic again to stop" : "Voice or text - your choice!"}
      </p>
    </form>
  );
};

export default CommandInput;