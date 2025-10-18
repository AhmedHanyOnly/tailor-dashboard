import api from "../api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};
