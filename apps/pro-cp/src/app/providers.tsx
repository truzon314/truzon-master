'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '@/store';
import { setUser, setLoading, DEFAULT_PRO_USER, DEFAULT_CP_USER } from '@/store/slices/authSlice';
import { Toaster } from '@/components/ui/Toaster';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pro_cp_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch(setUser(parsed));
      } else {
        // Safe initial default: Pro Sales Agent
        dispatch(setUser(DEFAULT_PRO_USER));
      }
    } catch {
      dispatch(setUser(DEFAULT_PRO_USER));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <AuthInitializer>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthInitializer>
    </Provider>
  );
}

export default Providers;