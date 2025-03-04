
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-white/80 backdrop-blur-md text-foreground',
        isScrolled && 'shadow-md'
      )}
    >
      <nav className="peak-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link 
          to="/" 
          className={cn(
            "flex-shrink-0 font-display font-black text-xl md:text-2xl tracking-tighter transition-all text-foreground",
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
              className="nav-link hover:opacity-80 transition-colors text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            className="hover:opacity-70 transition-colors text-foreground" 
            aria-label="Search"
            onClick={() => setSearchModalOpen(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className="hover:opacity-70 transition-colors relative text-foreground" 
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="p-2 text-foreground hover:bg-gray-100 rounded-full transition-colors" 
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
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
            <span className="font-display font-bold text-lg">Menu</span>
            <button 
              className="p-2 text-foreground hover:bg-gray-100 rounded-full transition-colors" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Mobile menu links */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-2">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={cn(
                    "block py-3 px-4 text-lg font-medium border-l-2 hover:bg-gray-50 transition-all rounded-r-lg",
                    link.href === window.location.pathname 
                      ? "border-black text-black font-semibold" 
                      : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
                  )}
                  style={{ 
                    animationDelay: `${index * 75}ms`,
                    animation: mobileMenuOpen ? 'fade-in 0.3s forwards' : 'none' 
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu footer */}
          <div className="border-t border-gray-100 px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="flex flex-col items-center justify-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSearchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Search className="h-6 w-6 mb-1" />
                <span className="text-sm font-medium">Search</span>
              </button>
              
              <Link 
                to="/cart"
                className="flex flex-col items-center justify-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="h-6 w-6 mb-1" />
                <span className="absolute -top-1 right-8 w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  0
                </span>
                <span className="text-sm font-medium">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};

export default Navbar;
