function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

export function normalizeWhatsAppNumber(value) {
  const digits = digitsOnly(value)
  if (!digits) return ''
  return digits.length === 10 ? `91${digits}` : digits
}

export function isWhatsAppConfigured(number) {
  const digits = normalizeWhatsAppNumber(number)
  return digits.length >= 10 && !digits.includes('X')
}

export function buildWhatsAppUrl(number, message) {
  const digits = normalizeWhatsAppNumber(number)
  const text = encodeURIComponent(message)
  if (!/^\d{10,15}$/.test(digits)) return ''
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (/Android/i.test(navigator.userAgent)) {
    return `intent://send?phone=${digits}&text=${text}#Intent;scheme=whatsapp;package=com.whatsapp;end`
  }
  return isMobile
    ? `https://wa.me/${digits}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${digits}&text=${text}`
}

export function buildProductEnquiryMessage({
  product,
  size = 'Not selected',
  colour = 'Not selected',
  quantity = 1,
}) {
  return [
    'Hello GEN Z WEAR!',
    '',
    'I am interested in purchasing the following product:',
    '',
    `Product Name: ${product?.name || 'Unknown'}`,
    `Product ID: ${product?.id || 'Unknown'}`,
    `Price: ${product?.price ?? 'Unknown'}`,
    `Size: ${size}`,
    `Colour: ${colour}`,
    `Quantity: ${quantity}`,
    '',
    'Please confirm availability.',
  ].join('\n')
}

export function buildGeneralEnquiryMessage(storeName = 'GEN Z WEAR') {
  return `Hello ${storeName}!\n\nI would like to know more about your latest collection.`
}
