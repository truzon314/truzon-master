import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}

export function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f3f4f6' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ fontSize: 14, fontFamily: 'WorkSans_400Regular', color: '#6b7280' }}>{title}</Text>
          <Text style={{ fontSize: 24, fontFamily: 'WorkSans_700Bold', color: '#080d1a', marginTop: 4 }}>{value}</Text>
        </View>
        {icon && <View style={{ padding: 8, backgroundColor: `${color || '#facc15'}20`, borderRadius: 12 }}>{icon}</View>}
      </View>
      {trend && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 }}>
          <Text style={{ fontSize: 12, fontFamily: 'WorkSans_500Medium', color: trend.isPositive ? '#16a34a' : '#dc2626' }}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#9ca3af' }}>vs last month</Text>
        </View>
      )}
    </View>
  );
}
