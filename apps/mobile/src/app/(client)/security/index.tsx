import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Lock, Key, Shield, Eye, EyeOff, ChevronRight, AlertTriangle, CheckCircle, Mail, Phone, Fingerprint, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

export default function SecurityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    if (!passwordForm.confirmPassword) errors.confirmPassword = 'Please confirm new password';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setIsChangingPassword(true);
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = () => {
    // Generate mock backup codes
    const codes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
    setBackupCodes(codes);
    setShow2FASetup(true);
  };

  const handleConfirm2FA = () => {
    if (totpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code from your authenticator app');
      return;
    }
    setTwoFAEnabled(true);
    setShow2FASetup(false);
    Alert.alert('Success', 'Two-factor authentication enabled. Save your backup codes in a safe place.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Security & Privacy"
        leftAction={{ onPress: () => router.back() }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Security Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <Shield size={28} color={twoFAEnabled ? colors.success.DEFAULT : colors.warning.DEFAULT} />
            </View>
            <View>
              <Text style={styles.statusTitle}>Account Security</Text>
              <Text style={styles.statusSubtitle}>
                {twoFAEnabled ? 'Your account is well protected' : 'Enable 2FA for better security'}
              </Text>
            </View>
            <Badge variant={twoFAEnabled ? 'success' : 'warning'}>
              {twoFAEnabled ? 'Protected' : 'Basic'}
            </Badge>
          </View>
          {!twoFAEnabled && (
            <Button variant="outline" onPress={handleEnable2FA} style={styles.enable2FAButton} fullWidth>
              <Key size={18} />
              <Text>Enable Two-Factor Authentication</Text>
            </Button>
          )}
        </Card>

        {/* Change Password */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Password</Text>
          </View>
          <View style={styles.passwordInfo}>
            <Text style={styles.passwordInfoText}>Last changed: {user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleDateString() : 'Never'}</Text>
            <Text style={styles.passwordInfoText}>We recommend changing your password every 90 days</Text>
          </View>
          <Button variant="outline" onPress={() => router.push('/(client)/security/change-password')} style={styles.changePasswordButton} fullWidth>
            <Lock size={18} />
            <Text>Change Password</Text>
          </Button>
        </Card>

        {/* Two-Factor Authentication */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
          </View>
          {twoFAEnabled ? (
            <View style={styles.twoFAEnabled}>
              <View style={styles.twoFAStatus}>
                <View style={styles.twoFAStatusIcon}>
                  <CheckCircle size={24} color={colors.success.DEFAULT} />
                </View>
                <View>
                  <Text style={styles.twoFAStatusTitle}>Authenticator App Enabled</Text>
                  <Text style={styles.twoFAStatusSubtitle}>Last used: Today, 10:30 AM</Text>
                </View>
              </View>
              <View style={styles.twoFAActions}>
                <Button variant="outline" onPress={() => {}} style={styles.twoFAButton} fullWidth>
                  <Smartphone size={18} />
                  <Text>View Backup Codes</Text>
                </Button>
                <Button variant="danger" onPress={() => { setTwoFAEnabled(false); Alert.alert('2FA Disabled', 'Two-factor authentication has been disabled'); }} style={styles.twoFAButton} fullWidth>
                  <Lock size={18} />
                  <Text>Disable 2FA</Text>
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.twoFADisabled}>
              <Text style={styles.twoFAInfo}>Add an extra layer of security by enabling 2FA. You\'ll need to enter a code from your authenticator app when signing in.</Text>
              <Button onPress={handleEnable2FA} style={styles.enable2FAButton} fullWidth>
                <Key size={18} />
                <Text>Enable 2FA</Text>
              </Button>
            </View>
          )}
        </Card>

        {/* Login Security */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Login Security</Text>
          </View>
          <SecurityItem
            icon={Smartphone}
            title="Device Management"
            subtitle="View and manage logged-in devices"
            onPress={() => router.push('/(client)/security/devices')}
          />
          <SecurityItem
            icon={Fingerprint}
            title="Biometric Login"
            subtitle="Use fingerprint or Face ID to sign in"
            rightComponent={
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor="#fff"
              />
            }
          />
          <SecurityItem
            icon={Mail}
            title="Login Alerts"
            subtitle="Get notified of new sign-ins"
            rightComponent={
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#e5e7eb', true: colors.primary[600] }}
                thumbColor="#fff"
              />
            }
          />
        </Card>

        {/* Privacy */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Privacy</Text>
          </View>
          <SecurityItem
            icon={Shield}
            title="Data & Privacy"
            subtitle="Manage your data and privacy settings"
            onPress={() => router.push('/(client)/security/privacy')}
          />
          <SecurityItem
            icon={AlertTriangle}
            title="Data Deletion Request"
            subtitle="Request deletion of your personal data"
            titleColor={colors.error.DEFAULT}
            onPress={() => Alert.alert('Data Deletion', 'This will initiate a request to delete your account data. Process takes up to 30 days.')}
          />
        </Card>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Up 2FA</Text>
                <TouchableOpacity onPress={() => { setShow2FASetup(false); setTotpCode(''); }}>
                  <ChevronRight size={24} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.step}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}>Download an authenticator app (Google Authenticator, Authy, or Microsoft Authenticator)</Text>
                </View>
                <View style={styles.step}>
                  <Text style={styles.stepNumber}>2</Text>
                  <Text style={styles.stepText}>Scan the QR code or enter the setup key manually</Text>
                </View>
                <View style={styles.qrContainer}>
                  <View style={styles.qrCode}>
                    <Text style={styles.qrPlaceholder}>QR Code Here</Text>
                  </View>
                  <View style={styles.setupKey}>
                    <Text style={styles.setupKeyLabel}>Setup Key:</Text>
                    <Text style={styles.setupKeyValue}>TRUZON 2FA ABCD EFGH IJKL MNOP</Text>
                    <TouchableOpacity style={styles.copyButton} onPress={() => Alert.alert('Copied', 'Setup key copied to clipboard')}>
                      <Text style={styles.copyButtonText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.step}>
                  <Text style={styles.stepNumber}>3</Text>
                  <Text style={styles.stepText}>Enter the 6-digit code from your authenticator app</Text>
                </View>
                <Input
                  label="6-Digit Code"
                  value={totpCode}
                  onChangeText={setTotpCode}
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  containerStyle={styles.totpInput}
                  inputStyle={styles.totpInputText}
                />
                <View style={styles.backupCodesContainer}>
                  <Text style={styles.backupCodesTitle}>Backup Codes (Save these!)</Text>
                  <Text style={styles.backupCodesSubtitle}>Each code can be used once if you lose access to your authenticator app</Text>
                  <View style={styles.backupCodesGrid}>
                    {backupCodes.map((code, i) => (
                      <View key={i} style={styles.backupCode}>
                        <Text style={styles.backupCodeText}>{code}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Button onPress={handleConfirm2FA} style={{ marginTop: Spacing.md }} fullWidth disabled={totpCode.length !== 6}>
                  Enable 2FA
                </Button>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SecurityItem({ icon: Icon, title, subtitle, rightComponent, onPress, titleColor }: { icon: any; title: string; subtitle?: string; rightComponent?: React.ReactNode; onPress?: () => void; titleColor?: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.securityItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[{ ...styles.securityIcon, backgroundColor: '#f3f4f6' }]}>
        <Icon size={22} color={titleColor || colors.text.secondary} />
      </View>
      <View style={styles.securityContent}>
        <Text style={[{ ...styles.securityTitle, color: titleColor || '#080d1a' }]}>{title}</Text>
        {subtitle && <Text style={styles.securitySubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (onPress && <ChevronRight size={20} color={colors.text.tertiary} />)}
    </TouchableOpacity>
  );
}

function Switch({ value, onValueChange, trackColor, thumbColor }: { value: boolean; onValueChange: (value: boolean) => void; trackColor: { false: string; true: string }; thumbColor: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.switchContainer}>
      <View style={[
        styles.switchTrack,
        { backgroundColor: value ? trackColor.true : trackColor.false },
      ]}>
        <View style={[
          styles.switchThumb,
          { backgroundColor: thumbColor, transform: [{ translateX: value ? 20 : 0 }] },
        ]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  statusCard: { padding: Spacing.md },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  statusIcon: { width: 56, height: 56, borderRadius: BorderRadius.xl, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  statusTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  statusSubtitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: 2 },
  enable2FAButton: { marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  section: { marginBottom: Spacing.md },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  passwordInfo: { gap: Spacing.xs, marginBottom: Spacing.md },
  passwordInfoText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  changePasswordButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  twoFAEnabled: { gap: Spacing.md },
  twoFAStatus: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#f0fdf4', borderRadius: BorderRadius.lg },
  twoFAStatusIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  twoFAStatusTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  twoFAStatusSubtitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginTop: 2 },
  twoFAActions: { gap: Spacing.md },
  twoFAButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  twoFADisabled: { gap: Spacing.md },
  twoFAInfo: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, lineHeight: 24 },
  securityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  securityIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  securityContent: { flex: 1 },
  securityTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium },
  securitySubtitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginTop: 2 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, maxHeight: '85%', width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  modalContent: { padding: Spacing.md, gap: Spacing.lg },
  step: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: 2, flex: 1 },
  qrContainer: { alignItems: 'center', gap: Spacing.lg, marginVertical: Spacing.md },
  qrCode: { width: 200, height: 200, borderRadius: BorderRadius.lg, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  qrPlaceholder: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  setupKey: { alignItems: 'center', gap: Spacing.sm },
  setupKeyLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  setupKeyValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.mono, color: '#080d1a', letterSpacing: 2 },
  copyButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: colors.primary[600], borderRadius: BorderRadius.md },
  copyButtonText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#fff' },
  totpInput: {},
  totpInputText: { letterSpacing: 8, fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, textAlign: 'center' as const },
  backupCodesContainer: { marginTop: Spacing.lg, padding: Spacing.md, backgroundColor: '#fef3c7', borderRadius: BorderRadius.lg },
  backupCodesTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#92400e', marginBottom: Spacing.xs },
  backupCodesSubtitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#b45309', marginBottom: Spacing.md },
  backupCodesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  backupCode: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: '#fff', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: '#fde68a' },
  backupCodeText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.mono, color: '#080d1a', letterSpacing: 1 },
  switchContainer: { padding: 2 },
  switchTrack: { width: 52, height: 28, borderRadius: 14, justifyContent: 'center' },
  switchThumb: { width: 24, height: 24, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
});