# Truzon Migration Plan: FastAPI → NestJS Monorepo

## Executive Summary

Migrate from **two separate Next.js apps + FastAPI backend** to a **unified Turborepo monorepo** with **NestJS + Prisma** backend serving **5 applications**.

---

## Current State Inventory

### Backend (CMS-main/backend) — FastAPI + SQLAlchemy
- **Models**: 34 models (User, Role, Permission, Page, PageBlock, BlogPost, Property, Media, Menu, FormSubmission, Setting, SEO, AuditLog, Notification, Category, Tag, GalleryItem, Testimonial, Career, Map entities, Chat entities)
- **Modules**: 25+ API modules (auth, users, roles, pages, media, blog, properties, careers, gallery, testimonials, mapping, crm, taxonomy, menus, forms, settings, seo, audit_logs, notifications, search, trash, dashboard, public)
- **Auth**: JWT access + rotating refresh tokens (httpOnly cookies), RBAC with 5 roles, 50+ permissions
- **Storage**: Local disk / Cloudflare R2 / GCS adapters
- **Public API**: 18 endpoints under `/public/*` (pages, blog, properties, careers, gallery, testimonials, menus, settings, sitemap, robots.txt, categories, mapping, forms, chat)

### Admin Frontend (CMS-main/frontend) — Next.js 16
- **Routes**: 20+ dashboard pages (users, roles, pages editor, media, blog, properties, menus, forms, settings, seo, audit-logs, trash, dashboard, categories, tags, gallery, testimonials, careers, mapping, crm)
- **Features**: Block builder (18 block types), drag-drop, version history, SEO panel, media picker
- **State**: TanStack Query + Zustand

### Public Website (WebPage-main) — Next.js 16
- **Routes**: 18 pages (home, projects, property/[id], blog, blog/[slug], about, contact, gallery, careers, faqs, compare, saved-properties, etc.)
- **CMS Integration**: `lib/cms-client.ts` → 8 API modules calling `/public/*`
- **Static Fallbacks**: `lib/constants/` for content not yet CMS-driven

---

## Target Architecture

```
truzon/
├── apps/
│   ├── api/                 # NestJS backend
│   ├── public-web/          # Next.js public site
│   ├── admin/               # Next.js admin dashboard
│   ├── pro-cp/              # Next.js Pro/CP app
│   └── mobile/              # React Native (Expo)
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── api-client/          # Generated API client (Orval/openapi-typescript)
│   ├── validation/          # Shared Zod schemas
│   ├── ui/                  # Shared React components
│   └── config/              # Shared ESLint, TS, Tailwind configs
├── infrastructure/
│   ├── docker/
│   └── terraform/
└── turbo.json
```

---

## Database Migration: SQLAlchemy → Prisma

### Model Mapping (34 SQLAlchemy → Prisma)

| SQLAlchemy Model | Prisma Model | Notes |
|------------------|--------------|-------|
| User | User | Add `twoFactorEnabled`, `twoFactorSecret` |
| Role | Role | |
| Permission | Permission | |
| role_permission | RolePermission (join) | |
| RefreshToken | RefreshToken | |
| AuthToken | AuthToken | Email verification, password reset |
| Page | Page | `pageType` enum (5 fixed) |
| PageBlock | PageBlock | JSON config |
| BlockDefinition | BlockDefinition | 18 types |
| SeoMeta | SeoMeta | |
| EntityVersion | EntityVersion | Version history |
| Media | Media | Soft delete |
| MediaFolder | MediaFolder | Self-referential |
| MediaUsage | MediaUsage | Polymorphic via `entityType` |
| Category | Category | `appliesTo` enum |
| Tag | Tag | |
| BlogPost | BlogPost | M2M with Category, Tag |
| blog_post_category | BlogPostCategory | |
| blog_post_tag | BlogPostTag | |
| Property | Property | M2M with Category |
| property_category | PropertyCategory | |
| PropertyMedia | PropertyMedia | Gallery |
| Menu | Menu | |
| MenuItem | MenuItem | Self-referential tree |
| FormSubmission | FormSubmission | |
| Setting | Setting | Key-value with versioning |
| RedirectRule | RedirectRule | |
| Notification | Notification | |
| AuditLog | AuditLog | |
| MapProject | MapProject | |
| MapLayer | MapLayer | GeoJSON |
| MapShareLink | MapShareLink | |
| MapProviderConfig | MapProviderConfig | |
| ChatConversation | ChatConversation | |
| ChatMessage | ChatMessage | |
| Career | Career | |
| GalleryItem | GalleryItem | |
| Testimonial | Testimonial | |

