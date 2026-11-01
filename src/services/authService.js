import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { firebaseStatus, getFirebaseAuth } from './firebase'

export async function signInAdmin(email, password) {
  if (!firebaseStatus.configured) {
    throw new Error('Configure Firebase before signing in to the admin dashboard.')
  }
  return signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
}

export async function signOutAdmin() {
  await signOut(getFirebaseAuth())
}

export function observeAdmin(callback) {
  if (!firebaseStatus.configured) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(getFirebaseAuth(), callback)
}
