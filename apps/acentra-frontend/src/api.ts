const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3002";
export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${AUTH_API_BASE_URL}/api`;

export async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { "x-tenant-id": tenantId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session expired");
    }
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export async function requestAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { "x-tenant-id": tenantId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${AUTH_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session expired");
    }
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export async function logout() {
  return requestAuth("/auth/logout", {
    method: "POST",
  });
}

export async function getCandidates(page: number = 1, limit: number = 25) {
  return request(`/candidates?page=${page}&limit=${limit}`);
}

export async function getUserPreferences(userId: string) {
  return request(`/users/${userId}/preferences`);
}

export async function updateUserPreferences(userId: string, preferences: Record<string, any>) {
  return request(`/users/${userId}/preferences`, {
    method: "PATCH",
    body: JSON.stringify({ preferences }),
  });
}
