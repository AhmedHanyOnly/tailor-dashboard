import api from '@/api/api';




export interface FeatureData {
  data: [string];
}

export async function getFeatureData(): Promise<FeatureData> {
  const { data } = await api.get<FeatureData>('/admin/plans/features');
  return data;
}
