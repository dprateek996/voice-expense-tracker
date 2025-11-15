import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import VoiceOrb from '@/components/VoiceOrb';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { addExpenseFromVoice, getAllExpenses } from '@/api/expense.api';

// A utility function to clean up common speech recognition errors
const preprocessTranscript = (text) => {
  let correctedText = text;
  correctedText = correctedText.replace(/(\d{2,})4\b/g, '$1 for');
  correctedText = correctedText.replace(/(\d{2,})2\b/g, '$1 to');
  return correctedText;
};

// Production-Grade Stats Calculation Engine
const calculateStats = (expenses) => {
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const today = new Date();
        return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    });

    if (currentMonthExpenses.length === 0) {
        return [
            { name: "Total Spent (Month)", value: "₹0.00" },
            { name: "Avg. Daily Spend", value: "₹0.00" },
            { name: "Most Spent On", value: "N/A" },
            { name: "Transactions", value: "0" }
        ];
    }

    const totalSpend = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transactionCount = currentMonthExpenses.length;

    const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const topCategory = Object.keys(spendingByCategory).reduce((a, b) => spendingByCategory[a] > spendingByCategory[b] ? a : b, 'N/A');

    const uniqueDaysWithExpenses = new Set(currentMonthExpenses.map(e => new Date(e.date).getDate())).size;
    const avgDailySpend = uniqueDaysWithExpenses > 0 ? totalSpend / uniqueDaysWithExpenses : 0;

    return [
        { name: "Total Spent (Month)", value: `₹${totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { name: "Avg. Daily Spend", value: `₹${avgDailySpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { name: "Most Spent On", value: topCategory },
        { name: "Transactions", value: transactionCount.toString() }
    ];
};

const DashboardHome = () => {
  const [orbState, setOrbState] = useState('idle');
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(calculateStats([]));

  const fetchExpenses = async () => {
    try {
      const expenseData = await getAllExpenses();
      setExpenses(expenseData);
      setStats(calculateStats(expenseData));
    } catch (error) {
      toast.error("Failed to fetch expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOrbClick = () => {
    if (isListening) {
      stopListening();
    } else {
      if (orbState === 'idle') {
        startListening();
      }
    }
  };

  const processExpense = async (finalTranscript) => {
    setOrbState('processing');
    try {
      const result = await addExpenseFromVoice(finalTranscript);
      if (result.expense && !result.expense.is_unclear) {
        toast.success(`Expense added: ${result.expense.description} (₹${result.expense.amount})`);
        setOrbState('success');
        fetchExpenses();
      } else {
        toast.error("Sorry, I couldn't understand that. Please try rephrasing.");
        setOrbState('error');
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
      setOrbState('error'); // THIS IS THE CRITICAL FIX
    } finally {
      setTimeout(() => setOrbState('idle'), 2500);
    }
  };

  useEffect(() => {
    if (isListening) {
      setOrbState('listening');
    } else {
      if (orbState === 'listening') {
        setOrbState('idle');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  useEffect(() => {
    if (transcript) {
      const correctedTranscript = preprocessTranscript(transcript);
      toast.info(`Heard: "${correctedTranscript}"`, {
        action: { label: 'Confirm', onClick: () => processExpense(correctedTranscript) },
        onDismiss: () => resetTranscript(),
        onAutoClose: () => resetTranscript(),
        duration: 10000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border border-border">
                <div className="flex flex-row items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                </div>
                <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground">
              <tr>
                <th className="p-2">DESCRIPTION</th>
                <th className="p-2">CATEGORY</th>
                <th className="p-2">DATE</th>
                <th className="p-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? expenses.map(expense => (
                <tr key={expense.id} className="border-b border-border last-border-0">
                  <td className="p-2 font-medium">{expense.description}</td>
                  <td className="p-2 text-muted-foreground">{expense.category}</td>
                  <td className="p-2 text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-2 text-right font-mono">₹{expense.amount.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-muted-foreground">Click the orb to record your first expense!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="fixed bottom-10 right-10">
        <VoiceOrb state={orbState} onClick={handleOrbClick} />
      </div>
    </main>
  );
};

export default DashboardHome;