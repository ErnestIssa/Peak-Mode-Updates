
/**
 * Utility for interacting with VornifyDB API
 */

export const VORNIFY_API_URL = 'https://api.vornify.se/api/vornifydb';
export const VORNIFY_EMAIL_API_URL = 'https://api.vornify.se/api/email';
export const DATABASE_NAME = "peak_mode_49rjf9w";

interface VornifyResponse {
  success?: boolean;
  status?: boolean;
  data?: any;
  error?: string;
}

interface VornifyEmailResponse {
  status: boolean;
  message: string;
  messageId?: string;
  timestamp?: string;
  error?: string;
}

export type VornifyCommand = 
  | "--create" 
  | "--read" 
  | "--update" 
  | "--delete" 
  | "--verify" 
  | "--append" 
  | "--update-field"
  | "--delete-field";

/**
 * Execute a command against the VornifyDB API
 */
export async function executeVornifyCommand(
  collection: string,
  command: VornifyCommand,
  data: any
): Promise<VornifyResponse> {
  try {
    const response = await fetch(VORNIFY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database_name: DATABASE_NAME,
        collection_name: collection,
        command,
        data
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("VornifyDB operation failed:", error);
    return {
      success: false,
      status: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Create a new subscriber in the database
 */
export async function addSubscriber(email: string): Promise<VornifyResponse> {
  return executeVornifyCommand("subscribers", "--create", {
    id: `subscriber_${Date.now()}`,
    email,
    subscribed_at: new Date().toISOString(),
  });
}

/**
 * Get all subscribers from the database
 */
export async function getSubscribers(): Promise<VornifyResponse> {
  return executeVornifyCommand("subscribers", "--read", {});
}

/**
 * Send a contact message to the database
 */
export async function sendContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<VornifyResponse> {
  return executeVornifyCommand("contact_messages", "--create", {
    id: `msg_${Date.now()}`,
    name,
    email,
    subject,
    message,
    submitted_at: new Date().toISOString(),
    status: "new"
  });
}

/**
 * Send email using Vornify Email API
 */
export async function sendEmail(
  toEmail: string,
  subject: string,
  htmlBody: string
): Promise<VornifyEmailResponse> {
  try {
    const response = await fetch(VORNIFY_EMAIL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email: toEmail,
        subject,
        html_body: htmlBody
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Vornify Email API operation failed:", error);
    return {
      status: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Send a contact confirmation email
 */
export async function sendContactConfirmationEmail(
  name: string,
  email: string
): Promise<VornifyEmailResponse> {
  const subject = "Thank you for contacting Peak Mode";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://b2c2e695-7170-4d63-864f-561e769e2cb2.lovableproject.com/peak-mode-logo.png" alt="Peak Mode Logo" style="max-width: 150px;">
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <h2 style="color: #333; margin-top: 0;">Thank You for Contacting Us!</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hello ${name},
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          Thank you for reaching out to Peak Mode. We have received your message and our team will review it shortly.
          We aim to respond to all inquiries within 24-48 hours.
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          In the meantime, feel free to browse our latest collections on our website.
        </p>
        
        <p style="color: #555; line-height: 1.6; margin-top: 20px;">
          Best regards,<br>
          The Peak Mode Team
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Peak Mode. All rights reserved.</p>
        <p>Stockholmsvägen 25, 746 32 Bålsta, Sweden</p>
      </div>
    </div>
  `;
  
  return sendEmail(email, subject, htmlBody);
}

/**
 * Send a newsletter subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  email: string
): Promise<VornifyEmailResponse> {
  const subject = "Welcome to the Peak Mode Newsletter";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://b2c2e695-7170-4d63-864f-561e769e2cb2.lovableproject.com/peak-mode-logo.png" alt="Peak Mode Logo" style="max-width: 150px;">
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <h2 style="color: #333; margin-top: 0;">Thanks for Subscribing!</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hello,
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          Thank you for subscribing to the Peak Mode newsletter. You'll now be the first to know about our new collections, exclusive offers, and upcoming events.
        </p>
        
        <p style="color: #555; line-height: 1.6; margin-top: 20px;">
          Best regards,<br>
          The Peak Mode Team
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Peak Mode. All rights reserved.</p>
        <p>Stockholmsvägen 25, 746 32 Bålsta, Sweden</p>
        <p>
          If you didn't subscribe to our newsletter, please ignore this email.
        </p>
      </div>
    </div>
  `;
  
  return sendEmail(email, subject, htmlBody);
}
