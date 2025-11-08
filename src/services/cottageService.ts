import api from '@/lib/api';
import type {
  Cottage,
  PaginatedResponse,
  CottageFilters,
  AvailabilityCheckRequest,
} from '@/types/api.types';

export const cottageService = {
  /**
   * Get all cottages with optional filters
   */
  async getCottages(
    filters: CottageFilters = {}
  ): Promise<PaginatedResponse<Cottage>> {
    const response = await api.get('/public/cottages', {
      params: filters,
    });
    // The interceptor already extracts the data, but we need to reconstruct the full response
    const responseWithPagination = response as unknown as {
      data: Cottage[];
      pagination: PaginatedResponse<Cottage>['pagination'];
      meta: PaginatedResponse<Cottage>['meta'];
    };
    
    return {
      success: true,
      message: 'Cottages retrieved successfully',
      data: responseWithPagination.data,
      pagination: responseWithPagination.pagination,
      meta: responseWithPagination.meta
    };
  },

  /**
   * Get a single cottage by ID
   */
  async getCottage(id: number): Promise<Cottage> {
    const response = await api.get(`/public/cottages/${id}`);
    return response.data as Cottage;
  },

  /**
   * Get featured cottages
   */
  async getFeaturedCottages(): Promise<Cottage[]> {
    const response = await api.get('/public/cottages/featured');
    return response.data as Cottage[];
  },

  /**
   * Check cottage availability
   */
  async checkAvailability(
    id: number,
    dates: AvailabilityCheckRequest
  ): Promise<{ available: boolean; message: string }> {
    const response = await api.post<{ available: boolean; message: string }>(
      `/public/cottages/${id}/check-availability`,
      dates
    );
    return response.data;
  },

  /**
   * Search cottages by term
   */
  async searchCottages(
    searchTerm: string,
    additionalFilters: Omit<CottageFilters, 'search'> = {}
  ): Promise<PaginatedResponse<Cottage>> {
    return this.getCottages({
      search: searchTerm,
      ...additionalFilters,
    });
  },
};
