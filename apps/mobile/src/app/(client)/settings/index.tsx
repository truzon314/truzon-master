import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { Settings, Bell, Shield, Moon, Globe, HelpCircle, Info, LogOut, Mail, Phone, Star, Share2, Palette, Key, ChevronRight, User as UserIcon, Lock, Wifi, Download, Trash2, AlertTriangle, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout, updateProfile } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { Alert.alert('Account Deleted', 'Your account has been scheduled for deletion'); logout(); router.replace('/(auth)/login'); } },
      ]
    );
    setShowDeleteAccount(false);
  };

  const openUrl = (url: string) => Linking.openURL(url);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Settings"
        leftAction={{ onPress: () => {} }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.accountInfo}>
            <Avatar
              source={user?.avatar ? { uri: user.avatar } : undefined}
              name={user?.name || 'User'}
              size="lg"
              style={styles.accountAvatar}
            />
            <View style={styles.accountDetails}>
              <Text style={styles.accountName}>{user?.name || 'User'}</Text>
              <Text style={styles.accountEmail}>{user?.email || 'user@example.com'}</Text>
              <Text style={styles.accountRole}>{user?.role?.name === 'CUSTOMER' ? 'Home Buyer' : 'Channel Partner'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(client)/profile')}>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Preferences */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>
          <SettingItem
            icon={Palette}
            title="Theme"
            subtitle={darkMode ? 'Dark' : 'Light'}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={darkMode ? colors.primary[600] : '#fff'}
              />
            }
          />
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => {}}
          />
          <SettingItem
            icon={Download}
            title="Auto-download on WiFi"
            subtitle="Download images and documents automatically"
            rightComponent={
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={autoDownload ? colors.primary[600] : '#fff'}
              />
            }
          />
          <SettingItem
            icon={Wifi}
            title="Data Saver"
            subtitle="Reduce data usage for images and media"
            rightComponent={
              <Switch
                value={dataSaver}
                onValueChange={setDataSaver}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={dataSaver ? colors.primary[600] : '#fff'}
              />
            }
          />
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive push notifications for updates"
            rightComponent={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={pushNotifications ? colors.primary[600] : '#fff'}
              />
            }
          />
          <SettingItem
            icon={Mail}
            title="Email Notifications"
            subtitle="Receive email updates for enquiries and bookings"
            rightComponent={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={emailNotifications ? colors.primary[600] : '#fff'}
              />
            }
          />
          <SettingItem
            icon={Phone}
            title="SMS Notifications"
            subtitle="Receive SMS for important updates"
            rightComponent={
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor={smsNotifications ? colors.primary[600] : '#fff'}
              />
            }
          />
        </Card>

        {/* Security */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
          </View>
          <SettingItem
            icon={Lock}
            title="Change Password"
            subtitle="Update your account password"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => router.push('/(client)/security/change-password')}
          />
          <SettingItem
            icon={Key}
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => router.push('/(client)/security/2fa')}
          />
          <SettingItem
            icon={Shield}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('https://truzon.com/privacy')}
          />
          <SettingItem
            icon={FileText}
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('https://truzon.com/terms')}
          />
        </Card>

        {/* Support */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          <SettingItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="FAQs and guides"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => router.push('/(client)/support')}
          />
          <SettingItem
            icon={Mail}
            title="Contact Support"
            subtitle="Email us at support@truzon.com"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('mailto:support@truzon.com')}
          />
          <SettingItem
            icon={Phone}
            title="Call Support"
            subtitle="Call us at 1800-123-4567"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('tel:18001234567')}
          />
          <SettingItem
            icon={Star}
            title="Rate App"
            subtitle="Share your feedback on the app store"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('https://play.google.com/store/apps/details?id=com.truzon.homes')}
          />
          <SettingItem
            icon={Share2}
            title="Share App"
            subtitle="Recommend Truzon to friends"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => {}}
          />
        </Card>

        {/* About */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <SettingItem
            icon={Info}
            title="App Version"
            subtitle="1.0.0 (Build 1)"
            rightComponent={<Text style={styles.versionText}>Latest</Text>}
          />
          <SettingItem
            icon={Globe}
            title="Website"
            subtitle="Visit truzon.com"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => openUrl('https://truzon.com')}
          />
          <SettingItem
            icon={AlertTriangle}
            title="Legal Notices"
            subtitle="Open source licenses and legal info"
            rightComponent={<ChevronRight size={20} color={colors.text.tertiary} />}
            onPress={() => {}}
          />
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
          </View>
          <SettingItem
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of your account"
            titleColor={colors.error.DEFAULT}
            rightComponent={<ChevronRight size={20} color={colors.error.DEFAULT} />}
            onPress={() => setShowLogoutConfirm(true)}
          />
          <SettingItem
            icon={Trash2}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            titleColor={colors.error.DEFAULT}
            rightComponent={<ChevronRight size={20} color={colors.error.DEFAULT} />}
            onPress={() => setShowDeleteAccount(true)}
          />
        </Card>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <Button variant="outline" onPress={() => setShowLogoutConfirm(false)} style={styles.modalButton}>
                Cancel
              </Button>
              <Button variant="danger" onPress={handleLogout} style={styles.modalButton}>
                Logout
              </Button>
            </View>
          </View>
        </View>
        )}

        {/* Delete Account Confirmation */}
        {showDeleteAccount && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <AlertTriangle size={32} color={colors.error.DEFAULT} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>This action is irreversible. All your data, enquiries, bookings, and documents will be permanently deleted.</Text>
            <View style={styles.modalActions}>
              <Button variant="outline" onPress={() => setShowDeleteAccount(false)} style={styles.modalButton}>
                Cancel
              </Button>
              <Button variant="danger" onPress={handleDeleteAccount} style={styles.modalButton}>
                Delete Account
              </Button>
            </View>
          </View>
        </View>
        )}
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon: Icon, title, subtitle, rightComponent, onPress, titleColor }: { icon: any; title: string; subtitle?: string; rightComponent: React.ReactNode; onPress?: () => void; titleColor?: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[{ ...styles.settingIcon, backgroundColor: '#f3f4f6' }]}>
        <Icon size={22} color={titleColor || colors.text.secondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[{ ...styles.settingTitle, color: titleColor || '#080d1a' }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  section: { marginBottom: Spacing.md },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  accountInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  accountAvatar: {},
  accountDetails: { flex: 1 },
  accountName: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  accountEmail: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: Spacing.xs },
  accountRole: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: colors.primary[600], marginTop: Spacing.xs },
  editButton: { padding: Spacing.sm },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  settingIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium },
  settingSubtitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginTop: 2 },
  dangerSection: { borderWidth: 1, borderColor: '#fecaca' },
  dangerTitle: { color: colors.error.DEFAULT },
  versionText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: colors.success.DEFAULT },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.md, zIndex: 100 },
  modal: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, padding: Spacing.xl, width: '100%', maxWidth: 400, alignItems: 'center' },
  modalIcon: { marginBottom: Spacing.md },
  modalTitle: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a', marginBottom: Spacing.md, textAlign: 'center' },
  modalText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, textAlign: 'center', marginBottom: Spacing.lg },
  modalActions: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  modalButton: { flex: 1 },
});