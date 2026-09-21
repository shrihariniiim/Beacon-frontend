import api from './api';

export const financialAidService = {
  async getFinancialAid(params = {}) {
    const res = await api.get('/financial-aid', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/financial-aid/${id}`);
    return res.data.data;
  },

  async create(data) {
    const res = await api.post('/financial-aid', data);
    return res.data.data;
  },

  async update(id, data) {
    const res = await api.patch(`/financial-aid/${id}`, data);
    return res.data.data;
  },

  async delete(id) {
    const res = await api.delete(`/financial-aid/${id}`);
    return res.data;
  },

  async getMyOrgFinancialAid(params = {}) {
    const res = await api.get('/financial-aid/my-organization', { params });
    return res.data;
  }
};
