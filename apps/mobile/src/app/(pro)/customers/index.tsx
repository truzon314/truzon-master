import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Users, Search, Filter, Plus, ChevronRight, Phone, Mail, MapPin, Calendar, CheckCircle, DollarSign, Building2, Star, Activity, MoreHorizontal, Users as UsersIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';
import { BottomSheet } from '@/components/layout/BottomSheet';

type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'HOT' | 'WARM' | 'COLD' | 'CONVERTED';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: CustomerStatus;
  source: string;
  assignedProjects: string[];
  totalEnquiries: number;
  totalSiteVisits: number;
  totalBookings: number;
  totalSpent: number;
  lastContactAt: string;
  nextFollowUpAt?: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
}

const statusConfig: Record<CustomerStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: '#10b981' },
  INACTIVE: { label: 'Inactive', color: '#6b7280' },
  HOT: { label: 'Hot', color: '#ef4444' },
  WARM: { label: 'Warm', color: '#f59e0b' },
  COLD: { label: 'Cold', color: '#3b82f6' },
  CONVERTED: { label: 'Converted', color: '#8b5cf6' },
};

const getStatusConfig = (status: CustomerStatus) => statusConfig[status];

export default function CustomersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [addCustomerForm, setAddCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'ACTIVE' as CustomerStatus,
    source: '',
    notes: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setCustomers([
        { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', status: 'HOT', source: 'Website', assignedProjects: ['Skyline Towers', 'Green Valley'], totalEnquiries: 3, totalSiteVisits: 2, totalBookings: 1, totalSpent: 12500000, lastContactAt: '2024-01-20T14:00:00Z', nextFollowUpAt: '2024-01-25T10:00:00Z', createdAt: '2024-01-10T10:00:00Z', tags: ['vip', 'high-budget'], notes: 'Prefers high floor, sea view' },
        { id: '2', name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@email.com', status: 'WARM', source: 'Referral', assignedProjects: ['Green Valley'], totalEnquiries: 2, totalSiteVisits: 1, totalBookings: 0, totalSpent: 0, lastContactAt: '2024-01-18T16:30:00Z', nextFollowUpAt: '2024-01-22T11:00:00Z', createdAt: '2024-01-08T09:00:00Z', tags: ['first-time'], notes: 'Budget 70-90L, 2BHK preferred' },
        { id: '3', name: 'Amit Singh', phone: '+91 98765 43212', status: 'CONVERTED', source: 'Walk-in', assignedProjects: ['Royal Gardens'], totalEnquiries: 4, totalSiteVisits: 3, totalBookings: 1, totalSpent: 35000000, lastContactAt: '2024-01-12T10:00:00Z', createdAt: '2024-01-02T11:00:00Z', tags: ['vip', 'investor'], notes: 'Booked 4BHK Villa' },
        { id: '4', name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha@email.com', status: 'ACTIVE', source: 'Social Media', assignedProjects: ['Skyline Towers'], totalEnquiries: 1, totalSiteVisits: 1, totalBookings: 0, totalSpent: 0, lastContactAt: '2024-01-22T09:00:00Z', nextFollowUpAt: '2024-01-24T15:00:00Z', createdAt: '2024-01-18T14:00:00Z', tags: ['qualified'], notes: 'Wants to schedule visit this weekend' },
        { id: '5', name: 'Vikram Patel', phone: '+91 98765 43214', status: 'WARM', source: 'Phone', assignedProjects: ['Sunrise Heights'], totalEnquiries: 2, totalSiteVisits: 1, totalBookings: 0, totalSpent: 0, lastContactAt: '2024-01-21T11:00:00Z', nextFollowUpAt: '2024-01-23T10:00:00Z', createdAt: '2024-01-20T16:00:00Z', tags: ['first-time'], notes: 'First time buyer, needs guidance' },
        { id: '6', name: 'Kavya Nair', phone: '+91 98765 43215', email: 'kavya@email.com', status: 'ACTIVE', source: 'Website', assignedProjects: ['Green Valley'], totalEnquiries: 1, totalSiteVisits: 0, totalBookings: 0, totalSpent: 0, lastContactAt: '2024-01-22T10:00:00Z', createdAt: '2024-01-22T10:00:00Z', tags: ['new'], notes: '' },
        { id: '7', name: 'Rohit Gupta', phone: '+91 98765 43216', status: 'COLD', source: 'Exhibition', assignedProjects: ['Ocean View'], totalEnquiries: 1, totalSiteVisits: 0, totalBookings: 0, totalSpent: 0, lastContactAt: '2024-01-15T14:00:00Z', createdAt: '2024-01-08T12:00:00Z', tags: ['lost'], notes: 'Budget mismatch' },
        { id: '8', name: 'Anjali Desai', phone: '+91 98765 43217', email: 'anjali@email.com', status: 'CONVERTED', source: 'Referral', assignedProjects: ['Royal Gardens'], totalEnquiries: 3, totalSiteVisits: 2, totalBookings: 1, totalSpent: 18000000, lastContactAt: '2024-01-10T12:00:00Z', createdAt: '2023-12-20T10:00:00Z', tags: ['referral'], notes: 'Referred by Amit Singh' },
      ]);
      filterCustomers();
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  const filterCustomers = () => {
    let result = customers;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(lower) ||
        c.email?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    setFilteredCustomers(result);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterCustomers();
  };

  const handleStatusChange = (status: 'all' | CustomerStatus) => {
    setStatusFilter(status);
    filterCustomers();
    setShowFilterSheet(false);
  };

  const handleAddCustomer = async () => {
    if (!addCustomerForm.name || !addCustomerForm.phone) {
      Alert.alert('Error', 'Name and phone are required');
      return;
    }
    // TODO: API call
    Alert.alert('Success', 'Customer added successfully');
    setShowAddCustomer(false);
    setAddCustomerForm({ name: '', phone: '', email: '', status: 'ACTIVE', source: '', notes: '' });
    loadCustomers();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Customers"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Plus, onPress: () => setShowAddCustomer(true) }}
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.statusFilters}>
        {(['all', 'HOT', 'WARM', 'ACTIVE', 'COLD', 'CONVERTED', 'INACTIVE'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[{ ...styles.statusChip, ...(statusFilter === status ? styles.statusChipActive : {}) }, status !== 'all' && { borderColor: statusConfig[status as CustomerStatus].color }]}
            onPress={() => handleStatusChange(status as 'all' | CustomerStatus)}
          >
            <View style={[{ ...styles.statusDot, backgroundColor: status !== 'all' ? statusConfig[status as CustomerStatus].color : 'transparent' }]} />
            <Text style={[{ ...styles.statusChipText, ...(statusFilter === status ? styles.statusChipTextActive : {}) }, status !== 'all' && { color: statusConfig[status as CustomerStatus].color }]}>
              {status === 'all' ? 'All' : statusConfig[status as CustomerStatus].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={({ item }) => (
          <CustomerCard customer={item} onPress={() => router.push(`/(pro)/customers/${item.id}`)} />
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
            title="No Customers Found"
            message={searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first customer to get started'}
            actionLabel={searchQuery || statusFilter !== 'all' ? 'Clear Filters' : 'Add Customer'}
            onAction={() => { setSearchQuery(''); setStatusFilter('all'); filterCustomers(); setShowAddCustomer(true); }}
            icon={<UsersIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isVisible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Customers"
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetSectionTitle}>Status</Text>
            {(['all', 'HOT', 'WARM', 'ACTIVE', 'COLD', 'CONVERTED', 'INACTIVE'] as const).map((status) => (
              <TouchableOpacity key={status} style={styles.filterOption} onPress={() => handleStatusChange(status as 'all' | CustomerStatus)}>
                <View style={[{ ...styles.filterOptionDot, backgroundColor: status !== 'all' ? statusConfig[status as CustomerStatus].color : 'transparent', borderWidth: status === 'all' ? 1 : 0, borderColor: '#e5e7eb' }]} />
                <Text style={[{ ...styles.filterOptionText, ...(statusFilter === status ? styles.filterOptionTextActive : {}) }, status !== 'all' && { color: statusConfig[status as CustomerStatus].color }]}>
                  {status === 'all' ? 'All' : statusConfig[status as CustomerStatus].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      {/* Add Customer Bottom Sheet */}
      <BottomSheet
        isVisible={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        title="Add New Customer"
        content={
          <View style={styles.sheetContent}>
            <Input label="Name *" value={addCustomerForm.name} onChangeText={text => setAddCustomerForm(prev => ({ ...prev, name: text }))} placeholder="Customer name" />
            <Input label="Phone *" value={addCustomerForm.phone} onChangeText={text => setAddCustomerForm(prev => ({ ...prev, phone: text }))} placeholder="+91 98765 43210" keyboardType="phone-pad" />
            <Input label="Email" value={addCustomerForm.email} onChangeText={text => setAddCustomerForm(prev => ({ ...prev, email: text }))} placeholder="email@example.com" keyboardType="email-address" />
            <Input label="Source" value={addCustomerForm.source} onChangeText={text => setAddCustomerForm(prev => ({ ...prev, source: text }))} placeholder="Website, Referral, Walk-in, etc." />
            <Input label="Notes" value={addCustomerForm.notes} onChangeText={text => setAddCustomerForm(prev => ({ ...prev, notes: text }))} placeholder="Additional notes" multiline numberOfLines={3} />
            <Button onPress={handleAddCustomer} style={{ marginTop: Spacing.md }} fullWidth>Add Customer</Button>
          </View>
        }
      />
    </View>
  );
}

function CustomerCard({ customer, onPress }: { customer: Customer; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(customer.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.customerAvatar}>
            <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.customerName}>{customer.name}</Text>
            <View style={styles.customerMeta}>
              <View style={styles.metaItem}>
                <Phone size={12} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{customer.phone}</Text>
              </View>
              {customer.email && (
                <View style={styles.metaItem}>
                  <Mail size={12} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{customer.email}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={customer.status === 'HOT' ? 'danger' : customer.status === 'WARM' ? 'warning' : customer.status === 'CONVERTED' ? 'success' : customer.status === 'ACTIVE' ? 'success' : 'default'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.statsRow}>
          <StatItem icon={Building2} label="Projects" value={customer.assignedProjects.length} />
          <StatItem icon={Activity} label="Enquiries" value={customer.totalEnquiries} />
          <StatItem icon={Calendar} label="Visits" value={customer.totalSiteVisits} />
          <StatItem icon={CheckCircle} label="Bookings" value={customer.totalBookings} />
        </View>
        <View style={styles.spentRow}>
          <DollarSign size={16} color={colors.success.DEFAULT} />
          <Text style={styles.spentLabel}>Total Value</Text>
          <Text style={styles.spentValue}>₹{formatPrice(customer.totalSpent)}</Text>
        </View>
        {customer.assignedProjects.length > 0 && (
          <View style={styles.projectsRow}>
            <MapPin size={14} color={colors.text.tertiary} />
            <Text style={styles.projectsText}>{customer.assignedProjects.join(', ')}</Text>
          </View>
        )}
        <View style={styles.footerRow}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Last Contact</Text>
            <Text style={styles.footerValue}>{formatRelativeTime(customer.lastContactAt)}</Text>
          </View>
          {customer.nextFollowUpAt && (
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Next Follow-up</Text>
              <Text style={[{ ...styles.footerValue, color: isOverdue(customer.nextFollowUpAt!) ? colors.error.DEFAULT : colors.primary[600] }]}>{formatRelativeTime(customer.nextFollowUpAt)}</Text>
            </View>
          )}
        </View>
        {customer.tags && customer.tags.length > 0 && (
          <View style={styles.tags}>
            {customer.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" style={styles.tag}>{tag}</Badge>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statItem}>
      <Icon size={14} color={colors.text.tertiary} />
      <View style={styles.statItemContent}>
        <Text style={styles.statItemValue}>{value}</Text>
        <Text style={styles.statItemLabel}>{label}</Text>
      </View>
    </View>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return price.toLocaleString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function isOverdue(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  searchInput: { backgroundColor: '#fff' },
  statusFilters: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', marginRight: Spacing.sm, borderWidth: 1, borderColor: 'transparent' },
  statusChipActive: { backgroundColor: '#fef3c7' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  statusChipTextActive: { fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1, minWidth: 0 },
  customerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  customerName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  customerMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  metaText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  statItemContent: { marginLeft: Spacing.xs },
  statItemValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  statItemLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  spentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: '#f0fdf4', borderRadius: BorderRadius.lg },
  spentLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginLeft: Spacing.xs },
  spentValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: colors.success.DEFAULT, marginLeft: 'auto' },
  projectsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  projectsText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.xs },
  footerItem: { alignItems: 'flex-start' },
  footerLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  footerValue: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#080d1a', marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  tag: {},
  sheetContent: { gap: Spacing.lg },
  sheetSectionTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginBottom: Spacing.md },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  filterOptionDot: { width: 10, height: 10, borderRadius: 5 },
  filterOptionText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  filterOptionTextActive: { fontWeight: '600' },
});