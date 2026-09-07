import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// Lead schemas
export const createLeadSchema = z.object({
  sourceId: z.string().uuid('Invalid source ID'),
  campaignId: z.string().uuid('Invalid campaign ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  propertyId: z.string().uuid('Invalid property ID').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().max(200, 'Location too long').optional(),
  budgetMin: z.number().positive('Budget must be positive').optional(),
  budgetMax: z.number().positive('Budget must be positive').optional(),
  requirement: z.string().max(1000, 'Requirement too long').optional(),
});

export const updateLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().max(200, 'Location too long').optional(),
  budgetMin: z.number().positive('Budget must be positive').optional(),
  budgetMax: z.number().positive('Budget must be positive').optional(),
  requirement: z.string().max(1000, 'Requirement too long').optional(),
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'CONVERTED', 'LOST', 'NURTURE']).optional(),
  lostReason: z.string().max(500, 'Reason too long').optional(),
  assignedUserId: z.string().uuid('Invalid user ID').optional(),
  assignedCpId: z.string().uuid('Invalid CP ID').optional(),
  nextFollowUpAt: z.string().datetime('Invalid date format').optional(),
});

export const assignLeadSchema = z.object({
  toUserId: z.string().uuid('Invalid user ID').optional(),
  toCpId: z.string().uuid('Invalid CP ID').optional(),
  reason: z.string().max(500, 'Reason too long').optional(),
});

