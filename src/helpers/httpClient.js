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

export default axiosClient;