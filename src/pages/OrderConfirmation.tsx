
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="peak-container py-20 min-h-screen">
        <div className="max-w-2xl mx-auto bg-secondary/30 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-6 rounded-full">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. We've received your order and will process it right away.
            You'll receive a confirmation email shortly with your order details.
          </p>
          
          <div className="bg-background p-6 rounded-md mb-6">
            <h2 className="font-medium mb-4">What's Next?</h2>
            <ul className="text-left space-y-2 text-sm">
              <li>1. We'll process your order within 1-2 business days</li>
              <li>2. You'll receive shipping confirmation and tracking information by email</li>
              <li>3. Your items will be delivered within 3-7 business days</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
