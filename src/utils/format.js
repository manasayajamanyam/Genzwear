export function formatPrice(value) {
  const amount = Number(value) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getDiscountPercent(price, originalPrice) {
  const current = Number(price)
  const original = Number(originalPrice)
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
