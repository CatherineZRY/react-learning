import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

// TODO:添加请求拦截器
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosInstance;