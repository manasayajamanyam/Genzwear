import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useStore } from '../../context/StoreContext'

export default function Shop() {
  const { categorySlug } = useParams()
  const [params, setParams] = useSearchParams()
  const { products, categories } = useStore()
  const query = params.get('q') || ''
  const sort = params.get('sort') || 'newest'

  const activeCategory = categories.find(
    (category) => category.slug === categorySlug || category.id === categorySlug,
  )

  const filtered = useMemo(() => {
    let next = [...products]

    if (activeCategory) {
      next = next.filter((product) => product.categoryId === activeCategory.id)
    }

    if (query) {
      const needle = query.toLowerCase()
      next = next.filter(
        (product) =>
          product.name.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle) ||
          product.categoryName.toLowerCase().includes(needle),
      )
    }

    if (sort === 'price-asc') next.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') next.sort((a, b) => b.price - a.price)
    else next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return next
  }, [products, activeCategory, query, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Catalogue</p>
      <h1 className="mt-2 font-display text-5xl tracking-[0.12em]">
        {activeCategory ? activeCategory.name : 'All products'}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        {activeCategory?.description ||
          'Sample catalogue data is showing until Firestore is connected in Phase 3.'}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-stone">Categories</p>
          <Link to="/shop" className={`block text-sm ${!activeCategory ? 'text-gold' : 'text-paper/80'}`}>
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className={`block text-sm ${
                activeCategory?.id === category.id ? 'text-gold' : 'text-paper/80 hover:text-gold'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <SearchBar initialValue={query} />
            <select
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                next.set('sort', event.target.value)
                setParams(next)
              }}
              className="h-11 border border-line bg-ink-soft px-3 text-sm text-paper"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          {filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-line p-12 text-center text-sm text-stone">
              No products match this search yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
