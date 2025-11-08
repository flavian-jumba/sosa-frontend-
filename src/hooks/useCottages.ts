import { useState, useEffect, useCallback } from 'react';
import { cottageService } from '@/services/cottageService';
import type { Cottage, CottageFilters, PaginatedResponse, ApiError } from '@/types/api.types';
import { useToast } from '@/hooks/use-toast';

interface UseCottagesResult {
  cottages: Cottage[];
  pagination: PaginatedResponse<Cottage>['pagination'] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useCottages = (filters: CottageFilters = {}): UseCottagesResult => {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Cottage>['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCottages = useCallback(async (append = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cottageService.getCottages(filters);
      
      if (append) {
        setCottages((prev) => [...prev, ...response.data]);
      } else {
        setCottages(response.data);
      }
      
      setPagination(response.pagination);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch cottages';
      setError(errorMessage);
      console.error('Error fetching cottages:', err);
      
      // Set empty array on error to prevent crashes
      if (!append) {
        setCottages([]);
      }
      
      // Only show toast if it's available
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCottages();
  }, [fetchCottages]);

  const refresh = async () => {
    await fetchCottages(false);
  };

  const loadMore = async () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      await fetchCottages(true);
    }
  };

  return {
    cottages,
    pagination,
    loading,
    error,
    refresh,
    loadMore,
  };
};

export const useCottage = (id: number) => {
  const [cottage, setCottage] = useState<Cottage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCottage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cottageService.getCottage(id);
        setCottage(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch cottage details';
        setError(errorMessage);
        console.error('Error fetching cottage:', err);
        
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
      fetchCottage();
    }
  }, [id, toast]);

  return { cottage, loading, error };
};

export const useFeaturedCottages = () => {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cottageService.getFeaturedCottages();
        setCottages(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch featured cottages';
        setError(errorMessage);
        console.error('Error fetching featured cottages:', err);
        
        // Set empty array on error
        setCottages([]);
        
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

    fetchFeatured();
  }, [toast]);

  return { cottages, loading, error };
};
