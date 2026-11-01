import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGallery from '../../components/ProductGallery/ProductGallery'
import ProductSection from '../../components/ProductSection/ProductSection'
import { useStore } from '../../context/StoreContext'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { formatPrice, getDiscountPercent } from '../../utils/format'

export default function ProductDetails() {
  const { productId } = useParams()
  const { products } = useStore()
  const { openProductEnquiry } = useWhatsApp()
  const product = products.find((item) => item.id === productId)
  const related = useMemo(
    () =>
      products
        .filter((item) => item.categoryId === product?.categoryId && item.id !== product?.id)
        .slice(0, 4),
    [products, product],
  )

  const [size, setSize] = useState('')
  const [colour, setColour] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setSize(product?.sizes?.[0] || '')
    setColour(product?.colours?.[0] || '')
    setQuantity(1)
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-gold">
          Back to shop
        </Link>
      </div>
    )
  }

  const discount = getDiscountPercent(product.price, product.originalPrice)
  const outOfStock = !product.stock || product.stock <= 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-stone">
        <Link to="/shop">Shop</Link> / {product.categoryName}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} selectedColour={colour} />

        <div>
          <div className="flex flex-wrap gap-2">
            {product.isNewArrival ? <span className="bg-paper px-2 py-1 text-[10px] text-ink">NEW</span> : null}
            {product.isBestseller ? <span className="bg-gold px-2 py-1 text-[10px] text-ink">BESTSELLER</span> : null}
          </div>
          <h1 className="mt-4 font-display text-5xl tracking-[0.08em]">{product.name}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone">{product.id}</p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl text-gold-soft">{formatPrice(product.price)}</span>
            {discount > 0 ? (
              <>
                <span className="text-stone line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm text-paper">{discount}% off</span>
              </>
            ) : null}
          </div>
          <p className="mt-6 text-sm leading-7 text-stone">{product.description}</p>
          <p className="mt-4 text-sm">{outOfStock ? 'Out of stock' : `${product.stock} in stock`}</p>

          <div className="mt-8 space-y-5">
            <fieldset>
              <legend className="text-xs uppercase tracking-[0.18em] text-stone">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSize(value)}
                    className={`min-w-12 border px-3 py-2 text-sm ${
                      size === value ? 'border-gold text-gold' : 'border-line'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.18em] text-stone">Colour</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setColour(value)}
                    className={`border px-3 py-2 text-sm ${
                      colour === value ? 'border-gold text-gold' : 'border-line'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block text-xs uppercase tracking-[0.18em] text-stone">
              Quantity
              <input
                type="number"
                min="1"
                max={Math.max(product.stock, 1)}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                className="mt-2 h-11 w-24 border border-line bg-ink-soft px-3 text-sm text-paper"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => openProductEnquiry(product, { size, colour, quantity })}
            className="mt-8 w-full bg-paper py-4 text-xs uppercase tracking-[0.22em] text-ink hover:bg-gold disabled:opacity-40"
          >
            {outOfStock ? 'Currently unavailable' : 'Enquire on WhatsApp'}
          </button>

          {product.specifications ? (
            <dl className="mt-10 grid gap-3 border-t border-line pt-6 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.14em] text-stone">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <ProductSection title="Related" subtitle="Same category" products={related} />
    </div>
  )
}
