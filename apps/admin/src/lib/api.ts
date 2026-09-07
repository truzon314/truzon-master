import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      const state = getState() as any;
      const token = state?.auth?.accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User', 'Role', 'Permission',
    'Lead', 'Customer',
    'Project', 'Property', 'Inventory',
    'Enquiry', 'SiteVisit', 'Booking', 'Payment', 'Agreement',
    'ChannelPartner', 'Campaign',
    'Page', 'Blog', 'Media', 'Menu', 'Form',
    'Setting', 'Category', 'Tag',
    'Career', 'Gallery', 'Testimonial',
    'MapProject', 'Report', 'Audit',
    'Notification', 'Document',
  ],
  endpoints: () => ({}),
});