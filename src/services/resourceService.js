import api from './api';

export const resourceService = {
  async getResources(params = {}) {
    const res = await api.get('/resources', { params });
    return res.data;
  },

  async getMatchedResources(childId = '') {
    const res = await api.get('/resources/matched', { params: { childId } });
    return res.data.data;
  },

  async getResourceById(id) {
    const res = await api.get(`/resources/${id}`);
    return res.data.data;
  },

  async createResource(data) {
    const res = await api.post('/resources', data);
    return res.data.data;
  },

  async updateResource(id, data) {
    const res = await api.patch(`/resources/${id}`, data);
    return res.data.data;
  },

  async deleteResource(id) {
    const res = await api.delete(`/resources/${id}`);
    return res.data;
  },

  async getMyOrgResources(params = {}) {
    const res = await api.get('/resources/my-organization', { params });
    return res.data;
  }
};
