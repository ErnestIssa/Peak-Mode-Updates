
import React from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import Newsletter from '../components/Newsletter';

const AboutPage = () => {
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
                    Peak Mode began in 2018 when founder Alex Johnson, a former professional athlete, 
                    couldn't find fitness apparel that balanced performance, durability, and style. 
                    What started as a small collection designed in a garage has grown into a movement 
                    embraced by athletes and fitness enthusiasts worldwide.
                  </p>
                  <p>
                    Our journey has been defined by a relentless pursuit of innovation and quality. 
                    Each product is rigorously tested under extreme conditions to ensure it performs 
                    when you need it most. We believe that when your gear works flawlessly, you can 
                    focus entirely on reaching new heights.
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
                Elevating Performance Through Innovation
              </h2>
              <p className="mt-6 text-lg">
                At Peak Mode, our mission is to create performance apparel that empowers individuals to 
                break through their limits. We believe that everyone has untapped potential that the right 
                gear can help unlock. Through innovative design, premium materials, and a commitment to 
                sustainability, we're redefining what athletes can expect from their apparel.
              </p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Quality</h3>
                  <p className="mt-4">Premium materials and craftsmanship that stand up to extreme conditions</p>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Innovation</h3>
                  <p className="mt-4">Constantly pushing boundaries with new technologies and designs</p>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold">Sustainability</h3>
                  <p className="mt-4">Eco-friendly practices and materials throughout our production process</p>
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
                  <h3 className="text-2xl font-bold mb-4">Excellence in Everything</h3>
                  <p>
                    We never settle for "good enough." From the stitching on our garments to the 
                    experience on our website, we pursue excellence in every detail. It's this 
                    commitment that creates the Peak Mode difference.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Community First</h3>
                  <p>
                    The Peak Mode community is at the heart of everything we do. We actively listen, 
                    engage, and build relationships with the athletes and fitness enthusiasts who wear 
                    our gear, using their feedback to continuously improve.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Sustainable Innovation</h3>
                  <p>
                    We believe that performance and sustainability can coexist. We're constantly 
                    researching and implementing new materials and manufacturing techniques that reduce 
                    our environmental footprint without compromising quality.
                  </p>
                </div>
                
                <div className="bg-white p-8 border border-border">
                  <h3 className="text-2xl font-bold mb-4">Inclusive Performance</h3>
                  <p>
                    Peak performance isn't reserved for elite athletes. We design our products to 
                    serve individuals at all fitness levels, body types, and backgrounds. Everyone 
                    deserves gear that helps them reach their personal peak.
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
