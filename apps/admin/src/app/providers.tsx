'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { store } from '@/store';
import { Provider, useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/store/slices/authSlice';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const refreshToken = typeof window !== 'undefined' ? (localStorage.getItem('refreshToken') || '') : '';
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (accessToken && userStr) {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, accessToken, refreshToken }));
      } else {
        dispatch(setLoading(false));
      }
    } catch {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
      </Provider>
    </ThemeProvider>
  );
}