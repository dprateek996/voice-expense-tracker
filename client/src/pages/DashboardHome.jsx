import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Wallet, ReceiptText, Tag, CalendarClock } from "lucide-react";
import VoiceOrb from "@/components/VoiceOrb";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { addExpenseFromVoice, getAllExpenses } from "@/api/expense.api";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { motion } from "framer-motion";

const calculateStats = (expenses) => {
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const today = new Date();
    return (
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  });

  const baseStats = [
    {
      name: "Total Spent (Month)",
      value: "₹0.00",
      icon: <Wallet className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Avg. Daily Spend",
      value: "₹0.00",
      icon: <CalendarClock className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Most Spent On",
      value: "N/A",
      icon: <Tag className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Transactions",
      value: "0",
      icon: <ReceiptText className="h-5 w-5 text-gray-400" />
    }
  ];

  if (currentMonthExpenses.length === 0) return baseStats;

  const totalSpend = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const transactionCount = currentMonthExpenses.length;

  const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategory = Object.keys(spendingByCategory).reduce(
    (a, b) => (spendingByCategory[a] > spendingByCategory[b] ? a : b),
    "N/A"
  );

  const uniqueDaysWithExpenses = new Set(
    currentMonthExpenses.map((e) => new Date(e.date).getDate())
  ).size;

  const avgDailySpend =
    uniqueDaysWithExpenses > 0 ? totalSpend / uniqueDaysWithExpenses : 0;

  return [
    {
      name: "Total Spent (Month)",
      value: `₹${totalSpend.toLocaleString("en-IN", {
        minimumFractionDigits: 2
      })}`,
      icon: <Wallet className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Avg. Daily Spend",
      value: `₹${avgDailySpend.toLocaleString("en-IN", {
        minimumFractionDigits: 2
      })}`,
      icon: <CalendarClock className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Most Spent On",
      value: topCategory,
      icon: <Tag className="h-5 w-5 text-gray-400" />
    },
    {
      name: "Transactions",
      value: transactionCount.toString(),
      icon: <ReceiptText className="h-5 w-5 text-gray-400" />
    }
  ];
};

const DashboardHome = () => {
  const { isListening, transcript, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();

  const [orbState, setOrbState] = useState("idle");
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(calculateStats([]));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refinementData, setRefinementData] = useState(null);

  const fetchExpenses = async () => {
    try {
      const d = await getAllExpenses();
      setExpenses(d);
      setStats(calculateStats(d));
    } catch (e) {
      toast.error("Failed to fetch expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOrbClick = () => {
    if (isListening) stopListening();
    else if (orbState === "idle") startListening();
  };

  const parseAndSaveExpense = async (finalTranscript) => {
    setDialogOpen(false);
    setOrbState("processing");

    try {
      const result = await addExpenseFromVoice(finalTranscript);
      toast.success(
        `Expense added: ${result.expense.description} (₹${result.expense.amount})`
      );
      setOrbState("success");
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Sorry, I couldn't understand that expense.");
      setOrbState("error");
    } finally {
      setTimeout(() => setOrbState("idle"), 2500);
    }
  };

  const handleVoiceInput = async (spokenTranscript) => {
    toast.info("Analyzing your command...");

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: spokenTranscript })
      });

      if (!response.ok) throw new Error("Failed to connect to AI engine.");

      const data = await response.json();
      setRefinementData(data);
      setDialogOpen(true);
    } catch (error) {
      toast.error(error.message);
      setOrbState("error");
      setTimeout(() => setOrbState("idle"), 2500);
    }

    resetTranscript();
  };

  useEffect(() => {
    if (isListening) setOrbState("listening");
    else if (orbState === "listening") setOrbState("idle");
  }, [isListening]);

  useEffect(() => {
    if (transcript) handleVoiceInput(transcript);
  }, [transcript]);

  return (
    <div className="min-h-screen bg-[#0E0F11]">
      <div
        className="
          max-w-6xl 
          mx-auto 
          pt-8 
          pb-40 
          px-4 
          lg:ml-20 
          md:ml-16 
          ml-4 
          space-y-10
        "
      >

        {/* WELCOME HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-semibold text-white">
            Welcome back, Prateek 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Track your spending effortlessly with your voice.
          </p>
        </motion.div>

        {/* STATS GRID */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03 }}
              className="bg-[#141518] p-5 rounded-xl border border-[#1F2023] shadow-lg"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">{stat.name}</p>
                {stat.icon}
              </div>
              <p className="text-3xl font-semibold text-white mt-3">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* RECENT EXPENSES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141518] p-5 rounded-xl border border-[#1F2023] shadow-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Expenses
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr className="border-b border-[#1F2023]">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="text-gray-200">
                {expenses.length > 0 ? (
                  expenses.map((e) => (
                    <motion.tr
                      key={e.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-[#1F2023] hover:bg-[#1A1C1F] transition"
                    >
                      <td className="p-3">{e.description}</td>
                      <td className="p-3 text-gray-400">{e.category}</td>
                      <td className="p-3 text-gray-400">
                        {new Date(e.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right font-mono">
                        ₹{e.amount.toFixed(2)}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No transactions yet. Tap the orb to add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FLOATING VOICE ORB */}
        <motion.div
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140 }}
        >
          <div className="bg-[#1A1C1F]/80 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-white/10">
            <VoiceOrb state={orbState} onClick={handleOrbClick} />
          </div>
        </motion.div>

        <ConfirmationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          refinementData={refinementData}
          onConfirm={parseAndSaveExpense}
          onCancel={() => setDialogOpen(false)}
        />

      </div>
    </div>
  );
};

export default DashboardHome;