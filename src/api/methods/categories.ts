import api from '@/api/api';

export interface CreatedBy {
  id: number;
  name: string;
  email: string;
}

export interface CategoryParent {
  id: number;
  name: string;
  createdBy?: CreatedBy;
}

export interface Category {
  id: number;
  name: string;
  createdBy?: CreatedBy;
  parent?: CategoryParent | null;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
}

// جلب كل التصنيفات
export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<CategoriesResponse>('/api/categories');
  return data.data;
}

// إنشاء تصنيف
export async function createCategory(categoryData: Omit<Category, 'id' | 'createdBy'>): Promise<Category> {
  const { data } = await api.post<{ data: Category }>('/api/categories', categoryData);
  return data.data;
}

// تعديل تصنيف
export async function updateCategory(
  id: number,
  categoryData: Partial<Omit<Category, 'id' | 'createdBy'>>
): Promise<Category> {
  const { data } = await api.put<{ data: Category }>(`/api/categories/${id}`, categoryData);
  return data.data;
}

// حذف تصنيف
export async function deleteCategory(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/api/categories/${id}`);
  return data;
}
