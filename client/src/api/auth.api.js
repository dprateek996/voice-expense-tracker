import api from './axios.config';

const withNetworkHint = (error) => {
  if (!error?.response) {
    const wrapped = new Error('Auth API is unreachable. Start the backend server on port 5001.');
    wrapped.cause = error;
    throw wrapped;
  }
  throw error;
};

export async function registerUser(userData) {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export async function loginUser(credentials) {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export async function logoutUser() {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export async function getMe() {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export const fetchMe = getMe;

export async function refreshToken() {
  try {
    const res = await api.post('/auth/refresh');
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export async function updateProfile({ name, email }) {
  try {
    const res = await api.put('/auth/profile', { name, email });
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export async function deleteAccount() {
  try {
    const res = await api.delete('/auth/account');
    return res.data;
  } catch (error) {
    withNetworkHint(error);
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  fetchMe,
  refreshToken,
  updateProfile,
  deleteAccount
};
