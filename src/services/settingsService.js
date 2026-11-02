import { sampleSettings } from '../data/sampleCatalog'
import { doc, getDoc } from 'firebase/firestore'
import { firebaseStatus, getFirebaseDb } from './firebase'
import { withServiceTimeout } from './serviceTimeout'

const USE_SAMPLE_DATA = !firebaseStatus.configured

export async function getStoreSettings() {
  if (USE_SAMPLE_DATA) {
    return structuredClone(sampleSettings)
  }

  try {
    const snapshot = await withServiceTimeout(getDoc(doc(getFirebaseDb(), 'settings', 'store')))
    if (!snapshot.exists()) return structuredClone(sampleSettings)

    const data = snapshot.data()
    const configuredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null && String(value).trim() !== ''),
    )

    return {
      ...structuredClone(sampleSettings),
      ...configuredData,
    }
  } catch (error) {
    console.error('Firestore store settings could not be loaded:', error)
    return structuredClone(sampleSettings)
  }
}
