
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/lib/peakModeService";
import { trackFormData, clearFormData } from "../lib/userInteractions";

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
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Track form data for reload navigation
    trackFormData('contact', newFormData);
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
      // Send message using peakModeService (with backend fallback)
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new' as const
      });
        
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
        
        // Clear form data tracking
        clearFormData('contact');
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
                    <a 
                      href="https://www.tiktok.com/@peakmode.co?_t=ZN-8yK5XPNYEr8&_r=1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg fill="currentColor" viewBox="0 0 256 256" width="24" height="24" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.3))' }}>
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                          <path d="M224,80a52.059,52.059,0,0,1-52-52,4.0002,4.0002,0,0,0-4-4H128a4.0002,4.0002,0,0,0-4,4V156a24,24,0,1,1-34.28418-21.69238,3.99957,3.99957,0,0,0,2.28369-3.61279L92,89.05569a3.99948,3.99948,0,0,0-4.70117-3.938A72.00522,72.00522,0,1,0,172,156l-.00049-42.56348A99.27749,99.27749,0,0,0,224,128a4.0002,4.0002,0,0,0,4-4V84A4.0002,4.0002,0,0,0,224,80Zm-4,39.915a91.24721,91.24721,0,0,1-49.66455-17.1792,4.00019,4.00019,0,0,0-6.33594,3.24707L164,156A64,64,0,1,1,84,94.01223l-.00049,34.271A32.00156,32.00156,0,1,0,132,156V32h32.13184A60.09757,60.09757,0,0,0,220,87.86819Z"></path> 
                        </g>
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/peakmode1?igsh=dWc3aTQwMncxbzJ5&utm_source=qr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg fill="currentColor" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                          <title>instagram</title> 
                          <path d="M25.805 7.996c0 0 0 0.001 0 0.001 0 0.994-0.806 1.799-1.799 1.799s-1.799-0.806-1.799-1.799c0-0.994 0.806-1.799 1.799-1.799v0c0.993 0.001 1.798 0.805 1.799 1.798v0zM16 20.999c-2.761 0-4.999-2.238-4.999-4.999s2.238-4.999 4.999-4.999c2.761 0 4.999 2.238 4.999 4.999v0c0 0 0 0.001 0 0.001 0 2.76-2.237 4.997-4.997 4.997-0 0-0.001 0-0.001 0h0zM16 8.3c0 0 0 0-0 0-4.253 0-7.7 3.448-7.7 7.7s3.448 7.7 7.7 7.7c4.253 0 7.7-3.448 7.7-7.7v0c0-0 0-0 0-0.001 0-4.252-3.447-7.7-7.7-7.7-0 0-0 0-0.001 0h0zM16 3.704c4.003 0 4.48 0.020 6.061 0.089 1.003 0.012 1.957 0.202 2.84 0.538l-0.057-0.019c1.314 0.512 2.334 1.532 2.835 2.812l0.012 0.034c0.316 0.826 0.504 1.781 0.516 2.778l0 0.005c0.071 1.582 0.087 2.057 0.087 6.061s-0.019 4.48-0.092 6.061c-0.019 1.004-0.21 1.958-0.545 2.841l0.019-0.058c-0.258 0.676-0.64 1.252-1.123 1.726l-0.001 0.001c-0.473 0.484-1.049 0.866-1.692 1.109l-0.032 0.011c-0.829 0.316-1.787 0.504-2.788 0.516l-0.005 0c-1.592 0.071-2.061 0.087-6.072 0.087-4.013 0-4.481-0.019-6.072-0.092-1.008-0.019-1.966-0.21-2.853-0.545l0.059 0.019c-0.676-0.254-1.252-0.637-1.722-1.122l-0.001-0.001c-0.489-0.47-0.873-1.047-1.114-1.693l-0.010-0.031c-0.315-0.828-0.506-1.785-0.525-2.785l-0-0.008c-0.056-1.575-0.076-2.061-0.076-6.053 0-3.994 0.020-4.481 0.076-6.075 0.019-1.007 0.209-1.964 0.544-2.85l-0.019 0.059c0.247-0.679 0.632-1.257 1.123-1.724l0.002-0.002c0.468-0.492 1.045-0.875 1.692-1.112l0.031-0.010c0.823-0.318 1.774-0.509 2.768-0.526l0.007-0c1.593-0.056 2.062-0.075 6.072-0.075zM16 1.004c-4.074 0-4.582 0.019-6.182 0.090-1.315 0.028-2.562 0.282-3.716 0.723l0.076-0.025c-1.040 0.397-1.926 0.986-2.656 1.728l-0.001 0.001c-0.745 0.73-1.333 1.617-1.713 2.607l-0.017 0.050c-0.416 1.078-0.67 2.326-0.697 3.628l-0 0.012c-0.075 1.6-0.090 2.108-0.090 6.182s0.019 4.582 0.090 6.182c0.028 1.315 0.282 2.562 0.723 3.716l-0.025-0.076c0.796 2.021 2.365 3.59 4.334 4.368l0.052 0.018c1.078 0.415 2.326 0.669 3.628 0.697l0.012 0c1.6 0.075 2.108 0.090 6.182 0.090s4.582-0.019 6.182-0.090c1.315-0.029 2.562-0.282 3.716-0.723l-0.076 0.026c2.021-0.796 3.59-2.365 4.368-4.334l0.018-0.052c0.416-1.078 0.669-2.326 0.697-3.628l0-0.012c0.075-1.6 0.090-2.108 0.090-6.182s-0.019-4.582-0.090-6.182c-0.029-1.315-0.282-2.562-0.723-3.716l0.026 0.076c-0.398-1.040-0.986-1.926-1.729-2.656l-0.001-0.001c-0.73-0.745-1.617-1.333-2.607-1.713l-0.050-0.017c-1.078-0.416-2.326-0.67-3.628-0.697l-0.012-0c-1.6-0.075-2.108-0.090-6.182-0.090z"></path> 
                        </g>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/peakmode" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 14.906 32" width="24" height="24">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                          <path d="M14.874,11.167 L14.262,14.207 C14.062,15.208 13.100,15.992 12.072,15.992 L10.000,15.992 L10.000,30.000 C10.000,31.104 9.159,32.000 8.049,32.000 L5.030,32.000 C3.920,32.000 3.017,31.102 3.017,29.999 L3.017,15.992 L2.011,15.992 C0.901,15.992 -0.002,15.095 -0.002,13.991 L-0.002,10.990 C-0.002,9.887 0.901,8.989 2.011,8.989 L3.017,8.989 L3.017,6.003 C3.017,2.716 5.693,0.041 8.994,0.013 C9.015,0.012 9.033,0.001 9.055,0.001 L13.081,0.001 C13.636,0.001 14.000,0.448 14.000,1.000 L14.000,6.000 C14.000,6.553 13.636,7.004 13.081,7.004 L10.061,7.004 L10.060,8.989 L13.079,8.989 C13.645,8.989 14.167,9.228 14.509,9.644 C14.852,10.059 14.985,10.615 14.874,11.167 ZM9.092,10.990 C9.078,10.991 9.067,10.998 9.053,10.998 L9.053,10.998 C8.497,10.997 8.046,10.549 8.047,9.997 L8.047,9.990 C8.047,9.990 8.047,9.990 8.047,9.990 C8.047,9.990 8.047,9.990 8.047,9.990 L8.049,6.003 C8.049,5.450 8.499,5.003 9.055,5.003 L12.074,5.003 L12.074,2.002 L9.094,2.002 C9.077,2.002 9.063,2.011 9.045,2.011 C6.831,2.011 5.030,3.802 5.030,6.003 L5.030,10.005 C5.030,10.558 4.579,11.006 4.023,11.006 C3.996,11.006 3.973,10.992 3.946,10.990 L2.011,10.990 L2.011,13.991 L4.023,13.991 C4.579,13.991 5.030,14.439 5.030,14.992 C5.030,15.044 5.008,15.088 5.000,15.138 L5.000,30.000 L8.049,29.999 L8.049,15.002 C8.049,14.998 8.047,14.995 8.047,14.992 C8.047,14.439 8.497,13.991 9.053,13.991 L12.072,13.991 C12.145,13.991 12.275,13.886 12.288,13.816 L12.857,10.990 L9.092,10.990 Z"></path> 
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where the Mode Begins Section */}
        <section className="py-8 bg-white">
          <div className="peak-container">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Where the Mode Begins.
              </h2>
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
