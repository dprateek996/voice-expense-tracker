import { useEffect, useState } from 'react';
import useExpenseStore from '@/store/expenseStore';
import { toast } from 'sonner';

const Categories = () => {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error("Failed to load categories data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl text-white">Loading categories...</div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Expense Categories
        </h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-2xl font-semibold mb-2 text-white">No expenses yet</h2>
          <p className="text-gray-400">Add some expenses to see your categories!</p>
        </div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

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

  // Calculate category totals and percentages
  const categoryData = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const categories = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    amount,
    percentage: ((amount / totalSpent) * 100).toFixed(1),
    icon: CATEGORY_ICONS[category] || '📦'
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        Expense Categories
      </h1>

      {/* Summary Card */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 hover:scale-105 hover:shadow-xl transition-all duration-200 hover:border hover:border-slate-600">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-4xl">📂</span>
          <span className="text-white font-semibold">Total Categories</span>
        </div>
        <p className="text-3xl font-bold text-white">{categories.length}</p>
        <p className="text-slate-300 text-sm">Across ₹{totalSpent.toFixed(2)} total spent</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 hover:border hover:border-amber-400">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-5xl">{cat.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white capitalize">{cat.name}</h3>
                <p className="text-amber-400 font-semibold text-lg">₹{cat.amount.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-slate-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm">{cat.percentage}% of total expenses</p>
            
            {/* Expense Count */}
            <p className="text-gray-400 text-sm mt-2">
              {expenses.filter(e => e.category === cat.name).length} expenses
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Detailed Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-2 text-white font-semibold">Category</th>
                <th className="pb-2 text-white font-semibold">Amount</th>
                <th className="pb-2 text-white font-semibold">Percentage</th>
                <th className="pb-2 text-white font-semibold">Expenses</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={i} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-white capitalize">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-amber-400 font-semibold">₹{cat.amount.toFixed(2)}</td>
                  <td className="py-3 text-gray-400">{cat.percentage}%</td>
                  <td className="py-3 text-gray-400">{expenses.filter(e => e.category === cat.name).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
