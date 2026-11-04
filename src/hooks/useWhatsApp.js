import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import {
  buildGeneralEnquiryMessage,
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
  getProductPageUrl,
  getProductImageUrl,
  preloadProductImage,
  shareProductEnquiry,
} from '../utils/whatsapp'

export function useWhatsApp() {
  const { settings, products } = useStore()
  const number = settings?.whatsappNumber || '917989474903'
  const configured = isWhatsAppConfigured(number)

  useEffect(() => {
    products?.forEach((product) => {
      preloadProductImage(product).catch(() => undefined)
    })
  }, [products])

  function openGeneralChat() {
    const url = buildWhatsAppUrl(number, buildGeneralEnquiryMessage(settings?.storeName))
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function openProductEnquiry(product, selection = {}) {
    const productUrl = getProductPageUrl(product)
    const imageUrl = getProductImageUrl(product)
    const message = buildProductEnquiryMessage({
      product,
      size: selection.size,
      colour: selection.colour,
      quantity: selection.quantity,
      imageUrl,
      productUrl,
    })
    try {
      await shareProductEnquiry({ number, product, message })
    } catch (error) {
      console.error('Could not open the WhatsApp enquiry:', error)
      window.alert('Could not open WhatsApp. Please check the phone number and try again.')
    }
  }

  return { number, configured, openGeneralChat, openProductEnquiry }
}
