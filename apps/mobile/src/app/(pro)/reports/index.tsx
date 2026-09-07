import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { BarChart2, TrendingUp, Users, DollarSign, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { Spacing, Typography, BorderRadius } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReportData {
  totalLeads: number;
  leadsTrend: number;
  totalBookings: number;
  bookingsTrend: number;
  totalRevenue: number;
  revenueTrend: number;
  conversionRate: number;
  conversionTrend: number;
  monthlyData: { month: string; leads: number; bookings: number; revenue: number }[];
  topProjects: { name: string; leads: number; bookings: number; revenue: number }[];
}

export default function ReportsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      setReportData({
        totalLeads: 156,
        leadsTrend: 12,
        totalBookings: 28,
        bookingsTrend: 8,
        totalRevenue: 24500000,
        revenueTrend: 15,
        conversionRate: 18.5,
        conversionTrend: 2.1,
        monthlyData: [
          { month: 'Jan', leads: 45, bookings: 8, revenue: 6500000 },
          { month: 'Feb', leads: 52, bookings: 10, revenue: 7800000 },
          { month: 'Mar', leads: 48, bookings: 9, revenue: 7200000 },
          { month: 'Apr', leads: 61, bookings: 12, revenue: 9500000 },
          { month: 'May', leads: 55, bookings: 11, revenue: 8800000 },
          { month: 'Jun', leads: 58, bookings: 13, revenue: 10200000 },
        ],
        topProjects: [
          { name: 'Skyline Towers', leads: 45, bookings: 8, revenue: 8500000 },
          { name: 'Green Valley', leads: 38, bookings: 6, revenue: 6200000 },
          { name: 'Royal Gardens', leads: 32, bookings: 5, revenue: 5800000 },
        ],
      });
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReportData();
  };

  const statItems = [
    { label: 'Total Leads', value: reportData?.totalLeads || 0, trend: reportData?.leadsTrend || 0, icon: Users, color: '#3b82f6' },
    { label: 'Total Bookings', value: reportData?.totalBookings || 0, trend: reportData?.bookingsTrend || 0, icon: Calendar, color: '#8b5cf6' },
    { label: 'Total Revenue', value: `₹${((reportData?.totalRevenue || 0) / 100000).toFixed(1)}L`, trend: reportData?.revenueTrend || 0, icon: DollarSign, color: '#10b981' },
    { label: 'Conversion Rate', value: `${reportData?.conversionRate || 0}%`, trend: reportData?.conversionTrend || 0, icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Reports"
        showBack
        onBack={() => router.back()}
        rightActions={<Download size={24} color={colors.text.tertiary} onPress={() => {}} />}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary[600]]} />}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodTab, selectedPeriod === period && styles.periodTabActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statItems.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={24} color={item.color} />
              </View>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              <View style={[styles.trendBadge, { backgroundColor: item.trend >= 0 ? '#dcfce7' : '#fef2f2' }]}>
                {item.trend >= 0 ? <ArrowUpRight size={14} color="#16a34a" /> : <ArrowDownRight size={14} color="#dc2626" />}
                <Text style={[styles.trendText, { color: item.trend >= 0 ? '#16a34a' : '#dc2626' }]}>
                  {item.trend >= 0 ? '+' : ''}{item.trend}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chart Placeholder */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Performance</Text>
          <View style={styles.chartPlaceholder}>
            <BarChart2 size={48} color={colors.text.tertiary} />
            <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
          </View>
        </Card>

        {/* Top Projects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Projects</Text>
        </View>

        <Card style={styles.projectsCard}>
          {reportData?.topProjects.map((project, index) => (
            <View key={index} style={[styles.projectRow, index < (reportData?.topProjects.length || 0) - 1 && styles.projectRowBorder]}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectLeads}>{project.leads} leads</Text>
              </View>
              <View style={styles.projectStats}>
                <Text style={styles.projectBookings}>{project.bookings} bookings</Text>
                <Text style={styles.projectRevenue}>₹{(project.revenue / 100000).toFixed(1)}L</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Export Button */}
        <Button variant="outline" style={styles.exportButton}>
          <Download size={18} color={colors.primary[600]} />
          <Text style={[styles.exportButtonText, { color: colors.primary[600] }]}>Export Report</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  periodSelector: { flexDirection: 'row' as const, backgroundColor: '#f3f4f6', borderRadius: BorderRadius.lg, padding: 4 },
  periodTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' as const },
  periodTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  periodText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  periodTextActive: { color: '#080d1a', fontWeight: '600' as const },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: Spacing.md },
  statCard: { width: '48%' as any, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', padding: Spacing.md },
  statIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: Spacing.sm },
  statLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280' },
  statValue: { fontSize: Typography.sizes.xl, fontFamily: Typography.fonts.bold, color: '#080d1a', marginTop: 4 },
  trendBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, marginTop: Spacing.sm, alignSelf: 'flex-start' as const },
  trendText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.semiBold },
  chartCard: { padding: Spacing.md },
  chartTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a', marginBottom: Spacing.md },
  chartPlaceholder: { height: 200, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg, justifyContent: 'center' as const, alignItems: 'center' as const, gap: Spacing.sm },
  chartPlaceholderText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#9ca3af' },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  projectsCard: { padding: 0 },
  projectRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, padding: Spacing.md },
  projectRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  projectInfo: { flex: 1 },
  projectName: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  projectLeads: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#6b7280', marginTop: 2 },
  projectStats: { alignItems: 'flex-end' as const },
  projectBookings: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#3b82f6' },
  projectRevenue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#059669', marginTop: 2 },
  exportButton: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: Spacing.sm, marginTop: Spacing.md },
  exportButtonText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold },
});