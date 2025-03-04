
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails, PrintfulProductDetail } from '@/services/printfulService';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetails(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    // Set default color when product loads
    if (product && product.sync_variants.length > 0) {
      const availableColors = [...new Set(
        product.sync_variants
          .map(v => v.color)
          .filter(Boolean)
      )];
      
      if (availableColors.length > 0 && !selectedColor) {
        setSelectedColor(availableColors[0] as string);
      }
    }
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    // Would handle cart logic here
    console.log('Added to cart:', {
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="peak-container mt-28 mb-16">
          <Link to="/" className="inline-flex items-center text-sm mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="peak-container mt-28 mb-16 text-center py-12">
          <p className="text-red-500 mb-4">Failed to load product details.</p>
          <Link to="/" className="peak-button inline-flex items-center">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Extract product details
  const { sync_product, sync_variants } = product;
  const productName = sync_product.name;
  const productDescription = sync_product.description || "No description available.";
  const thumbnail = sync_product.thumbnail_url;
  
  // Extract variants info
  const variants = sync_variants || [];
  
  // Get unique colors from variants
  const availableColors = [...new Set(
    variants
      .map(v => v.color)
      .filter(Boolean)
  )];
  
  // Get unique sizes from variants
  const sizes = [...new Set(
    variants
      .map(v => v.size)
      .filter(Boolean)
  )];
  
  // Get product price (use first variant)
  const price = variants.length > 0 ? 
    `$${variants[0].price} ${variants[0].currency}` : 
    "$59.99 USD";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="peak-container mt-28 mb-16">
        <Link to="/" className="inline-flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-secondary relative overflow-hidden">
            <img 
              src={thumbnail} 
              alt={productName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{productName}</h1>
            <p className="text-2xl font-medium">{price}</p>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: productDescription }} />
            
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Color</h3>
                <div className="flex space-x-2">
                  {availableColors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: (color as string).toLowerCase() }}
                      onClick={() => setSelectedColor(color as string)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 border ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-black'
                      }`}
                      onClick={() => setSelectedSize(size as string)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 w-32">
                <button 
                  className="px-3 py-2 border-r border-gray-300"
                  onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center py-2 focus:outline-none"
                />
                <button 
                  className="px-3 py-2 border-l border-gray-300"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex space-x-4">
              <button 
                className="peak-button flex-1 flex items-center justify-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 hover:border-black">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
