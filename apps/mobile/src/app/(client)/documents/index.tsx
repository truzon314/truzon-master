import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { FileText, ChevronRight, Filter, Download, Eye, Share2, CheckCircle, X, Clock, AlertTriangle, FileImage, FileSpreadsheet, FileType, Folder, Search, FileText as FileTextIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/layout/EmptyState';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

type DocumentCategory = 'AGREEMENT' | 'PAYMENT_RECEIPT' | 'FLOOR_PLAN' | 'BROCHURE' | 'LEGAL' | 'APPROVAL' | 'CORRESPONDENCE' | 'OTHER';
type DocumentStatus = 'AVAILABLE' | 'PROCESSING' | 'EXPIRED' | 'REJECTED' | 'PENDING_VERIFICATION';

interface Document {
  id: string;
  category: DocumentCategory;
  title: string;
  description?: string;
  propertyId?: string;
  propertyTitle?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  tags?: string[];
}

const categoryConfig: Record<DocumentCategory, { label: string; icon: any; color: string }> = {
  AGREEMENT: { label: 'Agreement', icon: FileText, color: '#8b5cf6' },
  PAYMENT_RECEIPT: { label: 'Payment Receipt', icon: FileText, color: '#10b981' },
  FLOOR_PLAN: { label: 'Floor Plan', icon: FileImage, color: '#3b82f6' },
  BROCHURE: { label: 'Brochure', icon: FileImage, color: '#f59e0b' },
  LEGAL: { label: 'Legal Document', icon: FileType, color: '#ef4444' },
  APPROVAL: { label: 'Approval', icon: CheckCircle, color: '#06b6d4' },
  CORRESPONDENCE: { label: 'Correspondence', icon: FileText, color: '#6b7280' },
  OTHER: { label: 'Other', icon: FileText, color: '#9ca3af' },
};

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  AVAILABLE: { label: 'Available', color: '#10b981' },
  PROCESSING: { label: 'Processing', color: '#f59e0b' },
  EXPIRED: { label: 'Expired', color: '#ef4444' },
  REJECTED: { label: 'Rejected', color: '#ef4444' },
  PENDING_VERIFICATION: { label: 'Pending Verification', color: '#3b82f6' },
};

const mimeTypeIcons: Record<string, any> = {
  'application/pdf': FileText,
  'image/': FileImage,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/msword': FileType,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType,
};

const getCategoryConfig = (category: DocumentCategory) => categoryConfig[category];
const getStatusConfig = (status: DocumentStatus) => statusConfig[status];
const getFileIcon = (mimeType: string) => {
  for (const [key, icon] of Object.entries(mimeTypeIcons)) {
    if (mimeType.startsWith(key)) return icon;
  }
  return FileText;
};

