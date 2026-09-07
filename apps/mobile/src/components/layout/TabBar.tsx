import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';

interface TabBarItem {
  name: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  badge?: number;
}

interface TabBarProps {
  tabs: TabBarItem[];
  activeTab: string;
  onTabPress: (name: string) => void;
  style?: StyleProp<ViewStyle>;
}

import { StyleProp, ViewStyle } from 'react-native';

const tabIcons: Record<string, { icon: ReactNode; activeIcon: ReactNode }> = {
  home: { icon: <View />, activeIcon: <View /> },
  explore: { icon: <View />, activeIcon: <View /> },
  saved: { icon: <View />, activeIcon: <View /> },
  profile: { icon: <View />, activeIcon: <View /> },
  dashboard: { icon: <View />, activeIcon: <View /> },
  leads: { icon: <View />, activeIcon: <View /> },
  visits: { icon: <View />, activeIcon: <View /> },
  commissions: { icon: <View />, activeIcon: <View /> },
  settings: { icon: <View />, activeIcon: <View /> },
  notifications: { icon: <View />, activeIcon: <View /> },
  reports: { icon: <View />, activeIcon: <View /> },
};

export const TabBar = ({ tabs, activeTab, onTabPress, style }: TabBarProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary, borderTopColor: colors.border.DEFAULT }, style]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              {isActive ? tab.activeIcon : tab.icon}
              {tab.badge && tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge > 9 ? '9+' : tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: isActive ? colors.primary[600] : colors.text.tertiary }]}>
              {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    height: 80,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 10, fontFamily: 'WorkSans_700Bold', color: '#ffffff' },
  label: { fontSize: 11, fontFamily: 'WorkSans_500Medium' },
});