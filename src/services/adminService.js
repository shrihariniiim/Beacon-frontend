import api from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data.data;
  },

  async getVerifications(params = {}) {
    const res = await api.get('/admin/verifications', { params });
    return res.data;
  },

  async approveOrg(id) {
    const res = await api.patch(`/admin/verifications/${id}/approve`);
    return res.data.data;
  },

  async rejectOrg(id, reason) {
    const res = await api.patch(`/admin/verifications/${id}/reject`, { reason });
    return res.data.data;
  },

  async suspendOrg(id, reason) {
    const res = await api.patch(`/admin/verifications/${id}/suspend`, { reason });
    return res.data.data;
  },

  async moderateResource(id, status, rejectionReason = '') {
    const res = await api.patch(`/admin/resources/${id}/moderate`, { status, rejectionReason });
    return res.data.data;
  },

  async moderateEvent(id, status) {
    const res = await api.patch(`/admin/events/${id}/moderate`, { status });
    return res.data.data;
  },

  async moderateFinancialAid(id, status) {
    const res = await api.patch(`/admin/financial-aid/${id}/moderate`, { status });
    return res.data.data;
  },

  async resolveReport(id, data) {
    const res = await api.patch(`/admin/reports/${id}/resolve`, data);
    return res.data.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserStatus(id, status) {
    const res = await api.patch(`/admin/users/${id}/status`, { status });
    return res.data.data;
  },

  async getAuditLogs(params = {}) {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  }
};
