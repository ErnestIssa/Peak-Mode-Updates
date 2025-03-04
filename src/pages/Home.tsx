
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <FeaturedProducts />
        <Newsletter />
      </main>
    </div>
  );
};

export default Home;
