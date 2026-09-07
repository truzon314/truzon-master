import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  avatar?: string;
  isVerified?: boolean;
  passwordChangedAt?: string;
  role: {
    id: string;
    name: string;
    permissions: Array<{ key: string }>;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notificationCount: number;
  roleType: string;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyOTP: (data: { phone: string; otp: string }) => Promise<void>;
  resendOTP: (phone?: string) => Promise<void>;
  resetPassword: (data: { phone: string; otp: string; newPassword: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  phone?: string;
  fullName: string;
  password: string;
  confirmPassword?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      notificationCount: 0,
      roleType: 'customer',

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user } = response.data;
        set({ accessToken, refreshToken, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        const { accessToken, refreshToken, user } = response.data;
        set({ accessToken, refreshToken, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await api.post('/auth/logout', { refreshToken });
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        delete api.defaults.headers.common['Authorization'];
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          set({ accessToken, refreshToken: newRefreshToken });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        try {
          const { accessToken, refreshToken } = get();
          if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            try {
              const response = await api.get('/auth/me', { timeout: 4000 });
              set({ user: response.data, isAuthenticated: true });
            } catch (error) {
              if (refreshToken) {
                try {
                  await get().refreshAccessToken();
                  const response = await api.get('/auth/me', { timeout: 4000 });
                  set({ user: response.data, isAuthenticated: true });
                } catch {
                  set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
                }
              } else {
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
              }
            }
          }
        } catch (e) {
          console.warn('[checkAuth] Error verifying auth:', e);
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (email: string) => {
        await api.post('/auth/forgot-password', { email });
      },

      verifyOTP: async (data: { phone: string; otp: string }) => {
        const response = await api.post('/auth/verify-otp', data);
        const { accessToken, refreshToken, user, roleType } = response.data;
        set({ accessToken, refreshToken, user, roleType: roleType || 'customer', isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      resendOTP: async (phone?: string) => {
        const { user } = get();
        const email = user?.email;
        if (email || phone) {
          await api.post('/auth/resend-otp', phone ? { phone } : { email });
        }
      },

      resetPassword: async (data: { phone: string; otp: string; newPassword: string }) => {
        await api.post('/auth/reset-password', data);
      },

      updateProfile: async (data: Partial<User>) => {
        const response = await api.put('/auth/profile', data);
        set({ user: response.data });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import React from 'react';