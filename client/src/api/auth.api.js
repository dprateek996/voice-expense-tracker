import apiClient from './axios.config';
import useAuthStore from '../store/authStore';

export const registerUser = async (userData) => {
  try {
    const { data } = await apiClient.post('/auth/register', userData);
    useAuthStore.getState().login(data.user);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await apiClient.post('/auth/login', credentials);
    useAuthStore.getState().login(data.user);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout');
    useAuthStore.getState().logout();
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed');
  }
};

export const fetchMe = async () => {
  try {
    const { data } = await apiClient.get('/auth/me');
    useAuthStore.getState().login(data);
    return data;
  } catch (error) {
    useAuthStore.getState().logout();
    throw new Error(error.response?.data?.error || 'Failed to fetch user');
  }
};