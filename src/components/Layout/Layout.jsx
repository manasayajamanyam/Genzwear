import { Outlet } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton'

export default function Layout() {
  const { loading, error } = useStore()

  if (loading) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink text-sm uppercase tracking-[0.24em] text-stone">
        Loading GEN Z WEAR
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink px-6 text-center">
        <p className="max-w-md text-sm text-stone">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-ink text-paper">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton floating />
    </div>
  )
}
