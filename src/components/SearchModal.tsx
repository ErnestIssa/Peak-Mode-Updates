
import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon, TrendingUp, Star, Clock, Flame, Zap, Target, Dumbbell, Heart, Users, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Comprehensive product data for fitness brand
  const allProducts = [
    {
      id: 'hoodie-1',
      name: 'Peak Mode Performance Hoodie',
      price: '599 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['performance', 'training', 'athletic']
    },
    {
      id: 'tshirt-1',
      name: 'Elite Training T-Shirt',
      price: '299 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['training', 'gym', 'fitness']
    },
    {
      id: 'shorts-1',
      name: 'Athletic Performance Shorts',
      price: '399 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['performance', 'running', 'training']
    },
    {
      id: 'leggings-1',
      name: 'Premium Training Leggings',
      price: '499 SEK',
      currency: 'SEK',
      category: 'Leggings',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['yoga', 'fitness', 'comfort']
    },
    {
      id: 'bra-1',
      name: 'High-Impact Sports Bra',
      price: '349 SEK',
      currency: 'SEK',
      category: 'Sports Bras',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['support', 'running', 'high-impact']
    },
    {
      id: 'jacket-1',
      name: 'Weather-Resistant Training Jacket',
      price: '799 SEK',
      currency: 'SEK',
      category: 'Jackets',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      source: 'test',
      tags: ['weather', 'outdoor', 'training']
    }
  ];

  // Recommended searches for fitness industry
  const recommendedSearches = [
    { term: 'Training Tops', icon: <Target className="w-4 h-4" />, category: 'Performance' },
    { term: 'Athletic Shorts', icon: <Zap className="w-4 h-4" />, category: 'Performance' }
  ];

  // Quick navigation categories
  const quickCategories = [
    { name: "New Arrivals", href: "/shop?category=new", icon: <Clock className="w-4 h-4" />, color: "bg-black" },
    { name: "Best Sellers", href: "/shop?category=bestsellers", icon: <Star className="w-4 h-4" />, color: "bg-black" },
    { name: "Women's Collection", href: "/womens-collection", icon: <Heart className="w-4 h-4" />, color: "bg-black" },
    { name: "Men's Collection", href: "/mens-collection", icon: <Target className="w-4 h-4" />, color: "bg-black" },
    { name: "Accessories", href: "/accessories-collection", icon: <Zap className="w-4 h-4" />, color: "bg-black" },
    { name: "Sale Items", href: "/shop?category=sale", icon: <Flame className="w-4 h-4" />, color: "bg-black" }
  ];

  // Trending searches
  const trendingSearches = [
    'Performance Wear', 'Athletic Shorts', 'Training Tops', 'Sports Bras', 
    'Leggings', 'Hoodies', 'Jackets', 'Accessories'
  ];

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Filter products based on search term
  const filteredProducts = searchTerm && allProducts 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full z-[80] bg-black/50 backdrop-blur-sm flex justify-center"
      onClick={handleOverlayClick}
    >
      <div 
        className="w-full max-w-6xl bg-white shadow-xl flex flex-col h-[90vh] mt-10 relative z-[90]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-gray-50 to-white">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/70" />
            <input
              type="text"
              placeholder="Search for performance wear, training gear, athletic clothing..."
              className="w-full pl-12 pr-12 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-lg"
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
        
        {/* Search Content */}
        <div className="flex-grow overflow-auto">
          {searchTerm && searchTerm.length > 0 ? (
            // Search Results
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">
                  {filteredProducts.length > 0 
                    ? `Results for "${searchTerm}"` 
                    : `No results found for "${searchTerm}"`}
                </h3>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((result) => (
                    <Link 
                      key={result.id} 
                      to={`/product/${result.id}`}
                      className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                      onClick={onClose}
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100">
                        <img 
                          src={result.image} 
                          alt={result.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                          {result.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{result.category}</p>
                        <p className="text-sm font-semibold text-black mt-1">{result.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-6">
                    Try checking your spelling or using different search terms.
                  </p>
                  <div className="max-w-md mx-auto">
                    <h4 className="font-semibold mb-4 text-gray-800">Popular Searches</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trendingSearches.slice(0, 6).map((term, i) => (
                        <button 
                          key={i}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-full transition-colors"
                          onClick={() => setSearchTerm(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Default View - Recommended Searches and Quick Navigation
            <div className="p-6">
              {/* Recommended Searches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Recommended Searches</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search.term)}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                    >
                      <div className="text-blue-600 group-hover:text-blue-700">
                        {search.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{search.term}</p>
                        <p className="text-sm text-gray-600">{search.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Categories */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Quick Navigation</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {quickCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={category.href}
                      className="flex flex-col items-center p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-md group"
                      onClick={onClose}
                    >
                      <div className={`p-2 rounded-full ${category.color} text-white mb-2 group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <p className="text-sm font-medium text-center text-gray-900">{category.name}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Trending Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allProducts.slice(0, 4).map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                      onClick={onClose}
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                        <p className="text-sm font-semibold text-black mt-1">{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
