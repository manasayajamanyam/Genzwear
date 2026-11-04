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
  return isMobile
    ? `https://wa.me/${digits}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${digits}&text=${text}`
}

export function buildProductEnquiryMessage({
  product,
  size = 'Not selected',
  colour = 'Not selected',
  quantity = 1,
  imageUrl = '',
  productUrl = '',
}) {
  return [
    'Hello GEN Z WEAR!',
    '',
    'I am interested in purchasing the following product:',
    '',
    `Product Name: ${product?.name || 'Unknown'}`,
    `Product ID: ${product?.id || 'Unknown'}`,
    `Price: ${formatEnquiryPrice(product?.price)}`,
    `Size: ${size}`,
    `Colour: ${colour}`,
    `Quantity: ${quantity}`,
    ...(productUrl ? [`Product URL: ${productUrl}`] : []),
    ...(imageUrl ? [`Product Image: ${imageUrl}`] : []),
    '',
    'Please confirm availability.',
  ].join('\n')
}

function formatEnquiryPrice(price) {
  const amount = Number(price)
  if (!Number.isFinite(amount)) return String(price || 'Unknown')
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getProductImageUrl(product) {
  const image = product?.primaryImage || product?.images?.find((item) => item?.url)?.url
  if (!image) return ''
  return new URL(image, window.location.origin).href
}

export function getProductPageUrl(product) {
  const id = product?.id
  return id ? `${window.location.origin}/product/${encodeURIComponent(id)}` : window.location.origin
}

function supportedImageType(type, url) {
  const lowerUrl = url.toLowerCase().split('?')[0]
  const normalizedType = String(type || '').toLowerCase()
  if (normalizedType === 'image/jpg') return 'image/jpeg'
  if (['image/jpeg', 'image/png', 'image/webp'].includes(normalizedType)) return normalizedType
  if (lowerUrl.endsWith('.png')) return 'image/png'
  if (lowerUrl.endsWith('.webp')) return 'image/webp'
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) return 'image/jpeg'
  return ''
}

export async function fetchProductImageFile(imageUrl, productId) {
  if (!imageUrl) throw new Error('Product image URL is missing.')
  const response = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' })
  if (!response.ok) throw new Error(`Product image could not be loaded (${response.status}).`)

  const blob = await response.blob()
  const mimeType = supportedImageType(blob.type, imageUrl)
  if (!mimeType) throw new Error('Only JPG, PNG, and WebP product images are supported.')

  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mimeType]
  const safeId = String(productId || 'product').replace(/[^a-z0-9-_]/gi, '-')
  return new File([blob], `${safeId}.${extension}`, { type: mimeType })
}

export function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export async function shareProductEnquiry({ number, product, message }) {
  const imageUrl = getProductImageUrl(product)
  const whatsappUrl = buildWhatsAppUrl(number, message)
  if (!whatsappUrl) throw new Error('WhatsApp number is not configured correctly.')

  if (!isMobileDevice() || !navigator.share) {
    window.location.assign(whatsappUrl)
    return
  }

  let imageError = ''
  try {
    let file
    try {
      file = await fetchProductImageFile(imageUrl, product?.id)
    } catch (error) {
      console.error('The product image could not be attached:', error)
      imageError = error instanceof Error ? error.message : 'The product image could not be loaded.'
    }

    if (file) {
      const shareData = { title: product?.name || 'GEN Z WEAR product', text: message, files: [file] }
      const canShareFiles = typeof navigator.canShare === 'function'
        ? navigator.canShare({ files: [file] })
        : false
      if (canShareFiles) {
        await navigator.share(shareData)
        return
      }
      console.error('This device does not support sharing files with navigator.share().')
    }
  } catch (error) {
    if (error?.name === 'AbortError') return
    console.error('Native sharing failed; opening WhatsApp fallback:', error)
    window.alert('Image sharing failed. WhatsApp will open with the product details and image URL.')
  }

  if (!window.navigator.canShare) {
    window.alert('This browser cannot attach files. WhatsApp will open with the product details and image URL.')
  } else if (imageError) {
    window.alert(`${imageError} WhatsApp will open with the product image URL.`)
  }
  window.location.assign(whatsappUrl)
}

export function buildGeneralEnquiryMessage(storeName = 'GEN Z WEAR') {
  return `Hello ${storeName}!\n\nI would like to know more about your latest collection.`
}
