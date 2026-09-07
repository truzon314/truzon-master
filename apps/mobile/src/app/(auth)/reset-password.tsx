import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import React from 'react';

const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit OTP'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword({ phone: phone as string, otp: data.otp, newPassword: data.newPassword });
      Alert.alert('Success', 'Password reset successfully. Please sign in with your new password.');
      router.replace('/(auth)/login');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
          Enter the OTP sent to your phone and create a new password
        </Text>
      </View>

      <View style={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...control}
            name="otp"
            label="OTP"
            placeholder="••••••"
            keyboardType="number-pad"
            error={errors.otp?.message}
            maxLength={6}
            style={styles.otpInput}
            autoComplete="one-time-code"
            textAlign="center"
          />

          <Input
            {...control}
            name="newPassword"
            label="New Password"
            placeholder="Create new password"
            secureTextEntry={!showPassword}
            error={errors.newPassword?.message}
            leftIcon={<Lock size={20} color={colors.text.tertiary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.text.tertiary} />
                ) : (
                  <Eye size={20} color={colors.text.tertiary} />
                )}
              </TouchableOpacity>
            }
            autoComplete="new-password"
          />

          <Input
            {...control}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword?.message}
            leftIcon={<Lock size={20} color={colors.text.tertiary} />}
            autoComplete="new-password"
          />

          <Button
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          >
            Reset Password
            <ArrowRight size={18} />
          </Button>
        </form>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', fontFamily: 'PlayfairDisplay_700Bold' },
  subtitle: { fontSize: 16, marginTop: 8, fontFamily: 'WorkSans_400Regular', textAlign: 'center' },
  formContainer: { width: '100%' },
  otpInput: { fontSize: 24, letterSpacing: 24, marginBottom: 24 },
  submitButton: { marginTop: 8 },
});