export const createFollowUpSchema = z.object({
  type: z.enum(['CALL', 'MEETING', 'EMAIL', 'WHATSAPP', 'SITE_VISIT', 'OTHER']),
  subject: z.string().max(200, 'Subject too long').optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  scheduledAt: z.string().datetime('Invalid date format'),
  outcome: z.enum(['INTERESTED', 'NOT_INTERESTED', 'CALLBACK', 'MEETING_SCHEDULED', 'SITE_VISIT_SCHEDULED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'OTHER']).optional(),
});

export const updateFollowUpSchema = z.object({
  type: z.enum(['CALL', 'MEETING', 'EMAIL', 'WHATSAPP', 'SITE_VISIT', 'OTHER']).optional(),
  subject: z.string().max(200, 'Subject too long').optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  scheduledAt: z.string().datetime('Invalid date format').optional(),
  outcome: z.enum(['INTERESTED', 'NOT_INTERESTED', 'CALLBACK', 'MEETING_SCHEDULED', 'SITE_VISIT_SCHEDULED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'OTHER']).optional(),
  completedAt: z.string().datetime('Invalid date format').optional(),
});

// Customer schemas
export const createCustomerSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  alternatePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  dateOfBirth: z.string().datetime('Invalid date format').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().max(500, 'Address too long').optional(),
  city: z.string().max(100, 'City too long').optional(),
  state: z.string().max(100, 'State too long').optional(),
  pincode: z.string().max(20, 'Pincode too long').optional(),
  country: z.string().max(100, 'Country too long').optional().default('India'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Invalid Aadhaar format').optional(),
  occupation: z.string().max(100, 'Occupation too long').optional(),
  annualIncome: z.number().positive('Income must be positive').optional(),
});

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  alternatePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  address: z.string().max(500, 'Address too long').optional(),
  city: z.string().max(100, 'City too long').optional(),
  state: z.string().max(100, 'State too long').optional(),
  pincode: z.string().max(20, 'Pincode too long').optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Invalid Aadhaar format').optional(),
  occupation: z.string().max(100, 'Occupation too long').optional(),
  annualIncome: z.number().positive('Income must be positive').optional(),
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  slug: z.string().max(100, 'Slug too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  tagline: z.string().max(200, 'Tagline too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  state: z.string().min(1, 'State is required').max(100, 'State too long'),
  pincode: z.string().max(20, 'Pincode too long').optional(),
  country: z.string().max(100, 'Country too long').optional().default('India'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  reraNumber: z.string().max(50, 'RERA number too long').optional(),
  possessionDate: z.string().datetime('Invalid date format').optional(),
  launchDate: z.string().datetime('Invalid date format').optional(),
  status: z.enum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED']).optional().default('UPCOMING'),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).optional().default(0),
  featuredImageId: z.string().uuid('Invalid media ID').optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  tagline: z.string().max(200, 'Tagline too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City too long').optional(),
  state: z.string().min(1, 'State is required').max(100, 'State too long').optional(),
  pincode: z.string().max(20, 'Pincode too long').optional(),
  country: z.string().max(100, 'Country too long').optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  reraNumber: z.string().max(50, 'RERA number too long').optional(),
  possessionDate: z.string().datetime('Invalid date format').optional(),
  launchDate: z.string().datetime('Invalid date format').optional(),
  status: z.enum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  featuredImageId: z.string().uuid('Invalid media ID').optional(),
});

// Property schemas
export const createPropertySchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  slug: z.string().max(255, 'Slug too long').optional(),
  propertyType: z.enum(['VILLA', 'PLOT', 'APARTMENT', 'COMMERCIAL']),
  description: z.string().max(5000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  configuration: z.string().max(100, 'Configuration too long').optional(),
  facing: z.string().max(50, 'Facing too long').optional(),
  plotSize: z.number().positive('Plot size must be positive').optional(),
  builtUpArea: z.number().positive('Built-up area must be positive').optional(),
  carpetArea: z.number().positive('Carpet area must be positive').optional(),
  priceDisplay: z.string().max(100, 'Price display too long').optional(),
  priceValue: z.number().positive('Price must be positive').optional(),
  pricePerSqft: z.number().positive('Price per sqft must be positive').optional(),
  budgetBracket: z.enum(['under2', '2to5', '5to10', '10plus']).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  balconies: z.number().int().min(0).max(20).optional(),
  floorNumber: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  specifications: z.record(z.unknown()).optional(),
  isSignature: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
  tagText: z.string().max(50, 'Tag text too long').optional(),
  statusText: z.string().max(50, 'Status text too long').optional(),
  featuredImageId: z.string().uuid('Invalid media ID').optional(),
  brochureMediaId: z.string().uuid('Invalid media ID').optional(),
  categoryIds: z.array(z.string().uuid('Invalid category ID')).optional(),
});

export const updatePropertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long').optional(),
  description: z.string().max(5000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  configuration: z.string().max(100, 'Configuration too long').optional(),
  facing: z.string().max(50, 'Facing too long').optional(),
  plotSize: z.number().positive('Plot size must be positive').optional(),
  builtUpArea: z.number().positive('Built-up area must be positive').optional(),
  carpetArea: z.number().positive('Carpet area must be positive').optional(),
  priceDisplay: z.string().max(100, 'Price display too long').optional(),
  priceValue: z.number().positive('Price must be positive').optional(),
  pricePerSqft: z.number().positive('Price per sqft must be positive').optional(),
  budgetBracket: z.enum(['under2', '2to5', '5to10', '10plus']).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  balconies: z.number().int().min(0).max(20).optional(),
  floorNumber: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  specifications: z.record(z.unknown()).optional(),
  isSignature: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  tagText: z.string().max(50, 'Tag text too long').optional(),
  statusText: z.string().max(50, 'Status text too long').optional(),
  featuredImageId: z.string().uuid('Invalid media ID').optional(),
  brochureMediaId: z.string().uuid('Invalid media ID').optional(),
  categoryIds: z.array(z.string().uuid('Invalid category ID')).optional(),
});

// Common query schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const leadQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'CONVERTED', 'LOST', 'NURTURE']).optional(),
  sourceId: z.string().uuid('Invalid source ID').optional(),
  campaignId: z.string().uuid('Invalid campaign ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  propertyId: z.string().uuid('Invalid property ID').optional(),
  assignedUserId: z.string().uuid('Invalid user ID').optional(),
  assignedCpId: z.string().uuid('Invalid CP ID').optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const propertyQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  propertyType: z.enum(['VILLA', 'PLOT', 'APARTMENT', 'COMMERCIAL']).optional(),
  city: z.string().optional(),
  budgetBracket: z.enum(['under2', '2to5', '5to10', '10plus']).optional(),
  isSignature: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const projectQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['UPCOMING', 'LAUNCHED', 'ONGOING', 'COMPLETED']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Mapping / GIS schemas
export const createMapProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  mapProviderType: z.enum(['openstreetmap', 'mapbox', 'google', 'custom']).optional().default('openstreetmap'),
  centerLat: z.number().min(-90).max(90).optional(),
  centerLng: z.number().min(-180).max(180).optional(),
  zoomLevel: z.number().int().min(1).max(22).optional().default(12),
  bounds: z.array(z.array(z.number())).optional(),
  isPublic: z.boolean().optional().default(true),
});

