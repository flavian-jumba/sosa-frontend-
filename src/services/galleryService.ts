import api from '@/lib/api';
import type { Gallery, PaginatedResponse } from '@/types/api.types';

interface GalleryFilters {
  category?: string;
  is_active?: boolean;
  per_page?: number;
  page?: number;
}

export const galleryService = {
  /**
   * Get all gallery images
   */
  async getGalleries(
    filters: GalleryFilters = {}
  ): Promise<PaginatedResponse<Gallery>> {
    const response = await api.get('/public/galleries', {
      params: filters,
    });
    
    // Handle non-paginated response from backend
    // Backend returns {data: [...]} without success field
    
    // Check if response.data has a nested data array
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        message: 'Galleries retrieved successfully',
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
        message: 'Galleries retrieved successfully',
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
      data: Gallery[];
      pagination: PaginatedResponse<Gallery>['pagination'];
      meta: PaginatedResponse<Gallery>['meta'];
    };
    
    return {
      success: true,
      message: 'Galleries retrieved successfully',
      data: responseWithPagination.data,
      pagination: responseWithPagination.pagination,
      meta: responseWithPagination.meta
    };
  },

  /**
   * Get gallery images by category
   */
  async getByCategory(category: string): Promise<PaginatedResponse<Gallery>> {
    return this.getGalleries({ category, is_active: true });
  },
};
