import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import VoiceVisualizer from "@/components/VoiceOrb";

const useMockSpeechRecognition = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      const transcripts = ["200 for pizza", "500 ka petrol", "invalid input"];
      const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];
      onTranscript(randomTranscript);
      setIsListening(false);
    }, 3000);
  };

  return { isListening, startListening };
};

export default function DashboardHome() {
  const [orbState, setOrbState] = useState("idle");
  const [feedbackText, setFeedbackText] = useState("");

  const handleTranscript = (transcript) => {
    setOrbState("processing");

    setTimeout(() => {
      if (transcript === "invalid input") {
        setOrbState("error");
        setFeedbackText("Sorry, I couldn't understand that. Try again.");
        toast.error("Failed to parse expense.");
      } else {
        setOrbState("success");
        setFeedbackText(`Logged: ${transcript}`);
      }
    }, 1500);
  };
  
  const { startListening } = useMockSpeechRecognition({ onTranscript: handleTranscript });

  useEffect(() => {
    let timeout;
    if (orbState === "success" || orbState === "error") {
      timeout = setTimeout(() => {
        setOrbState("idle");
        setFeedbackText("");
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [orbState]);

  const handleClick = () => {
    if (orbState === "idle") {
      setOrbState("listening");
      startListening();
    }
  };

  const getPromptText = () => {
    switch (orbState) {
      case "listening":
        return "Listening...";
      case "processing":
        return "Thinking...";
      default:
        return "Tap the line to speak your expense";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full pt-10">
      <Card className="w-full max-w-2xl bg-card border-border shadow-lg">
        <CardContent className="flex flex-col items-center p-8 space-y-4">
          <VoiceVisualizer state={orbState} onClick={handleClick} />
          <h2 className="text-2xl font-semibold text-center">{getPromptText()}</h2>
          <div className="h-6">
            <AnimatePresence>
              {feedbackText && (
                <motion.p
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-sm ${orbState === 'error' ? 'text-red-400' : 'text-muted-foreground'}`}
                >
                  {feedbackText}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}