import api from '@/api/api';

export interface Client {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_no?: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ClientsResponse {
  data: Client[];
}

export async function getClients(): Promise<Client[]> {
  const { data } = await api.get<ClientsResponse>('/api/clients');
  return data.data;
}

export async function createClient(clientData: Omit<Client, 'id' | 'createdBy'>): Promise<Client> {
  const { data } = await api.post<{ data: Client }>('/api/clients', clientData);
  return data.data;
}

export async function updateClient(id: number, clientData: Partial<Omit<Client, 'id' | 'createdBy'>>): Promise<Client> {
  const { data } = await api.put<{ data: Client }>(`/api/clients/${id}`, clientData);
  return data.data;
}

export async function deleteClient(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/api/clients/${id}`);
  return data;
}
