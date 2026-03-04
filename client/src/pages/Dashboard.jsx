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
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import ExpenseConfirmation from '@/components/ExpenseConfirmation';

const Dashboard = () => {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const voiceStore = useVoiceStore();
  const { open, close, setState } = voiceStore;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcriptToConfirm, setTranscriptToConfirm] = useState('');
  const [parsePreview, setParsePreview] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: () => {},
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

      if (finalTranscript) {
        let previewData = null;
        try {
          previewData = await expenseApi.previewFromVoice(finalTranscript);
          if (previewData?.transcript?.trim()) {
            finalTranscript = previewData.transcript.trim();
          }
        } catch {
          previewData = null;
        }

        close();
        setTranscriptToConfirm(finalTranscript);
        setParsePreview(previewData);
        setState('confirming');
        setDialogOpen(true);
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (!voiceStore.isOpen) {
          playOpenSound();
          open();
          toast.info('Add Expense opened. Press Esc to close.', { duration: 1800 });
        }
      }

      if (event.key === 'Escape') {
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

  const parseAndSaveExpense = async (payload) => {
    const input = typeof payload === 'string' ? { transcript: payload } : payload;
    const {
      transcript: finalTranscript,
      forceSave = false,
      draft = null,
    } = input || {};

    if (!finalTranscript) {
      toast.error('Transcript is required to save expense.');
      return;
    }

    setDialogOpen(false);
    setState('processing');

    try {
      const result = await expenseApi.addFromVoice(finalTranscript, { forceSave, draft });
      const entries = result.expenses || [result.expense];
      const total = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
      setConfirmationData(entries);
      setParsePreview(null);

      toast.success(`Expense saved: ₹${total.toLocaleString('en-IN')}`);
      fetchExpenses();
    } catch (error) {
      if (error.code === 'PARSER_LOW_CONFIDENCE' && error.responseData) {
        const responseData = error.responseData;
        setTranscriptToConfirm(responseData.transcript || finalTranscript);
        setParsePreview({
          transcript: responseData.transcript || finalTranscript,
          draft: responseData.draft || null,
          meta: responseData.meta || { reviewRequired: true },
        });
        setDialogOpen(true);
        setState('confirming');
        return;
      }
      toast.error(error.message || 'Failed to add expense.');
    } finally {
      close();
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <CommandInterface
        isListening={isListening}
        transcript={isListening ? transcript : ''}
        startListening={startListening}
        stopListening={stopListening}
        onTextSubmit={parseAndSaveExpense}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={(nextOpen) => {
          setDialogOpen(nextOpen);
          if (!nextOpen) setParsePreview(null);
        }}
        transcript={transcriptToConfirm}
        parsePreview={parsePreview}
        onConfirm={parseAndSaveExpense}
        onCancel={() => {
          setParsePreview(null);
          close();
        }}
      />

      {confirmationData ? (
        <ExpenseConfirmation expenses={confirmationData} onDismiss={() => setConfirmationData(null)} />
      ) : null}
    </div>
  );
};

export default Dashboard;
