import { useStore } from '../context/StoreContext'
import {
  buildGeneralEnquiryMessage,
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
  isWhatsAppConfigured,
} from '../utils/whatsapp'

export function useWhatsApp() {
  const { settings } = useStore()
  const number = settings?.whatsappNumber || ''
  const configured = isWhatsAppConfigured(number)

  function openGeneralChat() {
    const url = buildWhatsAppUrl(number, buildGeneralEnquiryMessage(settings?.storeName))
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openProductEnquiry(product, selection = {}) {
    const url = buildWhatsAppUrl(
      number,
      buildProductEnquiryMessage({
        product,
        size: selection.size,
        colour: selection.colour,
        quantity: selection.quantity,
      }),
    )
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return { number, configured, openGeneralChat, openProductEnquiry }
}
