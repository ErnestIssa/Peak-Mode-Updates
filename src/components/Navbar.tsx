import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  // Determine if we're on a light page (pages with white/light backgrounds)
  const isLightPage = location.pathname !== '/';
  const textColor = isLightPage ? 'text-black' : 'text-white';
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      // Only show navbar when at the very top of the page
      if (currentScrollY <= 10) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Update cart count whenever localStorage changes
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        const itemCount = cartItems.reduce((count: number, item: any) => count + item.quantity, 0);
        setCartCount(itemCount);
      } else {
        setCartCount(0);
      }
    };
    
    // Call immediately to set initial value
    updateCartCount();
    
    // Listen for changes to localStorage
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates that happen in the same window
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    setIsLogoAnimated(true);
    setTimeout(() => setIsLogoAnimated(false), 1000);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men', href: '/shop' },
    { name: 'Women', href: '/shop' },
    { name: 'Accessories', href: '/shop' }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        textColor,
        isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <nav className="peak-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link 
          to="/" 
          className={cn(
            "flex-shrink-0 font-display font-black text-xl md:text-2xl tracking-tighter transition-all",
            textColor,
            isLogoAnimated && "animate-letter-spacing"
          )}
          onClick={handleLogoClick}
        >
          PEAK | MODE
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={cn("nav-link hover:opacity-80 transition-colors", textColor)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            className={cn("hover:opacity-70 transition-colors", textColor)} 
            aria-label="Search"
            onClick={() => setSearchModalOpen(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className={cn("hover:opacity-70 transition-colors relative", textColor)} 
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center",
              isLightPage ? "bg-black text-white" : "bg-white text-black"
            )}>
              {cartCount}
            </span>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link 
            to="/cart"
            className={cn("hover:opacity-70 transition-colors relative", textColor)} 
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center",
              isLightPage ? "bg-black text-white" : "bg-white text-black"
            )}>
              {cartCount}
            </span>
          </Link>
          
          <button 
            className={cn(
              "p-2 rounded-full transition-colors", 
              textColor,
              isLightPage ? "hover:bg-black/10" : "hover:bg-white/10"
            )} 
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu Dropdown */}
      <div 
        className={cn(
          'absolute top-20 left-0 right-0 bg-white shadow-lg z-40 transition-all duration-300 md:hidden overflow-hidden',
          mobileMenuOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col divide-y divide-gray-100">
          {navLinks.map((link, index) => {
            const isActive = window.location.pathname === link.href;
            return (
              <Link 
                key={link.name} 
                to={link.href} 
                className={cn(
                  "py-4 px-6 font-medium transition-all",
                  isActive 
                    ? "bg-secondary text-foreground" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? 'slide-up 0.3s forwards' : 'none' 
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  )}
                </div>
              </Link>
            );
          })}
          
          <button 
            className="py-4 px-6 text-left font-medium text-gray-600 hover:bg-gray-50 hover:text-foreground transition-all"
            onClick={() => {
              setSearchModalOpen(true);
              setMobileMenuOpen(false);
            }}
            style={{ 
              animationDelay: `${navLinks.length * 50}ms`,
              animation: mobileMenuOpen ? 'slide-up 0.3s forwards' : 'none' 
            }}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};

export default Navbar;
