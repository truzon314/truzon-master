import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Redirect based on auth state
  // This will be handled by layout routes in practice

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truzon Mobile</Text>
      <Text style={styles.subtitle}>
        {isAuthenticated ? `Welcome, ${user?.fullName}` : 'Please sign in'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#102a43',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#486581',
  },
});