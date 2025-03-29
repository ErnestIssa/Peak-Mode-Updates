
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section id="about" className="peak-section bg-white">
      <div className="peak-container">
      </div>
    </section>
  );
};

export default About;
