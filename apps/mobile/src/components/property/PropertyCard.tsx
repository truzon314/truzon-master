import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Heart, Star, Tag } from 'lucide-react-native';

interface PropertyCardProps {
  property: import('@/types').Property;
  onPress: () => void;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
  showFavorite?: boolean;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const PropertyCard = ({
  property,
  onPress,
  style,
  showFavorite = true,
  onFavoritePress,
  isFavorite = false,
}: PropertyCardProps) => {
  const { colors, spacing } = useTheme();

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return { text: 'Available', variant: 'success' as const };
      case 'blocked':
        return { text: 'Blocked', variant: 'warning' as const };
      case 'booked':
        return { text: 'Booked', variant: 'error' as const };
      case 'sold':
        return { text: 'Sold', variant: 'default' as const };
      default:
        return { text: property.status, variant: 'default' as const };
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images?.[0]?.url || '' }}
          style={styles.image}
          resizeMode="cover"
        />
        {property.images && property.images.length > 1 && (
          <Badge variant="default" size="sm" style={styles.imageCount}>
            +{property.images.length - 1}
          </Badge>
        )}
        {showFavorite && (
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onFavoritePress?.(); }}
            style={styles.favoriteBtn}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.error.DEFAULT : '#ffffff'}
              fill={isFavorite ? colors.error.DEFAULT : undefined}
            />
          </TouchableOpacity>
        )}
        <View style={styles.statusContainer}>
          <Badge variant={getStatusBadge().variant} size="sm">{getStatusBadge().text}</Badge>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.projectName} numberOfLines={1}>{property.projectName}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.text.tertiary} />
          <Text style={styles.location} numberOfLines={1}>{property.location}, {property.city}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Tag size={14} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{property.configuration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Star size={14} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>{property.plotSize.toLocaleString()} sq ft</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.propertyType}>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</Text>
          <Text style={styles.projectTag}>from {property.projectName}</Text>
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
  },
  imageContainer: { position: 'relative', height: 180 },
  image: { width: '100%', height: '100%' },
  imageCount: { position: 'absolute', top: 12, right: 12 },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 13, 26, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: { position: 'absolute', bottom: 12, left: 12 },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  projectName: { fontSize: 13, fontFamily: 'WorkSans_500Medium', color: '#6b7280', flex: 1, marginRight: 8 },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontFamily: 'WorkSans_700Bold', color: '#080d1a' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  location: { fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#6b7280', flex: 1 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, fontFamily: 'WorkSans_500Medium', color: '#374151' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  propertyType: { fontSize: 12, fontFamily: 'WorkSans_500Medium', color: '#facc15' },
  projectTag: { fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#6b7280' },
});