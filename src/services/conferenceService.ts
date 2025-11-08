import api from '@/lib/api';
import type {
  Conference,
  PaginatedResponse,
  ConferenceFilters,
  ConferenceAvailabilityRequest,
  CalculatePriceRequest,
} from '@/types/api.types';

export const conferenceService = {
  /**
   * Get all conference facilities with optional filters
   */
  async getConferences(
    filters: ConferenceFilters = {}
  ): Promise<PaginatedResponse<Conference>> {
    const response = await api.get('/public/conferences', {
      params: filters,
    });
    const responseWithPagination = response as unknown as {
      data: Conference[];
      pagination: PaginatedResponse<Conference>['pagination'];
      meta: PaginatedResponse<Conference>['meta'];
    };
    
    return {
      success: true,
      message: 'Conferences retrieved successfully',
      data: responseWithPagination.data,
      pagination: responseWithPagination.pagination,
      meta: responseWithPagination.meta
    };
  },

  /**
   * Get a single conference facility by ID
   */
  async getConference(id: number): Promise<Conference> {
    const response = await api.get(`/public/conferences/${id}`);
    return response.data as Conference;
  },

  /**
   * Get featured conference facilities
   */
  async getFeaturedConferences(): Promise<Conference[]> {
    const response = await api.get('/public/conferences/featured');
    return response.data as Conference[];
  },

  /**
   * Check conference facility availability
   */
  async checkAvailability(
    id: number,
    availability: ConferenceAvailabilityRequest
  ): Promise<{ available: boolean; message: string }> {
    const response = await api.post(
      `/public/conferences/${id}/check-availability`,
      availability
    );
    return response.data as { available: boolean; message: string };
  },

  /**
   * Get facilities by minimum capacity
   */
  async getByCapacity(attendees: number): Promise<Conference[]> {
    const response = await api.get('/public/conferences/capacity', {
      params: { attendees },
    });
    return response.data as Conference[];
  },

  /**
   * Calculate price for a conference booking
   */
  async calculatePrice(
    id: number,
    priceRequest: CalculatePriceRequest
  ): Promise<{ total_price?: number; total_amount?: number; breakdown?: Record<string, number> }> {
    const response = await api.post<{
      total_price?: number;
      total_amount?: number;
      breakdown?: Record<string, number>;
    }>(`/public/conferences/${id}/calculate-price`, priceRequest);
    return response.data;
  },
};
