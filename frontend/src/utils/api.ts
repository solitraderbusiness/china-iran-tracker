import axios from 'axios';

const API_URL = 'http://209.38.199.5:8001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await axios.post(`${API_URL}/token`, formData);
  return response.data;
};

export const register = async (name: string, email: string, phone: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    phone,
    password,
  });
  return response.data;
};

// User API calls
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

// Project API calls
export const getProjects = async () => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const getProject = async (id: number) => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (productDescription: string) => {
  const response = await api.post('/api/projects', {
    product_description: productDescription,
  });
  return response.data;
};

export const getProjectSteps = async (projectId: number) => {
  const response = await api.get(`/api/projects/${projectId}/steps`);
  return response.data;
};

// Notification API calls
export const getNotifications = async (userId: number) => {
  const response = await api.get(`/api/notifications/user/${userId}`);
  return response.data;
};

export const markNotificationAsRead = async (userId: number, notificationId: number) => {
  const response = await api.post(`/api/notifications/user/${userId}/read/${notificationId}`);
  return response.data;
};

export default api;
