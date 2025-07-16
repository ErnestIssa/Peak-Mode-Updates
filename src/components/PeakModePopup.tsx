import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PeakModePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const PeakModePopup: React.FC<PeakModePopupProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Close popup after successful submission
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-end p-2 md:p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className={cn(
          "bg-white w-[280px] md:w-[500px] h-auto min-h-[200px] md:h-72 transform transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-black md:text-white font-bold stroke-[3]" />
        </button>

        {/* Content Section */}
        <div className="flex-1 p-3 md:p-5 flex flex-col justify-center">
          <div className="mb-2 md:mb-3">
            <h2 className="text-sm md:text-lg font-black text-black mb-1 md:mb-1.5 tracking-tight">
              Welcome to Peak Mode.
            </h2>
            
            <p className="text-gray-600 text-xs mb-2 md:mb-3 leading-relaxed">
              This is where limits break and new levels begin.
            </p>

            <div className="bg-gray-50 border border-gray-200 p-2 md:p-2.5 rounded-lg mb-2 md:mb-3">
              <p className="text-black text-xs font-bold mb-1">
                Join the movement and get 10% OFF
              </p>
              <p className="text-gray-600 text-xs leading-relaxed">
                your first order—because discipline deserves rewards.
              </p>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-2 md:px-2.5 py-1 md:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 mobile-input"
                style={{ fontSize: '16px' }}
                required
              />
              
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={cn(
                  "w-full py-1 md:py-1.5 px-2 md:px-3 font-bold text-white transition-all duration-300 rounded-lg",
                  isSubmitting || !email
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:scale-95 shadow-lg hover:shadow-xl"
                )}
                style={{ fontSize: '14px' }}
              >
                {isSubmitting ? "Activating..." : "ACTIVATE DISCOUNT"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mx-auto mb-1.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-bold text-black">Discount Activated!</p>
            </div>
          )}
        </div>

        {/* Athlete Image Section */}
        <div className="w-full h-24 md:w-48 md:h-full relative overflow-hidden flex-shrink-0">
          <img
            src="data:image/jpeg;base64,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"
            alt="Athlete training hard"
            className="w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default PeakModePopup; 