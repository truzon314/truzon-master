import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ChartCardProps {
  title: string;
  children?: React.ReactNode;
  style?: any;
  data?: { label: string; value: number; color?: string }[];
  type?: string;
  height?: number;
  color?: string;
}

export function ChartCard({ title, children, style }: ChartCardProps) {
  return (
    <View style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f3f4f6' }, style]}>
      <Text style={{ fontSize: 16, fontFamily: 'WorkSans_600SemiBold', color: '#080d1a', marginBottom: 16 }}>{title}</Text>
      {children}
    </View>
  );
}
