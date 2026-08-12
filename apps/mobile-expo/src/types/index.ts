export type UserRole = 'client' | 'companion' | 'admin';

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  status: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Companion {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  rating: number;
  experience_years: number;
  languages: string[];
  services: string[];
  bio?: string;
}

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'completed';

export interface ServiceRequest {
  id: string;
  client_id: string;
  companion_id: string;
  service_type: string;
  full_name: string;
  phone: string;
  address: string;
  meeting_point?: string;
  preferred_date: string;
  notes?: string;
  status: RequestStatus;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  service_type: string;
  companion_id: string;
  full_name: string;
  phone: string;
  address: string;
  meeting_point?: string;
  preferred_date: string;
  notes?: string;
}

export interface UpsertMeInput {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface WsEvent {
  type:
    | 'request_created'
    | 'request_accepted'
    | 'request_rejected'
    | 'request_cancelled'
    | 'request_expired';
  data: ServiceRequest;
}
