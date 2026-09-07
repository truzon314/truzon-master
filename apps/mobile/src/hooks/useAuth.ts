import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export function useAuth() {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    roleType,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    roleType,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    checkAuth,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading, roleType } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    roleType,
    isCustomer: roleType === 'customer',
    isPro: roleType === 'channel_partner',
  };
}