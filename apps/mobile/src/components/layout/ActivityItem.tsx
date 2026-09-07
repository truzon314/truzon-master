import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ActivityItemProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  time?: string;
  color?: string;
  activity?: {
    id?: string;
    type?: string;
    title?: string;
    subtitle?: string;
    time?: string;
    status?: string;
  };
}

export function ActivityItem({ icon, title: titleProp, description, time: timeProp, color, activity }: ActivityItemProps) {
  const title = titleProp || activity?.title || '';
  const time = timeProp || activity?.time;
  const desc = description || activity?.subtitle;
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 12 }}>
      {icon && (
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${color || '#facc15'}20`, justifyContent: 'center', alignItems: 'center' }}>
          {icon}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: 'WorkSans_500Medium', color: '#080d1a' }}>{title}</Text>
        {desc && <Text style={{ fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#6b7280', marginTop: 2 }}>{desc}</Text>}
      </View>
      {time && <Text style={{ fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#9ca3af' }}>{time}</Text>}
    </View>
  );
}
