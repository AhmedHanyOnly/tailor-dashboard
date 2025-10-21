import { FeatureData, getFeatureData } from '@/api/methods/features';
import { useQuery } from '@tanstack/react-query';


export function useFeature() {
  const FeatureQuery = useQuery<FeatureData>({
    queryKey: ['FeatureData'],
    queryFn: getFeatureData,
    staleTime: 1000 * 60, 
  });
  return {
    FeatureQuery,
  };
}
