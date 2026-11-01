import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import AdminLogin from './admin/Login/Login'
import Dashboard from './admin/Dashboard/Dashboard'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Home from './pages/Home/Home'
import Privacy from './pages/Privacy/Privacy'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Shipping from './pages/Shipping/Shipping'
import Shop from './pages/Shop/Shop'
import Terms from './pages/Terms/Terms'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:categorySlug" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
