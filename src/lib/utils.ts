import { CURRENCY } from "./config";

export function formatCurrency(amount: number, currency = CURRENCY) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}

export function randomPrice(min = 9.99, max = 199.99): number {
  const value = Math.random() * (max - min) + min;
  return Math.round(value * 100) / 100;
}