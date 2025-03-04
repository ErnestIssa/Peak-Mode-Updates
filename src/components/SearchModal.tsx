
import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: printfulProducts, isLoading } = usePrintfulProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Filter products based on search term
  const filteredProducts = searchTerm && printfulProducts 
    ? printfulProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const quickLinks = [
    { name: "New Arrivals", href: "/shop" },
    { name: "Best Sellers", href: "/shop" },
    { name: "Women's Collection", href: "/shop" },
    { name: "Men's Collection", href: "/shop" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center">
      <div 
        className="w-full max-w-4xl bg-white shadow-xl flex flex-col h-[80vh] mt-20"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-border">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/70" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-black"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button 
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-foreground/70 hover:text-foreground" />
            </button>
          </form>
        </div>
        
        {/* Search Results */}
        <div className="flex-grow overflow-auto p-6">
          {searchTerm && searchTerm.length > 0 && (
            <h3 className="text-lg font-medium mb-4">
              {filteredProducts.length > 0 
                ? `Results for "${searchTerm}"` 
                : `No results found for "${searchTerm}"`}
            </h3>
          )}
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((result) => (
                <Link 
                  key={result.id} 
                  to={`/product/${result.id}`}
                  className="group"
                  onClick={onClose}
                >
                  <div className="aspect-square overflow-hidden bg-secondary/50">
                    <img 
                      src={result.thumbnail_url} 
                      alt={result.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-2 font-medium group-hover:text-black/70 transition-colors">
                    {result.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : searchTerm && searchTerm.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/70">
                Try checking your spelling or using different search terms.
              </p>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Popular Searches</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {["T-shirts", "Hoodies", "Leggings", "Sports Bras", "Shorts"].map((term, i) => (
                    <button 
                      key={i}
                      className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <p>Loading products...</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {quickLinks.map((link, i) => (
                  <Link 
                    key={i} 
                    to={link.href}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <h3 className="text-lg font-medium mb-4 mt-8">Trending Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {printfulProducts && printfulProducts.slice(0, 3).map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="group"
                    onClick={onClose}
                  >
                    <div className="aspect-square overflow-hidden bg-secondary/50">
                      <img 
                        src={product.thumbnail_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-2 font-medium group-hover:text-black/70 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
