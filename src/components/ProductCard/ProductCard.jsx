import { Link } from 'react-router-dom'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { formatPrice, getDiscountPercent } from '../../utils/format'

export default function ProductCard({ product }) {
  const { openProductEnquiry } = useWhatsApp()
  const discount = getDiscountPercent(product.price, product.originalPrice)
  const outOfStock = !product.stock || product.stock <= 0

  return (
    <article className="group flex h-full flex-col bg-ink-soft">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden">
        <img
          src={product.primaryImage}
          alt={product.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/logo.jpeg'
          }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNewArrival ? (
            <span className="bg-paper px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-ink">
              NEW
            </span>
          ) : null}
          {product.isBestseller ? (
            <span className="bg-gold px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-ink">
              BESTSELLER
            </span>
          ) : null}
          {outOfStock ? (
            <span className="bg-black/80 px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-paper">
              SOLD OUT
            </span>
          ) : null}
        </div>
        {discount > 0 ? (
          <span className="absolute right-3 top-3 bg-paper px-2 py-1 text-[10px] font-semibold text-ink">
            -{discount}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">{product.categoryName}</p>
          <h3 className="mt-1 font-display text-xl tracking-wide text-paper">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gold-soft">{formatPrice(product.price)}</span>
          {discount > 0 ? (
            <span className="text-xs text-stone line-through">{formatPrice(product.originalPrice)}</span>
          ) : null}
        </div>

        <p className="text-xs text-stone">
          Sizes: {product.sizes?.join(' · ') || '—'} · {outOfStock ? 'Out of stock' : 'In stock'}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center border border-line px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-paper transition hover:border-gold"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              openProductEnquiry(product, {
                size: product.sizes?.[0],
                colour: product.colours?.[0],
                quantity: 1,
              })
            }
            className="inline-flex items-center justify-center bg-paper px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-ink transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  )
}
