// Truzon Platform - Shared Types
// This package contains all shared TypeScript types used across the platform

// Core enums
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES = 'SALES',
  CP = 'CP',
  CLIENT = 'CLIENT',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  FINANCE = 'FINANCE',
}

export enum PermissionScope {
  GLOBAL = 'GLOBAL',
  PROJECT = 'PROJECT',
  OWNED = 'OWNED',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  SITE_VISIT = 'SITE_VISIT',
  NEGOTIATION = 'NEGOTIATION',
  BOOKED = 'BOOKED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
  NURTURE = 'NURTURE',
}

export enum LeadSourceType {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  GOOGLE_ADS = 'GOOGLE_ADS',
  META_ADS = 'META_ADS',
  WHATSAPP = 'WHATSAPP',
  PHONE = 'PHONE',
  MANUAL = 'MANUAL',
  PROPERTY_PORTAL = 'PROPERTY_PORTAL',
  CHANNEL_PARTNER = 'CHANNEL_PARTNER',
  CAMPAIGN = 'CAMPAIGN',
  REFERRAL = 'REFERRAL',
  WALK_IN = 'WALK_IN',
  OTHER = 'OTHER',
}

export enum PropertyType {
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  APARTMENT = 'APARTMENT',
  COMMERCIAL = 'COMMERCIAL',
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  HOLD = 'HOLD',
  BOOKED = 'BOOKED',
  SOLD = 'SOLD',
  BLOCKED = 'BLOCKED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentType {
  BOOKING_AMOUNT = 'BOOKING_AMOUNT',
  DOWN_PAYMENT = 'DOWN_PAYMENT',
  MILESTONE = 'MILESTONE',
  FINAL = 'FINAL',
  OTHER = 'OTHER',
}

export enum AgreementStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PageType {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PROJECTS = 'PROJECTS',
  BLOG = 'BLOG',
  CONTACT = 'CONTACT',
  CUSTOM = 'CUSTOM',
}

export enum PageStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

export enum BlogStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum NotificationType {
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  LEAD_STATUS_CHANGED = 'LEAD_STATUS_CHANGED',
  FOLLOW_UP_REMINDER = 'FOLLOW_UP_REMINDER',
  SITE_VISIT_REMINDER = 'SITE_VISIT_REMINDER',
  SITE_VISIT_SCHEDULED = 'SITE_VISIT_SCHEDULED',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  PAYMENT_UPDATE = 'PAYMENT_UPDATE',
  NEW_PROPERTY = 'NEW_PROPERTY',
  NEW_PROJECT = 'NEW_PROJECT',
  ADMIN_ANNOUNCEMENT = 'ADMIN_ANNOUNCEMENT',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  COMMISSION_UPDATE = 'COMMISSION_UPDATE',
  DOCUMENT_REQUEST = 'DOCUMENT_REQUEST',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
}

