import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { Mail, ChevronRight, Filter, Calendar, Phone, MessageSquare, X, CheckCircle, Clock, AlertTriangle, MapPin, Mail as MailIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

type EnquiryStatus = 'PENDING' | 'CONTACTED' | 'SITE_VISIT_SCHEDULED' | 'NEGOTIATION' | 'BOOKED' | 'CLOSED' | 'CANCELLED';

interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyLocation: string;
  propertyPrice: number;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  messages: number;
  lastMessage?: string;
  agentName?: string;
  agentPhone?: string;
}

const statusConfig: Record<EnquiryStatus, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: '#f59e0b', icon: Clock },
  CONTACTED: { label: 'Contacted', color: '#3b82f6', icon: Phone },
  SITE_VISIT_SCHEDULED: { label: 'Visit Scheduled', color: '#8b5cf6', icon: Calendar },
  NEGOTIATION: { label: 'Negotiation', color: '#f97316', icon: AlertTriangle },
  BOOKED: { label: 'Booked', color: '#10b981', icon: CheckCircle },
  CLOSED: { label: 'Closed', color: '#6b7280', icon: X },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: X },
};

const getStatusConfig = (status: EnquiryStatus) => statusConfig[status];

export default function EnquiriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setEnquiries([
        { id: '1', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', propertyPrice: 12500000, status: 'SITE_VISIT_SCHEDULED', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-20T14:00:00Z', messages: 3, lastMessage: 'Site visit confirmed for tomorrow 10 AM', agentName: 'Rajesh Kumar', agentPhone: '+91 98765 43210' },
        { id: '2', propertyId: '2', propertyTitle: '2 BHK Modern Flat', propertyLocation: 'Gachibowli, Hyderabad', propertyPrice: 7800000, status: 'NEGOTIATION', createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-18T16:30:00Z', messages: 5, lastMessage: 'Developer offered 2% discount', agentName: 'Priya Sharma', agentPhone: '+91 98765 43211' },
        { id: '3', propertyId: '3', propertyTitle: '4 BHK Villa', propertyLocation: 'Jubilee Hills, Hyderabad', propertyPrice: 35000000, status: 'PENDING', createdAt: '2024-01-22T11:00:00Z', updatedAt: '2024-01-22T11:00:00Z', messages: 0, agentName: 'Amit Singh', agentPhone: '+91 98765 43212' },
        { id: '4', propertyId: '4', propertyTitle: '3 BHK Premium Apartment', propertyLocation: 'Kondapur, Hyderabad', propertyPrice: 9500000, status: 'BOOKED', createdAt: '2023-12-20T10:00:00Z', updatedAt: '2024-01-05T12:00:00Z', messages: 8, lastMessage: 'Booking confirmed, agreement signed', agentName: 'Rajesh Kumar', agentPhone: '+91 98765 43210' },
        { id: '5', propertyId: '5', propertyTitle: '2 BHK Budget Flat', propertyLocation: 'Madhapur, Hyderabad', propertyPrice: 5500000, status: 'CLOSED', createdAt: '2023-11-15T14:00:00Z', updatedAt: '2023-12-01T10:00:00Z', messages: 2, agentName: 'Priya Sharma', agentPhone: '+91 98765 43211' },
      ]);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEnquiries();
  };

  const filteredEnquiries = enquiries.filter(e => {
    if (filter === 'active') return !['BOOKED', 'CLOSED', 'CANCELLED'].includes(e.status);
    if (filter === 'closed') return ['BOOKED', 'CLOSED', 'CANCELLED'].includes(e.status);
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="My Enquiries"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Filter, onPress: () => {} }}
      />

      <View style={styles.filterTabs}>
        <FilterTab label="All" count={enquiries.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Active" count={enquiries.filter(e => !['BOOKED', 'CLOSED', 'CANCELLED'].includes(e.status)).length} active={filter === 'active'} onPress={() => setFilter('active')} />
        <FilterTab label="Closed" count={enquiries.filter(e => ['BOOKED', 'CLOSED', 'CANCELLED'].includes(e.status)).length} active={filter === 'closed'} onPress={() => setFilter('closed')} />
      </View>

      <FlatList
        data={filteredEnquiries}
        renderItem={({ item }) => (
          <EnquiryCard enquiry={item} onPress={() => router.push(`/(client)/enquiries/${item.id}`)} />
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
            title="No Enquiries"
            message={filter === 'all' ? 'Start exploring properties and make enquiries' : 'No enquiries in this category'}
            actionLabel="Explore Properties"
            onAction={() => router.push('/(client)/explore')}
            icon={<MailIcon size={24} color={colors.text.tertiary} />}
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

function EnquiryCard({ enquiry, onPress }: { enquiry: Enquiry; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(enquiry.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.propertyInfo}>
          {enquiry.propertyImage && (
            <Image source={{ uri: enquiry.propertyImage }} style={styles.propertyImage} resizeMode="cover" />
          )}
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyTitle}>{enquiry.propertyTitle}</Text>
            <View style={styles.propertyLocationRow}>
              <MapPin size={12} color={colors.text.tertiary} />
              <Text style={styles.propertyLocation}>{enquiry.propertyLocation}</Text>
            </View>
            <Text style={styles.propertyPrice}>₹{formatPrice(enquiry.propertyPrice)}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={enquiry.status === 'BOOKED' ? 'success' : enquiry.status === 'PENDING' ? 'warning' : enquiry.status === 'CANCELLED' ? 'danger' : 'info'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardFooter}>
        {enquiry.lastMessage && (
          <View style={styles.lastMessage}>
            <MessageSquare size={14} color={colors.text.tertiary} />
            <Text style={styles.lastMessageText}>{enquiry.lastMessage}</Text>
          </View>
        )}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Updated</Text>
            <Text style={styles.metaValue}>{formatDate(enquiry.updatedAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Messages</Text>
            <Text style={styles.metaValue}>{enquiry.messages}</Text>
          </View>
          {enquiry.agentName && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Agent</Text>
              <Text style={styles.metaValue}>{enquiry.agentName}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return price.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  filterTabs: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.md },
  propertyInfo: { flex: 1, flexDirection: 'row', gap: Spacing.md, minWidth: 0 },
  propertyImage: { width: 80, height: 80, borderRadius: BorderRadius.lg },
  propertyDetails: { flex: 1, minWidth: 0, justifyContent: 'center' },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  propertyLocationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  propertyLocation: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  propertyPrice: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: colors.primary[600], marginTop: Spacing.xs },
  statusContainer: { alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 100 },
  cardFooter: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: Spacing.md },
  lastMessage: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, padding: Spacing.sm, backgroundColor: '#f9fafb', borderRadius: BorderRadius.md },
  lastMessageText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, flex: 1 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaItem: { alignItems: 'center' },
  metaLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  metaValue: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#080d1a', marginTop: 2 },
});