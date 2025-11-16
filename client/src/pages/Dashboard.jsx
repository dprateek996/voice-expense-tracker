import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import VoiceOrb from '@/components/VoiceOrb';
import CommandInterface from '@/components/CommandInterface';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { addExpenseFromVoice } from '@/api/expense.api';
import useExpenseStore from '@/store/expenseStore';
import { useState, useEffect, useRef } from 'react';
import { playOpenSound, playStartSound, playStopSound } from '@/lib/audioUtils';

const Dashboard = () => {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);

  // --- ALL STATE NOW LIVES IN ONE PLACE ---
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uiState, setUiState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef(null);

  // --- DIRECT SPEECH RECOGNITION CONTROL (NO MORE HOOKS) ---
  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setUiState('listening');
    recognition.onend = () => setUiState('idle');
    recognition.onerror = (e) => console.error("Speech Recognition Error:", e);

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(interim); // Live preview
      if (final) {
        handleVoiceCommand(final.trim());
      }
    };
    
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && uiState !== 'listening') {
      playStartSound();
      setTranscript('');
      recognitionRef.current.start();
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && uiState === 'listening') {
      playStopSound();
      recognitionRef.current.stop();
    }
  };
  
  // --- UNIFIED LOGIC HANDLERS ---
  const openCommandInterface = () => { playOpenSound(); setIsCommandOpen(true); };
  const closeAllInterfaces = () => { stopListening(); setIsCommandOpen(false); setDialogOpen(false); setUiState('idle'); };

  const handleTextCommand = (commandText) => { closeAllInterfaces(); parseAndSaveExpense(commandText, 'text'); };
  const handleVoiceCommand = (spokenTranscript) => { closeAllInterfaces(); setDialogOpen(true); setTranscript(spokenTranscript); };
  
  const parseAndSaveExpense = async (finalTranscript, source = 'voice') => {
    closeAllInterfaces();
    setUiState('processing');
    try {
      const result = await addExpenseFromVoice(finalTranscript, source);
      toast.success(`Expense added: ${result.expense.description} (₹${result.expense.amount})`);
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Could not save expense.");
    } finally {
      setTimeout(() => setUiState('idle'), 2000);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col"><main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8"><Outlet /></main></div>
      <div className="fixed bottom-10 right-10 z-40"><VoiceOrb onClick={openCommandInterface} state={uiState} /></div>
      <CommandInterface isOpen={isCommandOpen} uiState={uiState} onClose={closeAllInterfaces} onTextCommand={handleTextCommand} isListening={uiState === 'listening'} startListening={startListening} stopListening={stopListening} transcript={transcript} />
      <ConfirmationDialog open={dialogOpen} onOpenChange={setDialogOpen} transcript={transcript} onConfirm={parseAndSaveExpense} onCancel={closeAllInterfaces} />
    </div>
  );
};

export default Dashboard;