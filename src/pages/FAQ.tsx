import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Truck, RefreshCw, Shirt, CreditCard, HeadphonesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const faqSections = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Shipping & Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "Orders within Sweden typically arrive in 1–3 business days. You'll receive a tracking link as soon as your order ships."
        },
        {
          q: "Do you offer international shipping?",
          a: "Currently, we only ship within Sweden. Stay tuned as we expand!"
        },
        {
          q: "How do I track my order?",
          a: "As soon as your order is shipped, you'll receive a confirmation email with your tracking number."
        }
      ]
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: "Returns & Exchanges",
      questions: [
        {
          q: "What's your return policy?",
          a: "We offer a 30-day return policy. Items must be unused, in original packaging, and with all labels attached."
        },
        {
          q: "How do I start a return or exchange?",
          a: "Simply email our support team at support@peakmodewear.com with your order number, and we'll guide you through the process."
        },
        {
          q: "Can I change or cancel my order after placing it?",
          a: "If your order hasn't shipped yet, we'll do our best to help. Contact us immediately at support@peakmode.se."
        }
      ]
    },
    {
      icon: <Shirt className="h-5 w-5" />,
      title: "Product & Sizing",
      questions: [
        {
          q: "How do I choose the right size?",
          a: "Check out our detailed size guide available on each product page. Our fit is athletic, true to size."
        },
        {
          q: "Will you restock sold-out items?",
          a: "Yes. Sign up for restock alerts on the product page or join our newsletter for updates."
        },
        {
          q: "Are your clothes true to size?",
          a: "Yes. Our apparel is performance-tested and fits true to athletic sizing. Size up for a looser fit."
        }
      ]
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payments & Security",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept Klarna, Swish, Visa, Mastercard, and American Express."
        },
        {
          q: "Is my payment information secure?",
          a: "100%. Our checkout is secured with SSL encryption and handled by trusted providers."
        }
      ]
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      title: "Contact & Support",
      questions: [
        {
          q: "How can I reach your support team?",
          a: "Email us at support@peakmode.se — we respond within 24 hours (weekdays)."
        },
        {
          q: "Do you offer bulk orders or sponsorships?",
          a: "For collaboration or bulk order inquiries, reach out to support@peakmode.se."
        }
      ]
    }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300 mb-8">Find answers to common questions about Peak Mode</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 py-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {filteredSections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              {section.icon}
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {section.questions.map((item, qIdx) => (
                <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Contact Section */}
        <div className="mt-16 text-center p-8 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Didn't find your answer?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help you with any questions you may have.</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/contact')} 
              className="bg-black hover:bg-black/90"
            >
              Contact Support
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="border-black hover:bg-black/5"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 