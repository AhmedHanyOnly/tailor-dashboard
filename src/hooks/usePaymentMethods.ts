import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  PaymentMethod,
} from "@/api/methods/paymentMethods";

export function usePaymentMethods() {
  const queryClient = useQueryClient();

  // جلب طرق الدفع
  const paymentMethodsQuery = useQuery<PaymentMethod[]>({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // إضافة طريقة دفع
  const createMutation = useMutation({
    mutationFn: (newMethod: Omit<PaymentMethod, "id">) =>
      createPaymentMethod(newMethod),
    onSuccess: () => queryClient.invalidateQueries(["paymentMethods"]),
  });

  // تعديل طريقة دفع
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<PaymentMethod, "id">>;
    }) => updatePaymentMethod(id, data),
    onSuccess: () => queryClient.invalidateQueries(["paymentMethods"]),
  });

  // حذف طريقة دفع
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePaymentMethod(id),
    onSuccess: () => queryClient.invalidateQueries(["paymentMethods"]),
  });

  return {
    paymentMethodsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

// لو محتاج تستخدم طريقة دفع محددة
// export function usePaymentMethod(id: string) {
//   return useQuery<PaymentMethod>({
//     queryKey: ["paymentMethods", id],
//     queryFn: () => getPaymentMethod(id),
//     enabled: !!id,
//   });
// }
