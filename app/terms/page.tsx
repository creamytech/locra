import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — LOCRA",
  description: "Terms and conditions for using the LOCRA website and purchasing from our store.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-narrow text-center">
          <FileText className="w-8 h-8 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Terms of Service</h1>
          <p className="text-stone-500 font-light">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="container-wide max-w-3xl">
          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl prose-h3:text-xl prose-p:text-stone-600 prose-li:text-stone-600">
            
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the LOCRA website (locra.com), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our website or services.
            </p>

            <h2>2. Use of Our Website</h2>
            <p>You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Use automated systems to access the website without permission</li>
              <li>Collect or harvest any information from the website without consent</li>
            </ul>

            <h2>3. Account Registration</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account.
            </p>

            <h2>4. Products and Pricing</h2>
            <p>
              We strive to display accurate product information and pricing. However, we reserve the right to 
              correct any errors and to change or update information at any time without prior notice. 
              If a product is listed at an incorrect price, we reserve the right to cancel orders placed at that price.
            </p>

            <h2>5. Orders and Payment</h2>
            <ul>
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel any order for any reason</li>
              <li>Payment must be received before orders are processed</li>
              <li>Prices are in USD unless otherwise stated</li>
            </ul>

            <h2>6. Shipping and Delivery</h2>
            <p>
              Delivery times are estimates only. We are not responsible for delays caused by shipping carriers, 
              customs, or events beyond our control. Risk of loss passes to you upon delivery to the carrier.
            </p>

            <h2>7. Returns and Refunds</h2>
            <p>
              Please refer to our <a href="/shipping" className="text-gold hover:underline">Shipping & Returns</a> page 
              for our complete return policy. All returns must comply with our stated return conditions.
            </p>

            <h2>8. Travel Club Program</h2>
            <p>
              The LOCRA Travel Club is a loyalty program with the following terms:
            </p>
            <ul>
              <li>Miles earned have no cash value and cannot be transferred</li>
              <li>We reserve the right to modify or terminate the program at any time</li>
              <li>Fraudulent activity may result in account termination and forfeiture of miles</li>
              <li>Miles may expire after 12 months of account inactivity</li>
            </ul>

            <h2>9. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property 
              of LOCRA or its content suppliers and is protected by copyright and other intellectual property laws. 
              You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, LOCRA shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of our website or products. 
              Our total liability shall not exceed the amount you paid for the product in question.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless LOCRA and its officers, directors, employees, and agents 
              from any claims, damages, or expenses arising from your use of the website or violation of these Terms.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law provisions.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting to the website. Your continued use of the website after changes are posted constitutes 
              acceptance of the modified Terms.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:legal@locra.com" className="text-gold hover:underline">legal@locra.com</a><br />
              Or visit our <a href="/contact" className="text-gold hover:underline">Contact Page</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
