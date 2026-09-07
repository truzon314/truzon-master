import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { forwardRef, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

import { TouchableOpacityProps, StyleProp } from 'react-native';

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      style,
      onPress,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const isDisabled = disabled || loading;

    const baseStyles = [
      styles.base,
      fullWidth && styles.fullWidth,
      sizeStyles[size],
      variantStyles[variant](colors),
      isDisabled && styles.disabled,
      style,
    ];

    return (
      <TouchableOpacity
        ref={ref}
        {...props}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.8}
        style={baseStyles}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.text.inverse : colors.primary[600]}
            style={styles.spinner}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={[
              styles.text,
              sizeTextStyles[size],
              variantTextStyles[variant](colors),
            ]}>
              {children}
            </Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.6 },
  text: { fontFamily: 'WorkSans_600SemiBold' },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
  spinner: { marginHorizontal: 8 },
});

const sizeStyles = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 40, borderRadius: 8 },
  md: { paddingVertical: 14, paddingHorizontal: 20, minHeight: 50, borderRadius: 12 },
  lg: { paddingVertical: 18, paddingHorizontal: 24, minHeight: 56, borderRadius: 16 },
};

const sizeTextStyles = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const variantStyles = {
  primary: (colors: typeof import('@/theme').colors) => ({
    backgroundColor: colors.primary[600],
    borderWidth: 0,
  }),
  secondary: (colors: typeof import('@/theme').colors) => ({
    backgroundColor: colors.navy[900],
    borderWidth: 0,
  }),
  outline: (colors: typeof import('@/theme').colors) => ({
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary[600],
  }),
  ghost: (colors: typeof import('@/theme').colors) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
  }),
  danger: (colors: typeof import('@/theme').colors) => ({
    backgroundColor: colors.error.DEFAULT,
    borderWidth: 0,
  }),
};

const variantTextStyles = {
  primary: (colors: typeof import('@/theme').colors) => ({ color: colors.text.inverse }),
  secondary: (colors: typeof import('@/theme').colors) => ({ color: colors.text.inverse }),
  outline: (colors: typeof import('@/theme').colors) => ({ color: colors.primary[600] }),
  ghost: (colors: typeof import('@/theme').colors) => ({ color: colors.primary[600] }),
  danger: (colors: typeof import('@/theme').colors) => ({ color: colors.text.inverse }),
};

import { View } from 'react-native';