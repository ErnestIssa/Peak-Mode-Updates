
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { fetchProductDetails } from '@/services/printfulService';

interface CartItem {
  id: number;
  name: string;
  price: string;
  currency: string;
  size: string;
  color: string;
  quantity: number;
  thumbnail_url: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetails(id as string),
    enabled: !!id,
  });
  
  const availableSizes = productData?.sync_variants.map(variant => variant.size) || [];
  const uniqueSizes = [...new Set(availableSizes)];
  
  const selectedVariant = productData?.sync_variants.find(variant => variant.size === selectedSize);
  
  const handleAddToCart = () => {
    if (!selectedVariant || !productData) return;
    
    const cartItem: CartItem = {
      id: productData.sync_product.id,
      name: productData.sync_product.name,
      price: selectedVariant.retail_price,
      currency: selectedVariant.currency,
      size: selectedSize,
      color: selectedVariant.color || 'Default',
      quantity: quantity,
      thumbnail_url: productData.sync_product.thumbnail_url,
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item
    cart.push(cartItem);
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success('Added to cart successfully');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-24 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block"></div>
        <p className="mt-4">Loading product details...</p>
      </div>
    );
  }
  
  if (error || !productData) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold">Error loading product</h2>
        <p className="mt-4">Sorry, we couldn't load this product.</p>
        <Button onClick={() => navigate('/shop')} className="mt-8">
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex justify-center items-start">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
            <img
              src={productData.sync_product.thumbnail_url}
              alt={productData.sync_product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{productData.sync_product.name}</h1>
            {selectedVariant && (
              <p className="text-2xl font-medium mt-4">
                {selectedVariant.retail_price} {selectedVariant.currency}
              </p>
            )}
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Size</label>
              <Select
                value={selectedSize}
                onValueChange={setSelectedSize}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              className="w-full mt-8"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
          
          <Card className="mt-12 p-6">
            <h3 className="font-medium mb-4">Product Details</h3>
            <p className="text-muted-foreground">
              Premium quality {productData.sync_product.name.toLowerCase()}. 
              Perfect for everyday wear and special occasions. 
              Each item is made with high-quality materials and printed with care.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
