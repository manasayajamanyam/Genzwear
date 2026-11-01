import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'

export default function ProductSection({ title, subtitle, products, to = '/shop' }) {
  if (!products?.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{subtitle}</p>
          <h2 className="mt-2 font-display text-4xl tracking-[0.12em]">{title}</h2>
        </div>
        <Link to={to} className="hidden text-xs uppercase tracking-[0.2em] text-stone hover:text-gold md:inline">
          View all
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
