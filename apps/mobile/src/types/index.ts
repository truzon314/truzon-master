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
  passwordChangedAt?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OTPData {
  phone: string;
  otp: string;
}

export interface ForgotPasswordData {
  phone: string;
  email?: string;
}

export interface ResetPasswordData {
  phone: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  error?: ApiError;
}

export type RoleType = 'customer' | 'channel_partner' | 'admin';

export interface UserWithRole extends User {
  roleType: RoleType;
}

export interface NavigationState {
  isAuthenticated: boolean;
  userRole?: RoleType;
  isLoading: boolean;
}

export interface Property {
  id: string;
  name: string;
  title?: string;
  slug: string;
  description: string;
  price: number;
  priceDisplay: string;
  pricePerSqft?: number;
  propertyType: 'villa' | 'plot' | 'apartment' | 'farmland';
  configuration: string;
  bhk?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  plotSize: number;
  builtUpArea?: number;
  carpetArea?: number;
  facing?: string;
  locality?: string;
  reraNumber?: string;
  status: 'available' | 'blocked' | 'booked' | 'sold';
  projectId: string;
  projectName: string;
  projectSlug: string;
  location: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  agent?: { id: string; name: string; phone: string; email: string; avatar?: string; role?: string };
  nearbyPlaces?: { name: string; distance: string; type: string; id?: string }[];
  specifications: Record<string, string>;
  images: PropertyImage[];
  floorPlans: FloorPlan[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  url: string;
  imageUrl?: string;
  area?: number;
  type: '2d' | '3d';
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  images: ProjectImage[];
  gallery: ProjectImage[];
  amenities: string[];
  configurations: string[];
  propertyTypes: string[];
  priceRange: { min: number; max: number };
  minPrice?: number;
  maxPrice?: number;
  status: 'upcoming' | 'launching' | 'active' | 'sold_out' | 'completed';
  isFeatured: boolean;
  reraNumber?: string;
  totalUnits: number;
  availableUnits: number;
  developer?: string;
  developerContact?: { name: string; phone: string; email: string };
  possessionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyTypeInterest?: string;
  source: string;
  status: LeadStatus;
  assignedToId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'site_visit_scheduled' | 'site_visit_done' | 'negotiation' | 'booking' | 'converted' | 'lost' | 'dnc';

export interface Enquiry {
  id: string;
  customerId: string;
  customer?: User;
  propertyId: string;
  property?: Property;
  projectId: string;
  project?: Project;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedToId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisit {
  id: string;
  customerId: string;
  customer?: User;
  propertyId: string;
  property?: Property;
  projectId: string;
  project?: Project;
  preferredDate: string;
  preferredTime: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  assignedAgentId?: string;
  assignedAgent?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  propertyId: string;
  property?: Property;
  projectId: string;
  project?: Project;
  bookingAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  agreementStatus: 'draft' | 'pending_signature' | 'signed' | 'registered';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  amount: number;
  paymentType: 'booking_amount' | 'installment' | 'full_payment' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  category: 'agreement' | 'receipt' | 'property_doc' | 'kyc' | 'other';
  relatedEntityType?: 'booking' | 'property' | 'project' | 'customer';
  relatedEntityId?: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  channelPartnerId: string;
  bookingId: string;
  booking?: Booking;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface FilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface ProjectFilters extends FilterParams {
  city?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PropertyFilters extends FilterParams {
  projectId?: string;
  propertyType?: string;
  configuration?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minPlotSize?: number;
  maxPlotSize?: number;
  facing?: string;
}

export interface LeadFilters extends FilterParams {
  status?: LeadStatus;
  source?: string;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CustomerFilters extends FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}