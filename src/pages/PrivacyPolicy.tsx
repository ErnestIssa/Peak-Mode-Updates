import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/checkout" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  PEAK MODE AB ("we," "our," or "us") is committed to protecting your privacy and personal data. 
                  This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
                </p>
                <p className="text-gray-700">
                  We process personal data in accordance with the General Data Protection Regulation (GDPR) 
                  and the Swedish Data Protection Act (Dataskyddslagen).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">2. Data Controller</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>PEAK MODE AB</strong></p>
                  <p className="text-gray-700 mb-2">Organization number: [ORG NUMBER]</p>
                  <p className="text-gray-700 mb-2">Address: [COMPANY ADDRESS]</p>
                  <p className="text-gray-700 mb-2">Email: privacy@peakmode.se</p>
                  <p className="text-gray-700">Phone: +46 [PHONE NUMBER]</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">3. Personal Data We Collect</h2>
                <p className="text-gray-700 mb-4">We collect the following types of personal data:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">3.1 Account Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Account credentials</li>
                  <li>Order history and preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">3.2 Transaction Data</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Payment information (processed securely by payment providers)</li>
                  <li>Order details and purchase history</li>
                  <li>Shipping and delivery information</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">3.3 Technical Data</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Website usage data and analytics</li>
                  <li>Cookies and similar technologies</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">3.4 Communication Data</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Customer service communications</li>
                  <li>Feedback and reviews</li>
                  <li>Marketing preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">4. How We Collect Your Data</h2>
                <p className="text-gray-700 mb-4">We collect personal data through:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Direct interactions:</strong> When you create an account, place orders, or contact us</li>
                  <li><strong>Automated technologies:</strong> Cookies, analytics tools, and website tracking</li>
                  <li><strong>Third parties:</strong> Payment processors, shipping partners, and analytics services</li>
                  <li><strong>Public sources:</strong> Social media profiles (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">5. Legal Basis for Processing</h2>
                <p className="text-gray-700 mb-4">We process your personal data based on the following legal grounds:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">5.1 Contract Performance</h3>
                <p className="text-gray-700 mb-4">
                  Processing necessary to fulfill orders and provide our services, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Order processing and fulfillment</li>
                  <li>Payment processing</li>
                  <li>Shipping and delivery</li>
                  <li>Customer service</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">5.2 Legitimate Interests</h3>
                <p className="text-gray-700 mb-4">
                  Processing for our legitimate business interests, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Website security and fraud prevention</li>
                  <li>Analytics and website improvement</li>
                  <li>Marketing communications (with opt-out rights)</li>
                  <li>Legal compliance and record keeping</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">5.3 Consent</h3>
                <p className="text-gray-700 mb-4">
                  Processing based on your explicit consent for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Marketing communications</li>
                  <li>Cookies and tracking technologies</li>
                  <li>Social media integration</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">6. How We Use Your Data</h2>
                <p className="text-gray-700 mb-4">We use your personal data for the following purposes:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">6.1 Service Provision</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Processing and fulfilling your orders</li>
                  <li>Managing your account and preferences</li>
                  <li>Providing customer support</li>
                  <li>Sending order confirmations and updates</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">6.2 Communication</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Responding to your inquiries and requests</li>
                  <li>Sending service-related notifications</li>
                  <li>Marketing communications (with your consent)</li>
                  <li>Newsletters and promotional offers</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">6.3 Business Operations</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Website analytics and improvement</li>
                  <li>Fraud prevention and security</li>
                  <li>Legal compliance and record keeping</li>
                  <li>Business development and research</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">7. Data Sharing and Transfers</h2>
                <p className="text-gray-700 mb-4">We may share your data with:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">7.1 Service Providers</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Payment processors (Stripe, PayPal, etc.)</li>
                  <li>Shipping and logistics partners</li>
                  <li>IT and hosting services</li>
                  <li>Analytics and marketing tools</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">7.2 Legal Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Government authorities when required by law</li>
                  <li>Legal proceedings and court orders</li>
                  <li>Regulatory compliance</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">7.3 Business Transfers</h3>
                <p className="text-gray-700">
                  In case of merger, acquisition, or sale of assets, your data may be transferred 
                  to the new entity with appropriate safeguards.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">8. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your data may be transferred to countries outside the EU/EEA. We ensure adequate protection through:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Adequacy decisions by the European Commission</li>
                  <li>Standard Contractual Clauses (SCCs)</li>
                  <li>Binding Corporate Rules (BCRs)</li>
                  <li>Other appropriate safeguards</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">9. Data Security</h2>
                <p className="text-gray-700 mb-4">We implement appropriate security measures to protect your data:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure payment processing</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Staff training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">10. Data Retention</h2>
                <p className="text-gray-700 mb-4">We retain your data for the following periods:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">10.1 Account Data</h3>
                <p className="text-gray-700 mb-4">
                  Retained for the duration of your account plus 3 years for legal compliance.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">10.2 Transaction Data</h3>
                <p className="text-gray-700 mb-4">
                  Retained for 7 years for accounting and tax purposes.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">10.3 Marketing Data</h3>
                <p className="text-gray-700 mb-4">
                  Retained until you withdraw consent or unsubscribe.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">10.4 Analytics Data</h3>
                <p className="text-gray-700">
                  Retained for 2 years for website improvement purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">11. Your Rights</h2>
                <p className="text-gray-700 mb-4">Under GDPR, you have the following rights:</p>
                
                <h3 className="text-lg font-semibold text-black mb-3">11.1 Access and Information</h3>
                <p className="text-gray-700 mb-4">
                  Right to access your personal data and information about how we process it.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.2 Rectification</h3>
                <p className="text-gray-700 mb-4">
                  Right to correct inaccurate or incomplete personal data.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.3 Erasure</h3>
                <p className="text-gray-700 mb-4">
                  Right to delete your personal data ("right to be forgotten").
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.4 Restriction</h3>
                <p className="text-gray-700 mb-4">
                  Right to limit how we process your personal data.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.5 Portability</h3>
                <p className="text-gray-700 mb-4">
                  Right to receive your data in a structured, machine-readable format.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.6 Objection</h3>
                <p className="text-gray-700 mb-4">
                  Right to object to processing based on legitimate interests.
                </p>

                <h3 className="text-lg font-semibold text-black mb-3">11.7 Withdraw Consent</h3>
                <p className="text-gray-700">
                  Right to withdraw consent for processing based on consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">12. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Essential cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics cookies:</strong> Help us understand website usage</li>
                  <li><strong>Marketing cookies:</strong> Used for personalized advertising</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and choices</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You can manage cookie preferences through your browser settings or our cookie consent tool.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">13. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our services are not intended for children under 16. We do not knowingly collect 
                  personal data from children under 16. If you believe we have collected such data, 
                  please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">14. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page 
                  with an updated revision date.
                </p>
                <p className="text-gray-700">
                  For significant changes, we will notify you via email or website notification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">15. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about this Privacy Policy or to exercise your rights, contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Data Protection Officer</strong></p>
                  <p className="text-gray-700 mb-2">Email: privacy@peakmode.se</p>
                  <p className="text-gray-700 mb-2">Phone: +46 [PHONE NUMBER]</p>
                  <p className="text-gray-700">Address: [COMPANY ADDRESS]</p>
                </div>
                <p className="text-gray-700 mt-4">
                  You also have the right to lodge a complaint with the Swedish Data Protection Authority 
                  (Datainspektionen) if you believe we have violated your rights.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy; 