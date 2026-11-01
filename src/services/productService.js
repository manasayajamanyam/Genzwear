import { sampleProducts } from '../data/sampleCatalog'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { firebaseStatus, getFirebaseDb } from './firebase'
import { withServiceTimeout } from './serviceTimeout'

const USE_SAMPLE_DATA = !firebaseStatus.configured

function clone(products) {
  return structuredClone(products)
}

export function notifyProductsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('genzwear-products-changed'))
  }
}

export async function getProducts({ activeOnly = true } = {}) {
  if (USE_SAMPLE_DATA) {
    const products = clone(sampleProducts)
    return activeOnly ? products.filter((product) => product.isActive) : products
  }

  try {
    const snapshot = await withServiceTimeout(getDocs(collection(getFirebaseDb(), 'products')))
    const products = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    return activeOnly ? products.filter((product) => product.isActive !== false) : products
  } catch (error) {
    console.error('Firestore products could not be loaded:', error)
    const products = clone(sampleProducts)
    return activeOnly ? products.filter((product) => product.isActive) : products
  }
}

export async function getProductById(id) {
  if (USE_SAMPLE_DATA) {
    const products = await getProducts({ activeOnly: false })
    return products.find((product) => product.id === id) || null
  }
  const snapshot = await getDoc(doc(getFirebaseDb(), 'products', id))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export async function getRelatedProducts(product, limit = 4) {
  const products = await getProducts({ activeOnly: true })
  return products
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, limit)
}

export async function createProduct(product) {
  if (USE_SAMPLE_DATA) throw new Error('Configure Firebase before managing live products.')
  const payload = { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
  const snapshot = await addDoc(collection(getFirebaseDb(), 'products'), payload)
  notifyProductsChanged()
  return snapshot.id
}

export async function updateProduct(id, product) {
  if (USE_SAMPLE_DATA) throw new Error('Configure Firebase before managing live products.')
  await updateDoc(doc(getFirebaseDb(), 'products', id), {
    ...product,
    updatedAt: serverTimestamp(),
  })
  notifyProductsChanged()
}

export async function deleteProduct(id) {
  if (USE_SAMPLE_DATA) throw new Error('Configure Firebase before managing live products.')
  await deleteDoc(doc(getFirebaseDb(), 'products', id))
  notifyProductsChanged()
}
