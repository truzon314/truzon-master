import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Mail, Phone, MessageSquare, ArrowLeft, Send, CheckCircle, Clock, AlertTriangle, HelpCircle, Search, Filter, Star, Share2, Heart, User as UserIcon, Settings, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { colors, Spacing, Typography, BorderRadius } from '@/theme';

const faqs = [
  { id: '1', question: 'How do I book a site visit?', answer: 'Go to any property detail page and tap "Book Visit" at the bottom. Select your preferred date and time, and our agent will confirm the appointment.', category: 'Bookings' },
  { id: '2', question: 'What documents are required for booking?', answer: 'Typically you need: PAN Card, Aadhaar Card, Address Proof, Passport-size photographs, and the booking amount payment receipt. Requirements may vary by project.', category: 'Documentation' },
  { id: '3', question: 'How does the payment schedule work?', answer: 'Payments are typically construction-linked: Booking amount (10%), Agreement (20%), then installments at each construction milestone (foundation, plinth, flooring, etc.), and final payment at possession.', category: 'Payments' },
  { id: '4', question: 'Can I cancel my booking?', answer: 'Yes, you can cancel before the agreement is signed. Cancellation charges may apply as per the builder\'s policy. After agreement, cancellation terms are governed by the agreement and RERA.', category: 'Bookings' },
  { id: '5', question: 'What is RERA and why is it important?', answer: 'RERA (Real Estate Regulatory Authority) protects home buyers by ensuring transparency, timely delivery, and quality. Always verify the RERA registration number before booking.', category: 'Legal' },
  { id: '6', question: 'How do I download my documents?', answer: 'Go to the Documents section in your profile. Tap the download icon on any document to save it to your device. All your agreements, receipts, and floor plans are available there.', category: 'Documentation' },
  { id: '7', question: 'What are maintenance charges?', answer: 'Maintenance charges cover common area maintenance, security, landscaping, clubhouse, and amenities. They are usually calculated per sq.ft and paid annually or quarterly.', category: 'Payments' },
  { id: '8', question: 'How do I contact the sales agent?', answer: 'From any property or project page, you can call or message the assigned agent directly. Their contact details are available in the enquiry and booking details.', category: 'General' },
];

