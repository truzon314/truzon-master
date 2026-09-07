import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';
import { Phone, Mail, ArrowRight } from 'lucide-react-native';
import React from 'react';

const forgotPasswordSchema = z.object({
  phone: z.string().min(10, 'Enter a valid 10-digit mobile number').max(15),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { forgotPassword, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '', email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword(data.phone);
      router.push(`/auth/reset-password?phone=${encodeURIComponent(data.phone)}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reset OTP. Please try again.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
          Enter your mobile number to receive a reset OTP
        </Text>
      </View>

      <View style={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...control}
            name="phone"
            label="Mobile Number"
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            error={errors.phone?.message}
            leftIcon={<Phone size={20} color={colors.text.tertiary} />}
            autoComplete="tel"
          />

          <Input
            {...control}
            name="email"
            label="Email (Optional)"
            placeholder="john@example.com"
            keyboardType="email-address"
            error={errors.email?.message}
            leftIcon={<Mail size={20} color={colors.text.tertiary} />}
            autoComplete="email"
          />

          <Button
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          >
            Send Reset OTP
            <ArrowRight size={18} />
          </Button>
        </form>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.text.tertiary }]}>Back to Sign In</Text>
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
  submitButton: { marginTop: 8, marginBottom: 24 },
  backButton: { alignItems: 'center', paddingVertical: 16 },
  backText: { fontSize: 14, fontFamily: 'WorkSans_400Regular' },
});