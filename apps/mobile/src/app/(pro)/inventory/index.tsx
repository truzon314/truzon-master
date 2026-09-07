import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { Home, Search, Filter, Plus, ChevronRight, MapPin, DollarSign, Bed, Bath, Ruler, Eye, Edit, Trash2, Building2, Star, MoreHorizontal, Upload, Image as ImageIcon, Home as HomeIcon } from 'lucide-react-native';
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

type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'HIDDEN';

interface Property {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  propertyType: string;
  configuration: string;
  carpetArea: number;
  superBuiltupArea?: number;
  price: number;
  pricePerSqft?: number;
  floor?: number;
  totalFloors?: number;
  facing?: string;
  status: PropertyStatus;
  images: string[];
  amenities: string[];
  reraNumber?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<PropertyStatus, { label: string; color: string }> = {
  AVAILABLE: { label: 'Available', color: '#10b981' },
  BOOKED: { label: 'Booked', color: '#f59e0b' },
  SOLD: { label: 'Sold', color: '#ef4444' },
  UNDER_CONSTRUCTION: { label: 'Under Construction', color: '#3b82f6' },
  READY_TO_MOVE: { label: 'Ready to Move', color: '#8b5cf6' },
  HIDDEN: { label: 'Hidden', color: '#6b7280' },
};

const getStatusConfig = (status: PropertyStatus) => statusConfig[status];

export default function InventoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');
  const [projectFilter, setProjectFilter] = useState<'all' | string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [addPropertyForm, setAddPropertyForm] = useState({
    projectId: '',
    title: '',
    propertyType: 'APARTMENT',
    configuration: '',
    carpetArea: '',
    price: '',
    floor: '',
    totalFloors: '',
    facing: '',
    status: 'AVAILABLE' as PropertyStatus,
  });

