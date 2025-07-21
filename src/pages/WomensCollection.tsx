import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Filter, Grid, List, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { ProductSource } from '@/models/Product';


const WomensCollection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  // Filter categories for women's collection
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'tops', name: 'Tops' },
    { id: 'bottoms', name: 'Bottoms' },
    { id: 'sports-bras', name: 'Sports Bras' },
    { id: 'leggings', name: 'Leggings' },
    { id: 'training', name: 'Training' }
  ];

  // Test products for development
  const testProducts = [
    {
      id: 'test-1',
      originalId: 'test-1',
      name: 'Peak Mode Performance Hoodie',
      price: '599 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    },
    {
      id: 'test-2',
      originalId: 'test-2',
      name: 'Elite Training T-Shirt',
      price: '299 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-3',
      originalId: 'test-3',
      name: 'Athletic Performance Shorts',
      price: '399 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    },
    {
      id: 'test-4',
      originalId: 'test-4',
      name: 'Premium Workout Leggings',
      price: '499 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-5',
      originalId: 'test-5',
      name: 'Peak Mode Classic Tee',
      price: '279 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-6',
      originalId: 'test-6',
      name: 'Performance Training Jacket',
      price: '699 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    },
    {
      id: 'test-7',
      originalId: 'test-7',
      name: 'Elite Compression Shirt',
      price: '349 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-8',
      originalId: 'test-8',
      name: 'Peak Mode Training Jacket',
      price: '699 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    },
    {
      id: 'test-9',
      originalId: 'test-9',
      name: 'Performance Sports Bra',
      price: '399 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-10',
      originalId: 'test-10',
      name: 'Elite Training Pants',
      price: '549 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-11',
      originalId: 'test-11',
      name: 'Peak Mode Classic Tee',
      price: '279 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-12',
      originalId: 'test-12',
      name: 'Performance Training Shorts',
      price: '399 SEK',
      currency: 'SEK',
      category: 'Athletic Wear',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    }
  ];

  const womensProducts = testProducts;

  const filteredProducts = womensProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    // In real app, you'd filter by actual category
    return product.name.toLowerCase().includes(selectedCategory);
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Women's Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            WOMEN'S COLLECTION
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 max-w-2xl mx-auto">
            Power in Motion.
          </p>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Engineered for movement. Designed to empower.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            From full-body strength sessions to on-the-go comfort, our women's apparel is tailored to empower. Designed with advanced stretch, breathability, and a perfect fit that moves with you.
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid' ? "bg-black text-white" : "text-gray-600 hover:text-black"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list' ? "bg-black text-white" : "text-gray-600 hover:text-black"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  currency={product.currency}
                  category="Women's Apparel"
                  source={product.source}
                  originalId={product.originalId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not sure where to start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our best-selling women's gear and discover what empowers Peak Mode athletes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Best Sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-white text-white px-8 py-3 font-medium rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WomensCollection; 