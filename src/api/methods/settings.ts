import api from '@/api/api';

export interface SiteSettings {
  site_name: string;
  site_logo?: string;
  site_favicon?: string;
  timezone: string;
  default_currency_id: number;
  is_maintenance_mode: 0 | 1;
  maintenance_message?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  enable_tax: 0 | 1;
  tax_percentage?: number;
  allow_registration: 0 | 1;
  default_plan_id?: number;
  auto_suspend_unpaid_tenants: 0 | 1;
  suspend_after_days?: number;
}

export interface SiteSettingsResponse {
  data: SiteSettings;
}

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await api.get<SiteSettingsResponse>('/admin/settings');
  return data.data;
}

export async function updateSettings(
  settingsData: Partial<SiteSettings>
): Promise<SiteSettings> {
  const { data } = await api.post<{ data: SiteSettings }>('/admin/settings', settingsData);
  return data.data;
}
