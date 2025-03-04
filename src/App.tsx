
import { useEffect } from 'react'
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom'
import './App.css'
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import Shop from '@/pages/Shop'
import Contact from '@/pages/Contact'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import OrderConfirmation from '@/pages/OrderConfirmation'
import { Toaster } from '@/components/ui/sonner'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
