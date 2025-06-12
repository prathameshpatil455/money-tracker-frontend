// src/store/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  loading: true,

  login: async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      await AsyncStorage.setItem("token", res.data.token);
      set({ token: res.data.token });
      return true;
    } catch {
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      await AsyncStorage.setItem("token", res.data.token);
      set({ token: res.data.token });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null });
  },

  checkToken: async () => {
    const stored = await AsyncStorage.getItem("token");
    set({ token: stored, loading: false });
  },
}));
