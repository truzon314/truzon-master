import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { DollarSign, ChevronRight, Filter, FileText, CheckCircle, X, Clock, AlertTriangle, Download, CreditCard, Banknote, Receipt, Eye, CreditCard as CreditCardIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL';
type PaymentType = 'BOOKING_AMOUNT' | 'AGREEMENT' | 'CONSTRUCTION_LINKED' | 'FINAL_PAYMENT' | 'MAINTENANCE' | 'STAMP_DUTY' | 'REGISTRATION' | 'OTHER';

interface Payment {
  id: string;
  type: PaymentType;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  dueDate?: string;
  paidAt?: string;
  transactionId?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  installmentNumber?: number;
  totalInstallments?: number;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: '#f59e0b', icon: Clock },
  PROCESSING: { label: 'Processing', color: '#3b82f6', icon: Clock },
  COMPLETED: { label: 'Completed', color: '#10b981', icon: CheckCircle },
  FAILED: { label: 'Failed', color: '#ef4444', icon: X },
  REFUNDED: { label: 'Refunded', color: '#8b5cf6', icon: AlertTriangle },
  PARTIAL: { label: 'Partial', color: '#f97316', icon: AlertTriangle },
};

const typeConfig: Record<PaymentType, { label: string; icon: any; color: string }> = {
  BOOKING_AMOUNT: { label: 'Booking Amount', icon: Banknote, color: '#3b82f6' },
  AGREEMENT: { label: 'Agreement Payment', icon: FileText, color: '#8b5cf6' },
  CONSTRUCTION_LINKED: { label: 'Construction Linked', icon: DollarSign, color: '#f59e0b' },
  FINAL_PAYMENT: { label: 'Final Payment', icon: CreditCard, color: '#10b981' },
  MAINTENANCE: { label: 'Maintenance', icon: Receipt, color: '#06b6d4' },
  STAMP_DUTY: { label: 'Stamp Duty', icon: FileText, color: '#ef4444' },
  REGISTRATION: { label: 'Registration', icon: FileText, color: '#f97316' },
  OTHER: { label: 'Other', icon: DollarSign, color: '#6b7280' },
};

const getStatusConfig = (status: PaymentStatus) => statusConfig[status];
const getTypeConfig = (type: PaymentType) => typeConfig[type];

