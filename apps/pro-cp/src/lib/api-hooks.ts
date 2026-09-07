import { api } from '@/lib/api';
import { User, Role, Permission, Lead, Customer, Project, Property, InventoryUnit, Enquiry, SiteVisit, Booking, Payment, Agreement, ChannelPartner, Commission, Campaign, Page, BlogPost, Media, Menu, FormSubmission, Setting, Category, Tag, Career, GalleryItem, Testimonial, MapProject, MapLayer, Report, AuditLog, Notification, Document, Commission as CommissionType } from '@/types';

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
    getFollowUps: builder.query<any[], string>({
      query: (leadId) => `/leads/${leadId}/followups`,
      providesTags: (result, error, leadId) => [{ type: 'Lead', id: leadId }],
    }),
    createFollowUp: builder.mutation<any, { leadId: string; data: any }>({
      query: ({ leadId, data }) => ({ url: `/leads/${leadId}/followups`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { leadId }) => [{ type: 'Lead', id: leadId }],
    }),
    updateFollowUp: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/leads/.../followups/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }],
    }),
    completeFollowUp: builder.mutation<any, { id: string; outcome: string; notes?: string }>({
      query: ({ id, ...data }) => ({ url: `/leads/.../followups/${id}/complete`, method: 'POST', body: data }),
    }),
    getActivities: builder.query<any[], string>({
      query: (leadId) => `/leads/${leadId}/activities`,
    }),
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

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<{ data: Project[]; meta: any }, { page?: number; limit?: number; search?: string; city?: string; status?: string; isActive?: boolean; isFeatured?: boolean }>({
      query: (params) => ({ url: '/projects', params }),
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, any>({
      query: (data) => ({ url: '/projects', method: 'POST', body: data }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
    getProjectStats: builder.query<any, string>({
      query: (id) => `/projects/stats/${id}`,
    }),
    addMedia: builder.mutation<any, { projectId: string; mediaId: string }>({
      query: ({ projectId, mediaId }) => ({ url: `/projects/${projectId}/media`, method: 'POST', body: { mediaId } }),
    }),
    removeMedia: builder.mutation<void, { projectId: string; mediaId: string }>({
      query: ({ projectId, mediaId }) => ({ url: `/projects/${projectId}/media/${mediaId}`, method: 'DELETE' }),
    }),
  }),
});

export const propertiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<{ data: Property[]; meta: any }, { page?: number; limit?: number; search?: string; projectId?: string; propertyType?: string; city?: string; budgetBracket?: string; isSignature?: boolean; isActive?: boolean }>({
      query: (params) => ({ url: '/properties', params }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    getPropertyBySlug: builder.query<Property, { projectSlug: string; propertySlug: string }>({
      query: ({ projectSlug, propertySlug }) => `/properties/project/${projectSlug}/property/${propertySlug}`,
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
    addMedia: builder.mutation<any, { propertyId: string; mediaId: string; type: string }>({
      query: ({ propertyId, mediaId, type }) => ({ url: `/properties/${propertyId}/media`, method: 'POST', body: { mediaId, type } }),
    }),
    removeMedia: builder.mutation<void, { propertyId: string; mediaId: string }>({
      query: ({ propertyId, mediaId }) => ({ url: `/properties/${propertyId}/media/${mediaId}`, method: 'DELETE' }),
    }),
    getAvailableInventory: builder.query<any[], string>({
      query: (propertyId) => `/properties/${propertyId}/inventory/available`,
    }),
  }),
});

export const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createVilla: builder.mutation<any, any>({
      query: (data) => ({ url: '/inventory/villas', method: 'POST', body: data }),
      invalidatesTags: ['Inventory'],
    }),
    createPlot: builder.mutation<any, any>({
      query: (data) => ({ url: '/inventory/plots', method: 'POST', body: data }),
      invalidatesTags: ['Inventory'],
    }),
    createInventoryUnit: builder.mutation<any, any>({
      query: (data) => ({ url: '/inventory/units', method: 'POST', body: data }),
      invalidatesTags: ['Inventory'],
    }),
    getVillas: builder.query<any, { page?: number; limit?: number; projectId?: string; status?: string }>({
      query: (params) => ({ url: '/inventory/villas', params }),
      providesTags: ['Inventory'],
    }),
    getPlots: builder.query<any, { page?: number; limit?: number; projectId?: string; status?: string }>({
      query: (params) => ({ url: '/inventory/plots', params }),
      providesTags: ['Inventory'],
    }),
    getInventoryUnits: builder.query<any, { page?: number; limit?: number; projectId?: string; propertyId?: string; unitType?: string; status?: string }>({
      query: (params) => ({ url: '/inventory/units', params }),
      providesTags: ['Inventory'],
    }),
    getInventoryUnit: builder.query<any, string>({
      query: (id) => `/inventory/units/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),
    updateInventoryUnit: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/inventory/units/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }],
    }),
    holdUnit: builder.mutation<any, { id: string; expiresAt: string; reason: string }>({
      query: ({ id, ...data }) => ({ url: `/inventory/units/${id}/hold`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }],
    }),
    releaseHold: builder.mutation<any, string>({
      query: (id) => ({ url: `/inventory/units/${id}/release-hold`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),
    deleteInventoryUnit: builder.mutation<void, string>({
      query: (id) => ({ url: `/inventory/units/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Inventory'],
    }),
    getInventoryStats: builder.query<any, string>({
      query: (projectId) => `/inventory/stats/${projectId}`,
    }),
  }),
});

