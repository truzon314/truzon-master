import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { LayoutDashboard, Users, MapPin, DollarSign, FileText, TrendingUp, Target, Activity, Bell, ArrowRight, Plus } from 'lucide-react-native';

const stats = [
  { label: 'Total Leads', value: '247', change: '+12%', trend: 'up', icon: Users, color: '#3b82f6' },
  { label: 'New This Month', value: '34', change: '+8%', trend: 'up', icon: Target, color: '#22c55e' },
  { label: 'Site Visits', value: '18', change: '-2%', trend: 'down', icon: MapPin, color: '#f59e0b' },
  { label: 'Commissions', value: '₹12.4L', change: '+15%', trend: 'up', icon: DollarSign, color: '#8b5cf6' },
];

const quickActions = [
  { label: 'Add Lead', icon: Plus, color: '#3b82f6', route: '/(pro)/leads/new' },
  { label: 'Schedule Visit', icon: MapPin, color: '#22c55e', route: '/(pro)/site-visits/new' },
  { label: 'New Booking', icon: FileText, color: '#8b5cf6', route: '/(pro)/bookings/new' },
  { label: 'View Inventory', icon: LayoutDashboard, color: '#f59e0b', route: '/(pro)/inventory' },
];

export default function ProDashboardScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header
        title="Dashboard"
        subtitle="Welcome back to Truzon Pro"
        showProfile
        onProfilePress={() => router.push('/(pro)/profile')}
        onNotificationPress={() => router.push('/(pro)/notifications')}
        notificationCount={0}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push('/(pro)/leads')}
              style={[styles.statCard, { backgroundColor: colors.background.primary }]}
              activeOpacity={0.8}
            >
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statTrend}>
                  <Text style={[styles.statChange, { color: stat.trend === 'up' ? '#22c55e' : '#ef4444' }]}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change} vs last month
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(action.route)}
                style={[styles.actionCard, { backgroundColor: colors.background.primary }]}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text.primary }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(pro)/leads')} style={styles.seeAll}>
              <Text style={styles.seeAllText}>View All</Text>
              <ArrowRight size={16} />
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            <ActivityItem
              title="New lead assigned"
              description="Rahul Sharma interested in Villa project"
              time="2 min ago"
              type="lead"
            />
            <ActivityItem
              title="Site visit completed"
              description="Priya Patel visited Gardenia Villas"
              time="1 hour ago"
              type="visit"
            />
            <ActivityItem
              title="Booking confirmed"
              description="Amit Singh booked Plot #45 in Sunrise City"
              time="3 hours ago"
              type="booking"
            />
            <ActivityItem
              title="Commission approved"
              description="₹2.4L commission approved for Q3"
              time="5 hours ago"
              type="commission"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActivityItem({ title, description, time, type }: { title: string; description: string; time: string; type: string }) {
  const { colors } = useTheme();

  const typeColors = {
    lead: { bg: '#3b82f615', color: '#3b82f6', icon: Users },
    visit: { bg: '#22c55e15', color: '#22c55e', icon: MapPin },
    booking: { bg: '#8b5cf615', color: '#8b5cf6', icon: FileText },
    commission: { bg: '#f59e0b15', color: '#f59e0b', icon: DollarSign },
  };

  const { bg, color, icon: Icon } = typeColors[type as keyof typeof typeColors] || typeColors.lead;

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.activityDesc, { color: colors.text.tertiary }]}>{description}</Text>
      </View>
      <Text style={[styles.activityTime, { color: colors.text.tertiary }]}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24, gap: 12 },
  statCard: { flex: 1, minWidth: '48%', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statContent: { flex: 1 },
  statValue: { fontSize: 22, fontFamily: 'WorkSans_700Bold', color: '#080d1a' },
  statLabel: { fontSize: 12, fontFamily: 'WorkSans_400Regular', color: '#6b7280', marginTop: 2 },
  statTrend: { marginTop: 8 },
  statChange: { fontSize: 11, fontFamily: 'WorkSans_500Medium' },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: 'WorkSans_600SemiBold', color: '#080d1a' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontSize: 14, fontFamily: 'WorkSans_500Medium', color: '#facc15' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  actionCard: { flex: 1, minWidth: '48%', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  actionIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, fontFamily: 'WorkSans_600SemiBold', textAlign: 'center' },
  activityList: { gap: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  activityIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontFamily: 'WorkSans_600SemiBold' },
  activityDesc: { fontSize: 12, fontFamily: 'WorkSans_400Regular', marginTop: 2 },
  activityTime: { fontSize: 11, fontFamily: 'WorkSans_400Regular' },
});