export enum DocumentType {
  KYC = 'KYC',
  AGREEMENT = 'AGREEMENT',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  FLOOR_PLAN = 'FLOOR_PLAN',
  BROCHURE = 'BROCHURE',
  PROJECT_IMAGE = 'PROJECT_IMAGE',
  PROPERTY_IMAGE = 'PROPERTY_IMAGE',
  OTHER = 'OTHER',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  ASSIGN = 'ASSIGN',
  UNASSIGN = 'UNASSIGN',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum SiteVisitStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum EntityTypeForAudit {
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  LEAD = 'LEAD',
  CUSTOMER = 'CUSTOMER',
  PROJECT = 'PROJECT',
  PROPERTY = 'PROPERTY',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  INVENTORY_UNIT = 'INVENTORY_UNIT',
  CHANNEL_PARTNER = 'CHANNEL_PARTNER',
  ENQUIRY = 'ENQUIRY',
  SITE_VISIT = 'SITE_VISIT',
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  AGREEMENT = 'AGREEMENT',
  CAMPAIGN = 'CAMPAIGN',
  PAGE = 'PAGE',
  BLOG = 'BLOG',
  MEDIA = 'MEDIA',
  SETTING = 'SETTING',
  NOTIFICATION = 'NOTIFICATION',
  DOCUMENT = 'DOCUMENT',
}

// Core interfaces
export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  status: UserStatus;
  role: Role;
  roleId: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Role {
  id: string;
  name: RoleType;
  displayName: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  key: string;
  name: string;
  module: string;
  action: string;
  scope: PermissionScope;
  description?: string;
  createdAt: string;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  user: User;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  revokedAt?: string;
  createdAt: string;
}

export interface AuthToken {
  id: string;
  token: string;
  userId: string;
  user: User;
  purpose: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

// Lead interfaces
export interface LeadSource {
  id: string;
  name: string;
  type: LeadSourceType;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  sourceId: string;
  source: LeadSource;
  campaignId?: string;
  campaign?: Campaign;
  projectId?: string;
  project?: Project;
  propertyId?: string;
  property?: Property;
  assignedUserId?: string;
  assignedUser?: User;
  assignedCpId?: string;
  assignedCp?: ChannelPartner;
  createdById: string;
  createdBy: User;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  requirement?: string;
  status: LeadStatus;
  notes?: string;
  lastActivityAt?: string;
  nextFollowUpAt?: string;
  convertedAt?: string;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface LeadFollowUp {
  id: string;
  leadId: string;
  lead: Lead;
  userId: string;
  user: User;
  type: string;
  subject?: string;
  notes?: string;
  scheduledAt: string;
  completedAt?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  lead: Lead;
  userId: string;
  user: User;
  type: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LeadAssignment {
  id: string;
  leadId: string;
  lead: Lead;
  fromUserId?: string;
  fromUser?: User;
  toUserId?: string;
  toUser?: User;
  fromCpId?: string;
  fromCp?: ChannelPartner;
  toCpId?: string;
  toCp?: ChannelPartner;
  assignedById: string;
  assignedBy: User;
  reason?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  leadId: string;
  lead: Lead;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  occupation?: string;
  annualIncome?: number;
  kycStatus?: string;
  kycVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Property interfaces
export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  tagline?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  reraNumber?: string;
  possessionDate?: string;
  launchDate?: string;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdById: string;
  createdBy: User;
  updatedById?: string;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Property {
  id: string;
  projectId: string;
  project: Project;
  name: string;
  slug: string;
  propertyType: PropertyType;
  description?: string;
  shortDescription?: string;
  configuration?: string;
  facing?: string;
  plotSize?: number;
  builtUpArea?: number;
  carpetArea?: number;
  priceDisplay?: string;
  priceValue?: number;
  pricePerSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  amenities?: Record<string, any>;
  specifications?: Record<string, any>;
  isSignature: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Villa {
  id: string;
  projectId: string;
  project: Project;
  unitNumber: string;
  name?: string;
  plotSize: number;
  builtUpArea: number;
  carpetArea?: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  facing?: string;
  priceValue: number;
  pricePerSqft?: number;
  status: InventoryStatus;
  floorPlanUrl?: string;
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Plot {
  id: string;
  projectId: string;
  project: Project;
  unitNumber: string;
  name?: string;
  plotSize: number;
  facing?: string;
  priceValue: number;
  pricePerSqft?: number;
  status: InventoryStatus;
  cornerPlot: boolean;
  parkFacing: boolean;
  roadWidth?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface InventoryUnit {
  id: string;
  projectId: string;
  project: Project;
  propertyId?: string;
  property?: Property;
  villaId?: string;
  villa?: Villa;
  plotId?: string;
  plot?: Plot;
  unitType: PropertyType;
  unitNumber: string;
  status: InventoryStatus;
  priceValue: number;
  holdExpiresAt?: string;
  holdReason?: string;
  blockedReason?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PropertyMedia {
  id: string;
  propertyId: string;
  property: Property;
  mediaId: string;
  media: Media;
  type: string;
  position: number;
  isPrimary: boolean;
  createdAt: string;
}

// Channel Partner interfaces
export interface ChannelPartner {
  id: string;
  name: string;
  companyName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string
  gstNumber?: string;
  panNumber?: string;
  bankAccount?: Record<string, any>;
  commissionRate: number;
  status: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ChannelPartnerUser {
  id: string;
  channelPartnerId: string;
  channelPartner: ChannelPartner;
  userId: string;
  user: User;
  role: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Commission {
  id: string;
  channelPartnerId: string;
  channelPartner: ChannelPartner;
  leadId?: string;
  lead?: Lead;
  bookingId?: string;
  booking?: Booking;
  amount: number;
  rate: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  paidById?: string;
  paidBy?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Sales interfaces
export interface Enquiry {
  id: string;
  leadId: string;
  lead: Lead;
  projectId?: string;
  project?: Project;
  propertyId?: string;
  property?: Property;
  userId?: string;
  user?: User;
  source: string;
  type: string;
  subject: string;
  message: string;
  response?: string;
  respondedById?: string;
  respondedBy?: User;
  respondedAt?: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  lead: Lead;
  projectId: string;
  project: Project;
  propertyId?: string;
  property?: Property;
  userId: string;
  user: User;
  scheduledAt: string;
  durationMinutes: number;
  status: SiteVisitStatus;
  feedback?: string;
  attendedById?: string;
  attendedBy?: User;
  attendedAt?: string;
  cancelledReason?: string;
  transportNeeded: boolean;
  transportDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  leadId: string;
  lead: Lead;
  customerId?: string;
  customer?: Customer;
  projectId: string;
  project: Project;
  propertyId?: string;
  property?: Property;
  inventoryUnitId: string;
  inventoryUnit: InventoryUnit;
  userId: string;
  user: User;
  cpId?: string;
  cp?: ChannelPartner;
  bookingAmount: number;
  totalPrice: number;
  discount: number;
  taxAmount: number;
  status: BookingStatus;
  bookingDate: string;
  confirmationDate?: string;
  expiryDate?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledById?: string;
  cancelledBy?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  bookingId: string;
  booking: Booking;
  customerId?: string;
  customer?: Customer;
  userId: string;
  user: User;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  method?: string;
  transactionId?: string;
  referenceNumber?: string;
  paidAt?: string;
  verifiedAt?: string;
  verifiedById?: string;
  verifiedBy?: User;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agreement {
  id: string;
  agreementNumber: string;
  bookingId: string;
  booking: Booking;
  customerId: string;
  customer: Customer;
  userId: string;
  user: User;
  templateId?: string;
  template?: Document;
  documentId?: string;
  document?: Document;
  status: AgreementStatus;
  signedAt?: string;
  expiresAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Marketing interfaces
export interface Campaign {
  id: string;
  name: string;
  code: string;
  description?: string;
  sourceId: string;
  source: LeadSource;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent: number;
  targetLeads?: number;
  actualLeads: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// CMS interfaces
export interface Page {
  id: string;
  pageType: PageType;
  slug: string;
  title: string;
  status: PageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  featuredImageId?: string;
  featuredImage?: Media;
  seoId?: string;
  seo?: SeoMeta;
  createdById: string;
  createdBy: User;
  updatedById: string;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  blocks?: PageBlock[];
}

export interface BlockDefinition {
  id: string;
  key: string;
  label: string;
  description?: string;
  category: string;
  schema: Record<string, any>;
  defaultConfig?: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageBlock {
  id: string;
  pageId: string;
  page: Page;
  blockDefinitionId: string;
  blockDefinition: BlockDefinition;
  position: number;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SeoMeta {
  id: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  ogImage?: Media;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageId?: string;
  twitterImage?: Media;
  robots?: string;
  schemaJsonLd?: Record<string, any>;
  structuredData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  featuredImageId?: string;
  featuredImage?: Media;
  authorId: string;
  author: User;
  status: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
  readingTimeMinutes?: number;
  isFeatured: boolean;
  viewCount: number;
  seoId?: string;
  seo?: SeoMeta;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  appliesTo: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  fileName: string;
  fileKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
  type: MediaType;
  folderId?: string;
  folder?: MediaFolder;
  uploadedById: string;
  uploadedBy: User;
  storageProvider: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  parent?: MediaFolder;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaUsage {
  id: string;
  mediaId: string;
  media: Media;
  entityType: string;
  entityId: string;
  fieldName?: string;
  createdAt: string;
}

export interface Menu {
  id: string;
  key: string;
  label: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  menuId: string;
  menu: Menu;
  parentId?: string;
  parent?: MenuItem;
  label: string;
  href?: string;
  pageId?: string;
  page?: Page;
  isExternal: boolean;
  openInNewTab: boolean;
  icon?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formKey: string;
  name: string;
  phone: string;
  email?: string;
  propertyType?: string;
  message?: string;
  projectId?: string;
  propertyId?: string;
  source?: string;
  utmData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  assignedUserId?: string;
  assignedUser?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  isPublic: boolean;
  group: string;
  createdAt: string;
  updatedAt: string;
  updatedById?: string;
  updatedBy?: User;
}

export interface SettingVersion {
  id: string;
  settingId: string;
  setting: Setting;
  value: Record<string, any>;
  changedById: string;
  changedBy: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  user: User;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
  isRead: boolean;
  readAt?: string;
  priority: string;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  key: string;
  name: string;
  subject?: string;
  body: string;
  channels: NotificationChannel[];
  variables?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileId: string;
  file: Media;
  entityType: string;
  entityId: string;
  uploadedById: string;
  uploadedBy: User;
  verifiedById?: string;
  verifiedBy?: User;
  verifiedAt?: string;
  status: string;
  expiryDate?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: User;
  action: AuditAction;
  entityType: EntityTypeForAudit;
  entityId: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface MapProject {
  id: string;
  name: string;
  description?: string;
  mapProviderType: string;
  centerLat?: number;
  centerLng?: number;
  zoomLevel: number;
  bounds?: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  layers?: MapLayer[];
  shareLink?: MapShareLink;
  properties?: Property[];
}

export interface MapLayer {
  id: string;
  projectId: string;
  label: string;
  geojson: Record<string, any>; // GeoJSON FeatureCollection object
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
  strokeStyle: string; // solid, dashed, dotted
  defaultVisible: boolean;
  colorRules?: Record<string, any>; // Conditional feature styling rules
  labelProperty?: string;
  labelAlignment?: string; // top, center, bottom, left, right
  popupEnabled: boolean;
  popupProperties?: Record<string, any>;
  position: number;
  createdAt: string;
  updatedAt: string;
  project?: MapProject;
}

export interface MapProviderConfig {
  id: string;
  providerType: string; // openstreetmap, mapbox, google, custom
  apiKey?: string;
  customTileUrl?: string;
  maxZoom: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MapShareLink {
  id: string;
  projectId: string;
  token: string;
  isActive: boolean;
  passwordHash?: string;
  expiresAt?: string;
  maxViews?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  project?: MapProject;
}

export interface ChatConversation {
  id: string;
  leadId?: string;
  lead?: Lead;
  customerId?: string;
  customer?: Customer;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  status: string;
  assignedUserId?: string;
  assignedUser?: User;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  conversation: ChatConversation;
  senderId?: string;
  sender?: User;
  senderType: string;
  senderName?: string;
  body: string;
  messageType: string;
  metadata?: Record<string, any>;
  readAt?: string;
  createdAt: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experienceMin?: number;
  experienceMax?: number;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  isFeatured: boolean;
  postedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  mediaId: string;
  media: Media;
  category?: string;
  projectId?: string;
  project?: Project;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  mediaId?: string;
  media?: Media;
  projectId?: string;
  project?: Project;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
  hits: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: PaginationMeta | null;
  error: ApiError | null;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  phone?: string;
  fullName: string;
  password: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  password: string;
}

export interface VerifyEmailForm {
  token: string;
}

export interface CreateLeadForm {
  sourceId: string;
  campaignId?: string;
  projectId?: string;
  propertyId?: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  requirement?: string;
}

export interface UpdateLeadForm {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  requirement?: string;
  status?: LeadStatus;
  lostReason?: string;
  assignedUserId?: string;
  nextFollowUpAt?: string;
}

// Mapping / GIS interfaces
export interface ColorRule {
  id: string;
  property: string;
  value: string;
  action: 'color' | 'hide';
  color?: string;
  opacity?: number;
}
