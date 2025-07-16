import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductSource } from '@/models/Product';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const FeaturedProducts = () => {
  const { ref: desktopRef, inView: desktopInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: mobileRef, inView: mobileInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const displayProducts = testProducts;

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
        
        {/* Desktop/Tablet Grid Layout */}
        <div 
          ref={desktopRef}
          className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {displayProducts.map((product, index) => (
            <div 
              key={product.id}
              className={cn(
                "transition-all duration-700",
                desktopInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ 
                transitionDelay: desktopInView ? `${index * 100 + 300}ms` : '0ms'
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll Layout */}
        <div className="md:hidden">
          <div ref={mobileRef} className="space-y-4">
            {/* First Row - First 6 products */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                {displayProducts.slice(0, 6).map((product, index) => (
                  <div 
                    key={product.id}
                    className={cn(
                      "w-32 flex-shrink-0 transition-all duration-700",
                      mobileInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ 
                      transitionDelay: mobileInView ? `${index * 100 + 300}ms` : '0ms'
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row - Last 6 products */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                {displayProducts.slice(6, 12).map((product, index) => (
                  <div 
                    key={product.id}
                    className={cn(
                      "w-32 flex-shrink-0 transition-all duration-700",
                      mobileInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ 
                      transitionDelay: mobileInView ? `${(index + 6) * 100 + 300}ms` : '0ms'
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
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
