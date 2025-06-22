interface WelcomeEmailData {
  email: string;
  discountCode: string;
}

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  // In a real application, this would make an API call to your backend
  // The backend would then use a service like SendGrid, AWS SES, etc. to send the email
  
  const emailTemplate = `
    Header:
    Welcome to the Movement.

    Hi ${data.email.split('@')[0]},
    Thanks for joining Peak Mode — where performance meets purpose. You're not just here for gear, you're here to level up.

    Your exclusive 10% discount code: ${data.discountCode}

    Use it at checkout and take the first step toward your next peak. Peak Mode isn't a destination. It's a decision.

    Let's chase progress — together.
    No shortcuts. No excuses. Just Peaks.

    — The Peak Mode Team

    [Shop Now](${window.location.origin})
  `;

  // For now, we'll just simulate the email sending with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Email sent:', emailTemplate);
      resolve(true);
    }, 1000);
  });
}; 