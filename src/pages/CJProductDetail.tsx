
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCJProductDetail } from '@/services/cjdropshippingService';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CJProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['cj-product', id],
    queryFn: () => fetchCJProductDetail(id as string),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.productNameEn || product.productName,
      price: product.sellingPrice,
      image: product.productImage,
      size: null,
      color: null,
      quantity: quantity,
      currency: "SEK",
      source: 'cjdropshipping'
    };
    
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItemIndex = cartItems.findIndex((item: any) => 
      item.id === cartItem.id && 
      item.size === cartItem.size && 
      item.color === cartItem.color &&
      item.source === cartItem.source
    );
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    toast.success("Added to cart successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="peak-container mt-28 mb-16">
          <Link to="/shop" className="inline-flex items-center text-sm mb-8">
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
          <Link to="/shop" className="inline-flex items-center px-6 py-3 bg-black text-white">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productName = product.productNameEn || product.productName;
  const price = `${product.sellingPrice} SEK`;
  const productDescription = `${productName} - SKU: ${product.productSku}`;
  const thumbnail = product.productImage;
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="peak-container mt-28 mb-16">
        <Link to="/shop" className="inline-flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary relative overflow-hidden">
            <img 
              src={thumbnail} 
              alt={productName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div className="inline-block px-2 py-1 bg-gray-100 text-xs">CJ Dropshipping</div>
            <h1 className="text-3xl font-bold">{productName}</h1>
            <p className="text-2xl font-medium">{price}</p>
            
            <div className="prose max-w-none">
              <p>{productDescription}</p>
              <p>Product Weight: {product.productWeight} {product.productUnit}</p>
            </div>
            
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
            
            <div>
              <button 
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CJProductDetail;
