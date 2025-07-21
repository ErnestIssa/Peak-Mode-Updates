import React, { useState } from 'react';
import { trackFormData, clearFormData } from '@/lib/userInteractions';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
}

interface ReviewData {
  email: string;
  name: string;
  location: string;
  rating: number;
  feedback: string;
  product: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<'email' | 'form'>('email');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    feedback: '',
    product: 'Performance Shorts'
  });

  const handleEmailVerification = async () => {
    if (!email) return;
    
    setIsVerifying(true);
    
    // Simulate email verification process
    setTimeout(() => {
      // For demo purposes, accept any email with @ symbol
      if (email.includes('@')) {
        setIsVerified(true);
        setStep('form');
      } else {
        alert('Please enter a valid email address.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.feedback) {
      alert('Please fill in all required fields.');
      return;
    }

    const reviewData: ReviewData = {
      email,
      ...formData
    };

    onSubmit(reviewData);
    handleClose();
  };

  // Track form data changes
  const handleFormDataChange = (field: string, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Track form data for reload navigation
    trackFormData({ email, ...newFormData });
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setIsVerified(false);
    setFormData({
      name: '',
      location: '',
      rating: 5,
      feedback: '',
      product: 'Performance Shorts'
    });
    
    // Clear form data tracking
    clearFormData();
    onClose();
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && handleFormDataChange('rating', i + 1)}
        className={`text-2xl ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        disabled={!interactive}
      >
        ⭐
      </button>
    ));
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">
            {step === 'email' ? 'Verify Your Purchase' : 'Write a Review'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'email' ? (
            /* Email Verification Step */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Verified Buyers Only
                </h3>
                <p className="text-gray-600 text-sm">
                  To ensure authentic reviews, only verified customers can submit reviews.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Track email for form data
                      trackFormData({ email: e.target.value, ...formData });
                    }}
                    placeholder="Enter the email used for your purchase"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <button
                  onClick={handleEmailVerification}
                  disabled={!email || isVerifying}
                  className={`w-full py-3 px-4 font-bold text-white rounded-lg transition-all duration-300 ${
                    !email || isVerifying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 active:scale-95'
                  }`}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Purchase'}
                </button>
              </div>
            </div>
          ) : (
            /* Review Form Step */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormDataChange('name', e.target.value)}
                    placeholder="First name only"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormDataChange('location', e.target.value)}
                    placeholder="e.g., Stockholm, Malmö"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => handleFormDataChange('product', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="Performance Shorts">Performance Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {renderStars(formData.rating, true)}
                    <span className="text-sm text-gray-600 ml-2">
                      {formData.rating}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => handleFormDataChange('feedback', e.target.value)}
                    placeholder="Share your experience with Peak Mode gear..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm; 