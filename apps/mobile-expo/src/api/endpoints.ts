import { api } from '../api/client';
import type { Companion, CreateRequestInput, ServiceRequest, UpsertMeInput, User } from '../types';

export const userApi = {
  upsertMe: (data: UpsertMeInput) => api.post<User>('/users/me', data),
};

export const companionApi = {
  list: () => api.get<Companion[]>('/companions'),
};

export const requestApi = {
  create: (data: CreateRequestInput) =>
    api.post<ServiceRequest>('/requests/', data),

  list: () => api.get<ServiceRequest[]>('/requests/'),

  getById: (id: string) => api.get<ServiceRequest>(`/requests/${id}`),

  accept: (id: string) =>
    api.post<ServiceRequest>(`/requests/${id}/accept`, {}),

  reject: (id: string) =>
    api.post<ServiceRequest>(`/requests/${id}/reject`, {}),

  cancel: (id: string) =>
    api.post<ServiceRequest>(`/requests/${id}/cancel`, {}),
};
