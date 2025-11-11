// src/pages/Dashboard.jsx
import { useState } from 'react';
import ExpenseInput from '@/components/dashboard/ExpenseInput';
import ExpenseList from '@/components/dashboard/ExpenseList';
import ExpenseStats from '@/components/dashboard/ExpenseStats';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const handleExpenseAdded = () => {
    // Trigger refresh of expense list
    setRefreshKey(prev => prev + 1);
  };

  const handleExpensesLoaded = (loadedExpenses) => {
    setExpenses(loadedExpenses);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Voice Expense Tracker</h1>
          <p className="text-gray-400 mt-1">Track your expenses with voice or text</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <ExpenseStats expenses={expenses} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <ExpenseInput onExpenseAdded={handleExpenseAdded} />
          </div>

          {/* Right Column - List */}
          <div className="lg:col-span-2">
            <ExpenseList 
              refreshTrigger={refreshKey} 
              onExpensesLoaded={handleExpensesLoaded}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
