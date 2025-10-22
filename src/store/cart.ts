import { defineStore } from "pinia";
import type { Product } from "../lib/types/product";
import { productsService } from "../lib/services/products";
import { SHIPPING_FLAT, TAX_RATE } from "../lib/config";
import { formatCurrency } from "../lib/utils";

type CartState = {
  products: Product[];
  amount: number;
  taxAmount: number;
  total: number;
  isLoading: boolean;
};

export const initialCartState: CartState = {
  products: [],
  amount: 0,
  taxAmount: 0,
  total: 0,
  isLoading: false,
};

export const useCartStore = defineStore("cart", {
  state: () => initialCartState,
  getters: {
    cartProducts: (state) => state.products,
    getAmount: (state) => formatCurrency(state.amount),
    getTaxAmount: (state) => formatCurrency(state.taxAmount),
    getTotal: (state) => formatCurrency(state.total),
  },
  actions: {
    processingStart() {
      this.isLoading = true;
    },
    processingEnd() {
      this.isLoading = false;
    },
    async initializeCart() {
      this.processingStart();
      const products = await productsService.fetchProducts();
      this.products = products.slice(0, 4).map((p) => ({ ...p, quantity: 1 }));
      this.calculateTotals();
      this.processingEnd();
    },
    async removeProduct(productId: number) {
      this.products = this.products.filter((p) => p.id !== productId);
      await this.calculateTotals();
    },
    async changeProductQuantity(productId: number, quantity: number) {
      if (quantity < 1) return;
      const product = this.products.find((p) => p.id === productId);

      if (product) {
        product.quantity = quantity;
        await this.calculateTotals();
      }
    },
    async addProduct(product: Product) {
      this.products.push(product);
      await this.calculateTotals();
    },
    async calculateTotals() {
      this.amount = this.products.reduce(
        (sum, product) => sum + product.price * (product.quantity || 1),
        0
      );
      this.taxAmount = this.amount * TAX_RATE;
      this.total = this.amount + this.taxAmount + SHIPPING_FLAT;
    },
    async clearCart() {
      this.products = [];
      await this.calculateTotals();
    },
  },
});
