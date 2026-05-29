/**
 * Formats paise as Indian Rupees (whole rupees, no decimals).
 */
export function formatInrFromPaise(priceInPaise: number): string {
  const rupees = Math.round(priceInPaise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}
