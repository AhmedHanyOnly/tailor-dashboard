import { createPlan, getPlanById, getPlans, updatePlan } from '@/api/methods/plans';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePlans() {
  const queryClient = useQueryClient();

  // جلب كل الخطط
  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: 1000 * 60,
  });

  // جلب خطة محددة حسب id
  const getPlanQuery = (id: number) =>
    useQuery({
      queryKey: ['plans', id],
      queryFn: () => getPlanById(id),
      enabled: !!id,
    });

  // إضافة خطة
  const createMutation = useMutation({
    mutationFn: (newPlan: Omit<any, 'id'>) => createPlan(newPlan),
    onSuccess: () => queryClient.invalidateQueries(['plans']),
  });

  // تعديل خطة
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) => updatePlan(id, data),
    onSuccess: () => queryClient.invalidateQueries(['plans']),
  });

  return {
    plansQuery,
    getPlanQuery,
    createMutation,
    updateMutation,
  };
}
