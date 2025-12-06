import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { useState } from "react";

export function AIInputDemo() {
  const [messages, setMessages] = useState([]);
  const [recordings, setRecordings] = useState([]);

  const simulateTextResponse = async (message) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages(prev => [...prev, message]);
  };

  const handleRecordingStop = (duration) => {
    if (duration > 0) {
      setRecordings(prev => [...prev.slice(-4), { duration, timestamp: new Date() }]);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Text Input Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">AI Text Input</h2>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg text-white">
                {msg}
              </div>
            ))}
            <AIInputWithLoading 
              onSubmit={simulateTextResponse}
              loadingDuration={2000}
              placeholder="Describe your expense..."
            />
          </div>
        </div>

        {/* Voice Input Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">AI Voice Input</h2>
          <AIVoiceInput 
            onStart={() => console.log('Recording started')}
            onStop={handleRecordingStop}
          />
          {recordings.length > 0 && (
            <div className="space-y-2">
              {recordings.map((rec, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg text-white text-sm">
                  Recording {i + 1}: {rec.duration}s at {rec.timestamp.toLocaleTimeString()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
