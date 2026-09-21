import api from './api';

export const bookmarkService = {
  async getBookmarks(params = {}) {
    const res = await api.get('/bookmarks', { params });
    return res.data;
  },

  async checkStatus(resourceId) {
    const res = await api.get(`/bookmarks/check/${resourceId}`);
    return res.data.data;
  },

  async addBookmark(resourceId) {
    const res = await api.post(`/bookmarks/${resourceId}`);
    return res.data.data;
  },

  async removeBookmark(resourceId) {
    const res = await api.delete(`/bookmarks/${resourceId}`);
    return res.data;
  }
};