### New Models for Target Spec (Not in Current)

| Model | Purpose |
|-------|---------|
| Lead | CRM lead management |
| LeadSource | Lead source tracking |
| LeadStatus | Lead lifecycle status |
| LeadActivity | Lead activity history |
| LeadFollowUp | Follow-up scheduling |
| LeadAssignment | Lead assignment to users/CP |
| Customer | Customer management |
| Project | Project container |
| Villa | Villa inventory |
| Plot | Plot inventory |
| InventoryUnit | Unified inventory |
| ChannelPartner | CP management |
| ChannelPartnerUser | CP users |
| Commission | Commission tracking |
| Enquiry | Sales enquiries |
| SiteVisit | Site visit scheduling |
| Booking | Booking management |
| Payment | Payment tracking |
| Agreement | Agreement documents |
| Campaign | Marketing campaigns |
| CampaignSource | Campaign sources |
| Document | Document management |

---

## API Migration: FastAPI → NestJS

### Current Endpoints → Target Modules

| Current Module | NestJS Module | Endpoints |
|----------------|---------------|-----------|
| auth | AuthModule | login, refresh, logout, forgot/reset password, email verification |
| users | UsersModule | CRUD, avatar |
| roles | RolesModule | CRUD, permission matrix |
| pages | PagesModule | CRUD, blocks, versions, publish/schedule |
| media | MediaModule | Upload, folders, usage, picker |
| blog | BlogModule | CRUD, categories, tags, publish/schedule |
| properties | PropertiesModule | CRUD, gallery, categories |
| menus | MenusModule | Tree CRUD |
| forms | FormsModule | Submissions list/export |
| settings | SettingsModule | Key-value, versioning, SMTP |
| seo | SeoModule | Redirects, metadata |
| taxonomy | TaxonomyModule | Categories, tags |
| careers | CareersModule | CRUD |
| gallery | GalleryModule | CRUD |
| testimonials | TestimonialsModule | CRUD |
| mapping | MappingModule | Projects, layers, share links |
| crm | CrmModule | Chat conversations/messages |
| audit_logs | AuditModule | List, export |
| notifications | NotificationsModule | List, mark read |
| search | SearchModule | Global search |
| trash | TrashModule | List, restore, permanent delete |
| dashboard | DashboardModule | Stats aggregation |
| public | PublicModule | 18 public endpoints |

### New Modules for Target Spec

| Module | Purpose |
|--------|---------|
| LeadsModule | Lead lifecycle, sources, assignment, follow-ups |
| CustomersModule | Customer management |
| ProjectsModule | Project CRUD |
| VillasModule / PlotsModule | Inventory units |
| BookingsModule | Booking workflow |
| PaymentsModule | Payment tracking |
| AgreementsModule | Agreement management |
| ChannelPartnersModule | CP management, commissions |
| CampaignsModule | Marketing campaigns |
| DocumentsModule | Document management |
| ReportsModule | Analytics/reporting APIs |
| AnalyticsModule | Event tracking |

---

## Frontend Migration

### Admin Dashboard (CMS-main/frontend → apps/admin)
- **Keep**: All 20+ pages, block builder, components, TanStack Query + Zustand
- **Adapt**: API client → generated from NestJS OpenAPI
- **Enhance**: Add Pro/CP, Leads, Bookings, Payments, Reports pages

### Public Website (WebPage-main → apps/public-web)
- **Keep**: All 18 pages, components, ISR/SSR patterns, SEO metadata
- **Adapt**: API client → generated from NestJS OpenAPI
- **Enhance**: Wire all static constants to CMS-driven content

### Pro/CP App (New → apps/pro-cp)
- **Build**: Dashboard, Leads, Customers, Properties, Enquiries, Site Visits, Bookings, Payments, Commissions, Documents, Reports
- **Auth**: Role-based (SALES, CP, MANAGER)

### Mobile App (New → apps/mobile)
- **Shared**: Types, API client, services, hooks, store, components
- **Role-based navigation**: CLIENT vs PRO/CP
- **Push notifications**: FCM + APNs

