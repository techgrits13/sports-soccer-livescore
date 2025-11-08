/**
 * API Client
 * Axios-based HTTP client with interceptors for error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import { APIResponse } from '@/types/api';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Create axios instance
const createAPIClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // You can add auth tokens here if needed
      // const token = await getAuthToken();
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.config.url}`, response.status);
      return response;
    },
    (error: AxiosError) => {
      console.error('❌ API Error:', error.message);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const data = error.response.data as any;
        throw new APIError(
          data?.error?.message || data?.error || error.message,
          error.response.status,
          data?.error?.code,
          data?.error?.details
        );
      } else if (error.request) {
        // Request made but no response received
        throw new APIError(
          'Unable to connect to server. Please check your internet connection.',
          0,
          'NETWORK_ERROR'
        );
      } else {
        // Something else happened
        throw new APIError(error.message, 0, 'UNKNOWN_ERROR');
      }
    }
  );

  return client;
};

// Create and export the API client instance
export const apiClient = createAPIClient();

// Generic request wrapper for type safety
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.request<APIResponse<T>>(config);
    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('An unexpected error occurred');
  }
}

// Convenience methods
export const api = {
  get: async <T>(url: string, params?: any): Promise<APIResponse<T>> => {
    return apiRequest<T>({ method: 'GET', url, params });
  },

  post: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    return apiRequest<T>({ method: 'POST', url, data });
  },

  put: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    return apiRequest<T>({ method: 'PUT', url, data });
  },

  delete: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    return apiRequest<T>({ method: 'DELETE', url, data });
  },
};

// Health check function
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get('/health');
    return response.data?.success === true;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}
