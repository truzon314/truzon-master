import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState, LoadingState } from '@/components/layout/EmptyState';
import { SkeletonPropertyCard } from '@/components/ui/Skeleton';
import { Search, Filter, MapPin, Heart, Star, TrendingUp, ArrowRight, Bell, Plus } from 'lucide-react-native';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ProjectCard } from '@/components/project/ProjectCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user, notificationCount } = useAuthStore();
  const { colors, spacing } = useTheme();
  const { data: properties, isLoading: propertiesLoading } = useProperties({ perPage: 6, featured: true });
  const { data: projects, isLoading: projectsLoading } = useProjects({ perPage: 4, featured: true });

  const handleSearchPress = () => router.push('/(client)/explore?tab=properties');
  const handleExploreProjects = () => router.push('/(client)/explore?tab=projects');

  const welcomeName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header
        title={`Good morning, ${welcomeName}`}
        subtitle="Discover your dream home today"
        showProfile
        onProfilePress={() => router.push('/(client)/profile')}
        onNotificationPress={() => router.push('/(client)/notifications')}
        notificationCount={notificationCount}
        onSearchPress={handleSearchPress}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            <TouchableOpacity onPress={handleExploreProjects} style={styles.seeAll}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} />
            </TouchableOpacity>
          </View>

          {projectsLoading ? (
            <View style={styles.cardList}>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonPropertyCard key={i} />)}
            </View>
          ) : projects && projects.items.length > 0 ? (
            <FlatList
              data={projects.items}
              renderItem={({ item }) => (
                <ProjectCard
                  project={item}
                  onPress={() => router.push(`/(client)/projects/${item.slug}`)}
                  style={styles.projectCard}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardList}
            />
          ) : (
            <EmptyState
              icon={<TrendingUp size={48} />}
              title="No Featured Projects"
              message="Check back soon for new projects"
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <TouchableOpacity onPress={handleSearchPress} style={styles.seeAll}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} />
            </TouchableOpacity>
          </View>

          {propertiesLoading ? (
            <View style={styles.cardList}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonPropertyCard key={i} />)}
            </View>
          ) : properties && properties.items.length > 0 ? (
            <FlatList
              data={properties.items}
              renderItem={({ item }) => (
                <PropertyCard
                  property={item}
                  onPress={() => router.push(`/(client)/properties/${item.slug}`)}
                  style={styles.propertyCard}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <EmptyState
              icon={<Heart size={48} />}
              title="No Featured Properties"
              message="Check back soon for new listings"
            />
          )}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => router.push('/(client)/enquiries/new')}
            style={[styles.quickAction, { backgroundColor: colors.primary[50] }]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary[100] }]}>
              <Plus size={24} color={colors.primary[600]} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.primary[700] }]}>New Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(client)/site-visits/new')}
            style={[styles.quickAction, { backgroundColor: colors.success.light }]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success.DEFAULT }]}>
              <MapPin size={24} color={colors.text.inverse} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.success.dark }]}>Schedule Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(client)/bookings')}
            style={[styles.quickAction, { backgroundColor: '#fef3c7' }]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#fde68a' }]}>
              <Star size={24} color={colors.gold[600]} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.gold[700] }]}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontFamily: 'WorkSans_600SemiBold', color: '#080d1a' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontSize: 14, fontFamily: 'WorkSans_500Medium', color: '#facc15' },
  cardList: { paddingHorizontal: 16, gap: 12 },
  projectCard: { width: 280 },
  propertyCard: { flex: 1, minWidth: '48%' },
  gridContainer: { paddingHorizontal: 16, gap: 12 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
  quickAction: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, marginHorizontal: 4 },
  quickActionIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionLabel: { fontSize: 13, fontFamily: 'WorkSans_600SemiBold', textAlign: 'center' },
});