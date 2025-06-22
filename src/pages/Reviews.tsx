import React from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be among the first to share your experience with Peak Mode. Your feedback helps us grow and improve.
          </p>
        </div>

        {/* Founder's Review */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
              EI
            </div>
            <div>
              <h3 className="font-bold">Ernest Issa</h3>
              <p className="text-sm text-gray-600">Founder, Peak Mode</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-700 mb-4">
            "As the founder of Peak Mode, I've personally tested our Performance Shorts through countless workouts and runs. The comfort and durability are unmatched - they've become my go-to for both intense gym sessions and long-distance runs. The moisture-wicking fabric keeps me dry, and the four-way stretch allows for complete freedom of movement. I'm proud to have created something that truly enhances athletic performance."
          </p>
          <p className="text-sm text-gray-500">Verified Purchase • Performance Shorts</p>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-black text-white rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Be the First to Review</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our community of athletes and fitness enthusiasts. Your experience matters to us and helps others make informed decisions.
          </p>
          <Button 
            className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => window.location.href = '/submit-review'}
          >
            Write Your Review
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <h3 className="font-bold text-xl mb-2">Share Your Experience</h3>
            <p className="text-gray-600">Help others discover the perfect gear for their fitness journey.</p>
          </div>
          <div className="text-center p-6">
            <h3 className="font-bold text-xl mb-2">Shape Our Future</h3>
            <p className="text-gray-600">Your feedback directly influences our product development.</p>
          </div>
          <div className="text-center p-6">
            <h3 className="font-bold text-xl mb-2">Join the Community</h3>
            <p className="text-gray-600">Be part of a growing community of Peak Mode athletes.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">How do I write a review?</h3>
              <p className="text-gray-600">Click the "Write Your Review" button above and fill out our simple review form. You'll need to be logged in to submit a review.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">Do I need to verify my purchase?</h3>
              <p className="text-gray-600">Yes, we only accept reviews from verified customers to ensure authenticity and credibility.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-bold mb-2">What should I include in my review?</h3>
              <p className="text-gray-600">Share your experience with the product, including fit, comfort, performance, and durability. Photos are welcome!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews; 