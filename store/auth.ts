// src/store/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import { useNotificationStore } from "./notificationStore";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  userImage: string;
}

interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  token: string;
  userImage: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkToken: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: true,
  error: null,

  login: async ({ email, password }) => {
    try {
      set({ error: null });
      const res = await axiosInstance.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log(res.data, "user data");

      await AsyncStorage.setItem("token", res.data.token);
      set({
        token: res.data.token,
        user: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          userImage: res.data.userImage,
        },
        error: null,
      });

      // Register for push notifications after successful login
      await useNotificationStore.getState().registerForPushNotifications();

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      console.log(error, "hello");
      set({ error: errorMessage });
      return false;
    }
  },

  register: async ({ name, email, password }) => {
    try {
      set({ error: null });
      const res = await axiosInstance.post<AuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        {
          name,
          email,
          password,
        }
      );

      await AsyncStorage.setItem("token", res.data.token);
      set({
        token: res.data.token,
        user: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          userImage: res.data.userImage,
        },
        error: null,
      });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      set({ error: errorMessage });
      return false;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
      await AsyncStorage.removeItem("token");
      set({ token: null, user: null, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      set({ error: errorMessage });
    }
  },

  checkToken: async () => {
    try {
      const stored = await AsyncStorage.getItem("token");
      if (stored) {
        const res = await axiosInstance.get<AuthResponse>(
          ENDPOINTS.AUTH.VERIFY
        );
        set({
          token: stored,
          user: {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            userImage: res.data.userImage,
          },
          loading: false,
          error: null,
        });
      } else {
        set({ token: null, user: null, loading: false, error: null });
      }
    } catch (error) {
      // If token verification fails, clear the stored token
      await AsyncStorage.removeItem("token");
      set({
        token: null,
        user: null,
        loading: false,
        error: "Session expired",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
