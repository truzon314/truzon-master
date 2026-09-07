import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Users, MapPin, DollarSign, Settings, FileText, Bell, CreditCard } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) {
  let icon;
  switch (name) {
    case 'dashboard':
      icon = LayoutDashboard;
      break;
    case 'leads':
      icon = Users;
      break;
    case 'customers':
      icon = Users;
      break;
    case 'inventory':
      icon = CreditCard;
      break;
    case 'site-visits':
      icon = MapPin;
      break;
    case 'commissions':
      icon = DollarSign;
      break;
    case 'reports':
      icon = FileText;
      break;
    case 'notifications':
      icon = Bell;
      break;
    case 'profile':
      icon = Settings;
      break;
    default:
      icon = LayoutDashboard;
  }
  return React.createElement(icon, { size, color, strokeWidth: focused ? 2.5 : 2 });
}

export default function ProLayout() {
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
      <Tab.Screen name="dashboard" options={{ title: 'Dashboard' }} component={require('./dashboard').default} />
      <Tab.Screen name="leads" options={{ title: 'Leads' }} component={require('./leads').default} />
      <Tab.Screen name="customers" options={{ title: 'Customers' }} component={require('./customers').default} />
      <Tab.Screen name="inventory" options={{ title: 'Inventory' }} component={require('./inventory').default} />
      <Tab.Screen name="site-visits" options={{ title: 'Site Visits' }} component={require('./site-visits').default} />
      <Tab.Screen name="commissions" options={{ title: 'Commissions' }} component={require('./commissions').default} />
      <Tab.Screen name="profile" options={{ title: 'Profile' }} component={require('./profile').default} />
    </Tab.Navigator>
  );
}
