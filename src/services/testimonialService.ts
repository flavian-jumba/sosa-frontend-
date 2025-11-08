import api from '@/lib/api';
import type {
  Testimonial,
  PaginatedResponse,
  SubmitTestimonialRequest,
  TestimonialFilters,
} from '@/types/api.types';

export const testimonialService = {
  /**
   * Get all testimonials (public)
   */
  async getTestimonials(
    filters: TestimonialFilters = {}
  ): Promise<PaginatedResponse<Testimonial>> {
    const response = await api.get(
      '/public/testimonials',
      {
        params: filters,
      }
    );

    // Initialize response structure
    const success = true;
    const message = 'Testimonials retrieved successfully';
    let data: Testimonial[] = [];
    let pagination: PaginatedResponse<Testimonial>['pagination'] | undefined;
    let meta: PaginatedResponse<Testimonial>['meta'] | undefined;

    // Check if response has nested data structure (non-paginated endpoint)
    if (response.data && Array.isArray(response.data.data)) {
      data = response.data.data;
      // Create mock pagination for non-paginated response
      pagination = {
        current_page: 1,
        last_page: 1,
        per_page: data.length,
        total: data.length,
        from: 1,
        to: data.length
      };
    } 
    // Check if response.data is directly an array
    else if (Array.isArray(response.data)) {
      data = response.data;
      // Create mock pagination for array response
      pagination = {
        current_page: 1,
        last_page: 1,
        per_page: data.length,
        total: data.length,
        from: 1,
        to: data.length
      };
    } 
    // Otherwise, assume it's a paginated response that was processed by interceptor
    else {
      const responseWithPagination = response as unknown as {
        data: Testimonial[];
        pagination: PaginatedResponse<Testimonial>['pagination'];
        meta: PaginatedResponse<Testimonial>['meta'];
      };
      
      data = responseWithPagination.data || [];
      pagination = responseWithPagination.pagination;
      meta = responseWithPagination.meta;
    }
    
    return {
      success,
      message,
      data,
      pagination,
      meta
    };
  },

  /**
   * Submit a new testimonial
   */
  async submitTestimonial(
    testimonialData: SubmitTestimonialRequest
  ): Promise<Testimonial> {
    const response = await api.post(
      '/testimonials/submit',
      testimonialData
    );
    return response.data as Testimonial;
  },
};
