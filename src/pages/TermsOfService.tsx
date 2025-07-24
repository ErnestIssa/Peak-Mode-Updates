import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to PEAK MODE. These Terms of Service ("Terms") govern your use of our website and services. 
                  By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700">
                  PEAK MODE is a Swedish online fitness apparel store operated by PEAK MODE AB, 
                  registered in Sweden with organization number [ORG NUMBER], located at [ADDRESS].
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>"Service"</strong> refers to the PEAK MODE website and online store</li>
                  <li><strong>"User"</strong> refers to any individual accessing or using our Service</li>
                  <li><strong>"Products"</strong> refers to fitness apparel and related items sold through our Service</li>
                  <li><strong>"Order"</strong> refers to a purchase request submitted through our Service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">3. Account Registration</h2>
                <p className="text-gray-700 mb-4">
                  To place orders, you may be required to create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Providing accurate and complete information</li>
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                </ul>
                <p className="text-gray-700">
                  You must be at least 18 years old to create an account and place orders.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">4. Product Information</h2>
                <p className="text-gray-700 mb-4">
                  We strive to provide accurate product information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Product descriptions and specifications</li>
                  <li>Pricing information</li>
                  <li>Availability status</li>
                  <li>Size charts and fit information</li>
                </ul>
                <p className="text-gray-700">
                  However, we cannot guarantee that all information is completely accurate or up-to-date. 
                  Product images are for illustrative purposes and may vary from actual products.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">5. Orders and Payment</h2>
                <p className="text-gray-700 mb-4">
                  By placing an order, you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Confirm that all information provided is accurate</li>
                  <li>Agree to pay the specified price including applicable taxes</li>
                  <li>Authorize us to process your payment</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  We accept payment through secure payment processors. All transactions are encrypted 
                  and processed in accordance with Swedish payment regulations.
                </p>
                <p className="text-gray-700">
                  Orders are subject to availability. We reserve the right to cancel orders if products 
                  become unavailable or if we detect fraudulent activity.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">6. Shipping and Delivery</h2>
                <p className="text-gray-700 mb-4">
                  We ship to Sweden, Norway, Denmark, and Finland. Delivery times vary by location:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Standard shipping: 3-5 business days</li>
                  <li>Express shipping: 1-2 business days</li>
                  <li>Free shipping on orders over 500 SEK</li>
                </ul>
                <p className="text-gray-700">
                  Risk of loss and title for products pass to you upon delivery. 
                  You are responsible for inspecting products upon receipt.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">7. Returns and Refunds</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to return products within 14 days of receipt under Swedish consumer law:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Products must be unused and in original packaging</li>
                  <li>Return shipping costs are your responsibility</li>
                  <li>Refunds will be processed within 14 days of receiving returned items</li>
                  <li>Defective products will be replaced or refunded at no cost</li>
                </ul>
                <p className="text-gray-700">
                  To initiate a return, contact our customer service team.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">8. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on our website, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Text, graphics, logos, and images</li>
                  <li>Product designs and descriptions</li>
                  <li>Website layout and functionality</li>
                </ul>
                <p className="text-gray-700">
                  Is owned by PEAK MODE AB and protected by Swedish and international copyright laws. 
                  Unauthorized use is strictly prohibited.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">9. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. We collect and process personal data in accordance with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Swedish Data Protection Act (Dataskyddslagen)</li>
                  <li>General Data Protection Regulation (GDPR)</li>
                  <li>Our Privacy Policy</li>
                </ul>
                <p className="text-gray-700">
                  For detailed information about how we handle your data, please see our Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  PEAK MODE AB's liability is limited to the extent permitted by Swedish law:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>We are not liable for indirect or consequential damages</li>
                  <li>Our total liability shall not exceed the amount you paid for the relevant products</li>
                  <li>We are not liable for damages caused by force majeure events</li>
                </ul>
                <p className="text-gray-700">
                  This limitation does not affect your statutory rights as a consumer.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">11. Governing Law and Disputes</h2>
                <p className="text-gray-700 mb-4">
                  These Terms are governed by Swedish law. Any disputes shall be resolved in Swedish courts.
                </p>
                <p className="text-gray-700 mb-4">
                  As a consumer, you have the right to file complaints with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Swedish Consumer Agency (Konsumentverket)</li>
                  <li>European Consumer Centre Sweden</li>
                  <li>Alternative Dispute Resolution (ADR) bodies</li>
                </ul>
                <p className="text-gray-700">
                  We are committed to resolving disputes amicably and in accordance with consumer protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">12. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                  upon posting on our website.
                </p>
                <p className="text-gray-700">
                  Continued use of our Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">13. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>PEAK MODE AB</strong></p>
                  <p className="text-gray-700 mb-2">Email: legal@peakmode.se</p>
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

export default TermsOfService; 