import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { signInAdmin } from '../../services/authService'
import { firebaseStatus, getFirebaseAuth } from '../../services/firebase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(firebaseStatus.configured ? undefined : null)

  useEffect(() => {
    if (!firebaseStatus.configured) return undefined
    return onAuthStateChanged(getFirebaseAuth(), setUser)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInAdmin(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  if (user) return <Navigate to="/admin/dashboard" replace />

  return (
    <div className="grid min-h-svh place-items-center bg-ink px-4">
      <div className="w-full max-w-md border border-line bg-ink-soft p-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Admin</p>
        <h1 className="mt-2 font-display text-4xl tracking-[0.12em]">Dashboard login</h1>
        <p className="mt-4 text-sm leading-7 text-stone">
          Sign in with an administrator account created in Firebase Authentication.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs uppercase tracking-[0.16em] text-stone">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="mt-2 h-11 w-full border border-line bg-ink px-3 text-sm text-paper"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.16em] text-stone">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              className="mt-2 h-11 w-full border border-line bg-ink px-3 text-sm text-paper"
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !firebaseStatus.configured}
            className="w-full bg-paper py-3 text-xs uppercase tracking-[0.2em] text-ink disabled:opacity-50"
          >
            {loading ? 'Signing in...' : firebaseStatus.configured ? 'Sign in' : 'Firebase not configured'}
          </button>
        </form>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-gold">
          Back to store
        </Link>
      </div>
    </div>
  )
}
