import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReviewForm from '../components/ReviewForm';

interface Review {
  id: number;
  rating: number;
  name: string;
  location: string;
  feedback: string;
  isVerified: boolean;
  isFeatured?: boolean;
  image?: string;
}

interface ReviewData {
  email: string;
  name: string;
  location: string;
  rating: number;
  feedback: string;
  product: string;
}

const Reviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [showProductFilter, setShowProductFilter] = useState(false);

  // Product categories for filtering
  const productCategories = [
    { id: 'all', name: 'All Products', collection: 'All Collections' },
    { id: 'mens-collection', name: "Men's Collection", collection: 'Men' },
    { id: 'womens-collection', name: "Women's Collection", collection: 'Women' },
    { id: 'accessories-collection', name: 'Accessories Collection', collection: 'Accessories' },
    { id: 'performance-shorts', name: 'Performance Shorts', collection: 'Men' },
    { id: 'training-tanks', name: 'Training Tanks', collection: 'Women' },
    { id: 'athletic-hoodies', name: 'Athletic Hoodies', collection: 'All' },
    { id: 'compression-shirts', name: 'Compression Shirts', collection: 'Men' }
  ];

  // Check if we should automatically open the review form
  useEffect(() => {
    const shouldOpenReviewForm = searchParams.get('write-review');
    if (shouldOpenReviewForm === 'true') {
      setIsReviewFormOpen(true);
      // Remove the parameter from URL to prevent reopening on refresh
      navigate('/reviews', { replace: true });
    }
  }, [searchParams, navigate]);

  // Dummy reviews data
  const reviews: Review[] = [
    {
      id: 1,
      rating: 5,
      name: "Erik",
      location: "Malmö",
      feedback: "These shorts are my new go-to for workouts. Super comfortable, breathable, and they look 🔥!",
      isVerified: true,
      isFeatured: true
    },
    {
      id: 2,
      rating: 5,
      name: "Sofia",
      location: "Gothenburg",
      feedback: "Wore them during my last HIIT session and got compliments at the gym. The fit is perfect!",
      isVerified: true,
      isFeatured: true
    },
    {
      id: 3,
      rating: 5,
      name: "Marcus",
      location: "Stockholm",
      feedback: "Finally found workout shorts that don't ride up during squats. Peak Mode delivers quality!",
      isVerified: true
    },
    {
      id: 4,
      rating: 5,
      name: "Anna",
      location: "Uppsala",
      feedback: "Love the material and how it feels during my runs. Definitely ordering more colors!",
      isVerified: true
    },
    {
      id: 5,
      rating: 5,
      name: "Lars",
      location: "Västerås",
      feedback: "Perfect for both gym and casual wear. The quality is outstanding for the price.",
      isVerified: true
    },
    {
      id: 6,
      rating: 5,
      name: "Emma",
      location: "Örebro",
      feedback: "These shorts have become my daily essential. Comfortable, stylish, and durable.",
      isVerified: true
    }
  ];

  const featuredReviews = reviews.filter(review => review.isFeatured);
  const regularReviews = reviews.filter(review => !review.isFeatured);

  const averageRating = 4.9;
  const totalReviews = reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-current" : "text-gray-300"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const handleWriteReview = () => {
    setIsReviewFormOpen(true);
  };

  const handleReviewSubmit = (reviewData: ReviewData) => {
    // Here you would typically send the review data to your backend
    console.log('New review submitted:', reviewData);
    
    // For demo purposes, show a success message
    alert('Thank you for your review! It will be published after moderation.');
    
    // In a real application, you would:
    // 1. Send the review to your backend API
    // 2. Verify the email against your customer database
    // 3. Store the review in your database
    // 4. Update the reviews list
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              What Our Customers Say
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real stories from people living in Peak Mode.
            </p>
            <p className="text-gray-500 text-base mt-2">
              Trusted by fitness-driven individuals across Sweden.
            </p>
          </div>
        </section>

        {/* Star Rating Summary */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="flex space-x-1 mr-4">
                  {renderStars(Math.floor(averageRating))}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-black">
                    {averageRating}/5
                  </div>
                  <div className="text-gray-600">
                    ({totalReviews} Reviews)
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Based on verified customers
              </p>
            </div>
          </div>
        </section>

        {/* Featured Reviews */}
        {featuredReviews.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-black text-center mb-8">
                  Featured Reviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredReviews.map((review) => (
                    <div 
                      key={review.id}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center mb-3">
                        <div className="flex space-x-1 mr-3">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 italic leading-relaxed">
                        "{review.feedback}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-semibold text-black">
                            {review.name}, {review.location}
                          </span>
                          {review.isVerified && (
                            <span className="ml-2 text-green-600 text-sm">
                              ✅ Verified Buyer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Reviews Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-black text-center mb-8">
                All Reviews
              </h2>
              
              {/* Filter Options */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg mb-4">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-md transition-colors font-medium ${
                      selectedFilter === 'all' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setShowProductFilter(!showProductFilter)}
                    className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center space-x-2 ${
                      showProductFilter 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <span>Reviews by Product</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showProductFilter ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* Product Filter Dropdown */}
                {showProductFilter && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full max-w-md animate-in slide-in-from-top-2 duration-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      Select Product Category
                    </h3>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {productCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedFilter(category.id);
                            setShowProductFilter(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 ${
                            selectedFilter === category.id
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs opacity-75">{category.collection}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews Grid */}
              <div className="space-y-6">
                {regularReviews.map((review, index) => (
                  <div 
                    key={review.id}
                    className={`p-6 rounded-xl border ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-3">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {review.feedback}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-semibold text-black">
                          {review.name}, {review.location}
                        </span>
                        {review.isVerified && (
                          <span className="ml-2 text-green-600 text-sm">
                            ✅ Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Tried Peak Mode gear?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                We'd love your feedback!
              </p>
              <p className="text-gray-400 mb-8">
                📣 Share your experience and help others find their peak.
              </p>
              <button
                onClick={handleWriteReview}
                className="bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg"
              >
                Write a Review
              </button>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-300 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </section>
      </main>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default Reviews; 