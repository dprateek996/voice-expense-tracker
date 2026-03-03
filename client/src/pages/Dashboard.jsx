import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import CommandInterface from '@/components/CommandInterface';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { expenseApi } from '@/api/expense.api';
import useExpenseStore from '@/store/expenseStore';
import useVoiceStore from '@/store/voiceStore';
import { useState, useEffect } from 'react';
import { playOpenSound } from '@/lib/audioUtils';
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import ExpenseConfirmation from '@/components/ExpenseConfirmation';

const Dashboard = () => {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const voiceStore = useVoiceStore();
  const { open, close, setState } = voiceStore;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcriptToConfirm, setTranscriptToConfirm] = useState("");
  const [confirmationData, setConfirmationData] = useState(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: () => { },
    onError: ({ message }) => {
      toast.error(message || 'Voice capture failed. Please try again.');
      close();
    },
    onEnd: async ({ transcript: browserTranscript, audioBlob }) => {
      const fallbackTranscript = String(browserTranscript || '').trim();
      if (!audioBlob && !fallbackTranscript) return;

      let finalTranscript = fallbackTranscript;
      if (audioBlob) {
        try {
          setState('processing');
          const sttResult = await expenseApi.transcribeAudio(audioBlob, fallbackTranscript, 'unknown');
          if (sttResult?.transcript?.trim()) {
            finalTranscript = sttResult.transcript.trim();
          }
        } catch {
          if (!fallbackTranscript) {
            toast.error('Could not transcribe voice. Please try again.');
            close();
            return;
          }
        }
      }

      if (finalTranscript) handleVoiceCommand(finalTranscript);
    },
  });

  const handleVoiceCommand = (spokenTranscript) => {
    close();
    setTranscriptToConfirm(spokenTranscript);
    setState('confirming');
    setDialogOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!voiceStore.isOpen) {
          playOpenSound();
          open();
          toast.info('Add Expense opened - Press Esc to close', {
            duration: 2000,
            icon: '⌨️',
          });
        }
      }

      if (e.key === 'Escape') {
        if (voiceStore.isOpen) {
          close();
          if (isListening) stopListening();
        }
        if (dialogOpen) setDialogOpen(false);
        if (confirmationData) setConfirmationData(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceStore.isOpen, open, close, dialogOpen, confirmationData, isListening, stopListening]);

  const parseAndSaveExpense = async (finalTranscript) => {
    setDialogOpen(false);
    setState('processing');
    try {
      const result = await expenseApi.addFromVoice(finalTranscript);
      const count = result.expenses ? result.expenses.length : 1;
      const firstDesc = result.expenses ? result.expenses[0].description : result.expense.description;
      const totalAmount = result.expenses
        ? result.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        : (result.expense.amount || 0);

      setConfirmationData(result.expenses || [result.expense]);

      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white animate-[scale-in_0.3s_ease-out]"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-base">Expense Added! ✨</p>
            <p className="text-sm text-white/90 mt-0.5">
              ₹{totalAmount.toFixed(2)} • {count > 1 ? `${count} items` : firstDesc}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: '2px solid rgba(255,255,255,0.2)',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          },
          className: 'animate-[slide-in-right_0.3s_ease-out]',
        }
      );

      fetchExpenses();
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-base">Failed to Add Expense</p>
            <p className="text-sm text-white/90 mt-0.5">{error.message || "Please try again"}</p>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: '2px solid rgba(255,255,255,0.2)',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.5)',
          },
        }
      );
    } finally {
      close();
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <TopNav />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <CommandInterface
        isListening={isListening}
        transcript={isListening ? transcript : ""}
        startListening={startListening}
        stopListening={stopListening}
        onTextSubmit={parseAndSaveExpense}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transcript={transcriptToConfirm}
        onConfirm={parseAndSaveExpense}
        onCancel={() => close()}
      />

      {confirmationData && (
        <ExpenseConfirmation
          expenses={confirmationData}
          onDismiss={() => setConfirmationData(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
