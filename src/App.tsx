import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Reviews from './pages/admin/Reviews';
import Customers from './pages/admin/Customers';
import FAQ from './pages/admin/FAQ';
import Marketing from './pages/admin/Marketing';
import Messages from './pages/admin/Messages';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import NewsPage from './pages/News';
import FAQPage from './pages/FAQ';
import NotFound from './pages/NotFound';
import MensCollection from "./pages/MensCollection";
import WomensCollection from "./pages/WomensCollection";
import AccessoriesCollection from "./pages/AccessoriesCollection";
import AboutPage from "./pages/About";
import ReviewsPage from "./pages/Reviews";
import SubmitReview from "./pages/SubmitReview";
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import AdminGuard from './components/AdminGuard';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Check if user has admin access
  const hasAdminAccess = () => {
    const token = localStorage.getItem('adminToken');
    const adminSession = sessionStorage.getItem('adminAccess');
    const adminKeyboard = sessionStorage.getItem('adminKeyboardAccess');
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin_key');
    
    return !!(token || adminSession || adminKeyboard || adminKey === 'peak_mode_admin_2024');
  };

  return (
    <>
      <Toaster position="top-center" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <SiteConfigProvider>
            <Home />
          </SiteConfigProvider>
        } />
        <Route path="/shop" element={
          <SiteConfigProvider>
            <Shop />
          </SiteConfigProvider>
        } />
        <Route path="/product/:id" element={
          <SiteConfigProvider>
            <Product />
          </SiteConfigProvider>
        } />
        <Route path="/cart" element={
          <SiteConfigProvider>
            <Cart />
          </SiteConfigProvider>
        } />
        <Route path="/checkout" element={
          <SiteConfigProvider>
            <Checkout />
          </SiteConfigProvider>
        } />
        <Route path="/contact" element={
          <SiteConfigProvider>
            <Contact />
          </SiteConfigProvider>
        } />
        <Route path="/news" element={
          <SiteConfigProvider>
            <NewsPage />
          </SiteConfigProvider>
        } />
        <Route path="/faq" element={
          <SiteConfigProvider>
            <FAQPage />
          </SiteConfigProvider>
        } />
        <Route path="/reviews" element={
          <SiteConfigProvider>
            <ReviewsPage />
          </SiteConfigProvider>
        } />
        <Route path="/submit-review" element={
          <SiteConfigProvider>
            <SubmitReview />
          </SiteConfigProvider>
        } />
        <Route path="/mens" element={
          <SiteConfigProvider>
            <MensCollection />
          </SiteConfigProvider>
        } />
        <Route path="/womens" element={
          <SiteConfigProvider>
            <WomensCollection />
          </SiteConfigProvider>
        } />
        <Route path="/accessories" element={
          <SiteConfigProvider>
            <AccessoriesCollection />
          </SiteConfigProvider>
        } />
        <Route path="/about" element={
          <SiteConfigProvider>
            <AboutPage />
          </SiteConfigProvider>
        } />

        {/* Admin Routes - Only render if user has admin access or is trying to access secret paths */}
        {(hasAdminAccess() || location.pathname === '/admin/secret-access' || location.pathname.startsWith('/admin')) && (
          <>
            <Route path="/admin/secret-access" element={
              <AdminGuard>
                <Navigate to="/admin/login" replace />
              </AdminGuard>
            } />
            <Route path="/admin/login" element={
              <AdminGuard>
                <AdminLogin />
              </AdminGuard>
            } />
            <Route path="/admin" element={
              <AdminGuard>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </AdminGuard>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="customers" element={<Customers />} />
              <Route path="faqs" element={<FAQ />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </>
        )}

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
