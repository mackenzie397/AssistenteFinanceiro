import axios, { AxiosResponse } from 'axios';
import { handleError } from '../utils/errorHandling';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  timeout: 10000,
});

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    handleError(error);
    return Promise.reject(error);
  }
);

export default api; 