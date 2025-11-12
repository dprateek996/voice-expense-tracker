import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '@/api/expense.api';

const CATEGORY_COLORS = {
  Food: 'bg-teal-400 text-white',
  Travel: 'bg-blue-400 text-white',
  Shopping: 'bg-pink-400 text-white',
  Entertainment: 'bg-purple-400 text-white',
  Bills: 'bg-yellow-400 text-black',
  Healthcare: 'bg-green-400 text-white',
  Education: 'bg-indigo-400 text-white',
  Fuel: 'bg-orange-400 text-white',
  Others: 'bg-gray-400 text-white',
};

const ExpenseList = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExpenses(token);
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id, token);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch {
      setError('Failed to delete expense');
    }
  };

  if (loading) return <div className="text-primary-700">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Defensive: ensure expenses is always an array
  const expenseArray = Array.isArray(expenses) ? expenses : [];
  return (
    <div className="bg-primary-50 p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-primary-900 text-lg font-bold mb-2">Expenses</h2>
      <ul className="divide-y divide-primary-200">
        {expenseArray.map(exp => (
          <li key={exp.id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-semibold text-primary-800">₹{exp.amount}</span>
              {/* Category Badge */}
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-bold inline-block align-middle ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Others']}`}
              >
                {exp.category}
              </span>
              <span className="ml-2 text-primary-600">{exp.description}</span>
              {exp.location && <span className="ml-2 text-primary-500">@ {exp.location}</span>}
            </div>
            <button
              className="bg-gradient-primary text-white px-3 py-1 rounded hover:opacity-90 transition"
              onClick={() => handleDelete(exp.id)}
            >Delete</button>
          </li>
        ))}
      </ul>
      {expenseArray.length === 0 && <div className="text-primary-400">No expenses found.</div>}
    </div>
  );
};

export default ExpenseList;
