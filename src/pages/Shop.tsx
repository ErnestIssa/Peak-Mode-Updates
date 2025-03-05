
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';
import { useCJProducts } from '@/hooks/useCJProducts';
import { Skeleton } from '@/components/ui/skeleton';
import Newsletter from '../components/Newsletter';
import { useLocation } from 'react-router-dom';
import { UnifiedProduct } from '@/models/Product';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  const { data: printfulProducts, isLoading: printfulLoading, error: printfulError } = usePrintfulProducts();
  const { data: cjProducts, isLoading: cjLoading, error: cjError } = useCJProducts();
  
  const isLoading = printfulLoading || cjLoading;
  const hasError = printfulError || cjError;
  
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    setSearchQuery(search);
  }, [location.search]);

  // Categories and sources for filtering
  const categories = [
    { name: 'All', value: null },
    { name: 'T-Shirts', value: 'shirt' },
    { name: 'Hoodies', value: 'hoodie' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Accessories', value: 'accessory' }
  ];
  
  const sources = [
    { name: 'All Sources', value: null },
    { name: 'Printful', value: 'printful' },
    { name: 'CJ Dropshipping', value: 'cjdropshipping' }
  ];

  // Convert Printful products to unified format
  const printfulUnified: UnifiedProduct[] = printfulProducts && printfulProducts.length > 0 
    ? printfulProducts.map(product => ({
        id: `printful-${product.id}`,
        originalId: product.id,
        name: product.name,
        price: "499 SEK", // Default price since Printful API doesn't return prices in the products list
        currency: "SEK",
        category: product.name.includes("Hoodie") ? "Hoodies" : 
                 product.name.includes("Shirt") ? "Shirts" : 
                 product.name.includes("rash guard") ? "Athletic Wear" : "Apparel",
        image: product.thumbnail_url,
        isNew: Math.random() > 0.7,
        source: 'printful'
      }))
    : [];

  // Convert CJ products to unified format
  const cjUnified: UnifiedProduct[] = cjProducts && cjProducts.length > 0 
    ? cjProducts.map(product => ({
        id: `cj-${product.id}`,
        originalId: product.id,
        name: product.productNameEn || product.productName,
        price: `${product.sellingPrice} SEK`,
        currency: "SEK",
        category: product.categoryName || 
                (product.productNameEn?.includes("earbuds") || product.productName?.includes("earbuds")) ? "Electronics" :
                "Accessories",
        image: product.productImage,
        isNew: Math.random() > 0.7,
        source: 'cjdropshipping'
      }))
    : [];

  // Combine all products
  const allProducts = [...printfulUnified, ...cjUnified];

  // Apply source filter
  let filteredBySource = activeSource 
    ? allProducts.filter(p => p.source === activeSource)
    : allProducts;
    
  // Apply category filter
  let filteredProducts = activeCategory 
    ? filteredBySource.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()))
    : filteredBySource;
    
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
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <span className="py-2 font-medium">Sources:</span>
                {sources.map(source => (
                  <button
                    key={source.name}
                    onClick={() => setActiveSource(source.value)}
                    className={`px-4 py-2 whitespace-nowrap ${
                      source.value === activeSource 
                        ? 'bg-black text-white' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
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
            ) : hasError && filteredProducts.length === 0 ? (
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
                    <p>No products found. Try a different category, source, or search term.</p>
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
