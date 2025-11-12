import axios from 'axios';

const API_BASE = '/api/expenses';

export const getExpenses = async (token) => {
  const res = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addExpense = async (text, token) => {
  const res = await axios.post(API_BASE, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteExpense = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// TODO: Add editExpense and filterExpenses if needed
