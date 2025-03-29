
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useInView } from 'react-intersection-observer';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedProduct, ProductSource } from '@/models/Product';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const FeaturedProducts = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: printfulProducts, isLoading: printfulLoading, error: printfulError } = usePrintfulProducts();

  const isLoading = printfulLoading;
  const hasError = printfulError;

  // Convert Printful products to unified format
  const printfulUnified: UnifiedProduct[] = printfulProducts && printfulProducts.length > 0 
    ? printfulProducts.map(product => ({
        id: `printful-${product.id}`,
        originalId: product.id,
        name: product.name,
        price: product.price || "499 SEK",
        currency: product.currency || "SEK",
        category: product.name.includes("Hoodie") ? "Hoodies" : 
                 product.name.includes("Shirt") ? "Shirts" : 
                 product.name.includes("rash guard") ? "Athletic Wear" : "Apparel",
        image: product.thumbnail_url,
        isNew: Math.random() > 0.7,
        source: 'printful' as ProductSource
      }))
    : [];

  // Take a selection of products
  const allProducts = [...printfulUnified];
  
  // Shuffle and select featured products
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  const displayProducts = shuffled.slice(0, 4);

  return (
    <section className="peak-section bg-secondary">
      <div className="peak-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
              Featured Products
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              Top Performers
            </h2>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-3">
                  <Skeleton className="h-3 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError && displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load products. Please try again later.</p>
          </div>
        ) : (
          <div 
            ref={ref}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className={cn(
                    "transition-all duration-700",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ 
                    transitionDelay: inView ? `${index * 100 + 300}ms` : '0ms'
                  }}
                >
                  <ProductCard {...product} />
                </div>
              ))
            ) : (
              <div className="col-span-2 lg:col-span-4 text-center py-12">
                <p>No products available at this time. Please check back later.</p>
              </div>
            )}
          </div>
        )}
        
        {/* View All Products Button */}
        <div className="mt-10 text-center">
          <Link to="/shop">
            <Button className="px-6 py-2 bg-black text-white hover:bg-black/90 flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
