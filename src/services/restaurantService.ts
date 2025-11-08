import api from '@/lib/api';
import type { RestaurantMenuItem, PaginatedResponse } from '@/types/api.types';

interface RestaurantMenuFilters {
  category?: string;
  is_available?: boolean;
  is_featured?: boolean;
  per_page?: number;
  page?: number;
}

export const restaurantService = {
  /**
   * Get all restaurant menu items
   */
  async getMenu(
    filters: RestaurantMenuFilters = {}
  ): Promise<PaginatedResponse<RestaurantMenuItem>> {
    const response = await api.get(
      '/public/restaurant-menu',
      {
        params: filters,
      }
    );
    
    // Handle non-paginated response from backend
    // Backend returns {data: [...]} without success field
    // Interceptor doesn't process it, so response.data = {data: [...]}
    
    // Check if response.data has a nested data array
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        message: 'Menu items retrieved successfully',
        data: response.data.data,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: response.data.data.length,
          total: response.data.data.length,
          from: 1,
          to: response.data.data.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        }
      };
    }
    
    // If response.data is already an array
    if (Array.isArray(response.data)) {
      return {
        success: true,
        message: 'Menu items retrieved successfully',
        data: response.data,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length,
          from: 1,
          to: response.data.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        }
      };
    }
    
    // If it has pagination info, reconstruct properly
    const responseWithPagination = response as unknown as {
      data: RestaurantMenuItem[];
      pagination: PaginatedResponse<RestaurantMenuItem>['pagination'];
      meta: PaginatedResponse<RestaurantMenuItem>['meta'];
    };
    
    return {
      success: true,
      message: 'Menu items retrieved successfully',
      data: responseWithPagination.data,
      pagination: responseWithPagination.pagination,
      meta: responseWithPagination.meta
    };
  },

  /**
   * Get menu items by category
   */
  async getByCategory(category: string): Promise<PaginatedResponse<RestaurantMenuItem>> {
    return this.getMenu({ category, is_available: true });
  },

  /**
   * Get featured menu items
   */
  async getFeatured(): Promise<RestaurantMenuItem[]> {
    const response = await this.getMenu({ is_featured: true, is_available: true });
    return response.data;
  },
};
