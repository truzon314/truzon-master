import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Calendar, Search, Filter, Plus, ChevronRight, MapPin, Home, Clock, CheckCircle, X, AlertTriangle, Navigation, User as UserIcon, Phone, MessageSquare, MoreHorizontal, Edit, Trash2, Star, Calendar as CalendarIcon } from 'lucide-react-native';
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

type VisitStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';

interface SiteVisit {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  leadId?: string;
  projectId: string;
  projectName: string;
  propertyId?: string;
  propertyTitle?: string;
  status: VisitStatus;
  scheduledAt: string;
  confirmedAt?: string;
  completedAt?: string;
  address: string;
  agentName: string;
  agentPhone: string;
  notes?: string;
  feedback?: string;
  rating?: number;
}

const statusConfig: Record<VisitStatus, { label: string; color: string; icon: any }> = {
  SCHEDULED: { label: 'Scheduled', color: '#f59e0b', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: '#3b82f6', icon: CheckCircle },
  COMPLETED: { label: 'Completed', color: '#10b981', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: X },
  RESCHEDULED: { label: 'Rescheduled', color: '#8b5cf6', icon: AlertTriangle },
  NO_SHOW: { label: 'No Show', color: '#6b7280', icon: X },
};

const getStatusConfig = (status: VisitStatus) => statusConfig[status];

