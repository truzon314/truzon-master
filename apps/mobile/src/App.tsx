import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const { checkAuth, isLoading } = useAuthStore();
  const [showSpinner, setShowSpinner] = useState(isLoading);

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => setShowSpinner(false), 1500);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) setShowSpinner(false);
  }, [isLoading]);

  if (showSpinner && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c2941f" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f0f4f8' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Truzon' }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
        <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
        <Stack.Screen name="(client)/_layout" options={{ title: 'Client' }} />
        <Stack.Screen name="(pro)/_layout" options={{ title: 'Pro/CP' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
});