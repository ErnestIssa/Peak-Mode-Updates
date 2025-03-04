
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section id="about" className="peak-section bg-white">
      <div className="peak-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div 
              ref={titleRef} 
              className={cn(
                "transition-all duration-700 delay-300",
                titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                About Us
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                About Peak Mode
              </h2>
            </div>
            
            <div 
              ref={textRef}
              className={cn(
                "mt-6 space-y-6 text-foreground/80 transition-all duration-700 delay-500",
                textInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <p className="text-lg leading-relaxed">
                At Peak Mode, we believe fitness is more than just a routine—it's a mindset. 
                Our brand is built for those who refuse to settle, who push past limits, 
                and who strive for greatness in every workout and every moment.
              </p>
              
              <p className="text-lg leading-relaxed">
                We design high-performance fitness apparel that blends functionality with style, 
                making sure you look and feel your best—whether you're in the gym or on the streets. 
                Our gear is crafted for durability, comfort, and peak performance—so you can just focus 
                on crushing your goals.
              </p>
              
              <p className="text-lg leading-relaxed font-medium">
                Join the Peak Mode movement. No Limits. Just Peaks.
              </p>
            </div>
          </div>
          
          <div 
            ref={statsRef}
            className={cn(
              "grid grid-cols-2 gap-6 transition-all duration-700 delay-700",
              statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">100%</span>
              <span className="block mt-2 text-foreground/70">Premium Materials</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">24/7</span>
              <span className="block mt-2 text-foreground/70">Performance Ready</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">50+</span>
              <span className="block mt-2 text-foreground/70">Unique Designs</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">10k+</span>
              <span className="block mt-2 text-foreground/70">Happy Athletes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
