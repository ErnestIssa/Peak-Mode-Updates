import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import Newsletter from '../components/Newsletter';
import { Button } from '../components/ui/button';
import { ArrowRight, Brain, Target, Zap, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const storySectionRef = useRef<HTMLDivElement>(null);
  
  const { ref: storyRef, inView: storyInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: missionRef, inView: missionInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: valuesRef, inView: valuesInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: closingRef, inView: closingInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const scrollToStory = () => {
    storySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Peak Mode athlete training"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              More Than Apparel.<br />
              <span className="text-primary">This Is a Movement.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the mindset that drives every thread of Peak Mode.
            </p>
            <Button 
              onClick={scrollToStory}
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold group"
            >
              Scroll to Read
              <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storySectionRef} className="peak-section bg-white">
          <div className="peak-container">
            {/* Block 1: Origin */}
            <div 
              ref={storyRef}
              className={cn(
                "mb-24 transition-all duration-1000",
                storyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b-2 border-primary font-semibold text-primary">
                    Our Story
                  </span>
                  <h2 className="mt-6 text-4xl md:text-5xl font-bold">From Passion to Peak Performance</h2>
                </div>
                
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-transparent"></div>
                  <div className="pl-8">
                    <p className="text-lg md:text-xl leading-relaxed mb-6">
                      <span className="text-4xl font-bold text-primary float-left mr-3 -mt-2">P</span>
                      <strong className="text-primary">Peak Mode isn't just apparel — it's a declaration.</strong> Born from the mindset of someone who trained in silence, overlooked but never outworked, Peak Mode was never about following trends. It was built to represent a deeper truth: that real transformation doesn't come from hype, but from showing up when it's hard, when no one's watching, and when the only competition is who you were yesterday.
                    </p>
                    <p className="text-lg md:text-xl leading-relaxed">
                      This brand was created for those who train not for attention, but for growth — those who know that <strong className="text-primary">discomfort, discipline, and quiet consistency</strong> are where progress lives.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: Product Philosophy */}
            <div className="mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">Gear With Grit</h3>
                  <p className="text-lg leading-relaxed mb-6">
                    Every product from Peak Mode is crafted to echo that mindset. With <strong className="text-primary">functional performance at the core</strong>, each piece is designed to support your toughest workouts and your everyday grind — no fluff, no shortcuts.
                  </p>
                  <p className="text-lg leading-relaxed">
                    It's not about being perfect — it's about choosing your peak, and chasing it relentlessly. When you wear Peak Mode, you're not just putting on gear. You're stepping into the version of yourself that refuses to settle.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Peak Mode gear in action"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Block 3: The Real Message */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">This Is Not a Destination</h3>
              <p className="text-lg md:text-xl leading-relaxed mb-8 text-center">
                When you wear Peak Mode, you're not just putting on gear. You're stepping into the version of yourself that refuses to settle.
              </p>
              
              <div className="bg-primary/10 border-l-4 border-primary p-8 rounded-r-lg mb-8">
                <blockquote className="text-2xl md:text-3xl font-bold text-center italic">
                  "The peak isn't a destination — it's a mode you enter. And once you're in it, there's no turning back."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="peak-section bg-secondary">
          <div className="peak-container">
            <div 
              ref={missionRef}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000",
                missionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div>
                <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b-2 border-primary font-semibold text-primary">
                  Our Mission
                </span>
                <h2 className="mt-6 text-4xl md:text-5xl font-bold mb-8">
                  Elevate Your Performance
                </h2>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p>
                    At Peak Mode, our mission goes beyond just creating premium fitness gear — we exist to embody a mindset. We were born from the belief that greatness isn't reserved for the few — it's available to anyone willing to <strong className="text-primary">show up</strong>, <strong className="text-primary">stay consistent</strong>, and chase their next level, no matter who's watching.
                  </p>
                  <p>
                    We know the grind isn't always loud. It's early mornings. <strong className="text-primary">Quiet victories</strong>. The sweat that no one claps for. Peak Mode was created to reflect that — not perfection, but the decision to level up, every single day.
                  </p>
                  <p>
                    We don't follow trends — we represent transformation. Each piece we design is made to empower movement with purpose. <strong className="text-primary">Functional. Sleek. Tested.</strong> This isn't about hype — it's about <strong className="text-primary">discipline</strong>. Because Peak Mode isn't a destination — it's a state of becoming. A reminder that your best isn't behind you — it's always ahead. No shortcuts. No excuses. Just <strong className="text-primary">progress</strong>. Just Peaks.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Peak Mode lifestyle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <div className="inline-block px-8 py-4 border-2 border-primary rounded-full">
                <h3 className="text-2xl font-bold uppercase tracking-wider">No Limits. Just Peaks.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Value Cards Section */}
        <section className="peak-section bg-white">
          <div className="peak-container">
            <div 
              ref={valuesRef}
              className={cn(
                "transition-all duration-1000",
                valuesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="text-center mb-16">
                <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b-2 border-primary font-semibold text-primary">
                  Our Values
                </span>
                <h2 className="mt-6 text-4xl md:text-5xl font-bold">
                  What Drives Us Forward
                </h2>
                <p className="mt-6 text-lg max-w-3xl mx-auto">
                  Every decision we make is guided by these core principles that define who we are and what we stand for.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white p-8 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Brain className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Mindset First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our gear is designed to reflect a mindset — not just a style. Every piece is built to match the mental toughness behind real training.
                  </p>
                </div>
                
                <div className="group bg-white p-8 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Target className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Built for the Grind</h3>
                  <p className="text-gray-600 leading-relaxed">
                    No fluff. No shortcuts. Our gear is made to support high-performance training in the gym and durability on the street.
                  </p>
                </div>
                
                <div className="group bg-white p-8 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Purpose Over Hype</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're not driven by trends. We're driven by purpose. From first drop to future launches — it's all about progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Message */}
        <section className="peak-section bg-black text-white">
          <div className="peak-container">
            <div 
              ref={closingRef}
              className={cn(
                "text-center max-w-4xl mx-auto transition-all duration-1000",
                closingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                This is more than just apparel.
              </h2>
              <p className="text-xl md:text-2xl mb-12 leading-relaxed">
                It's a reminder that your peak isn't behind you — it's ahead.
              </p>
              <Link to="/shop">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Shop the Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
    </div>
  );
};

export default AboutPage;
