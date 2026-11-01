import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import ProductSection from '../../components/ProductSection/ProductSection'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import { useStore } from '../../context/StoreContext'

export default function Home() {
  const { settings, categories, products } = useStore()

  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 4)
  const bestsellers = products.filter((product) => product.isBestseller).slice(0, 4)
  const trending = products.filter((product) => product.isTrending).slice(0, 4)
  const featured = categories.slice(0, 3)

  return (
    <div>
      <section className="relative min-h-[58vh] overflow-hidden md:min-h-[64vh]">
        <img
          src={settings.heroBannerUrl}
          alt="GEN Z WEAR campaign"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-4 py-12 md:min-h-[64vh] lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-paper/75">
            {settings.brandCategory} · {settings.established}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-gold">{settings.tagline}</p>
          <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none tracking-[0.08em] md:text-8xl">
            GEN Z WEAR
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-paper/75">
            Shirts, denim, watches, and street accessories. Browse the drop, pick a size, and enquire on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-paper px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink hover:bg-gold"
            >
              Shop the catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center border border-paper/30 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold hover:text-gold"
            >
              Visit the store
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Browse</p>
            <h2 className="mt-2 font-display text-4xl tracking-[0.12em]">Categories</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <ProductSection title="New Arrivals" subtitle="Just dropped" products={newArrivals} to="/shop?sort=newest" />
      <ProductSection title="Trending" subtitle="In rotation" products={trending} to="/shop" />
      <ProductSection title="Best Sellers" subtitle="Most enquired" products={bestsellers} to="/shop" />

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Edit</p>
          <h2 className="mt-2 font-display text-4xl tracking-[0.12em]">Featured Collections</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((category) => (
            <Link key={category.id} to={`/shop/${category.slug}`} className="group relative min-h-80 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-4xl tracking-[0.16em]">{category.name}</h3>
                <p className="mt-2 text-sm text-paper/70">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto my-16 max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 border border-line bg-ink-soft p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">WhatsApp</p>
            <h2 className="mt-3 font-display text-5xl tracking-[0.1em]">Enquire before you buy.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-stone">
              There is no payment gateway in this first version. Choose a product, size, and colour, then send an
              enquiry. We confirm availability and next steps on WhatsApp.
            </p>
            <div className="mt-6">
              <WhatsAppButton label="Message GEN Z WEAR" />
            </div>
            {!settings.whatsappNumber ? (
              <p className="mt-4 text-xs text-stone">
                WhatsApp number is not set yet. Add it in Admin Settings during a later phase so enquiries reach your
                store number.
              </p>
            ) : null}
          </div>
          <div className="space-y-4 text-sm text-stone">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Store</p>
            <p className="text-paper">{settings.storeAddress}</p>
            <p>{settings.openingHours}</p>
            <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="inline-block text-gold hover:underline">
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
