import { useState, useEffect } from 'react';
import { conferenceService } from '@/services/conferenceService';
import type { Conference, ConferenceFilters, PaginatedResponse, ApiError } from '@/types/api.types';
import { useToast } from '@/hooks/use-toast';

interface UseConferencesResult {
  conferences: Conference[];
  pagination: PaginatedResponse<Conference>['pagination'] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useConferences = (filters: ConferenceFilters = {}): UseConferencesResult => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Conference>['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConferences = async (append = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await conferenceService.getConferences(filters);
      
      if (append && pagination) {
        setConferences((prev) => [...prev, ...response.data]);
      } else {
        setConferences(response.data);
      }
      
      setPagination(response.pagination);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch conferences';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, [JSON.stringify(filters)]);

  const refresh = async () => {
    await fetchConferences(false);
  };

  const loadMore = async () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      await fetchConferences(true);
    }
  };

  return {
    conferences,
    pagination,
    loading,
    error,
    refresh,
    loadMore,
  };
};

export const useConference = (id: number) => {
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConference = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await conferenceService.getConference(id);
        setConference(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch conference details';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConference();
    }
  }, [id]);

  return { conference, loading, error };
};

export const useFeaturedConferences = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await conferenceService.getFeaturedConferences();
        setConferences(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch featured conferences';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { conferences, loading, error };
};
