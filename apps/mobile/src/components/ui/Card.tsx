import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
}

export const Card = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
  onPress,
}: CardProps) => {
  const { colors } = useTheme();

  const baseStyles = [
    styles.base,
    paddingStyles[padding],
    variantStyles[variant](colors),
    style,
  ];

  const handlePress = () => onPress?.();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.9 : 1}
      style={baseStyles}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 16, backgroundColor: '#ffffff' },
});

const paddingStyles = {
  none: { padding: 0 },
  sm: { padding: 12 },
  md: { padding: 16 },
  lg: { padding: 20 },
};

const variantStyles = {
  default: (colors: typeof import('@/theme').colors) => ({
    borderWidth: 0,
  }),
  outlined: (colors: typeof import('@/theme').colors) => ({
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
  }),
  elevated: (colors: typeof import('@/theme').colors) => ({
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }),
};

export const CardHeader = ({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[cardStyles.cardHeader, style]}>{children}</View>
);

export const CardTitle = ({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[cardStyles.cardTitle, style]}>{children}</Text>
);

export const CardDescription = ({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[cardStyles.cardDescription, style]}>{children}</Text>
);

export const CardContent = ({ children, style, className }: { children: ReactNode; style?: StyleProp<ViewStyle>; className?: string }) => (
  <View style={[cardStyles.cardContent, style]}>{children}</View>
);

export const CardFooter = ({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[cardStyles.cardFooter, style]}>{children}</View>
);

const cardStyles = StyleSheet.create({
  cardHeader: { marginBottom: 12 },
  cardTitle: { fontSize: 18, fontFamily: 'WorkSans_600SemiBold', color: '#080d1a' },
  cardDescription: { fontSize: 14, fontFamily: 'WorkSans_400Regular', color: '#6b7280', marginTop: 4 },
  cardContent: {},
  cardFooter: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
});
