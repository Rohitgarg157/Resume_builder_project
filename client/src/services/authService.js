import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/verify');
    return response.data.user;
  },

  async updateProfile(profileData) {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  async deleteAccount(password) {
    const response = await api.delete('/user/account', { data: { password } });
    return response.data;
  },

  async getUserStats() {
    const response = await api.get('/user/stats');
    return response.data;
  }
};
