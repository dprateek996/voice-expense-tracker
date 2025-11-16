import { create } from 'zustand';
import { getAllExpenses } from '@/api/expense.api';

const useExpenseStore = create((set) => ({
  expenses: [], // This default empty array is CRITICAL.
  fetchExpenses: async () => {
    try {
      const expenseData = await getAllExpenses();
      set({ expenses: expenseData || [] }); // Ensure we always set an array
    } catch (error) {
      console.error("Failed to fetch expenses for store:", error);
      set({ expenses: [] }); // Set to empty array on error
    }
  },
}));

export default useExpenseStore;