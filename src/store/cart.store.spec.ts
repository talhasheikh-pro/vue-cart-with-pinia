// tests/cart.store.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "../store/cart";
import { productsService } from "../lib/services/products";

// Mock services, so we dont make an actual external API call
vi.mock("../lib/services/products", () => {
  return {
    productsService: {
      fetchProducts: vi.fn(),
    },
  };
});

describe("useCartStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  // Mock products for testing
  const makeProducts = () => [
    {
      id: 1,
      title: "A",
      price: 10,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
    {
      id: 2,
      title: "B",
      price: 20,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
    {
      id: 3,
      title: "C",
      price: 30,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
    {
      id: 4,
      title: "D",
      price: 40,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
    {
      id: 5,
      title: "E",
      price: 50,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
    {
      id: 6,
      title: "F",
      price: 60,
      description: "",
      category: "",
      image: "",
      rating: { rate: 0, count: 0 },
      quantity: 1,
    },
  ];

  it("initializeCart() loads first 4 products, sets qty=1, computes totals, toggles loading", async () => {
    (productsService.fetchProducts as any).mockResolvedValueOnce(
      makeProducts()
    );

    const store = useCartStore();
    expect(store.isLoading).toBe(false);
    await store.initializeCart();

    expect(store.isLoading).toBe(false);

    expect(store.products).toHaveLength(4);
    expect(store.products.map((p) => p.id)).toEqual([1, 2, 3, 4]);
    store.products.forEach((p) => expect(p.quantity).toBe(1));

    expect(store.amount).toBe(100);
    expect(store.taxAmount).toBeCloseTo(20);
    expect(store.total).toBeCloseTo(220);

    expect(store.getAmount).toBe("£100.00");
    expect(store.getTaxAmount).toBe("£20.00");
    expect(store.getTotal).toBe("£220.00");
  });

  it("removeProduct() removes by id and updates totals", async () => {
    const store = useCartStore();
    store.products = [
      {
        id: 1,
        title: "A",
        price: 10,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
        quantity: 1,
      },
      {
        id: 2,
        title: "B",
        price: 20,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
        quantity: 1,
      },
    ];

    await store.calculateTotals();
    expect(store.amount).toBe(30);

    await store.removeProduct(1);
    expect(store.products).toHaveLength(1);

    // amount = 20; tax=4; total=24
    expect(store.amount).toBe(20);
    expect(store.taxAmount).toBe(4);
    expect(store.total).toBe(124);
  });

  it("changeProductQuantity() updates qty and totals (ignores <1)", async () => {
    const store = useCartStore();
    store.products = [
      {
        id: 1,
        title: "A",
        price: 10,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
        quantity: 1,
      },
      {
        id: 2,
        title: "B",
        price: 20,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
        quantity: 1,
      },
    ];

    await store.calculateTotals();
    expect(store.amount).toBe(30);

    await store.changeProductQuantity(2, 3); // price 20 * qty 3 = 60; + 10 = 70
    expect(store.products.find((p) => p.id === 2)?.quantity).toBe(3);
    expect(store.amount).toBe(70);
    expect(store.taxAmount).toBeCloseTo(14);
    expect(store.total).toBeCloseTo(184);

    // quantity < 1 should be ignored
    await store.changeProductQuantity(2, 0);
    expect(store.products.find((p) => p.id === 2)?.quantity).toBe(3);
  });

  it("addProduct() pushes new item and updates totals", async () => {
    const store = useCartStore();
    store.products = [{ id: 1, title: "A", price: 10, quantity: 1 }] as any;
    await store.calculateTotals();
    expect(store.amount).toBe(10);

    await store.addProduct({ id: 3, title: "C", price: 5, quantity: 2 } as any);
    // new amount = 10 + (5*2) = 20
    expect(store.products).toHaveLength(2);
    expect(store.amount).toBe(20);
    expect(store.taxAmount).toBe(4);
    expect(store.total).toBe(124);
  });

  it("clearCart() empties products and zeros totals", async () => {
    const store = useCartStore();
    store.products = [
      { id: 1, title: "A", price: 10, quantity: 1 },
      { id: 2, title: "B", price: 20, quantity: 2 },
    ] as any;

    await store.calculateTotals();
    expect(store.amount).toBe(50);

    await store.clearCart();
    expect(store.products).toHaveLength(0);
    expect(store.amount).toBe(0);
    expect(store.taxAmount).toBe(0);
    expect(store.total).toBe(100);
  });
});