export const enquiriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnquiries: builder.query<{ data: Enquiry[]; meta: any }, { page?: number; limit?: number; search?: string; leadId?: string; projectId?: string; propertyId?: string; userId?: string; source?: string; type?: string; status?: string; priority?: string }>({
      query: (params) => ({ url: '/enquiries', params }),
      providesTags: ['Enquiry'],
    }),
    getEnquiry: builder.query<Enquiry, string>({
      query: (id) => `/enquiries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Enquiry', id }],
    }),
    createEnquiry: builder.mutation<Enquiry, any>({
      query: (data) => ({ url: '/enquiries', method: 'POST', body: data }),
      invalidatesTags: ['Enquiry'],
    }),
    updateEnquiry: builder.mutation<Enquiry, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/enquiries/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Enquiry', id }],
    }),
    respondEnquiry: builder.mutation<Enquiry, { id: string; response: string }>({
      query: ({ id, response }) => ({ url: `/enquiries/${id}/respond`, method: 'POST', body: { response } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Enquiry', id }],
    }),
    deleteEnquiry: builder.mutation<void, string>({
      query: (id) => ({ url: `/enquiries/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Enquiry'],
    }),
    getEnquiryStats: builder.query<any, void>({
      query: () => '/enquiries/stats',
    }),
  }),
});

