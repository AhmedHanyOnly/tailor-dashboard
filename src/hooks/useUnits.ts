import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  Unit,
} from "@/api/methods/units";

export function useUnits() {
  const queryClient = useQueryClient();

  // 🟢 جلب الوحدات
  const unitsQuery = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: getUnits,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // 🟢 إضافة وحدة
  const createMutation = useMutation({
    mutationFn: (newUnit: Omit<Unit, "id">) => createUnit(newUnit),
    onSuccess: () => queryClient.invalidateQueries(["units"]),
  });

  // 🟢 تعديل وحدة
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<Unit, "id">>;
    }) => updateUnit(id, data),
    onSuccess: () => queryClient.invalidateQueries(["units"]),
  });

  // 🟢 حذف وحدة
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUnit(id),
    onSuccess: () => queryClient.invalidateQueries(["units"]),
  });

  return {
    unitsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
