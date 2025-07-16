import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

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
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ⭐
      </span>
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
                <div className="text-3xl mr-4">
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
                      <div className="flex items-center mb-4">
                        <div className="text-xl mr-3">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg mb-4 italic">
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
              <div className="flex justify-center mb-8">
                <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedFilter === 'all' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setSelectedFilter('shorts')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedFilter === 'shorts' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Performance Shorts
                  </button>
                </div>
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-lg mr-3">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
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