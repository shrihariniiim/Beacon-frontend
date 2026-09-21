import axios from 'axios';

/**
 * Resolves the backend API base URL dynamically.
 * In development, defaults to '/api' for Vite local proxying.
 * In production (Vercel), uses VITE_API_URL (e.g. https://beaconcare-api.onrender.com).
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('beaconcare_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh seamlessly
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failed endpoint was the refresh endpoint itself or login, do not loop
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        localStorage.removeItem('beaconcare_access_token');
        localStorage.removeItem('beaconcare_refresh_token');
        localStorage.removeItem('beaconcare_user');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('beaconcare_refresh_token');

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('beaconcare_access_token');
        localStorage.removeItem('beaconcare_user');
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${getApiBaseUrl()}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken, user } = res.data.data;

        localStorage.setItem('beaconcare_access_token', accessToken);
        localStorage.setItem('beaconcare_refresh_token', newRefreshToken);
        if (user) {
          localStorage.setItem('beaconcare_user', JSON.stringify(user));
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('beaconcare_access_token');
        localStorage.removeItem('beaconcare_refresh_token');
        localStorage.removeItem('beaconcare_user');
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
