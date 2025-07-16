import React from 'react';
import { useNavigate } from 'react-router-dom';

const SupportFollowSection = () => {
  const navigate = useNavigate();

  const handleSocialMediaClick = (platform: string) => {
    const socialMediaUrls = {
      tiktok: 'https://www.tiktok.com/@peakmode',
      instagram: 'https://www.instagram.com/peakmode',
      facebook: 'https://www.facebook.com/peakmode'
    };

    const url = socialMediaUrls[platform as keyof typeof socialMediaUrls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Support Column */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6 text-left">Support</h2>
            <div className="space-y-2 md:space-y-3">
              <button 
                onClick={() => navigate('/contact')}
                className="block w-full text-left text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Customer Service
              </button>
              <button 
                onClick={() => navigate('/faq')}
                className="block w-full text-left text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                FAQs
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="block w-full text-left text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Contact Us
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="block w-full text-left text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Returns
              </button>
              <button 
                onClick={() => navigate('/reviews')}
                className="block w-full text-left text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Follow Us Column */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6 text-center">Follow Us</h2>
            <div className="space-y-2 md:space-y-3">
              <button 
                onClick={() => handleSocialMediaClick('tiktok')}
                className="block w-full text-center text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                TikTok
              </button>
              <button 
                onClick={() => handleSocialMediaClick('instagram')}
                className="block w-full text-center text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Instagram
              </button>
              <button 
                onClick={() => handleSocialMediaClick('facebook')}
                className="block w-full text-center text-base md:text-base text-gray-700 hover:text-black transition-colors duration-300 font-medium"
              >
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportFollowSection; 