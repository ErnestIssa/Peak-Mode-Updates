
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: string;
  category: string;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  price,
  category,
  isNew = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="product-card flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="relative overflow-hidden aspect-[3/4]">
        {/* Product Image */}
        <div className="w-full h-full bg-secondary/50"></div>
        <img
          src={image}
          alt={name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700",
            imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
            isHovered ? "scale-105" : "scale-100"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* New Tag */}
        {isNew && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
            New
          </div>
        )}
        
        {/* Quick Add */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-black text-white py-3 flex justify-center items-center space-x-2 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-sm font-medium">Quick Add</span>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-foreground/60 uppercase tracking-wider">{category}</span>
        <h3 className="mt-1 font-medium">{name}</h3>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="font-medium">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
