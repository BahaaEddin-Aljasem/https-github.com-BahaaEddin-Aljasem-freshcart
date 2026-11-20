export function formatPrice(value: number): string {
  return `${value.toLocaleString("en-US")} EGP`;
}

/** Returns a whole-number discount percentage, or 0 when there is no discount. */
export function discountPercent(price: number, original?: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}
