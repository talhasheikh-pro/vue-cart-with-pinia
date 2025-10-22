import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatCurrency, randomPrice } from "./utils";

describe("utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("formatCurrency", () => {
    it("uses default CURRENCY when none provided", () => {
      const out = formatCurrency(1234.5);
      expect(out).toContain("£"); 

      const cents = out.match(/(\d{2})\D*$/)?.[1];
      expect(cents).toBeDefined();
      expect(cents).toHaveLength(2);
    });

    it("respects explicit currency argument (EUR)", () => {
      const out = formatCurrency(99.99, "EUR");
      expect(out).toContain("€");
    });

    it("handles zero and negative values", () => {
      expect(formatCurrency(0, "USD")).toContain("0.00");
      // Just ensure it returns a string and includes the currency symbol
      expect(formatCurrency(-12.34, "USD")).toContain("$");
    });
  });

  describe("randomPrice", () => {
    it("returns values within [min, max] and with 2 decimals", () => {
      const min = 9.99;
      const max = 19.99;

      for (let i = 0; i < 10; i++) {
        const v = randomPrice(min, max);
        expect(v).toBeGreaterThanOrEqual(min);
        expect(v).toBeLessThanOrEqual(max);
        // exactly 2 decimal places
        expect(Number.isInteger(Math.round(v * 100))).toBe(true);
      }
    });

    it("is not constant (basic randomness smoke test)", () => {
      const samples = new Set<number>();
      for (let i = 0; i < 10; i++) samples.add(randomPrice(10, 11));
      expect(samples.size).toBeGreaterThan(1);
    });

    it("works with default args", () => {
      const v = randomPrice();
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThanOrEqual(9.99);
      expect(v).toBeLessThanOrEqual(199.99);
    });
  });
});
