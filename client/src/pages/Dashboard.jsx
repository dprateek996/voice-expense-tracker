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
import { useState, useEffect } from 'react';
import { playOpenSound } from '@/lib/audioUtils';
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import ExpenseConfirmation from '@/components/ExpenseConfirmation';

const Dashboard = () => {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const voiceStore = useVoiceStore();
  const { open, close, setState, uiState } = voiceStore;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcriptToConfirm, setTranscriptToConfirm] = useState("");
  const [confirmationData, setConfirmationData] = useState(null);

  // 🎤 GLOBAL SPEECH RECOGNITION
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: () => { },
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

  // ⌨️ KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open add expense
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
      
      // Esc to close
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

  // 🌐 PARSE + SAVE
  const parseAndSaveExpense = async (finalTranscript, source = 'voice') => {
    setDialogOpen(false);
    setState('processing');
    try {
      const result = await expenseApi.addFromVoice(finalTranscript);
      const count = result.expenses ? result.expenses.length : 1;
      const firstDesc = result.expenses ? result.expenses[0].description : result.expense.description;
      const totalAmount = result.expenses
        ? result.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        : (result.expense.amount || 0);

      // Show confirmation card instead of just toast
      setConfirmationData(result.expenses || [result.expense]);

      // Show enhanced success toast with animation
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
      // Enhanced error toast
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
    <div className="flex min-h-screen w-full bg-black relative">
      {/* Gradient Background Overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.08] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sky-500/[0.08] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <Sidebar />

      <div className="flex flex-col flex-1 relative z-10">
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