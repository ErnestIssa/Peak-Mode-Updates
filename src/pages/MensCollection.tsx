import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { Button } from '@/components/ui/button';
import { usePrintfulProducts } from '@/hooks/usePrintfulProducts';

const MensCollection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: allProducts, isLoading, error } = usePrintfulProducts();

  // Filter men's products
  const mensProducts = allProducts?.filter(product => 
    product.name.toLowerCase().includes('men') || 
    product.name.toLowerCase().includes('male') ||
    product.category_name?.toLowerCase().includes('men')
  ) || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="h-96 bg-black relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1594938291221-94f18cbb5660?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
          <div className="text-center text-white relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Men's Collection</h1>
            <p className="text-xl max-w-2xl mx-auto">Performance wear for those who push limits</p>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="peak-section bg-secondary/50">
          <div className="peak-container">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <Link to="/womens">
                <Button variant="outline" size="lg" className="w-full md:w-auto">
                  Shop Women's Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/accessories">
                <Button variant="outline" size="lg" className="w-full md:w-auto">
                  Shop Accessories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="peak-section">
          <div className="peak-container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                Our Collection
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                Men's Performance Wear
              </h2>
              <p className="mt-6 text-lg max-w-3xl mx-auto text-muted-foreground">
                Engineered for excellence, designed for those who demand more from their gear.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>Error loading products. Please try again later.</p>
              </div>
            ) : (
              <div 
                ref={ref}
                className={cn(
                  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
              >
                {mensProducts.length > 0 ? (
                  mensProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="transition-all duration-700"
                      style={{ 
                        transitionDelay: `${index * 100}ms`
                      }}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={`${product.retail_price} ${product.currency}`}
                        image={product.thumbnail_url}
                        category={product.category_name || "Men's Wear"}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p>No products available at this time. Please check back later.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <Newsletter />
      </main>
    </div>
  );
};

export default MensCollection; 