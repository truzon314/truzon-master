import { StyleSheet, View, TouchableOpacity, Animated, Text, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X } from 'lucide-react-native';
import { useRef, useEffect, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface BottomSheetProps {
  visible?: boolean;
  isVisible?: boolean;
  onClose: () => void;
  children?: ReactNode;
  content?: ReactNode;
  title?: string;
  subtitle?: string;
  showHandle?: boolean;
  maxHeight?: number | string;
  style?: StyleProp<ViewStyle>;
}

export const BottomSheet = ({
  visible,
  isVisible,
  onClose,
  children,
  content,
  title,
  subtitle,
  showHandle = true,
  maxHeight = '85%',
  style,
}: BottomSheetProps) => {
  const isShown = visible ?? isVisible ?? false;
  if (!isShown) return null;

  const { colors, shadows } = useTheme();
  const translateY = useRef(new Animated.Value(1)).current;

  const maxHeightValue = typeof maxHeight === 'string' ? (parseInt(maxHeight) / 100) * 800 : maxHeight;

  const animatedStyle = useRef(
    translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxHeightValue + 50],
    })
  ).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Keyboard.dismiss();
  }, [visible, translateY]);

  const close = () => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <TouchableOpacity onPress={close} activeOpacity={1} style={styles.overlay}>
      <Animated.View
        style={[
          styles.sheet,
          { maxHeight: maxHeightValue, ...shadows.lg },
          { transform: [{ translateY: animatedStyle }] },
          style,
        ]}
      >
        <View style={styles.handleContainer}>
          {showHandle && <View style={[styles.handle, { backgroundColor: colors.border.DEFAULT }]} />}
        </View>
        {(title || subtitle) && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {title && <Text style={[styles.sheetTitle, { color: colors.text.primary }]}>{title}</Text>}
              {subtitle && <Text style={[styles.sheetSubtitle, { color: colors.text.tertiary }]}>{subtitle}</Text>}
            </View>
            <TouchableOpacity onPress={close} style={styles.closeButton} activeOpacity={0.7}>
              <X size={24} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.content}>{children ?? content}</View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 13, 26, 0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    width: '100%',
  },
  handleContainer: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
  headerContent: { flex: 1 },
  sheetTitle: { fontSize: 18, fontFamily: 'WorkSans_600SemiBold' },
  sheetSubtitle: { fontSize: 14, fontFamily: 'WorkSans_400Regular', marginTop: 2 },
  closeButton: { padding: 8 },
  content: { paddingBottom: 20 },
});