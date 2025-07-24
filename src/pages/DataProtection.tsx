import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DataProtection = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Data Protection Information</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  This page provides detailed information about how third-party services process your personal data 
                  when you use PEAK MODE's website and services. We work with trusted partners to provide you 
                  with the best possible experience.
                </p>
                <p className="text-gray-700">
                  All third-party data processing is conducted in accordance with GDPR requirements and 
                  Swedish data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">2. Payment Processors</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Stripe</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Secure payment processing for credit/debit cards
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Payment card information, billing address, transaction details
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by financial regulations
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">PayPal</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Alternative payment processing
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> PayPal account information, transaction details
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by financial regulations
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.paypal.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">paypal.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Klarna</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Buy now, pay later financing options
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Personal information, credit assessment data, transaction details
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU (Sweden)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by financial regulations
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.klarna.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">klarna.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Apple Pay</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Mobile payment processing
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Device information, transaction tokens
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by Apple's policies
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.apple.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">apple.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Google Pay</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Mobile payment processing
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Device information, transaction tokens
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by Google's policies
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Swish</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Mobile payment processing (Sweden)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Phone number, transaction details
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> Sweden
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by Swedish financial regulations
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.getswish.se/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">getswish.se/privacy</a>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">3. Shipping and Logistics</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">PostNord</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Package delivery and tracking
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Name, address, phone number, delivery preferences
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> Sweden/Nordic countries
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by delivery services
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.postnord.se/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">postnord.se/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">DHL</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> International package delivery
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Name, address, phone number, customs information
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/International
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As required by international shipping regulations
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.dhl.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">dhl.com/privacy</a>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">4. Analytics and Marketing</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Google Analytics</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Website analytics and performance monitoring
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> IP address, browsing behavior, device information
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> 26 months (configurable)
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Facebook Pixel</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Advertising and conversion tracking
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Browsing behavior, purchase events, device information
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> As per Facebook's data retention policy
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.facebook.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">facebook.com/privacy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">Mailchimp</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Email marketing and newsletter management
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Data Processed:</strong> Email address, name, marketing preferences, engagement data
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Location:</strong> EU/USA (with appropriate safeguards)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Retention:</strong> Until unsubscribe or account deletion
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://mailchimp.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">mailchimp.com/privacy</a>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">5. Customer Support</h2>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-black mb-3">Zendesk</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Purpose:</strong> Customer support ticket management
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Data Processed:</strong> Contact information, support conversations, order details
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Location:</strong> EU/USA (with appropriate safeguards)
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Retention:</strong> As required for customer service purposes
                  </p>
                  <p className="text-gray-700">
                    <strong>Privacy Policy:</strong> <a href="https://www.zendesk.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">zendesk.com/privacy</a>
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">6. Data Protection Safeguards</h2>
                <p className="text-gray-700 mb-4">
                  We ensure that all third-party data processing is conducted with appropriate safeguards:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Data Processing Agreements:</strong> All third parties have signed DPAs</li>
                  <li><strong>Standard Contractual Clauses:</strong> Used for international transfers</li>
                  <li><strong>Encryption:</strong> Data encrypted in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Limited access to personal data</li>
                  <li><strong>Regular Audits:</strong> Periodic security assessments</li>
                  <li><strong>Compliance Monitoring:</strong> Ongoing GDPR compliance checks</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">7. Your Rights Regarding Third-Party Data</h2>
                <p className="text-gray-700 mb-4">
                  You have the same rights regarding third-party data processing as you do with our direct processing:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Right to access your data held by third parties</li>
                  <li>Right to request correction of inaccurate data</li>
                  <li>Right to request deletion of your data</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights regarding third-party data, contact us first. We will coordinate 
                  with the relevant third party to fulfill your request.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">8. Updates to Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  We regularly review and update our third-party service providers to ensure they meet 
                  our data protection standards. When we add new services or change providers, we will:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Update this page with new information</li>
                  <li>Ensure appropriate data protection agreements are in place</li>
                  <li>Notify you of significant changes via email or website notice</li>
                  <li>Obtain consent where required for new processing activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">9. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about third-party data processing, contact our Data Protection Officer:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Data Protection Officer</strong></p>
                  <p className="text-gray-700 mb-2">Email: privacy@peakmode.se</p>
                  <p className="text-gray-700 mb-2">Phone: +46 [PHONE NUMBER]</p>
                  <p className="text-gray-700">Address: [COMPANY ADDRESS]</p>
                </div>
                <p className="text-gray-700 mt-4">
                  You can also contact third-party services directly using the privacy policy links provided above.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataProtection; 