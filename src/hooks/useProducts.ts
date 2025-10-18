import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/api/methods/products";

export function useProducts() {
  const queryClient = useQueryClient();

  // جلب المنتجات
  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // إضافة منتج
  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, "id" | "category" | "unit">) =>
      createProduct(newProduct),
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  // تعديل منتج
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Product, "id" | "category" | "unit">>;
    }) => updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  // حذف منتج
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  return {
    productsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

// لو محتاج تستخدم منتج محدد
// export function useProduct(id: string) {
//   return useQuery<Product>({
//     queryKey: ["products", id],
//     queryFn: () => getProduct(id),
//     enabled: !!id,
//   });
// }
