import { create } from 'zustand';
import type { ServiceRequest } from '../types';

interface RequestState {
  requests: ServiceRequest[];
  isLoading: boolean;
  setRequests: (requests: ServiceRequest[]) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (request: ServiceRequest) => void;
  removeRequest: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],
  isLoading: false,
  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (updated) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === updated.id ? updated : r,
      ),
    })),
  removeRequest: (id) =>
    set((state) => ({ requests: state.requests.filter((r) => r.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ requests: [], isLoading: false }),
}));
