
import React from 'react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';
import AboutStore from '../components/AboutStore';
import SupportFollowSection from '../components/SupportFollowSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Peak Mode - Premium Performance Apparel"
        description="Discover premium performance apparel designed for peak athleticism and everyday style. Shop the latest collection of training gear, hoodies, and athletic wear."
        keywords="performance apparel, athletic wear, training gear, fitness clothing, workout clothes, gym wear, sports clothing, peak mode"
        image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=630&fit=crop"
        url="https://peakmode.com"
      />
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <AboutStore />
        <SupportFollowSection />
        <Newsletter />
      </main>
    </div>
  );
};

export default Home;
