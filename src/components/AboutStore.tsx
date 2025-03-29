
import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Award, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const AboutStore = () => {
  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="peak-section">
      <div className="peak-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative h-[400px] md:h-full overflow-hidden rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Peak Mode Store" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-sm md:text-base font-medium">
                Crafted with precision for your peak performance
              </p>
            </div>
          </div>

          {/* Right side - Content */}
          <div 
            ref={textRef}
            className={cn(
              "space-y-6 transition-all duration-700",
              textInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <div>
              <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                About Peak Mode
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">
                Elevate Your Performance
              </h2>
            </div>
            <p className="text-muted-foreground">
              At Peak Mode, we craft premium fitness apparel that combines cutting-edge 
              technology with minimalist design. Our products are built to enhance your 
              performance while ensuring maximum comfort during even the most intense workouts.
            </p>
            <p className="text-muted-foreground">
              Each piece is meticulously designed with durability and functionality in mind, 
              using sustainable materials that minimize environmental impact without compromising 
              on quality.
            </p>
            <div className="pt-2">
              <Link to="/about">
                <Button variant="outline" className="group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div 
          ref={statsRef}
          className={cn(
            "grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 transition-all duration-700",
            statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Award className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Crafted with the finest materials for durability and comfort
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Package className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Sustainable</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Eco-friendly production with recyclable packaging
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm col-span-2 md:col-span-1">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Clock className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Quick delivery to get you moving in no time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutStore;
