# Truzon Platform — Complete Documentation

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [API Backend](#3-api-backend)
4. [Mobile App](#4-mobile-app)
5. [Web Apps](#5-web-apps)
6. [Shared Packages](#6-shared-packages)
7. [Database Schema](#7-database-schema)
8. [Environment Configuration](#8-environment-configuration)
9. [Development Guide](#9-development-guide)

---

## 1. Architecture Overview

Truzon is a **real estate management platform** built as a **pnpm + Turborepo monorepo**. It serves three user roles across multiple frontends sharing a single NestJS API backend.

### Platform Roles

| Role | Description | Primary Interface |
|------|-------------|-------------------|
| **Customer** | Home buyers browsing/scheduling/buying | Public website + Mobile app |
| **Channel Partner (CP)** | Real estate agents managing leads/commissions | Pro-CP portal + Mobile app (Pro mode) |
| **Admin** | Internal operations (CRM, CMS, sales, reports) | Admin dashboard + Mobile app (Admin mode) |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | pnpm 9.1.4 workspaces + Turborepo 1.13 |
| **API** | NestJS 10 (TypeScript, Express) |
| **Database** | PostgreSQL via Prisma 5.14 ORM |
| **Cache/Queue** | Redis (ioredis) + BullMQ |
| **Auth** | JWT (access + refresh tokens), Passport.js, optional 2FA |
| **Web Frontends** | Next.js 14 (React 18, Tailwind CSS 3.4, shadcn/ui) |
| **Mobile** | Expo 51 (React Native 0.74, Expo Router v3) |
| **State Mgmt** | Zustand (mobile), Redux Toolkit + RTK Query (admin, pro-cp), TanStack React Query |
| **Validation** | Zod schemas (shared `@truzon/validation`), class-validator (API DTOs) |

### Application Map

```
truzon/
├── apps/
│   ├── api/          # NestJS REST API backend (:3000)
│   ├── mobile/       # React Native / Expo mobile app
│   ├── admin/        # Admin dashboard (:3001, static export)
│   ├── pro-cp/       # Channel partner portal (:3002, SSR)
│   └── public-web/   # Public marketing site (:3003, SSR)
├── packages/
│   ├── types/        # Shared TypeScript type definitions
│   ├── validation/   # Shared Zod validation schemas
│   ├── ui/           # Shared React UI components
│   ├── api-client/   # RTK Query API client
│   └── config/       # Shared ESLint, Prettier, TypeScript, Tailwind configs
├── docker/           # Docker configurations
└── extra/            # Reference/legacy projects
```

---

## 2. Monorepo Structure

### Root Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in dev mode (Turborepo) |
| `pnpm build` | Build all apps (topological order) |
| `pnpm build:api` | Build API only |
| `pnpm build:web` | Build all 3 web apps |
| `pnpm typecheck` | Type-check all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run all tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm format` | Format with Prettier |

### Turborepo Pipeline

- **build**: Depends on `^build` (dependencies first), outputs `dist/`, `.next/`, `build/`
- **dev**: Persistent, no cache
- **typecheck**: Cached, no outputs
- **test**: Cached, outputs `coverage/`
- **Global cache-busting**: `DATABASE_URL`, `JWT_SECRET_KEY`, `NODE_ENV`, all `.env*` files

### Version Catalog

All dependency versions are centralized in `pnpm-workspace.yaml` using pnpm's `catalog:` feature. Individual packages reference `catalog:` instead of hardcoding versions.

---

## 3. API Backend

**Package:** `@truzon/api`
**Port:** 3000 (configurable)
**Base URL:** `/api/v1/`
**Swagger:** `/api/docs`

### Quick Start

```bash
# Prerequisites: PostgreSQL + Redis running
cd apps/api
cp .env.example .env          # Configure DATABASE_URL, JWT_SECRET, etc.
pnpm install
pnpm db:generate              # Generate Prisma client
pnpm db:push                  # Push schema to DB
pnpm db:seed                  # Seed initial data
pnpm dev                      # Start dev server with hot-reload
```

### Scripts

| Script | Command |
|--------|---------|
| `dev` | `nest start --watch` |
| `build` | `nest build` |
| `start` | `node dist/main` |
| `typecheck` | `tsc --noEmit` |
| `test` | `jest` |
| `test:e2e` | `jest --config ./test/jest-e2e.json` |
| `db:generate` | `prisma generate` |
| `db:push` | `prisma db push` |
| `db:migrate` | `prisma migrate dev` |
| `db:seed` | `ts-node prisma/seed.ts` |

### Module Architecture (36 modules)

```
src/modules/
├── auth/                    # Login, register, refresh, 2FA, OTP
├── users/                   # User CRUD, profile management
├── roles/                   # Role management (8 role types)
├── permissions/             # Fine-grained permission system
├── crm/
│   ├── leads/               # Lead lifecycle management
│   ├── customers/           # Customer records, KYC
│   ├── activities/          # Lead activity logging
│   ├── assignments/         # Lead reassignment
│   └── followups/           # Follow-up scheduling
├── properties/
│   ├── projects/            # Real estate projects
│   ├── properties/          # Property listings
│   └── inventory/           # Inventory units (villas, plots)
├── sales/
│   ├── enquiries/           # Customer enquiries
│   ├── site-visits/         # Site visit scheduling
│   ├── bookings/            # Booking management
│   ├── payments/            # Payment processing
│   └── agreements/          # Legal agreements
├── channel-partners/        # CP management, commissions
├── marketing/
│   └── campaigns/           # Marketing campaigns
├── cms/
│   ├── pages/               # CMS pages with block builder
│   ├── blogs/               # Blog posts
│   ├── media/               # Media file management
│   ├── menus/               # Navigation menus
│   ├── forms/               # Form submissions
│   ├── taxonomy/            # Categories & tags
│   ├── careers/             # Job listings
│   ├── gallery/             # Photo gallery
│   └── testimonials/        # Customer testimonials
├── settings/                # System settings with versioning
├── notifications/           # Multi-channel notifications
├── documents/               # Document management
├── reports/                 # Analytics & reports
├── audit/                   # Audit logging
├── mapping/                 # GIS/map management
├── health/                  # Health check endpoints
└── public/                  # Public-facing API
```

### Common Layer

```
src/common/
├── decorators/              # @CurrentUser, @Permissions, @Roles, @IpAddress
├── filters/                 # HttpExceptionFilter (global error formatting)
├── guards/                  # JwtAuthGuard, JwtRefreshGuard, PermissionsGuard, RolesGuard
├── interceptors/            # LoggingInterceptor, TransformInterceptor
└── utils/                   # Shared utilities
```

### Authentication Flow

1. **Login**: Email/password → JWT access token (15min) + refresh token (7 days, httpOnly cookie)
2. **Refresh**: Cookie-based refresh token → new access token
3. **2FA** (optional): TOTP-based two-factor authentication
4. **OTP**: Phone-based OTP for verification flows

### Role-Based Access Control

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system access |
| `ADMIN` | Administrative access |
| `MANAGER` | Team management |
| `SALES` | Sales operations |
| `CP` | Channel partner access |
| `CLIENT` | Customer access |
| `CONTENT_MANAGER` | CMS management |
| `FINANCE` | Financial operations |

Permissions are key-based (e.g., `lead.view`, `booking.create`) with scopes: `GLOBAL`, `PROJECT`, `OWNED`.

### Dependencies (key)

| Package | Purpose |
|---------|---------|
| `@nestjs/common/core` | NestJS framework |
| `@nestjs/swagger` | OpenAPI documentation |
| `@nestjs/jwt/passport` | JWT authentication |
| `@nestjs/bullmq` | Background job queue |
| `@nestjs/event-emitter` | Event-driven architecture |
| `@nestjs/terminus` | Health checks |
| `@prisma/client` | Database ORM |
| `helmet` | Security headers |
| `compression` | Gzip compression |
| `cookie-parser` | Refresh token cookies |
| `joi` | Environment validation |

---

## 4. Mobile App

**Package:** `@truzon/mobile`
**Framework:** Expo 51 + React Native 0.74
**Routing:** Expo Router v3 (file-based)

### Quick Start

```bash
cd apps/mobile
pnpm install
pnpm dev          # Starts Expo dev server
```

### Scripts

| Script | Command |
|--------|---------|
| `dev` | `expo start` |
| `build:android` | `eas build --platform android` |
| `build:ios` | `eas build --platform ios` |
| `typecheck` | `tsc --noEmit` |

### Dual-App Architecture

The mobile app serves **two distinct user experiences** from a single codebase:

#### Customer App (`(client)/` routes)
5 bottom tabs:
1. **Home** — Featured projects/properties, quick actions
2. **Explore** — Search & filter properties/projects
3. **Saved** — Bookmarked properties
4. **Alerts** — Notifications
5. **Profile** — User profile, settings, documents, bookings, payments

#### Channel Partner App (`(pro)/` routes)
7 bottom tabs:
1. **Dashboard** — Stats, charts, activity feed, upcoming visits
2. **Leads** — Full CRM pipeline (search, status/source filters)
3. **Customers** — Customer management
4. **Inventory** — Property inventory management
5. **Site Visits** — Visit scheduling & tracking
6. **Commissions** — Commission tracking (all/pending/paid)
7. **Profile** — Pro profile & settings

### Route Structure

```
src/app/
├── _layout.tsx                          # Root Stack (auth check, SafeAreaProvider)
├── index.tsx                            # Landing/splash
├── (auth)/
│   ├── login.tsx                        # Email/password login
│   ├── register.tsx                     # Registration (Zod + react-hook-form)
│   ├── otp.tsx                          # OTP verification (6-digit, resend)
│   ├── forgot-password.tsx              # Password recovery
│   └── reset-password.tsx               # New password
├── (client)/
│   ├── _layout.tsx                      # Client tab navigator
│   ├── index.tsx                        # Home
│   ├── explore/index.tsx                # Property search
│   ├── property/[id].tsx                # Property detail
│   ├── projects/[id].tsx                # Project detail
│   ├── saved/index.tsx                  # Saved properties
│   ├── notifications/index.tsx          # Notifications
│   ├── bookings/index.tsx               # Bookings & site visits
│   ├── payments/index.tsx               # Payment schedule & receipts
│   ├── documents/index.tsx              # Document vault
│   ├── enquiries/index.tsx              # My enquiries
│   ├── profile/index.tsx                # Profile
│   ├── settings/index.tsx               # Settings
│   ├── security/index.tsx               # Security & privacy
│   ├── security/change-password.tsx     # Change password
│   └── support/index.tsx                # Help & support
└── (pro)/
    ├── _layout.tsx                      # Pro tab navigator
    ├── index.tsx                        # Pro landing
    ├── dashboard/index.tsx              # Full dashboard
    ├── leads/index.tsx                  # Leads management
    ├── customers/index.tsx              # Customer management
    ├── bookings/index.tsx               # Bookings
    ├── site-visits/index.tsx            # Site visit scheduling
    ├── commissions/index.tsx            # Commission tracking
    ├── inventory/index.tsx              # Inventory management
    ├── reports/index.tsx                # Performance reports
    ├── notifications/index.tsx          # Pro notifications
    ├── profile/index.tsx                # Pro profile
    └── settings/index.tsx               # Pro settings
```

### State Management

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `authStore` | User auth, tokens, OTP flow | AsyncStorage (tokens, user) |
| `appStore` | Online status, dark mode | No |
| `notificationStore` | Notifications, unread count | No |

### Theme System

| Token | Values |
|-------|--------|
| **Colors** | primary (gold/amber), navy (dark blue), gray, success, error, warning |
| **Typography** | PlayfairDisplay (headings), WorkSans (body), sizes xs-5xl |
| **Spacing** | 0-24 scale (0-96px) |
| **Shadows** | 7 levels (none to xl) |
| **Dark Mode** | Full dark mode via `useTheme` hook |

### Key Components

**UI:** Button, Input, Card, Badge, Avatar, Select, Loading, Skeleton, StatCard, ChartCard
**Layout:** Header (with right/left actions), TabBar, EmptyState, BottomSheet, ActivityItem
**Feature:** PropertyCard, ProjectCard

### API Integration

- **Axios** client with automatic token refresh on 401
- **TanStack React Query** for server state (projects, properties)
- **Zustand** for client state (auth, app, notifications)
- Base URL: `EXPO_PUBLIC_API_URL` (default: `http://localhost:3000/api/v1`)

### Dependencies (key)

| Package | Purpose |
|---------|---------|
| `expo` 51 | Core SDK |
| `expo-router` 3 | File-based routing |
| `@react-navigation/bottom-tabs` | Tab navigation |
| `@tanstack/react-query` | Server state |
| `zustand` | Client state |
| `lucide-react-native` | Icons |
| `react-native-reanimated` | Animations |
| `expo-notifications` | Push notifications |
| `expo-secure-store` | Secure token storage |

---

## 5. Web Apps

### 5.1 Admin Dashboard (`@truzon/admin`)

**Port:** 3001 | **Rendering:** Static export | **State:** Redux + RTK Query + Zustand

#### Routes (6 active pages)

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/login` | Login |
| `/leads` | Lead management |
| `/customers` | Customer management |
| `/projects` | Project management |
| `/properties` | Property management |

#### Scaffolded Routes (24 more)
`agreements/`, `audit/`, `blogs/`, `bookings/`, `campaigns/`, `careers/`, `channel-partners/`, `dashboard/`, `enquiries/`, `forms/`, `gallery/`, `inventory/`, `mapping/`, `media/`, `menus/`, `pages/`, `payments/`, `reports/`, `settings/`, `site-visits/`, `taxonomy/`, `testimonials/`

#### Key Features
- **Drag & drop** via `@dnd-kit` (unique to admin)
- **Full RTK Query API** with ~50+ hooks covering all entities
- **shadcn/ui** compatible Tailwind config with HSL CSS variable colors
- **Static export** (`output: 'export'`) — no Node server at runtime

---

### 5.2 Channel Partner Portal (`@truzon/pro-cp`)

**Port:** 3002 | **Rendering:** Server-rendered (SSR) | **State:** Redux + RTK Query + React Query

#### Routes (2 active pages)

| Route | Description |
|-------|-------------|
| `/` | Landing/redirect |
| `/login` | Login |

#### Scaffolded Routes (`(dashboard)/` — 10 more)
`agreements/`, `bookings/`, `commissions/`, `customers/`, `dashboard/`, `documents/`, `leads/`, `payments/`, `reports/`, `site-visits/`

#### Key Features
- **Most complete API hooks** — ~100+ hooks (full CRUD + stats + actions for all entities)
- **Framer Motion** animations
- **Zod** validation
- **Server-rendered** (not static export)

---

### 5.3 Public Marketing Website (`@truzon/public-web`)

**Port:** 3003 | **Rendering:** Server-rendered (SSR) | **State:** React Query + Zustand (no Redux)

#### Routes (22 pages)

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSR | Home page with CMS-configurable sections |
| `/about` | Static | About page |
| `/blog` | Dynamic | Blog listing |
| `/blog/[slug]` | Dynamic | Blog post detail |
| `/careers` | Dynamic | Job listings |
| `/compare` | Static | Property comparison |
| `/contact` | Static | Contact form |
| `/faqs` | Static | FAQ page |
| `/gallery` | Dynamic | Photo gallery |
| `/investor-relations` | Static | Investor info |
| `/login` | Static | User login |
| `/my-account` | Static | User account |
| `/privacy-policy` | Static | Legal |
| `/projects` | Dynamic | Project listing |
| `/property/[id]` | Dynamic | Property detail |
| `/saved-properties` | Static | Bookmarked properties |
| `/services` | Static | Services |
| `/sitemap` | Static | HTML sitemap |
| `/support` | Static | Support |
| `/terms-of-service` | Static | Legal |
| `/testimonials` | Dynamic | Testimonials |
| `/track-enquiry` | Static | Enquiry tracking |

#### Feature Modules (`src/modules/`)

| Module | Key Components |
|--------|----------------|
| `content/` | Hero (image slideshow), CTA, FAQ, Stats, Testimonials, WhyChooseUs, LatestInsights, PageHero, CmsBlockRenderer |
| `properties/` | SignatureCollections, ExploreCategories, ProjectsGrid, PropertyDetailView, SavedPropertiesGrid, FavoritesContext, PropertySearchContext |
| `blog/` | BlogGrid |
| `leads/` | Visitor contact forms |
| `testimonials/` | TestimonialsPage |
| `careers/` | CareersPage |
| `gallery/` | GalleryPage |

#### Key Features
- **Full SEO** — OpenGraph, Twitter cards, robots.txt, dynamic sitemap.ts, manifest
- **Framer Motion** animations throughout
- **Storybook** for component development
- **CMS-driven** home page with lazy-loaded sections
- **Favorites/bookmarking** via FavoritesContext

---

### Cross-App Comparison

| Feature | Admin | Pro-CP | Public-Web |
|---------|-------|--------|-----------|
| Port | 3001 | 3002 | 3003 |
| Rendering | Static export | SSR | SSR |
| State | Redux + RTK Query | Redux + RTK Query + React Query | React Query + Zustand |
| Fonts | Inter | Inter + Playfair Display | Work Sans + Playfair Display |
| Drag & Drop | Yes | No | No |
| Animations | No | Yes (Framer Motion) | Yes (Framer Motion) |
| Storybook | No | No | Yes |
| SEO | Minimal | Moderate | Full (OG, Twitter, sitemap) |
| Active Pages | 6 | 2 | 22 |
| API Hooks | ~50+ | ~100+ | Module-specific |

---

## 6. Shared Packages

### `@truzon/types`
**Entry:** `src/index.ts` (1,294 lines)

Shared TypeScript type definitions for the entire platform:
- 26 enums (UserStatus, RoleType, LeadStatus, PropertyType, etc.)
- Core interfaces: User, Role, Permission
- CRM: Lead, LeadSource, LeadFollowUp, LeadActivity, LeadAssignment, Customer
- Properties: Project, Property, Villa, Plot, InventoryUnit, PropertyMedia
- Channel Partners: ChannelPartner, ChannelPartnerUser, Commission
- Sales: Enquiry, SiteVisit, Booking, Payment, Agreement
- CMS: Page, BlockDefinition, PageBlock, SeoMeta, BlogPost, Category, Tag, Media, Menu, MenuItem
- Settings, Notifications, Documents, Audit, Maps, Chat, Careers, Gallery, Testimonials
- API types: ApiResponse, PaginationMeta, ApiError
- Form types: LoginForm, RegisterForm, etc.

### `@truzon/validation`
**Entry:** `src/index.ts` (271 lines)

Zod validation schemas:
- **Auth:** loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema
- **CRM:** createLeadSchema, updateLeadSchema, assignLeadSchema, createFollowUpSchema
- **Customers:** createCustomerSchema, updateCustomerSchema
- **Properties:** createProjectSchema, updateProjectSchema, createPropertySchema, updatePropertySchema
- **Query:** paginationSchema, leadQuerySchema, propertyQuerySchema, projectQuerySchema

### `@truzon/ui`
**Entry:** `src/index.ts` (4 components)

Shared React components:
- **Button** — Variants (primary, secondary, outline, ghost, destructive, gold), sizes, loading state
- **Card** — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter (variant, padding)
- **Input** — Label, error state, helper text, accessibility (aria-invalid, aria-describedby)
- **DataTable** — Generic table with sorting, row selection, pagination, loading states, inline actions

### `@truzon/api-client`
**Entry:** `src/index.ts` (335 lines)

RTK Query API client:
- 42 endpoints covering all entities
- Auto-generated query/mutation hooks
- Tag types for cache invalidation
- Base URL from `NEXT_PUBLIC_API_URL`

### `@truzon/config`

Shared configuration files:

| File | Purpose |
|------|---------|
| `tailwind/base.js` | Base Tailwind config (primary/gold/navy colors, Playfair + Work Sans fonts) |
| `typescript/base.json` | Base TypeScript config (ES2022, strict, path aliases) |
| `typescript/nextjs.json` | Next.js TypeScript config |
| `typescript/react-library.json` | React library TypeScript config |
| `eslint/base.js` | ESLint config (recommended + TypeScript + Prettier) |
| `prettier/base.js` | Prettier config (single quotes, trailing commas, 100 width) |

---

## 7. Database Schema

### Overview
- **Database:** PostgreSQL
- **ORM:** Prisma 5.14
- **Models:** 44
- **Enums:** 16+

### Enums

| Enum | Values |
|------|--------|
| `UserStatus` | ACTIVE, INACTIVE, PENDING_VERIFICATION, SUSPENDED |
| `RoleType` | SUPER_ADMIN, ADMIN, MANAGER, SALES, CP, CLIENT, CONTENT_MANAGER, FINANCE |
| `PermissionScope` | GLOBAL, PROJECT, OWNED |
| `LeadStatus` | NEW, CONTACTED, INTERESTED, SITE_VISIT, NEGOTIATION, BOOKED, CONVERTED, LOST, NURTURE |
| `LeadSourceType` | WEBSITE, MOBILE_APP, GOOGLE_ADS, META_ADS, WHATSAPP, PHONE, MANUAL, PROPERTY_PORTAL, CHANNEL_PARTNER, CAMPAIGN, REFERRAL, WALK_IN, OTHER |
| `PropertyType` | VILLA, PLOT, APARTMENT, COMMERCIAL |
| `InventoryStatus` | AVAILABLE, HOLD, BOOKED, SOLD, BLOCKED |
| `BookingStatus` | PENDING, CONFIRMED, CANCELLED, EXPIRED, COMPLETED |
| `PaymentStatus` | PENDING, PARTIAL, COMPLETED, FAILED, REFUNDED, CANCELLED |
| `PaymentType` | BOOKING_AMOUNT, DOWN_PAYMENT, MILESTONE, FINAL, OTHER |
| `AgreementStatus` | DRAFT, PENDING_SIGNATURE, SIGNED, EXPIRED, CANCELLED |
| `PageType` | HOME, ABOUT, PROJECTS, BLOG, CONTACT, CUSTOM |
| `PageStatus` | DRAFT, SCHEDULED, PUBLISHED, UNPUBLISHED |
| `BlogStatus` | DRAFT, SCHEDULED, PUBLISHED |
| `MediaType` | IMAGE, VIDEO, DOCUMENT, OTHER |
| `NotificationType` | LEAD_ASSIGNED, LEAD_STATUS_CHANGED, FOLLOW_UP_REMINDER, SITE_VISIT_REMINDER, SITE_VISIT_SCHEDULED, BOOKING_UPDATE, PAYMENT_UPDATE, NEW_PROPERTY, NEW_PROJECT, ADMIN_ANNOUNCEMENT, SYSTEM_ALERT, COMMISSION_UPDATE, DOCUMENT_REQUEST, TASK_ASSIGNED |
| `CampaignStatus` | DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED |
| `SiteVisitStatus` | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED |
| `AuditAction` | CREATE, UPDATE, DELETE, RESTORE, ASSIGN, UNASSIGN, STATUS_CHANGE, PERMISSION_CHANGE, LOGIN, LOGOUT, EXPORT, IMPORT |
| `DocumentType` | KYC, AGREEMENT, PAYMENT_RECEIPT, FLOOR_PLAN, BROCHURE, PROJECT_IMAGE, PROPERTY_IMAGE, OTHER |

### Models (44)

#### Core Auth & RBAC
| Model | Key Fields |
|-------|-----------|
| **User** | id (UUID), email (unique), phone, passwordHash, fullName, avatarUrl, status, roleId, twoFactorEnabled, failedLoginAttempts, lockedUntil |
| **Role** | id, name (RoleType, unique), displayName, isSystem |
| **Permission** | id, key (unique, e.g. "lead.view"), name, module, action, scope |
| **RefreshToken** | id, token (unique), userId, deviceInfo, ipAddress, expiresAt, revokedAt |
| **AuthToken** | id, token (unique), userId, purpose, expiresAt, usedAt |

#### CRM
| Model | Key Fields |
|-------|-----------|
| **LeadSource** | name, type (LeadSourceType), isActive |
| **Lead** | name, phone, email, status, budgetMin/Max, requirement, sourceId, campaignId, projectId, assignedUserId, assignedCpId |
| **LeadFollowUp** | leadId, userId, type, scheduledAt, completedAt, outcome |
| **LeadActivity** | leadId, userId, type, description, metadata (JSON) |
| **LeadAssignment** | leadId, fromUserId, toUserId, fromCpId, toCpId, reason |
| **Customer** | leadId (unique, 1:1), firstName, lastName, email, phone, panNumber, aadhaarNumber, kycStatus |

#### Properties & Inventory
| Model | Key Fields |
|-------|-----------|
| **Project** | name, slug (unique), address, city, state, lat/lng, reraNumber, status, isActive, isFeatured |
| **Property** | projectId, name, slug, propertyType, configuration, facing, plotSize/builtUpArea/carpetArea, priceValue, bedrooms/bathrooms, amenities (JSON), specifications (JSON) |
| **Villa** | projectId, unitNumber, plotSize, builtUpArea, bedrooms/bathrooms, floors, priceValue, status |
| **Plot** | projectId, unitNumber, plotSize, facing, priceValue, cornerPlot, parkFacing, roadWidth, status |
| **InventoryUnit** | projectId, propertyId, villaId (unique), plotId (unique), unitType, unitNumber, status, priceValue, holdExpiresAt |
| **PropertyMedia** | propertyId, mediaId, type, position, isPrimary |

#### Channel Partners
| Model | Key Fields |
|-------|-----------|
| **ChannelPartner** | name, companyName, contactPerson, email (unique), phone, gstNumber, panNumber, bankAccount (JSON), commissionRate, status |
| **ChannelPartnerUser** | channelPartnerId, userId (unique), role (CP_ADMIN/CP_USER), isPrimary |
| **Commission** | channelPartnerId, leadId, bookingId, amount, rate, status, dueDate, paidAt |

#### Sales
| Model | Key Fields |
|-------|-----------|
| **Enquiry** | leadId, projectId, propertyId, userId, source, type, subject, message, response, status, priority |
| **SiteVisit** | leadId, projectId, propertyId, userId, scheduledAt, durationMinutes, status, feedback, transportNeeded |
| **Booking** | bookingNumber (unique), leadId, customerId, projectId, propertyId, inventoryUnitId, userId, cpId, bookingAmount, totalPrice, discount, taxAmount, status |
| **Payment** | paymentNumber (unique), bookingId, customerId, userId, amount, type, status, method, transactionId, receiptUrl |
| **Agreement** | agreementNumber (unique), bookingId, customerId, userId, templateId, documentId, status, signedAt, expiresAt |

#### CMS
| Model | Key Fields |
|-------|-----------|
| **Page** | pageType (unique), slug (unique), title, status, featuredImageId, seoId |
| **BlockDefinition** | key (unique), label, category, schema (JSON), defaultConfig (JSON) |
| **PageBlock** | pageId, blockDefinitionId, position (unique per page), config (JSON) |
| **SeoMeta** | seoTitle, metaDescription, keywords[], canonicalUrl, ogTitle/ogDescription/ogImageId, robots, schemaJsonLd |
| **BlogPost** | title, slug (unique), excerpt, body (Text), authorId, status, publishedAt, isFeatured, viewCount |
| **Category** | name, slug (unique), parentId (self-referencing), appliesTo[] |
| **Tag** | name, slug (unique), color |
| **Menu** | key (unique), label |
| **MenuItem** | menuId, parentId (self-referencing), label, href, isExternal, icon, position |

#### Media
| Model | Key Fields |
|-------|-----------|
| **Media** | fileName, fileKey (unique), url, mimeType, sizeBytes, width/height, type, folderId, uploadedById, storageProvider (GCS/R2/LOCAL), metadata (JSON) |
| **MediaFolder** | name, parentId (self-referencing), path (unique) |
| **MediaUsage** | mediaId, entityType, entityId, fieldName |

#### Other
| Model | Key Fields |
|-------|-----------|
| **FormSubmission** | formKey, name, phone, email, projectId, source, utmData (JSON), status |
| **Setting** | key (unique), value (JSON), group, isPublic |
| **Notification** | userId, type, title, message, data (JSON), channels[], isRead, priority |
| **Document** | name, type, fileId, entityType, entityId, uploadedById, status |
| **AuditLog** | userId, action, entityType, entityId, previousValue (JSON), newValue (JSON), ipAddress |
| **MapProject** | projectId (unique), name, centerLat/Lng, zoomLevel, bounds (JSON), isPublic |
| **MapLayer** | mapProjectId, name, type (POLYGON/POINT/LINE/GEOJSON), geojson (JSON) |
| **Career** | title, slug (unique), department, location, type, experienceMin/Max, salaryMin/Max |
| **GalleryItem** | title, mediaId, category, projectId, position, isActive |
| **Testimonial** | name, designation, company, content (Text), rating, mediaId, projectId |
| **RedirectRule** | fromPath (unique), toPath, statusCode, isActive, hits |
| **EntityVersion** | entityType, entityId, versionNumber (unique per entity), snapshot (JSON), changeNote |

### Design Patterns
- **Soft deletes** via `deletedAt` on major entities
- **Comprehensive indexing** on foreign keys and frequently queried fields
- **JSON columns** for flexible data (amenities, specifications, metadata, geojson)
- **Self-referencing** hierarchies (categories, menu items, media folders)
- **Polymorphic associations** via `entityType`/`entityId` (documents, audit, media usage)

---

## 8. Environment Configuration

### API (.env.example)

```env
# App
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/truzon?schema=public"

# JWT
JWT_SECRET_KEY="your-super-secret-jwt-key-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# CORS
CORS_ORIGINS="http://localhost:3001,http://localhost:3002,http://localhost:3003"

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Storage (LOCAL, GCS, or R2)
STORAGE_PROVIDER=LOCAL

# Frontend URLs
ADMIN_URL=http://localhost:3001
PUBLIC_URL=http://localhost:3003
PRO_CP_URL=http://localhost:3002

# Feature Flags
ENABLE_2FA=false
ENABLE_PUBLIC_API=true
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Web Apps (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://www.truzonhomes.com
```

---

## 9. Development Guide

### Getting Started

```bash
# 1. Clone and install
git clone <repo-url> truzon
cd truzon
pnpm install

# 2. Start infrastructure (Docker)
docker-compose up -d postgres redis

# 3. Setup database
cd apps/api
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Start all apps
cd ../..
pnpm dev
```

### Individual App Development

```bash
# API (port 3000)
cd apps/api && pnpm dev

# Admin (port 3001)
cd apps/admin && pnpm dev

# Pro-CP (port 3002)
cd apps/pro-cp && pnpm dev

# Public Web (port 3003)
cd apps/public-web && pnpm dev

# Mobile (Expo)
cd apps/mobile && pnpm dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm typecheck` | Type-check all apps |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run all tests |
| `pnpm format` | Format with Prettier |
| `pnpm db:studio` | Open Prisma Studio |

### Project Conventions

- **TypeScript strict mode** across all apps
- **Path aliases:** `@/*` → `src/*`, `@truzon/*` → shared packages
- **React functional components** with hooks
- **NestJS modules** with service/controller pattern
- **Zod** for client-side validation, **class-validator** for API DTOs
- **Tailwind CSS** for styling (shared base config)
- **ESLint + Prettier** for code quality

---

*Documentation generated for the Truzon real estate platform monorepo.*
