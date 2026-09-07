import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme, Theme } from '@/theme';

export function useTheme(): Theme {
  const colorScheme = useColorScheme();

  const resolvedTheme = useMemo(() => {
    if (colorScheme === 'dark') {
      return {
        ...theme,
        colors: {
          ...theme.colors,
          background: {
            primary: '#080d1a',
            secondary: '#102a43',
            tertiary: '#1f2937',
          },
          text: {
            ...theme.colors.text,
            primary: '#f9fafb',
            secondary: '#e5e7eb',
            tertiary: '#9ca3af',
          },
          border: {
            ...theme.colors.border,
            DEFAULT: '#374151',
          },
        },
      };
    }
    return theme;
  }, [colorScheme]);

  return resolvedTheme;
}