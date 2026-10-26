import axios, { InternalAxiosRequestConfig } from 'axios';

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

/**
 * Base Axios instance configured with API URL and default headers.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ── Request Interceptor: Attach Clerk session or local access token ─────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let token: string | null = null;
  if (typeof window !== 'undefined' && window.Clerk?.session) {
    try {
      token = await window.Clerk.session.getToken();
    } catch {
      // Fallback to localStorage if Clerk token retrieval fails
    }
  }
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: Handle 401 Unauthorized & Token Refresh ────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ accessToken: string }>(
            `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
            { refreshToken },
          );
          localStorage.setItem('accessToken', data.accessToken);
          if (original.headers) {
            original.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in';
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
