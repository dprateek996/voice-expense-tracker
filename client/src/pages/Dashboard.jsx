import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import LeftSidebar from '@/components/layout/LeftSidebar';
import ChatSidebar from '@/components/layout/ChatSidebar';
import ExpenseList from '@/components/dashboard/ExpenseList.jsx';
import VoiceOrb from '@/components/dashboard/VoiceOrb.jsx';
import useAuthStore from '@/store/authStore';

const Dashboard = () => {
  const token = useAuthStore(state => state.token);
  const [refreshExpenses, setRefreshExpenses] = useState(false);

  // Handler for new expense via voice
  const handleVoiceExpense = async (transcript) => {
    if (!transcript || !token) return;
    try {
      const { addExpense } = await import('@/api/expense.api');
      await addExpense(transcript, token);
      setRefreshExpenses(r => !r);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-primary text-primary-900">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {/* Voice Assistant Orb for expense input (ONLY) */}
          {token ? <VoiceOrb onVoiceExpense={handleVoiceExpense} /> : <div className="text-red-600">No token found. Please login.</div>}
          {/* Expense List, refresh on new expense */}
          {token ? <ExpenseList token={token} refresh={refreshExpenses} /> : null}
          <Outlet />
        </main>

        {/* Chat Sidebar (Toggleable) */}
        <ChatSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
