import { StyleSheet, View, Text, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoadingOverlay = ({ visible, message = 'Loading...', style }: LoadingOverlayProps) => {
  if (!visible) return null;

  const { colors } = useTheme();

  return (
    <View style={[loadingStyles.overlay, style]}>
      <View style={loadingStyles.content}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        {message && <Text style={[loadingStyles.message, { color: colors.text.secondary, marginTop: 16 }]}>{message}</Text>}
      </View>
    </View>
  );
};

export const LoadingButton = ({ loading, children, ...props }: { loading: boolean; children: React.ReactNode } & React.ComponentPropsWithoutRef<typeof TouchableOpacity>) => {
  return (
    <TouchableOpacity {...props} disabled={loading} activeOpacity={loading ? 1 : 0.8}>
      {loading ? (
        <ActivityIndicator size="small" color={'#ffffff'} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export const PullToRefresh = ({ refreshing, onRefresh, children, progressBackgroundColor, progressViewColor }: {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  progressBackgroundColor?: string;
  progressViewColor?: string;
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={progressBackgroundColor || colors.background.primary}
          colors={[progressViewColor || colors.primary[600]]}
          tintColor={progressViewColor || colors.primary[600]}
          titleColor={colors.text.tertiary}
        />
      }
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {children}
    </ScrollView>
  );
};

const loadingStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 13, 26, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  content: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center' },
  message: { fontSize: 16, fontFamily: 'WorkSans_400Regular', marginTop: 16 },
});
