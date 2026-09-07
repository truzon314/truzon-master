import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Project, ProjectFilters, ApiResponse, PaginatedResponse } from '@/types';

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await api.get<ApiResponse<PaginatedResponse<Project>>>(`/projects?${params.toString()}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch projects');
      return result.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Project>>(`/projects/${slug}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch project');
      return result.data!;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProjects(limit = 4) {
  return useQuery({
    queryKey: ['projects', 'featured', limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Project>>>(`/projects?featured=true&per_page=${limit}`);
      const result = response.data;
      if (!result.success) throw new Error(result.error?.message || 'Failed to fetch featured projects');
      return result.data!;
    },
    staleTime: 10 * 60 * 1000,
  });
}