import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Lock, Eye, EyeOff, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!form.newPassword) newErrors.newPassword = 'New password is required';
    else if (form.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword)) {
      newErrors.newPassword = 'Must contain uppercase, lowercase, and number';
    }
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm new password';
    else if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Password changed successfully. Please login again.');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: form.newPassword.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(form.newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(form.newPassword) },
    { text: 'One number', met: /\d/.test(form.newPassword) },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      keyboardVerticalOffset={90}
    >
      <Header
        title="Change Password"
        leftAction={{ onPress: () => router.back() }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Security Tips</Text>
          <View style={styles.requirements}>
            {passwordRequirements.map((req, i) => (
              <RequirementItem key={i} text={req.text} met={req.met} />
            ))}
          </View>
        </View>

        <Input
          label="Current Password *"
          value={form.currentPassword}
          onChangeText={text => setForm(prev => ({ ...prev, currentPassword: text }))}
          placeholder="Enter current password"
          secureTextEntry={!showCurrent}
          rightIcon={
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={20} color={colors.text.tertiary} /> : <Eye size={20} color={colors.text.tertiary} />}
            </TouchableOpacity>
          }
          error={errors.currentPassword}
        />

        <Input
          label="New Password *"
          value={form.newPassword}
          onChangeText={text => setForm(prev => ({ ...prev, newPassword: text }))}
          placeholder="Enter new password"
          secureTextEntry={!showNew}
          rightIcon={
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={20} color={colors.text.tertiary} /> : <Eye size={20} color={colors.text.tertiary} />}
            </TouchableOpacity>
          }
          error={errors.newPassword}
        />

        <Input
          label="Confirm New Password *"
          value={form.confirmPassword}
          onChangeText={text => setForm(prev => ({ ...prev, confirmPassword: text }))}
          placeholder="Confirm new password"
          secureTextEntry={!showConfirm}
          rightIcon={
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={20} color={colors.text.tertiary} /> : <Eye size={20} color={colors.text.tertiary} />}
            </TouchableOpacity>
          }
          error={errors.confirmPassword}
        />

        <View style={styles.requirements}>
          {passwordRequirements.map((req, i) => (
            <RequirementItem key={i} text={req.text} met={req.met} />
          ))}
        </View>

        <Button
          onPress={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
          style={{ marginTop: Spacing.md }}
          fullWidth
        >
          Update Password
        </Button>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.forgotPasswordText}>Forgot current password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RequirementItem({ text, met }: { text: string; met: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[{ ...styles.requirement, ...(met ? styles.requirementMet : {}) }]}>
      <CheckCircle size={16} color={met ? colors.success.DEFAULT : colors.text.tertiary} />
      <Text style={[{ ...styles.requirementText, ...(met ? styles.requirementTextMet : {}) }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  infoCard: { padding: Spacing.md, backgroundColor: '#fef3c7', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: '#fde68a' },
  infoTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#92400e', marginBottom: Spacing.md },
  requirements: { gap: Spacing.sm },
  requirement: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: Spacing.sm },
  requirementMet: { opacity: 0.7 },
  requirementText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  requirementTextMet: { color: colors.success.DEFAULT },
  forgotPassword: { alignItems: 'center' as const, marginTop: Spacing.lg },
  forgotPasswordText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: colors.primary[600] },
});