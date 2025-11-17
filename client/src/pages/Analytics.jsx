import { useEffect, useState } from 'react';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';

const Analytics = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();
      } catch (error) {
        console.error('Failed to load analytics:', error);
        toast.error("Failed to load analytics data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl text-white">Loading analytics...</div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Expense Analytics
        </h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold mb-2 text-white">No expenses yet</h2>
          <p className="text-gray-400">Add some expenses to see your analytics!</p>
        </div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = totalSpent / expenses.length;

  // Category icons mapping
  const CATEGORY_ICONS = {
    groceries: '🛒',
    dining: '🍽️',
    food: '🛒',
    transport: '🚗',
    shopping: '🛍️',
    utilities: '⚡',
    bills: '⚡',
    health: '🏥',
    medicine: '🏥',
    entertainment: '🎭',
    travel: '✈️',
    education: '📚',
    work: '💼',
    'personal care': '💅',
    personalcare: '💅',
    fuel: '⛽',
    other: '📦'
  };

  // Get top 5 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        Expense Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-white font-semibold">Total Spent</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">₹{totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-white font-semibold">Total Entries</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{expenses.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 hover:border hover:border-amber-400">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📏</span>
            <span className="text-white font-semibold">Average Expense</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">₹{averageExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Top 5 Expenses */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Top 5 Expenses</h2>
        <div className="space-y-3">
          {topExpenses.map((exp, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-xl hover:scale-102 hover:shadow-lg transition-all duration-200 hover:border hover:border-amber-400">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{CATEGORY_ICONS[exp.category] || '📦'}</span>
                <div>
                  <p className="text-white font-medium capitalize">{exp.category}: {exp.description}</p>
                  <p className="text-gray-400 text-sm">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-xl">₹{exp.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Category Breakdown */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Category Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(
            expenses.reduce((acc, exp) => {
              acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
              return acc;
            }, {})
          ).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{CATEGORY_ICONS[category] || '📦'}</span>
                <span className="text-white font-medium capitalize">{category}</span>
              </div>
              <span className="text-amber-400 font-bold">₹{amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;