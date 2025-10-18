import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/api/methods/categories";

export function useCategories() {
  const queryClient = useQueryClient();

  // جلب التصنيفات
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // إضافة تصنيف
  const createMutation = useMutation({
    mutationFn: (newCategory: Omit<Category, "id" | "createdBy">) =>
      createCategory(newCategory),
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  // تعديل تصنيف
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<Category, "id" | "createdBy">>;
    }) => updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  // حذف تصنيف
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  return {
    categoriesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

// لو محتاج تستخدم تصنيف محدد
// export function useCategory(id: number) {
//   return useQuery<Category>({
//     queryKey: ["categories", id],
//     queryFn: () => getCategory(id),
//     enabled: !!id,
//   });
// }
