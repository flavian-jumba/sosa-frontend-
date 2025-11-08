import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import type { ApiResponse, PaginatedResponse, ApiError } from '@/types/api.types';

// Create axios-cache-adapter instance
const cache = setupCache({
  maxAge: 5 * 60 * 1000, // 5 minutes cache (reduced from 1 hour for fresher data)
  exclude: {
    query: false,
    filter: (config: AxiosRequestConfig) => {
      // Don't cache mutations (POST, PUT, PATCH, DELETE)
      return ['post', 'put', 'patch', 'delete'].includes(
        config.method?.toLowerCase() || ''
      );
    },
  },
  clearOnStale: true, // Clear stale cache entries automatically
  clearOnError: true, // Clear cache on error to retry with fresh data
});

// Get environment variables
// NOTE: Do NOT expose your Laravel `APP_KEY` in the frontend. If the backend requires
// a public API key/token for requests, create a dedicated token on the backend and
// set it as `VITE_API_KEY` in your deployment environment. The Laravel `APP_KEY`
// is a server secret and must remain on the server.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sosa-be-main-0fch1f.laravel.cloud';
const API_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL.replace(/\/+$/,'')}/api/v1`;
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Create axios instance with cache adapter
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  adapter: cache.adapter,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-API-Key': API_KEY,
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for standardized data extraction
api.interceptors.response.use(
  async (response) => {
    // Clear cache after mutations to ensure fresh data
    const method = response.config.method?.toLowerCase();
    if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
      // Clear cache for related endpoints after mutations
      try {
        // Type assertion for cache store
        const store = cache.store as { clear: () => Promise<void> };
        await store.clear();
        console.log('Cache cleared after mutation:', method, response.config.url);
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    }
    
    // Extract data from standardized API response
    if (response.data?.success) {
      // For paginated responses, preserve pagination info
      if (response.data.pagination) {
        return {
          ...response,
          data: response.data.data,
          pagination: response.data.pagination,
          meta: response.data.meta,
        };
      }
      // For regular responses, just return data
      return {
        ...response,
        data: response.data.data,
        meta: response.data.meta,
      };
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle API errors
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
    };

    if (error.response?.data) {
      const errorData = error.response.data as {
        message?: string;
        error_code?: string;
        errors?: Record<string, string[]>;
      };
      
      // Extract message from different possible formats
      apiError.message = errorData.message || apiError.message;
      apiError.error_code = errorData.error_code;
      apiError.errors = errorData.errors;
      
      // Special handling for 500 errors
      if (error.response.status === 500) {
        console.error('Server error:', errorData);
        apiError.message = 'The server encountered an error. Please try again later.';
      }
    } else if (error.request) {
      apiError.message = 'No response from server. Please check your connection.';
      console.error('Network error:', error);
    } else {
      apiError.message = error.message || apiError.message;
      console.error('Request error:', error);
    }

    return Promise.reject(apiError);
  }
);

// Helper function to build image URL
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a placeholder, return as is
  if (path === '/placeholder.svg' || path.startsWith('/placeholder')) {
    return path;
  }
  
  // Build full URL from storage path
  return `${API_BASE_URL}/storage/${path}`;
};

// Helper function to build multiple image URLs
export const getImageUrls = (paths: string[] | null | undefined): string[] => {
  if (!paths || paths.length === 0) return ['/placeholder.svg'];
  return paths.map(getImageUrl);
};

// Helper function to normalize amenities (handle both string and array from API)
export const normalizeAmenities = (amenities: string | string[] | null | undefined): string[] => {
  if (!amenities) return [];
  if (typeof amenities === 'string') {
    // If it's a string, split by comma or return as single-item array
    return amenities.includes(',') 
      ? amenities.split(',').map(a => a.trim()).filter(Boolean)
      : [amenities];
  }
  return amenities;
};

// Export cache instance for manual cache management
export { cache };

// Helper function to clear all cache
export const clearCache = async () => {
  try {
    const store = cache.store as { clear: () => Promise<void> };
    await store.clear();
    console.log('API cache cleared successfully');
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

// Helper function to clear specific endpoint cache
export const clearEndpointCache = async (endpoint: string) => {
  try {
    const cacheKey = `${API_URL}${endpoint}`;
    const store = cache.store as { removeItem: (key: string) => Promise<void> };
    await store.removeItem(cacheKey);
    console.log(`Cache cleared for endpoint: ${endpoint}`);
  } catch (error) {
    console.warn(`Failed to clear cache for endpoint ${endpoint}:`, error);
  }
};

export default api;

// Export types for use in services
export type { ApiResponse, PaginatedResponse, ApiError };
