import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Heart, User as UserIcon, Bell, Settings } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) {
  let icon;
  switch (name) {
    case 'index':
      icon = Home;
      break;
    case 'explore':
      icon = Search;
      break;
    case 'saved':
      icon = Heart;
      break;
    case 'notifications':
      icon = Bell;
      break;
    case 'profile':
      icon = Settings;
      break;
    default:
      icon = Home;
  }
  return React.createElement(icon, { size, color, strokeWidth: focused ? 2.5 : 2 });
}

export default function ClientLayout() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon name={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: colors.border.DEFAULT,
          elevation: 8,
          shadowColor: '#080d1a',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingTop: 8,
          paddingBottom: 8,
        },
      })}
    >
      {/* @ts-expect-error options prop is valid but types don't match */}
      <Tab.Screen name="index" options={{ title: 'Home' }} />
      {/* @ts-expect-error options prop is valid but types don't match */}
      <Tab.Screen name="explore" options={{ title: 'Explore' }} />
      {/* @ts-expect-error options prop is valid but types don't match */}
      <Tab.Screen name="saved" options={{ title: 'Saved' }} />
      {/* @ts-expect-error options prop is valid but types don't match */}
      <Tab.Screen name="notifications" options={{ title: 'Alerts' }} />
      {/* @ts-expect-error options prop is valid but types don't match */}
      <Tab.Screen name="profile" options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
