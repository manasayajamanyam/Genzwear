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
    return snapshot.exists() ? snapshot.data() : sampleSettings
  } catch (error) {
    console.error('Firestore store settings could not be loaded:', error)
    return structuredClone(sampleSettings)
  }
}
