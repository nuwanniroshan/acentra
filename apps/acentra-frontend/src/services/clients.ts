import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001";
export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${AUTH_API_BASE_URL}/api`;

// Create axios instance for backend API
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Create axios instance for auth API
export const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
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
    config.headers["x-tenant-id"] = tenantId;
  }

  return config;
};

// Response interceptor to handle token refresh and errors
const handleResponseError = async (error: AxiosError) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && originalRequest) {
    // If this is a login attempt, strictly prevent redirect.
    // The component should handle the error (e.g. "Invalid credentials").
    if (originalRequest.url?.includes("/auth/login")) {
      // Allow it to fall through to standard error handling
    } else {
      // Token expired for other requests
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dispatch event to allow React to navigate nicely
      window.dispatchEvent(new Event("auth:session-expired"));

      // Throw error to stop further processing
      throw new Error("Session expired");
    }
  }

  // For other errors (and login 401s), update message and throw original error
  const message =
    (error.response?.data as any)?.message || error.message || "Request failed";
  error.message = message;
  throw error;
};

// Apply interceptors to both clients
[apiClient, authClient].forEach((client) => {
  client.interceptors.request.use(addAuthHeaders);
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleResponseError,
  );
});
