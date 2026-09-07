import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';
import { Phone, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import React from 'react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid 10-digit mobile number').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      router.replace('/(auth)/otp');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>Join Truzon Homes to discover your dream home</Text>
      </View>

      <View style={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...control}
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            leftIcon={<UserIcon size={20} color={colors.text.tertiary} />}
            autoComplete="name"
          />

          <Input
            {...control}
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            keyboardType="email-address"
            error={errors.email?.message}
            leftIcon={<Mail size={20} color={colors.text.tertiary} />}
            autoComplete="email"
          />

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
            name="password"
            label="Password"
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            error={errors.password?.message}
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
            label="Confirm Password"
            placeholder="Confirm your password"
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
            Create Account
            <ArrowRight size={18} />
          </Button>
        </form>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border.DEFAULT }]} />
          <Text style={[styles.dividerText, { color: colors.text.tertiary }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border.DEFAULT }]} />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
          <Text style={[styles.loginText, { color: colors.text.secondary }]}>
            Already have an account? <Text style={[styles.loginLink, { color: colors.primary[600] }]}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', fontFamily: 'PlayfairDisplay_700Bold' },
  subtitle: { fontSize: 16, marginTop: 8, fontFamily: 'WorkSans_400Regular' },
  formContainer: { width: '100%' },
  submitButton: { marginTop: 8, marginBottom: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: 16, fontSize: 14, fontFamily: 'WorkSans_400Regular' },
  loginButton: { alignItems: 'center', paddingVertical: 16 },
  loginText: { fontSize: 14, fontFamily: 'WorkSans_400Regular' },
  loginLink: { fontFamily: 'WorkSans_600SemiBold' },
});