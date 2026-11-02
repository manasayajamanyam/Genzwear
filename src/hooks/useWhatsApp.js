import { useStore } from '../context/StoreContext'
import {
  buildGeneralEnquiryMessage,
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
} from '../utils/whatsapp'

export function useWhatsApp() {
  const { settings } = useStore()
  const number = '917989474903'
  const configured = isWhatsAppConfigured(number)

  function openGeneralChat() {
    const url = buildWhatsAppUrl(number, buildGeneralEnquiryMessage(settings?.storeName))
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function openProductEnquiry(product, selection = {}) {
    const message = buildProductEnquiryMessage({
      product,
      size: selection.size,
      colour: selection.colour,
      quantity: selection.quantity,
    })
    const imageUrl = product?.primaryImage || product?.images?.find((image) => image?.url)?.url
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isMobile && imageUrl && navigator.share && navigator.canShare) {
      try {
        const response = await fetch(imageUrl, { mode: 'cors' })
        if (!response.ok) throw new Error(`Unable to load product image (${response.status})`)

        const blob = await response.blob()
        const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
        const image = new File([blob], `${product?.id || 'product'}.${extension}`, {
          type: blob.type || 'image/jpeg',
        })

        if (navigator.canShare({ files: [image] })) {
          await navigator.share({
            files: [image],
            title: product?.name || 'Product enquiry',
            text: message,
          })
          return
        }
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }

    const whatsappUrl = buildWhatsAppUrl(
      number,
      message,
    )
    if (!whatsappUrl) return
    window.location.assign(whatsappUrl)

    if (isMobile || !imageUrl) return

    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error(`Unable to download product image (${response.status})`)

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const download = document.createElement('a')
      download.href = objectUrl
      download.download = `${product?.id || 'product'}.${blob.type.split('/')[1] || 'jpg'}`
      document.body.appendChild(download)
      download.click()
      download.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      window.open(imageUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return { number, configured, openGeneralChat, openProductEnquiry }
}
