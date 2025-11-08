import api from '@/lib/api';
import type {
  Booking,
  CreateBookingRequest,
} from '@/types/api.types';

export const bookingService = {
  /**
   * Create a new cottage booking
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await api.post('/bookings', bookingData);
    return response.data as Booking;
  },

  /**
   * Get a booking by ID
   */
  async getBooking(id: number): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data as Booking;
  },

  /**
   * Update an existing booking
   */
  async updateBooking(id: number, updates: Partial<CreateBookingRequest>): Promise<Booking> {
    const response = await api.put(`/bookings/${id}`, updates);
    return response.data as Booking;
  },

  /**
   * Confirm a booking
   */
  async confirmBooking(id: number): Promise<Booking> {
    const response = await api.post(`/bookings/${id}/confirm`);
    return response.data as Booking;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(id: number): Promise<Booking> {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data as Booking;
  },

  /**
   * Delete a booking
   */
  async deleteBooking(id: number): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};
