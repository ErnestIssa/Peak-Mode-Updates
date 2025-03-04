import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { sendContactMessage } from "@/lib/vornifyDB";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      const result = await sendContactMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );
      
      if (result.success || result.status) {
        setIsSuccess(true);
        toast({
          title: "Message Sent",
          description: "We'll get back to you as soon as possible.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Message submission error:', error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: "support@peakmode.se",
      link: "mailto:support@peakmode.se"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+46 70 123 45 67",
      link: "tel:+46701234567"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "Stockholmsvägen 25, 746 32 Bålsta, Sweden",
      link: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="h-72 bg-black relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
          <div className="text-center text-white relative z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">We'd love to hear from you. Reach out with questions, feedback, or support needs.</p>
          </div>
        </div>

        {/* Contact Section */}
        <section className="peak-section">
          <div className="peak-container">
            <div 
              ref={ref}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Send a Message</h2>
                <p className="mt-4 text-foreground/70">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-border focus:outline-none focus:ring-2 focus:ring-black"
                        required
                        disabled={isSubmitting || isSuccess}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-border focus:outline-none focus:ring-2 focus:ring-black"
                        required
                        disabled={isSubmitting || isSuccess}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-border focus:outline-none focus:ring-2 focus:ring-black"
                      required
                      disabled={isSubmitting || isSuccess}
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Information</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 border border-border focus:outline-none focus:ring-2 focus:ring-black"
                      required
                      disabled={isSubmitting || isSuccess}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`w-full py-3 px-6 bg-black text-white font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${isSubmitting || isSuccess ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black/90'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Contact Information</h2>
                <p className="mt-4 text-foreground/70">
                  Have questions or need assistance? Contact us through any of the channels below.
                </p>
                
                <div className="mt-8 space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-4 bg-secondary p-3 rounded-full">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{info.title}</h3>
                        <a 
                          href={info.link} 
                          className="text-foreground/70 hover:text-foreground transition-colors"
                          target={info.title === "Visit Us" ? "_blank" : undefined}
                          rel={info.title === "Visit Us" ? "noopener noreferrer" : undefined}
                        >
                          {info.details}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>09:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 - 16:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="p-2 bg-secondary hover:bg-secondary/80 transition-colors">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="p-2 bg-secondary hover:bg-secondary/80 transition-colors">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="p-2 bg-secondary hover:bg-secondary/80 transition-colors">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-96 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32873.67599265124!2d17.50288387783202!3d59.567469499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465fb07227c97dc9%3A0xa01907d742eb290!2zQsOlbHN0YQ!5e0!3m2!1ssv!2sse!4v1654267029773!5m2!1ssv!2sse" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            title="Peak Mode Location"
          ></iframe>
        </section>
      </main>
    </div>
  );
};

export default Contact;
