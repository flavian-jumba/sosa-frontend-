import api from '@/lib/api';
import type {
  Activity,
  PaginatedResponse,
  ActivityFilters,
} from '@/types/api.types';

export const activityService = {
  /**
   * Get all activities with optional filters
   */
  async getActivities(
    filters: ActivityFilters = {}
  ): Promise<PaginatedResponse<Activity>> {
    const response = await api.get('/public/activities', {
      params: filters,
    });
    const responseWithPagination = response as unknown as {
      data: Activity[];
      pagination: PaginatedResponse<Activity>['pagination'];
      meta: PaginatedResponse<Activity>['meta'];
    };
    
    return {
      success: true,
      message: 'Activities retrieved successfully',
      data: responseWithPagination.data,
      pagination: responseWithPagination.pagination,
      meta: responseWithPagination.meta
    };
  },

  /**
   * Get a single activity by ID
   */
  async getActivity(id: number): Promise<Activity> {
    const response = await api.get(`/public/activities/${id}`);
    return response.data as Activity;
  },

  /**
   * Get available activities for a specific date
   */
  async getAvailableActivities(date: string): Promise<Activity[]> {
    const response = await api.get(`/public/activities/available/${date}`);
    return response.data as Activity[];
  },

  /**
   * Filter activities by difficulty
   */
  async getByDifficulty(
    difficulty: 'beginner' | 'easy' | 'medium' | 'challenging' | 'hard' | 'expert'
  ): Promise<PaginatedResponse<Activity>> {
    return this.getActivities({ difficulty });
  },
};
