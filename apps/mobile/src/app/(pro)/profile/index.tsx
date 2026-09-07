import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { User as UserIcon, Mail, Phone, Building2, MapPin, Calendar, Award, Star, TrendingUp, ChevronRight, Camera, LogOut, Edit3, Shield, Bell, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Spacing, Typography, BorderRadius } from '@/theme';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  channelPartnerId: string;
  channelPartnerName: string;
  role: string;
  city: string;
  joiningDate: string;
  avatar?: string;
  totalLeads: number;
  totalBookings: number;
  totalRevenue: number;
  rating: number;
  achievements: { title: string; icon: any; color: string }[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      setProfile({
        id: '1',
        name: 'Arjun Mehta',
        email: 'arjun@skylineproperties.com',
        phone: '+91 98765 43210',
        channelPartnerId: 'CP001',
        channelPartnerName: 'Skyline Properties',
        role: 'Senior Channel Partner',
        city: 'Hyderabad',
        joiningDate: '2022-03-15',
        totalLeads: 156,
        totalBookings: 28,
        totalRevenue: 24500000,
        rating: 4.8,
        achievements: [
          { title: 'Top Performer', icon: Award, color: '#f59e0b' },
          { title: '100+ Leads', icon: Star, color: '#3b82f6' },
          { title: '25+ Bookings', icon: TrendingUp, color: '#10b981' },
        ],
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="My Profile"
        showBack
        onBack={() => router.back()}
        rightActions={
          <TouchableOpacity onPress={() => {}}>
            <Edit3 size={24} color={colors.primary[600]} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary[600]]} />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar
              size="xl"
              name={profile?.name || 'AM'}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.name || 'Arjun Mehta'}</Text>
          <Text style={styles.role}>{profile?.role || 'Senior Channel Partner'}</Text>
          <Badge variant="primary">{profile?.channelPartnerName || 'Skyline Properties'}</Badge>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.totalLeads || 156}</Text>
            <Text style={styles.statLabel}>Leads</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: '#f3f4f6' }]} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.totalBookings || 28}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: '#f3f4f6' }]} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.rating || 4.8}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Achievements */}
        {profile?.achievements && profile.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsRow}>
              {profile.achievements.map((achievement, index) => (
                <View key={index} style={[styles.achievementBadge, { backgroundColor: `${achievement.color}20` }]}>
                  <achievement.icon size={20} color={achievement.color} />
                  <Text style={[styles.achievementText, { color: achievement.color }]}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Card style={styles.detailsCard}>
            <DetailRow icon={Mail} label="Email" value={profile?.email || 'arjun@skylineproperties.com'} />
            <DetailRow icon={Phone} label="Phone" value={profile?.phone || '+91 98765 43210'} />
            <DetailRow icon={Building2} label="Channel Partner" value={profile?.channelPartnerName || 'Skyline Properties'} />
            <DetailRow icon={MapPin} label="City" value={profile?.city || 'Hyderabad'} />
            <DetailRow icon={Calendar} label="Joined" value={profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '15 March 2022'} />
          </Card>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            <MenuItem icon={Bell} label="Notification Settings" onPress={() => router.push('/(pro)/notifications')} />
            <MenuItem icon={CreditCard} label="Payment Settings" onPress={() => {}} />
            <MenuItem icon={Shield} label="Privacy & Security" onPress={() => {}} />
          </Card>
        </View>

        {/* Logout */}
        <Button variant="outline" style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Icon size={20} color={colors.text.tertiary} />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({ icon: Icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon size={20} color={colors.text.tertiary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  profileHeader: { alignItems: 'center' as const, paddingVertical: Spacing.xl },
  avatarContainer: { position: 'relative' as const, marginBottom: Spacing.md },
  avatar: { backgroundColor: '#facc15' },
  cameraButton: { position: 'absolute' as const, bottom: 0, right: 0, backgroundColor: '#facc15', width: 28, height: 28, borderRadius: 14, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a', marginBottom: 4 },
  role: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#6b7280', marginBottom: Spacing.sm },
  statsRow: { flexDirection: 'row' as const, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', padding: Spacing.md },
  statItem: { flex: 1, alignItems: 'center' as const },
  statValue: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  statLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280', marginTop: 4 },
  statDivider: { width: 1, marginVertical: Spacing.sm },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  achievementsRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: Spacing.sm },
  achievementBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  achievementText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold },
  detailsCard: { padding: Spacing.md, gap: Spacing.md },
  detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.md },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: '#9ca3af' },
  detailValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a', marginTop: 2 },
  menuCard: { padding: 0 },
  menuItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.md, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuLabel: { flex: 1, fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  logoutButton: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: Spacing.sm, marginTop: Spacing.md, borderColor: '#fecaca' },
  logoutText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#dc2626' },
});