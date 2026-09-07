import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Property, PropertyFilters, ApiResponse, PaginatedResponse } from '@/types';

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(`/properties?${params.toString()}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch properties');
      return result.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Property>>(`/properties/${slug}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch property');
      return result.data!;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(`/properties?featured=true&per_page=${limit}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch featured properties');
      return result.data!;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function usePropertySearch(searchTerm: string, filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', 'search', searchTerm, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ search: searchTerm, ...filters } as unknown as Record<string, string>);
      const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(`/properties/search?${params.toString()}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to search properties');
      return result.data!;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProjects(filters: { search?: string; city?: string; page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(`/projects?${params.toString()}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch projects');
      return result.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}