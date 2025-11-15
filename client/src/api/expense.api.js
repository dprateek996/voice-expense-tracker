import apiClient from './axios.config';

export const addExpenseFromVoice = async (transcript) => {
  try {
    const { data } = await apiClient.post('/expense/voice', { transcript });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add expense from voice');
  }
};

export const getAllExpenses = async () => {
  try {
    const { data } = await apiClient.get('/expense');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch expenses');
  }
};