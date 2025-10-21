import { useQuery } from '@tanstack/react-query';

import { getLookupData, LookupData } from '@/api/methods/lookup';

export function useLookup() {
  const lookupQuery = useQuery<LookupData>({
    queryKey: ['LookupData'],
    queryFn: getLookupData,
    staleTime: 1000 * 60, 
  });
  return {
    lookupQuery,
  };
}
