import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop/${category.slug || category.id}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-ink-soft"
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = '/favicon.svg'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-display text-2xl tracking-[0.18em] text-paper">{category.name}</p>
        <p className="mt-1 text-xs text-stone">{category.description}</p>
      </div>
    </Link>
  )
}
