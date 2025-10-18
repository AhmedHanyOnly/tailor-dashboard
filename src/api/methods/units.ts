import api from '@/api/api';

export interface Unit {
  id: number;
  name: string;
}

export interface UnitsResponse {
  status: boolean;
  message: string;
  data: Unit[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
}

// 🟢 جلب كل الوحدات
export async function getUnits(): Promise<Unit[]> {
  const { data } = await api.get<UnitsResponse>('/api/units');
  return data.data;
}

// 🟢 إنشاء وحدة
export async function createUnit(unitData: Omit<Unit, 'id'>): Promise<Unit> {
  const { data } = await api.post<{ data: Unit }>('/api/units', unitData);
  return data.data;
}

// 🟢 تعديل وحدة
export async function updateUnit(
  id: number,
  unitData: Partial<Omit<Unit, 'id'>>
): Promise<Unit> {
  const { data } = await api.put<{ data: Unit }>(`/api/units/${id}`, unitData);
  return data.data;
}

// 🟢 حذف وحدة
export async function deleteUnit(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/api/units/${id}`);
  return data;
}
