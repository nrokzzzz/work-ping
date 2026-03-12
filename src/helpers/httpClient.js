import axios from 'axios';
// function HttpClient() {
//   return {
//     get: axios.get,
//     post: axios.post,
//     patch: axios.patch,
//     put: axios.put,
//     delete: axios.delete
//   };
// }
// export default HttpClient();


const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let activeRequests = 0;

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

axiosClient.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('HIDE_LOADER'));
    }
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('HIDE_LOADER'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;