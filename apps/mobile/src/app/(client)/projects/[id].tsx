import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { MapPin, Heart, Share2, ChevronRight, Star, Bed, Bath, Ruler, Calendar, CheckCircle, Phone, Mail } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProjects, useProject } from '@/features/projects/hooks/useProjects';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingOverlay as Loading } from '@/components/ui/Loading';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, Spacing, Typography, BorderRadius, Shadows } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, spacing } = useTheme();
  const { user } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: project, isLoading, error, refetch } = useProject(id as string);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
        <Text style={{ color: colors.text.secondary, fontSize: Typography.sizes.lg }}>Project not found</Text>
        <Button variant="outline" onPress={() => router.back()} style={{ marginTop: Spacing.md, width: 200 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const amenities = project.amenities || [];
  const gallery = project.gallery || [];
  const configurations = project.configurations || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title={project.name}
        leftAction={{ onPress: () => router.back() }}
        rightAction={{
          icon: isFavorite ? Heart : Heart,
          onPress: () => setIsFavorite(!isFavorite),
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        {gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <FlatList
              data={gallery}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item.url }} style={styles.galleryImage} resizeMode="cover" />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.galleryContent}
            />
            <View style={styles.galleryDots}>
              {gallery.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === 0 && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.headerSection}>
            <Text style={styles.projectName}>{project.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.text.tertiary} />
              <Text style={styles.locationText}>{project.city}, {project.state}</Text>
            </View>
            <View style={styles.badgesRow}>
              <Badge variant={project.status === 'active' ? 'success' : project.status === 'upcoming' ? 'info' : 'default'}>
                {project.status}
              </Badge>
              {project.reraNumber && (
                <Badge variant="outline">RERA: {project.reraNumber}</Badge>
              )}
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlights}>
            {project.minPrice && project.maxPrice && (
              <HighlightItem icon={Star} label="Price Range" value={`₹${formatPrice(project.minPrice)} - ₹${formatPrice(project.maxPrice)}`} />
            )}
            {configurations.length > 0 && (
              <HighlightItem icon={Bed} label="Configurations" value={configurations.join(', ')} />
            )}
            {project.totalUnits && (
              <HighlightItem icon={Ruler} label="Total Units" value={project.totalUnits.toString()} />
            )}
            {project.possessionDate && (
              <HighlightItem icon={Calendar} label="Possession" value={new Date(project.possessionDate).toLocaleDateString()} />
            )}
          </View>

          {/* About */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About Project</Text>
            </View>
            <Text style={styles.description}>{project.description || 'No description available'}</Text>
          </Card>

          {/* Amenities */}
          {amenities.length > 0 && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Amenities</Text>
              </View>
              <FlatList
                data={amenities}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={styles.amenityItem}>
                    <CheckCircle size={20} color={colors.success.DEFAULT} />
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                )}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.amenitiesGrid}
              />
            </Card>
          )}

          {/* Configurations */}
          {configurations.length > 0 && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Configurations</Text>
              </View>
              <FlatList
                data={configurations}
                renderItem={({ item }) => (
                  <View style={styles.configItem}>
                    <Text style={styles.configText}>{item}</Text>
                    <ChevronRight size={20} color={colors.text.tertiary} />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Card>
          )}

          {/* Contact Developer */}
          <Card style={styles.contactSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contact Developer</Text>
            </View>
            <View style={styles.contactInfo}>
              {project.developerContact?.phone && (
                <TouchableOpacity style={styles.contactItem} onPress={() => {}}>
                  <Phone size={20} color={colors.primary[600]} />
                  <Text style={styles.contactText}>{project.developerContact.phone}</Text>
                </TouchableOpacity>
              )}
              {project.developerContact?.email && (
                <TouchableOpacity style={styles.contactItem} onPress={() => {}}>
                  <Mail size={20} color={colors.primary[600]} />
                  <Text style={styles.contactText}>{project.developerContact.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          variant="outline"
          onPress={() => {}}
          leftIcon={<Phone size={20} />}
          style={styles.bottomButton}
        >
          Call
        </Button>
        <Button
          onPress={() => user ? router.push(`/(client)/enquiries/new?projectId=${id}`) : router.push('/(auth)/login')}
          rightIcon={<ChevronRight size={20} />}
          style={styles.bottomButtonPrimary}
        >
          Enquire Now
        </Button>
      </View>
    </View>
  );
}

function HighlightItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.highlightItem}>
      <View style={styles.highlightIcon}><Icon size={24} color={colors.primary[600]} /></View>
      <View>
        <Text style={styles.highlightLabel}>{label}</Text>
        <Text style={styles.highlightValue}>{value}</Text>
      </View>
    </View>
  );
}

function ProjectDetailSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Loading..." leftAction={{ onPress: () => {} }} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Skeleton width="100%" height={200} borderRadius={16} />
        <View style={styles.content}>
          <Skeleton width="70%" height={24} borderRadius={4} />
          <Skeleton width="50%" height={16} borderRadius={4} />
          <View style={styles.highlights}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width={40} height={40} borderRadius={20} />
          </View>
           <Card style={styles.section}>
             <Skeleton width="60%" height={18} borderRadius={4} />
             <Skeleton width="100%" height={60} borderRadius={4} />
           </Card>
           <Card style={styles.section}>
             <Skeleton width="60%" height={18} borderRadius={4} />
             <View style={styles.amenitiesGrid}>
               <Skeleton width={100} height={32} borderRadius={16} />
               <Skeleton width={100} height={32} borderRadius={16} />
               <Skeleton width={100} height={32} borderRadius={16} />
               <Skeleton width={100} height={32} borderRadius={16} />
             </View>
           </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return price.toLocaleString();
}

const styles = StyleSheet.create({
  galleryContainer: { height: 300 },
  galleryContent: { width: SCREEN_WIDTH },
  galleryImage: { width: SCREEN_WIDTH, height: 300 },
  galleryDots: { position: 'absolute' as const, bottom: 16, left: 0, right: 0, flexDirection: 'row' as const, justifyContent: 'center' as const, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 24 },
  content: { padding: Spacing.md },
  headerSection: { marginBottom: Spacing.lg },
  projectName: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.fonts.bold, color: '#080d1a', marginBottom: Spacing.xs },
  locationRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.xs },
  locationText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  badgesRow: { flexDirection: 'row' as const, gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap' as const },
  highlights: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: Spacing.md, marginBottom: Spacing.lg },
  highlightItem: { flex: 1, minWidth: '45%' as any, flexDirection: 'row' as const, gap: Spacing.sm, padding: Spacing.md, backgroundColor: '#fef3c7', borderRadius: BorderRadius.lg },
  highlightIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: '#facc15', justifyContent: 'center' as const, alignItems: 'center' as const },
  highlightLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  highlightValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  description: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, lineHeight: 24 },
  amenitiesGrid: { gap: Spacing.md },
  amenityItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.sm, paddingVertical: Spacing.xs },
  amenityText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  configItem: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingVertical: Spacing.sm },
  configText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  separator: { height: 1, backgroundColor: '#f3f4f6' },
  contactSection: { marginBottom: Spacing.lg },
  contactInfo: { flexDirection: 'row' as const, gap: Spacing.lg },
  contactItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.sm },
  contactText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  bottomBar: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: Spacing.md, flexDirection: 'row' as const, gap: Spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingBottom: Spacing.xl },
  bottomButton: { flex: 1 },
  bottomButtonPrimary: { flex: 1 },
});