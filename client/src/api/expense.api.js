// src/api/expense.api.js
import apiClient from './axios.config';

/**
 * Create a new expense from text input
 * @param {string} text - Natural language expense description
 * @returns {Promise<Object>} Created expense object
 */
export const createExpense = async (text) => {
  try {
    const response = await apiClient.post('/api/expenses', { text });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all expenses
 * @returns {Promise<Array>} Array of expense objects
 */
export const getAllExpenses = async () => {
  try {
    const response = await apiClient.get('/api/expenses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an expense by ID (future enhancement)
 * @param {number} id - Expense ID
 * @returns {Promise<Object>} Deleted expense confirmation
 */
export const deleteExpense = async (id) => {
  try {
    const response = await apiClient.delete(`/api/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an expense by ID (future enhancement)
 * @param {number} id - Expense ID
 * @param {Object} data - Updated expense data
 * @returns {Promise<Object>} Updated expense object
 */
export const updateExpense = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
};
