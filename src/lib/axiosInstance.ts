// src/lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));

        // ✅ Only attach valid user auth tokens
        if (
          decoded &&
          typeof decoded === 'object' &&
          decoded.user_id &&
          decoded.email &&
          decoded.role
        ) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        } else {
          // 🚫 It's a lease invite token or malformed — do not attach
          delete config.headers?.Authorization;
        }
      }
    } catch (err) {
      // 🚫 Malformed token — ensure it's not attached
      delete config.headers?.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;