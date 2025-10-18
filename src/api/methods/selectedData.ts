import api from '@/api/api';

export interface Role {
  id: string;
  name: string;
  permissions: {
    id: string;
    name: string;
  };
}

export interface CreatedBy {
  id: string;
  name: string;
  email: string;
  type?: string;
  role?: Role;
}

export interface CategoryParent {
  id: number;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  createdBy?: CreatedBy;
  parent?: CategoryParent;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  code?: string;
  barcode?: string;
  image?: string;
  barcode_image?: string;
  price?: string;
  allow_quantity?: boolean;
  quantity?: number;
  category?: Category;
  unit?: Unit;
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
  has_quantity_count: number;
  no_quantity_count: number;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductsResponse>('/api/items');
  return data.data;
}

// Create product
export async function createProduct(productData: Omit<Product, 'id' | 'category' | 'unit'>): Promise<Product> {
  const { data } = await api.post<{ data: Product }>('/api/items', productData);
  return data.data;
}

// Update product
export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'category' | 'unit'>>): Promise<Product> {
  const { data } = await api.put<{ data: Product }>(`/api/items/${id}`, productData);
  return data.data;
}

// Delete product
export async function deleteProduct(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/api/items/${id}`);
  return data;
}
