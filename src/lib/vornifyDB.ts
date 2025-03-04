
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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #9b87f5; padding-bottom: 20px;">
        <h1 style="font-family: 'Montserrat', Arial, sans-serif; color: #1A1F2C; margin: 0; letter-spacing: 5px; font-weight: 700; font-size: 28px;">PEAK | MODE</h1>
      </div>
      
      <div style="padding: 20px; background-color: #F1F0FB; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #6E59A5; margin-top: 0; font-family: 'Montserrat', Arial, sans-serif; font-weight: 600;">Thank You for Contacting Us!</h2>
        
        <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
          Hello ${name},
        </p>
        
        <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
          Thank you for reaching out to Peak Mode. We have received your message and our team will review it shortly.
          We aim to respond to all inquiries within 24-48 hours.
        </p>
        
        <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
          In the meantime, feel free to browse our latest collections on our website.
        </p>
        
        <div style="margin-top: 30px; background-color: #ffffff; border-radius: 8px; padding: 15px; border-left: 4px solid #9b87f5;">
          <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin: 0;">
            Best regards,<br>
            <strong>The Peak Mode Team</strong>
          </p>
        </div>
      </div>
      
      <a href="https://peakmode.com" style="display: block; text-align: center; margin: 25px auto; background-color: #9b87f5; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; letter-spacing: 0.5px; font-family: 'Montserrat', Arial, sans-serif; max-width: 200px;">Visit Our Website</a>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #8E9196; font-size: 13px;">
        <p style="margin-bottom: 10px;">© ${new Date().getFullYear()} Peak Mode. All rights reserved.</p>
        <p style="margin-bottom: 10px;">Stockholmsvägen 25, 746 32 Bålsta, Sweden</p>
        <div style="margin-top: 15px;">
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Instagram</a>
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Facebook</a>
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Twitter</a>
        </div>
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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #9b87f5; padding-bottom: 20px;">
        <h1 style="font-family: 'Montserrat', Arial, sans-serif; color: #1A1F2C; margin: 0; letter-spacing: 5px; font-weight: 700; font-size: 28px;">PEAK | MODE</h1>
      </div>
      
      <div style="padding: 25px; background-color: #E5DEFF; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #6E59A5; margin-top: 0; font-family: 'Montserrat', Arial, sans-serif; font-weight: 600;">Thanks for Subscribing!</h2>
        
        <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
          Hello there,
        </p>
        
        <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
          Thank you for subscribing to the Peak Mode newsletter. You'll now be the first to know about:
        </p>
        
        <ul style="color: #403E43; line-height: 1.8; font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
          <li>New clothing collections and drops</li>
          <li>Exclusive subscriber-only offers</li>
          <li>Limited edition items and collaborations</li>
          <li>Fashion tips and styling advice</li>
        </ul>
        
        <div style="margin-top: 25px; background-color: #ffffff; border-radius: 8px; padding: 15px; border-left: 4px solid #9b87f5;">
          <p style="color: #403E43; line-height: 1.6; font-size: 16px; margin: 0;">
            Stay elevated,<br>
            <strong>The Peak Mode Team</strong>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="https://peakmode.com/shop" style="display: inline-block; background-color: #9b87f5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; letter-spacing: 0.5px; font-family: 'Montserrat', Arial, sans-serif; margin: 0 10px;">Shop Now</a>
        <a href="https://peakmode.com/account" style="display: inline-block; background-color: #ffffff; border: 2px solid #9b87f5; color: #9b87f5; text-decoration: none; padding: 10px 25px; border-radius: 6px; font-weight: 600; letter-spacing: 0.5px; font-family: 'Montserrat', Arial, sans-serif; margin: 0 10px;">My Account</a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #8E9196; font-size: 13px;">
        <p style="margin-bottom: 10px;">© ${new Date().getFullYear()} Peak Mode. All rights reserved.</p>
        <p style="margin-bottom: 10px;">Stockholmsvägen 25, 746 32 Bålsta, Sweden</p>
        <p style="margin-bottom: 15px; font-style: italic;">
          If you didn't subscribe to our newsletter, please ignore this email.
        </p>
        <div style="margin-top: 15px;">
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Instagram</a>
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Facebook</a>
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Twitter</a>
          <a href="#" style="color: #9b87f5; margin: 0 8px; text-decoration: none;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;
  
  return sendEmail(email, subject, htmlBody);
}
