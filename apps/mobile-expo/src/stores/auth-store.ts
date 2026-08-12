import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  setUser: (user: User | null) => void;
  setLoaded: (loaded: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  clear: () => set({ user: null, isLoaded: false }),
}));
