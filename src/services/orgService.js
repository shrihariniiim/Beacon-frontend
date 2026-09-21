import api from './api';

export const orgService = {
  async getOrgById(id) {
    const res = await api.get(`/organizations/${id}`);
    return res.data.data;
  },

  async updateOrg(id, data) {
    const res = await api.patch(`/organizations/${id}`, data);
    return res.data.data;
  },

  async uploadDocument(id, file) {
    const formData = new FormData();
    formData.append('document', file);

    const res = await api.post(`/organizations/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  },

  async downloadDocument(orgId, docId) {
    const res = await api.get(`/organizations/${orgId}/documents/${docId}`, {
      responseType: 'blob'
    });
    return res.data;
  }
};
