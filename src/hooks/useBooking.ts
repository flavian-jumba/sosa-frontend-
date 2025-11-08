import { useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { conferenceBookingService } from '@/services/conferenceBookingService';
import type {
  Booking,
  ConferenceBooking,
  CreateBookingRequest,
  CreateConferenceBookingRequest,
  ApiError,
} from '@/types/api.types';
import { useToast } from '@/hooks/use-toast';

export const useBooking = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createBooking = async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.createBooking(bookingData);
      toast({
        title: 'Success',
        description: 'Booking created successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to create booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: number): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.confirmBooking(id);
      toast({
        title: 'Success',
        description: 'Booking confirmed successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to confirm booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.cancelBooking(id);
      toast({
        title: 'Success',
        description: 'Booking cancelled successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to cancel booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    confirmBooking,
    cancelBooking,
    loading,
    error,
  };
};

export const useConferenceBooking = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createBooking = async (
    bookingData: CreateConferenceBookingRequest
  ): Promise<ConferenceBooking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await conferenceBookingService.createBooking(bookingData);
      toast({
        title: 'Success',
        description: 'Conference booking created successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to create conference booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: number): Promise<ConferenceBooking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await conferenceBookingService.confirmBooking(id);
      toast({
        title: 'Success',
        description: 'Conference booking confirmed successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to confirm conference booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number): Promise<ConferenceBooking> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await conferenceBookingService.cancelBooking(id);
      toast({
        title: 'Success',
        description: 'Conference booking cancelled successfully!',
      });
      return booking;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to cancel conference booking';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    confirmBooking,
    cancelBooking,
    loading,
    error,
  };
};
