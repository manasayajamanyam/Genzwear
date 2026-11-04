import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { signOutAdmin } from '../../services/authService'
import { cloudinaryStatus, uploadProductImage } from '../../services/cloudinaryService'
import { firebaseStatus, getFirebaseAuth } from '../../services/firebase'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../services/productService'
import { getActiveCategories } from '../../services/categoryService'

const emptyProduct = {
  name: '',
  categoryId: '',
  categoryName: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: 0,
  sizes: '',
  colours: '',
  primaryImage: '',
  images: [],
  isActive: true,
  isNewArrival: false,
  isBestseller: false,
  isTrending: false,
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(undefined)
  const [products, setProducts] = useState([])
  const [draft, setDraft] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [categories, setCategories] = useState([])

  async function refreshProducts() {
    setProducts(await getProducts({ activeOnly: false }))
  }

  async function refreshCategories() {
    setCategories(await getActiveCategories())
  }

  useEffect(() => {
    if (!firebaseStatus.configured) return undefined
    return onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      setUser(nextUser)
      if (!nextUser) navigate('/admin/login', { replace: true })
      else {
        refreshProducts().catch((error) => setMessage(error.message))
        refreshCategories().catch((error) => setMessage(error.message))
      }
    })
  }, [navigate])

  if (!firebaseStatus.configured) return <Navigate to="/admin/login" replace />
  if (user === null) return <Navigate to="/admin/login" replace />
  if (!user) return <div className="grid min-h-svh place-items-center bg-ink text-stone">Checking admin session...</div>

  async function handleImages(files) {
    const selectedFiles = Array.from(files || [])
    if (!selectedFiles.length) return
    setBusy(true)
    setMessage('')
    try {
      for (const [index, file] of selectedFiles.entries()) {
        const result = await uploadProductImage(file, (progress) => {
          const completedFilesProgress = (index / selectedFiles.length) * 100
          setUploadProgress(Math.round(completedFilesProgress + progress / selectedFiles.length))
        })
        setDraft((current) => {
          const nextImages = [
            ...(current.images || []),
            { url: result.url, publicId: result.publicId, alt: current.name || 'Product image', colour: '' },
          ]
          return {
            ...current,
            primaryImage: current.primaryImage || result.url,
            images: nextImages,
          }
        })
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
      setUploadProgress(0)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setMessageType('')
    try {
      const isEditing = Boolean(editingId)
      const payload = {
        ...draft,
        price: Number(draft.price),
        originalPrice: Number(draft.originalPrice || draft.price),
        stock: Number(draft.stock),
        sizes: draft.sizes.split(',').map((value) => value.trim()).filter(Boolean),
        colours: draft.colours.split(',').map((value) => value.trim()).filter(Boolean),
        images: draft.images || [],
      }
      if (!payload.primaryImage && payload.images[0]) payload.primaryImage = payload.images[0].url
      const primaryImageExists = payload.images.some((image) => image.url === payload.primaryImage)
      if (payload.primaryImage && !primaryImageExists) {
      payload.images.unshift({ url: payload.primaryImage, alt: payload.name })
      }
      if (isEditing) await updateProduct(editingId, payload)
      else await createProduct(payload)
      await refreshProducts()
      setDraft(emptyProduct)
      setEditingId(null)
      setMessageType('success')
      setMessage(
        isEditing
          ? `Product "${payload.name}" updated successfully.`
          : `Product "${payload.name}" added successfully.`
      )
    } catch (error) {
      setMessageType('error')
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  function editProduct(product) {
    setEditingId(product.id)
    setDraft({
      ...emptyProduct,
      ...product,
      price: String(product.price ?? ''),
      originalPrice: String(product.originalPrice ?? ''),
      sizes: (product.sizes || []).join(', '),
      colours: (product.colours || []).join(', '),
      images: product.images || [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeProduct(id) {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id)
    await refreshProducts()
  }

  async function logout() {
    await signOutAdmin()
    navigate('/admin/login', { replace: true })
  }

  const groupedProducts = categories.map((category) => ({
    category,
    products: products.filter((product) => product.categoryId === category.id),
  }))

  return (
    <main className="min-h-svh bg-ink px-4 py-8 text-paper lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-line pb-5">
          <Link to="/" className="font-display text-2xl tracking-[0.15em]">GEN Z WEAR</Link>
          <button type="button" onClick={logout} className="text-xs uppercase tracking-[0.16em] text-gold">Sign out</button>
        </header>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Store management</p>
            <h1 className="mt-2 font-display text-4xl tracking-[0.1em]">Product dashboard</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); setDraft(emptyProduct); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="bg-gold px-5 py-3 text-xs uppercase tracking-[0.16em] text-ink">
            New product
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4 border border-line bg-ink-soft p-5 md:grid-cols-2">
          <input required placeholder="Product name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <select required value={draft.categoryId} onChange={(e) => {
            const category = categories.find((item) => item.id === e.target.value)
            setDraft({ ...draft, categoryId: category?.id || '', categoryName: category?.name || '' })
          }} className="h-11 border border-line bg-ink px-3">
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input required placeholder="Price" type="number" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <input placeholder="Original price" type="number" min="0" value={draft.originalPrice} onChange={(e) => setDraft({ ...draft, originalPrice: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <input required placeholder="Stock" type="number" min="0" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <input placeholder="Sizes (S, M, L)" value={draft.sizes} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <input placeholder="Colours (Black, Blue)" value={draft.colours} onChange={(e) => setDraft({ ...draft, colours: e.target.value })} className="h-11 border border-line bg-ink px-3" />
          <textarea required placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="min-h-24 border border-line bg-ink px-3 py-2 md:col-span-2" />
          <input placeholder="Primary image URL" value={draft.primaryImage} onChange={(e) => setDraft({ ...draft, primaryImage: e.target.value })} className="h-11 border border-line bg-ink px-3 md:col-span-2" />
          <label className="text-xs uppercase tracking-[0.14em] text-stone md:col-span-2">
            Cloudinary images
            <input type="file" accept="image/*" multiple disabled={!cloudinaryStatus.configured || busy} onChange={(e) => handleImages(e.target.files)} className="mt-2 block w-full text-sm" />
            {uploadProgress ? <span className="mt-1 block text-gold">{uploadProgress}% uploaded</span> : null}
          </label>
          {draft.images?.length ? (
            <div className="grid grid-cols-3 gap-3 md:col-span-2 sm:grid-cols-5">
              {draft.images.map((image, index) => (
                <div key={image.publicId || image.url} className={`relative overflow-hidden border ${draft.primaryImage === image.url ? 'border-gold' : 'border-line'}`}>
                  <img src={image.url} alt={image.alt || `Product image ${index + 1}`} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setDraft((current) => {
                      const remainingImages = current.images.filter((_, imageIndex) => imageIndex !== index)
                      const removedPrimary = current.primaryImage === image.url
                      return {
                        ...current,
                        images: remainingImages,
                        primaryImage: removedPrimary ? remainingImages[0]?.url || '' : current.primaryImage,
                      }
                    })}
                    className="absolute right-1 top-1 bg-ink px-2 py-1 text-xs text-paper"
                  >
                    Remove
                  </button>
                  {draft.primaryImage !== image.url ? (
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, primaryImage: image.url }))}
                      className="absolute bottom-0 left-0 right-0 bg-ink/90 py-1 text-[10px] uppercase tracking-wider text-gold"
                    >
                      Make primary
                    </button>
                  ) : (
                    <span className="absolute bottom-0 left-0 right-0 bg-gold py-1 text-center text-[10px] uppercase tracking-wider text-ink">Primary</span>
                  )}
                  <select
                    value={image.colour || ''}
                    onChange={(event) => setDraft((current) => ({
                      ...current,
                      images: current.images.map((item, imageIndex) =>
                        imageIndex === index ? { ...item, colour: event.target.value } : item
                      ),
                    }))}
                    className="mt-2 h-9 w-full border border-line bg-ink px-2 text-xs"
                    aria-label={`Colour for image ${index + 1}`}
                  >
                    <option value="">No colour</option>
                    {draft.colours.split(',').map((value) => value.trim()).filter(Boolean).map((colour) => (
                      <option key={colour} value={colour}>{colour}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : null}
          <fieldset className="grid gap-3 border border-line p-4 md:col-span-2 sm:grid-cols-4">
            <legend className="px-2 text-xs uppercase tracking-[0.16em] text-stone">Display sections</legend>
            {[
              ['isActive', 'Active'],
              ['isNewArrival', 'New Arrivals'],
              ['isBestseller', 'Best Sellers'],
              ['isTrending', 'Trending'],
            ].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(draft[field])} onChange={(e) => setDraft({ ...draft, [field]: e.target.checked })} />
                {label}
              </label>
            ))}
          </fieldset>
          <button type="submit" disabled={busy} className="bg-paper py-3 text-xs uppercase tracking-[0.18em] text-ink disabled:opacity-50 md:col-span-2">
            {editingId ? 'Save changes' : 'Create product'}
          </button>
        </form>
        {message ? (
          <div
            role={messageType === 'error' ? 'alert' : 'status'}
            className={`mt-5 border px-4 py-3 text-sm ${
              messageType === 'success'
                ? 'border-green-500 bg-green-950 text-green-300'
                : 'border-red-400 bg-red-950 text-red-300'
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="font-display text-2xl tracking-[0.08em]">Collections</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['New Arrivals', products.filter((product) => product.isNewArrival)],
                ['Best Sellers', products.filter((product) => product.isBestseller)],
                ['Trending', products.filter((product) => product.isTrending)],
              ].map(([title, items]) => (
                <div key={title} className="border border-line bg-ink-soft p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">{title}</p>
                  <p className="mt-2 font-display text-3xl">{items.length}</p>
                </div>
              ))}
            </div>
          </section>

          {groupedProducts.map(({ category, products: categoryProducts }) => (
            <section key={category.id}>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h2 className="font-display text-2xl tracking-[0.08em]">{category.name}</h2>
                <span className="text-xs text-stone">{categoryProducts.length} products</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {categoryProducts.map((product) => (
                  <article key={product.id} className="flex items-center gap-4 border border-line bg-ink-soft p-3">
                    {product.primaryImage ? <img src={product.primaryImage} alt="" className="h-20 w-16 object-cover" /> : <div className="h-20 w-16 bg-ink" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{product.name}</p>
                      <p className="mt-1 break-all text-[10px] uppercase tracking-[0.08em] text-gold">ID: {product.id}</p>
                      <p className="mt-1 text-xs text-stone">Stock {product.stock ?? 0} · {product.isActive ? 'Active' : 'Hidden'}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gold">
                        {[product.isNewArrival && 'New', product.isBestseller && 'Best seller', product.isTrending && 'Trending'].filter(Boolean).join(' · ') || 'Standard'}
                      </p>
                    </div>
                    <button type="button" onClick={() => editProduct(product)} className="text-xs text-gold">Edit</button>
                    <button type="button" onClick={() => removeProduct(product.id)} className="text-xs text-red-300">Delete</button>
                  </article>
                ))}
                {!categoryProducts.length ? (
                  <button type="button" onClick={() => { setEditingId(null); setDraft({ ...emptyProduct, categoryId: category.id, categoryName: category.name }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="border border-dashed border-line p-8 text-sm text-stone hover:border-gold hover:text-gold">
                    Add first {category.name} product
                  </button>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
