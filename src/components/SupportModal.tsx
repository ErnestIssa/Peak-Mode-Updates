import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const validateTrackingNumber = (number: string) => {
    if (!number.trim()) {
      setTrackingError('Please enter a tracking number');
      return false;
    }
    // Add any specific tracking number format validation here if needed
    setTrackingError('');
    return true;
  };

  const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);
    if (trackingError) {
      validateTrackingNumber(e.target.value);
    }
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTrackingNumber(trackingNumber)) {
      return;
    }
    // Here you would typically integrate with your tracking system
    window.open(`https://your-tracking-system.com/${trackingNumber}`, '_blank');
  };

  const commonFaqs = [
    {
      q: "How long does delivery take?",
      a: "Orders within Sweden typically arrive in 1–3 business days. You'll receive a tracking link as soon as your order ships."
    },
    {
      q: "What's your return policy?",
      a: "We offer a 30-day return policy. Items must be unused, in original packaging, and with all labels attached."
    },
    {
      q: "How can I track my order?",
      a: "As soon as your order is shipped, you'll receive a confirmation email with your tracking number."
    }
  ];

  return (
    <div 
      className={cn(
        "fixed bottom-20 right-0 transform bg-white shadow-2xl rounded-l-xl z-50",
        "transition-transform duration-500 ease-out w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-[250px] sm:max-w-md",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <button 
        onClick={onClose}
        className="absolute -top-8 right-0 bg-black/90 text-white p-1.5 rounded-tl-lg hover:bg-black transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="p-2 sm:p-6">
        <h3 className="text-lg sm:text-2xl font-bold mb-4">Support Center</h3>

        {/* Quick FAQs */}
        <div className="mb-6">
          <h4 className="text-sm sm:text-base font-medium mb-2">Common Questions</h4>
          <Accordion type="single" collapsible className="space-y-2">
            {commonFaqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg">
                <AccordionTrigger className="px-3 text-xs sm:text-sm hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 text-xs sm:text-sm text-gray-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Track Order */}
        <div className="mb-6">
          <h4 className="text-sm sm:text-base font-medium mb-2">Track My Order</h4>
          <form onSubmit={handleTrackOrder} className="space-y-2">
            <div className="space-y-1">
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={handleTrackingChange}
                className={cn(
                  "w-full text-xs sm:text-sm py-1 sm:py-2",
                  trackingError && "border-red-500 focus-visible:ring-red-500"
                )}
                onBlur={() => validateTrackingNumber(trackingNumber)}
              />
              {trackingError && (
                <p className="text-xs text-red-500">{trackingError}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-black/90 text-white text-xs sm:text-sm py-1 sm:py-2"
            >
              Track Order
            </Button>
          </form>
        </div>

        {/* Contact Support */}
        <div>
          <Button 
            onClick={() => navigate('/contact')} 
            className="w-full bg-black hover:bg-black/90 text-white text-xs sm:text-sm py-1 sm:py-2"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal; 