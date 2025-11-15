// client/src/axios/axiosNoAuth.js
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

export const axiosNoAuth = axios.create({ baseURL: API_URL });

axiosNoAuth.interceptors.response.use(response => response, handleResponseError);
export default axiosNoAuth;
