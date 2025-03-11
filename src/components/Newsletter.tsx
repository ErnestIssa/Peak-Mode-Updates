
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
        title: "Fel",
        description: "Vänligen ange din e-postadress",
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
          title: "Framgång!",
          description: "Du har lagts till i vårt nyhetsbrev",
        });
        setEmail('');
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Prenumeration misslyckades');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Prenumeration misslyckades",
        description: "Det uppstod ett fel vid prenumeration på nyhetsbrevet. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Håll Dig Uppdaterad
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold">
            Gå Med I Peak-Rörelsen
          </h2>
          <p className="mt-6 text-white/70 text-lg">
            Prenumerera för att få exklusiv tillgång till nya lanseringar, specialerbjudanden och träningstips.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Ange din e-post"
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
                  <span>Prenumererar...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 animate-fade-in" />
                  <span>Prenumererad!</span>
                </>
              ) : (
                <>
                  <span>Prenumerera</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-white/50">
            Genom att prenumerera godkänner du vår integritetspolicy och samtycker till att få uppdateringar från vårt företag.
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