export default function SupportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Your message has been sent. Our team will get back to you within 24 hours.');
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setShowContactForm(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header
        title="Help & Support"
        leftAction={{ onPress: () => router.back() }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <Card style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <View style={styles.contactIcon}>
              <MessageSquare size={28} color="#fff" />
            </View>
            <View>
              <Text style={styles.contactTitle}>Need Help?</Text>
              <Text style={styles.contactSubtitle}>Our support team is here to assist you</Text>
            </View>
          </View>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactOption} onPress={() => setShowContactForm(true)}>
              <View style={styles.optionIcon}><Mail size={24} color={colors.primary[600]} /></View>
              <View>
                <Text style={styles.optionTitle}>Send us a Message</Text>
                <Text style={styles.optionSubtitle}>We\'ll reply within 24 hours</Text>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={() => Alert.alert('Call', 'Call 1800-123-4567?')}>
              <View style={styles.optionIcon}><Phone size={24} color={colors.primary[600]} /></View>
              <View>
                <Text style={styles.optionTitle}>Call Support</Text>
                <Text style={styles.optionSubtitle}>1800-123-4567 (Toll-free)</Text>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={() => Alert.alert('WhatsApp', 'Open WhatsApp chat?')}>
              <View style={styles.optionIcon}><MessageSquare size={24} color={colors.primary[600]} /></View>
              <View>
                <Text style={styles.optionTitle}>WhatsApp Chat</Text>
                <Text style={styles.optionSubtitle}>Instant messaging support</Text>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <QuickAction icon={Heart} label="Saved Properties" onPress={() => router.push('/(client)/saved')} color="#ef4444" />
            <QuickAction icon={UserIcon} label="My Enquiries" onPress={() => router.push('/(client)/enquiries')} color="#3b82f6" />
            <QuickAction icon={Clock} label="Site Visits" onPress={() => router.push('/(client)/bookings')} color="#8b5cf6" />
            <QuickAction icon={Settings} label="Settings" onPress={() => router.push('/(client)/settings')} color="#6b7280" />
          </View>
        </Card>

        {/* FAQ Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.text.tertiary} />}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[{ ...styles.categoryChip, ...(selectedCategory === cat ? styles.categoryChipActive : {}) }]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[{ ...styles.categoryChipText, ...(selectedCategory === cat ? styles.categoryChipTextActive : {}) }]}>
                {cat === 'all' ? 'All' : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <View style={styles.faqList}>
            {filteredFaqs.map(faq => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedFaq === faq.id}
                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noResults}>
            <Search size={48} color={colors.text.tertiary} />
            <Text style={styles.noResultsText}>No FAQs found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}

        {/* Contact Form Modal */}
        {showContactForm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Contact Support</Text>
                <TouchableOpacity onPress={() => setShowContactForm(false)}>
                  <ArrowLeft size={24} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Input
                  label="Name *"
                  value={contactForm.name}
                  onChangeText={text => setContactForm(prev => ({ ...prev, name: text }))}
                  placeholder="Your name"
                />
                <Input
                  label="Email *"
                  value={contactForm.email}
                  onChangeText={text => setContactForm(prev => ({ ...prev, email: text }))}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                />
                <Input
                  label="Phone"
                  value={contactForm.phone}
                  onChangeText={text => setContactForm(prev => ({ ...prev, phone: text }))}
                  placeholder="+91 98765 43210"
                  keyboardType="phone-pad"
                />
                <Input
                  label="Subject *"
                  value={contactForm.subject}
                  onChangeText={text => setContactForm(prev => ({ ...prev, subject: text }))}
                  placeholder="Brief summary of your issue"
                />
                <Input
                  label="Message *"
                  value={contactForm.message}
                  onChangeText={text => setContactForm(prev => ({ ...prev, message: text }))}
                  placeholder="Describe your issue in detail..."
                  multiline
                  numberOfLines={5}
                />
                <Button onPress={handleSubmitContact} style={{ marginTop: Spacing.md }} fullWidth>
                  Send Message
                </Button>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function QuickAction({ icon: Icon, label, onPress, color }: { icon: any; label: string; onPress: () => void; color: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[{ ...styles.quickActionIcon, backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function FAQItem({ faq, isExpanded, onPress }: { faq: any; isExpanded: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.faqCard}>
      <TouchableOpacity style={styles.faqQuestion} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.faqQuestionLeft}>
          <HelpCircle size={20} color={colors.primary[600]} />
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
        </View>
        <View style={styles.faqQuestionRight}>
          <Badge variant="outline" style={styles.faqCategory}>{faq.category}</Badge>
          <ChevronRight size={20} color={isExpanded ? colors.primary[600] : colors.text.tertiary} style={isExpanded ? styles.chevronRotated : {}} />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  contactCard: { padding: Spacing.md },
  contactHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  contactIcon: { width: 56, height: 56, borderRadius: BorderRadius.xl, backgroundColor: '#080d1a', justifyContent: 'center', alignItems: 'center' },
  contactTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  contactSubtitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, marginTop: 2 },
  contactOptions: { gap: Spacing.md },
  contactOption: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg, gap: Spacing.md },
  optionIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  optionTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  optionSubtitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.regular, color: colors.text.tertiary, marginTop: 2 },
  quickActionsCard: { padding: Spacing.md },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.semiBold, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  quickAction: { width: '48%', alignItems: 'center', padding: Spacing.md, backgroundColor: '#f9fafb', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: '#f3f4f6' },
  quickActionIcon: { width: 56, height: 56, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  quickActionLabel: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#080d1a', textAlign: 'center' },
  searchContainer: { paddingHorizontal: Spacing.md },
  searchInput: { backgroundColor: '#fff' },
  categoryContainer: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  categoryChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f3f4f6' },
  categoryChipActive: { backgroundColor: '#facc15' },
  categoryChipText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.medium, color: '#6b7280' },
  categoryChipTextActive: { color: '#080d1a', fontWeight: '600' },
  faqList: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  faqCard: { padding: 0 },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, gap: Spacing.md },
  faqQuestionLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, flex: 1 },
  faqQuestionText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.semiBold, color: '#080d1a', flex: 1 },
  faqQuestionRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  faqCategory: {},
  chevronRotated: { transform: [{ rotate: '180deg' }] },
  faqAnswer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  faqAnswerText: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.secondary, lineHeight: 24 },
  noResults: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  noResultsText: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.semiBold, color: '#080d1a' },
  noResultsSubtext: { fontSize: Typography.sizes.md, fontFamily: Typography.fonts.regular, color: colors.text.tertiary },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, maxHeight: '85%', width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.fonts.bold, color: '#080d1a' },
  modalContent: { padding: Spacing.md, gap: Spacing.md },
});