import { MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

export default function Footer() {
  const { settings, categories } = useStore()

  return (
    <footer className="mt-auto border-t border-line bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div>
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName || 'GEN Z WEAR'}
              className="h-16 w-16 object-contain"
            />
          ) : (
            <p className="font-display text-3xl tracking-[0.24em]">GEN Z WEAR</p>
          )}
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gold">
            {settings?.brandCategory} · {settings?.established}
          </p>
          <p className="mt-2 text-sm text-stone">{settings?.tagline}</p>
          <p className="mt-6 text-sm leading-6 text-stone">
            Men’s fashion, streetwear, and accessories. Browse the catalogue and enquire on WhatsApp.
          </p>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Shop</h2>
          <div className="mt-4 grid gap-2 text-sm text-stone">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} to={`/shop/${category.slug || category.id}`} className="hover:text-paper">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Store</h2>
          <div className="mt-4 grid gap-2 text-sm text-stone">
            <Link to="/about" className="hover:text-paper">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-paper">
              Contact
            </Link>
            <Link to="/shipping" className="hover:text-paper">
              Shipping & Returns
            </Link>
            <Link to="/privacy" className="hover:text-paper">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-paper">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="space-y-3 text-sm text-stone">
          <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Visit</h2>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {settings?.storeAddress}
          </p>
          {settings?.contactNumber ? (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              {settings.contactNumber}
            </p>
          ) : (
            <p>Phone number will appear after you save it in Admin Settings.</p>
          )}
          <p>{settings?.openingHours}</p>
          <a
            href={settings?.instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-paper hover:text-gold"
          >
            <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-current text-[9px] leading-none">
              IG
            </span>
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-[11px] uppercase tracking-[0.18em] text-stone">
        © {new Date().getFullYear()} GEN Z WEAR. All rights reserved.
      </div>
    </footer>
  )
}
