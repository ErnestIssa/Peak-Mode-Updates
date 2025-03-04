
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealText, setRevealText] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealText(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className={cn(
            "w-full h-full object-cover opacity-0 transition-all duration-1000",
            imageLoaded ? "opacity-100 blur-0" : "blur-md"
          )}
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(https://files.cdn.printful.com/files/486/486a3d8c695befaf9bf9c6b9c31901ec_preview.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)'
          }}
        />
        <img 
          src="https://files.cdn.printful.com/files/486/486a3d8c695befaf9bf9c6b9c31901ec_preview.png" 
          alt="Hero Background" 
          className="hidden" 
          onLoad={handleImageLoad}
        />
      </div>
      
      {/* Content */}
      <div className="peak-container relative z-10 mt-20 md:mt-0 flex flex-col items-center md:items-start text-white justify-center min-h-screen">
        <div className="max-w-3xl">
          <div className={cn(
            "overflow-hidden transition-all duration-500 delay-300",
            revealText ? "opacity-100" : "opacity-0"
          )}>
            <span className="inline-block text-sm md:text-base uppercase tracking-wider pb-4 border-b border-white/30 animate-fade-in">
              Premium Performance Apparel
            </span>
          </div>
          
          <h1 className={cn(
            "mt-6 text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter transition-all duration-700 delay-500",
            revealText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            NO LIMITS.<br />JUST PEAKS.
          </h1>
          
          <p className={cn(
            "mt-6 max-w-xl text-white/80 text-lg md:text-xl leading-relaxed transition-all duration-700 delay-700",
            revealText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            High-performance fitness apparel engineered for strength, endurance, and crafted for style. 
            Push your limits and elevate your game—on the streets and in the gym.
          </p>
          
          <div className={cn(
            "mt-10 flex space-x-4 transition-all duration-700 delay-900",
            revealText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <a 
              href="#collections" 
              className="bg-white text-black px-5 py-2 font-medium tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>Shop Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a 
              href="#about" 
              className="border border-white px-5 py-2 font-medium tracking-wide hover:bg-white/10 transition-all duration-300"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-slide-up"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
