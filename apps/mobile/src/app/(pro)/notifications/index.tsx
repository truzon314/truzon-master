import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Bell, BellOff, Check, CheckCheck, Trash2, Settings, MessageSquare, Calendar, DollarSign, Users, Home, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { Spacing, Typography, BorderRadius } from '@/theme';

type NotificationType = 'LEAD' | 'BOOKING' | 'PAYMENT' | 'VISIT' | 'UPDATE' | 'ALERT';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const typeConfig: Record<NotificationType, { color: string; icon: any }> = {
  LEAD: { color: '#3b82f6', icon: Users },
  BOOKING: { color: '#8b5cf6', icon: Calendar },
  PAYMENT: { color: '#10b981', icon: DollarSign },
  VISIT: { color: '#f59e0b', icon: Home },
  UPDATE: { color: '#06b6d4', icon: MessageSquare },
  ALERT: { color: '#ef4444', icon: AlertTriangle },
};

const getTypeConfig = (type: NotificationType) => typeConfig[type];

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      setNotifications([
        { id: '1', type: 'LEAD', title: 'New Lead Assigned', message: 'Rajesh Kumar has been assigned to you for follow-up', timestamp: '2024-01-25T10:30:00Z', read: false, actionUrl: '/leads/1' },
        { id: '2', type: 'BOOKING', title: 'Site Visit Confirmed', message: 'Site visit with Priya Sharma confirmed for tomorrow at 10 AM', timestamp: '2024-01-25T09:15:00Z', read: false, actionUrl: '/bookings/1' },
        { id: '3', type: 'PAYMENT', title: 'Payment Received', message: 'Booking amount of ₹50,000 received for Skyline Towers Unit 4B', timestamp: '2024-01-24T16:45:00Z', read: true },
        { id: '4', type: 'ALERT', title: 'Follow-up Overdue', message: 'Follow-up with Vikram Patel was scheduled yesterday', timestamp: '2024-01-24T09:00:00Z', read: true, actionUrl: '/leads/3' },
        { id: '5', type: 'UPDATE', title: 'Lead Status Updated', message: 'Lead status changed to Qualified for Amit Singh', timestamp: '2024-01-23T14:20:00Z', read: true },
      ]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    Alert.alert('Delete Notification', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setNotifications(prev => prev.filter(n => n.id !== id)) },
    ]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Notifications"
        showBack
        onBack={() => router.back()}
        rightActions={
          <View style={styles.headerRight}>
            {unreadCount > 0 && <Badge variant="error">{unreadCount}</Badge>}
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <CheckCheck size={24} color={colors.primary[600]} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onRead={() => markAsRead(item.id)}
            onDelete={() => deleteNotification(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary[600]]} />}
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            message="You're all caught up!"
            icon={<BellOff size={48} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function NotificationCard({ notification, onRead, onDelete }: { notification: Notification; onRead: () => void; onDelete: () => void }) {
  const { colors } = useTheme();
  const config = getTypeConfig(notification.type);

  return (
    <TouchableOpacity
      style={[styles.card, !notification.read && styles.cardUnread]}
      activeOpacity={0.8}
      onPress={onRead}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
          <config.icon size={20} color={config.color} />
        </View>
        <View style={styles.textContent}>
          <Text style={[styles.title, !notification.read && styles.titleUnread]}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
          <Text style={styles.timestamp}>{new Date(notification.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={18} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>
      {!notification.read && <View style={[styles.unreadIndicator, { backgroundColor: colors.primary[600] }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.md },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.sm },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardUnread: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  cardContent: { flexDirection: 'row' as const, padding: Spacing.md, gap: Spacing.md, alignItems: 'flex-start' as const },
  iconContainer: { width: 40, height: 40, borderRadius: BorderRadius.lg, justifyContent: 'center' as const, alignItems: 'center' as const },
  textContent: { flex: 1, minWidth: 0 },
  title: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  titleUnread: { fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  message: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#9ca3af', marginTop: 4 },
  timestamp: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: '#d1d5db', marginTop: Spacing.sm },
  deleteButton: { padding: Spacing.xs },
  unreadIndicator: { width: 8, height: 8, borderRadius: 4, position: 'absolute' as const, top: Spacing.md, right: Spacing.md },
});