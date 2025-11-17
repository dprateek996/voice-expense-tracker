import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import VoiceOrb from '@/components/VoiceOrb';
import CommandInterface from '@/components/CommandInterface';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { expenseApi } from '@/api/expense.api';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';
import { useState } from 'react';
import { playOpenSound } from '@/lib/audioUtils';
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const Dashboard = () => {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const voiceStore = useVoiceStore();
  const { open, close, setState, uiState } = voiceStore;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcriptToConfirm, setTranscriptToConfirm] = useState("");

  // 🎤 GLOBAL SPEECH RECOGNITION
  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onResult: () => {},
    onEnd: (transcript) => {
      if (transcript) handleVoiceCommand(transcript);
    },
  });

  // ✏️ TEXT INPUT HANDLER
  const handleTextCommand = (commandText) => {
    parseAndSaveExpense(commandText, 'text');
  };

  // 🎤 VOICE INPUT — CONFIRMATION POPUP
  const handleVoiceCommand = (spokenTranscript) => {
    close();
    setTranscriptToConfirm(spokenTranscript);
    setState('confirming');
    setDialogOpen(true);
  };

  // 🌐 PARSE + SAVE
  const parseAndSaveExpense = async (finalTranscript, source = 'voice') => {
    setDialogOpen(false);
    setState('processing');
    try {
      const result = await expenseApi.addFromVoice(finalTranscript);
      toast.success(`Expense added: ${result.expense.description} (₹${result.expense.amount})`);
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Could not save expense.");
    } finally {
      close();
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <TopNav />

        <main className="flex flex-col flex-1 gap-4 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* COMMAND INTERFACE RECEIVES THE REQUIRED PROPS */}
      <CommandInterface
        onTextCommand={handleTextCommand}
        onVoiceCommand={handleVoiceCommand}
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transcript={transcriptToConfirm}
        onConfirm={parseAndSaveExpense}
        onCancel={() => close()}
      />
    </div>
  );
};

export default Dashboard;