export default function SiteVisitsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<SiteVisit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VisitStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [addVisitForm, setAddVisitForm] = useState({
    customerId: '',
    projectId: '',
    scheduledAt: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 86400000);
      const nextWeek = new Date(now.getTime() + 7 * 86400000);
      const yesterday = new Date(now.getTime() - 86400000);

      setVisits([
        { id: '1', customerId: '1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', leadId: '1', projectId: '1', projectName: 'Skyline Towers', propertyId: '1', propertyTitle: '3BHK Premium Unit', status: 'CONFIRMED', scheduledAt: tomorrow.toISOString(), confirmedAt: now.toISOString(), address: 'Project Skyline Towers, Banjara Hills, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', notes: 'Prefers high floor, sea view' },
        { id: '2', customerId: '2', customerName: 'Priya Sharma', customerPhone: '+91 98765 43211', leadId: '2', projectId: '2', projectName: 'Green Valley', propertyId: '3', propertyTitle: '2BHK Garden View', status: 'SCHEDULED', scheduledAt: new Date(now.getTime() + 2 * 86400000).toISOString(), address: 'Project Green Valley, Gachibowli, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', notes: 'Budget 70-90L, 2BHK preferred' },
        { id: '3', customerId: '3', customerName: 'Amit Singh', customerPhone: '+91 98765 43212', leadId: '3', projectId: '3', projectName: 'Royal Gardens', propertyId: '4', propertyTitle: '4BHK Luxury Villa', status: 'COMPLETED', scheduledAt: yesterday.toISOString(), completedAt: new Date(yesterday.getTime() + 2 * 3600000).toISOString(), address: 'Project Royal Gardens, Jubilee Hills, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', feedback: 'Loved the villa, booking confirmed', rating: 5 },
        { id: '4', customerId: '4', customerName: 'Sneha Reddy', customerPhone: '+91 98765 43213', leadId: '4', projectId: '1', projectName: 'Skyline Towers', propertyId: '1', propertyTitle: '3BHK Premium Unit', status: 'SCHEDULED', scheduledAt: new Date(now.getTime() + 3 * 86400000).toISOString(), address: 'Project Skyline Towers, Banjara Hills, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', notes: 'Wants to schedule visit this weekend' },
        { id: '5', customerId: '5', customerName: 'Vikram Patel', customerPhone: '+91 98765 43214', leadId: '5', projectId: '4', projectName: 'Sunrise Heights', propertyId: '6', propertyTitle: '2BHK Affordable', status: 'CANCELLED', scheduledAt: new Date(now.getTime() - 2 * 86400000).toISOString(), address: 'Project Sunrise Heights, Kukatpally, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', notes: 'Customer had emergency' },
        { id: '6', customerId: '6', customerName: 'Kavya Nair', customerPhone: '+91 98765 43215', leadId: '6', projectId: '2', projectName: 'Green Valley', propertyId: '3', propertyTitle: '2BHK Garden View', status: 'SCHEDULED', scheduledAt: new Date(now.getTime() + 5 * 86400000).toISOString(), address: 'Project Green Valley, Gachibowli, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210' },
        { id: '7', customerId: '7', customerName: 'Rohit Gupta', customerPhone: '+91 98765 43216', leadId: '7', projectId: '5', projectName: 'Ocean View', propertyId: '7', propertyTitle: '3BHK Sea Facing', status: 'NO_SHOW', scheduledAt: new Date(now.getTime() - 1 * 86400000).toISOString(), address: 'Project Ocean View, Hitech City, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210' },
        { id: '8', customerId: '8', customerName: 'Anjali Desai', customerPhone: '+91 98765 43217', leadId: '8', projectId: '3', projectName: 'Royal Gardens', propertyId: '8', propertyTitle: '3BHK Garden Villa', status: 'COMPLETED', scheduledAt: new Date(now.getTime() - 10 * 86400000).toISOString(), completedAt: new Date(now.getTime() - 10 * 86400000 + 3 * 3600000).toISOString(), address: 'Project Royal Gardens, Jubilee Hills, Hyderabad', agentName: 'Self', agentPhone: '+91 98765 43210', feedback: 'Referred by Amit, very interested', rating: 4 },
      ]);
      filterVisits();
    } catch (error) {
      console.error('Failed to load site visits:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVisits();
  };

  const filterVisits = () => {
    let result = visits;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.customerName.toLowerCase().includes(lower) ||
        v.projectName.toLowerCase().includes(lower) ||
        v.propertyTitle?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== 'all') result = result.filter(v => v.status === statusFilter);
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(v => {
        const scheduled = new Date(v.scheduledAt);
        if (dateFilter === 'today') return scheduled.toDateString() === now.toDateString();
        if (dateFilter === 'week') return scheduled >= now && scheduled <= new Date(now.getTime() + 7 * 86400000);
        if (dateFilter === 'month') return scheduled >= now && scheduled <= new Date(now.getTime() + 30 * 86400000);
        return true;
      });
    }
    // Sort by scheduled date
    result.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    setFilteredVisits(result);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterVisits();
  };

  const handleStatusChange = (status: 'all' | VisitStatus) => {
    setStatusFilter(status);
    filterVisits();
    setShowFilterSheet(false);
  };

  const handleDateChange = (date: 'all' | 'today' | 'week' | 'month') => {
    setDateFilter(date);
    filterVisits();
    setShowFilterSheet(false);
  };

  const handleAddVisit = async () => {
    if (!addVisitForm.customerId || !addVisitForm.projectId || !addVisitForm.scheduledAt) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    // TODO: API call
    Alert.alert('Success', 'Site visit scheduled successfully');
    setShowAddVisit(false);
    setAddVisitForm({ customerId: '', projectId: '', scheduledAt: '', address: '', notes: '' });
    loadVisits();
  };

  const now = new Date();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Site Visits"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Plus, onPress: () => setShowAddVisit(true) }}
      />

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <SummaryCard title="Today" count={visits.filter(v => new Date(v.scheduledAt).toDateString() === now.toDateString()).length} icon={Calendar} color="#3b82f6" />
        <SummaryCard title="This Week" count={visits.filter(v => new Date(v.scheduledAt) >= now && new Date(v.scheduledAt) <= new Date(now.getTime() + 7 * 86400000)).length} icon={Calendar} color="#8b5cf6" />
        <SummaryCard title="Completed" count={visits.filter(v => v.status === 'COMPLETED').length} icon={CheckCircle} color="#10b981" />
        <SummaryCard title="Pending" count={visits.filter(v => ['SCHEDULED', 'CONFIRMED'].includes(v.status)).length} icon={Clock} color="#f59e0b" />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search visits..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterBar}>
        <FilterButton label={statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label} active={statusFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
        <FilterButton label={dateFilter === 'all' ? 'All Dates' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)} active={dateFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
      </View>

      <View style={styles.statusFilters}>
        {(['all', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[{ ...styles.statusChip, ...(statusFilter === status ? styles.statusChipActive : {}) }, status !== 'all' && { borderColor: statusConfig[status as VisitStatus].color }]}
            onPress={() => handleStatusChange(status as 'all' | VisitStatus)}
          >
            <View style={[{ ...styles.statusDot, backgroundColor: status !== 'all' ? statusConfig[status as VisitStatus].color : 'transparent' }]} />
            <Text style={[{ ...styles.statusChipText, ...(statusFilter === status ? styles.statusChipTextActive : {}) }, status !== 'all' && { color: statusConfig[status as VisitStatus].color }]}>
              {status === 'all' ? 'All' : statusConfig[status as VisitStatus].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredVisits}
        renderItem={({ item }) => (
          <VisitCard visit={item} onPress={() => router.push(`/(pro)/site-visits/${item.id}`)} />
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
            title="No Site Visits"
            message={searchQuery || statusFilter !== 'all' || dateFilter !== 'all' ? 'Try adjusting your filters' : 'Schedule your first site visit'}
            actionLabel={searchQuery || statusFilter !== 'all' || dateFilter !== 'all' ? 'Clear Filters' : 'Schedule Visit'}
            onAction={() => { setSearchQuery(''); setStatusFilter('all'); setDateFilter('all'); filterVisits(); setShowAddVisit(true); }}
            icon={<CalendarIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isVisible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Visits"
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetSectionTitle}>Status</Text>
            {(['all', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'] as const).map((status) => (
              <TouchableOpacity key={status} style={styles.filterOption} onPress={() => handleStatusChange(status as 'all' | VisitStatus)}>
                <View style={[{ ...styles.filterOptionDot, backgroundColor: status !== 'all' ? statusConfig[status as VisitStatus].color : 'transparent', borderWidth: status === 'all' ? 1 : 0, borderColor: '#e5e7eb' }]} />
                <Text style={[{ ...styles.filterOptionText, ...(statusFilter === status ? styles.filterOptionTextActive : {}) }, status !== 'all' && { color: statusConfig[status as VisitStatus].color }]}>
                  {status === 'all' ? 'All' : statusConfig[status as VisitStatus].label}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.sheetSectionTitle}>Date Range</Text>
            {(['all', 'today', 'week', 'month'] as const).map((date) => (
              <TouchableOpacity key={date} style={styles.filterOption} onPress={() => handleDateChange(date)}>
                <Text style={[{ ...styles.filterOptionText, ...(dateFilter === date ? styles.filterOptionTextActive : {}) }]}>
                  {date === 'all' ? 'All Dates' : date.charAt(0).toUpperCase() + date.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      {/* Add Visit Bottom Sheet */}
      <BottomSheet
        isVisible={showAddVisit}
        onClose={() => setShowAddVisit(false)}
        title="Schedule Site Visit"
        content={
          <View style={styles.sheetContent}>
            <Input label="Customer Name *" value={addVisitForm.customerId} onChangeText={text => setAddVisitForm(prev => ({ ...prev, customerId: text }))} placeholder="Customer name" />
            <Input label="Project *" value={addVisitForm.projectId} onChangeText={text => setAddVisitForm(prev => ({ ...prev, projectId: text }))} placeholder="Project name" />
            <Input label="Date & Time *" value={addVisitForm.scheduledAt} onChangeText={text => setAddVisitForm(prev => ({ ...prev, scheduledAt: text }))} placeholder="2024-01-25T10:00:00" />
            <Input label="Address" value={addVisitForm.address} onChangeText={text => setAddVisitForm(prev => ({ ...prev, address: text }))} placeholder="Project address" />
            <Input label="Notes" value={addVisitForm.notes} onChangeText={text => setAddVisitForm(prev => ({ ...prev, notes: text }))} placeholder="Additional notes" multiline numberOfLines={3} />
            <Button onPress={handleAddVisit} style={{ marginTop: Spacing.md }} fullWidth>Schedule Visit</Button>
          </View>
        }
      />
    </View>
  );
}

function SummaryCard({ title, count, icon: Icon, color }: { title: string; count: number; icon: any; color: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[{ ...styles.summaryCard, borderLeftColor: color }]} onPress={() => {}}>
      <View style={[{ ...styles.summaryIcon, backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={[{ ...styles.summaryValue, color }]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

function FilterButton({ label, active, onPress, icon: Icon }: { label: string; active: boolean; onPress: () => void; icon: any }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[{ ...styles.filterButton, ...(active ? styles.filterButtonActive : {}) }]} onPress={onPress}>
      <Icon size={18} color={active ? colors.primary[600] : colors.text.tertiary} />
      <Text style={[{ ...styles.filterButtonText, ...(active ? styles.filterButtonTextActive : {}) }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function VisitCard({ visit, onPress }: { visit: SiteVisit; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(visit.status);
  const isUpcoming = new Date(visit.scheduledAt) >= now;
  const StatusIcon = status.icon;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[{ ...styles.statusBadge, backgroundColor: `${status.color}20` }]}>
          <StatusIcon size={20} color={status.color} />
        </View>
        <View style={styles.visitInfo}>
          <Text style={styles.visitCustomer}>{visit.customerName}</Text>
          <View style={styles.visitProjectRow}>
            <Home size={14} color={colors.text.tertiary} />
            <Text style={styles.visitProject}>{visit.projectName}</Text>
            {visit.propertyTitle && (
              <>
                <Text style={styles.visitProject}> • </Text>
                <Text style={styles.visitProject}>{visit.propertyTitle}</Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={visit.status === 'COMPLETED' ? 'success' : visit.status === 'CANCELLED' ? 'danger' : visit.status === 'CONFIRMED' ? 'info' : visit.status === 'SCHEDULED' ? 'warning' : 'default'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText}>{formatDateTime(visit.scheduledAt)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.text.tertiary} />
          <Text style={styles.detailText} numberOfLines={1}>{visit.address}</Text>
        </View>
        {visit.feedback && visit.status === 'COMPLETED' && (
          <View style={styles.feedbackRow}>
            <Star size={16} color="#facc15" />
            <Text style={styles.feedbackText}>{'★'.repeat(visit.rating || 0)}{'☆'.repeat(5 - (visit.rating || 0))} - {visit.feedback}</Text>
          </View>
        )}
        {visit.notes && (
          <View style={styles.notesRow}>
            <MessageSquare size={16} color={colors.text.tertiary} />
            <Text style={styles.notesText}>{visit.notes}</Text>
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

const now = new Date();

const styles = StyleSheet.create({
  summaryContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md },
  summaryCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', borderLeftWidth: 4 },
  summaryIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  summaryTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  summaryValue: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  searchContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  searchInput: { backgroundColor: '#fff' },
  filterBar: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md },
  filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  filterButtonActive: { backgroundColor: '#fef3c7', borderColor: '#facc15' },
  filterButtonText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterButtonTextActive: { color: '#080d1a', fontWeight: '600' },
  statusFilters: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', marginRight: Spacing.sm, borderWidth: 1, borderColor: 'transparent' },
  statusChipActive: { backgroundColor: '#fef3c7' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  statusChipTextActive: { fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  statusBadge: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  visitInfo: { flex: 1, minWidth: 0 },
  visitCustomer: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  visitProjectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  visitProject: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, flex: 1 },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, backgroundColor: '#fef3c7', borderRadius: BorderRadius.md },
  feedbackText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#92400e', flex: 1 },
  notesRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, backgroundColor: '#f3f4f6', borderRadius: BorderRadius.md },
  notesText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, flex: 1 },
  sheetContent: { gap: Spacing.lg },
  sheetSectionTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginBottom: Spacing.md },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  filterOptionDot: { width: 10, height: 10, borderRadius: 5 },
  filterOptionText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  filterOptionTextActive: { fontWeight: '600' },
});