import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Newsletter from '../components/Newsletter';
import { useLocation } from 'react-router-dom';
import { UnifiedProduct, ProductSource } from '@/models/Product';
import { productService } from '@/lib/peakModeService';
import { useApiData } from '@/hooks/useApi';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  const location = useLocation();
  
  // Fetch products from backend
  const { data: products, loading: isLoading, error: hasError } = useApiData(
    productService.getAllProducts,
    []
  );
  
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
    { name: 'Accessories', value: 'accessory' },
    { name: 'Sports Bras', value: 'bra' },
    { name: 'Leggings', value: 'leggings' },
    { name: 'Jackets', value: 'jacket' }
  ];

  // Convert backend products to UnifiedProduct format
  const allProducts: UnifiedProduct[] = products?.map((product: any) => ({
    id: product.id || product._id,
    originalId: product.originalId || product.id || product._id,
    name: product.name,
    price: `${product.price} ${product.currency || 'SEK'}`,
    currency: product.currency || 'SEK',
    category: product.category,
    image: product.image,
    isNew: product.isNew || false,
    source: (product.source as ProductSource) || 'backend'
  })) || [];

  // Apply category filter
  let filteredProducts = activeCategory 
    ? allProducts.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()))
    : allProducts;
    
  // Apply search filter if exists
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Shop Collection - Peak Mode"
        description="Browse our complete collection of premium performance apparel, athletic wear, and accessories. Find the perfect gear for your fitness journey."
        keywords="shop, collection, performance apparel, athletic wear, fitness clothing, workout clothes, gym wear, peak mode"
        image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=630&fit=crop"
        url="https://peakmode.com/shop"
      />
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
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mt-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={String(product.id)} {...product} id={String(product.id)} originalId={String(product.originalId)} />
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
