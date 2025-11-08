// TypeScript interfaces matching Laravel backend models

export interface Cottage {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  featured: boolean;
  images: string[];
  amenities: string | string[]; // Can be string or array depending on backend
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  difficulty: 'beginner' | 'easy' | 'medium' | 'challenging' | 'hard' | 'expert';
  is_available: boolean;
  max_participants: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Conference {
  id: number;
  name: string;
  slug: string;
  description: string;
  room_type: string;
  min_capacity: number;
  max_capacity: number;
  price_per_hour: number;
  price_half_day: number;
  price_full_day: number;
  status: 'active' | 'maintenance' | 'inactive';
  featured: boolean;
  is_available: boolean;
  catering_available: boolean;
  amenities: string[];
  equipment: string[];
  images: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Booking {
  id: number;
  cottage_id: number;
  user_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  cottage?: Cottage;
  created_at: string;
  updated_at: string;
}

export interface ConferenceBooking {
  id: number;
  conference_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  booking_type: 'hourly' | 'half_day' | 'full_day';
  number_of_attendees: number;
  catering_required: boolean;
  special_requirements?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  conference?: Conference;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  guest_name: string;
  guest_title?: string;
  guest_image?: string;
  rating: number;
  content: string;
  is_approved: boolean;
  is_featured: boolean;
  booking_id?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  image_path: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_path?: string;
  is_available: boolean;
  is_featured: boolean;
  allergens?: string[];
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface ApiError {
  message: string;
  error_code?: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Request Types
export interface CreateBookingRequest {
  cottage_id: number;
  user_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  special_requests?: string;
}

export interface CreateConferenceBookingRequest {
  conference_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  booking_type: 'hourly' | 'half_day' | 'full_day';
  number_of_attendees: number;
  total_amount: number;
  catering_required: boolean;
  special_requirements?: string;
}

export interface SubmitTestimonialRequest {
  customer_name: string;
  customer_email?: string;
  rating: number;
  comment: string;
}

export interface AvailabilityCheckRequest {
  check_in: string;
  check_out: string;
}

export interface ConferenceAvailabilityRequest {
  booking_date: string;
  start_time: string;
  end_time: string;
}

export interface CalculatePriceRequest {
  booking_type: 'hourly' | 'half_day' | 'full_day';
  duration_hours?: number;
}

// Filter Types
export interface CottageFilters {
  search?: string;
  status?: 'active' | 'maintenance' | 'inactive';
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  min_capacity?: number;
  sort?: string;
  per_page?: number;
  page?: number;
}

export interface ActivityFilters {
  search?: string;
  difficulty?: 'beginner' | 'easy' | 'medium' | 'challenging' | 'hard' | 'expert';
  available?: boolean;
  max_price?: number;
  max_duration?: number;
  sort?: string;
  per_page?: number;
  page?: number;
}

export interface ConferenceFilters {
  search?: string;
  status?: 'active' | 'maintenance' | 'inactive';
  featured?: boolean;
  min_attendees?: number;
  room_type?: string;
  catering_available?: boolean;
  active_only?: boolean;
  sort?: string;
  per_page?: number;
  page?: number;
}

export interface TestimonialFilters {
  is_approved?: boolean;
  is_featured?: boolean;
  per_page?: number;
  page?: number;
}
