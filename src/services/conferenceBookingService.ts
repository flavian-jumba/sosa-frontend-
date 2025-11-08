import api from '@/lib/api';
import type {
  ConferenceBooking,
  CreateConferenceBookingRequest,
} from '@/types/api.types';

export const conferenceBookingService = {
  /**
   * Create a new conference booking
   */
  async createBooking(
    bookingData: CreateConferenceBookingRequest
  ): Promise<ConferenceBooking> {
    const response = await api.post(
      '/conference-bookings',
      bookingData
    );
    return response.data as ConferenceBooking;
  },

  /**
   * Get a conference booking by ID
   */
  async getBooking(id: number): Promise<ConferenceBooking> {
    const response = await api.get(`/conference-bookings/${id}`);
    return response.data as ConferenceBooking;
  },

  /**
   * Update an existing conference booking
   */
  async updateBooking(
    id: number,
    updates: Partial<CreateConferenceBookingRequest>
  ): Promise<ConferenceBooking> {
    const response = await api.put(
      `/conference-bookings/${id}`,
      updates
    );
    return response.data as ConferenceBooking;
  },

  /**
   * Confirm a conference booking
   */
  async confirmBooking(id: number): Promise<ConferenceBooking> {
    const response = await api.post(
      `/conference-bookings/${id}/confirm`
    );
    return response.data as ConferenceBooking;
  },

  /**
   * Cancel a conference booking
   */
  async cancelBooking(id: number): Promise<ConferenceBooking> {
    const response = await api.post(
      `/conference-bookings/${id}/cancel`
    );
    return response.data as ConferenceBooking;
  },

  /**
   * Delete a conference booking
   */
  async deleteBooking(id: number): Promise<void> {
    await api.delete(`/conference-bookings/${id}`);
  },
};
