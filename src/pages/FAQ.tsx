import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What is Peak Mode?",
      answer: "Peak Mode is a performance-driven fitness brand that creates gym-to-street apparel for ambitious individuals. Our mission is to empower people to live at their peak—physically, mentally, and personally."
    },
    {
      id: 2,
      question: "What products do you offer?",
      answer: "We offer functional fitness apparel designed to perform in the gym and look great on the street. Our initial launch features performance shorts, with more gear coming soon."
    },
    {
      id: 3,
      question: "Where do you ship from?",
      answer: "All orders are shipped from our Swedish fulfillment center to ensure fast and reliable delivery within Sweden."
    },
    {
      id: 4,
      question: "Do you ship internationally?",
      answer: "Not yet. We currently ship only within Sweden, but we're actively working on expanding to more countries soon."
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer: "Standard shipping within Sweden usually takes 3–5 business days. You'll receive a tracking link as soon as your order is on its way."
    },
    {
      id: 6,
      question: "Can I return or exchange my order?",
      answer: "Yes, we offer returns and exchanges within 14 days of receiving your item. The product must be unused and in its original condition. Check our return policy for full details."
    },
    {
      id: 7,
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with a tracking link. You can also visit the \"Track My Order\" page on our website for updates."
    },
    {
      id: 8,
      question: "What sizes do you offer?",
      answer: "Our sizing currently ranges from S to XL. You can view our size guide on each product page to help you choose the best fit."
    },
    {
      id: 9,
      question: "Do you offer gift cards?",
      answer: "Not at the moment, but we're working on it! Stay tuned for digital gift cards soon."
    },
    {
      id: 10,
      question: "How do I contact customer support?",
      answer: "Email us at support@peakmodefit.com. We usually respond within 24 hours on weekdays (Mon–Fri)."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Header Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions about Peak Mode products, shipping, returns, and more.
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* FAQ Items */}
            <div className="space-y-4">
              {faqData.map((item) => (
                <div 
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="font-semibold text-black text-lg">
                      {item.question}
                    </span>
                    <span className="text-gray-500 text-sm ml-4">
                      {openItems.includes(item.id) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 text-center bg-black text-white py-12 px-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Still have a question?
              </h2>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                If you can't find the answer you're looking for, contact us here and we'll be happy to help.
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Navigation */}
            <div className="mt-12 text-center">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ; 