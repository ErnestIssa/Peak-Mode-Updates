import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-white text-4xl font-display font-black tracking-tighter opacity-0 animate-[fadeIn_1s_ease-in-out_forwards]">
            PEAK | MODE
          </h1>
          <div className="mt-6 w-16 h-1 bg-white mx-auto">
            <div className="h-full bg-black w-0 animate-reveal"></div>
          </div>
        </div>
      </div>
    );
  }

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

export default Index;
