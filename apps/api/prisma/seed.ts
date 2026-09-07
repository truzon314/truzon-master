import { PrismaClient, RoleType, PermissionScope, LeadStatus, LeadSourceType, PropertyType, InventoryStatus, PageType, PageStatus, BlogStatus, MediaType, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // PERMISSIONS
  // ============================================
  const permissions = [
    // Auth
    { key: 'auth.login', name: 'Login', module: 'auth', action: 'login', scope: PermissionScope.GLOBAL },
    { key: 'auth.logout', name: 'Logout', module: 'auth', action: 'logout', scope: PermissionScope.GLOBAL },
    { key: 'auth.refresh', name: 'Refresh Token', module: 'auth', action: 'refresh', scope: PermissionScope.GLOBAL },
    { key: 'auth.reset_password', name: 'Reset Password', module: 'auth', action: 'reset_password', scope: PermissionScope.GLOBAL },
    { key: 'auth.verify_email', name: 'Verify Email', module: 'auth', action: 'verify_email', scope: PermissionScope.GLOBAL },

    // Users
    { key: 'user.view', name: 'View Users', module: 'users', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'user.create', name: 'Create Users', module: 'users', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'user.update', name: 'Update Users', module: 'users', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'user.delete', name: 'Delete Users', module: 'users', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'user.manage_roles', name: 'Manage User Roles', module: 'users', action: 'manage_roles', scope: PermissionScope.GLOBAL },

    // Roles & Permissions
    { key: 'role.view', name: 'View Roles', module: 'roles', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'role.create', name: 'Create Roles', module: 'roles', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'role.update', name: 'Update Roles', module: 'roles', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'role.delete', name: 'Delete Roles', module: 'roles', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'permission.view', name: 'View Permissions', module: 'permissions', action: 'view', scope: PermissionScope.GLOBAL },

    // Leads
    { key: 'lead.view', name: 'View Leads', module: 'leads', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'lead.create', name: 'Create Leads', module: 'leads', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'lead.update', name: 'Update Leads', module: 'leads', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'lead.delete', name: 'Delete Leads', module: 'leads', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'lead.assign', name: 'Assign Leads', module: 'leads', action: 'assign', scope: PermissionScope.GLOBAL },
    { key: 'lead.export', name: 'Export Leads', module: 'leads', action: 'export', scope: PermissionScope.GLOBAL },

    // Customers
    { key: 'customer.view', name: 'View Customers', module: 'customers', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'customer.create', name: 'Create Customers', module: 'customers', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'customer.update', name: 'Update Customers', module: 'customers', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'customer.delete', name: 'Delete Customers', module: 'customers', action: 'delete', scope: PermissionScope.GLOBAL },

    // Projects
    { key: 'project.view', name: 'View Projects', module: 'projects', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'project.create', name: 'Create Projects', module: 'projects', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'project.update', name: 'Update Projects', module: 'projects', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'project.delete', name: 'Delete Projects', module: 'projects', action: 'delete', scope: PermissionScope.GLOBAL },

    // Properties
    { key: 'property.view', name: 'View Properties', module: 'properties', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'property.create', name: 'Create Properties', module: 'properties', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'property.update', name: 'Update Properties', module: 'properties', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'property.delete', name: 'Delete Properties', module: 'properties', action: 'delete', scope: PermissionScope.GLOBAL },

    // Inventory
    { key: 'inventory.view', name: 'View Inventory', module: 'inventory', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'inventory.update', name: 'Update Inventory', module: 'inventory', action: 'update', scope: PermissionScope.GLOBAL },

    // Sales
    { key: 'enquiry.view', name: 'View Enquiries', module: 'enquiries', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'enquiry.create', name: 'Create Enquiries', module: 'enquiries', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'enquiry.update', name: 'Update Enquiries', module: 'enquiries', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'site_visit.view', name: 'View Site Visits', module: 'site_visits', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'site_visit.create', name: 'Create Site Visits', module: 'site_visits', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'site_visit.update', name: 'Update Site Visits', module: 'site_visits', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'booking.view', name: 'View Bookings', module: 'bookings', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'booking.create', name: 'Create Bookings', module: 'bookings', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'booking.update', name: 'Update Bookings', module: 'bookings', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'payment.view', name: 'View Payments', module: 'payments', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'payment.create', name: 'Create Payments', module: 'payments', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'payment.verify', name: 'Verify Payments', module: 'payments', action: 'verify', scope: PermissionScope.GLOBAL },
    { key: 'agreement.view', name: 'View Agreements', module: 'agreements', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'agreement.create', name: 'Create Agreements', module: 'agreements', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'agreement.update', name: 'Update Agreements', module: 'agreements', action: 'update', scope: PermissionScope.GLOBAL },

    // Channel Partners
    { key: 'channel_partner.view', name: 'View Channel Partners', module: 'channel_partners', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'channel_partner.create', name: 'Create Channel Partners', module: 'channel_partners', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'channel_partner.update', name: 'Update Channel Partners', module: 'channel_partners', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'channel_partner.delete', name: 'Delete Channel Partners', module: 'channel_partners', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'commission.view', name: 'View Commissions', module: 'commissions', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'commission.create', name: 'Create Commissions', module: 'commissions', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'commission.approve', name: 'Approve Commissions', module: 'commissions', action: 'approve', scope: PermissionScope.GLOBAL },
    { key: 'commission.pay', name: 'Pay Commissions', module: 'commissions', action: 'pay', scope: PermissionScope.GLOBAL },

    // Marketing
    { key: 'campaign.view', name: 'View Campaigns', module: 'campaigns', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'campaign.create', name: 'Create Campaigns', module: 'campaigns', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'campaign.update', name: 'Update Campaigns', module: 'campaigns', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'campaign.delete', name: 'Delete Campaigns', module: 'campaigns', action: 'delete', scope: PermissionScope.GLOBAL },

    // CMS
    { key: 'page.view', name: 'View Pages', module: 'pages', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'page.create', name: 'Create Pages', module: 'pages', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'page.update', name: 'Update Pages', module: 'pages', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'page.delete', name: 'Delete Pages', module: 'pages', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'page.publish', name: 'Publish Pages', module: 'pages', action: 'publish', scope: PermissionScope.GLOBAL },
    { key: 'blog.view', name: 'View Blogs', module: 'blogs', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'blog.create', name: 'Create Blogs', module: 'blogs', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'blog.update', name: 'Update Blogs', module: 'blogs', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'blog.delete', name: 'Delete Blogs', module: 'blogs', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'blog.publish', name: 'Publish Blogs', module: 'blogs', action: 'publish', scope: PermissionScope.GLOBAL },
    { key: 'media.view', name: 'View Media', module: 'media', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'media.upload', name: 'Upload Media', module: 'media', action: 'upload', scope: PermissionScope.GLOBAL },
    { key: 'media.delete', name: 'Delete Media', module: 'media', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'seo.view', name: 'View SEO', module: 'seo', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'seo.update', name: 'Update SEO', module: 'seo', action: 'update', scope: PermissionScope.GLOBAL },

    // Menu & Navigation
    { key: 'menu.view', name: 'View Menus', module: 'menus', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'menu.create', name: 'Create Menus', module: 'menus', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'menu.update', name: 'Update Menus', module: 'menus', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'menu.delete', name: 'Delete Menus', module: 'menus', action: 'delete', scope: PermissionScope.GLOBAL },

    // Forms
    { key: 'form_submission.view', name: 'View Form Submissions', module: 'form_submissions', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'form_submission.update', name: 'Update Form Submissions', module: 'form_submissions', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'form_submission.export', name: 'Export Form Submissions', module: 'form_submissions', action: 'export', scope: PermissionScope.GLOBAL },

    // Settings
    { key: 'setting.view', name: 'View Settings', module: 'settings', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'setting.update', name: 'Update Settings', module: 'settings', action: 'update', scope: PermissionScope.GLOBAL },

    // Notifications
    { key: 'notification.view', name: 'View Notifications', module: 'notifications', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'notification.send', name: 'Send Notifications', module: 'notifications', action: 'send', scope: PermissionScope.GLOBAL },

    // Documents
    { key: 'document.view', name: 'View Documents', module: 'documents', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'document.upload', name: 'Upload Documents', module: 'documents', action: 'upload', scope: PermissionScope.GLOBAL },
    { key: 'document.verify', name: 'Verify Documents', module: 'documents', action: 'verify', scope: PermissionScope.GLOBAL },

    // Reports
    { key: 'report.view', name: 'View Reports', module: 'reports', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'report.export', name: 'Export Reports', module: 'reports', action: 'export', scope: PermissionScope.GLOBAL },

    // Audit
    { key: 'audit.view', name: 'View Audit Logs', module: 'audit', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'audit.export', name: 'Export Audit Logs', module: 'audit', action: 'export', scope: PermissionScope.GLOBAL },

    // Taxonomy
    { key: 'category.view', name: 'View Categories', module: 'categories', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'category.create', name: 'Create Categories', module: 'categories', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'category.update', name: 'Update Categories', module: 'categories', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'category.delete', name: 'Delete Categories', module: 'categories', action: 'delete', scope: PermissionScope.GLOBAL },
    { key: 'tag.view', name: 'View Tags', module: 'tags', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'tag.create', name: 'Create Tags', module: 'tags', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'tag.update', name: 'Update Tags', module: 'tags', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'tag.delete', name: 'Delete Tags', module: 'tags', action: 'delete', scope: PermissionScope.GLOBAL },

    // Careers
    { key: 'career.view', name: 'View Careers', module: 'careers', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'career.create', name: 'Create Careers', module: 'careers', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'career.update', name: 'Update Careers', module: 'careers', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'career.delete', name: 'Delete Careers', module: 'careers', action: 'delete', scope: PermissionScope.GLOBAL },

    // Gallery
    { key: 'gallery.view', name: 'View Gallery', module: 'gallery', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'gallery.create', name: 'Create Gallery Items', module: 'gallery', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'gallery.update', name: 'Update Gallery Items', module: 'gallery', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'gallery.delete', name: 'Delete Gallery Items', module: 'gallery', action: 'delete', scope: PermissionScope.GLOBAL },

    // Testimonials
    { key: 'testimonial.view', name: 'View Testimonials', module: 'testimonials', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'testimonial.create', name: 'Create Testimonials', module: 'testimonials', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'testimonial.update', name: 'Update Testimonials', module: 'testimonials', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'testimonial.delete', name: 'Delete Testimonials', module: 'testimonials', action: 'delete', scope: PermissionScope.GLOBAL },

    // Mapping
    { key: 'map.view', name: 'View Maps', module: 'mapping', action: 'view', scope: PermissionScope.GLOBAL },
    { key: 'map.create', name: 'Create Maps', module: 'mapping', action: 'create', scope: PermissionScope.GLOBAL },
    { key: 'map.update', name: 'Update Maps', module: 'mapping', action: 'update', scope: PermissionScope.GLOBAL },
    { key: 'map.share', name: 'Share Maps', module: 'mapping', action: 'share', scope: PermissionScope.GLOBAL },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm,
    });
  }
  console.log(`✅ Seeded ${permissions.length} permissions`);

  // ============================================
  // ROLES
  // ============================================
  const allPermissionKeys = permissions.map(p => p.key);

  const rolePermissions: Record<RoleType, string[]> = {
    [RoleType.SUPER_ADMIN]: allPermissionKeys,
    [RoleType.ADMIN]: allPermissionKeys.filter(k => !k.startsWith('role.delete') && !k.startsWith('permission.')),
    [RoleType.MANAGER]: [
      'user.view', 'lead.view', 'lead.create', 'lead.update', 'lead.assign', 'lead.export',
      'customer.view', 'customer.create', 'customer.update',
      'project.view', 'project.create', 'project.update',
      'property.view', 'property.create', 'property.update',
      'inventory.view', 'inventory.update',
      'enquiry.view', 'enquiry.create', 'enquiry.update',
      'site_visit.view', 'site_visit.create', 'site_visit.update',
      'booking.view', 'booking.create', 'booking.update',
      'payment.view', 'payment.create', 'payment.verify',
      'agreement.view', 'agreement.create', 'agreement.update',
      'channel_partner.view', 'channel_partner.create', 'channel_partner.update',
      'commission.view', 'commission.create', 'commission.approve',
      'campaign.view', 'campaign.create', 'campaign.update',
      'page.view', 'page.create', 'page.update', 'page.publish',
      'blog.view', 'blog.create', 'blog.update', 'blog.publish',
      'media.view', 'media.upload', 'media.delete',
      'seo.view', 'seo.update',
      'menu.view', 'menu.create', 'menu.update',
      'form_submission.view', 'form_submission.update', 'form_submission.export',
      'setting.view', 'setting.update',
      'notification.view', 'notification.send',
      'document.view', 'document.upload', 'document.verify',
      'report.view', 'report.export',
      'audit.view',
      'category.view', 'category.create', 'category.update',
      'tag.view', 'tag.create', 'tag.update',
      'career.view', 'career.create', 'career.update',
      'gallery.view', 'gallery.create', 'gallery.update',
      'testimonial.view', 'testimonial.create', 'testimonial.update',
      'map.view', 'map.create', 'map.update', 'map.share',
    ],
    [RoleType.SALES]: [
      'lead.view', 'lead.create', 'lead.update', 'lead.assign',
      'customer.view', 'customer.create', 'customer.update',
      'project.view', 'property.view',
      'inventory.view',
      'enquiry.view', 'enquiry.create', 'enquiry.update',
      'site_visit.view', 'site_visit.create', 'site_visit.update',
      'booking.view', 'booking.create', 'booking.update',
      'payment.view', 'payment.create',
      'agreement.view', 'agreement.create',
      'channel_partner.view',
      'form_submission.view', 'form_submission.update',
      'notification.view',
      'document.view', 'document.upload',
      'report.view',
    ],
    [RoleType.CP]: [
      'lead.view', 'lead.create', 'lead.update',
      'customer.view',
      'project.view', 'property.view',
      'inventory.view',
      'enquiry.view', 'enquiry.create',
      'site_visit.view', 'site_visit.create',
      'booking.view', 'booking.create',
      'payment.view',
      'commission.view',
      'notification.view',
      'document.view', 'document.upload',
    ],
    [RoleType.CLIENT]: [
      'lead.view', // Own leads only (enforced in service)
      'project.view',
      'property.view',
      'inventory.view',
      'enquiry.view', 'enquiry.create',
      'site_visit.view', 'site_visit.create',
      'booking.view',
      'payment.view',
      'agreement.view',
      'document.view', 'document.upload',
      'notification.view',
    ],
    [RoleType.CONTENT_MANAGER]: [
      'page.view', 'page.create', 'page.update', 'page.publish',
      'blog.view', 'blog.create', 'blog.update', 'blog.publish',
      'media.view', 'media.upload', 'media.delete',
      'seo.view', 'seo.update',
      'menu.view', 'menu.create', 'menu.update',
      'category.view', 'category.create', 'category.update',
      'tag.view', 'tag.create', 'tag.update',
      'gallery.view', 'gallery.create', 'gallery.update',
      'testimonial.view', 'testimonial.create', 'testimonial.update',
      'notification.view',
    ],
    [RoleType.FINANCE]: [
      'booking.view',
      'payment.view', 'payment.create', 'payment.verify',
      'agreement.view',
      'commission.view', 'commission.approve', 'commission.pay',
      'report.view', 'report.export',
      'document.view', 'document.verify',
      'notification.view',
    ],
  };

  for (const [roleType, permKeys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name: roleType as RoleType },
      update: {},
      create: {
        name: roleType as RoleType,
        displayName: roleType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        isSystem: roleType === RoleType.SUPER_ADMIN,
      },
    });

    const perms = await prisma.permission.findMany({
      where: { key: { in: permKeys } },
    });

    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { set: perms.map(p => ({ id: p.id })) } },
    });
  }
  console.log('✅ Seeded roles with permissions');

  // ============================================
  // SUPER ADMIN USER
  // ============================================
  const superAdminRole = await prisma.role.findUnique({ where: { name: RoleType.SUPER_ADMIN } });
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@truzonhomes.com' },
    update: {},
    create: {
      email: 'admin@truzonhomes.com',
      phone: '+919876543210',
      passwordHash,
      fullName: 'Super Admin',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phoneVerified: true,
      roleId: superAdminRole!.id,
    },
  });
  console.log('✅ Seeded Super Admin: admin@truzonhomes.com / ChangeMe123!');

  // ============================================
  // LEAD SOURCES
  // ============================================
  const leadSources = [
    { name: 'Website', type: LeadSourceType.WEBSITE, description: 'Leads from public website' },
    { name: 'Mobile App', type: LeadSourceType.MOBILE_APP, description: 'Leads from mobile app' },
    { name: 'Google Ads', type: LeadSourceType.GOOGLE_ADS, description: 'Google Ads campaigns' },
    { name: 'Meta Ads', type: LeadSourceType.META_ADS, description: 'Facebook/Instagram Ads' },
    { name: 'WhatsApp', type: LeadSourceType.WHATSAPP, description: 'WhatsApp Business' },
    { name: 'Phone', type: LeadSourceType.PHONE, description: 'Direct phone calls' },
    { name: 'Manual Entry', type: LeadSourceType.MANUAL, description: 'Manually entered by staff' },
    { name: 'Property Portal', type: LeadSourceType.PROPERTY_PORTAL, description: '99acres, MagicBricks, etc.' },
    { name: 'Channel Partner', type: LeadSourceType.CHANNEL_PARTNER, description: 'Referrals from CPs' },
    { name: 'Campaign', type: LeadSourceType.CAMPAIGN, description: 'Marketing campaigns' },
    { name: 'Referral', type: LeadSourceType.REFERRAL, description: 'Customer referrals' },
    { name: 'Walk-in', type: LeadSourceType.WALK_IN, description: 'Office walk-ins' },
  ];

  for (const ls of leadSources) {
    const existing = await prisma.leadSource.findFirst({ where: { name: ls.name } });
    if (!existing) {
      await prisma.leadSource.create({ data: ls });
    }
  }
  console.log(`✅ Seeded ${leadSources.length} lead sources`);

  // ============================================
  // BLOCK DEFINITIONS (18 block types)
  // ============================================
  const blockDefinitions = [
    { key: 'hero_banner', label: 'Hero Banner', category: 'LAYOUT', schema: { type: 'object', properties: { slides: { type: 'array' }, button_label: { type: 'string' }, button_href: { type: 'string' } } } },
    { key: 'text', label: 'Text', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, body: { type: 'string' } } } },
    { key: 'image', label: 'Image', category: 'MEDIA', schema: { type: 'object', properties: { image_url: { type: 'string' }, alt_text: { type: 'string' }, caption: { type: 'string' }, link_url: { type: 'string' } } } },
    { key: 'gallery', label: 'Gallery', category: 'MEDIA', schema: { type: 'object', properties: { images: { type: 'array' }, layout: { type: 'string', enum: ['grid', 'masonry', 'slider'] } } } },
    { key: 'video', label: 'Video', category: 'MEDIA', schema: { type: 'object', properties: { video_url: { type: 'string' }, poster_url: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } } } },
    { key: 'faq', label: 'FAQ', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, a: { type: 'string' } } } } } } },
    { key: 'testimonials', label: 'Testimonials', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array' }, layout: { type: 'string', enum: ['grid', 'slider'] } } } },
    { key: 'features', label: 'Features', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array' }, columns: { type: 'number' } } } },
    { key: 'pricing', label: 'Pricing', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, plans: { type: 'array' } } } },
    { key: 'team', label: 'Team', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, members: { type: 'array' } } } },
    { key: 'timeline', label: 'Timeline', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array' } } } },
    { key: 'map', label: 'Map', category: 'INTERACTIVE', schema: { type: 'object', properties: { map_project_id: { type: 'string' }, zoom: { type: 'number' } } } },
    { key: 'accordion', label: 'Accordion', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array' } } } },
    { key: 'statistics', label: 'Statistics', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, items: { type: 'array' } } } },
    { key: 'contact_form', label: 'Contact Form', category: 'FORM', schema: { type: 'object', properties: { heading: { type: 'string' }, form_key: { type: 'string' }, button_label: { type: 'string' } } } },
    { key: 'cta', label: 'CTA', category: 'CONTENT', schema: { type: 'object', properties: { heading: { type: 'string' }, description: { type: 'string' }, button_label: { type: 'string' }, button_href: { type: 'string' }, secondary_button_label: { type: 'string' }, secondary_button_href: { type: 'string' } } } },
    { key: 'spacer', label: 'Spacer', category: 'LAYOUT', schema: { type: 'object', properties: { height: { type: 'number' } } } },
    { key: 'divider', label: 'Divider', category: 'LAYOUT', schema: { type: 'object', properties: { style: { type: 'string', enum: ['solid', 'dashed', 'dotted'] }, color: { type: 'string' }, thickness: { type: 'number' } } } },
  ];

  for (const [index, bd] of blockDefinitions.entries()) {
    await prisma.blockDefinition.upsert({
      where: { key: bd.key },
      update: {},
      create: { ...bd, sortOrder: index },
    });
  }
  console.log(`✅ Seeded ${blockDefinitions.length} block definitions`);

  // ============================================
  // FIXED PAGES (5 fixed pages)
  // ============================================
  const pages = [
    { pageType: PageType.HOME, slug: '/', title: 'Home' },
    { pageType: PageType.ABOUT, slug: '/about', title: 'About Us' },
    { pageType: PageType.PROJECTS, slug: '/projects', title: 'Projects' },
    { pageType: PageType.BLOG, slug: '/blog', title: 'Blog' },
    { pageType: PageType.CONTACT, slug: '/contact', title: 'Contact' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { pageType: page.pageType },
      update: {},
      create: {
        ...page,
        status: PageStatus.PUBLISHED,
        publishedAt: new Date(),
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
      },
    });
  }
  console.log('✅ Seeded 5 fixed pages');

  // ============================================
  // MENUS
  // ============================================
  const menus = [
    { key: 'header', label: 'Header Navigation' },
    { key: 'footer_company', label: 'Footer — Company' },
    { key: 'footer_properties', label: 'Footer — Properties' },
    { key: 'footer_resources', label: 'Footer — Resources' },
    { key: 'footer_legal', label: 'Footer — Legal' },
  ];

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { key: menu.key },
      update: {},
      create: menu,
    });
  }
  console.log('✅ Seeded menus');

  // ============================================
  // SETTINGS
  // ============================================
  const settings = [
    { key: 'site_name', value: 'Truzon Homes', group: 'GENERAL', isPublic: true, description: 'Site name displayed in header/footer' },
    { key: 'site_tagline', value: 'Building Dreams. Creating Futures.', group: 'GENERAL', isPublic: true },
    { key: 'contact_email', value: 'info@truzonhomes.com', group: 'CONTACT', isPublic: true },
    { key: 'contact_phone', value: '+91 7207636911', group: 'CONTACT', isPublic: true },
    { key: 'callback_phone', value: '+91 7207636911', group: 'CONTACT', isPublic: true },
    { key: 'whatsapp_number', value: '+91 7207636911', group: 'CONTACT', isPublic: true },
    { key: 'contact_address', value: '5th Floor, Matrusri Homes, 505, Mathrusree Nagar, Miyapur, Hyderabad, Telangana 500049', group: 'CONTACT', isPublic: true },
    { key: 'social_facebook', value: 'https://facebook.com/truzonhomes', group: 'SOCIAL', isPublic: true },
    { key: 'social_instagram', value: 'https://instagram.com/truzonhomes', group: 'SOCIAL', isPublic: true },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/truzonhomes', group: 'SOCIAL', isPublic: true },
    { key: 'social_youtube', value: 'https://youtube.com/@truzonhomes', group: 'SOCIAL', isPublic: true },
    { key: 'analytics_ga_id', value: '', group: 'SEO', isPublic: false },
    { key: 'google_tag_manager_id', value: '', group: 'SEO', isPublic: false },
    { key: 'meta_pixel_id', value: '', group: 'SEO', isPublic: false },
    { key: 'default_meta_title', value: 'Truzon Homes - Premium Properties & Villas', group: 'SEO', isPublic: true },
    { key: 'default_meta_description', value: 'Discover architectural masterpieces and premium investment opportunities with Truzon Homes across Hyderabad and Bangalore.', group: 'SEO', isPublic: true },
    { key: 'smtp_host', value: '', group: 'SMTP', isPublic: false },
    { key: 'smtp_port', value: '587', group: 'SMTP', isPublic: false },
    { key: 'smtp_user', value: '', group: 'SMTP', isPublic: false },
    { key: 'smtp_password', value: '', group: 'SMTP', isPublic: false },
    { key: 'smtp_from_email', value: 'noreply@truzonhomes.com', group: 'SMTP', isPublic: false },
    { key: 'smtp_from_name', value: 'Truzon Homes', group: 'SMTP', isPublic: false },
    { key: 'storage_provider', value: 'GCS', group: 'INTEGRATIONS', isPublic: false },
    { key: 'gcs_bucket', value: '', group: 'INTEGRATIONS', isPublic: false },
    { key: 'firebase_server_key', value: '', group: 'INTEGRATIONS', isPublic: false },
    { key: 'twilio_account_sid', value: '', group: 'INTEGRATIONS', isPublic: false },
    { key: 'twilio_auth_token', value: '', group: 'INTEGRATIONS', isPublic: false },
    { key: 'twilio_phone_number', value: '', group: 'INTEGRATIONS', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        updatedById: superAdmin.id,
      },
      create: {
        ...setting,
        updatedById: superAdmin.id,
      },
    });
  }
  console.log(`✅ Seeded ${settings.length} settings`);

  // ============================================
  // NOTIFICATION TEMPLATES
  // ============================================
  const notificationTemplates = [
    {
      key: 'lead_assigned',
      name: 'Lead Assigned',
      subject: 'New Lead Assigned: {{leadName}}',
      body: 'Hi {{userName}},\n\nA new lead has been assigned to you:\n\nName: {{leadName}}\nPhone: {{leadPhone}}\nEmail: {{leadEmail}}\nProject: {{projectName}}\nProperty: {{propertyName}}\n\nPlease contact the lead within 24 hours.\n\nThanks,\nTruzon CRM',
      channels: ['IN_APP', 'EMAIL', 'PUSH'],
      variables: ['userName', 'leadName', 'leadPhone', 'leadEmail', 'projectName', 'propertyName'],
    },
    {
      key: 'follow_up_reminder',
      name: 'Follow-up Reminder',
      subject: 'Follow-up Reminder: {{leadName}}',
      body: 'Hi {{userName}},\n\nThis is a reminder for your follow-up with {{leadName}} scheduled for {{scheduledAt}}.\n\nType: {{followUpType}}\nNotes: {{followUpNotes}}\n\nPlease complete this follow-up.\n\nThanks,\nTruzon CRM',
      channels: ['IN_APP', 'EMAIL', 'PUSH'],
      variables: ['userName', 'leadName', 'scheduledAt', 'followUpType', 'followUpNotes'],
    },
    {
      key: 'site_visit_scheduled',
      name: 'Site Visit Scheduled',
      subject: 'Site Visit Scheduled: {{projectName}}',
      body: 'Hi {{userName}},\n\nA site visit has been scheduled:\n\nLead: {{leadName}}\nProject: {{projectName}}\nProperty: {{propertyName}}\nDate & Time: {{scheduledAt}}\nDuration: {{duration}} minutes\n\nPlease prepare for the visit.\n\nThanks,\nTruzon CRM',
      channels: ['IN_APP', 'EMAIL', 'PUSH', 'SMS'],
      variables: ['userName', 'leadName', 'projectName', 'propertyName', 'scheduledAt', 'duration'],
    },
    {
      key: 'booking_confirmed',
      name: 'Booking Confirmed',
      subject: 'Booking Confirmed: {{bookingNumber}}',
      body: 'Hi {{customerName}},\n\nYour booking has been confirmed!\n\nBooking Number: {{bookingNumber}}\nProperty: {{propertyName}}\nProject: {{projectName}}\nBooking Amount: ₹{{bookingAmount}}\nTotal Price: ₹{{totalPrice}}\n\nNext steps: Our team will contact you for documentation.\n\nThanks,\nTruzon Homes',
      channels: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'],
      variables: ['customerName', 'bookingNumber', 'propertyName', 'projectName', 'bookingAmount', 'totalPrice'],
    },
    {
      key: 'payment_received',
      name: 'Payment Received',
      subject: 'Payment Received: ₹{{amount}}',
      body: 'Hi {{customerName}},\n\nWe have received your payment:\n\nAmount: ₹{{amount}}\nPayment Type: {{paymentType}}\nBooking: {{bookingNumber}}\nTransaction ID: {{transactionId}}\nDate: {{paidAt}}\n\nThank you for your payment.\n\nThanks,\nTruzon Homes',
      channels: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'],
      variables: ['customerName', 'amount', 'paymentType', 'bookingNumber', 'transactionId', 'paidAt'],
    },
  ];

  for (const template of notificationTemplates) {
    await prisma.notificationTemplate.upsert({
      where: { key: template.key },
      update: {},
      create: {
        ...template,
        channels: template.channels as any,
      },
    });
  }
  console.log(`✅ Seeded ${notificationTemplates.length} notification templates`);

  // ============================================
  // CATEGORIES
  // ============================================
  const categories = [
    { name: 'Luxury Villas', slug: 'luxury-villas', appliesTo: ['property', 'project'], isActive: true },
    { name: 'Residential Plots', slug: 'residential-plots', appliesTo: ['property', 'project'], isActive: true },
    { name: 'Apartments', slug: 'apartments', appliesTo: ['property', 'project'], isActive: true },
    { name: 'Commercial', slug: 'commercial', appliesTo: ['property', 'project'], isActive: true },
    { name: 'News', slug: 'news', appliesTo: ['blog'], isActive: true },
    { name: 'Tips & Guides', slug: 'tips-guides', appliesTo: ['blog'], isActive: true },
    { name: 'Project Updates', slug: 'project-updates', appliesTo: ['blog'], isActive: true },
    { name: 'Market Trends', slug: 'market-trends', appliesTo: ['blog'], isActive: true },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });