
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useInView } from 'react-intersection-observer';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedProduct } from '@/models/Product';

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
        currency: "SEK",
        category: product.name.includes("Hoodie") ? "Hoodies" : 
                 product.name.includes("Shirt") ? "Shirts" : 
                 product.name.includes("rash guard") ? "Athletic Wear" : "Apparel",
        image: product.thumbnail_url,
        isNew: Math.random() > 0.7,
        source: 'printful'
      }))
    : [];

  // Take a selection of products
  const allProducts = [...printfulUnified];
  
  // Shuffle and select featured products
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  const displayProducts = shuffled.slice(0, 4);

  // Fallback products if API fails
  const fallbackProducts = [
    {
      id: "fallback-1",
      originalId: 1,
      name: "Performance Tech Tee",
      price: "499 SEK",
      currency: "SEK",
      category: "T-Shirts",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      source: 'printful' as ProductSource
    },
    {
      id: "fallback-2",
      originalId: 2,
      name: "Compression Leggings",
      price: "699 SEK",
      currency: "SEK",
      category: "Bottoms",
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      source: 'printful' as ProductSource
    },
    {
      id: "fallback-3",
      originalId: 3,
      name: "Sculpt Seamless Bra",
      price: "349 SEK",
      currency: "SEK",
      category: "Sports Bras",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      source: 'printful' as ProductSource
    },
    {
      id: "fallback-4",
      originalId: 4,
      name: "Performance Joggers",
      price: "799 SEK",
      currency: "SEK",
      category: "Bottoms",
      image: "https://images.unsplash.com/photo-1556301590-319c5b2ac83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      source: 'printful' as ProductSource
    }
  ];

  // Determine which products to display
  const finalDisplayProducts = displayProducts.length > 0 ? displayProducts : fallbackProducts;

  return (
    <section className="peak-section bg-secondary">
      <div className="peak-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
              Featured Products
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              Top Performers
            </h2>
          </div>
          
          <a href="/shop" className="mt-6 md:mt-0 inline-flex items-center text-sm font-medium group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
        ) : hasError && finalDisplayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load products. Please try again later.</p>
          </div>
        ) : (
          <div 
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {finalDisplayProducts.map((product, index) => (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