export default function DocumentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | DocumentCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockDocs: Document[] = [
        { id: '1', category: 'AGREEMENT', title: 'Sale Agreement', description: 'Registered sale agreement for 3 BHK Luxury Apartment', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'agreement1.pdf', fileName: 'Sale_Agreement_3BHK_Banjara_Hills.pdf', fileSize: 2450000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-20T14:00:00Z', verifiedAt: '2024-01-20T14:30:00Z', tags: ['registered', 'stamp-duty-paid'] },
        { id: '2', category: 'PAYMENT_RECEIPT', title: 'Booking Amount Receipt', description: 'Receipt for booking amount of ₹50,000', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'receipt1.pdf', fileName: 'Booking_Receipt_50000.pdf', fileSize: 150000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-15T10:30:00Z', verifiedAt: '2024-01-15T10:35:00Z', tags: ['booking'] },
        { id: '3', category: 'PAYMENT_RECEIPT', title: 'Agreement Payment Receipt', description: 'Receipt for agreement payment of ₹12,00,000', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'receipt2.pdf', fileName: 'Agreement_Payment_Receipt_12L.pdf', fileSize: 180000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-20T14:15:00Z', verifiedAt: '2024-01-20T14:20:00Z', tags: ['agreement'] },
        { id: '4', category: 'FLOOR_PLAN', title: '3 BHK Floor Plan', description: 'Approved floor plan with carpet area 1,850 sq.ft', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'floorplan1.pdf', fileName: 'Floor_Plan_3BHK_1850sqft.pdf', fileSize: 3200000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-10T09:00:00Z', tags: ['approved', 'rera'] },
        { id: '5', category: 'BROCHURE', title: 'Project Brochure', description: 'Complete project brochure for Skyline Towers', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'brochure1.pdf', fileName: 'Skyline_Towers_Brochure.pdf', fileSize: 5600000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-05T11:00:00Z', tags: ['marketing'] },
        { id: '6', category: 'LEGAL', title: 'Title Search Report', description: 'Legal title verification report', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'titlesearch1.pdf', fileName: 'Title_Search_Report.pdf', fileSize: 890000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-18T16:00:00Z', verifiedAt: '2024-01-19T10:00:00Z', tags: ['legal', 'verified'] },
        { id: '7', category: 'APPROVAL', title: 'RERA Registration Certificate', description: 'RERA registration certificate for Project Skyline Towers', propertyId: '1', propertyTitle: '3 BHK Luxury Apartment', fileUrl: 'rera1.pdf', fileName: 'RERA_Certificate.pdf', fileSize: 420000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-01T10:00:00Z', expiresAt: '2027-01-01T10:00:00Z', tags: ['rera', 'registration'] },
        { id: '8', category: 'PAYMENT_RECEIPT', title: 'Maintenance Receipt', description: 'Annual maintenance charges receipt', propertyId: '3', propertyTitle: '3 BHK Premium Apartment', fileUrl: 'maintenance1.pdf', fileName: 'Maintenance_Receipt_50000.pdf', fileSize: 120000, mimeType: 'application/pdf', status: 'AVAILABLE', uploadedAt: '2024-01-10T10:00:00Z', verifiedAt: '2024-01-10T10:05:00Z', tags: ['maintenance'] },
      ];
      setDocuments(mockDocs);
      setFilteredDocuments(mockDocs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterDocuments(text, categoryFilter);
  };

  const filterDocuments = (search: string, category: 'all' | DocumentCategory) => {
    let result = documents;
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(lowerSearch) ||
        d.fileName.toLowerCase().includes(lowerSearch) ||
        d.propertyTitle?.toLowerCase().includes(lowerSearch) ||
        d.tags?.some(t => t.toLowerCase().includes(lowerSearch))
      );
    }
    if (category !== 'all') {
      result = result.filter(d => d.category === category);
    }
    setFilteredDocuments(result);
  };

  const handleCategoryChange = (category: 'all' | DocumentCategory) => {
    setCategoryFilter(category);
    filterDocuments(searchQuery, category);
    setShowFilterSheet(false);
  };

  const getCategoryConfig = (category: DocumentCategory) => categoryConfig[category];
  const getStatusConfig = (status: DocumentStatus) => statusConfig[status];
  const getFileIcon = (mimeType: string) => {
    for (const [key, icon] of Object.entries(mimeTypeIcons)) {
      if (mimeType.startsWith(key)) return icon;
    }
    return FileText;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Documents"
        leftAction={{ onPress: () => {} }}
        rightAction={{ icon: Filter, onPress: () => setShowFilterSheet(true) }}
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      {categoryFilter !== 'all' && (
        <View style={styles.activeFilter}>
          <Text style={styles.activeFilterText}>Filter: {categoryConfig[categoryFilter].label}</Text>
          <TouchableOpacity onPress={() => { setCategoryFilter('all'); filterDocuments(searchQuery, 'all'); }}>
            <X size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredDocuments}
        renderItem={({ item }) => (
          <DocumentCard document={item} onPress={() => router.push(`/(client)/documents/${item.id}`)} />
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
            title="No Documents"
            message={searchQuery || categoryFilter !== 'all' ? 'No documents match your filters' : 'Your documents will appear here'}
            actionLabel={searchQuery || categoryFilter !== 'all' ? 'Clear Filters' : undefined}
            onAction={() => { setSearchQuery(''); setCategoryFilter('all'); filterDocuments('', 'all'); }}
            icon={<FileTextIcon size={24} color={colors.text.tertiary} />}
          />
        }
      />

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
      <View style={styles.filterSheet}>
        <View style={styles.filterSheetContent}>
          <View style={styles.filterSheetHeader}>
            <Text style={styles.filterSheetTitle}>Filter by Category</Text>
            <TouchableOpacity onPress={() => setShowFilterSheet(false)}><X size={24} color={colors.text.tertiary} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={[{ ...styles.filterOption, ...(categoryFilter === 'all' ? styles.filterOptionActive : {}) }]} onPress={() => handleCategoryChange('all')}>
            <Text style={[{ ...styles.filterOptionText, ...(categoryFilter === 'all' ? styles.filterOptionTextActive : {}) }]}>All Categories</Text>
          </TouchableOpacity>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <TouchableOpacity key={key} style={[{ ...styles.filterOption, ...(categoryFilter === key ? styles.filterOptionActive : {}) }]} onPress={() => handleCategoryChange(key as DocumentCategory)}>
              <config.icon size={20} color={config.color} style={styles.filterOptionIcon} />
              <Text style={[{ ...styles.filterOptionText, ...(categoryFilter === key ? styles.filterOptionTextActive : {}) }]}>{config.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      )}
    </View>
  );
}

function DocumentCard({ document, onPress }: { document: Document; onPress: () => void }) {
  const { colors } = useTheme();
  const category = getCategoryConfig(document.category);
  const status = getStatusConfig(document.status);
  const FileIcon = getFileIcon(document.mimeType);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <View style={[{ ...styles.fileIcon, backgroundColor: `${category.color}20` }]}>
          <FileIcon size={28} color={category.color} />
        </View>
        <View style={styles.fileInfo}>
          <View style={styles.fileHeader}>
            <Text style={styles.fileTitle}>{document.title}</Text>
            <Badge variant={document.status === 'AVAILABLE' ? 'success' : document.status === 'PROCESSING' ? 'warning' : document.status === 'EXPIRED' ? 'danger' : 'info'}>
              {status.label}
            </Badge>
          </View>
          <Text style={styles.fileDescription}>{document.description || document.fileName}</Text>
          <View style={styles.fileMeta}>
            {document.propertyTitle && (
              <View style={styles.metaItem}>
                <Folder size={12} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{document.propertyTitle}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <FileText size={12} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{formatFileSize(document.fileSize)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={12} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{formatDate(document.uploadedAt)}</Text>
            </View>
          </View>
          {document.tags && document.tags.length > 0 && (
            <View style={styles.tags}>
              {document.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline">{tag}</Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="outline">+{document.tags.length - 3}</Badge>
              )}
            </View>
          )}
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); Alert.alert('View', 'Opening document...'); }}>
          <Eye size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); Alert.alert('Download', 'Download starting...'); }}>
          <Download size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); Alert.alert('Share', 'Share options...'); }}>
          <Share2 size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <ChevronRight size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  searchInput: { backgroundColor: '#fff' },
  activeFilter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: '#fef3c7', marginHorizontal: Spacing.md, borderRadius: BorderRadius.md },
  activeFilterText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#92400e' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  cardContent: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.md },
  fileIcon: { width: 56, height: 56, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  fileInfo: { flex: 1, minWidth: 0 },
  fileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  fileTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', flex: 1 },
  fileDescription: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginBottom: Spacing.sm },
  fileMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  metaText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  tag: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.medium },
  cardActions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: Spacing.md },
  actionButton: { padding: Spacing.xs },
  filterSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xl, zIndex: 100 },
  filterSheetContent: { padding: Spacing.md },
  filterSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  filterSheetTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  filterOptionActive: { backgroundColor: '#fef3c7' },
  filterOptionIcon: { width: 28 },
  filterOptionText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.medium, color: '#080d1a' },
  filterOptionTextActive: { color: colors.primary[600], fontWeight: '600' },
});