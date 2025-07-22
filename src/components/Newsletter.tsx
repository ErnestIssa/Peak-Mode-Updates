import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addSubscriber, sendSubscriptionConfirmationEmail } from '@/lib/vornifyDB';

const Newsletter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      // First add subscriber to database
      const result = await addSubscriber(email);
      
      if (result.success || result.status) {
        // Then send confirmation email
        await sendSubscriptionConfirmationEmail(email);
        
        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "You've been added to our newsletter",
        });
        setEmail('');
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="peak-section bg-black text-white">
      <div className="peak-container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-sm uppercase tracking-wider pb-2 border-b border-white/30 font-medium">
            Stay Updated
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold">
            Join The Peak Mode Movement
          </h2>
          <p className="mt-6 text-white/70 text-lg">
            Don't miss out! Limited-time offers and exclusive releases—straight to your inbox. Sign up now!
          </p>
          
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
            />
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="bg-white text-black px-8 py-4 font-medium tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-2 group h-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 animate-fade-in" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-white/50">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 -29.75 165.5 165.5" className="w-6 h-6">
                <path d="M150.7 0h-139c-1 0-2.1.1-3.1.3-1 .2-2 .5-3 1-.9.4-1.8 1.1-2.5 1.8S1.7 4.7 1.3 5.6c-.5.9-.8 1.9-1 3-.2 1-.2 2.1-.3 3.1v82.5c0 1 .1 2.1.3 3.1.2 1 .5 2 1 3 .5.9 1.1 1.8 1.8 2.5s1.6 1.4 2.5 1.8c.9.5 1.9.8 3 1 1 .2 2.1.2 3.1.3h142.1c1 0 2.1-.1 3.1-.3 1-.2 2-.5 3-1 .9-.5 1.8-1.1 2.5-1.8s1.4-1.6 1.8-2.5c.5-.9.8-1.9 1-3 .2-1 .2-2.1.3-3.1v-1.4-78-1.7-1.4c0-1-.1-2.1-.3-3.1-.2-1-.5-2-1-3-.5-.9-1.1-1.8-1.8-2.5s-1.6-1.4-2.5-1.8c-.9-.5-1.9-.8-3-1-1-.2-2.1-.2-3.1-.3H150.7z" fill="#000"/>
                <path d="M150.7 3.5H153.8c.8 0 1.7.1 2.6.2.8.1 1.4.3 2 .6.6.3 1.1.7 1.6 1.2s.9 1 1.2 1.6c.3.6.5 1.2.6 2 .2.9.2 1.8.2 2.6v82.5c0 .8-.1 1.7-.2 2.6-.1.7-.3 1.4-.6 2-.3.6-.7 1.1-1.2 1.6s-1 .9-1.6 1.2c-.6.3-1.2.5-2 .6-.9.2-1.8.2-2.6.2H11.7c-.7 0-1.7-.1-2.6-.2-.7-.1-1.4-.3-2-.7-.6-.3-1.1-.7-1.6-1.2s-.9-1-1.2-1.6c-.3-.6-.5-1.2-.6-2-.2-.9-.2-1.8-.2-2.6v-81-1.4c0-.8.1-1.7.2-2.6.1-.7.3-1.4.6-2 .3-.6.7-1.1 1.2-1.6s1-.9 1.6-1.2c.6-.3 1.2-.5 2-.6.9-.2 1.8-.2 2.6-.2h139" fill="#fff"/>
                <path d="M45.2 35.6c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.6 1.4-6.1 3.1-1.3 1.5-2.5 4-2.2 6.3 2.4.3 4.7-1 6.2-2.8M47.3 39c-3.4-.2-6.3 1.9-7.9 1.9-1.6 0-4.1-1.8-6.8-1.8-3.5.1-6.7 2-8.5 5.2-3.6 6.3-1 15.6 2.6 20.7 1.7 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.7-1.7s4 1.7 6.8 1.6c2.8-.1 4.6-2.5 6.3-5.1 2-2.9 2.8-5.7 2.8-5.8-.1-.1-5.5-2.1-5.5-8.3-.1-5.2 4.2-7.7 4.4-7.8-2.3-3.6-6.1-4-7.4-4.1" fill="#000"/>
                <path d="M76.7 31.9c7.4 0 12.5 5.1 12.5 12.4 0 7.4-5.2 12.5-12.7 12.5h-8.1v12.9h-5.9V31.9h14.2zm-8.3 20h6.7c5.1 0 8-2.8 8-7.5 0-4.8-2.9-7.5-8-7.5h-6.8v15zM90.7 62c0-4.8 3.7-7.8 10.3-8.2l7.6-.4v-2.1c0-3.1-2.1-4.9-5.5-4.9-3.3 0-5.3 1.6-5.8 4h-5.4c.3-5 4.6-8.7 11.4-8.7 6.7 0 11 3.5 11 9.1v19h-5.4v-4.5h-.1c-1.6 3.1-5.1 5-8.7 5-5.6 0-9.4-3.4-9.4-8.3zm17.9-2.5v-2.2l-6.8.4c-3.4.2-5.3 1.7-5.3 4.1 0 2.4 2 4 5 4 4 0 7.1-2.7 7.1-6.3zM119.3 80v-4.6c.4.1 1.4.1 1.8.1 2.6 0 4-1.1 4.9-3.9 0-.1.5-1.7.5-1.7l-10-27.6h6.1l7 22.5h.1l7-22.5h6l-10.3 29.1c-2.4 6.7-5.1 8.8-10.8 8.8-.4-.1-1.8-.1-2.3-.2z" fill="#000"/>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#F4B6C7" stroke="#F3F3F3"></rect>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.41299 25.7963H5V15H7.41299V25.7963ZM13.4398 15H11.0784C11.0784 16.9868 10.1885 18.8104 8.63709 20.0034L7.70155 20.7226L11.3264 25.7967H14.3068L10.9714 21.1277C12.5525 19.5116 13.4398 17.3373 13.4398 15ZM17.289 25.7933H15.0102V15.0021H17.289V25.7933ZM24.1766 18.3286V18.8061C23.5616 18.3754 22.8192 18.1223 22.0185 18.1223C19.8993 18.1223 18.1815 19.8857 18.1815 22.0611C18.1815 24.2365 19.8993 26 22.0185 26C22.8192 26 23.5616 25.7469 24.1766 25.3163V25.7933H26.3539V18.3286H24.1766ZM24.1694 22.0611C24.1694 23.1218 23.2861 23.9818 22.1966 23.9818C21.1071 23.9818 20.2238 23.1218 20.2238 22.0611C20.2238 21.0004 21.1071 20.1407 22.1966 20.1407C23.2861 20.1407 24.1694 21.0004 24.1694 22.0611ZM47.1454 18.8061V18.3286H49.3226V25.7933H47.1454V25.3163C46.5304 25.7469 45.788 26 44.9872 26C42.868 26 41.1502 24.2365 41.1502 22.0611C41.1502 19.8857 42.868 18.1223 44.9872 18.1223C45.788 18.1223 46.5304 18.3754 47.1454 18.8061ZM45.1654 23.9818C46.255 23.9818 47.1381 23.1218 47.1381 22.0611C47.1381 21.0004 46.255 20.1407 45.1654 20.1407C44.0758 20.1407 43.1926 21.0004 43.1926 22.0611C43.1926 23.1218 44.0758 23.9818 45.1654 23.9818ZM50.2675 24.5482C50.2675 23.7736 50.8792 23.1457 51.6337 23.1457C52.3882 23.1457 53 23.7736 53 24.5482C53 25.3227 52.3882 25.9507 51.6337 25.9507C50.8792 25.9507 50.2675 25.3227 50.2675 24.5482ZM37.2814 18.1278C36.4117 18.1278 35.5887 18.405 35.0384 19.1697V18.329H32.8706V25.7933H35.065V21.8706C35.065 20.7354 35.8065 20.1796 36.6993 20.1796C37.6562 20.1796 38.2063 20.7663 38.2063 21.8551V25.7933H40.3809V21.0463C40.3809 19.3092 39.0354 18.1278 37.2814 18.1278ZM29.7219 18.3287V19.3009C30.1583 18.7177 30.9715 18.3291 31.8557 18.3291V20.5013L31.8487 20.501L31.8435 20.5008L31.8379 20.5005L31.8298 20.5003C30.9684 20.5003 29.7269 21.1323 29.7269 22.3082V25.7933H27.4928V18.3287H29.7219Z" fill="#17120F"></path>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 -11 70 70" className="w-6 h-6">
                <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M33.0603 31.5161V25.4741H36.1786C37.4564 25.4741 38.535 25.046 39.4142 24.2015L39.6252 23.9875C41.2313 22.2391 41.1258 19.5155 39.4142 17.898C38.5584 17.0416 37.3861 16.5778 36.1786 16.6016H31.1729V31.5161H33.0603ZM33.0605 23.6425V18.4332H36.2262C36.9063 18.4332 37.5512 18.6948 38.0319 19.1706C39.052 20.1696 39.0754 21.8347 38.0905 22.8694C37.6098 23.3809 36.9297 23.6663 36.2262 23.6425H33.0605ZM48.4293 22.1083C47.6204 21.359 46.5185 20.9784 45.1234 20.9784C43.3298 20.9784 41.9816 21.6444 41.0906 22.9646L42.7553 24.0231C43.3649 23.1192 44.1973 22.6673 45.2524 22.6673C45.9206 22.6673 46.5653 22.9171 47.0694 23.369C47.5618 23.7972 47.8432 24.4156 47.8432 25.0698V25.5098C47.1163 25.1055 46.2019 24.8914 45.0765 24.8914C43.7635 24.8914 42.7084 25.2006 41.923 25.831C41.1375 26.4613 40.739 27.2939 40.739 28.3524C40.7155 29.3158 41.1258 30.2316 41.8527 30.85C42.5912 31.5161 43.5291 31.8491 44.631 31.8491C45.9323 31.8491 46.9639 31.2663 47.7494 30.1007H47.8314V31.5161H49.6368V25.2244C49.6368 23.9042 49.2382 22.8576 48.4293 22.1083ZM43.3066 29.6369C42.9197 29.3514 42.6852 28.8876 42.6852 28.3881C42.6852 27.8291 42.9432 27.3652 43.4473 26.9965C43.9632 26.6278 44.6081 26.4375 45.3702 26.4375C46.4255 26.4256 47.2462 26.6635 47.8325 27.1392C47.8325 27.948 47.5159 28.6497 46.8945 29.2444C46.3317 29.8153 45.5696 30.1364 44.7723 30.1364C44.2446 30.1483 43.7287 29.9699 43.3066 29.6369ZM53.693 35.9999L60.0001 21.3114H57.9485L55.0295 28.6378H54.9943L52.0049 21.3114H49.9534L54.0916 30.8619L51.747 35.9999H53.693Z" fill="#3C4043"/>
                <path d="M26.544 24.1659C26.544 23.5831 26.4971 23.0003 26.4034 22.4294H18.4434V25.7239H23.0037C22.8161 26.7825 22.2065 27.734 21.3155 28.3286V30.4695H24.0353C25.6296 28.9828 26.544 26.7825 26.544 24.1659Z" fill="#4285F4"/>
                <path d="M18.4442 32.539C20.7185 32.539 22.6411 31.7778 24.0361 30.4695L21.3164 28.3287C20.5544 28.852 19.5814 29.1493 18.4442 29.1493C16.2403 29.1493 14.3763 27.6388 13.7081 25.6169H10.9062V27.8291C12.3365 30.7193 15.2555 32.539 18.4442 32.539Z" fill="#34A853"/>
                <path d="M13.708 25.6169C13.3563 24.5584 13.3563 23.4048 13.708 22.3343V20.134H10.9058C9.69808 22.5484 9.69808 25.4029 10.9058 27.8172L13.708 25.6169Z" fill="#FBBC04"/>
                <path d="M18.4442 18.8019C19.6517 18.7781 20.8123 19.242 21.6798 20.0864L24.0948 17.6363C22.559 16.1853 20.5427 15.3885 18.4442 15.4123C15.2555 15.4123 12.3365 17.2439 10.9062 20.134L13.7081 22.3462C14.3763 20.3124 16.2403 18.8019 18.4442 18.8019Z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm2-6c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm4 6c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z"/>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-6 h-6">
                <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.287 16.338L8.67 13.206c0 0-0.278-0.68-1.003-0.68-0.725 0-2.834 0-2.834 0S8.446 13.629 9.287 16.338z" fill="currentColor"/>
                <path d="M12.782 19.414h1.832l1.108-6.904h-1.854l-1.086 6.904z" fill="currentColor"/>
                <path d="M11.184 12.51l-1.676 4.917c0 0-0.096-0.419-0.137-0.679-0.955-2.14-2.504-2.924-2.504-2.924l1.471 5.59v-0.001h2.018l2.788-6.903H11.184z" fill="currentColor"/>
                <path d="M18.321 14.487c0-0.4 0.318-0.698 1.229-0.698 0.593 0 1.271 0.446 1.271 0.446l0.297-1.525c0 0-0.868-0.339-1.717-0.339-1.926 0-2.921 0.953-2.921 2.159 0 2.181 2.54 1.883 2.54 3.004 0 0.191-0.148 0.635-1.206 0.635-1.06 0-1.759-0.403-1.759-0.403l-0.317 1.463c0 0 0.678 0.401 1.991 0.401 1.312 0 3.134-1.016 3.134-2.477 0-1.461-2.542-1.587-2.542-2.37z" fill="currentColor"/>
                <path d="M25.748 12.51h-1.927l-3.007 6.903h1.819l0.377-0.985h2.293l0.197 0.985h1.667L25.748 12.51zm-2.23 4.599l0.996-2.608 0.523 2.608h-1.519z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
