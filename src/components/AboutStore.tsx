import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Award, Clock, Package, Truck, RefreshCw, Shirt, HelpCircle, MessageCircle, RefreshCcw, Star, Instagram, Facebook, Music } from 'lucide-react';
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
              Peak Mode isn't just another fitness brand — it's a declaration of intent. Born from the grind, not the spotlight, we design performance gear that honors consistency, not clout. Our journey began with one goal: to create apparel that mirrors the inner discipline of those who train with purpose. Every stitch is shaped by the belief that your peak isn't a place — it's a mindset you choose, rep after rep.
            </p>
            <p className="text-muted-foreground">
              From our signature performance shorts to everything that follows, every product is built to serve athletes of all levels who move with quiet determination. No gimmicks. No noise. Just quality, functionality, and an identity you can wear. Because when you commit to progress, you enter Peak Mode — and that's when transformation begins.
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
          
          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Clock className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We ship within 1–3 working days across all of Sweden — so you can gear up without the wait
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <RefreshCw className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">30-Day Return Policy</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Not satisfied? No problem. Return your item within 30 days — no questions asked.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Truck className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Free Shipping Over 899 kr</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Enjoy free standard shipping on all orders above 899 kr. Delivered fast, straight to your door.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Shirt className="h-8 w-8 mb-4 text-black" />
              <h3 className="text-xl font-bold">Easy Size Exchange & Returns</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Wrong size? We've got you. Quick and hassle-free exchanges or returns, guaranteed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support and Social Links Section */}
        <div className="mt-16 border-t pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Support Column */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Support</h3>
              <div className="space-y-4">
                <Link to="/contact" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>Customer Support</span>
                </Link>
                <Link to="/faq" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <HelpCircle className="h-5 w-5" />
                  <span>FAQ</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <RefreshCcw className="h-5 w-5" />
                  <span>Exchanges & Returns</span>
                </Link>
                <Link to="/reviews" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <Star className="h-5 w-5" />
                  <span>Reviews</span>
                </Link>
              </div>
            </div>

            {/* Follow Us Column */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
              <div className="space-y-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-black transition-colors">
                  <Music className="h-5 w-5" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStore;
