
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

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      name: "Sarah Martinez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      name: "Marcus Chen",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      name: "Olivia Taylor",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    }
  ];

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

        {/* Team Section */}
        <section className="peak-section">
          <div className="peak-container">
            <div 
              ref={teamRef}
              className={cn(
                "text-center transition-all duration-700",
                teamInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-black font-medium">
                Our Team
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                The Faces Behind Peak Mode
              </h2>
              <p className="mt-6 text-lg max-w-3xl mx-auto">
                Our diverse team of athletes, designers, and innovators share a common passion: 
                creating gear that helps you reach your peak.
              </p>
              
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="transition-all duration-500" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 text-xl font-medium">{member.name}</h3>
                    <p className="text-foreground/70">{member.role}</p>
                  </div>
                ))}
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
