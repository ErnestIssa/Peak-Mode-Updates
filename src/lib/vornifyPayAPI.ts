
/**
 * Utility for interacting with VornifyPay API
 */

export const VORNIFY_PAY_API_URL = 'https://api.vornify.se/api/vornifypay';

export interface PaymentRequestData {
  amount: number;
  currency: string;
  payment_type: string;
  product_data: {
    name: string;
    product_id: string;
    description: string;
    customer_name: string;
    email: string;
    phone?: string;
    [key: string]: any;
  };
}

export interface PaymentResponse {
  status: boolean;
  payment_intent_id: string;
  client_secret: string;
  public_key: string;
  amount: number;
  currency: string;
  payment_type: string;
  product_details: any;
  error?: string;
}

/**
 * Create a one-time payment
 */
export async function createPayment(data: PaymentRequestData): Promise<PaymentResponse> {
  try {
    const response = await fetch(VORNIFY_PAY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'payment',
        data
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("VornifyPay API operation failed:", error);
    return {
      status: false,
      payment_intent_id: '',
      client_secret: '',
      public_key: '',
      amount: 0,
      currency: '',
      payment_type: '',
      product_details: {},
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Verify payment status
 */
export async function verifyPayment(paymentIntentId: string): Promise<any> {
  try {
    const response = await fetch(VORNIFY_PAY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'verify',
        data: {
          payment_intent_id: paymentIntentId
        }
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("VornifyPay verification failed:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
