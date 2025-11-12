import { useState } from 'react';
import { addExpense } from '@/api/expense.api';

const ExpenseInput = ({ token, onExpenseAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const expense = await addExpense(text, token);
      setText('');
      if (onExpenseAdded) onExpenseAdded(expense);
    } catch (err) {
      setError('Failed to add expense');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary-100 p-4 rounded-lg shadow-md flex flex-col gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter expense (English/Hindi)"
        className="p-2 rounded border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50 text-primary-900"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-gradient-primary text-white py-2 px-4 rounded hover:opacity-90 transition"
        disabled={loading || !text.trim()}
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default ExpenseInput;
