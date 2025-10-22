import { api } from "../client/axios";
import type { Product } from "../types/product";
import { randomPrice } from "../utils";

export const cartService = {
  addProduct: async (): Promise<Product[]> => {
    // random price between 9.99 and 199.99, to 2 decimals
    const mockProduct = {
      title: "New Product",
      price: randomPrice(),
      quantity: 1,
      description: "A new product added to the cart",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      category: "men's clothing",
    };

    const response = await api.post("/products", mockProduct);
    return { 
      ...response.data,
      // Mocking an ID since the API returns id as 21 for every new product 
      id: new Date().getTime() 
    };
  },
};
