import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Calendar, ChevronRight, Filter, MapPin, Home, Clock, CheckCircle, X, AlertTriangle, Navigation, Phone, MessageSquare, DollarSign, FileText, Calendar as CalendarIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

type BookingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

interface Booking {
  id: string;
  type: 'SITE_VISIT' | 'BOOKING' | 'AGREEMENT' | 'HANDOVER';
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyLocation: string;
  propertyPrice: number;
  status: BookingStatus;
  scheduledAt: string;
  confirmedAt?: string;
  completedAt?: string;
  address: string;
  agentName: string;
  agentPhone: string;
  notes?: string;
  documents?: string[];
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: any }> = {
  SCHEDULED: { label: 'Scheduled', color: '#f59e0b', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: '#3b82f6', icon: CheckCircle },
  COMPLETED: { label: 'Completed', color: '#10b981', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: X },
  RESCHEDULED: { label: 'Rescheduled', color: '#8b5cf6', icon: AlertTriangle },
};

const typeConfig = {
  SITE_VISIT: { label: 'Site Visit', icon: Navigation, color: '#3b82f6' },
  BOOKING: { label: 'Booking', icon: Home, color: '#8b5cf6' },
  AGREEMENT: { label: 'Agreement', icon: FileText, color: '#f59e0b' },
  HANDOVER: { label: 'Handover', icon: CheckCircle, color: '#10b981' },
};

const getStatusConfig = (status: BookingStatus) => statusConfig[status];
const getTypeConfig = (type: Booking['type']) => typeConfig[type];

