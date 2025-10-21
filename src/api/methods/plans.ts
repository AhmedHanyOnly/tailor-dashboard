import api from "../api";

export const getPlans = async () => {
  const response = await api.get("/admin/plans");
  return response.data;
};

export const getPlanById = async (id: string) => {
  const response = await api.get(`/admin/plans/${id}`);
  return response.data;
};

export const createPlan = async (data: any) => {
  const response = await api.post("/admin/plans", data);
  return response.data;
};

export const updatePlan = async (id: string, data: any) => {
  const response = await api.put(`/admin/plans/${id}`, data);
  return response.data;
};
export const toggleActiveStatus = async (id: string, data: any) => {
  const response = await api.post(`/admin/plans/${id}/toggle`, data);
  return response.data;
};
