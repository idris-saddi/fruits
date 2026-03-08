/**
 * Format a price in millimes to TND display string.
 * Example: 5500 → "5.500"
 */
export function formatPrice(priceInMillimes: number): string {
  return (priceInMillimes / 1000).toFixed(3)
}

/**
 * Format a price in millimes with TND suffix.
 * Example: 5500 → "5.500 TND"
 */
export function formatPriceTND(priceInMillimes: number): string {
  return `${formatPrice(priceInMillimes)} TND`
}
