import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let activeRequests = 0;

// ── Request Interceptor ──────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    activeRequests++;
    if (activeRequests === 1) {
      window.dispatchEvent(new Event('SHOW_LOADER'));
    }
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('HIDE_LOADER'));
    }
    return Promise.reject(error);
  }
);

// ── Response Interceptor ─────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('HIDE_LOADER'));
    }

    // Auto-toast on { type, message } shaped responses
    const data = response?.data;
    if (data?.message && data?.type) {
      if (data.type === 'success') {
        toast.success(data.message);
      } else if (data.type === 'error') {
        toast.error(data.message);
      }
    }

    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('HIDE_LOADER'));
    }

    // Extract and display error message
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default axiosClient;