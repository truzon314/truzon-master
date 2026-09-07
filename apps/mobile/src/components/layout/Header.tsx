import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftAction?: React.ReactNode | { onPress?: () => void };
  showProfile?: boolean;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  notificationCount?: number;
  rightActions?: React.ReactNode;
  rightAction?: { icon: any; onPress: () => void };
}

import { ReactNode } from 'react';

export const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  leftAction,
  showProfile = true,
  onProfilePress,
  onNotificationPress,
  onSearchPress,
  notificationCount = 0,
  rightActions,
  rightAction,
}: HeaderProps) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
            <Menu size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {leftAction && (
          typeof leftAction === 'object' && 'onPress' in leftAction ? (
            <TouchableOpacity onPress={(leftAction as { onPress?: () => void }).onPress} style={styles.iconButton} activeOpacity={0.7}>
              <Menu size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ) : leftAction as React.ReactNode
        )}
        {(title || subtitle) && (
          <View style={styles.titleContainer}>
            {title && <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>}
            {subtitle && <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>{subtitle}</Text>}
          </View>
        )}
        <View style={styles.rightActions}>
          {onSearchPress && (
            <TouchableOpacity onPress={onSearchPress} style={styles.iconButton} activeOpacity={0.7}>
              <Search size={22} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {onNotificationPress && (
            <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton} activeOpacity={0.7}>
              <View style={styles.notificationWrapper}>
                <Bell size={22} color={colors.text.primary} />
                {notificationCount > 0 && (
                  <Badge variant="error" size="sm" style={styles.badge}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </View>
            </TouchableOpacity>
          )}
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={styles.iconButton} activeOpacity={0.7}>
              <rightAction.icon size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {rightActions}
          {showProfile && onProfilePress && (
            <TouchableOpacity onPress={onProfilePress} style={styles.profileButton} activeOpacity={0.7}>
              <Avatar name="John Doe" size="sm" />
              <ChevronDown size={16} color={colors.text.tertiary} style={styles.chevron} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleContainer: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 18, fontFamily: 'WorkSans_600SemiBold' },
  subtitle: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 2 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { padding: 8, borderRadius: 8 },
  notificationWrapper: { position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18 },
  profileButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  chevron: { marginTop: 2 },
});