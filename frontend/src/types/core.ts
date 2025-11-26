export interface Organization {
  id: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  is_active: boolean;
  created_by: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  organization: string;
  organization_name: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone: string;
  is_active: boolean;
  created_by: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  organization: string;
  organization_name: string;
  location: string | null;
  location_name: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  email: string;
  phone: string;
  mobile: string;
  notes: string;
  is_active: boolean;
  created_by: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Documentation {
  id: string;
  organization: string;
  organization_name: string;
  title: string;
  content: string;
  category: 'procedure' | 'configuration' | 'guide' | 'troubleshooting' | 'policy' | 'other';
  tags: string;
  is_published: boolean;
  version: number;
  created_by: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PasswordEntry {
  id: string;
  organization: string;
  organization_name: string;
  name: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  category: 'account' | 'service' | 'device' | 'other';
  is_encrypted: boolean;
  created_by: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Configuration {
  id: string;
  organization: string;
  organization_name: string;
  name: string;
  config_type: 'network' | 'server' | 'application' | 'security' | 'backup' | 'other';
  content: string;
  description: string;
  version: string;
  is_active: boolean;
  created_by: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
