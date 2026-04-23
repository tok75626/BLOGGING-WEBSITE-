import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  logout: async () => {
    await axios.post("/api/auth/logout");
    set({ user: null });
  },
  checkAuth: async () => {
    try {
      // In a real app, we'd have a /api/auth/me endpoint
      // For now, we'll try to refresh
      await axios.post("/api/auth/refresh");
      // If successful, we'd fetch the user profile
      // For this demo, let's assume we store user info in localStorage or just skip profile fetch
      set({ loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
