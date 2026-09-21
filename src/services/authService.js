import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('beaconcare_refresh_token');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('beaconcare_access_token');
      localStorage.removeItem('beaconcare_refresh_token');
      localStorage.removeItem('beaconcare_user');
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  }
};
