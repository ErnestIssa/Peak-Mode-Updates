import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "NO LIMITS.\nJUST PEAKS.", 
  subtitle = "Premium Performance Apparel",
  backgroundImage
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of background images reduced to 3 - use admin image if provided
  const backgroundImages = backgroundImage 
    ? [backgroundImage, ...["https://wallpaperaccess.com/full/1244717.jpg", "https://www.brickbodies.com/wp-content/uploads/2020/10/Runner-1.jpg", "https://wallpaperaccess.com/full/5738912.jpg"].slice(1)]
    : [
        "https://wallpaperaccess.com/full/1244717.jpg",
        "https://www.brickbodies.com/wp-content/uploads/2020/10/Runner-1.jpg",
        "https://wallpaperaccess.com/full/5738912.jpg"
      ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealText(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((image, index) => (
          <div 
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-all transform duration-700",
              currentImageIndex === index 
                ? "opacity-100 translate-x-0" 
                : index < currentImageIndex 
                  ? "opacity-0 -translate-x-full" 
                  : "opacity-0 translate-x-full",
              index === 0 ? 'bg-center' : '',
              index === 1 ? 'bg-center md:bg-bottom' : '',
              index === 2 ? 'bg-[90%_center] md:bg-center' : ''
            )}
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${image})`,
              backgroundSize: 'cover',
              filter: 'grayscale(100%)'
            }}
          />
        ))}
        <img 
          src={backgroundImages[0]}
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
              {subtitle}
            </span>
          </div>
          
          <h1 className={cn(
            "mt-6 text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter transition-all duration-700 delay-500",
            revealText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          <div className={cn(
            "mt-10 flex space-x-4 transition-all duration-700 delay-900",
            revealText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <Link 
              to="/shop" 
              className="bg-white text-black px-5 py-2 font-medium tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 group"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/about" 
              className="border border-white px-5 py-2 font-medium tracking-wide hover:bg-white/10 transition-all duration-300"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-3 z-20">
        {backgroundImages.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-2 bg-white rounded-full transition-all duration-500",
              currentImageIndex === index ? "w-8 opacity-100" : "w-2 opacity-60"
            )}
          />
        ))}
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
