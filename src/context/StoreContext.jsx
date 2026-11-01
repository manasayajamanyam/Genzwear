import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getActiveCategories } from '../services/categoryService'
import { getProducts } from '../services/productService'
import { getStoreSettings } from '../services/settingsService'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadStore() {
      try {
        const [nextSettings, nextCategories, nextProducts] = await Promise.all([
          getStoreSettings(),
          getActiveCategories(),
          getProducts({ activeOnly: true }),
        ])

        if (cancelled) return
        setSettings(nextSettings)
        setCategories(nextCategories)
        setProducts(nextProducts)
      } catch (error) {
        console.error('The store could not be loaded:', error)
        if (!cancelled) {
          setError('The store could not be loaded. Check your connection and try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStore()
    const handleProductsChanged = () => loadStore()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadStore()
    }
    window.addEventListener('genzwear-products-changed', handleProductsChanged)
    window.addEventListener('focus', handleProductsChanged)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      cancelled = true
      window.removeEventListener('genzwear-products-changed', handleProductsChanged)
      window.removeEventListener('focus', handleProductsChanged)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const value = useMemo(
    () => ({ settings, categories, products, loading, error }),
    [settings, categories, products, loading, error],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
