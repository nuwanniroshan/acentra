import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001";
export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${AUTH_API_BASE_URL}/api`;

// Create axios instance for backend API
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for auth API
export const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
const addAuthHeaders = (config: any) => {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  return config;
};

// Response interceptor to handle token refresh and errors
const handleResponseError = async (error: AxiosError) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && originalRequest) {
    // Token expired, redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Session expired");
  }

  // For other errors, throw with message
  const message = (error.response?.data as any)?.message || error.message || "Request failed";
  throw new Error(message);
};

// Apply interceptors to both clients
[apiClient, authClient].forEach(client => {
  client.interceptors.request.use(addAuthHeaders);
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleResponseError
  );
});