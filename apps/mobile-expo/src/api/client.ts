import * as SecureStore from 'expo-secure-store';
import type { ApiResponse } from '@/src/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export async function getAuthToken(): Promise<string | null> {
  if (authToken) return authToken;
  authToken = await SecureStore.getItemAsync('clerk_jwt');
  return authToken;
}

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const body: ApiResponse<T> = await response.json();

  if (!response.ok || !body.success) {
    throw new ApiError(
      body.error?.code || 'UNKNOWN',
      body.error?.message || 'Request failed',
      response.status,
    );
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, data: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(path: string, data: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

export { ApiError };
