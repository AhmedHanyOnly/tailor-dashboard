import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  Client,
} from "@/api/methods/clients";

export function useClients() {
  const queryClient = useQueryClient();

  // جلب العملاء
  const clientsQuery = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // إضافة عميل
  const createMutation = useMutation({
    mutationFn: (newClient: Omit<Client, "id" | "createdBy">) => createClient(newClient),
    onSuccess: () => queryClient.invalidateQueries(["clients"]),
  });

  // تعديل عميل
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Client, "id" | "createdBy">> }) =>
      updateClient(id, data),
    onSuccess: () => queryClient.invalidateQueries(["clients"]),
  });

  // حذف عميل
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => queryClient.invalidateQueries(["clients"]),
  });

  return {
    clientsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

// لو محتاج تستخدم عميل محدد
// export function useClient(id: number) {
//   return useQuery<Client>({
//     queryKey: ["clients", id],
//     queryFn: () => getClient(id),
//     enabled: !!id,
//   });
// }
