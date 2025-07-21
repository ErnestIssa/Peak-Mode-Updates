import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SupportPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SupportPopup: React.FC<SupportPopupProps> = ({ isVisible, onClose, onOpen }) => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [isOverDarkBackground, setIsOverDarkBackground] = useState(false);

  const faqData = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping within Sweden usually takes 3–5 business days."
    },
    {
      question: "Can I return or exchange my order?",
      answer: "Yes, we offer returns and exchanges within 14 days of receiving your item."
    },
    {
      question: "How do I contact customer support?",
      answer: "Email us at support@peakmodefit.com. We usually respond within 24 hours on weekdays."
    }
  ];

  // Check if user has scrolled to a dark background section
  useEffect(() => {
    const checkScrollPosition = () => {
      // Check for contact section (Stay Updated)
      const contactSection = document.getElementById('contact');
      // Check for black CTA sections in collection pages
      const ctaSections = document.querySelectorAll('section.bg-black');
      
      let isOverDarkBackground = false;
      
      // Check contact section
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        if (isVisible) {
          isOverDarkBackground = true;
        }
      }
      
      // Check CTA sections
      ctaSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        if (isVisible) {
          isOverDarkBackground = true;
        }
      });
      
      setIsOverDarkBackground(isOverDarkBackground);
    };

    // Check on scroll
    window.addEventListener('scroll', checkScrollPosition);
    
    // Initial check
    setTimeout(checkScrollPosition, 100);

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsSubmitting(true);
    
    // Simulate tracking request
    setTimeout(() => {
      alert(`Tracking information for order ${trackingId} will be displayed here.`);
      setIsSubmitting(false);
      setTrackingId('');
    }, 1500);
  };

  const handleSupportClick = () => {
    onClose();
    navigate('/contact');
  };

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

  return (
    <>
      {/* Floating Support Icon */}
      <button
        onClick={onOpen}
        data-support-icon
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center",
          isVisible ? "scale-0 opacity-0" : "scale-100 opacity-100",
          isOverDarkBackground 
            ? "bg-white text-black hover:bg-gray-100" 
            : "bg-black text-white hover:bg-gray-800"
        )}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Support Popup */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-end p-2 md:p-4",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          className={cn(
            "bg-white w-[280px] md:w-[500px] h-auto min-h-[200px] md:h-72 transform transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl flex flex-col",
            isVisible ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-5 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-sm md:text-lg font-bold text-black">
              Support Center
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-3 md:p-5 space-y-3 md:space-y-4 flex-1 overflow-y-auto">
            {/* FAQs Section */}
            <div>
              <h3 className="text-xs md:text-base font-bold text-black mb-2 md:mb-3">Frequently Asked Questions</h3>
              <div className="space-y-1 md:space-y-2">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-2 md:px-3 py-2 md:py-2.5 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="font-semibold text-black text-xs md:text-sm">
                        {faq.question}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {openFaqs.includes(index) ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {openFaqs.includes(index) && (
                      <div className="px-2 md:px-3 pb-2 md:pb-2.5 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 text-xs md:text-sm pt-2 md:pt-2.5">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Button */}
            <div>
              <button
                onClick={handleSupportClick}
                className="w-full bg-black text-white font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300 text-xs md:text-sm"
              >
                Contact Support
              </button>
            </div>

            {/* Track Order Section */}
            <div>
              <h3 className="text-xs md:text-base font-bold text-black mb-2 md:mb-3">Track My Order</h3>
              <form onSubmit={handleTrackOrder} className="space-y-2 md:space-y-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your tracking ID"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 mobile-input"
                  style={{ fontSize: '16px' }}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !trackingId.trim()}
                  className={cn(
                    "w-full py-1.5 md:py-2 px-3 md:px-4 font-bold text-white transition-all duration-300 rounded-lg",
                    isSubmitting || !trackingId.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 active:scale-95 shadow-lg hover:shadow-xl"
                  )}
                  style={{ fontSize: '14px' }}
                >
                  {isSubmitting ? "Tracking..." : "Track Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPopup; 