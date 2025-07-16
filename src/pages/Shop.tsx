import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Newsletter from '../components/Newsletter';
import { useLocation } from 'react-router-dom';
import { UnifiedProduct, ProductSource } from '@/models/Product';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  const isLoading = false;
  const hasError = false;
  
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    setSearchQuery(search);
  }, [location.search]);

  // Categories for filtering
  const categories = [
    { name: 'All', value: null },
    { name: 'T-Shirts', value: 'shirt' },
    { name: 'Hoodies', value: 'hoodie' },
    { name: 'Athletic Wear', value: 'athletic' },
    { name: 'Accessories', value: 'accessory' }
  ];

  // Test products for development
  const testProducts: UnifiedProduct[] = [
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
      name: 'Peak Mode Logo Sweatshirt',
      price: '449 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop',
      isNew: false,
      source: 'test' as ProductSource
    },
    {
      id: 'test-6',
      originalId: 'test-6',
      name: 'Performance Tank Top',
      price: '249 SEK',
      currency: 'SEK',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1506629905607-13e6f5c2b1ce?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    },
    {
      id: 'test-7',
      originalId: 'test-7',
      name: 'Athletic Compression Shirt',
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
      name: 'Premium Athletic Hoodie',
      price: '649 SEK',
      currency: 'SEK',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
      isNew: true,
      source: 'test' as ProductSource
    }
  ];

  // All products now come from test data
  const allProducts = [...testProducts];

  // Apply category filter
  let filteredProducts = activeCategory 
    ? allProducts.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()))
    : allProducts;
    
  // Apply search filter if exists
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="peak-container pt-32 pb-16">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold">Shop Collection</h1>
            <p className="mt-4 text-lg text-foreground/70 max-w-3xl">
              Discover our premium performance apparel and accessories designed for peak athleticism and everyday style.
            </p>
            
            {searchQuery && (
              <div className="mt-4 py-2 px-4 bg-secondary/50 inline-block w-fit">
                <p>Search results for: <span className="font-semibold">{searchQuery}</span></p>
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <span className="py-2 font-medium">Categories:</span>
                {categories.map(category => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.value)}
                    className={`px-4 py-2 whitespace-nowrap ${
                      category.value === activeCategory 
                        ? 'bg-black text-white' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mt-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="p-2 sm:p-3">
                      <Skeleton className="h-3 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasError && filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load products. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mt-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>No products found. Try a different category or search term.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Newsletter />
      </main>
    </div>
  );
};

export default Shop;
