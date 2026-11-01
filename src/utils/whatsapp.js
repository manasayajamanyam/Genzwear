function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

export function isWhatsAppConfigured(number) {
  const digits = digitsOnly(number)
  return digits.length >= 10 && !digits.includes('X')
}

export function buildWhatsAppUrl(number, message) {
  const digits = digitsOnly(number)
  const text = encodeURIComponent(message)
  if (!digits) return `https://wa.me/?text=${text}`
  return `https://wa.me/${digits}?text=${text}`
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
