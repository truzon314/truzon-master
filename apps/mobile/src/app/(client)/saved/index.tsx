import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Heart, Filter, Trash2, ChevronRight, Bell, User as UserIcon, Settings, LogOut, Moon, Shield, HelpCircle, CreditCard, FileText, MapPin, Heart as HeartIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/layout/EmptyState';
import { Spacing, Typography, BorderRadius } from '@/theme';

export default function SavedScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { user, logout } = useAuthStore();
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/favorites');
      // setSavedProperties(response.data);
      
      // Mock data for now
      setSavedProperties([
        {
          id: '1',
          title: '3 BHK Luxury Apartment',
          locality: 'Banjara Hills',
          city: 'Hyderabad',
          price: 12500000,
          carpetArea: 1850,
          bhk: 3,
          bathrooms: 3,
          images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }],
          status: 'AVAILABLE',
        },
        {
          id: '2',
          title: '2 BHK Modern Flat',
          locality: 'Gachibowli',
          city: 'Hyderabad',
          price: 7800000,
          carpetArea: 1200,
          bhk: 2,
          bathrooms: 2,
          images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' }],
          status: 'AVAILABLE',
        },
      ]);
    } catch (error) {
      console.error('Failed to load saved properties:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSavedProperties();
  };

  const removeSaved = (id: string) => {
    setSavedProperties(prev => prev.filter(p => p.id !== id));
    // TODO: API call to remove from favorites
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Saved Properties"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Filter, onPress: () => {} }}
      />

      <FlatList
        data={savedProperties}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/(client)/property/${item.id}`)}
            onFavoritePress={() => removeSaved(item.id)}
            isFavorite={true}
            showFavorite={true}
          />
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
            title="No Saved Properties"
            message="Start exploring and save properties you like to see them here"
            actionLabel="Explore Properties"
            onAction={() => router.push('/(client)/explore')}
            icon={<HeartIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
});