import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Home, Building2, TrendingUp } from 'lucide-react-native';

interface ProjectCardProps {
  project: import('@/types').Project;
  onPress: () => void;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

export const ProjectCard = ({
  project,
  onPress,
  style,
}: ProjectCardProps) => {
  const { colors, spacing } = useTheme();

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case 'active':
        return { text: 'Active', variant: 'success' as const };
      case 'upcoming':
        return { text: 'Upcoming', variant: 'info' as const };
      case 'launching':
        return { text: 'Launching Soon', variant: 'warning' as const };
      case 'sold_out':
        return { text: 'Sold Out', variant: 'error' as const };
      case 'completed':
        return { text: 'Completed', variant: 'default' as const };
      default:
        return { text: project.status, variant: 'default' as const };
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: project.images?.[0]?.url || '' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.statusContainer}>
          <Badge variant={getStatusBadge().variant} size="sm">{getStatusBadge().text}</Badge>
        </View>
        <View style={styles.imageOverlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.availableUnits}>{project.availableUnits} of {project.totalUnits} units available</Text>
            <Text style={styles.priceRange}>{formatPrice(project.priceRange.min)} - {formatPrice(project.priceRange.max)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{project.name}</Text>

        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.text.tertiary} />
          <Text style={styles.location} numberOfLines={1}>{project.location}, {project.city}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Home size={14} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{project.configurations?.[0] || 'Various'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Building2 size={14} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{project.propertyTypes?.join(', ') || 'Multiple'}</Text>
          </View>
        </View>

        {project.reraNumber && (
          <View style={styles.reraRow}>
            <Text style={styles.reraLabel}>RERA: </Text>
            <Text style={styles.reraValue}>{project.reraNumber}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.propertyType}>{project.propertyTypes?.[0] || 'Residential'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#080d1a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: 280,
  },
  imageContainer: { position: 'relative', height: 160 },
  image: { width: '100%', height: '100%' },
  statusContainer: { position: 'absolute', top: 12, left: 12 },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(8, 13, 26, 0.7)',
  },
  overlayContent: { gap: 4 },
  availableUnits: { fontSize: 12, fontFamily: 'WorkSans_500Medium', color: '#ffffff' },
  priceRange: { fontSize: 14, fontFamily: 'WorkSans_700Bold', color: '#facc15' },
  content: { padding: 16 },
  name: { fontSize: 16, fontFamily: 'WorkSans_600SemiBold', color: '#080d1a', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  location: { fontSize: 13, fontFamily: 'WorkSans_400Regular', color: '#6b7280', flex: 1 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, fontFamily: 'WorkSans_500Medium', color: '#374151' },
  reraRow: { marginBottom: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fef3c7', borderRadius: 6 },
  reraLabel: { fontSize: 11, fontFamily: 'WorkSans_500Medium', color: '#92400e' },
  reraValue: { fontSize: 11, fontFamily: 'WorkSans_400Regular', color: '#92400e' },
  footer: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  propertyType: { fontSize: 12, fontFamily: 'WorkSans_500Medium', color: '#facc15' },
});