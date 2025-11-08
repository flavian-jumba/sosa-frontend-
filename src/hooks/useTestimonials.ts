import { useState, useEffect } from 'react';
import { testimonialService } from '@/services/testimonialService';
import type {
  Testimonial,
  TestimonialFilters,
  PaginatedResponse,
  SubmitTestimonialRequest,
  ApiError,
} from '@/types/api.types';
import { useToast } from '@/hooks/use-toast';

export const useTestimonials = (filters: TestimonialFilters = {}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Testimonial>['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testimonialService.getTestimonials(filters);
        setTestimonials(response.data);
        setPagination(response.pagination);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch testimonials';
        setError(errorMessage);
        console.error('Error fetching testimonials:', err);
        
        // Set empty array on error
        setTestimonials([]);
        
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

    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { testimonials, pagination, loading, error };
};

export const useSubmitTestimonial = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const submitTestimonial = async (
    data: SubmitTestimonialRequest
  ): Promise<Testimonial> => {
    try {
      setLoading(true);
      setError(null);
      const testimonial = await testimonialService.submitTestimonial(data);
      
      try {
        toast({
          title: 'Success',
          description: 'Thank you for your testimonial! It will be reviewed shortly.',
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
      }
      
      return testimonial;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to submit testimonial';
      setError(errorMessage);
      console.error('Error submitting testimonial:', err);
      
      try {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitTestimonial, loading, error };
};
