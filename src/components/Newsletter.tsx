
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Newsletter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section id="contact" className="peak-section bg-black text-white">
      <div className="peak-container">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-white/30 font-medium">
            Stay Updated
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold">
            Join The Peak Movement
          </h2>
          <p className="mt-6 text-white/70 text-lg">
            Subscribe to get exclusive access to new releases, special offers, and training tips.
          </p>
          
          <form className="mt-10 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/50"
              required
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 font-medium tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
          
          <p className="mt-4 text-sm text-white/50">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
          
          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              Instagram
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              Twitter
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              Facebook
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              TikTok
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
