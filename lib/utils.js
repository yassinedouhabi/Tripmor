/**
 * Format a number as MAD currency
 */
export function formatPrice(amount) {
  return `${amount.toLocaleString("en-MA")} MAD`;
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate commission and provider payout
 */
export function calculatePayout(totalPrice, commissionRate) {
  const commission = Math.round(totalPrice * commissionRate);
  const providerPayout = totalPrice - commission;
  return { commission, providerPayout };
}

/**
 * Truncate text to a max length
 */
export function truncate(str, maxLength = 150) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

/**
 * Build a wa.me WhatsApp link
 */
export function buildWhatsAppLink(phone, message = "") {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}${message ? `?text=${encoded}` : ""}`;
}
