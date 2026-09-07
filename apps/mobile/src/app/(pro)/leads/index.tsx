import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { Users, Search, Filter, Plus, ChevronRight, Phone, Mail, MapPin, Clock, CheckCircle, X, AlertTriangle, DollarSign, Calendar, MessageSquare, ArrowDown, ArrowUp, MoreHorizontal, Users as UsersIcon } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';
import { BottomSheet } from '@/components/layout/BottomSheet';

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'SITE_VISIT_SCHEDULED' | 'NEGOTIATION' | 'BOOKED' | 'LOST' | 'CLOSED';
type LeadSource = 'WEBSITE' | 'REFERRAL' | 'WALK_IN' | 'PHONE' | 'EMAIL' | 'SOCIAL_MEDIA' | 'EXHIBITION' | 'OTHER';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  projectId?: string;
  projectName?: string;
  propertyType?: string;
  budget?: { min: number; max: number };
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  notes?: string;
  tags?: string[];
}

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: any }> = {
  NEW: { label: 'New', color: '#3b82f6', icon: Users },
  CONTACTED: { label: 'Contacted', color: '#8b5cf6', icon: Phone },
  QUALIFIED: { label: 'Qualified', color: '#06b6d4', icon: CheckCircle },
  SITE_VISIT_SCHEDULED: { label: 'Visit Scheduled', color: '#f59e0b', icon: Calendar },
  NEGOTIATION: { label: 'Negotiation', color: '#f97316', icon: DollarSign },
  BOOKED: { label: 'Booked', color: '#10b981', icon: CheckCircle },
  LOST: { label: 'Lost', color: '#ef4444', icon: X },
  CLOSED: { label: 'Closed', color: '#6b7280', icon: CheckCircle },
};

const sourceConfig: Record<LeadSource, { label: string; icon: any }> = {
  WEBSITE: { label: 'Website', icon: 'globe' },
  REFERRAL: { label: 'Referral', icon: 'users' },
  WALK_IN: { label: 'Walk-in', icon: 'map-pin' },
  PHONE: { label: 'Phone', icon: 'phone' },
  EMAIL: { label: 'Email', icon: 'mail' },
  SOCIAL_MEDIA: { label: 'Social Media', icon: 'share' },
  EXHIBITION: { label: 'Exhibition', icon: 'building' },
  OTHER: { label: 'Other', icon: 'more' },
};

const getStatusConfig = (status: LeadStatus) => statusConfig[status];
const getSourceConfig = (source: LeadSource) => sourceConfig[source];

