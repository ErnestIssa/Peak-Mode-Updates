
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PeakModePopup from "./components/PeakModePopup";
import SupportPopup from "./components/SupportPopup";
import GlobalWishlistModal from "./components/GlobalWishlistModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { AdminProvider } from "./contexts/AdminContext";
import { usePeakModePopup } from "./hooks/usePeakModePopup";
import { useSupportPopup } from "./hooks/useSupportPopup";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { useReloadNavigation } from "./hooks/useReloadNavigation";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import MensCollection from "./pages/MensCollection";
import WomensCollection from "./pages/WomensCollection";
import AccessoriesCollection from "./pages/AccessoriesCollection";
import AboutPage from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import TestProductDetail from "./pages/TestProductDetail";
import TestProduct from "./pages/TestProduct";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import ThankYou from "./pages/ThankYou";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataProtection from "./pages/DataProtection";
import CookiePolicy from "./pages/CookiePolicy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to track location and manage popup
const AppContent = () => {
  const location = useLocation();
  const { isVisible, onClose } = usePeakModePopup();
  const { isVisible: isSupportVisible, onClose: onSupportClose, onOpen: onSupportOpen } = useSupportPopup();
  
  // Scroll to top on route change
  useScrollToTop();
  
  // Handle reload navigation
  useReloadNavigation();

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        <Route path="/mens-collection" element={<MensCollection />} />
        <Route path="/womens-collection" element={<WomensCollection />} />
        <Route path="/accessories-collection" element={<AccessoriesCollection />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/test-product/:id" element={<TestProductDetail />} />
                <Route path="/test-product" element={<TestProduct />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-protection" element={<DataProtection />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      
      <PeakModePopup 
        isVisible={isVisible} 
        onClose={onClose} 
      />

      <SupportPopup
        isVisible={isSupportVisible}
        onClose={onSupportClose}
        onOpen={onSupportOpen}
      />

      <GlobalWishlistModal />
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Check if this is a fresh session
    const hasSeenLoading = sessionStorage.getItem('peakModeLoadingSeen');
    return !hasSeenLoading;
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('peakModeLoadingSeen', 'true');
  };

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AdminProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppContent />
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
