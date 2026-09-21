import api from './api';

export const eventService = {
  async getEvents(params = {}) {
    const res = await api.get('/events', { params });
    return res.data;
  },

  async getEventById(id) {
    const res = await api.get(`/events/${id}`);
    return res.data.data;
  },

  async createEvent(data) {
    const res = await api.post('/events', data);
    return res.data.data;
  },

  async updateEvent(id, data) {
    const res = await api.patch(`/events/${id}`, data);
    return res.data.data;
  },

  async deleteEvent(id) {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },

  async getMyOrgEvents(params = {}) {
    const res = await api.get('/events/my-organization', { params });
    return res.data;
  }
};
