const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_URL = `${API_BASE_URL}/api`;

export async function request(url: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    headers['x-tenant-id'] = tenantId;
  }

  const response = await fetch(`${API_URL}${url}`, {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function logout(): Promise<void> {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch (error) {
    // Logout should succeed even if the request fails
    console.error("Logout request failed:", error);
  }
}