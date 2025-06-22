import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';
import AboutStore from '../components/AboutStore';
import WelcomeOffer from '../components/WelcomeOffer';
import FloatingSupport from '../components/FloatingSupport';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const Home = () => {
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const { banners, announcements, websiteConfig, isLoading } = useSiteConfig();

  const handleSupportOpen = () => {
    setShowWelcomeOffer(false);
  };

  const handleSupportClose = () => {
    // Only show welcome offer again if it hasn't been dismissed
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomeOffer');
    if (!hasSeenPopup) {
      setShowWelcomeOffer(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      {announcements.length > 0 && announcements[0] && (
        <div 
          className="text-center py-2 text-sm font-medium"
          style={{
            backgroundColor: announcements[0].backgroundColor,
            color: announcements[0].textColor
          }}
        >
          {announcements[0].message}
        </div>
      )}
      
      <Navbar />
      
      {/* Top Banners */}
      {banners.filter(banner => banner.position === 'top').map(banner => (
        <div key={banner.id} className="bg-gray-100 py-8">
          <div className="container mx-auto px-4 text-center">
            {banner.imageUrl && (
              <img 
                src={banner.imageUrl} 
                alt={banner.title}
                className="mx-auto mb-4 max-h-64 object-cover rounded-lg"
              />
            )}
            <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
            <p className="text-gray-600 mb-4">{banner.description}</p>
            {banner.ctaLink && (
              <a 
                href={banner.ctaLink}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {banner.ctaText}
              </a>
            )}
          </div>
        </div>
      ))}
      
      <main>
        <Hero 
          title={websiteConfig.heroSection.title}
          subtitle={websiteConfig.heroSection.subtitle}
          backgroundImage={websiteConfig.heroSection.image}
        />
        
        {/* Middle Banners */}
        {banners.filter(banner => banner.position === 'middle').map(banner => (
          <div key={banner.id} className="bg-white py-8">
            <div className="container mx-auto px-4 text-center">
              {banner.imageUrl && (
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="mx-auto mb-4 max-h-64 object-cover rounded-lg"
                />
              )}
              <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
              <p className="text-gray-600 mb-4">{banner.description}</p>
              {banner.ctaLink && (
                <a 
                  href={banner.ctaLink}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </div>
        ))}
        
        <FeaturedProducts />
        <AboutStore />
        
        {/* Bottom Banners */}
        {banners.filter(banner => banner.position === 'bottom').map(banner => (
          <div key={banner.id} className="bg-gray-50 py-8">
            <div className="container mx-auto px-4 text-center">
              {banner.imageUrl && (
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="mx-auto mb-4 max-h-64 object-cover rounded-lg"
                />
              )}
              <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
              <p className="text-gray-600 mb-4">{banner.description}</p>
              {banner.ctaLink && (
                <a 
                  href={banner.ctaLink}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </div>
        ))}
        
        <Newsletter />
      </main>
      
      <WelcomeOffer 
        onClose={() => setShowWelcomeOffer(false)} 
        isHidden={isSupportOpen}
      />
      <FloatingSupport 
        onSupportOpen={() => setIsSupportOpen(true)}
        onSupportClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export default Home;
