import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface SharedData {
  name: string;
  locale: string;
  fallbackLocale?: string;
  translations?: Record<string, unknown>;
  fallbackTranslations?: Record<string, unknown>;
  availableLocales?: string[];
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  notifications: Notification[];
  flash?: {
    success?: string | null;
    error?: string | null;
  };
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  roles?: Array<string | { id: number; name: string }>;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}
