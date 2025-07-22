import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Award, Clock, Package, Shield, Leaf, MessageCircle, RotateCcw, Truck, CreditCard, Zap, HelpCircle, RefreshCcw, Star, Instagram, Facebook, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const AboutStore = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Rotating text phrases
  const rotatingTexts = [
    "A mode You enter.",
    "A mindset You wear."
  ];
  
  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 5000); // Change text every 5 seconds to match background images
    
    return () => clearInterval(textInterval);
  }, []);

  const infoBlocks = [
    {
      icon: <Truck className="h-8 w-8 text-black" />,
      title: "Fast Delivery",
      description: "Get your gear quickly. Orders processed within 24h and delivered across Sweden in 1–3 business days."
    },
    {
      icon: <Award className="h-8 w-8 text-black" />,
      title: "Premium Quality",
      description: "Tested by athletes. Built for performance, comfort, and style — from gym to street."
    },
    {
      icon: <Shield className="h-8 w-8 text-black" />,
      title: "Secure Payments",
      description: "Shop confidently with secure checkout powered by Stripe. Your data is always protected."
    },
    {
      icon: <Leaf className="h-8 w-8 text-black" />,
      title: "Sustainable",
      description: "Consciously made. We aim for eco-friendly materials and mindful packaging."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-black" />,
      title: "Responsive Support",
      description: "Need help? Our team responds within 24 hours. We're always here to assist."
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-black" />,
      title: "30-Day Return Policy",
      description: "Not the right fit? Return within 30 days — no stress, no hidden fees."
    },
    {
      icon: <Package className="h-8 w-8 text-black" />,
      title: "Free Shipping Over 899 kr",
      description: "Enjoy complimentary shipping on all orders above 899 kr. Quality and convenience, no compromises."
    },
    {
      icon: <Zap className="h-8 w-8 text-black" />,
      title: "Limited Drops",
      description: "We produce in small, exclusive batches. Get yours before it's gone."
    }
  ];

  const athleteImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <section className="peak-section">
      <div className="peak-container">
        {/* Hero About Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div 
              ref={textRef}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Peak Mode — Not Just Apparel.
                    <br />
                    <div className="relative overflow-hidden h-[1.2em]">
                      {rotatingTexts.map((text, index) => (
                        <span 
                          key={index}
                          className={cn(
                            "text-muted-foreground absolute top-0 left-0 transition-all transform duration-700",
                            currentTextIndex === index 
                              ? "opacity-100 translate-x-0" 
                              : index < currentTextIndex 
                                ? "opacity-0 -translate-x-full" 
                                : "opacity-0 translate-x-full"
                          )}
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  </h2>
                </div>
                
                <p className="text-xl font-semibold text-black">
                  You weren't made to blend in. You were made to evolve.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Peak Mode, we don't follow trends — we follow truth. The quiet truth of those who train in silence, grow through discomfort, and show up when no one's watching.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We built this brand for the grinders, the early risers, the ones who chase progress like it's personal — because it is.
                </p>
              </div>

              <div className="space-y-6">
                {/* Athlete Image */}
                <div className="w-full h-64 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Athlete in training" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="bg-black text-white p-6 rounded-lg">
                  <p className="text-xl font-bold mb-2">This isn't just activewear.</p>
                  <p className="text-lg">It's a mindset you wear.</p>
                  <p className="text-base mt-2">A daily reminder that your best isn't behind you — it's the peak ahead.</p>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each piece is crafted for more than comfort or performance — it's for the moments between reps, between doubt and discipline. Gear that feels like fuel, not just fabric.
                </p>
              </div>

              {/* What sets us apart */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">What sets Peak Mode apart?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-black mb-2">Designed for both the gym and the grind outside it</h4>
                      <p className="text-sm text-muted-foreground">Versatile performance gear that transitions seamlessly from workout to everyday life.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-black mb-2">Rooted in purpose — not perfection</h4>
                      <p className="text-sm text-muted-foreground">Built for progress, not perfection. Every piece serves a purpose in your journey.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-black mb-2">Created by someone who lives this journey, just like you</h4>
                      <p className="text-sm text-muted-foreground">Authentic gear designed by someone who understands the grind firsthand.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether you're starting out or leveling up, the path is the same: keep showing up.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Because greatness isn't loud — it's consistent. And that's exactly what we built Peak Mode for.
                </p>
                <p className="text-xl font-bold text-black">
                  So don't wait for the perfect moment — create it.
                </p>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">🔗 Ready to enter the mode?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/shop">
                    <Button size="lg" className="group w-full sm:w-auto">
                      Shop the Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                      Learn the Story
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side - Image Gallery */}
            <div className="grid grid-cols-2 gap-4 h-[600px] lg:h-[700px]">
              <div className="space-y-4">
                <div className="h-1/2 overflow-hidden rounded-lg">
                  <img 
                    src={athleteImages[0]} 
                    alt="Athlete training" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-1/2 overflow-hidden rounded-lg">
                  <img 
                    src={athleteImages[1]} 
                    alt="Athlete in gym" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-1/2 overflow-hidden rounded-lg">
                  <img 
                    src={athleteImages[2]} 
                    alt="Athlete running" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-1/2 overflow-hidden rounded-lg">
                  <img 
                    src={athleteImages[3]} 
                    alt="Athlete lifting" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-12"
        >
          {infoBlocks.map((block, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center text-center p-6">
                {block.icon}
                <h3 className="text-xl font-bold mt-4">{block.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {block.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStore;
