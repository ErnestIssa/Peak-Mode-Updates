import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Newsletter from '@/components/Newsletter';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  RotateCcw,
  Shield,
  Package,
  MessageCircle,
  Star as StarIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { trackRecentlyViewed } from '@/lib/userInteractions';


const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(false);

  // Track product view for reload navigation
  useEffect(() => {
    if (id) {
      trackRecentlyViewed(id);
    }
  }, [id]);

  // Enhanced product data with all the features you requested
  const productImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  const productData = {
    id: id || 'test-1',
    name: 'Peak Mode Performance Shirt',
    price: '299 SEK',
    currency: 'SEK',
    description: 'Premium performance shirt designed for athletes who demand the best. Built with advanced moisture-wicking technology and four-way stretch for ultimate comfort during intense workouts.',
    thumbnail: productImages[0],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
    variants: [
      { size: 'S', color: 'Black', retail_price: '299', currency: 'SEK' },
      { size: 'M', color: 'Black', retail_price: '299', currency: 'SEK' },
      { size: 'L', color: 'Black', retail_price: '299', currency: 'SEK' },
      { size: 'XL', color: 'Black', retail_price: '299', currency: 'SEK' },
      { size: 'S', color: 'White', retail_price: '299', currency: 'SEK' },
      { size: 'M', color: 'White', retail_price: '299', currency: 'SEK' },
      { size: 'L', color: 'White', retail_price: '299', currency: 'SEK' },
      { size: 'XL', color: 'White', retail_price: '299', currency: 'SEK' }
    ]
  };

  // Determine product collection based on product ID or name
  const getProductCollection = () => {
    const productId = id || productData.id;
    const productName = productData.name.toLowerCase();
    
    // Check if it's an accessories product
    if (productId.includes('accessories') || 
        productId.includes('accessory') ||
        productName.includes('accessories') ||
        productName.includes('accessory') ||
        productName.includes('bag') ||
        productName.includes('cap') ||
        productName.includes('hat') ||
        productName.includes('socks') ||
        productName.includes('gloves') ||
        productName.includes('belt') ||
        productName.includes('strap')) {
      return 'accessories';
    }
    
    // Check if it's women's collection
    if (productId.includes('womens') || 
        productId.includes('women') ||
        productName.includes('women') ||
        productName.includes('ladies')) {
      return 'womens';
    }
    
    // Default to mens collection
    return 'mens';
  };

  const productCollection = getProductCollection();

  // Dynamic motivational content based on collection
  const getMotivationalContent = () => {
    if (productCollection === 'accessories') {
      return [
        {
          heading: "Small Details. Big Impact.",
          text: "From gym to grind, our accessories are built to support your performance where it counts — in the details."
        },
        {
          heading: "Every Detail Matters.",
          text: "Precision in the small things creates excellence in the big picture. Your accessories should never hold you back."
        },
        {
          heading: "Support Your Mission.",
          text: "These aren't just add-ons — they're essential tools that enhance your performance and protect your progress."
        },
        {
          heading: "Quality in the Details.",
          text: "When you're pushing limits, every piece of gear needs to perform. Our accessories are built to match your standards."
        },
        {
          heading: "Complete Your Setup.",
          text: "The right accessories complete your training arsenal. From protection to performance, we've got you covered."
        }
      ];
    }
    
    // Default content for mens and womens collections
    return [
      {
        heading: "Wear Your Mindset.",
        text: "This isn't just gear — it's a reminder of who you are when no one's watching. Built for movement. Backed by purpose."
      },
      {
        heading: "Built for the Grind.",
        text: "From early mornings to late reps, this piece is designed to keep up with your drive — not slow it down."
      },
      {
        heading: "No Hype. Just Progress.",
        text: "Engineered for performance. Worn with intention. Because real growth doesn't need noise — just consistency."
      },
      {
        heading: "Train. Evolve. Repeat.",
        text: "Every rep in this gear is a step forward. It's not about perfection — it's about showing up, again and again."
      },
      {
        heading: "Your Peak Starts Here.",
        text: "Crafted for athletes who train beyond the spotlight. This is more than apparel — it's the uniform for your next level."
      }
    ];
  };

  const motivationalContent = getMotivationalContent();

  const recentlyViewedProducts = [
    {
      id: '1',
      name: 'Performance Shorts',
      price: '299 SEK',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      isNew: true
    },
    {
      id: '2',
      name: 'Training Tank',
      price: '199 SEK',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      isNew: false
    },
    {
      id: '3',
      name: 'Athletic Hoodie',
      price: '399 SEK',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      isNew: true
    },
    {
      id: '4',
      name: 'Compression Shirt',
      price: '249 SEK',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      isNew: false
    }
  ];

  const bestSellers = [
    {
      id: '5',
      name: 'Elite Performance Shorts',
      price: '349 SEK',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 127
    },
    {
      id: '6',
      name: 'Pro Training Tank',
      price: '229 SEK',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 89
    },
    {
      id: '7',
      name: 'Premium Hoodie',
      price: '449 SEK',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 156
    }
  ];

  const productReviews = [
    {
      id: 1,
      user: 'Alex M.',
      rating: 5,
      date: '2024-01-15',
      title: 'Perfect for my training',
      comment: 'This gear has transformed my workouts. The quality is exceptional and it feels great during intense sessions.'
    },
    {
      id: 2,
      user: 'Sarah K.',
      rating: 4,
      date: '2024-01-10',
      title: 'Great fit and comfort',
      comment: 'Love the fit and the material feels premium. Would definitely recommend to anyone serious about their training.'
    }
  ];

  const handleAddToCart = () => {
    const cartItem = {
      id: productData.id,
      name: productData.name,
      price: parseFloat(productData.price.replace(/[^0-9.]/g, '')),
      image: productData.thumbnail,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      currency: productData.currency,
      source: 'test'
    };
    
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItemIndex = cartItems.findIndex((item: any) => 
      item.id === cartItem.id && 
      item.size === cartItem.size && 
      item.color === cartItem.color
    );
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    toast.success("Added to cart successfully!");
  };



  const handleWishlist = () => {
    window.dispatchEvent(new CustomEvent('openWishlist'));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="peak-container mt-28 mb-16">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="peak-container mt-28 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </div>

      {/* Product Section */}
      <div className="peak-container mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-lg">
              <img 
                src={productImages[currentImageIndex]} 
                alt={`${productData.name} - Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors",
                      currentImageIndex === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{productData.name}</h1>
              <p className="text-3xl font-semibold text-primary mb-4">{productData.price}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({productReviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Color</h3>
              <div className="flex space-x-3">
                {productData.colors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all",
                      selectedColor === color ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((size) => (
                  <button
                    key={size}
                    className={cn(
                      "px-6 py-3 border-2 font-medium transition-all",
                      selectedSize === size 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Quantity</h3>
              <div className="flex items-center border-2 border-gray-300 w-32 rounded-lg">
                <button 
                  className="px-3 py-3 border-r border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center py-3 focus:outline-none"
                />
                <button 
                  className="px-3 py-3 border-l border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="flex-1 bg-primary text-white hover:bg-primary/90 h-14 text-lg font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-14 h-14 p-0"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-6 w-6", isWishlisted ? "fill-red-500 text-red-500" : "")} />
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">Free shipping over 899 kr</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">Secure payment</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-sm">Premium quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="peak-section bg-gray-50">
        <div className="peak-container">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-300 mb-8 overflow-x-auto scrollbar-hide">
              {[
                { id: 'description', label: 'Description' },
                { id: 'size-fit', label: 'Size & Fit' },
                { id: 'materials', label: 'Materials' },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 sm:px-6 py-3 font-bold text-sm sm:text-base border-b-2 transition-colors whitespace-nowrap flex-shrink-0",
                    activeTab === tab.id 
                      ? "border-primary text-primary" 
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  )}
                >
                  {tab.label}
              </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p>{productData.description}</p>
                </div>
              )}
              
              {activeTab === 'size-fit' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Size & Fit Guide</h3>
                  <p className="text-gray-600">
                    Our gear is designed to provide the perfect balance of comfort and performance. 
                    Each piece is crafted with premium materials that move with you during your toughest workouts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Sizing Chart</h4>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-600">Size chart will be added by admin</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Fit Guide</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Regular fit for optimal movement</li>
                        <li>• Moisture-wicking technology</li>
                        <li>• Four-way stretch for flexibility</li>
                        <li>• Designed for athletic performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'materials' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Materials & Care</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Materials</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Premium performance fabric</li>
                        <li>• Moisture-wicking technology</li>
                        <li>• Anti-odor treatment</li>
                        <li>• UV protection</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Care Instructions</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Machine wash cold</li>
                        <li>• Tumble dry low</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Shipping & Returns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Shipping</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Free shipping on orders over 899 kr</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery: 1-2 business days</li>
                        <li>• Tracking provided for all orders</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Returns</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 30-day return policy</li>
                        <li>• Free returns for defective items</li>
                        <li>• Items must be unworn and unwashed</li>
                        <li>• Return shipping label provided</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="peak-section">
        <div className="peak-container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Customer Reviews</h2>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate('/reviews?write-review=true')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </div>

            {productReviews.length > 0 ? (
              <div className="space-y-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {review.user.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{review.user}</p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Be the first to add a review for this product.</p>
                <Button 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate('/reviews?write-review=true')}
                >
                  Write a Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Motivational Content */}
      <div className="peak-section bg-black text-white">
        <div className="peak-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Athlete in Peak Mode gear"
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {motivationalContent[0].heading}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {motivationalContent[0].text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products */}
      <div className="peak-section">
        <div className="peak-container">
          <h2 className="text-3xl font-bold mb-8">Recently Viewed</h2>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {recentlyViewedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-primary font-bold">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="peak-section bg-gray-50">
        <div className="peak-container">
          <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {bestSellers.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-primary font-bold">{product.price}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default ProductDetail;
