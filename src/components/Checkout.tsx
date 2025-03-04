
import React, { useState, useEffect } from 'react';
import { createPayment, verifyPayment } from '@/lib/vornifyPayAPI';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  cartTotal: number;
  currency: string;
}

declare global {
  interface Window {
    Stripe?: any;
  }
}

const Checkout: React.FC<CheckoutProps> = ({ 
  open, 
  onClose, 
  cartItems, 
  cartTotal, 
  currency 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Load Stripe.js asynchronously
  useEffect(() => {
    if (open && !window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = initializeStripe;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else if (open && window.Stripe) {
      initializeStripe();
    }
  }, [open]);
  
  const initializeStripe = () => {
    // We'll initialize Stripe when we get the public key from the API
  };
  
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };
  
  const initiatePayment = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Please provide your name and email");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a simplified product description for the API
      const productDescription = cartItems.map(item => 
        `${item.name} (${item.quantity})`
      ).join(', ');
      
      // Prepare product data
      const productData = {
        name: "Peak Mode Order",
        product_id: `order_${Date.now()}`,
        description: productDescription,
        customer_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || undefined,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      };
      
      // Create payment request
      const paymentResponse = await createPayment({
        amount: cartTotal,
        currency: currency.toLowerCase(),
        payment_type: "onetime",
        product_data: productData
      });
      
      if (!paymentResponse.status) {
        throw new Error(paymentResponse.error || "Payment initialization failed");
      }
      
      // Initialize Stripe with the received public key
      const stripe = window.Stripe(paymentResponse.public_key);
      setStripeInstance(stripe);
      
      // Store client secret for payment confirmation
      setClientSecret(paymentResponse.client_secret);
      
      // Create card elements
      const elements = stripe.elements();
      const card = elements.create('card', {
        style: {
          base: {
            iconColor: '#6e59a5',
            color: '#1a1f2c',
            fontWeight: '500',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#8e9196'
            }
          },
          invalid: {
            iconColor: '#ef4444',
            color: '#ef4444',
          }
        }
      });
      
      card.mount('#card-element');
      setCardElement(card);
      setPaymentInitiated(true);
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };
  
  const confirmPayment = async () => {
    if (!stripeInstance || !clientSecret) {
      toast.error("Payment not initialized properly");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone || undefined
            }
          }
        }
      );
      
      if (error) {
        throw new Error(error.message || "Payment confirmation failed");
      }
      
      // Verify payment
      const verificationResult = await verifyPayment(paymentIntent.id);
      
      if (!verificationResult.status || verificationResult.payment_status !== "succeeded") {
        throw new Error("Payment verification failed");
      }
      
      // Clear cart on successful payment
      localStorage.removeItem('cart');
      
      toast.success("Payment successful! Thank you for your order.");
      onClose();
      
      // Redirect to a success page or display success message
      setTimeout(() => {
        window.location.href = '/order-confirmation';
      }, 1500);
      
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!paymentInitiated ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your full name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="your.email@example.com"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="+1234567890"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={initiatePayment} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details</h3>
              <p className="text-sm text-muted-foreground">
                Total amount: {cartTotal.toFixed(2)} {currency.toUpperCase()}
              </p>
              
              <div className="rounded-md border border-input p-4">
                <div id="card-element" className="min-h-[40px]"></div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Your payment is secure and encrypted. We accept major credit cards, Apple Pay, Google Pay, and Klarna.
              </p>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setPaymentInitiated(false)}>
                  Back
                </Button>
                <Button onClick={confirmPayment} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Secure Payment" className="h-5 w-5" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
