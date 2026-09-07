import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions, FlatList, Alert } from 'react-native';
import { MapPin, Heart, Share2, ChevronRight, Star, Bed, Bath, Ruler, Calendar, CheckCircle, Phone, Mail, ArrowLeft, Image as ImageIcon, MapPin as MapPinIcon, DollarSign, Home } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProperty } from '@/features/properties/hooks/useProperty';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, Spacing, Typography, BorderRadius, Shadows } from '@/theme';
import { BottomSheet } from '@/components/layout/BottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, spacing } = useTheme();
  const { user } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showBookingSheet, setShowBookingSheet] = useState(false);

  const { data: property, isLoading, error, refetch } = useProperty(id as string);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <Button variant="outline" onPress={() => router.back()} style={styles.errorButton}>
          Go Back
        </Button>
      </View>
    );
  }

  const gallery = property.images || [];
  const amenities = property.amenities || [];
  const floorPlans = property.floorPlans || [];
  const nearbyPlaces = property.nearbyPlaces || [];

  return (
    <View style={styles.screenContainer}>
      <Header
        title={property.title || 'Property Details'}
        leftAction={{ onPress: () => router.back() }}
        rightAction={{
          icon: isFavorite ? Heart : Heart,
          onPress: () => setIsFavorite(!isFavorite),
        }}
      />

      <ScrollView contentContainerStyle={styles.galleryScrollView} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        {gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <FlatList
              data={gallery}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => { setSelectedImageIndex(index); setShowGallery(true); }}>
                  <Image source={{ uri: item.url }} style={styles.galleryImage} resizeMode="cover" />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.galleryContent}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setSelectedImageIndex(index);
              }}
            />
            <View style={styles.galleryDots}>
              {gallery.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === selectedImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.galleryCount} onPress={() => { setShowGallery(true); }}>
              <ImageIcon size={16} color="#fff" />
              <Text style={styles.galleryCountText}>{gallery.length} Photos</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.headerSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{property.price ? `₹${formatPrice(property.price)}` : 'Price on Request'}</Text>
              {property.pricePerSqft && (
                <Text style={styles.pricePerSqft}>₹{property.pricePerSqft.toLocaleString()}/sq.ft</Text>
              )}
            </View>
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.text.tertiary} />
              <Text style={styles.locationText}>{property.locality}, {property.city}</Text>
            </View>
            <View style={styles.badgesRow}>
              <Badge variant={property.status === 'available' ? 'success' : property.status === 'booked' ? 'warning' : 'default'}>
                {property.status}
              </Badge>
              {property.propertyType && <Badge variant="outline">{property.propertyType}</Badge>}
              {property.reraNumber && <Badge variant="outline">RERA</Badge>}
            </View>
          </View>

          {/* Key Specs */}
          <View style={styles.specsGrid}>
            <SpecItem icon={Bed} label="BHK" value={`${property.bhk || 'N/A'} BHK`} />
            <SpecItem icon={Bath} label="Bathrooms" value={property.bathrooms?.toString() || 'N/A'} />
            <SpecItem icon={Ruler} label="Carpet Area" value={`${property.carpetArea || 'N/A'} sq.ft`} />
            {property.builtUpArea && (
              <SpecItem icon={Home} label="Built-up Area" value={`${property.builtUpArea} sq.ft`} />
            )}
            {property.facing && (
              <SpecItem icon={MapPinIcon} label="Facing" value={property.facing} />
            )}
            {property.floor && property.totalFloors && (
              <SpecItem icon={Home} label="Floor" value={`${property.floor}/${property.totalFloors}`} />
            )}
          </View>

          {/* Description */}
          {property.description && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Description</Text>
              </View>
              <Text style={styles.description}>{property.description}</Text>
            </Card>
          )}

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

          {/* Floor Plans */}
          {floorPlans.length > 0 && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Floor Plans</Text>
              </View>
              <FlatList
                data={floorPlans}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.floorPlanCard} onPress={() => {}}>
                    <Image source={{ uri: item.imageUrl }} style={styles.floorPlanImage} resizeMode="cover" />
                    <View style={styles.floorPlanOverlay}>
                      <Text style={styles.floorPlanName}>{item.name}</Text>
                      <Text style={styles.floorPlanArea}>{item.area} sq.ft</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.floorPlansContent}
              />
            </Card>
          )}

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby Places</Text>
              </View>
              <FlatList
                data={nearbyPlaces}
                renderItem={({ item }) => (
                  <View style={styles.nearbyItem}>
                    <View style={styles.nearbyIcon}><MapPinIcon size={16} color={colors.primary[600]} /></View>
                    <View style={styles.nearbyInfo}>
                      <Text style={styles.nearbyName}>{item.name}</Text>
                      <Text style={styles.nearbyDistance}>{item.distance} km • {item.type}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Card>
          )}

          {/* Project Info */}
          {property.projectId && (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Project</Text>
              </View>
              <TouchableOpacity style={styles.projectLink} onPress={() => router.push(`/(client)/projects/${property.projectId}`)}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{property.projectName}</Text>
                  <Text style={styles.projectLocation}>{property.location}, {property.city}</Text>
                </View>
                <ChevronRight size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          variant="outline"
          onPress={() => setShowContactSheet(true)}
          leftIcon={<Phone size={20} />}
          style={styles.bottomButton}
        >
          Contact
        </Button>
        <Button
          onPress={() => user ? setShowBookingSheet(true) : router.push('/(auth)/login')}
          rightIcon={<ChevronRight size={20} />}
          style={styles.bottomButtonPrimary}
        >
          Book Visit
        </Button>
      </View>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <View style={styles.fullGalleryContainer}>
          <FlatList
            data={gallery}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedImageIndex}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.fullGalleryImage} resizeMode="contain" />
            )}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(e) => {
              setSelectedImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
          />
          <TouchableOpacity style={styles.closeGallery} onPress={() => setShowGallery(false)}>
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.galleryCounter}>
            <Text style={styles.galleryCounterText}>{selectedImageIndex + 1} / {gallery.length}</Text>
          </View>
        </View>
      )}

      {/* Contact Bottom Sheet */}
      <BottomSheet
        visible={showContactSheet}
        onClose={() => setShowContactSheet(false)}
        title="Contact Agent"
      >
        <View style={styles.sheetContent}>
          {property.agent && (
            <View style={styles.agentCard}>
              <Image source={{ uri: property.agent.avatar }} style={styles.agentAvatar} />
              <View>
                <Text style={styles.agentName}>{property.agent.name}</Text>
                <Text style={styles.agentRole}>{property.agent.role}</Text>
              </View>
            </View>
          )}
          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.sheetAction} onPress={() => {}}>
              <Phone size={24} color={colors.primary[600]} />
              <Text style={styles.sheetActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetAction} onPress={() => {}}>
              <Mail size={24} color={colors.primary[600]} />
              <Text style={styles.sheetActionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetAction} onPress={() => {}}>
              <Share2 size={24} color={colors.primary[600]} />
              <Text style={styles.sheetActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      {/* Booking Bottom Sheet */}
      <BottomSheet
        visible={showBookingSheet}
        onClose={() => setShowBookingSheet(false)}
        title="Schedule Site Visit"
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetDescription}>Select preferred date and time for site visit</Text>
          <View style={styles.bookingSlots}>
            {['Tomorrow 10:00 AM', 'Tomorrow 2:00 PM', 'Day After 10:00 AM', 'Day After 4:00 PM'].map((slot, i) => (
              <TouchableOpacity key={i} style={styles.bookingSlot}>
                <Text style={styles.bookingSlotText}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            variant="outline"
            onPress={() => { Alert.alert('Booking Confirmed', 'Site visit scheduled successfully'); setShowBookingSheet(false); }}
            style={styles.bookingButton}
          >
            Confirm Booking
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.specItem}>
      <View style={styles.specIcon}><Icon size={22} color={colors.primary[600]} /></View>
      <View>
        <Text style={styles.specLabel}>{label}</Text>
        <Text style={styles.specValue}>{value}</Text>
      </View>
    </View>
  );
}

function PropertyDetailSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <Header title="Loading..." leftAction={{ onPress: () => {} }} />
      <ScrollView contentContainerStyle={styles.skeletonContent}>
        <Skeleton width="100%" height={200} borderRadius={12} />
        <View style={styles.content}>
          <Skeleton width="40%" height={28} borderRadius={4} />
          <Skeleton width="60%" height={18} borderRadius={4} />
          <View style={styles.specsGrid}>
            <Skeleton width={60} height={60} borderRadius={30} />
            <Skeleton width={60} height={60} borderRadius={30} />
            <Skeleton width={60} height={60} borderRadius={30} />
            <Skeleton width={60} height={60} borderRadius={30} />
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
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorText: { color: colors.text.secondary, fontSize: Typography.sizes.lg },
  errorButton: { marginTop: Spacing.md, width: 200 },
  screenContainer: { flex: 1, backgroundColor: colors.background.primary },
  galleryScrollView: { paddingBottom: 120 },
  galleryContainer: { height: 300 },
  galleryContent: { width: SCREEN_WIDTH },
  galleryImage: { width: SCREEN_WIDTH, height: 300 },
  galleryDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 24 },
  galleryCount: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  galleryCountText: { color: '#fff', fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium },
  content: { padding: Spacing.md },
  headerSection: { marginBottom: Spacing.lg },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, marginBottom: Spacing.xs },
  price: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.fonts.bold, color: '#080d1a' },
  pricePerSqft: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  locationText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  badgesRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap' },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  specItem: { flex: 1, minWidth: '30%', flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg },
  specIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  specLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  specValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  description: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, lineHeight: 24 },
  amenitiesGrid: { gap: Spacing.md },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  amenityText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a' },
  floorPlansContent: { gap: Spacing.md, paddingVertical: Spacing.xs },
  floorPlanCard: { width: 200, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  floorPlanImage: { width: 200, height: 150 },
  floorPlanOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, backgroundColor: 'rgba(0,0,0,0.7)' },
  floorPlanName: { color: '#fff', fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold },
  floorPlanArea: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular },
  nearbyItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  nearbyIcon: { width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  nearbyDistance: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  separator: { height: 1, backgroundColor: '#f3f4f6' },
  projectLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  projectInfo: { flex: 1 },
  projectName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  projectLocation: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, flexDirection: 'row', gap: Spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingBottom: Spacing.xl },
  bottomButton: { flex: 1 },
  bottomButtonPrimary: { flex: 1 },
  fullGalleryContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 100 },
  fullGalleryImage: { width: SCREEN_WIDTH, height: Dimensions.get('window').height },
  closeGallery: { position: 'absolute', top: 50, left: 20, zIndex: 101, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  galleryCounter: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center', zIndex: 101 },
  galleryCounterText: { color: '#fff', fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium },
  sheetContent: { gap: Spacing.lg },
  agentCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg },
  agentAvatar: { width: 56, height: 56, borderRadius: 28 },
  agentName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  agentRole: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  sheetActions: { flexDirection: 'row', justifyContent: 'space-around' },
  sheetAction: { alignItems: 'center', gap: Spacing.xs },
  sheetActionText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: colors.primary[600] },
  sheetDescription: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginBottom: Spacing.md },
  bookingSlots: { gap: Spacing.sm },
  bookingSlot: { padding: Spacing.md, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: BorderRadius.lg },
  bookingSlotText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: '#080d1a', textAlign: 'center' },
  bookingButton: { marginTop: Spacing.md },
  skeletonContainer: { flex: 1, backgroundColor: '#fff' },
  skeletonContent: { padding: Spacing.md },
});
