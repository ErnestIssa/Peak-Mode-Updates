import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                  when you visit our website. They help us provide you with a better experience by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Remembering your preferences and settings</li>
                  <li>Analyzing how you use our website</li>
                  <li>Providing personalized content and advertisements</li>
                  <li>Ensuring the website functions properly</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  PEAK MODE uses cookies for the following purposes:
                </p>
                
                <h3 className="text-lg font-semibold text-black mb-3">2.1 Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the website to function properly and cannot be disabled:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Session management and security</li>
                  <li>Shopping cart functionality</li>
                  <li>User authentication</li>
                  <li>Payment processing</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">2.2 Analytics Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors use our website:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Page views and navigation patterns</li>
                  <li>Popular products and features</li>
                  <li>Website performance and errors</li>
                  <li>User behavior analysis</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">2.3 Marketing Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are used for advertising and marketing purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Personalized advertisements</li>
                  <li>Social media integration</li>
                  <li>Retargeting campaigns</li>
                  <li>Conversion tracking</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">2.4 Preference Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies remember your choices and preferences:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Language and currency preferences</li>
                  <li>Size and color preferences</li>
                  <li>Cookie consent settings</li>
                  <li>Website customization options</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">3.1 Session Cookies</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Temporary cookies that expire when you close your browser
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Examples:</strong> Shopping cart items, login sessions, form data
                    </p>
                    <p className="text-gray-700">
                      <strong>Duration:</strong> Browser session only
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">3.2 Persistent Cookies</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Cookies that remain on your device for a set period
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Examples:</strong> User preferences, analytics data, marketing preferences
                    </p>
                    <p className="text-gray-700">
                      <strong>Duration:</strong> 30 days to 2 years (depending on purpose)
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-3">3.3 Third-Party Cookies</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>Purpose:</strong> Cookies set by external services we use
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Examples:</strong> Google Analytics, Facebook Pixel, payment processors
                    </p>
                    <p className="text-gray-700">
                      <strong>Duration:</strong> Varies by service provider
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">4. Specific Cookies We Use</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-3 text-left font-semibold">Cookie Name</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Purpose</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Duration</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-3">session_id</td>
                        <td className="border border-gray-200 p-3">Maintains user session</td>
                        <td className="border border-gray-200 p-3">Session</td>
                        <td className="border border-gray-200 p-3">Essential</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">cart_items</td>
                        <td className="border border-gray-200 p-3">Stores shopping cart contents</td>
                        <td className="border border-gray-200 p-3">Session</td>
                        <td className="border border-gray-200 p-3">Essential</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">user_preferences</td>
                        <td className="border border-gray-200 p-3">Stores user preferences</td>
                        <td className="border border-gray-200 p-3">1 year</td>
                        <td className="border border-gray-200 p-3">Preference</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">_ga</td>
                        <td className="border border-gray-200 p-3">Google Analytics tracking</td>
                        <td className="border border-gray-200 p-3">2 years</td>
                        <td className="border border-gray-200 p-3">Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">_fbp</td>
                        <td className="border border-gray-200 p-3">Facebook Pixel tracking</td>
                        <td className="border border-gray-200 p-3">3 months</td>
                        <td className="border border-gray-200 p-3">Marketing</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">cookie_consent</td>
                        <td className="border border-gray-200 p-3">Remembers cookie preferences</td>
                        <td className="border border-gray-200 p-3">1 year</td>
                        <td className="border border-gray-200 p-3">Preference</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">5. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use the following third-party services that may set cookies:
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-black mb-2">Google Analytics</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Purpose:</strong> Website analytics and performance monitoring
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Data Collected:</strong> Page views, user behavior, device information
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-black mb-2">Facebook Pixel</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Purpose:</strong> Advertising and conversion tracking
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Data Collected:</strong> Purchase events, browsing behavior
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://www.facebook.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">facebook.com/privacy</a>
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-black mb-2">Stripe</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Purpose:</strong> Payment processing and fraud prevention
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Data Collected:</strong> Payment information, device fingerprinting
                    </p>
                    <p className="text-gray-700">
                      <strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">6. Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 mb-4">
                  You have several options for managing cookies:
                </p>
                
                <h3 className="text-lg font-semibold text-black mb-3">6.1 Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">6.2 Cookie Consent Tool</h3>
                <p className="text-gray-700 mb-4">
                  Use our cookie consent tool to manage your preferences:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Accept or reject specific cookie categories</li>
                  <li>Change preferences at any time</li>
                  <li>View detailed information about each cookie</li>
                </ul>

                <h3 className="text-lg font-semibold text-black mb-3">6.3 Third-Party Opt-Outs</h3>
                <p className="text-gray-700">
                  You can opt out of third-party tracking:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                  <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
                  <li><strong>Digital Advertising Alliance:</strong> <a href="http://optout.aboutads.info/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">DAA Opt-out</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  If you disable cookies, some website features may not work properly:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Shopping cart functionality may be limited</li>
                  <li>User preferences and settings may not be saved</li>
                  <li>Some payment processing features may not work</li>
                  <li>Website performance may be affected</li>
                  <li>Personalized content may not be available</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">8. Cookie Consent</h2>
                <p className="text-gray-700 mb-4">
                  We obtain your consent for non-essential cookies through our cookie banner. 
                  You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your preferences</li>
                  <li>Change your settings at any time</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Essential cookies are always active as they are necessary for the website to function.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">9. Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Changes in our cookie usage</li>
                  <li>New third-party services</li>
                  <li>Legal requirements</li>
                  <li>Technology updates</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We will notify you of significant changes via email or website notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">10. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about our use of cookies, contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Data Protection Officer</strong></p>
                  <p className="text-gray-700 mb-2">Email: privacy@peakmode.se</p>
                  <p className="text-gray-700 mb-2">Phone: +46 [PHONE NUMBER]</p>
                  <p className="text-gray-700">Address: [COMPANY ADDRESS]</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy; 