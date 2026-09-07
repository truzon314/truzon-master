import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Users, DollarSign, TrendingUp, Calendar, Plus, Eye, Filter, Download, ArrowRight, CheckCircle, Clock, AlertTriangle, Home, Building2, Target, BarChart2, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { ActivityItem } from '@/components/layout/ActivityItem';
import { colors, Spacing, Typography, BorderRadius, Shadows } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProDashboardScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      setStats({
        totalLeads: 156,
        newLeadsThisWeek: 12,
        activeCustomers: 45,
        siteVisitsThisMonth: 28,
        bookingsThisMonth: 8,
        totalCommissions: 2450000,
        pendingCommissions: 680000,
        conversionRate: 18.5,
      });
      setRecentActivity([
        { id: '1', type: 'lead', title: 'New Lead: Rajesh Kumar', subtitle: 'Interested in 3 BHK Banjara Hills', time: '5 min ago', status: 'new' },
        { id: '2', type: 'visit', title: 'Site Visit Scheduled', subtitle: 'Priya Sharma - Skyline Towers, 2 PM', time: '15 min ago', status: 'scheduled' },
        { id: '3', type: 'booking', title: 'Booking Confirmed', subtitle: 'Amit Singh - Green Valley 2BHK', time: '1 hour ago', status: 'completed', amount: 50000 },
        { id: '4', type: 'commission', title: 'Commission Received', subtitle: '₹1,25,000 from Project Royal Gardens', time: '3 hours ago', status: 'paid' },
        { id: '5', type: 'lead', title: 'Lead Updated', subtitle: 'Vikram Patel moved to Negotiation', time: '4 hours ago', status: 'updated' },
        { id: '6', type: 'visit', title: 'Site Visit Completed', subtitle: 'Sneha Reddy - Project Skyline', time: '6 hours ago', status: 'completed' },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statItems = [
    { key: 'totalLeads', label: 'Total Leads', icon: Users, color: '#3b82f6', trend: '+12%', trendColor: '#10b981', route: '/(pro)/leads' },
    { key: 'activeCustomers', label: 'Active Customers', icon: Users, color: '#8b5cf6', trend: '+5%', trendColor: '#10b981', route: '/(pro)/customers' },
    { key: 'siteVisitsThisMonth', label: 'Site Visits', icon: Calendar, color: '#f59e0b', trend: '+8%', trendColor: '#10b981', route: '/(pro)/site-visits' },
    { key: 'bookingsThisMonth', label: 'Bookings', icon: CheckCircle, color: '#10b981', trend: '+2%', trendColor: '#10b981', route: '/(pro)/bookings' },
    { key: 'totalCommissions', label: 'Total Commissions', icon: DollarSign, color: '#facc15', trend: '+15%', trendColor: '#10b981', route: '/(pro)/commissions', prefix: '₹' },
    { key: 'pendingCommissions', label: 'Pending Commissions', icon: Clock, color: '#ef4444', trend: '-3%', trendColor: '#ef4444', route: '/(pro)/commissions', prefix: '₹' },
    { key: 'conversionRate', label: 'Conversion Rate', icon: TrendingUp, color: '#06b6d4', trend: '+2.1%', trendColor: '#10b981', suffix: '%' },
    { key: 'newLeadsThisWeek', label: 'New Leads (Week)', icon: Target, color: '#f97316', trend: '+3', trendColor: '#10b981', route: '/(pro)/leads' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Dashboard"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Filter, onPress: () => {} }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[600]]}
          />
        }
      >
        {/* Welcome Header */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeGreeting}>Good {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'Partner'}!</Text>
            <Text style={styles.welcomeSubtitle}>Here's your business overview</Text>
          </View>
          <View style={styles.welcomeAvatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'P'}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(pro)/leads/new')}>
            <Text style={styles.seeAllText}>Add Lead</Text>
            <Plus size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon={Plus}
            label="Add Lead"
            color="#3b82f6"
            onPress={() => router.push('/(pro)/leads/new')}
          />
          <QuickActionCard
            icon={Calendar}
            label="Schedule Visit"
            color="#f59e0b"
            onPress={() => router.push('/(pro)/site-visits/new')}
          />
          <QuickActionCard
            icon={Users}
            label="Add Customer"
            color="#8b5cf6"
            onPress={() => router.push('/(pro)/customers/new')}
          />
          <QuickActionCard
            icon={DollarSign}
            label="Log Commission"
            color="#10b981"
            onPress={() => router.push('/(pro)/commissions/new')}
          />
          <QuickActionCard
            icon={Home}
            label="Add Property"
            color="#06b6d4"
            onPress={() => router.push('/(pro)/inventory/new')}
          />
          <QuickActionCard
            icon={BarChart2}
            label="View Reports"
            color="#6b7280"
            onPress={() => router.push('/(pro)/reports')}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
        </View>

        <View style={styles.statsGrid}>
          {statItems.map((item) => (
            <TouchableOpacity key={item.key} style={styles.statCard} onPress={() => item.route && router.push(item.route)} activeOpacity={0.8}>
              <View style={[{ ...styles.statIcon, backgroundColor: `${item.color}20` }]}>
                <item.icon size={24} color={item.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>
                  {item.prefix || ''}{formatNumber(stats?.[item.key] || 0)}{item.suffix || ''}
                </Text>
              </View>
              {item.trend && (
                <View style={[{ ...styles.statTrend, backgroundColor: `${item.trendColor}20` }]}>
                  <Text style={[{ ...styles.statTrendText, color: item.trendColor }]}>{item.trend}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts Row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance</Text>
        </View>

        <View style={styles.chartsRow}>
          <ChartCard
            title="Leads Pipeline"
            data={[
              { label: 'New', value: 45, color: '#3b82f6' },
              { label: 'Contacted', value: 32, color: '#8b5cf6' },
              { label: 'Visit Scheduled', value: 28, color: '#f59e0b' },
              { label: 'Negotiation', value: 18, color: '#f97316' },
              { label: 'Booked', value: 12, color: '#10b981' },
            ]}
            type="bar"
            height={200}
          />
          <ChartCard
            title="Monthly Commissions"
            data={[
              { label: 'Jan', value: 180000 },
              { label: 'Feb', value: 220000 },
              { label: 'Mar', value: 195000 },
              { label: 'Apr', value: 265000 },
              { label: 'May', value: 245000 },
              { label: 'Jun', value: 280000 },
            ]}
            type="line"
            height={200}
            color="#facc15"
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(pro)/activity')}>
            <Text style={styles.seeAllText}>View All</Text>
            <ArrowRight size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <Card style={styles.activityCard}>
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </Card>

        {/* Upcoming Visits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Site Visits</Text>
          <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(pro)/site-visits')}>
            <Text style={styles.seeAllText}>View All</Text>
            <ArrowRight size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingVisits}>
          <UpcomingVisitCard
            customer="Priya Sharma"
            project="Skyline Towers"
            unit="3BHK - 1850 sq.ft"
            date="Tomorrow, 2:00 PM"
            status="Confirmed"
            onPress={() => {}}
          />
          <UpcomingVisitCard
            customer="Vikram Patel"
            project="Green Valley"
            unit="2BHK - 1200 sq.ft"
            date="Friday, 10:00 AM"
            status="Pending"
            onPress={() => {}}
          />
          <UpcomingVisitCard
            customer="Sneha Reddy"
            project="Royal Gardens"
            unit="4BHK Villa - 3200 sq.ft"
            date="Monday, 11:00 AM"
            status="Confirmed"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function QuickActionCard({ icon: Icon, label, color, onPress }: { icon: any; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={[{ ...styles.quickActionIcon, backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function UpcomingVisitCard({ customer, project, unit, date, status, onPress }: { customer: string; project: string; unit: string; date: string; status: string; onPress: () => void }) {
  const { colors } = useTheme();
  const statusConfig = {
    Confirmed: { color: '#10b981', bg: '#dcfce7' },
    Pending: { color: '#f59e0b', bg: '#fef3c7' },
    Cancelled: { color: '#ef4444', bg: '#fef2f2' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <TouchableOpacity style={styles.visitCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.visitLeft}>
        <View style={styles.visitAvatar}>
          <Text style={styles.visitAvatarText}>{customer.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.visitCustomer}>{customer}</Text>
          <Text style={styles.visitProject}>{project} • {unit}</Text>
        </View>
      </View>
      <View style={styles.visitRight}>
        <View style={[{ ...styles.visitStatus, backgroundColor: config.bg }]}>
          <Text style={[{ ...styles.visitStatusText, color: config.color }]}>{status}</Text>
        </View>
        <Text style={styles.visitDate}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
  return num.toString();
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  welcomeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, backgroundColor: '#080d1a', borderRadius: BorderRadius.xl },
  welcomeContent: { flex: 1 },
  welcomeGreeting: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#fff' },
  welcomeSubtitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs },
  welcomeAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  seeAllText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: colors.primary[600] },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  quickAction: { width: '48%', alignItems: 'center', padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6' },
  quickActionIcon: { width: 56, height: 56, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  quickActionLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#080d1a', textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6' },
  statIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  statContent: { flex: 1, minWidth: 0 },
  statLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  statValue: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a', marginTop: 2 },
  statTrend: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  statTrendText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.semiBold },
  chartsRow: { flexDirection: 'row', gap: Spacing.md },
  activityCard: { padding: 0 },
  visitCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  visitLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  visitAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center' },
  visitAvatarText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  visitCustomer: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  visitProject: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: 2 },
  visitRight: { alignItems: 'flex-end', gap: Spacing.xs },
  visitStatus: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  visitStatusText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.semiBold },
  visitDate: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  upcomingVisits: { gap: Spacing.sm },
});