  const projects = ['Skyline Towers', 'Green Valley', 'Royal Gardens', 'Sunrise Heights', 'Ocean View'];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setProperties([
        { id: '1', projectId: '1', projectName: 'Skyline Towers', title: '3BHK Premium Unit', propertyType: 'APARTMENT', configuration: '3BHK', carpetArea: 1850, superBuiltupArea: 2200, price: 12500000, pricePerSqft: 6750, floor: 12, totalFloors: 25, facing: 'East', status: 'AVAILABLE', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'], amenities: ['Pool', 'Gym', 'Park'], reraNumber: 'RERA12345', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-20T14:00:00Z' },
        { id: '2', projectId: '1', projectName: 'Skyline Towers', title: '2BHK Standard Unit', propertyType: 'APARTMENT', configuration: '2BHK', carpetArea: 1200, superBuiltupArea: 1450, price: 7800000, pricePerSqft: 6500, floor: 8, totalFloors: 25, facing: 'North', status: 'BOOKED', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'], amenities: ['Pool', 'Gym'], reraNumber: 'RERA12345', createdAt: '2024-01-08T10:00:00Z', updatedAt: '2024-01-15T14:00:00Z' },
        { id: '3', projectId: '2', projectName: 'Green Valley', title: '2BHK Garden View', propertyType: 'APARTMENT', configuration: '2BHK', carpetArea: 1100, superBuiltupArea: 1350, price: 6500000, pricePerSqft: 5900, floor: 3, totalFloors: 15, facing: 'South', status: 'AVAILABLE', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400'], amenities: ['Garden', 'Play Area'], reraNumber: 'RERA67890', createdAt: '2024-01-12T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z' },
        { id: '4', projectId: '3', projectName: 'Royal Gardens', title: '4BHK Luxury Villa', propertyType: 'VILLA', configuration: '4BHK', carpetArea: 3200, superBuiltupArea: 4000, price: 35000000, pricePerSqft: 10900, floor: 1, totalFloors: 2, facing: 'East', status: 'SOLD', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'], amenities: ['Private Pool', 'Garden', 'Garage'], reraNumber: 'RERA54321', createdAt: '2024-01-05T10:00:00Z', updatedAt: '2024-01-12T10:00:00Z' },
        { id: '5', projectId: '2', projectName: 'Green Valley', title: '3BHK Corner Unit', propertyType: 'APARTMENT', configuration: '3BHK', carpetArea: 1650, superBuiltupArea: 2000, price: 9500000, pricePerSqft: 5750, floor: 10, totalFloors: 15, facing: 'West', status: 'AVAILABLE', images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400'], amenities: ['Pool', 'Gym', 'Clubhouse'], reraNumber: 'RERA67890', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-21T10:00:00Z' },
        { id: '6', projectId: '4', projectName: 'Sunrise Heights', title: '2BHK Affordable', propertyType: 'APARTMENT', configuration: '2BHK', carpetArea: 950, superBuiltupArea: 1150, price: 4800000, pricePerSqft: 5050, floor: 5, totalFloors: 20, facing: 'North', status: 'UNDER_CONSTRUCTION', images: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400'], amenities: ['Lift', 'Security'], reraNumber: 'RERA98765', createdAt: '2024-01-18T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z' },
        { id: '7', projectId: '5', projectName: 'Ocean View', title: '3BHK Sea Facing', propertyType: 'APARTMENT', configuration: '3BHK', carpetArea: 2100, superBuiltupArea: 2500, price: 22000000, pricePerSqft: 10400, floor: 18, totalFloors: 30, facing: 'West', status: 'READY_TO_MOVE', images: ['https://images.unsplash.com/photo-1600566753107-0a0b7c6d8e4f?w=400'], amenities: ['Pool', 'Gym', 'Spa', 'Concierge'], reraNumber: 'RERA11111', createdAt: '2024-01-02T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z' },
        { id: '8', projectId: '3', projectName: 'Royal Gardens', title: '3BHK Garden Villa', propertyType: 'VILLA', configuration: '3BHK', carpetArea: 2400, superBuiltupArea: 3000, price: 25000000, pricePerSqft: 10400, floor: 1, totalFloors: 2, facing: 'North', status: 'AVAILABLE', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400'], amenities: ['Garden', 'Garage'], reraNumber: 'RERA54321', createdAt: '2024-01-14T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z' },
      ]);
      filterProperties();
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  const filterProperties = () => {
    let result = properties;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lower) ||
        p.projectName.toLowerCase().includes(lower) ||
        p.configuration.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (projectFilter !== 'all') result = result.filter(p => p.projectId === projectFilter);
    setFilteredProperties(result);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterProperties();
  };

  const handleStatusChange = (status: 'all' | PropertyStatus) => {
    setStatusFilter(status);
    filterProperties();
    setShowFilterSheet(false);
  };

  const handleProjectChange = (project: string) => {
    setProjectFilter(project);
    filterProperties();
    setShowFilterSheet(false);
  };

  const handleAddProperty = async () => {
    if (!addPropertyForm.title || !addPropertyForm.projectId || !addPropertyForm.configuration || !addPropertyForm.carpetArea || !addPropertyForm.price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    // TODO: API call
    Alert.alert('Success', 'Property added successfully');
    setShowAddProperty(false);
    setAddPropertyForm({ projectId: '', title: '', propertyType: 'APARTMENT', configuration: '', carpetArea: '', price: '', floor: '', totalFloors: '', facing: '', status: 'AVAILABLE' });
    loadProperties();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Inventory"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Plus, onPress: () => setShowAddProperty(true) }}
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterBar}>
        <FilterButton label={statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label} active={statusFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
        <FilterButton label={projectFilter === 'all' ? 'All Projects' : projects.find(p => p === projectFilter) || 'All'} active={projectFilter !== 'all'} onPress={() => setShowFilterSheet(true)} icon={Filter} />
      </View>

      <View style={styles.statusFilters}>
        {(['all', 'AVAILABLE', 'BOOKED', 'SOLD', 'UNDER_CONSTRUCTION', 'READY_TO_MOVE', 'HIDDEN'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[{ ...styles.statusChip, ...(statusFilter === status ? styles.statusChipActive : {}) }, status !== 'all' && { borderColor: statusConfig[status as PropertyStatus].color }]}
            onPress={() => handleStatusChange(status as 'all' | PropertyStatus)}
          >
            <View style={[{ ...styles.statusDot, backgroundColor: status !== 'all' ? statusConfig[status as PropertyStatus].color : 'transparent' }]} />
            <Text style={[{ ...styles.statusChipText, ...(statusFilter === status ? styles.statusChipTextActive : {}) }, status !== 'all' && { color: statusConfig[status as PropertyStatus].color }]}>
              {status === 'all' ? 'All' : statusConfig[status as PropertyStatus].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProperties}
        renderItem={({ item }) => (
          <PropertyCard property={item} onPress={() => router.push(`/(pro)/inventory/${item.id}`)} />
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
            title="No Properties Found"
            message={searchQuery || statusFilter !== 'all' || projectFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first property to get started'}
            actionLabel={searchQuery || statusFilter !== 'all' || projectFilter !== 'all' ? 'Clear Filters' : 'Add Property'}
            onAction={() => { setSearchQuery(''); setStatusFilter('all'); setProjectFilter('all'); filterProperties(); setShowAddProperty(true); }}
            icon={<HomeIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isVisible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Properties"
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetSectionTitle}>Status</Text>
            {(['all', 'AVAILABLE', 'BOOKED', 'SOLD', 'UNDER_CONSTRUCTION', 'READY_TO_MOVE', 'HIDDEN'] as const).map((status) => (
              <TouchableOpacity key={status} style={styles.filterOption} onPress={() => handleStatusChange(status as 'all' | PropertyStatus)}>
                <View style={[{ ...styles.filterOptionDot, backgroundColor: status !== 'all' ? statusConfig[status as PropertyStatus].color : 'transparent', borderWidth: status === 'all' ? 1 : 0, borderColor: '#e5e7eb' }]} />
                <Text style={[{ ...styles.filterOptionText, ...(statusFilter === status ? styles.filterOptionTextActive : {}) }, status !== 'all' && { color: statusConfig[status as PropertyStatus].color }]}>
                  {status === 'all' ? 'All' : statusConfig[status as PropertyStatus].label}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.sheetSectionTitle}>Project</Text>
            <TouchableOpacity style={styles.filterOption} onPress={() => handleProjectChange('all')}>
              <Text style={[{ ...styles.filterOptionText, ...(projectFilter === 'all' ? styles.filterOptionTextActive : {}) }]}>All Projects</Text>
            </TouchableOpacity>
            {projects.map((project) => (
              <TouchableOpacity key={project} style={styles.filterOption} onPress={() => handleProjectChange(project)}>
                <Text style={[{ ...styles.filterOptionText, ...(projectFilter === project ? styles.filterOptionTextActive : {}) }]}>{project}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      {/* Add Property Bottom Sheet */}
      <BottomSheet
        isVisible={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        title="Add New Property"
        content={
          <View style={styles.sheetContent}>
            <Input label="Project *" value={addPropertyForm.projectId} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, projectId: text }))} placeholder="Project name" />
            <Input label="Title *" value={addPropertyForm.title} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, title: text }))} placeholder="e.g., 3BHK Premium Unit" />
            <View style={styles.formRow}>
              <Input label="Type" value={addPropertyForm.propertyType} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, propertyType: text }))} placeholder="APARTMENT/VILLA" style={styles.halfInput} />
              <Input label="Configuration *" value={addPropertyForm.configuration} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, configuration: text }))} placeholder="2BHK/3BHK/4BHK" style={styles.halfInput} />
            </View>
            <View style={styles.formRow}>
              <Input label="Carpet Area (sq.ft) *" value={addPropertyForm.carpetArea} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, carpetArea: text }))} placeholder="1200" keyboardType="numeric" style={styles.halfInput} />
              <Input label="Price (₹) *" value={addPropertyForm.price} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, price: text }))} placeholder="5000000" keyboardType="numeric" style={styles.halfInput} />
            </View>
            <View style={styles.formRow}>
              <Input label="Floor" value={addPropertyForm.floor} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, floor: text }))} placeholder="5" keyboardType="numeric" style={styles.halfInput} />
              <Input label="Total Floors" value={addPropertyForm.totalFloors} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, totalFloors: text }))} placeholder="15" keyboardType="numeric" style={styles.halfInput} />
            </View>
            <Input label="Facing" value={addPropertyForm.facing} onChangeText={text => setAddPropertyForm(prev => ({ ...prev, facing: text }))} placeholder="East/West/North/South" />
            <Button onPress={handleAddProperty} style={{ marginTop: Spacing.md }} fullWidth>Add Property</Button>
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

