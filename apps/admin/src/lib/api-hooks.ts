import { api } from '@/lib/api';
import type { User, Role, Permission, Lead, Customer, Project, Property, InventoryUnit, Enquiry, SiteVisit, Booking, Payment, Agreement, ChannelPartner, Commission, Campaign, Page, BlogPost, Media, Menu, FormSubmission, Setting, Category, Tag, Career, GalleryItem, Testimonial, MapProject, MapLayer, AuditLog, Notification, Document } from '@/types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; accessToken: string; refreshToken: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ user: User; accessToken: string; refreshToken: string }, { email: string; phone?: string; fullName: string; password: string }>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    refresh: builder.mutation<{ accessToken: string; refreshToken: string }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (data) => ({ url: '/auth/reset-password', method: 'POST', body: data }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: (data) => ({ url: '/auth/verify-email', method: 'POST', body: data }),
    }),
    me: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: User[]; meta: any }, { page?: number; limit?: number; search?: string; roleId?: string; status?: string }>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, Partial<User> & { password: string; roleId: string }>({
      query: (data) => ({ url: '/users', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    changePassword: builder.mutation<void, { id: string; currentPassword: string; newPassword: string }>({
      query: ({ id, ...data }) => ({ url: `/users/${id}/password`, method: 'PATCH', body: data }),
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    getUserStats: builder.query<{ total: number; active: number; inactive: number; pending: number }, void>({
      query: () => '/users/stats',
    }),
  }),
});

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
    getRole: builder.query<Role, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation<Role, { name: string; displayName: string; description?: string; permissionKeys: string[] }>({
      query: (data) => ({ url: '/roles', method: 'POST', body: data }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<Role, { id: string; data: { displayName?: string; description?: string; permissionKeys?: string[] } }>({
      query: ({ id, data }) => ({ url: `/roles/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const permissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => '/permissions',
      providesTags: ['Permission'],
    }),
    getPermissionsByModule: builder.query<Permission[], string>({
      query: (module) => `/permissions/by-module?module=${module}`,
    }),
    getModules: builder.query<string[], void>({
      query: () => '/permissions/modules',
    }),
  }),
});

// Lead APIs
export const leadsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<{ data: Lead[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; sourceId?: string; projectId?: string; assignedUserId?: string }>({
      query: (params) => ({ url: '/leads', params }),
      providesTags: ['Lead'],
    }),
    getLead: builder.query<Lead, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (data) => ({ url: '/leads', method: 'POST', body: data }),
      invalidatesTags: ['Lead'],
    }),
    updateLead: builder.mutation<Lead, { id: string; data: Partial<Lead> }>({
      query: ({ id, data }) => ({ url: `/leads/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }],
    }),
    assignLead: builder.mutation<any, { id: string; toUserId?: string; toCpId?: string; reason?: string }>({
      query: ({ id, ...data }) => ({ url: `/leads/${id}/assign`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }],
    }),
    deleteLead: builder.mutation<void, string>({
      query: (id) => ({ url: `/leads/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Lead'],
    }),
    getLeadStats: builder.query<any, void>({
      query: () => '/leads/stats',
    }),
    // Follow-ups
    getFollowUps: builder.query<any[], string>({
      query: (leadId) => `/leads/${leadId}/followups`,
      providesTags: (result, error, leadId) => [{ type: 'Lead', id: leadId }],
    }),
    createFollowUp: builder.mutation<any, { leadId: string; data: any }>({
      query: ({ leadId, data }) => ({ url: `/leads/${leadId}/followups`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { leadId }) => [{ type: 'Lead', id: leadId }],
    }),
    updateFollowUp: builder.mutation<any, { leadId: string; id: string; data: any }>({
      query: ({ leadId, id, data }) => ({ url: `/leads/${leadId}/followups/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { leadId }) => [{ type: 'Lead', id: leadId }],
    }),
    completeFollowUp: builder.mutation<any, { leadId: string; id: string; outcome: string; notes?: string }>({
      query: ({ leadId, id, ...data }) => ({ url: `/leads/${leadId}/followups/${id}/complete`, method: 'POST', body: data }),
    }),
    // Activities
    getActivities: builder.query<any[], string>({
      query: (leadId) => `/leads/${leadId}/activities`,
    }),
    // Assignments
    getAssignments: builder.query<any[], string>({
      query: (leadId) => `/leads/${leadId}/assignments`,
    }),
    reassignLead: builder.mutation<any, { leadId: string; toUserId?: string; toCpId?: string; reason?: string }>({
      query: ({ leadId, ...data }) => ({ url: `/leads/${leadId}/assignments/reassign`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { leadId }) => [{ type: 'Lead', id: leadId }],
    }),
  }),
});

export const customersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<{ data: Customer[]; meta: any }, { page?: number; limit?: number; search?: string; kycStatus?: string }>({
      query: (params) => ({ url: '/customers', params }),
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<Customer, any>({
      query: (data) => ({ url: '/customers', method: 'POST', body: data }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/customers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),
    verifyKyc: builder.mutation<Customer, string>({
      query: (id) => ({ url: `/customers/${id}/verify-kyc`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

// Project APIs
export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<{ data: Project[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; isActive?: boolean; isFeatured?: boolean }>({
      query: (params) => ({ url: '/projects', params }),
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (data) => ({ url: '/projects', method: 'POST', body: data }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
    getProjectStats: builder.query<{ total: number; active: number; upcoming: number; featured: number }, void>({
      query: () => '/projects/stats',
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useMeQuery,
  useLazyMeQuery,
} = authApi;

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
} = usersApi;

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;

export const {
  useGetPermissionsQuery,
  useGetPermissionsByModuleQuery,
  useGetModulesQuery,
} = permissionsApi;

export const {
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useAssignLeadMutation,
  useDeleteLeadMutation,
  useGetLeadStatsQuery,
  useGetFollowUpsQuery,
  useCreateFollowUpMutation,
  useUpdateFollowUpMutation,
  useCompleteFollowUpMutation,
  useGetActivitiesQuery,
  useGetAssignmentsQuery,
  useReassignLeadMutation,
} = leadsApi;

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useVerifyKycMutation,
  useDeleteCustomerMutation,
} = customersApi;

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectStatsQuery,
} = projectsApi;

// Property APIs
export const propertiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<{ data: Property[]; meta: any }, { page?: number; limit?: number; search?: string; projectId?: string; propertyType?: string; isSignature?: boolean; isActive?: boolean }>({
      query: (params) => ({ url: '/properties', params }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<Property, any>({
      query: (data) => ({ url: '/properties', method: 'POST', body: data }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation<Property, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/properties/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),
    getPropertyStats: builder.query<any, void>({
      query: () => '/properties/stats',
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertyStatsQuery,
} = propertiesApi;

// Blog APIs
export const blogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<{ data: BlogPost[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; categoryId?: string; isFeatured?: boolean }>({
      query: (params) => ({ url: '/blogs', params }),
      providesTags: ['Blog'],
    }),
    getBlogPost: builder.query<BlogPost, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createBlogPost: builder.mutation<BlogPost, any>({
      query: (data) => ({ url: '/blogs', method: 'POST', body: data }),
      invalidatesTags: ['Blog'],
    }),
    updateBlogPost: builder.mutation<BlogPost, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/blogs/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogsApi;

// CMS Pages APIs
export const pagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query<{ data: Page[]; meta: any }, { page?: number; limit?: number; search?: string; pageType?: string; status?: string }>({
      query: (params) => ({ url: '/pages', params }),
      providesTags: ['Page'],
    }),
    getPage: builder.query<Page, string>({
      query: (id) => `/pages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Page', id }],
    }),
    createPage: builder.mutation<Page, any>({
      query: (data) => ({ url: '/pages', method: 'POST', body: data }),
      invalidatesTags: ['Page'],
    }),
    updatePage: builder.mutation<Page, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/pages/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Page', id }, 'Page'],
    }),
    publishPage: builder.mutation<Page, { id: string; note?: string }>({
      query: ({ id, note }) => ({ url: `/pages/${id}/publish`, method: 'POST', body: { note } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Page', id }, 'Page'],
    }),
    unpublishPage: builder.mutation<Page, string>({
      query: (id) => ({ url: `/pages/${id}/unpublish`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Page', id }, 'Page'],
    }),
    deletePage: builder.mutation<void, string>({
      query: (id) => ({ url: `/pages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Page'],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  usePublishPageMutation,
  useUnpublishPageMutation,
  useDeletePageMutation,
} = pagesApi;

// Categories APIs
export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ data: Category[]; meta?: any }, { applies_to?: string; search?: string } | void>({
      query: (params) => ({ url: '/categories', params: params || {} }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, any>({
      query: (data) => ({ url: '/categories', method: 'POST', body: data }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = categoriesApi;

// Channel Partner APIs
export const channelPartnersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChannelPartners: builder.query<{ data: ChannelPartner[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({ url: '/channel-partners', params: params || {} }),
      providesTags: ['ChannelPartner'],
    }),
    getChannelPartner: builder.query<ChannelPartner, string>({
      query: (id) => `/channel-partners/${id}`,
      providesTags: (result, error, id) => [{ type: 'ChannelPartner', id }],
    }),
    createChannelPartner: builder.mutation<ChannelPartner, Partial<ChannelPartner>>({
      query: (data) => ({ url: '/channel-partners', method: 'POST', body: data }),
      invalidatesTags: ['ChannelPartner'],
    }),
    updateChannelPartner: builder.mutation<ChannelPartner, { id: string; data: Partial<ChannelPartner> }>({
      query: ({ id, data }) => ({ url: `/channel-partners/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ChannelPartner', id }],
    }),
    deleteChannelPartner: builder.mutation<void, string>({
      query: (id) => ({ url: `/channel-partners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ChannelPartner'],
    }),
    getCommissions: builder.query<{ data: Commission[]; meta: any }, { page?: number; limit?: number; channelPartnerId?: string; status?: string } | void>({
      query: (params) => ({ url: '/channel-partners/commissions', params: params || {} }),
      providesTags: ['ChannelPartner'],
    }),
  }),
});

export const {
  useGetChannelPartnersQuery,
  useGetChannelPartnerQuery,
  useCreateChannelPartnerMutation,
  useUpdateChannelPartnerMutation,
  useDeleteChannelPartnerMutation,
  useGetCommissionsQuery,
} = channelPartnersApi;

// Booking APIs
export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<{ data: Booking[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; projectId?: string } | void>({
      query: (params) => ({ url: '/bookings', params: params || {} }),
      providesTags: ['Booking'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (data) => ({ url: '/bookings', method: 'POST', body: data }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation<Booking, { id: string; data: Partial<Booking> }>({
      query: ({ id, data }) => ({ url: `/bookings/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),
    getBookingStats: builder.query<{ total: number; confirmed: number; pending: number; totalValue: number }, void>({
      query: () => '/bookings/stats',
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useGetBookingStatsQuery,
} = bookingsApi;

// Payment APIs
export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<{ data: Payment[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; bookingId?: string } | void>({
      query: (params) => ({ url: '/payments', params: params || {} }),
      providesTags: ['Payment'],
    }),
    getPayment: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (data) => ({ url: '/payments', method: 'POST', body: data }),
      invalidatesTags: ['Payment'],
    }),
    verifyPayment: builder.mutation<Payment, string>({
      query: (id) => ({ url: `/payments/${id}/verify`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    getPaymentStats: builder.query<{ totalAmount: number; verifiedAmount: number; pendingCount: number }, void>({
      query: () => '/payments/stats',
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentStatsQuery,
} = paymentsApi;

// Site Visit APIs
export const siteVisitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSiteVisits: builder.query<{ data: SiteVisit[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; projectId?: string } | void>({
      query: (params) => ({ url: '/site-visits', params: params || {} }),
      providesTags: ['SiteVisit'],
    }),
    getSiteVisit: builder.query<SiteVisit, string>({
      query: (id) => `/site-visits/${id}`,
      providesTags: (result, error, id) => [{ type: 'SiteVisit', id }],
    }),
    createSiteVisit: builder.mutation<SiteVisit, Partial<SiteVisit>>({
      query: (data) => ({ url: '/site-visits', method: 'POST', body: data }),
      invalidatesTags: ['SiteVisit'],
    }),
    updateSiteVisit: builder.mutation<SiteVisit, { id: string; data: Partial<SiteVisit> }>({
      query: ({ id, data }) => ({ url: `/site-visits/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SiteVisit', id }],
    }),
    getSiteVisitStats: builder.query<{ total: number; scheduled: number; completed: number }, void>({
      query: () => '/site-visits/stats',
    }),
  }),
});

export const {
  useGetSiteVisitsQuery,
  useGetSiteVisitQuery,
  useCreateSiteVisitMutation,
  useUpdateSiteVisitMutation,
  useGetSiteVisitStatsQuery,
} = siteVisitsApi;

// Agreement APIs
export const agreementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query<{ data: Agreement[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({ url: '/agreements', params: params || {} }),
      providesTags: ['Agreement'],
    }),
    getAgreement: builder.query<Agreement, string>({
      query: (id) => `/agreements/${id}`,
      providesTags: (result, error, id) => [{ type: 'Agreement', id }],
    }),
    createAgreement: builder.mutation<Agreement, Partial<Agreement>>({
      query: (data) => ({ url: '/agreements', method: 'POST', body: data }),
      invalidatesTags: ['Agreement'],
    }),
    updateAgreement: builder.mutation<Agreement, { id: string; data: Partial<Agreement> }>({
      query: ({ id, data }) => ({ url: `/agreements/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agreement', id }],
    }),
  }),
});

export const {
  useGetAgreementsQuery,
  useGetAgreementQuery,
  useCreateAgreementMutation,
  useUpdateAgreementMutation,
} = agreementsApi;

// Inventory APIs
export const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryUnits: builder.query<{ data: InventoryUnit[]; meta: any }, { page?: number; limit?: number; projectId?: string; status?: string; search?: string } | void>({
      query: (params) => ({ url: '/inventory', params: params || {} }),
      providesTags: ['Inventory'],
    }),
    getInventoryUnit: builder.query<InventoryUnit, string>({
      query: (id) => `/inventory/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),
    updateInventoryUnit: builder.mutation<InventoryUnit, { id: string; data: Partial<InventoryUnit> }>({
      query: ({ id, data }) => ({ url: `/inventory/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }],
    }),
    getInventoryStats: builder.query<{ total: number; available: number; blocked: number; booked: number; sold: number }, void>({
      query: () => '/inventory/stats',
    }),
  }),
});

export const {
  useGetInventoryUnitsQuery,
  useGetInventoryUnitQuery,
  useUpdateInventoryUnitMutation,
  useGetInventoryStatsQuery,
} = inventoryApi;

// Campaign APIs
export const campaignsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<{ data: Campaign[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({ url: '/campaigns', params: params || {} }),
      providesTags: ['Campaign'],
    }),
    getCampaign: builder.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: builder.mutation<Campaign, Partial<Campaign>>({
      query: (data) => ({ url: '/campaigns', method: 'POST', body: data }),
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: builder.mutation<Campaign, { id: string; data: Partial<Campaign> }>({
      query: ({ id, data }) => ({ url: `/campaigns/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Campaign', id }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} = campaignsApi;

// Form Submissions APIs
export const formsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFormSubmissions: builder.query<{ data: FormSubmission[]; meta: any }, { page?: number; limit?: number; formKey?: string; status?: string; search?: string } | void>({
      query: (params) => ({ url: '/forms', params: params || {} }),
      providesTags: ['Form'],
    }),
    getFormSubmission: builder.query<FormSubmission, string>({
      query: (id) => `/forms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Form', id }],
    }),
    updateFormSubmission: builder.mutation<FormSubmission, { id: string; data: Partial<FormSubmission> }>({
      query: ({ id, data }) => ({ url: `/forms/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Form', id }],
    }),
    getFormStats: builder.query<{ total: number; unread: number; contacted: number }, void>({
      query: () => '/forms/stats',
    }),
  }),
});

export const {
  useGetFormSubmissionsQuery,
  useGetFormSubmissionQuery,
  useUpdateFormSubmissionMutation,
  useGetFormStatsQuery,
} = formsApi;

// Media APIs
export const mediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query<{ data: Media[]; meta: any }, { page?: number; limit?: number; search?: string; type?: string } | void>({
      query: (params) => ({ url: '/media', params: params || {} }),
      providesTags: ['Media'],
    }),
    deleteMedia: builder.mutation<void, string>({
      query: (id) => ({ url: `/media/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useDeleteMediaMutation,
} = mediaApi;

// Menus APIs
export const menusApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query<Menu[], void>({
      query: () => '/menus',
      providesTags: ['Menu'],
    }),
    getMenuItems: builder.query<any[], string>({
      query: (menuId) => `/menus/${menuId}/items`,
      providesTags: ['Menu'],
    }),
    createMenuItem: builder.mutation<any, any>({
      query: (data) => ({ url: '/menus/items', method: 'POST', body: data }),
      invalidatesTags: ['Menu'],
    }),
    updateMenuItem: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/menus/items/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Menu'],
    }),
    deleteMenuItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/menus/items/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Menu'],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menusApi;

// Mapping APIs
export const mappingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMapProjects: builder.query<MapProject[], void>({
      query: () => '/mapping/projects',
      providesTags: ['MapProject'],
    }),
    getMapLayers: builder.query<MapLayer[], string>({
      query: (projectId) => `/mapping/projects/${projectId}/layers`,
      providesTags: ['MapProject'],
    }),
  }),
});

export const {
  useGetMapProjectsQuery,
  useGetMapLayersQuery,
} = mappingApi;

// Careers APIs
export const careersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCareers: builder.query<{ data: Career[]; meta: any }, { page?: number; limit?: number; search?: string; isActive?: boolean } | void>({
      query: (params) => ({ url: '/careers', params: params || {} }),
      providesTags: ['Career'],
    }),
    createCareer: builder.mutation<Career, Partial<Career>>({
      query: (data) => ({ url: '/careers', method: 'POST', body: data }),
      invalidatesTags: ['Career'],
    }),
    updateCareer: builder.mutation<Career, { id: string; data: Partial<Career> }>({
      query: ({ id, data }) => ({ url: `/careers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Career'],
    }),
    deleteCareer: builder.mutation<void, string>({
      query: (id) => ({ url: `/careers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Career'],
    }),
  }),
});

export const {
  useGetCareersQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = careersApi;

// Gallery APIs
export const galleryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query<{ data: GalleryItem[]; meta: any }, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({ url: '/gallery', params: params || {} }),
      providesTags: ['Gallery'],
    }),
    createGalleryItem: builder.mutation<GalleryItem, Partial<GalleryItem>>({
      query: (data) => ({ url: '/gallery', method: 'POST', body: data }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApi;

// Testimonials APIs
export const testimonialsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<{ data: Testimonial[]; meta: any }, { page?: number; limit?: number; search?: string; isActive?: boolean } | void>({
      query: (params) => ({ url: '/testimonials', params: params || {} }),
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation<Testimonial, Partial<Testimonial>>({
      query: (data) => ({ url: '/testimonials', method: 'POST', body: data }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation<Testimonial, { id: string; data: Partial<Testimonial> }>({
      query: ({ id, data }) => ({ url: `/testimonials/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<void, string>({
      query: (id) => ({ url: `/testimonials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;

// Taxonomy (Tags) APIs
export const tagsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),
    createTag: builder.mutation<Tag, Partial<Tag>>({
      query: (data) => ({ url: '/tags', method: 'POST', body: data }),
      invalidatesTags: ['Tag'],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({ url: `/tags/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
} = tagsApi;

// Audit APIs
export const auditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<{ data: AuditLog[]; meta: any }, { page?: number; limit?: number; search?: string; action?: string; entityType?: string } | void>({
      query: (params) => ({ url: '/audit', params: params || {} }),
      providesTags: ['Audit'],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
} = auditApi;

// Settings APIs
export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ data: Setting[] }, void>({
      query: () => '/settings',
      providesTags: ['Setting'],
    }),
    updateSetting: builder.mutation<Setting, { key: string; value: any }>({
      query: ({ key, value }) => ({ url: `/settings/${key}`, method: 'PATCH', body: { value } }),
      invalidatesTags: ['Setting'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingMutation,
} = settingsApi;

// Reports APIs
export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportsOverview: builder.query<any, void>({
      query: () => '/reports/overview',
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsOverviewQuery,
} = reportsApi;