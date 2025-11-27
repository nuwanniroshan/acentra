const AUTH_API_URL = (import.meta.env?.VITE_AUTH_API_URL as string) || 'http://localhost:3002/api';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export async function requestAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${AUTH_API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        statusCode: response.status,
      } as ApiError;
    }

    return data;
  } catch (error: any) {
    if (error.message && error.statusCode) {
      throw error;
    }
    throw {
      message: error.message || 'Network error occurred',
      statusCode: 0,
    } as ApiError;
  }
}