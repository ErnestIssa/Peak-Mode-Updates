
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Collections = () => {
  const collections = [
    {
      id: 1,
      name: "Training",
      description: "High-intensity training gear designed for peak performance",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      id: 2,
      name: "Essentials",
      description: "Everyday basics with technical performance",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      id: 3,
      name: "Urban Athletics",
      description: "Street style meets athletic performance",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#"
    }
  ];

  return (
    <section id="collections" className="peak-section bg-white">
      <div className="peak-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
            Collections
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">
            Explore Our Collections
          </h2>
          <p className="mt-4 text-foreground/70">
            Discover purpose-built apparel designed for your specific performance needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CollectionCardProps {
  collection: {
    id: number;
    name: string;
    description: string;
    image: string;
    link: string;
  };
  index: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      ref={ref}
      className={cn(
        "relative group overflow-hidden aspect-[3/4] transition-all duration-700",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ 
        transitionDelay: inView ? `${index * 200}ms` : '0ms'
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gray-100"></div>
      
      {/* Image */}
      <img 
        src={collection.image}
        alt={collection.name}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-1000 filter grayscale group-hover:grayscale-0",
          imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
          "group-hover:scale-105"
        )}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
        <p className="text-white/80 mb-4 max-w-xs opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {collection.description}
        </p>
        <a 
          href={collection.link} 
          className="inline-flex items-center text-sm font-medium border-b border-white pb-1 opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:text-white/80"
          style={{ transitionDelay: '0.1s' }}
        >
          Explore Collection
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default Collections;
