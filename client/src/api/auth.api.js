import api from './axios.config';

export async function registerUser(userData) {
  const res = await api.post('/auth/register', userData);
  return res.data;
}

export async function loginUser(credentials) {
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function logoutUser() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

// Add alias to satisfy consumers expecting fetchMe
export const fetchMe = getMe;

export async function refreshToken() {
  const res = await api.post('/auth/refresh');
  return res.data;
}

// default export (object) for any default imports (legacy)
export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  fetchMe,
  refreshToken
};