export const updateMapProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  mapProviderType: z.enum(['openstreetmap', 'mapbox', 'google', 'custom']).optional(),
  centerLat: z.number().min(-90).max(90).optional(),
  centerLng: z.number().min(-180).max(180).optional(),
  zoomLevel: z.number().int().min(1).max(22).optional(),
  bounds: z.array(z.array(z.number())).optional(),
  isPublic: z.boolean().optional(),
});

export const createMapLayerSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100, 'Label too long'),
  geojson: z.record(z.unknown()).refine(
    (val) => val.type === 'FeatureCollection' && Array.isArray(val.features),
    { message: 'GeoJSON must be a valid FeatureCollection' }
  ),
  strokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().default('#3388ff'),
  fillColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().default('#3388ff'),
  fillOpacity: z.number().min(0).max(1).optional().default(0.4),
  strokeWeight: z.number().int().min(1).max(10).optional().default(2),
  strokeStyle: z.enum(['solid', 'dashed', 'dotted']).optional().default('solid'),
  defaultVisible: z.boolean().optional().default(true),
  colorRules: z.array(z.record(z.unknown())).optional(),
  labelProperty: z.string().optional(),
  labelAlignment: z.enum(['top', 'center', 'bottom', 'left', 'right']).optional().default('center'),
  popupEnabled: z.boolean().optional().default(true),
  popupProperties: z.record(z.unknown()).optional(),
  position: z.number().int().min(0).optional().default(0),
});

export const updateMapLayerSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100, 'Label too long').optional(),
  geojson: z.record(z.unknown()).optional(),
  strokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  fillColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  fillOpacity: z.number().min(0).max(1).optional(),
  strokeWeight: z.number().int().min(1).max(10).optional(),
  strokeStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  defaultVisible: z.boolean().optional(),
  colorRules: z.array(z.record(z.unknown())).optional(),
  labelProperty: z.string().optional(),
  labelAlignment: z.enum(['top', 'center', 'bottom', 'left', 'right']).optional(),
  popupEnabled: z.boolean().optional(),
  popupProperties: z.record(z.unknown()).optional(),
  position: z.number().int().min(0).optional(),
});

export const reorderMapLayersSchema = z.object({
  layerIds: z.array(z.string().uuid('Invalid layer ID')).min(1, 'At least one layer ID required'),
});

export const createMapShareLinkSchema = z.object({
  password: z.string().min(4, 'Password must be at least 4 characters').max(50, 'Password too long').optional(),
  expiresAt: z.string().datetime('Invalid date format').optional(),
  maxViews: z.number().int().positive('Max views must be positive').optional(),
});

export const updateMapShareLinkSchema = z.object({
  isActive: z.boolean().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters').max(50, 'Password too long').optional(),
  expiresAt: z.string().datetime('Invalid date format').optional(),
  maxViews: z.number().int().positive('Max views must be positive').optional(),
});

export const mapProjectQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  mapProviderType: z.enum(['openstreetmap', 'mapbox', 'google', 'custom']).optional(),
  isPublic: z.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const shareMapAccessSchema = z.object({
  password: z.string().optional(),
});

