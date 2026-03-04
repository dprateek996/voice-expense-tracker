import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { expenseApi } from '@/api/expense.api';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      budget: 5000, // Default demo budget
      setBudget: (newBudget) => set({ budget: newBudget }),
      fetchExpenses: async () => {
        try {
          const data = await expenseApi.getAll();
          set({ expenses: data });
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
        }
      },
      deleteExpense: async (id) => {
        await expenseApi.deleteExpense(id);
        set({ expenses: get().expenses.filter((e) => e.id !== id) });
      },
      updateExpense: async (id, updates) => {
        const updated = await expenseApi.updateExpense(id, updates);
        set({
          expenses: get().expenses.map((e) => (e.id === id ? updated : e)),
        });
        return updated;
      },
    }),
    {
      name: 'expense-storage',
      partialize: (state) => ({ budget: state.budget }), // Persist budget
    }
  )
);

export default useExpenseStore;
