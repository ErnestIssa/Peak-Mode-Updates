
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PeakModePopup from "./components/PeakModePopup";
import SupportPopup from "./components/SupportPopup";
import { usePeakModePopup } from "./hooks/usePeakModePopup";
import { useSupportPopup } from "./hooks/useSupportPopup";
import { useScrollToTop } from "./hooks/useScrollToTop";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import AboutPage from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import TestProductDetail from "./pages/TestProductDetail";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to track location and manage popup
const AppContent = () => {
  const location = useLocation();
  const { isVisible, onClose } = usePeakModePopup();
  const { isVisible: isSupportVisible, onClose: onSupportClose, onOpen: onSupportOpen } = useSupportPopup();
  
  // Scroll to top on route change
  useScrollToTop();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/test-product/:id" element={<TestProductDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews />} />
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
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoadingScreen isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
