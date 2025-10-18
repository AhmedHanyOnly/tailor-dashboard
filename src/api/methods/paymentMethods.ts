import api from '@/api/api';

export interface PaymentMethod {
  id: string;
  name: string;
  type?: string; // مثل: cash, card, transfer
  is_active: boolean;
  is_default: boolean;
  is_cash?: boolean;
}

export interface PaymentMethodsResponse {
  status: boolean;
  message: string;
  data: PaymentMethod[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
}

// جلب كل طرق الدفع
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await api.get<PaymentMethodsResponse>('/api/payment-methods');
  return data.data;
}

// إنشاء طريقة دفع
export async function createPaymentMethod(
  paymentMethodData: Omit<PaymentMethod, 'id'>
): Promise<PaymentMethod> {
  const { data } = await api.post<{ data: PaymentMethod }>('/api/payment-methods', paymentMethodData);
  return data.data;
}

// تعديل طريقة دفع
export async function updatePaymentMethod(
  id: string,
  paymentMethodData: Partial<Omit<PaymentMethod, 'id'>>
): Promise<PaymentMethod> {
  const { data } = await api.put<{ data: PaymentMethod }>(`/api/payment-methods/${id}`, paymentMethodData);
  return data.data;
}

// حذف طريقة دفع
export async function deletePaymentMethod(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/api/payment-methods/${id}`);
  return data;
}
