import { useState, useEffect } from 'react';
import { activityService } from '@/services/activityService';
import type { Activity, ActivityFilters, PaginatedResponse, ApiError } from '@/types/api.types';
import { useToast } from '@/hooks/use-toast';

interface UseActivitiesResult {
  activities: Activity[];
  pagination: PaginatedResponse<Activity>['pagination'] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useActivities = (filters: ActivityFilters = {}): UseActivitiesResult => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Activity>['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async (append = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityService.getActivities(filters);
      
      if (append && pagination) {
        setActivities((prev) => [...prev, ...response.data]);
      } else {
        setActivities(response.data);
      }
      
      setPagination(response.pagination);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch activities';
      setError(errorMessage);
      console.error('Error fetching activities:', err);
      
      // Set empty array on error
      if (!append) {
        setActivities([]);
      }
      
      try {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const refresh = async () => {
    await fetchActivities(false);
  };

  const loadMore = async () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      await fetchActivities(true);
    }
  };

  return {
    activities,
    pagination,
    loading,
    error,
    refresh,
    loadMore,
  };
};

export const useActivity = (id: number) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await activityService.getActivity(id);
        setActivity(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch activity details';
        setError(errorMessage);
        console.error('Error fetching activity:', err);
        
        try {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } catch (toastError) {
          console.error('Toast error:', toastError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id, toast]);

  return { activity, loading, error };
};
