import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Bell, ChevronRight, Check, X, Filter, Mail, AlertTriangle, Calendar, Home, DollarSign, MessageSquare, FileText, Bell as BellIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/Button';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

type NotificationType = 'enquiry' | 'booking' | 'payment' | 'document' | 'project_update' | 'price_change' | 'site_visit' | 'offer' | 'general';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

const notificationIcons: Record<NotificationType, any> = {
  enquiry: MessageSquare,
  booking: Calendar,
  payment: DollarSign,
  document: FileText,
  project_update: Home,
  price_change: DollarSign,
  site_visit: Calendar,
  offer: AlertTriangle,
  general: Bell,
};

const notificationColors: Record<NotificationType, string> = {
  enquiry: '#3b82f6',
  booking: '#8b5cf6',
  payment: '#10b981',
  document: '#f59e0b',
  project_update: '#06b6d4',
  price_change: '#ef4444',
  site_visit: '#8b5cf6',
  offer: '#f97316',
  general: '#6b7280',
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setNotifications([
        { id: '1', type: 'enquiry', title: 'New Enquiry Received', message: 'Your enquiry for 3 BHK Luxury Apartment has been received by the developer.', time: '2 hours ago', read: false, actionUrl: '/(client)/enquiries/1' },
        { id: '2', type: 'booking', title: 'Site Visit Confirmed', message: 'Your site visit for Project Skyline Towers is confirmed for Tomorrow 10:00 AM.', time: '5 hours ago', read: false, actionUrl: '/(client)/bookings/1' },
        { id: '3', type: 'payment', title: 'Payment Successful', message: 'Your booking amount of ₹50,000 has been received for Project Green Valley.', time: '1 day ago', read: true },
        { id: '4', type: 'document', title: 'New Document Available', message: 'Floor plan brochure for Project Skyline Towers is now available for download.', time: '2 days ago', read: true, actionUrl: '/(client)/documents/1' },
        { id: '5', type: 'project_update', title: 'Construction Update', message: 'Tower A has reached 15th floor. Construction is on schedule.', time: '3 days ago', read: true },
        { id: '6', type: 'price_change', title: 'Price Drop Alert', message: '2 BHK units in Project Green Valley now starting at ₹65L (was ₹72L).', time: '4 days ago', read: false, actionUrl: '/(client)/explore' },
        { id: '7', type: 'site_visit', title: 'Site Visit Reminder', message: 'Reminder: Your site visit for Project Skyline Towers is tomorrow at 10:00 AM.', time: '5 days ago', read: true },
        { id: '8', type: 'offer', title: 'Limited Time Offer', message: 'Book by 31st Dec and get 1 year free maintenance worth ₹50,000.', time: '1 week ago', read: true },
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

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Notifications"
        leftAction={{ onPress: () => {} }}
        rightAction={{
          icon: unreadCount > 0 ? Check : Filter,
          onPress: unreadCount > 0 ? markAllAsRead : () => setFilter(filter === 'all' ? 'unread' : 'all'),
        }}
      />

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.unreadBannerAction}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[{ ...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {}) }]}
          onPress={() => setFilter('all')}
        >
          <Text style={[{ ...styles.filterTabText, ...(filter === 'all' ? styles.filterTabTextActive : {}) }]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ ...styles.filterTab, ...(filter === 'unread' ? styles.filterTabActive : {}) }]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[{ ...styles.filterTabText, ...(filter === 'unread' ? styles.filterTabTextActive : {}) }]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[600]]}
          />
        }
ListEmptyComponent={
          <EmptyState
            title={filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
            message={filter === 'unread'
              ? 'All caught up! New notifications will appear here.'
              : 'You have no notifications yet'}
            icon={<BellIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function NotificationItem({ notification, onPress }: { notification: Notification; onPress: () => void }) {
  const { colors } = useTheme();
  const Icon = notificationIcons[notification.type];
  const iconColor = notificationColors[notification.type];

  return (
    <TouchableOpacity style={styles.notificationItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[{ ...styles.notificationIcon, backgroundColor: `${iconColor}20` }]}>
        <Icon size={22} color={iconColor} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[{ ...styles.notificationTitle, ...(!notification.read && styles.notificationTitleUnread) }]}>
            {notification.title}
          </Text>
          {!notification.read && (
            <View style={styles.unreadDot} />
          )}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  unreadBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: '#fef3c7', borderBottomWidth: 1, borderBottomColor: '#fde68a' },
  unreadBannerText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#92400e' },
  unreadBannerAction: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold, color: '#b45309' },
  filterTabs: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.md },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.sm },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: '#f3f4f6' },
  notificationIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  notificationContent: { flex: 1, minWidth: 0 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  notificationTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', flex: 1 },
  notificationTitleUnread: { fontWeight: '700' },
  notificationMessage: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginBottom: Spacing.xs },
  notificationTime: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#facc15' },
});