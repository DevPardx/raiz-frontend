import { create } from "zustand";
import { getCurrentUser } from "@/api/auth";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  clearAuth: () => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isInitialized: true
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true
      });
    }
  },

  clearAuth: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),

  login: (user) => set({
    user,
    isAuthenticated: true,
    isInitialized: true
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false
  }),
}));
