
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';
import { Skeleton } from '@/components/ui/skeleton';
import Newsletter from '../components/Newsletter';
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { data: printfulProducts, isLoading, error } = usePrintfulProducts();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    setSearchQuery(search);
  }, [location.search]);

  const categories = [
    { name: 'All', value: null },
    { name: 'T-Shirts', value: 'shirt' },
    { name: 'Hoodies', value: 'hoodie' },
    { name: 'Accessories', value: 'accessory' }
  ];

  const products = printfulProducts && printfulProducts.length > 0 
    ? printfulProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: "$59.99",
        category: product.name.toLowerCase().includes("hoodie") ? "Hoodies" : 
                 product.name.toLowerCase().includes("shirt") || product.name.toLowerCase().includes("tee") ? "T-Shirts" : 
                 product.name.toLowerCase().includes("rash guard") ? "Athletic Wear" : "Accessories",
        image: product.thumbnail_url,
        isNew: Math.random() > 0.7
      }))
    : [];

  // Apply category filter
  let filteredProducts = activeCategory 
    ? products.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()))
    : products;
    
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
              Discover our premium performance apparel designed for peak athleticism and everyday style.
            </p>
            
            {searchQuery && (
              <div className="mt-4 py-2 px-4 bg-secondary/50 inline-block w-fit">
                <p>Search results for: <span className="font-semibold">{searchQuery}</span></p>
              </div>
            )}
            
            <div className="mt-8 flex justify-between flex-wrap gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
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
              
              {/* Filters button removed */}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load products. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