export default function LeadsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | LeadSource>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'WEBSITE' as LeadSource,
    projectId: '',
    budgetMin: '',
    budgetMax: '',
    notes: '',
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setLeads([
        { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', status: 'SITE_VISIT_SCHEDULED', source: 'WEBSITE', projectId: '1', projectName: 'Skyline Towers', propertyType: '3BHK', budget: { min: 10000000, max: 15000000 }, assignedTo: 'Self', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-20T14:00:00Z', lastContactAt: '2024-01-20T14:00:00Z', nextFollowUpAt: '2024-01-25T10:00:00Z', notes: 'Interested in high floor unit', tags: ['hot', 'high-budget'] },
        { id: '2', name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@email.com', status: 'NEGOTIATION', source: 'REFERRAL', projectId: '2', projectName: 'Green Valley', propertyType: '2BHK', budget: { min: 7000000, max: 9000000 }, assignedTo: 'Self', createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-18T16:30:00Z', lastContactAt: '2024-01-18T16:30:00Z', nextFollowUpAt: '2024-01-22T11:00:00Z', notes: 'Developer offered 2% discount', tags: ['negotiation'] },
        { id: '3', name: 'Amit Singh', phone: '+91 98765 43212', status: 'BOOKED', source: 'WALK_IN', projectId: '3', projectName: 'Royal Gardens', propertyType: '4BHK Villa', budget: { min: 30000000, max: 40000000 }, assignedTo: 'Self', createdAt: '2024-01-05T11:00:00Z', updatedAt: '2024-01-12T10:00:00Z', lastContactAt: '2024-01-12T10:00:00Z', tags: ['booked', 'vip'] },
        { id: '4', name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha@email.com', status: 'QUALIFIED', source: 'SOCIAL_MEDIA', projectId: '1', projectName: 'Skyline Towers', propertyType: '3BHK', budget: { min: 12000000, max: 14000000 }, assignedTo: 'Self', createdAt: '2024-01-18T14:00:00Z', updatedAt: '2024-01-22T09:00:00Z', lastContactAt: '2024-01-22T09:00:00Z', nextFollowUpAt: '2024-01-24T15:00:00Z', notes: 'Wants to schedule visit this weekend', tags: ['qualified'] },
        { id: '5', name: 'Vikram Patel', phone: '+91 98765 43214', status: 'CONTACTED', source: 'PHONE', projectId: '4', projectName: 'Sunrise Heights', propertyType: '2BHK', budget: { min: 5000000, max: 7000000 }, assignedTo: 'Self', createdAt: '2024-01-20T16:00:00Z', updatedAt: '2024-01-21T11:00:00Z', lastContactAt: '2024-01-21T11:00:00Z', nextFollowUpAt: '2024-01-23T10:00:00Z', notes: 'First time buyer, needs guidance', tags: ['first-time'] },
        { id: '6', name: 'Kavya Nair', phone: '+91 98765 43215', email: 'kavya@email.com', status: 'NEW', source: 'WEBSITE', projectId: '2', projectName: 'Green Valley', propertyType: '2BHK', budget: { min: 6000000, max: 8000000 }, assignedTo: 'Self', createdAt: '2024-01-22T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z', tags: ['new'] },
        { id: '7', name: 'Rohit Gupta', phone: '+91 98765 43216', status: 'LOST', source: 'EXHIBITION', projectId: '5', projectName: 'Ocean View', propertyType: '3BHK', budget: { min: 20000000, max: 25000000 }, assignedTo: 'Self', createdAt: '2024-01-08T12:00:00Z', updatedAt: '2024-01-15T14:00:00Z', notes: 'Budget mismatch', tags: ['lost'] },
        { id: '8', name: 'Anjali Desai', phone: '+91 98765 43217', email: 'anjali@email.com', status: 'CLOSED', source: 'REFERRAL', projectId: '3', projectName: 'Royal Gardens', propertyType: '3BHK', budget: { min: 15000000, max: 18000000 }, assignedTo: 'Self', createdAt: '2023-12-20T10:00:00Z', updatedAt: '2024-01-10T12:00:00Z', lastContactAt: '2024-01-10T12:00:00Z', tags: ['closed', 'referral'] },
      ]);
      filterLeads();
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLeads();
  };

  const filterLeads = () => {
    let result = leads;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(lower) ||
        l.phone.includes(lower) ||
        l.email?.toLowerCase().includes(lower) ||
        l.projectName?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter);
    if (sourceFilter !== 'all') result = result.filter(l => l.source === sourceFilter);
    setFilteredLeads(result);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterLeads();
  };

  const handleStatusChange = (status: 'all' | LeadStatus) => {
    setStatusFilter(status);
    filterLeads();
    setShowFilterSheet(false);
  };

  const handleSourceChange = (source: 'all' | LeadSource) => {
    setSourceFilter(source);
    filterLeads();
    setShowFilterSheet(false);
  };

  const handleAddLead = async () => {
    if (!addLeadForm.name || !addLeadForm.phone) {
      Alert.alert('Error', 'Name and phone are required');
      return;
    }
    // TODO: API call
    Alert.alert('Success', 'Lead added successfully');
    setShowAddLead(false);
    setAddLeadForm({ name: '', phone: '', email: '', source: 'WEBSITE', projectId: '', budgetMin: '', budgetMax: '', notes: '' });
    loadLeads();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Leads"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Plus, onPress: () => setShowAddLead(true) }}
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterBar}>
        <FilterButton label={statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label} active={statusFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
        <FilterButton label={sourceFilter === 'all' ? 'All Sources' : sourceConfig[sourceFilter].label} active={sourceFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
      </View>

      <View style={styles.statusFilters}>
        {(['all', 'NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'NEGOTIATION', 'BOOKED', 'LOST'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[{ ...styles.statusChip, ...(statusFilter === status ? styles.statusChipActive : {}) }]}
            onPress={() => handleStatusChange(status as 'all' | LeadStatus)}
          >
            <Text style={[{ ...styles.statusChipText, ...(statusFilter === status ? styles.statusChipTextActive : {}) }, status !== 'all' && { color: statusConfig[status as LeadStatus].color }]}>
              {status === 'all' ? 'All' : statusConfig[status as LeadStatus].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredLeads}
        renderItem={({ item }) => (
          <LeadCard lead={item} onPress={() => router.push(`/(pro)/leads/${item.id}`)} />
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
            title="No Leads Found"
            message={searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first lead to get started'}
            actionLabel={searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' ? 'Clear Filters' : 'Add Lead'}
            onAction={() => { setSearchQuery(''); setStatusFilter('all'); setSourceFilter('all'); filterLeads(); setShowAddLead(true); }}
            icon={<UsersIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isVisible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Leads"
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetSectionTitle}>Status</Text>
            {(['all', 'NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'NEGOTIATION', 'BOOKED', 'LOST', 'CLOSED'] as const).map((status) => (
              <TouchableOpacity key={status} style={styles.filterOption} onPress={() => handleStatusChange(status as 'all' | LeadStatus)}>
                <View style={[{ ...styles.filterOptionDot, backgroundColor: status !== 'all' ? statusConfig[status as LeadStatus].color : 'transparent' }]} />
                <Text style={[{ ...styles.filterOptionText, ...(statusFilter === status ? styles.filterOptionTextActive : {}) }, status !== 'all' && { color: statusConfig[status as LeadStatus].color }]}>
                  {status === 'all' ? 'All' : statusConfig[status as LeadStatus].label}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.sheetSectionTitle}>Source</Text>
            {(['all', 'WEBSITE', 'REFERRAL', 'WALK_IN', 'PHONE', 'EMAIL', 'SOCIAL_MEDIA', 'EXHIBITION', 'OTHER'] as const).map((source) => (
              <TouchableOpacity key={source} style={styles.filterOption} onPress={() => handleSourceChange(source as 'all' | LeadSource)}>
                <Text style={[{ ...styles.filterOptionText, ...(sourceFilter === source ? styles.filterOptionTextActive : {}) }]}>
                  {source === 'all' ? 'All' : sourceConfig[source as LeadSource].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      {/* Add Lead Bottom Sheet */}
      <BottomSheet
        isVisible={showAddLead}
        onClose={() => setShowAddLead(false)}
        title="Add New Lead"
        content={
          <View style={styles.sheetContent}>
            <Input label="Name *" value={addLeadForm.name} onChangeText={text => setAddLeadForm(prev => ({ ...prev, name: text }))} placeholder="Lead name" />
            <Input label="Phone *" value={addLeadForm.phone} onChangeText={text => setAddLeadForm(prev => ({ ...prev, phone: text }))} placeholder="+91 98765 43210" keyboardType="phone-pad" />
            <Input label="Email" value={addLeadForm.email} onChangeText={text => setAddLeadForm(prev => ({ ...prev, email: text }))} placeholder="email@example.com" keyboardType="email-address" />
            <Input label="Project" value={addLeadForm.projectId} onChangeText={text => setAddLeadForm(prev => ({ ...prev, projectId: text }))} placeholder="Project name or ID" />
            <View style={styles.budgetRow}>
              <Input label="Budget Min (₹)" value={addLeadForm.budgetMin} onChangeText={text => setAddLeadForm(prev => ({ ...prev, budgetMin: text }))} placeholder="5000000" keyboardType="numeric" style={styles.halfInput} />
              <Input label="Budget Max (₹)" value={addLeadForm.budgetMax} onChangeText={text => setAddLeadForm(prev => ({ ...prev, budgetMax: text }))} placeholder="10000000" keyboardType="numeric" style={styles.halfInput} />
            </View>
            <Input label="Notes" value={addLeadForm.notes} onChangeText={text => setAddLeadForm(prev => ({ ...prev, notes: text }))} placeholder="Additional notes" multiline numberOfLines={3} />
            <Button onPress={handleAddLead} style={{ marginTop: Spacing.md }} fullWidth>Add Lead</Button>
          </View>
        }
      />
    </View>
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

function LeadCard({ lead, onPress }: { lead: Lead; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(lead.status);
  const source = getSourceConfig(lead.source);
  const StatusIcon = status.icon;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{lead.name}</Text>
          <View style={styles.leadMeta}>
            <View style={styles.metaItem}>
              <Phone size={12} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{lead.phone}</Text>
            </View>
            {lead.email && (
              <View style={styles.metaItem}>
                <Mail size={12} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{lead.email}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={lead.status === 'BOOKED' ? 'success' : lead.status === 'NEW' ? 'info' : lead.status === 'LOST' ? 'danger' : lead.status === 'NEGOTIATION' ? 'warning' : 'default'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        {lead.projectName && (
          <View style={styles.projectRow}>
            <MapPin size={14} color={colors.text.tertiary} />
            <Text style={styles.projectText}>{lead.projectName}</Text>
            {lead.propertyType && <Text style={styles.projectText}>• {lead.propertyType}</Text>}
          </View>
        )}
        {lead.budget && (
          <View style={styles.budgetRow}>
            <DollarSign size={14} color={colors.text.tertiary} />
            <Text style={styles.budgetText}>₹{formatPrice(lead.budget.min)} - ₹{formatPrice(lead.budget.max)}</Text>
          </View>
        )}
        <View style={styles.footerRow}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Source</Text>
            <Text style={styles.footerValue}>{source.label}</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Updated</Text>
            <Text style={styles.footerValue}>{formatRelativeTime(lead.updatedAt)}</Text>
          </View>
          {lead.nextFollowUpAt && (
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Next Follow-up</Text>
              <Text style={[{ ...styles.footerValue, color: isOverdue(lead.nextFollowUpAt) ? colors.error.DEFAULT : colors.primary[600] }]}>{formatRelativeTime(lead.nextFollowUpAt)}</Text>
            </View>
          )}
        </View>
        {lead.tags && lead.tags.length > 0 && (
          <View style={styles.tags}>
            {lead.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" style={styles.tag}>{tag}</Badge>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
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
  filterBar: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md },
  filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  filterButtonActive: { backgroundColor: '#fef3c7', borderColor: '#facc15' },
  filterButtonText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterButtonTextActive: { color: '#080d1a', fontWeight: '600' },
  statusFilters: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  statusChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', marginRight: Spacing.sm },
  statusChipActive: { backgroundColor: '#facc15' },
  statusChipText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  statusChipTextActive: { fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: Spacing.md, gap: Spacing.md },
  leadInfo: { flex: 1, minWidth: 0 },
  leadName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  leadMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  metaText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.sm },
  projectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  projectText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  budgetText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: colors.primary[600] },
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
  halfInput: { flex: 1 },
});