function PropertyCard({ property, onPress }: { property: Property; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(property.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        {property.images[0] && (
          <Image source={{ uri: property.images[0] }} style={styles.propertyImage} resizeMode="cover" />
        )}
        <View style={styles.propertyInfo}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Badge variant={property.status === 'AVAILABLE' ? 'success' : property.status === 'BOOKED' ? 'warning' : property.status === 'SOLD' ? 'danger' : 'default'}>
              {status.label}
            </Badge>
          </View>
          <Text style={styles.propertyProject}>{property.projectName}</Text>
          <View style={styles.propertySpecs}>
            <SpecItem icon={Bed} value={property.configuration} />
            <SpecItem icon={Ruler} value={`${property.carpetArea} sq.ft`} />
            {property.floor && <SpecItem icon={Home} value={`${property.floor}/${property.totalFloors}`} />}
            {property.facing && <SpecItem icon={MapPin} value={property.facing} />}
          </View>
          <View style={styles.propertyPrice}>
            <Text style={styles.price}>₹{formatPrice(property.price)}</Text>
            {property.pricePerSqft && <Text style={styles.pricePerSqft}>₹{property.pricePerSqft.toLocaleString()}/sq.ft</Text>}
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.updatedText}>Updated {formatRelativeTime(property.updatedAt)}</Text>
        <ChevronRight size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

function SpecItem({ icon: Icon, value }: { icon: any; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.specItem}>
      <Icon size={12} color={colors.text.tertiary} />
      <Text style={styles.specText}>{value}</Text>
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

const styles = StyleSheet.create({
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
  cardHeader: { flexDirection: 'row', gap: Spacing.md },
  propertyImage: { width: 100, height: 100, borderRadius: BorderRadius.lg },
  propertyInfo: { flex: 1, minWidth: 0, justifyContent: 'space-between' },
  propertyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  propertyProject: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: Spacing.xs },
  propertySpecs: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.sm },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  specText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  propertyPrice: { marginTop: Spacing.sm },
  price: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: colors.primary[600] },
  pricePerSqft: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  updatedText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  formRow: { flexDirection: 'row', gap: Spacing.md },
  halfInput: { flex: 1 },
  sheetContent: { gap: Spacing.lg },
  sheetSectionTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginBottom: Spacing.md },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  filterOptionDot: { width: 10, height: 10, borderRadius: 5 },
  filterOptionText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  filterOptionTextActive: { fontWeight: '600' },
});