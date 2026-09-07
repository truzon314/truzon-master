export interface User {
  id: string;
  email: string;
  fullName: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  avatar?: string;
  role: string;
  status: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Lead {
  id: string;
  fullName: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  source?: string;
  assignedToId?: string;
  projectId?: string;
  projectName?: string;
  propertyType?: string;
  budget?: { min: number; max: number };
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  status: string;
  isFeatured: boolean;
  amenities: string[];
  configurations: string[];
  propertyTypes: string[];
  priceRange: { min: number; max: number };
  totalUnits: number;
  availableUnits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceDisplay: string;
  propertyType: string;
  configuration: string;
  status: string;
  projectId: string;
  projectName: string;
  location: string;
  city: string;
  amenities: string[];
  images: PropertyImage[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface InventoryUnit {
  id: string;
  unitNumber: string;
  type: string;
  floor: number;
  area: number;
  price: number;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  customerId: string;
  propertyId: string;
  projectId: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisit {
  id: string;
  customerId: string;
  propertyId: string;
  projectId: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  propertyId: string;
  projectId: string;
  bookingAmount: number;
  totalAmount: number;
  status: string;
  bookingDate: string;
  agreementStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentType: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agreement {
  id: string;
  bookingId: string;
  status: string;
  documentUrl?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  status: string;
  commissionRate: number;
  totalLeads: number;
  totalBookings: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  channelPartnerId: string;
  bookingId: string;
  amount: number;
  percentage: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isPublished: boolean;
  createdAt: string;
}

export interface MapProject {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

export interface Report {
  id: string;
  type: string;
  data: Record<string, unknown>;
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  category: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
