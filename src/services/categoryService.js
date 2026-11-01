import { sampleCategories } from '../data/sampleCatalog'
import { collection, getDocs } from 'firebase/firestore'
import { firebaseStatus, getFirebaseDb } from './firebase'
import { withServiceTimeout } from './serviceTimeout'

const USE_SAMPLE_DATA = !firebaseStatus.configured

export async function getActiveCategories() {
  if (USE_SAMPLE_DATA) {
    return sampleCategories.filter((category) => category.isActive)
  }

  try {
    const snapshot = await withServiceTimeout(getDocs(collection(getFirebaseDb(), 'categories')))
    if (snapshot.empty) return sampleCategories.filter((category) => category.isActive)
    return snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((category) => category.isActive !== false)
  } catch (error) {
    console.error('Firestore categories could not be loaded:', error)
    return sampleCategories.filter((category) => category.isActive)
  }
}

export async function getCategoryBySlug(slug) {
  const categories = await getActiveCategories()
  return categories.find((category) => category.slug === slug || category.id === slug) || null
}
