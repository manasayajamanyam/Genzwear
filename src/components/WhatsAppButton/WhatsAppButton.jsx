import { MessageCircle } from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function WhatsAppButton({ floating = false, label = 'Chat on WhatsApp' }) {
  const { openGeneralChat, configured } = useWhatsApp()

  if (floating) {
    return (
      <button
        type="button"
        onClick={openGeneralChat}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-lg transition hover:scale-105"
        aria-label={configured ? 'Open WhatsApp chat' : 'Open WhatsApp (number not configured yet)'}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openGeneralChat}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </button>
  )
}
