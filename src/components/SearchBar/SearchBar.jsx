import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ compact = false, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${compact ? 'w-full' : 'w-full max-w-md'}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search shirts, jeans, watches..."
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-ink-soft pl-10 pr-4 text-sm text-paper outline-none transition placeholder:text-stone focus:border-gold"
      />
    </form>
  )
}
