import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Calendar, ChevronRight, Filter, MapPin, Home, Clock, CheckCircle, X, AlertTriangle, Navigation, Phone, DollarSign, FileText, Calendar as CalendarIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { Spacing, Typography, BorderRadius } from '@/theme';

type BookingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

interface Booking {
  id: string;
  type: 'SITE_VISIT' | 'BOOKING' | 'AGREEMENT' | 'HANDOVER';
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  status: BookingStatus;
  scheduledAt: string;
  confirmedAt?: string;
  completedAt?: string;
  address: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
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

export default function ProBookingsScreen() {
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
      setBookings([
        { id: '1', type: 'SITE_VISIT', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills', propertyPrice: 12500000, status: 'CONFIRMED', scheduledAt: '2024-01-25T10:00:00Z', address: 'Skyline Towers, Banjara Hills', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210' },
        { id: '2', type: 'BOOKING', propertyId: '2', propertyTitle: '2 BHK Modern Flat', propertyLocation: 'Gachibowli', propertyPrice: 7800000, status: 'SCHEDULED', scheduledAt: '2024-01-28T11:00:00Z', address: 'Green Valley, Gachibowli', customerName: 'Priya Sharma', customerPhone: '+91 98765 43211' },
        { id: '3', type: 'AGREEMENT', propertyId: '3', propertyTitle: '3 BHK Premium Apartment', propertyLocation: 'Kondapur', propertyPrice: 9500000, status: 'COMPLETED', scheduledAt: '2024-01-10T14:00:00Z', completedAt: '2024-01-10T16:00:00Z', address: 'Builder Office, Kondapur', customerName: 'Amit Singh', customerPhone: '+91 98765 43212' },
        { id: '4', type: 'SITE_VISIT', propertyId: '4', propertyTitle: '4 BHK Villa', propertyLocation: 'Jubilee Hills', propertyPrice: 35000000, status: 'CANCELLED', scheduledAt: '2024-01-15T10:00:00Z', address: 'Royal Gardens, Jubilee Hills', customerName: 'Vikram Patel', customerPhone: '+91 98765 43213' },
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Bookings"
        showBack
        onBack={() => router.back()}
        rightActions={<Filter size={24} color={colors.text.tertiary} onPress={() => {}} />}
      />

      <View style={styles.filterArea}>
        <FilterTab label="All" count={bookings.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Upcoming" count={bookings.filter(b => new Date(b.scheduledAt) >= new Date() && b.status !== 'CANCELLED').length} active={filter === 'upcoming'} onPress={() => setFilter('upcoming')} />
        <FilterTab label="Past" count={bookings.filter(b => new Date(b.scheduledAt) < new Date() || b.status === 'CANCELLED').length} active={filter === 'past'} onPress={() => setFilter('past')} />
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={({ item }) => <BookingCard booking={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary[600]]} />}
        ListEmptyComponent={
          <EmptyState
            title="No Bookings"
            message="No bookings found"
            actionLabel="Create Booking"
            onAction={() => {}}
            icon={<CalendarIcon size={48} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function FilterTab({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.filterTab, active && styles.filterTabActive]} onPress={onPress}>
      <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{label} ({count})</Text>
    </TouchableOpacity>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { colors } = useTheme();
  const status = getStatusConfig(booking.status);
  const type = getTypeConfig(booking.type);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: `${type.color}20` }]}>
          <type.icon size={20} color={type.color} />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeLabel}>{type.label}</Text>
          <Text style={styles.propertyTitle}>{booking.propertyTitle}</Text>
        </View>
        <Badge variant={booking.status === 'COMPLETED' ? 'success' : booking.status === 'CANCELLED' ? 'error' : 'warning'}>
          {status.label}
        </Badge>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{booking.propertyLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{new Date(booking.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{booking.customerName}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>₹{booking.propertyPrice.toLocaleString()}</Text>
        <ChevronRight size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterArea: { flexDirection: 'row' as const, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' as const },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' as const },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: Spacing.md, gap: Spacing.md },
  typeBadge: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center' as const, alignItems: 'center' as const },
  typeInfo: { flex: 1, minWidth: 0 },
  typeLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: '#6b7280', textTransform: 'uppercase' as const },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginTop: 2 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.sm },
  detailText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280', flex: 1 },
  cardFooter: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  price: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#059669' },
});