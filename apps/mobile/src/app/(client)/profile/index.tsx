import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { User as UserIcon, Settings, Bell, Shield, HelpCircle, LogOut, Moon, CreditCard, FileText, MapPin, Heart, Calendar, DollarSign, ChevronRight, Edit2, QrCode, Star, Share2, Mail, Phone, Lock, Key } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';
import { Input } from '@/components/ui/Input';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout, updateProfile } = useAuthStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const menuItems = [
    { id: 'my-properties', icon: Heart, label: 'My Properties', badge: 3, route: '/(client)/saved' },
    { id: 'enquiries', icon: Mail, label: 'My Enquiries', badge: 2, route: '/(client)/enquiries' },
    { id: 'bookings', icon: Calendar, label: 'Site Visits & Bookings', badge: 1, route: '/(client)/bookings' },
    { id: 'payments', icon: DollarSign, label: 'Payments & Receipts', route: '/(client)/payments' },
    { id: 'documents', icon: FileText, label: 'Documents', route: '/(client)/documents' },
    { id: 'settings', icon: Settings, label: 'Settings', route: '/(client)/settings' },
    { id: 'notifications', icon: Bell, label: 'Notification Preferences', route: '/(client)/notifications' },
    { id: 'security', icon: Shield, label: 'Security & Privacy', route: '/(client)/security' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', route: '/(client)/support' },
  ];

  const handleEditProfile = () => {
    setEditForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setShowEditProfile(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Profile"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Settings, onPress: () => router.push('/(client)/settings') }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            source={user?.avatar ? { uri: user.avatar } : undefined}
            name={user?.name || 'User'}
            size="xl"
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.profileMeta}>
              <Badge variant="outline">
                {user?.role?.name === 'CUSTOMER' ? 'Home Buyer' : user?.role?.name === 'CHANNEL_PARTNER' ? 'Channel Partner' : user?.role?.name}
              </Badge>
              {user?.isVerified && (
                <Badge variant="success">
                  Verified
                </Badge>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit2 size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <StatItem icon={Heart} label="Saved" value="3" color="#ef4444" onPress={() => router.push('/(client)/saved')} />
          <StatItem icon={Mail} label="Enquiries" value="2" color="#3b82f6" onPress={() => router.push('/(client)/enquiries')} />
          <StatItem icon={Calendar} label="Visits" value="1" color="#8b5cf6" onPress={() => router.push('/(client)/bookings')} />
          <StatItem icon={DollarSign} label="Payments" value="₹50K" color="#10b981" onPress={() => router.push('/(client)/payments')} />
        </View>

        {/* Menu Sections */}
        <Card style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>My Activity</Text>
          {menuItems.slice(0, 5).map((item) => (
            <MenuItem key={item.id} item={item} onPress={() => router.push(item.route)} />
          ))}
        </Card>

        <Card style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          {menuItems.slice(5).map((item) => (
            <MenuItem key={item.id} item={item} onPress={() => router.push(item.route)} />
          ))}
        </Card>

        {/* Referral */}
        <Card style={styles.referralCard}>
          <View style={styles.referralContent}>
            <View>
              <Text style={styles.referralTitle}>Refer & Earn</Text>
              <Text style={styles.referralDescription}>Share Truzon with friends and earn rewards up to ₹25,000 per referral</Text>
            </View>
            <Button variant="outline" onPress={() => {}} style={styles.referralButton}>
              <Share2 size={18} />
              <Text>Share</Text>
            </Button>
          </View>
          <TouchableOpacity style={styles.referralCode} onPress={() => {}}>
            <Text style={styles.referralCodeLabel}>Your Code</Text>
            <View style={styles.referralCodeValue}>
              <Text style={styles.referralCodeText}>TRUZON{user?.id?.slice(-6).toUpperCase() || 'ABC123'}</Text>
              <Text style={styles.copyText}>Tap to copy</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutConfirm(true)}>
          <LogOut size={20} color={colors.error.DEFAULT} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Truzon Homes v1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
      >
        <View style={styles.sheetContent}>
          <Input
            label="Full Name"
            value={editForm.name}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            value={editForm.email}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={false}
            containerStyle={styles.disabledInput}
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
            placeholder="Enter your phone"
            keyboardType="phone-pad"
          />
          <Button
            onPress={handleSaveProfile}
            style={{ marginTop: Spacing.md }}
          >
            Save Changes
          </Button>
        </View>
      </BottomSheet>

      {/* Logout Confirmation */}
      <BottomSheet
        visible={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Logout"
      >
        <View style={styles.sheetContent}>
          <Text style={styles.confirmText}>Are you sure you want to logout?</Text>
          <View style={styles.confirmActions}>
            <Button variant="outline" onPress={() => setShowLogoutConfirm(false)} style={styles.confirmButton}>
              Cancel
            </Button>
            <Button onPress={handleLogout} style={styles.confirmButton} variant="danger">
              Logout
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

function StatItem({ icon: Icon, label, value, color, onPress }: { icon: any; label: string; value: string; color: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.statItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[{ ...styles.statIcon, backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MenuItem({ item, onPress }: { item: any; onPress: () => void }) {
  const { colors } = useTheme();
  const Icon = item.icon;
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[{ ...styles.menuIcon, backgroundColor: '#f3f4f6' }]}>
        <Icon size={22} color={colors.text.secondary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{item.label}</Text>
      </View>
      <View style={styles.menuRight}>
        {item.badge && (
          <Badge variant="default">{item.badge}</Badge>
        )}
        <ChevronRight size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6' },
  avatar: {},
  profileInfo: { flex: 1 },
  profileName: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  profileEmail: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: Spacing.xs },
  profileMeta: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  roleBadge: { fontSize: Typography.sizes.xs },
  verifiedBadge: { fontSize: Typography.sizes.xs },
  editButton: { padding: Spacing.sm },
  statsContainer: { flexDirection: 'row', gap: Spacing.md },
  statItem: { flex: 1, alignItems: 'center', padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6' },
  statIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  statValue: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  statLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  menuSection: { marginBottom: Spacing.md },
  menuSectionTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm, paddingHorizontal: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  menuIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  menuBadge: { fontSize: Typography.sizes.xs },
  referralCard: { padding: Spacing.md },
  referralContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  referralTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  referralDescription: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: Spacing.xs, maxWidth: 200 },
  referralButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  referralCode: { padding: Spacing.md, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg, alignItems: 'center' },
  referralCodeLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginBottom: Spacing.xs },
  referralCodeValue: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  referralCodeText: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a', letterSpacing: 2 },
  copyText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  logoutText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#ef4444' },
  versionText: { textAlign: 'center', fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginTop: Spacing.lg },
  sheetContent: { gap: Spacing.md },
  disabledInput: { opacity: 0.6 },
  confirmText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, textAlign: 'center', marginBottom: Spacing.lg },
  confirmActions: { flexDirection: 'row', gap: Spacing.md },
  confirmButton: { flex: 1 },
});