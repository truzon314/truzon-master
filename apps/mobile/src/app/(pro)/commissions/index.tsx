import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, Dimensions, FlatList } from 'react-native';
import { DollarSign, CreditCard, Settings, ArrowLeft, Clock, Calendar, FileText, TrendingUp, Shield, MessageCircle, Phone, Mail, Users, Home, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CommissionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setCommissions([
        { id: '1', propertyTitle: '3 BHK Luxury Apartment', clientName: 'Rajesh Kumar', propertyLocation: 'Banjara Hills, Hyderabad', commissionAmount: 125000, status: 'PAID', bookingDate: '2024-01-15', paymentDate: '2024-01-20' },
        { id: '2', propertyTitle: '2 BHK Modern Flat', clientName: 'Priya Sharma', propertyLocation: 'Gachibowli, Hyderabad', commissionAmount: 78000, status: 'PENDING', bookingDate: '2024-02-10', paymentDate: null },
        { id: '3', propertyTitle: '4 BHK Villa', clientName: 'Amit Singh', propertyLocation: 'Jubilee Hills, Hyderabad', commissionAmount: 350000, status: 'PAID', bookingDate: '2024-01-28', paymentDate: '2024-02-02' },
        { id: '4', propertyTitle: '3 BHK Premium Apartment', clientName: 'Rajesh Kumar', propertyLocation: 'Kondapur, Hyderabad', commissionAmount: 95000, status: 'PROCESSING', bookingDate: '2024-02-15', paymentDate: null },
        { id: '5', propertyTitle: '2 BHK Budget Flat', clientName: 'Priya Sharma', propertyLocation: 'Madhapur, Hyderabad', commissionAmount: 55000, status: 'PAID', bookingDate: '2024-03-01', paymentDate: '2024-03-05' },
      ]);
    } catch (error) {
      console.error('Failed to load commissions:', error);
      Alert.alert('Error', 'Failed to load commissions. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCommissions();
  };

  const filteredCommissions = commissions.filter(c => c.status !== 'CANCELLED');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Commissions"
        leftAction={{ onPress: () => router.back() }}
        rightAction={{ icon: Filter, onPress: () => {} }}
      />

      <View style={styles.filterArea}>
        <FilterTab label="All" count={commissions.length} active={true} onPress={() => {}} />
        <FilterTab label="Pending" count={filteredCommissions.filter(c => c.status === 'PENDING').length} active={false} onPress={() => {}} />
        <FilterTab label="Paid" count={filteredCommissions.filter(c => c.status === 'PAID').length} active={false} onPress={() => {}} />
        <FilterTab label="Processing" count={filteredCommissions.filter(c => c.status === 'PROCESSING').length} active={false} onPress={() => {}} />
      </View>

      <FlatList
        data={filteredCommissions}
        renderItem={({ item }) => (
          <CommissionCard commission={item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
      />

      {commissions.length === 0 && (
        <EmptyState
          title="No Commissions"
          message="No commission records found"
          actionLabel="Explore Properties"
          onAction={() => router.push('/(pro)/explore')}
          icon={<DollarSign size={48} color={colors.text.tertiary} />}
        />
      )}
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

function CommissionCard({ commission }: { commission: any }) {
  const { colors } = useTheme();
  const statusConfig = {
    PAID: { color: '#10b981', label: 'Paid' },
    PENDING: { color: '#f59e0b', label: 'Pending' },
    PROCESSING: { color: '#3b82f6', label: 'Processing' },
    CANCELLED: { color: '#ef4444', label: 'Cancelled' },
  };
  const config = statusConfig[commission.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[{ ...styles.typeBadge, backgroundColor: `${config.color}20` }]}>
          <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.propertyTitle}>{commission.propertyTitle}</Text>
          <Text style={styles.clientName}>{commission.clientName}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailText}>{commission.propertyLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Commission</Text>
          <Text style={styles.detailAmount}>₹{commission.commissionAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking Date</Text>
          <Text style={styles.detailText}>{commission.bookingDate}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <Badge variant={config.color === '#ef4444' ? 'error' : config.color === '#10b981' ? 'success' : 'warning'}>
            {config.label}
          </Badge>
        </View>
        <Text style={styles.dateText}>{commission.paymentDate || 'Pending payment'}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  filterArea: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  typeBadge: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: '#080d1a', textTransform: 'uppercase' },
  typeInfo: { flex: 1 },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginTop: 2 },
  clientName: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280' },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, textTransform: 'uppercase' },
  detailText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#3f3f4f', flex: 1 },
  detailAmount: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.bold, color: '#059669' },
  cardFooter: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  dateText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280' },
});