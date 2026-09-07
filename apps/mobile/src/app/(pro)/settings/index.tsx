import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, Moon, Sun, Globe, Lock, Shield, HelpCircle, Info, ChevronRight, Trash2, Download, RefreshCw, UserX } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spacing, Typography, BorderRadius } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure you want to clear the app cache?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => {} },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. All your data will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Settings"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive push notifications for leads and bookings</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#facc15' }}
                thumbColor={notificationsEnabled ? '#080d1a' : '#f9fafb'}
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive email alerts for important updates</Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#d1d5db', true: '#facc15' }}
                thumbColor={emailNotifications ? '#080d1a' : '#f9fafb'}
              />
            </View>
          </Card>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                {darkMode ? <Moon size={20} color={colors.text.tertiary} /> : <Sun size={20} color={colors.text.tertiary} />}
                <View>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Switch between light and dark themes</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d1d5db', true: '#facc15' }}
                thumbColor={darkMode ? '#080d1a' : '#f9fafb'}
              />
            </View>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Globe size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Language</Text>
                  <Text style={styles.settingDescription}>English</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <Card style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Lock size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your account password</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Shield size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>Add an extra layer of security</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <Card style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Download size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Download Data</Text>
                  <Text style={styles.settingDescription}>Export your leads and bookings</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
              <View style={styles.settingInfo}>
                <RefreshCw size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Clear Cache</Text>
                  <Text style={styles.settingDescription}>Free up storage space</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Card style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <HelpCircle size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>Help Center</Text>
                  <Text style={styles.settingDescription}>Get help with using the app</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Info size={20} color={colors.text.tertiary} />
                <View>
                  <Text style={styles.settingLabel}>About</Text>
                  <Text style={styles.settingDescription}>Version 1.0.0</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Card style={[styles.card, styles.dangerCard]}>
            <TouchableOpacity style={styles.settingRow} onPress={handleDeleteAccount}>
              <View style={styles.settingInfo}>
                <Trash2 size={20} color="#dc2626" />
                <View>
                  <Text style={[styles.settingLabel, { color: '#dc2626' }]}>Delete Account</Text>
                  <Text style={styles.settingDescription}>Permanently delete your account and data</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#dc2626" />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  card: { padding: 0 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  settingLabel: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  settingDescription: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#9ca3af', marginTop: 2 },
  settingDivider: { height: 1, backgroundColor: '#f3f4f6', marginLeft: Spacing.md + 20 + Spacing.md },
  dangerCard: { borderColor: '#fecaca' },
});