export const siteVisitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSiteVisits: builder.query<{ data: SiteVisit[]; meta: any }, { page?: number; limit?: number; search?: string; leadId?: string; projectId?: string; propertyId?: string; userId?: string; status?: string; fromDate?: string; toDate?: string }>({
      query: (params) => ({ url: '/site-visits', params }),
      providesTags: ['SiteVisit'],
    }),
    getSiteVisit: builder.query<SiteVisit, string>({
      query: (id) => `/site-visits/${id}`,
      providesTags: (result, error, id) => [{ type: 'SiteVisit', id }],
    }),
    createSiteVisit: builder.mutation<SiteVisit, any>({
      query: (data) => ({ url: '/site-visits', method: 'POST', body: data }),
      invalidatesTags: ['SiteVisit'],
    }),
    updateSiteVisit: builder.mutation<SiteVisit, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/site-visits/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SiteVisit', id }],
    }),
    confirmSiteVisit: builder.mutation<SiteVisit, string>({
      query: (id) => ({ url: `/site-visits/${id}/confirm`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'SiteVisit', id }],
    }),
    completeSiteVisit: builder.mutation<SiteVisit, { id: string; feedback: string }>({
      query: ({ id, feedback }) => ({ url: `/site-visits/${id}/complete`, method: 'POST', body: { feedback } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SiteVisit', id }],
    }),
    cancelSiteVisit: builder.mutation<SiteVisit, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/site-visits/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SiteVisit', id }],
    }),
    rescheduleSiteVisit: builder.mutation<SiteVisit, { id: string; scheduledAt: string }>({
      query: ({ id, scheduledAt }) => ({ url: `/site-visits/${id}/reschedule`, method: 'POST', body: { scheduledAt } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SiteVisit', id }],
    }),
    deleteSiteVisit: builder.mutation<void, string>({
      query: (id) => ({ url: `/site-visits/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SiteVisit'],
    }),
    getUpcomingVisits: builder.query<any, { days?: number }>({
      query: (params) => ({ url: '/site-visits/upcoming', params }),
    }),
    getSiteVisitStats: builder.query<any, void>({
      query: () => '/site-visits/stats',
    }),
  }),
});

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<{ data: Booking[]; meta: any }, { page?: number; limit?: number; search?: string; leadId?: string; customerId?: string; projectId?: string; propertyId?: string; inventoryUnitId?: string; userId?: string; cpId?: string; status?: string; fromDate?: string; toDate?: string }>({
      query: (params) => ({ url: '/bookings', params }),
      providesTags: ['Booking'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    createBooking: builder.mutation<Booking, any>({
      query: (data) => ({ url: '/bookings', method: 'POST', body: data }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation<Booking, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/bookings/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),
    confirmBooking: builder.mutation<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}/confirm`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    cancelBooking: builder.mutation<Booking, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/bookings/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),
    deleteBooking: builder.mutation<void, string>({
      query: (id) => ({ url: `/bookings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Booking'],
    }),
    getBookingStats: builder.query<any, void>({
      query: () => '/bookings/stats',
    }),
  }),
});

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<{ data: Payment[]; meta: any }, { page?: number; limit?: number; search?: string; bookingId?: string; customerId?: string; userId?: string; type?: string; status?: string; fromDate?: string; toDate?: string }>({
      query: (params) => ({ url: '/payments', params }),
      providesTags: ['Payment'],
    }),
    getPayment: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    createPayment: builder.mutation<Payment, any>({
      query: (data) => ({ url: '/payments', method: 'POST', body: data }),
      invalidatesTags: ['Payment'],
    }),
    updatePayment: builder.mutation<Payment, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/payments/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payment', id }],
    }),
    verifyPayment: builder.mutation<Payment, { id: string; data: { status: 'COMPLETED' | 'FAILED'; notes?: string } }>({
      query: ({ id, data }) => ({ url: `/payments/${id}/verify`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payment', id }],
    }),
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({ url: `/payments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Payment'],
    }),
    getPaymentStats: builder.query<any, void>({
      query: () => '/payments/stats',
    }),
  }),
});

export const agreementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query<{ data: Agreement[]; meta: any }, { page?: number; limit?: number; search?: string; bookingId?: string; customerId?: string; userId?: string; status?: string }>({
      query: (params) => ({ url: '/agreements', params }),
      providesTags: ['Agreement'],
    }),
    getAgreement: builder.query<Agreement, string>({
      query: (id) => `/agreements/${id}`,
      providesTags: (result, error, id) => [{ type: 'Agreement', id }],
    }),
    createAgreement: builder.mutation<Agreement, any>({
      query: (data) => ({ url: '/agreements', method: 'POST', body: data }),
      invalidatesTags: ['Agreement'],
    }),
    updateAgreement: builder.mutation<Agreement, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/agreements/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agreement', id }],
    }),
    signAgreement: builder.mutation<Agreement, string>({
      query: (id) => ({ url: `/agreements/${id}/sign`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Agreement', id }],
    }),
    cancelAgreement: builder.mutation<Agreement, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/agreements/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agreement', id }],
    }),
    linkDocument: builder.mutation<Agreement, { id: string; documentId: string }>({
      query: ({ id, documentId }) => ({ url: `/agreements/${id}/document`, method: 'POST', body: { documentId } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agreement', id }],
    }),
    deleteAgreement: builder.mutation<void, string>({
      query: (id) => ({ url: `/agreements/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Agreement'],
    }),
    getAgreementStats: builder.query<any, void>({
      query: () => '/agreements/stats',
    }),
  }),
});

export const channelPartnersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChannelPartners: builder.query<{ data: ChannelPartner[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({ url: '/channel-partners', params }),
      providesTags: ['ChannelPartner'],
    }),
    getChannelPartner: builder.query<ChannelPartner, string>({
      query: (id) => `/channel-partners/${id}`,
      providesTags: (result, error, id) => [{ type: 'ChannelPartner', id }],
    }),
    createChannelPartner: builder.mutation<ChannelPartner, any>({
      query: (data) => ({ url: '/channel-partners', method: 'POST', body: data }),
      invalidatesTags: ['ChannelPartner'],
    }),
    updateChannelPartner: builder.mutation<ChannelPartner, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/channel-partners/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ChannelPartner', id }],
    }),
    addUser: builder.mutation<any, { channelPartnerId: string; userId: string; role?: string; isPrimary?: boolean }>({
      query: ({ channelPartnerId, ...data }) => ({ url: `/channel-partners/${channelPartnerId}/users`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { channelPartnerId }) => [{ type: 'ChannelPartner', id: channelPartnerId }],
    }),
    removeUser: builder.mutation<void, { channelPartnerId: string; userId: string }>({
      query: ({ channelPartnerId, userId }) => ({ url: `/channel-partners/${channelPartnerId}/users/${userId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { channelPartnerId }) => [{ type: 'ChannelPartner', id: channelPartnerId }],
    }),
    deleteChannelPartner: builder.mutation<void, string>({
      query: (id) => ({ url: `/channel-partners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ChannelPartner'],
    }),
    getChannelPartnerStats: builder.query<any, string>({
      query: (id) => `/channel-partners/stats/${id}`,
    }),
  }),
});

export const campaignsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<{ data: Campaign[]; meta: any }, { page?: number; limit?: number; search?: string; sourceId?: string; status?: string }>({
      query: (params) => ({ url: '/campaigns', params }),
      providesTags: ['Campaign'],
    }),
    getCampaign: builder.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: builder.mutation<Campaign, any>({
      query: (data) => ({ url: '/campaigns', method: 'POST', body: data }),
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: builder.mutation<Campaign, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/campaigns/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Campaign', id }],
    }),
    activateCampaign: builder.mutation<Campaign, string>({
      query: (id) => ({ url: `/campaigns/${id}/activate`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    pauseCampaign: builder.mutation<Campaign, string>({
      query: (id) => ({ url: `/campaigns/${id}/pause`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    completeCampaign: builder.mutation<Campaign, string>({
      query: (id) => ({ url: `/campaigns/${id}/complete`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    deleteCampaign: builder.mutation<void, string>({
      query: (id) => ({ url: `/campaigns/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Campaign'],
    }),
    getCampaignStats: builder.query<any, string>({
      query: (id) => `/campaigns/stats/${id}`,
    }),
  }),
});

export const commissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommissions: builder.query<{ data: CommissionType[]; meta: any }, { page?: number; limit?: number; channelPartnerId?: string; leadId?: string; bookingId?: string; status?: string }>({
      query: (params) => ({ url: '/commissions', params }),
      providesTags: ['Commission'],
    }),
    getCommission: builder.query<CommissionType, string>({
      query: (id) => `/commissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Commission', id }],
    }),
    createCommission: builder.mutation<CommissionType, any>({
      query: (data) => ({ url: '/commissions', method: 'POST', body: data }),
      invalidatesTags: ['Commission'],
    }),
    approveCommission: builder.mutation<CommissionType, string>({
      query: (id) => ({ url: `/commissions/${id}/approve`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Commission', id }],
    }),
    payCommission: builder.mutation<CommissionType, { id: string; paidAt: string }>({
      query: ({ id, paidAt }) => ({ url: `/commissions/${id}/pay`, method: 'POST', body: { paidAt } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Commission', id }],
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
  useAddMediaMutation,
  useRemoveMediaMutation,
} = projectsApi;

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetPropertyBySlugQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useAddMediaMutation: useAddPropertyMediaMutation,
  useRemoveMediaMutation: useRemovePropertyMediaMutation,
  useGetAvailableInventoryQuery,
} = propertiesApi;

export const {
  useCreateVillaMutation,
  useCreatePlotMutation,
  useCreateInventoryUnitMutation,
  useGetVillasQuery,
  useGetPlotsQuery,
  useGetInventoryUnitsQuery,
  useGetInventoryUnitQuery,
  useUpdateInventoryUnitMutation,
  useHoldUnitMutation,
  useReleaseHoldMutation,
  useDeleteInventoryUnitMutation,
  useGetInventoryStatsQuery,
} = inventoryApi;

export const {
  useGetEnquiriesQuery,
  useGetEnquiryQuery,
  useCreateEnquiryMutation,
  useUpdateEnquiryMutation,
  useRespondEnquiryMutation,
  useDeleteEnquiryMutation,
  useGetEnquiryStatsQuery,
} = enquiriesApi;

export const {
  useGetSiteVisitsQuery,
  useGetSiteVisitQuery,
  useCreateSiteVisitMutation,
  useUpdateSiteVisitMutation,
  useConfirmSiteVisitMutation,
  useCompleteSiteVisitMutation,
  useCancelSiteVisitMutation,
  useRescheduleSiteVisitMutation,
  useDeleteSiteVisitMutation,
  useGetUpcomingVisitsQuery,
  useGetSiteVisitStatsQuery,
} = siteVisitsApi;

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useConfirmBookingMutation,
  useCancelBookingMutation,
  useDeleteBookingMutation,
  useGetBookingStatsQuery,
} = bookingsApi;

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useVerifyPaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentStatsQuery,
} = paymentsApi;

export const {
  useGetAgreementsQuery,
  useGetAgreementQuery,
  useCreateAgreementMutation,
  useUpdateAgreementMutation,
  useSignAgreementMutation,
  useCancelAgreementMutation,
  useLinkDocumentMutation,
  useDeleteAgreementMutation,
  useGetAgreementStatsQuery,
} = agreementsApi;

export const {
  useGetChannelPartnersQuery,
  useGetChannelPartnerQuery,
  useCreateChannelPartnerMutation,
  useUpdateChannelPartnerMutation,
  useAddUserMutation,
  useRemoveUserMutation,
  useDeleteChannelPartnerMutation,
  useGetChannelPartnerStatsQuery,
} = channelPartnersApi;

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useActivateCampaignMutation,
  usePauseCampaignMutation,
  useCompleteCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignStatsQuery,
} = campaignsApi;

export const {
  useGetCommissionsQuery,
  useGetCommissionQuery,
  useCreateCommissionMutation,
  useApproveCommissionMutation,
  usePayCommissionMutation,
} = commissionsApi;