import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import { useStore } from '../../context/StoreContext'

export default function Contact() {
  const { settings } = useStore()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Contact</p>
      <h1 className="mt-3 font-display text-5xl tracking-[0.12em]">Visit or message us</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-stone">
        <p>{settings.storeAddress}</p>
        <p>{settings.openingHours}</p>
        <p>
          Phone:{' '}
          {settings.contactNumber || 'Add a contact number in Admin Settings after Firebase is connected.'}
        </p>
        <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline">
          Open store location in Google Maps
        </a>
      </div>
      <div className="mt-8">
        <WhatsAppButton />
      </div>
    </div>
  )
}
