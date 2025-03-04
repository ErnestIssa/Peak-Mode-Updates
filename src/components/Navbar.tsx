
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);
  
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
    { name: 'Home', href: '#' },
    { name: 'Shop', href: '#' },
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <nav className="peak-container flex items-center justify-between h-20">
        {/* Logo */}
        <a 
          href="#" 
          className={cn(
            "flex-shrink-0 font-display font-black text-xl md:text-2xl tracking-tighter transition-all",
            isLogoAnimated && "animate-letter-spacing",
            isScrolled ? "text-foreground" : "text-white"
          )}
          onClick={handleLogoClick}
        >
          PEAK | MODE
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={cn(
                "nav-link",
                isScrolled ? "nav-link-scrolled" : "nav-link-transparent"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>
        
        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            className={cn(
              "hover:opacity-70 transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )} 
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            className={cn(
              "hover:opacity-70 transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )} 
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>
          <button 
            className={cn(
              "hover:opacity-70 transition-colors relative",
              isScrolled ? "text-foreground" : "text-white"
            )} 
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
              0
            </span>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className={cn(
              "p-2",
              isScrolled ? "text-foreground" : "text-white"
            )} 
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
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium py-2 border-b border-border text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          
          <div className="flex items-center justify-around pt-6">
            <button className="flex flex-col items-center space-y-1 text-foreground">
              <Search className="h-6 w-6" />
              <span className="text-sm">Search</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-foreground">
              <User className="h-6 w-6" />
              <span className="text-sm">Account</span>
            </button>
            <button className="flex flex-col items-center space-y-1 relative text-foreground">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                0
              </span>
              <span className="text-sm">Cart</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
