
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';
import AboutStore from '../components/AboutStore';
import SupportFollowSection from '../components/SupportFollowSection';

const Home = () => {
  return (
    <div className="min-h-screen">
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