export default function PaymentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setPayments([
        { id: '1', type: 'BOOKING_AMOUNT', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', amount: 50000, paidAmount: 50000, status: 'COMPLETED', paidAt: '2024-01-15T10:30:00Z', transactionId: 'TXN123456789', paymentMethod: 'UPI', receiptUrl: 'receipt1.pdf' },
        { id: '2', type: 'AGREEMENT', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', amount: 1200000, paidAmount: 1200000, status: 'COMPLETED', paidAt: '2024-01-20T14:00:00Z', transactionId: 'TXN123456790', paymentMethod: 'Net Banking', receiptUrl: 'receipt2.pdf' },
        { id: '3', type: 'CONSTRUCTION_LINKED', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', amount: 2500000, paidAmount: 0, status: 'PENDING', dueDate: '2024-03-15', installmentNumber: 1, totalInstallments: 4 },
        { id: '4', type: 'CONSTRUCTION_LINKED', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', propertyLocation: 'Banjara Hills, Hyderabad', amount: 2500000, paidAmount: 0, status: 'PENDING', dueDate: '2024-06-15', installmentNumber: 2, totalInstallments: 4 },
        { id: '5', type: 'STAMP_DUTY', propertyId: '2', propertyTitle: '2 BHK Modern Flat', propertyLocation: 'Gachibowli, Hyderabad', amount: 468000, paidAmount: 0, status: 'PENDING', dueDate: '2024-02-28' },
        { id: '6', type: 'REGISTRATION', propertyId: '2', propertyTitle: '2 BHK Modern Flat', propertyLocation: 'Gachibowli, Hyderabad', amount: 78000, paidAmount: 0, status: 'PENDING', dueDate: '2024-02-28' },
        { id: '7', type: 'MAINTENANCE', propertyId: '3', propertyTitle: '3 BHK Premium Apartment', propertyLocation: 'Kondapur, Hyderabad', amount: 50000, paidAmount: 50000, status: 'COMPLETED', paidAt: '2024-01-10T10:00:00Z', transactionId: 'TXN123456791', paymentMethod: 'Card', receiptUrl: 'receipt3.pdf' },
      ]);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const now = new Date();
  const filteredPayments = payments.filter(p => {
    if (filter === 'pending') return ['PENDING', 'PROCESSING', 'PARTIAL'].includes(p.status);
    if (filter === 'completed') return p.status === 'COMPLETED';
    if (filter === 'overdue') {
      if (p.status !== 'PENDING' || !p.dueDate) return false;
      return new Date(p.dueDate) < now;
    }
    return true;
  });

  const pendingAmount = payments
    .filter(p => ['PENDING', 'PROCESSING', 'PARTIAL'].includes(p.status))
    .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);

  const completedAmount = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Payments"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Filter, onPress: () => {} }}
      />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <SummaryCard title="Total Paid" value={`₹${formatPrice(completedAmount)}`} icon={CheckCircle} color="#10b981" />
        <SummaryCard title="Pending" value={`₹${formatPrice(pendingAmount)}`} icon={Clock} color="#f59e0b" />
      </View>

      <View style={styles.filterTabs}>
        <FilterTab label="All" count={payments.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Pending" count={payments.filter(p => ['PENDING', 'PROCESSING', 'PARTIAL'].includes(p.status)).length} active={filter === 'pending'} onPress={() => setFilter('pending')} />
        <FilterTab label="Completed" count={payments.filter(p => p.status === 'COMPLETED').length} active={filter === 'completed'} onPress={() => setFilter('completed')} />
        <FilterTab label="Overdue" count={payments.filter(p => p.status === 'PENDING' && p.dueDate && new Date(p.dueDate) < now).length} active={filter === 'overdue'} onPress={() => setFilter('overdue')} />
      </View>

      <FlatList
        data={filteredPayments}
        renderItem={({ item }) => (
          <PaymentCard payment={item} onPress={() => router.push(`/(client)/payments/${item.id}`)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[600]]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Payments"
            message={filter === 'all' ? 'Your payment schedule will appear here' : 'No payments in this category'}
            icon={<CreditCardIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />
    </View>
  );
}

function SummaryCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={[{ ...styles.summaryCard, borderLeftColor: color }]}>
      <View style={[{ ...styles.summaryIcon, backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={[{ ...styles.summaryValue, color }]}>{value}</Text>
      </View>
    </View>
  );
}

function FilterTab({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[{ ...styles.filterTab, ...(active ? styles.filterTabActive : {}) }]} onPress={onPress}>
      <Text style={[{ ...styles.filterTabText, ...(active ? styles.filterTabTextActive : {}) }]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

function PaymentCard({ payment, onPress }: { payment: Payment; onPress: () => void }) {
  const { colors } = useTheme();
  const status = getStatusConfig(payment.status);
  const type = getTypeConfig(payment.type);
  const isOverdue = payment.dueDate && new Date(payment.dueDate) < new Date() && payment.status === 'PENDING';
  const progress = payment.amount > 0 ? (payment.paidAmount / payment.amount) * 100 : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[{ ...styles.typeBadge, backgroundColor: `${type.color}20` }]}>
          <type.icon size={20} color={type.color} />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeLabel}>{type.label}</Text>
          <Text style={styles.propertyTitle}>{payment.propertyTitle}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={payment.status === 'COMPLETED' ? 'success' : payment.status === 'FAILED' ? 'danger' : payment.status === 'PENDING' ? 'warning' : 'info'}>
            {status.label}
          </Badge>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.amountRow}>
          <View style={styles.amountInfo}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>₹{formatPrice(payment.amount)}</Text>
          </View>
          {payment.paidAmount > 0 && (
            <View style={styles.amountInfo}>
              <Text style={styles.amountLabel}>Paid</Text>
              <Text style={[{ ...styles.amountValue, color: '#10b981' }]}>₹{formatPrice(payment.paidAmount)}</Text>
            </View>
          )}
          {payment.status === 'PARTIAL' && (
            <View style={styles.amountInfo}>
              <Text style={styles.amountLabel}>Balance</Text>
              <Text style={[{ ...styles.amountValue, color: colors.warning.DEFAULT }]}>₹{formatPrice(payment.amount - payment.paidAmount)}</Text>
            </View>
          )}
        </View>
        {payment.paidAmount > 0 && payment.paidAmount < payment.amount && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[{ ...styles.progressFill, width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% paid</Text>
          </View>
        )}
        {payment.dueDate && (
          <View style={[{ ...styles.dueDate, ...(isOverdue ? styles.dueDateOverdue : {}) }]}>
            <Clock size={14} color={isOverdue ? colors.error.DEFAULT : colors.text.tertiary} />
            <Text style={[{ ...styles.dueDateText, ...(isOverdue ? styles.dueDateTextOverdue : {}) }]}>
              {isOverdue ? 'Overdue: ' : 'Due: '}{formatDate(payment.dueDate)}
            </Text>
          </View>
        )}
        {payment.installmentNumber && payment.totalInstallments && (
          <View style={styles.installmentInfo}>
            <Text style={styles.installmentText}>Installment {payment.installmentNumber} of {payment.totalInstallments}</Text>
          </View>
        )}
        {payment.transactionId && (
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionText}>Txn: {payment.transactionId}</Text>
            {payment.paymentMethod && (
              <Text style={styles.transactionText}>{payment.paymentMethod}</Text>
            )}
          </View>
        )}
        {payment.receiptUrl && (
          <TouchableOpacity style={styles.receiptButton} onPress={(e) => { e.stopPropagation(); Alert.alert('Download', 'Receipt download starting...'); }}>
            <Download size={16} color={colors.primary[600]} />
            <Text style={styles.receiptButtonText}>Download Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return price.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const styles = StyleSheet.create({
  summaryContainer: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md },
  summaryCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', borderLeftWidth: 4 },
  summaryIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  summaryTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  summaryValue: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  filterTabs: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#facc15' },
  filterTabText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  filterTabTextActive: { color: '#080d1a', fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  typeBadge: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  typeInfo: { flex: 1, minWidth: 0 },
  typeLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  propertyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', marginTop: 2 },
  statusContainer: { alignItems: 'flex-end', minWidth: 100 },
  cardBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  amountInfo: { flex: 1 },
  amountLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  amountValue: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.bold, color: '#080d1a', marginTop: 2 },
  progressContainer: { gap: Spacing.xs },
  progressBar: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 3 },
  progressText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, textAlign: 'right' },
  dueDate: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, padding: Spacing.sm, backgroundColor: '#fef3c7', borderRadius: BorderRadius.md },
  dueDateOverdue: { backgroundColor: '#fef2f2' },
  dueDateText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: '#92400e' },
  dueDateTextOverdue: { color: '#ef4444', fontWeight: '600' },
  installmentInfo: { paddingTop: Spacing.xs },
  installmentText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary },
  transactionInfo: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.xs },
  transactionText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  receiptButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: '#f3f4f6', marginTop: Spacing.sm },
  receiptButtonText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: colors.primary[600] },
});