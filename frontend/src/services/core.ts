import api from './api';
import {
  Organization, Location, Contact, Documentation,
  PasswordEntry, Configuration, PaginatedResponse
} from '../types/core';

// Organization APIs
export const organizationAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Organization>>('/organizations/', { params }),
  getById: (id: string) =>
    api.get<Organization>(`/organizations/${id}/`),
  create: (data: Partial<Organization>) =>
    api.post<Organization>('/organizations/', data),
  update: (id: string, data: Partial<Organization>) =>
    api.patch<Organization>(`/organizations/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/organizations/${id}/`),
  search: (q: string) =>
    api.get<Organization[]>('/organizations/search/', { params: { q } }),
  getStats: (id: string) =>
    api.get(`/organizations/${id}/stats/`),
};

// Location APIs
export const locationAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Location>>('/locations/', { params }),
  getById: (id: string) =>
    api.get<Location>(`/locations/${id}/`),
  create: (data: Partial<Location>) =>
    api.post<Location>('/locations/', data),
  update: (id: string, data: Partial<Location>) =>
    api.patch<Location>(`/locations/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/locations/${id}/`),
  byOrganization: (organizationId: string) =>
    api.get<Location[]>('/locations/by_organization/', { params: { organization_id: organizationId } }),
};

// Contact APIs
export const contactAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Contact>>('/contacts/', { params }),
  getById: (id: string) =>
    api.get<Contact>(`/contacts/${id}/`),
  create: (data: Partial<Contact>) =>
    api.post<Contact>('/contacts/', data),
  update: (id: string, data: Partial<Contact>) =>
    api.patch<Contact>(`/contacts/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/contacts/${id}/`),
  byOrganization: (organizationId: string) =>
    api.get<Contact[]>('/contacts/by_organization/', { params: { organization_id: organizationId } }),
  byLocation: (locationId: string) =>
    api.get<Contact[]>('/contacts/by_location/', { params: { location_id: locationId } }),
};

// Documentation APIs
export const documentationAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Documentation>>('/documentations/', { params }),
  getById: (id: string) =>
    api.get<Documentation>(`/documentations/${id}/`),
  create: (data: Partial<Documentation>) =>
    api.post<Documentation>('/documentations/', data),
  update: (id: string, data: Partial<Documentation>) =>
    api.patch<Documentation>(`/documentations/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/documentations/${id}/`),
  byOrganization: (organizationId: string) =>
    api.get<Documentation[]>('/documentations/by_organization/', { params: { organization_id: organizationId } }),
  publish: (id: string) =>
    api.post(`/documentations/${id}/publish/`, {}),
  unpublish: (id: string) =>
    api.post(`/documentations/${id}/unpublish/`, {}),
};

// Password Entry APIs
export const passwordAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<PasswordEntry>>('/passwords/', { params }),
  getById: (id: string) =>
    api.get<PasswordEntry>(`/passwords/${id}/`),
  create: (data: Partial<PasswordEntry>) =>
    api.post<PasswordEntry>('/passwords/', data),
  update: (id: string, data: Partial<PasswordEntry>) =>
    api.patch<PasswordEntry>(`/passwords/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/passwords/${id}/`),
  byOrganization: (organizationId: string) =>
    api.get<PasswordEntry[]>('/passwords/by_organization/', { params: { organization_id: organizationId } }),
};

// Configuration APIs
export const configurationAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Configuration>>('/configurations/', { params }),
  getById: (id: string) =>
    api.get<Configuration>(`/configurations/${id}/`),
  create: (data: Partial<Configuration>) =>
    api.post<Configuration>('/configurations/', data),
  update: (id: string, data: Partial<Configuration>) =>
    api.patch<Configuration>(`/configurations/${id}/`, data),
  delete: (id: string) =>
    api.delete(`/configurations/${id}/`),
  byOrganization: (organizationId: string) =>
    api.get<Configuration[]>('/configurations/by_organization/', { params: { organization_id: organizationId } }),
};
