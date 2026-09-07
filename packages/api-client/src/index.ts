import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  User,
  Role,
  Permission,
  Lead,
  LeadSource,
  Customer,
  Project,
  Property,
  InventoryUnit,
  ChannelPartner,
  Enquiry,
  SiteVisit,
  Booking,
  Payment,
  Agreement,
  Campaign,
  Page,
  BlogPost,
  Media,
  Menu,
  FormSubmission,
  Setting,
  Category,
  Tag,
  Career,
  GalleryItem,
  Testimonial,
  Notification,
  Document,
  AuditLog,
  ApiResponse,
  MapProject,
  MapLayer,
  MapProviderConfig,
  MapShareLink,
} from '@truzon/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'User', 'Role', 'Permission',
    'Lead', 'LeadSource', 'Customer',
    'Project', 'Property', 'Inventory',
    'Enquiry', 'SiteVisit', 'Booking', 'Payment', 'Agreement',
    'ChannelPartner', 'Campaign',
    'Page', 'Blog', 'Media', 'Menu', 'Form',
    'Setting', 'Category', 'Tag',
    'Career', 'Gallery', 'Testimonial',
    'MapProject', 'MapLayer', 'Report', 'Audit',
    'Notification', 'Document',
  ],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<{ user: User; accessToken: string; refreshToken: string }, { email: string; password: string }>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation<{ user: User; accessToken: string; refreshToken: string }, { email: string; phone?: string; fullName: string; password: string }>({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    me: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Users
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
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    // Roles
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<Role, { name: string; displayName: string; description?: string; permissionKeys: string[] }>({
      query: (data) => ({ url: '/roles', method: 'POST', body: data }),
      invalidatesTags: ['Role'],
    }),

    // Leads
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
    deleteLead: builder.mutation<void, string>({
      query: (id) => ({ url: `/leads/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Lead'],
    }),

    // Customers
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
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Customer'],
    }),

    // Projects
    getProjects: builder.query<{ data: Project[]; meta: any }, { page?: number; limit?: number; search?: string; city?: string; status?: string; isActive?: boolean; isFeatured?: boolean }>({
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

    // Properties
    getProperties: builder.query<{ data: Property[]; meta: any }, { page?: number; limit?: number; search?: string; projectId?: string; propertyType?: string; isSignature?: boolean; isActive?: boolean }>({
      query: (params) => ({ url: '/properties', params }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<Property, Partial<Property>>({
      query: (data) => ({ url: '/properties', method: 'POST', body: data }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation<Property, { id: string; data: Partial<Property> }>({
      query: ({ id, data }) => ({ url: `/properties/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),

    // Bookings
    getBookings: builder.query<{ data: Booking[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; projectId?: string }>({
      query: (params) => ({ url: '/bookings', params }),
      providesTags: ['Booking'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Payments
    getPayments: builder.query<{ data: Payment[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string; bookingId?: string }>({
      query: (params) => ({ url: '/payments', params }),
      providesTags: ['Payment'],
    }),

    // Channel Partners
    getChannelPartners: builder.query<{ data: ChannelPartner[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({ url: '/channel-partners', params }),
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

    // Pages
    getPages: builder.query<{ data: Page[]; meta: any }, { page?: number; limit?: number; search?: string; pageType?: string; status?: string }>({
      query: (params) => ({ url: '/pages', params }),
      providesTags: ['Page'],
    }),

    // Blogs
    getBlogs: builder.query<{ data: BlogPost[]; meta: any }, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({ url: '/blogs', params }),
      providesTags: ['Blog'],
    }),

    // Media
    getMedia: builder.query<{ data: Media[]; meta: any }, { page?: number; limit?: number; search?: string; type?: string }>({
      query: (params) => ({ url: '/media', params }),
      providesTags: ['Media'],
    }),

    // Categories
    getCategories: builder.query<Category[], { appliesTo?: string }>({
      query: (params) => ({ url: '/categories', params }),
      providesTags: ['Category'],
    }),

    // Tags
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),

    // Notifications
    getNotifications: builder.query<{ data: Notification[]; meta: any }, { page?: number; limit?: number; isRead?: boolean }>({
      query: (params) => ({ url: '/notifications', params }),
      providesTags: ['Notification'],
    }),

    // Audit Logs
    getAuditLogs: builder.query<{ data: AuditLog[]; meta: any }, { page?: number; limit?: number; entityType?: string; userId?: string }>({
      query: (params) => ({ url: '/audit', params }),
      providesTags: ['Audit'],
    }),

    // Careers
    getCareers: builder.query<{ data: Career[]; meta: any }, { page?: number; limit?: number; search?: string; isActive?: boolean }>({
      query: (params) => ({ url: '/careers', params }),
      providesTags: ['Career'],
    }),

    // Testimonials
    getTestimonials: builder.query<{ data: Testimonial[]; meta: any }, { page?: number; limit?: number; isActive?: boolean; isFeatured?: boolean }>({
      query: (params) => ({ url: '/testimonials', params }),
      providesTags: ['Testimonial'],
    }),

    // Mapping / GIS
    // Mapping / GIS
    getMapProjects: builder.query<{ data: MapProject[]; meta: any }, { page?: number; limit?: number; search?: string; mapProviderType?: string; isPublic?: boolean } | void>({
      query: (params) => ({ url: '/mapping/projects', params: params || undefined }),
      providesTags: ['MapProject'],
    }),
    getMapProject: builder.query<MapProject, string>({
      query: (id) => `/mapping/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'MapProject', id }],
    }),
    createMapProject: builder.mutation<MapProject, Partial<MapProject>>({
      query: (data) => ({ url: '/mapping/projects', method: 'POST', body: data }),
      invalidatesTags: ['MapProject'],
    }),
    updateMapProject: builder.mutation<MapProject, { id: string; data: Partial<MapProject> }>({
      query: ({ id, data }) => ({ url: `/mapping/projects/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MapProject', id }],
    }),
    deleteMapProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/mapping/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['MapProject'],
    }),

    getMapLayers: builder.query<MapLayer[], string>({
      query: (projectId) => ({ url: '/mapping/layers', params: { projectId } }),
      providesTags: (result, error, projectId) => [{ type: 'MapProject', id: projectId }],
    }),
    getMapLayer: builder.query<MapLayer, string>({
      query: (id) => `/mapping/layers/${id}`,
      providesTags: (result, error, id) => [{ type: 'MapLayer', id }],
    }),
    uploadMapLayer: builder.mutation<MapLayer, { projectId: string; label: string; geojson: any; strokeColor?: string; fillColor?: string; fillOpacity?: number; strokeWeight?: number; strokeStyle?: string; labelProperty?: string }>({
      query: (data) => ({ url: '/mapping/layers/upload', method: 'POST', body: data }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'MapProject', id: projectId }],
    }),
    createMapLayer: builder.mutation<MapLayer, { projectId: string; data: Partial<MapLayer> }>({
      query: ({ projectId, data }) => ({ url: '/mapping/layers/upload', method: 'POST', body: { projectId, ...data } }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'MapProject', id: projectId }],
    }),
    updateMapLayer: builder.mutation<MapLayer, { id: string; data: Partial<MapLayer> }>({
      query: ({ id, data }) => ({ url: `/mapping/layers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MapLayer', id }],
    }),
    deleteMapLayer: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({ url: `/mapping/layers/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'MapProject', id: projectId }],
    }),
    updateLayerFeatures: builder.mutation<MapLayer, { id: string; featureId: string; properties: Record<string, any> }>({
      query: ({ id, featureId, properties }) => ({ url: `/mapping/layers/${id}/features`, method: 'PUT', body: { featureId, properties } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MapLayer', id }],
    }),

    // Map Providers
    getMapProviders: builder.query<MapProviderConfig[], void>({
      query: () => '/mapping/providers',
      providesTags: ['Setting'],
    }),
    upsertMapProvider: builder.mutation<MapProviderConfig, Partial<MapProviderConfig>>({
      query: (data) => ({ url: '/mapping/providers', method: 'POST', body: data }),
      invalidatesTags: ['Setting'],
    }),

    // Share links
    getMapShareLinks: builder.query<MapShareLink[], string>({
      query: (projectId) => ({ url: '/mapping/share-links', params: { projectId } }),
      providesTags: (result, error, projectId) => [{ type: 'MapProject', id: projectId }],
    }),
    upsertMapShareLink: builder.mutation<MapShareLink, { projectId: string; isActive?: boolean; password?: string; expiresAt?: string; maxViews?: number }>({
      query: (data) => ({ url: '/mapping/share-links', method: 'POST', body: data }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'MapProject', id: projectId }],
    }),

    // Public mapping API
    getPublicMapProject: builder.query<{ project: MapProject; layers: MapLayer[] }, string>({
      query: (projectId) => `/public/mapping/project/${projectId}`,
    }),
    getPublicMapLayerGeoJson: builder.query<any, { projectId: string; layerId: string }>({
      query: ({ projectId, layerId }) => `/public/mapping/project/${projectId}/layers/${layerId}`,
    }),
    getPublicShareDetails: builder.query<{ project: MapProject; layers: MapLayer[] }, { token: string; password?: string }>({
      query: ({ token, password }) => ({
        url: `/public/mapping/${token}`,
        headers: password ? { 'x-share-password': password } : undefined,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useGetPaymentsQuery,
  useGetChannelPartnersQuery,
  useGetChannelPartnerQuery,
  useCreateChannelPartnerMutation,
  useUpdateChannelPartnerMutation,
  useDeleteChannelPartnerMutation,
  useGetPagesQuery,
  useGetBlogsQuery,
  useGetMediaQuery,
  useGetCategoriesQuery,
  useGetTagsQuery,
  useGetNotificationsQuery,
  useGetAuditLogsQuery,
  useGetCareersQuery,
  useGetTestimonialsQuery,
  useGetMapProjectsQuery,
  useGetMapProjectQuery,
  useCreateMapProjectMutation,
  useUpdateMapProjectMutation,
  useDeleteMapProjectMutation,
  useGetMapLayersQuery,
  useGetMapLayerQuery,
  useUploadMapLayerMutation,
  useCreateMapLayerMutation,
  useUpdateMapLayerMutation,
  useDeleteMapLayerMutation,
  useUpdateLayerFeaturesMutation,
  useGetMapProvidersQuery,
  useUpsertMapProviderMutation,
  useGetMapShareLinksQuery,
  useUpsertMapShareLinkMutation,
  useGetPublicMapProjectQuery,
  useGetPublicMapLayerGeoJsonQuery,
  useGetPublicShareDetailsQuery,
} = api;

