import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
}

import { StyleProp, ViewStyle } from 'react-native';

export const Avatar = ({ source, name, size = 'md', style }: AvatarProps) => {
  const { colors } = useTheme();

  const sizeMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
  const fontSizeMap = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20 };

  const sizeValue = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const colorIndex = name ? name.charCodeAt(0) % 6 : 0;
  const bgColors = [
    colors.primary[100],
    colors.success.light,
    colors.warning.light,
    colors.error.light,
    '#dbeafe',
    '#f3e8ff',
  ];
  const textColors = [
    colors.primary[700],
    colors.success.dark,
    colors.warning.dark,
    colors.error.dark,
    '#1e40af',
    '#6b21a8',
  ];

  const bgColor = bgColors[colorIndex];
  const textColor = textColors[colorIndex];

  if (source) {
    return (
      <View style={[styles.container, { width: sizeValue, height: sizeValue }, style]}>
        <Image
          source={source}
          style={[styles.image, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2, backgroundColor: bgColor },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize, color: textColor }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  image: { borderRadius: 9999 },
  text: { fontFamily: 'WorkSans_600SemiBold' },
});

import { Image } from 'react-native';