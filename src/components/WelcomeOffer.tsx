import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { addSubscriber, sendWelcomeOfferEmail } from '@/lib/vornifyDB';

interface WelcomeOfferProps {
  onClose: () => void;
  isHidden: boolean;
}

const WelcomeOffer: React.FC<WelcomeOfferProps> = ({ onClose, isHidden }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has subscribed
    const hasSubscribed = localStorage.getItem('hasSubscribedToWelcomeOffer');
    if (hasSubscribed) return;

    // Show popup after 3 seconds initially
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Set up interval to show popup every 5 minutes
    const intervalTimer = setInterval(() => {
      setIsVisible(true);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      validateEmail(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate a unique discount code
      const discountCode = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Add subscriber to database
      const result = await addSubscriber(email);
      
      if (result.success || result.status) {
        // Send welcome email with discount code
        await sendWelcomeOfferEmail(email, discountCode);
        
        // Show success state
        setIsSubmitted(true);
        setEmailError('');
        
        // Mark as subscribed
        localStorage.setItem('hasSubscribedToWelcomeOffer', 'true');
        
        // Close after showing success message for 6 seconds
        setTimeout(() => {
          handleClose();
        }, 6000);
      } else {
        throw new Error(result.error || 'Failed to subscribe');
      }
      
    } catch (error) {
      console.error('Welcome offer error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible || isHidden) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleBackdropClick}
      />

      <div 
        className={cn(
          "fixed top-1/2 right-0 transform -translate-y-1/2 bg-white shadow-2xl rounded-l-xl z-50",
          "transition-transform duration-500 ease-out w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-[250px] sm:max-w-md",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button 
          onClick={handleClose}
          className="absolute -top-8 right-0 bg-black/90 text-white p-1.5 rounded-tl-lg hover:bg-black transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-2 sm:p-6">
          <div className="aspect-video w-full mb-4 sm:mb-6 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Fitness Motivation"
              className="w-full h-full object-cover"
            />
          </div>

          {!isSubmitted ? (
            <>
              <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                Welcome to Peak Mode!
              </h3>
              <p className="text-xs sm:text-base text-black/70 mb-4 sm:mb-6">
                Get 10% off your first order when you join the movement.
              </p>
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    className={cn(
                      "w-full text-xs sm:text-base py-1 sm:py-2",
                      emailError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                    onBlur={() => validateEmail(email)}
                  />
                  {emailError && (
                    <p className="text-xs text-red-500">{emailError}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-black/90 text-white text-xs sm:text-base py-1 sm:py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Claim My Discount'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                You're In!
              </h3>
              <p className="text-xs sm:text-base text-black/70 mb-2">
                Thanks for joining Peak Mode. Your 10% discount code is on its way — check your inbox and get ready to level up.
              </p>
              <p className="text-xs text-black/50 italic">
                This message will close automatically in a few seconds...
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WelcomeOffer; 