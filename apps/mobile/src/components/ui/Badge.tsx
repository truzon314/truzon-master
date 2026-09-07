import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.base, sizeStyles[size], variantStyles[variant](colors), style]}>
      <Text style={[styles.text, sizeTextStyles[size], variantTextStyles[variant](colors)]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 9999, paddingHorizontal: 8 },
  text: { fontWeight: '500' },
});

const sizeStyles = {
  sm: { paddingVertical: 2, paddingHorizontal: 6 },
  md: { paddingVertical: 4, paddingHorizontal: 10 },
  lg: { paddingVertical: 6, paddingHorizontal: 12 },
};

const sizeTextStyles = {
  sm: { fontSize: 10, fontFamily: 'WorkSans_600SemiBold' },
  md: { fontSize: 12, fontFamily: 'WorkSans_600SemiBold' },
  lg: { fontSize: 13, fontFamily: 'WorkSans_600SemiBold' },
};

const variantStyles = {
  default: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.gray[100] }),
  success: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.success.light }),
  warning: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.warning.light }),
  error: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.error.light }),
  danger: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.error.light }),
  info: (colors: typeof import('@/theme').colors) => ({ backgroundColor: '#dbeafe' }),
  primary: (colors: typeof import('@/theme').colors) => ({ backgroundColor: colors.primary[100] }),
  outline: (colors: typeof import('@/theme').colors) => ({ backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.gray[300] }),
};

const variantTextStyles = {
  default: (colors: typeof import('@/theme').colors) => ({ color: colors.gray[700] }),
  success: (colors: typeof import('@/theme').colors) => ({ color: colors.success.dark }),
  warning: (colors: typeof import('@/theme').colors) => ({ color: colors.warning.dark }),
  error: (colors: typeof import('@/theme').colors) => ({ color: colors.error.dark }),
  danger: (colors: typeof import('@/theme').colors) => ({ color: colors.error.dark }),
  info: (colors: typeof import('@/theme').colors) => ({ color: '#1e40af' }),
  primary: (colors: typeof import('@/theme').colors) => ({ color: colors.primary[700] }),
  outline: (colors: typeof import('@/theme').colors) => ({ color: colors.gray[700] }),
};