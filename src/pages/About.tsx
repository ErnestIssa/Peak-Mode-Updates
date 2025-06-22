import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import Newsletter from '../components/Newsletter';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="h-96 bg-black relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
          <div className="text-center text-white relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl max-w-2xl mx-auto">Committed to quality, performance, and pushing boundaries.</p>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="peak-section">
          <div className="peak-container">
            <div 
              ref={storyRef}
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-12 items-center transition-all duration-700",
                storyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div>
                <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                  Our Story
                </span>
                <h2 className="mt-6 text-3xl font-bold">From Passion to Peak Performance</h2>
                <div className="mt-6 space-y-4">
                  <p>
                    Peak Mode isn't just apparel — it's a declaration. Born from the mindset of someone who trained in silence, overlooked but never outworked, Peak Mode was never about following trends. It was built to represent a deeper truth: that real transformation doesn't come from hype, but from showing up when it's hard, when no one's watching, and when the only competition is who you were yesterday. This brand was created for those who train not for attention, but for growth — those who know that discomfort, discipline, and quiet consistency are where progress lives.
                  </p>
                  <p>
                    Every product from Peak Mode is crafted to echo that mindset. With functional performance at the core, each piece is designed to support your toughest workouts and your everyday grind — no fluff, no shortcuts. It's not about being perfect — it's about choosing your peak, and chasing it relentlessly. When you wear Peak Mode, you're not just putting on gear. You're stepping into the version of yourself that refuses to settle. Because the peak isn't a destination — it's a mode you enter. And once you're in it, there's no turning back.
                  </p>
                </div>
              </div>
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Peak Mode founder"
                  className="w-full h-full object-cover"
                />
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
                "max-w-4xl mx-auto text-center transition-all duration-700",
                missionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                Our Mission
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                Elevate Your Performance
              </h2>
              <p className="mt-6 text-lg">
                At Peak Mode, our mission goes beyond just creating premium fitness gear — we exist to embody a mindset. We were born from the belief that greatness isn't reserved for the few — it's available to anyone willing to show up, stay consistent, and chase their next level, no matter who's watching. We know the grind isn't always loud. It's early mornings. Quiet victories. The sweat that no one claps for. Peak Mode was created to reflect that — not perfection, but the decision to level up, every single day.
              </p>
              <p className="mt-4 text-lg">
                We don't follow trends — we represent transformation. Each piece we design, starting with our flagship performance shorts, is made to empower movement with purpose. Functional. Sleek. Tested. This isn't about hype — it's about discipline. Because Peak Mode isn't a destination — it's a state of becoming. A reminder that your best isn't behind you — it's always ahead. No shortcuts. No excuses. Just progress. Just Peaks.
              </p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Grind</h3>
                  <p className="mt-4">We build gear for the quiet, relentless effort that defines true greatness.</p>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Commitment</h3>
                  <p className="mt-4">Our mission is to empower those who train with purpose, discipline, and consistency.</p>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Mindset</h3>
                  <p className="mt-4">Peak Mode represents the daily choice to push beyond limits and embrace excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section (New) */}
        <section className="peak-section">
          <div className="peak-container">
            <div 
              ref={valuesRef}
              className={cn(
                "transition-all duration-700",
                valuesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="text-center mb-12">
                <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                  Our Values
                </span>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                  What Drives Us Forward
                </h2>
                <p className="mt-6 text-lg max-w-3xl mx-auto">
                  Every decision we make is guided by these core principles that define who we are and what we stand for.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Mindset Over Hype</h3>
                  <p>
                    We don't chase trends — we build from truth. Peak Mode exists for those who train 
                    for more than likes or aesthetics. Our gear is designed to reflect a deeper purpose: 
                    progress in silence, discipline in motion. Every thread stands for the decision to 
                    show up, even when no one's watching.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Function Meets Intent</h3>
                  <p>
                    Every piece we create has a purpose — whether it's the fit that moves with you or 
                    the material that lasts through grind sessions. No fluff, no wasted fabric. Just 
                    functional performance wear that elevates your movement and mirrors your mission. 
                    Built for comfort. Engineered for progress.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Real People. Real Progress.</h3>
                  <p>
                    We're not here to glorify perfection. We honor effort — raw, consistent, and real. 
                    Peak Mode is for anyone who's tired of being overlooked, and ready to own their 
                    story. This brand was built by one of you, for all of you.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Peaks Are Earned Daily</h3>
                  <p>
                    We believe your peak isn't a destination — it's a mode you enter every single day. 
                    Through discomfort. Through reps. Through choices that no one claps for. Peak Mode 
                    is your reminder that you're built for more, and the summit is always ahead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
    </div>
  );
};

export default AboutPage;
