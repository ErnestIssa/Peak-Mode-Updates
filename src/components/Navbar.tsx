
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
            className="p-2 text-foreground" 
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 top-20 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col px-4 pt-8 pb-6 space-y-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className="text-lg font-medium py-2 border-b border-border text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center justify-around pt-6">
            <button 
              className="flex flex-col items-center space-y-1 text-foreground"
              onClick={() => {
                setSearchModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <Search className="h-6 w-6" />
              <span className="text-sm">Search</span>
            </button>
            <Link 
              to="/cart"
              className="flex flex-col items-center space-y-1 relative text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                0
              </span>
              <span className="text-sm">Cart</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};

export default Navbar;
