import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';
import { Phone, Lock, ArrowRight, RefreshCw } from 'lucide-react-native';
import React from 'react';

const otpSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit OTP'),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { colors } = useTheme();
  const { verifyOTP, resendOTP, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });
  const [resendCooldown, setResendCooldown] = React.useState(0);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!phone) return;
    try {
      await resendOTP(phone as string);
      setResendCooldown(60);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to resend OTP';
      Alert.alert('Error', message);
    }
  };

  const onSubmit = async (data: OTPForm) => {
    try {
      await verifyOTP({ phone: phone as string, otp: data.otp });
      const roleType = useAuthStore.getState().roleType;
      if (roleType === 'channel_partner') {
        router.replace('/(pro)');
      } else {
        router.replace('/(client)');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Verify OTP</Text>
        <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
          We've sent a 6-digit code to <Text style={{ color: colors.primary[600], fontFamily: 'WorkSans_600SemiBold' }}>{phone}</Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <View style={styles.otpContainer}>
            <Input
              {...control}
              name="otp"
              label=""
              placeholder="••••••"
              keyboardType="number-pad"
              error={errors.otp?.message}
              maxLength={6}
              style={styles.otpInput}
              autoComplete="one-time-code"
              textAlign="center"
            />
          </View>

          <View style={styles.resendContainer}>
            {resendCooldown > 0 ? (
              <Text style={[styles.resendTimer, { color: colors.text.tertiary }]}>
                Resend in {resendCooldown}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
                <RefreshCw size={16} color={colors.primary[600]} />
                <Text style={[styles.resendText, { color: colors.primary[600] }]}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          >
            Verify & Continue
            <ArrowRight size={18} />
          </Button>
        </form>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.text.tertiary }]}>Change phone number</Text>
        </TouchableOpacity>
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
  otpContainer: { marginBottom: 24 },
  otpInput: { fontSize: 24, letterSpacing: 24 },
  resendContainer: { alignItems: 'center', marginBottom: 24 },
  resendTimer: { fontSize: 14, fontFamily: 'WorkSans_400Regular' },
  resendButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendText: { fontSize: 14, fontFamily: 'WorkSans_600SemiBold' },
  submitButton: { marginTop: 8, marginBottom: 24 },
  backButton: { alignItems: 'center', paddingVertical: 16 },
  backText: { fontSize: 14, fontFamily: 'WorkSans_400Regular' },
});