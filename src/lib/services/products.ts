import { api } from "../client/axios";
import type { Product } from "../types/product";

export const productsService = {
  fetchProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data || [];
  },
};
