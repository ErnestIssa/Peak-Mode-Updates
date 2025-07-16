import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

// Test products data (same as in FeaturedProducts)
const testProducts = [
  {
    id: 'test-1',
    name: 'Peak Mode Performance Hoodie',
    price: '599 SEK',
    currency: 'SEK',
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
    description: 'Premium performance hoodie designed for athletes who demand the best. Made with high-quality materials for maximum comfort and durability during intense workouts.',
    isNew: true
  },
  {
    id: 'test-2',
    name: 'Elite Training T-Shirt',
    price: '299 SEK',
    currency: 'SEK',
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
    description: 'Lightweight and breathable training t-shirt perfect for any workout. Features moisture-wicking technology to keep you dry and comfortable.',
    isNew: false
  },
  {
    id: 'test-3',
    name: 'Athletic Performance Shorts',
    price: '399 SEK',
    currency: 'SEK',
    category: 'Athletic Wear',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    description: 'High-performance athletic shorts designed for maximum mobility and comfort. Perfect for running, training, and sports activities.',
    isNew: true
  },
  {
    id: 'test-4',
    name: 'Premium Workout Leggings',
    price: '499 SEK',
    currency: 'SEK',
    category: 'Athletic Wear',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
    description: 'Premium workout leggings with compression technology. Provides support and flexibility for all types of training sessions.',
    isNew: false
  },
  {
    id: 'test-5',
    name: 'Peak Mode Logo Sweatshirt',
    price: '449 SEK',
    currency: 'SEK',
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop',
    description: 'Classic sweatshirt featuring the Peak Mode logo. Comfortable and stylish for both training and casual wear.',
    isNew: false
  },
  {
    id: 'test-6',
    name: 'Performance Tank Top',
    price: '249 SEK',
    currency: 'SEK',
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1506629905607-13e6f5c2b1ce?w=400&h=600&fit=crop',
    description: 'Sleek performance tank top designed for maximum breathability and freedom of movement during intense workouts.',
    isNew: true
  },
  {
    id: 'test-7',
    name: 'Athletic Compression Shirt',
    price: '349 SEK',
    currency: 'SEK',
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
    description: 'Compression shirt that provides muscle support and improves performance. Ideal for high-intensity training sessions.',
    isNew: false
  },
  {
    id: 'test-8',
    name: 'Peak Mode Training Jacket',
    price: '699 SEK',
    currency: 'SEK',
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
    description: 'Premium training jacket with advanced weather protection. Perfect for outdoor training in any conditions.',
    isNew: true
  },
  {
    id: 'test-9',
    name: 'Performance Sports Bra',
    price: '399 SEK',
    currency: 'SEK',
    category: 'Athletic Wear',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
    description: 'High-support sports bra designed for maximum comfort during intense workouts. Features moisture-wicking technology.',
    isNew: false
  },
  {
    id: 'test-10',
    name: 'Elite Training Pants',
    price: '549 SEK',
    currency: 'SEK',
    category: 'Athletic Wear',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    description: 'Elite training pants with advanced flexibility and comfort. Perfect for strength training and functional fitness.',
    isNew: false
  },
  {
    id: 'test-11',
    name: 'Peak Mode Classic Tee',
    price: '279 SEK',
    currency: 'SEK',
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
    description: 'Classic t-shirt with the Peak Mode logo. Made from premium cotton for everyday comfort and style.',
    isNew: false
  },
  {
    id: 'test-12',
    name: 'Premium Athletic Hoodie',
    price: '649 SEK',
    currency: 'SEK',
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
    description: 'Premium athletic hoodie with advanced thermal regulation. Perfect for pre and post-workout wear.',
    isNew: true
  }
];

const TestProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  
  const product = testProducts.find(p => p.id === id);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
      image: product.image,
      size: selectedSize,
      color: 'Default',
      quantity: quantity,
      currency: product.currency,
      source: 'test'
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

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="peak-container mt-28 mb-16 text-center py-12">
          <p className="text-red-500 mb-4">Product not found.</p>
          <Link to="/" className="peak-button inline-flex items-center">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="peak-container mt-28 mb-16">
        <Link to="/" className="inline-flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary relative overflow-hidden rounded-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
                New
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="text-sm text-foreground/60 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
              <p className="text-2xl font-medium mt-2">{product.price}</p>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-black'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 flex items-center justify-center space-x-2 hover:bg-black/90 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProductDetail; 