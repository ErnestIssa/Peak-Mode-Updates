
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
                Om Oss
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Om Peak Mode
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
                På Peak Mode tror vi att fitness är mer än bara en rutin—det är ett tankesätt. 
                Vårt varumärke är byggt för de som vägrar att nöja sig, som tänjer på gränserna, 
                och som strävar efter storhet i varje träningspass och varje ögonblick.
              </p>
              
              <p className="text-lg leading-relaxed">
                Vi designar högpresterande träningskläder som kombinerar funktionalitet med stil, 
                och ser till att du ser och känner dig som bäst—oavsett om du är i gymmet eller på gatorna. 
                Våra kläder är tillverkade för hållbarhet, komfort och topprestanda—så att du kan fokusera 
                på att krossa dina mål.
              </p>
              
              <p className="text-lg leading-relaxed font-medium">
                Gå med i Peak Mode-rörelsen. Inga Gränser. Bara Toppar.
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
              <span className="block mt-2 text-foreground/70">Premium Material</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">24/7</span>
              <span className="block mt-2 text-foreground/70">Redo För Prestanda</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">50+</span>
              <span className="block mt-2 text-foreground/70">Unika Designs</span>
            </div>
            
            <div className="p-8 border border-border bg-secondary/50">
              <span className="block text-5xl font-bold">10k+</span>
              <span className="block mt-2 text-foreground/70">Nöjda Atleter</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
