import axios from 'axios';

// Get base API URL, stripping any accidental trailing slash
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const API_URL = rawApiUrl.replace(/\/$/, '');

// Create customized axios client with automatic JWT token attachment
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically if available in localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
  }
  return config;
});

export default apiClient;
