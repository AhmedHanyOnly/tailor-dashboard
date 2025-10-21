import api from '@/api/api';
import { ClientsResponse } from './clients';

export interface Lookup<T> {
  [key: number]: T;
}

export interface Country {
  id: number;
  name: string;
}

export interface Currency {
  id: number;
  name: string;
}

export interface Plan {
  id: number;
  name: string;
}

export interface LookupData {
  countriesLookup: Lookup<Country>;
  currenciesLookup: Lookup<Currency>;
  plansLookup: Lookup<Plan>;
}

export async function getLookupData(): Promise<LookupData> {
  const { data } = await api.get<LookupData>('/admin/lookup');
  return data;
}
