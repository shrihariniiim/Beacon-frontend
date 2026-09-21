import api from './api';

export const childProfileService = {
  async getMyChildren() {
    const res = await api.get('/children');
    return res.data.data;
  },

  async getChildById(id) {
    const res = await api.get(`/children/${id}`);
    return res.data.data;
  },

  async createChild(data) {
    const res = await api.post('/children', data);
    return res.data.data;
  },

  async updateChild(id, data) {
    const res = await api.patch(`/children/${id}`, data);
    return res.data.data;
  },

  async deleteChild(id) {
    const res = await api.delete(`/children/${id}`);
    return res.data;
  }
};