---

## Phase-by-Phase Migration Plan

### Phase 1: Foundation (Weeks 1-3)
1. **Monorepo Setup**
   - Initialize Turborepo + pnpm
   - Shared configs (TypeScript, ESLint, Prettier, Tailwind)
   - GitHub Actions CI

2. **NestJS Backend Scaffold**
   - Prisma schema (all 34 current + 18 new models)
   - PostgreSQL + Redis (Docker Compose)
   - Module structure per spec
   - Swagger/OpenAPI config

3. **Auth Module**
   - JWT access + rotating refresh (httpOnly cookies)
   - Email/password + OTP
   - Password reset, email verification
   - Device/session management

4. **Users/Roles/Permissions Modules**
   - Seed 8 roles + 50+ permissions
   - RBAC guards (`@RequirePermissions()`)

5. **Shared Packages**
   - `types`: All DTOs, enums, entities
   - `api-client`: Generated from OpenAPI
   - `validation`: Zod schemas
   - `ui`: shadcn/ui primitives
   - `config`: Shared tooling configs

### Phase 2: CRM Core (Weeks 3-5)
- LeadsModule (full lifecycle, sources, assignment, follow-ups, activities)
- CustomersModule
- Lead assignment rules, notifications

### Phase 3: Properties & Inventory (Weeks 5-7)
- ProjectsModule, PropertiesModule (unified)
- VillasModule, PlotsModule, InventoryModule
- Availability, pricing, media, documents
- Double-booking prevention (DB constraints + transactions)

### Phase 4: Sales Pipeline (Weeks 7-9)
- EnquiriesModule, SiteVisitsModule, BookingsModule
- PaymentsModule, AgreementsModule
- Booking → Payment → Agreement workflow

### Phase 5: Admin Dashboard (Weeks 9-12)
- Migrate CMS-main/frontend → apps/admin
- Add new CRM/Sales pages
- Generated API client integration

### Phase 6: Pro/CP App (Weeks 12-14)
- Build apps/pro-cp from scratch
- Role-based dashboards

### Phase 7: Public Website (Weeks 14-16)
- Migrate WebPage-main → apps/public-web
- Wire all static content to CMS
- SEO optimization (sitemap, robots, structured data)

### Phase 8: Mobile App (Weeks 16-20)
- Expo React Native scaffold
- Shared packages integration
- Role-based navigation
- Push notifications (FCM/APNs)

### Phase 9: Notifications & Comms (Weeks 20-22)
- Email (SendGrid/SES), WhatsApp (Twilio), SMS
- In-app notifications, push
- BullMQ background jobs

### Phase 10: Analytics & Hardening (Weeks 22-24)
- ReportsModule, AnalyticsModule
- Caching (Redis), query optimization
- Monitoring (Sentry, Prometheus/Grafana)
- Security audit, penetration testing
- Load testing
- Google Cloud deployment (Cloud Run, Cloud SQL, Memorystore, Cloud Storage)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data migration | Prisma migrate + custom scripts; run in staging first |
| API breaking changes | Generate client from OpenAPI; version `/api/v1/` |
| Frontend rewrite effort | Reuse components; adapt API layer only |
| Dual-run during migration | Feature flags; run both backends in parallel |
| Team learning curve | Pair programming; documentation; incremental phases |

---

## Success Criteria per Phase

| Phase | Criteria |
|-------|----------|
| 1 | `pnpm dev` starts all apps; auth works; Swagger loads; tests pass |
| 2 | Lead CRUD + assignment + follow-ups work end-to-end |
| 3 | Property CRUD + gallery + availability works; no double-book |
| 4 | Booking → Payment → Agreement flow works |
| 5 | Admin manages all content; block builder works |
| 6 | Pro/CP users manage leads/bookings/commissions |
| 7 | Public site renders from CMS; SEO scores >90 |
| 8 | Mobile builds for iOS/Android; push works |
| 9 | Notifications deliver across channels |
| 10 | Production deployment on GCP; monitoring active |

---

## Next Steps

1. **Immediate**: Create monorepo structure, Prisma schema, NestJS scaffold
2. **Week 1**: Auth + Users/Roles/Permissions + shared packages
3. **Week 2**: CRM modules + API client generation
4. **Week 3**: Begin frontend migrations in parallel

---

*This plan will be updated as implementation progresses.*