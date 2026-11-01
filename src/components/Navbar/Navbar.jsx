import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import SearchBar from '../SearchBar/SearchBar'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { settings, categories } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 lg:px-8">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName || 'GEN Z WEAR'}
              className="h-16 w-16 object-contain"
            />
          ) : (
            <>
              <p className="font-display text-2xl tracking-[0.28em] text-paper">
                {settings?.storeName || 'GEN Z WEAR'}
              </p>
              <p className="text-[10px] tracking-[0.32em] text-gold">{settings?.tagline}</p>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'text-gold' : 'text-paper/80 transition hover:text-gold'
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="group relative">
            <button type="button" className="text-paper/80 transition hover:text-gold">
              Categories
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-56 border border-line bg-ink-soft p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop/${category.slug || category.id}`}
                  className="block px-2 py-2 text-[11px] text-paper/80 hover:text-gold"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="ml-auto hidden w-full max-w-sm lg:block">
          <SearchBar />
        </div>

        <button
          type="button"
          className="ml-auto text-paper lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="space-y-4 border-t border-line px-4 py-4 lg:hidden">
          <SearchBar compact />
          <div className="grid gap-2 text-sm uppercase tracking-[0.16em]">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug || category.id}`}
                onClick={() => setOpen(false)}
                className="text-stone"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
