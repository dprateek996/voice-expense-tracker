// /client/src/api/expense.api.js
import apiClient from './axios.config';

const expenseApi = {
  addFromVoice: async (transcript) => {
    try {
      const { data } = await apiClient.post('/expense/voice', { transcript });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add expense');
    }
  },

  getAll: async () => {
    try {
      const { data } = await apiClient.get('/expense');
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch expenses');
    }
  }
};

export { expenseApi };
export default expenseApi;