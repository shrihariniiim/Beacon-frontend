import api from './api';

export const reportService = {
  async submitReport(data) {
    const res = await api.post('/reports', data);
    return res.data;
  },

  async getReports(params = {}) {
    const res = await api.get('/reports', { params });
    return res.data;
  }
};
