import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { Filter, Search, MapPin, ChevronRight, Heart, Grid, List, Home, Building2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProperties, useProjects } from '@/features/properties/hooks/useProperties';
import { useTheme } from '@/hooks/useTheme';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/layout/EmptyState';
import { Header } from '@/components/layout/Header';
import { Spacing, Typography, BorderRadius } from '@/theme';
import { useDebounce } from '@/hooks/useDebounce';

export default function ExploreScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'properties' | 'projects'>('properties');
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    configuration: '',
    city: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: propertiesData, isLoading: propertiesLoading, refetch: refetchProperties } = useProperties({
    search: debouncedSearch,
    propertyType: filters.propertyType,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    configuration: filters.configuration,
    city: filters.city,
    page: 1,
    perPage: 20,
  });

  const { data: projectsData, isLoading: projectsLoading, refetch: refetchProjects } = useProjects({
    search: debouncedSearch,
    city: filters.city,
    page: 1,
    perPage: 20,
  });

  const handleRefresh = useCallback(() => {
    if (selectedTab === 'properties') {
      refetchProperties();
    } else {
      refetchProjects();
    }
  }, [selectedTab, refetchProperties, refetchProjects]);

  const renderItem = ({ item }: { item: any }) => {
    if (selectedTab === 'properties') {
      return (
        <PropertyCard
          property={item}
          onPress={() => router.push(`/(client)/property/${item.id}`)}
          onFavoritePress={() => {}}
        />
      );
    }
    return (
      <ProjectCard
        project={item}
        onPress={() => router.push(`/(client)/projects/${item.id}`)}
      />
    );
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Explore"
        leftAction={{ onPress: () => {} }}
        rightAction={{
          icon: Filter,
          onPress: () => setShowFilters(!showFilters),
        }}
      />

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            <FilterChip label="Property Type" value={filters.propertyType} onPress={() => {}} />
            <FilterChip label="Min Price" value={filters.minPrice} onPress={() => {}} />
            <FilterChip label="Max Price" value={filters.maxPrice} onPress={() => {}} />
            <FilterChip label="Configuration" value={filters.configuration} onPress={() => {}} />
            <FilterChip label="City" value={filters.city} onPress={() => {}} />
            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearFilter} onPress={() => setFilters({ propertyType: '', minPrice: '', maxPrice: '', configuration: '', city: '' })}>
                <Text style={styles.clearFilterText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search properties, projects, localities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[{ ...styles.tab, ...(selectedTab === 'properties' ? styles.tabActive : {}) }]}
          onPress={() => { setSelectedTab('properties'); setShowFilters(false); }}
        >
          <Grid size={18} color={selectedTab === 'properties' ? colors.primary[600] : colors.text.tertiary} />
          <Text style={[{ ...styles.tabText, ...(selectedTab === 'properties' ? styles.tabTextActive : {}) }]}>
            Properties
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ ...styles.tab, ...(selectedTab === 'projects' ? styles.tabActive : {}) }]}
          onPress={() => { setSelectedTab('projects'); setShowFilters(false); }}
        >
          <MapPin size={18} color={selectedTab === 'projects' ? colors.primary[600] : colors.text.tertiary} />
          <Text style={[{ ...styles.tabText, ...(selectedTab === 'projects' ? styles.tabTextActive : {}) }]}>
            Projects
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={selectedTab === 'properties' ? propertiesData?.items || [] : projectsData?.items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={propertiesLoading || projectsLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary[600]]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title={selectedTab === 'properties' ? 'No Properties Found' : 'No Projects Found'}
            message={searchQuery || hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Pull to refresh or check back later'}
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(''); setFilters({ propertyType: '', minPrice: '', maxPrice: '', configuration: '', city: '' }); }}
            icon={selectedTab === 'properties' ? <Home size={24} color={colors.text.tertiary} /> : <Building2 size={24} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function FilterChip({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  const { colors } = useTheme();
  const hasValue = value !== '';
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        hasValue && { backgroundColor: colors.primary[100], borderColor: colors.primary[600] },
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        hasValue && { color: colors.primary[600], fontWeight: '600' },
      ]}>
        {label}{hasValue && `: ${value}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filtersContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  filtersScroll: { gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterChipText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium },
  clearFilter: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  clearFilterText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#ef4444' },
  searchContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  searchInput: { backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, backgroundColor: '#f3f4f6' },
  tabActive: { backgroundColor: '#fef3c7' },
  tabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  tabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
});