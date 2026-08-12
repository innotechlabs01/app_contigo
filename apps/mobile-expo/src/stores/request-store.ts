import { create } from 'zustand';
import type { ServiceRequest } from '../types';

interface RequestState {
  requests: ServiceRequest[];
  isLoading: boolean;
  setRequests: (requests: ServiceRequest[]) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (request: ServiceRequest) => void;
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
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ requests: [], isLoading: false }),
}));
