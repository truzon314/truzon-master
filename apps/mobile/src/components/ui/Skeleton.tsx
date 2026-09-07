import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

import { StyleProp, ViewStyle } from 'react-native';

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius, backgroundColor: colors.gray[200] } as any,
        style,
      ]}
    />
  );
};

export const SkeletonText = ({ lines = 3, spacing = 8, style }: { lines?: number; spacing?: number; style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={[styles.textContainer, { gap: spacing }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} borderRadius={4} />
      ))}
    </View>
  );
};

export const SkeletonCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { colors, shadows, borderRadius } = useTheme();

  return (
    <View style={[styles.card, { ...shadows.DEFAULT, borderRadius: 16, backgroundColor: colors.background.primary }, style]}>
      <Skeleton width="100%" height={180} borderRadius={16} style={styles.image} />
      <View style={styles.content}>
        <Skeleton width="70%" height={20} borderRadius={4} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.gap} />
        <Skeleton width="50%" height={14} borderRadius={4} />
      </View>
    </View>
  );
};

export const SkeletonPropertyCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={[styles.propertyCard, style]}>
      <Skeleton width="100%" height={180} borderRadius={12} />
      <View style={styles.content}>
        <Skeleton width="60%" height={18} borderRadius={4} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.gap} />
        <Skeleton width="80%" height={14} borderRadius={4} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.gap} />
        <View style={styles.priceRow}>
          <Skeleton width={80} height={22} borderRadius={4} />
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  textContainer: { flexDirection: 'column' },
  card: { padding: 12 },
  image: { marginBottom: 12 },
  content: { gap: 8 },
  gap: { marginVertical: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  propertyCard: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#ffffff' },
});