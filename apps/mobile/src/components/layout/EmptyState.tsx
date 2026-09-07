import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  icon,
  title,
  message,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }, style]}>
      <View style={styles.iconWrapper}>
        {icon || <Text style={{ fontSize: 64, color: colors.text.tertiary }}>🔍</Text>}
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      {(message || description) && <Text style={[styles.message, { color: colors.text.tertiary }]}>{message || description}</Text>}
      {(actionLabel || secondaryLabel) && (
        <View style={styles.actions}>
          {actionLabel && onAction && (
            <Button variant="primary" onPress={onAction} style={styles.actionButton}>
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && onSecondaryAction && (
            <Button variant="outline" onPress={onSecondaryAction} style={styles.secondaryButton}>
              {secondaryLabel}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

export const NoResultsState = ({ onClearFilters }: { onClearFilters?: () => void }) => (
  <EmptyState
    title="No Results Found"
    message="Try adjusting your filters or search terms"
    actionLabel={onClearFilters ? 'Clear Filters' : undefined}
    onAction={onClearFilters}
  />
);

export const NoNetworkState = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    title="No Internet Connection"
    message="Please check your connection and try again"
    actionLabel="Retry"
    onAction={onRetry}
  />
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }: { message?: string; onRetry?: () => void }) => (
  <EmptyState
    title="Error"
    message={message}
    actionLabel="Try Again"
    onAction={onRetry}
  />
);

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
      <Text style={[styles.loadingText, { color: colors.text.tertiary, marginTop: 16 }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconWrapper: { marginBottom: 24 },
  title: { fontSize: 20, fontFamily: 'WorkSans_600SemiBold', textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 16, fontFamily: 'WorkSans_400Regular', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  actions: { flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' },
  actionButton: { flex: 1, maxWidth: 160 },
  secondaryButton: { flex: 1, maxWidth: 160 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, fontFamily: 'WorkSans_400Regular' },
});