export default function BookingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setBookings([
        { id: '1', type: 'SITE_VISIT', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', propertyPrice: 12500000, status: 'CONFIRMED', scheduledAt: '2024-01-25T10:00:00Z', confirmedAt: '2024-01-22T14:00:00Z', address: 'Project Skyline Towers, Banjara Hills, Hyderabad', agentName: 'Rajesh Kumar', agentPhone: '+91 98765 43210', notes: 'Bring ID proof for entry' },
        { id: '2', type: 'BOOKING', propertyId: '2', propertyTitle: '2 BHK Modern Flat', propertyLocation: 'Gachibowli, Hyderabad', propertyPrice: 7800000, status: 'SCHEDULED', scheduledAt: '2024-01-28T11:00:00Z', address: 'Project Green Valley, Gachibowli, Hyderabad', agentName: 'Priya Sharma', agentPhone: '+91 98765 43211', notes: 'Booking amount: ₹50,000' },
        { id: '3', type: 'AGREEMENT', propertyId: '3', propertyTitle: '3 BHK Premium Apartment', propertyLocation: 'Kondapur, Hyderabad', propertyPrice: 9500000, status: 'COMPLETED', scheduledAt: '2024-01-10T14:00:00Z', completedAt: '2024-01-10T16:00:00Z', address: 'Builder Office, Kondapur, Hyderabad', agentName: 'Rajesh Kumar', agentPhone: '+91 98765 43210', documents: ['Agreement.pdf', 'Payment_Receipt.pdf'] },
        { id: '4', type: 'SITE_VISIT', propertyId: '4', propertyTitle: '4 BHK Villa', propertyLocation: 'Jubilee Hills, Hyderabad', propertyPrice: 35000000, status: 'CANCELLED', scheduledAt: '2024-01-15T10:00:00Z', address: 'Project Royal Gardens, Jubilee Hills, Hyderabad', agentName: 'Amit Singh', agentPhone: '+91 98765 43212' },
        { id: '5', type: 'HANDOVER', propertyId: '5', propertyTitle: '2 BHK Budget Flat', propertyLocation: 'Madhapur, Hyderabad', propertyPrice: 5500000, status: 'SCHEDULED', scheduledAt: '2024-02-15T10:00:00Z', address: 'Project Green Valley, Madhapur, Hyderabad', agentName: 'Priya Sharma', agentPhone: '+91 98765 43211', notes: 'Final payment due before handover' },
      ]);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const filteredBookings = bookings.filter(b => {
    const now = new Date();
    const scheduled = new Date(b.scheduledAt);
    if (filter === 'upcoming') return scheduled >= now && b.status !== 'CANCELLED';
    if (filter === 'past') return scheduled < now || b.status === 'CANCELLED';
    return true;
  });

  const getStatusConfig = (status: BookingStatus) => statusConfig[status];
  const getTypeConfig = (type: Booking['type']) => typeConfig[type];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
<Header
  title="Bookings & Visits"
  showBack
  onBack={() => {}}
  rightActions={<Filter size={24} color={colors.text.tertiary} onPress={() => {}} />}
/>

      <View style={styles.filterTabs}>
        <FilterTab label="All" count={bookings.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Upcoming" count={bookings.filter(b => new Date(b.scheduledAt) >= new Date() && b.status !== 'CANCELLED').length} active={filter === 'upcoming'} onPress={() => setFilter('upcoming')} />
        <FilterTab label="Past" count={bookings.filter(b => new Date(b.scheduledAt) < new Date() || b.status === 'CANCELLED').length} active={filter === 'past'} onPress={() => setFilter('past')} />
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={({ item }) => (
          <BookingCard booking={item} onPress={() => router.push(`/(client)/bookings/${item.id}`)} />
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
            title="No Bookings"
            message={filter === 'all' ? 'Schedule site visits or bookings from property details' : 'No bookings in this category'}
            actionLabel="Explore Properties"
            onAction={() => router.push('/(client)/explore')}
            icon={<CalendarIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function FilterTab({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[{ ...styles.filterTab, ...(active ? styles.filterTabActive : {}) }]} onPress={onPress}>
      <Text style={[{ ...styles.filterTabText, ...(active ? styles.filterTabTextActive : {}) }]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

function BookingCard({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(booking.status);
  const type = getTypeConfig(booking.type);
  const isUpcoming = new Date(booking.scheduledAt) >= new Date();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[{ ...styles.typeBadge, backgroundColor: `${type.color}20` }]}>
          <type.icon size={20} color={type.color} />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeLabel}>{type.label}</Text>
          <Text style={styles.propertyTitle}>{booking.propertyTitle}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={booking.status === 'COMPLETED' ? 'success' : booking.status === 'CANCELLED' ? 'error' : booking.status === 'CONFIRMED' ? 'info' : 'warning'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{booking.propertyLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{formatDateTime(booking.scheduledAt)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text>
        </View>
        {booking.notes && (
          <View style={styles.notesRow}>
            <AlertTriangle size={16} color={colors.warning.DEFAULT} />
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.agentInfo}>
          <Text style={styles.agentLabel}>Agent</Text>
          <View style={styles.agentRow}>
            <Text style={styles.agentName}>{booking.agentName}</Text>
            <TouchableOpacity style={styles.callButton} onPress={(e) => { e.stopPropagation(); Alert.alert('Call', `Call ${booking.agentPhone}?`); }}>
              <Phone size={16} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>
        {isUpcoming && booking.status !== 'CANCELLED' && (
          <View style={styles.actions}>
            <Button variant="outline" size="sm" onPress={(e) => { e.stopPropagation(); Alert.alert('Reschedule', 'Reschedule functionality coming soon'); }}>
              Reschedule
            </Button>
            <Button variant="danger" size="sm" onPress={(e) => { e.stopPropagation(); Alert.alert('Cancel', 'Are you sure you want to cancel this booking?'); }}>
              Cancel
            </Button>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  filterTabs: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  typeBadge: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  typeInfo: { flex: 1, minWidth: 0 },
  typeLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginTop: 2 },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, flex: 1 },
  notesRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, backgroundColor: '#fef3c7', borderRadius: BorderRadius.md, marginTop: Spacing.xs },
  notesText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#92400e', flex: 1 },
  cardFooter: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  agentInfo: { flex: 1 },
  agentLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  agentName: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  callButton: { padding: Spacing.xs },
  actions: { flexDirection: 'row', gap: Spacing.sm },
});