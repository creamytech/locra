import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — LOCRA",
  description: "Learn how LOCRA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-narrow text-center">
          <Shield className="w-8 h-8 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Privacy Policy</h1>
          <p className="text-stone-500 font-light">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="container-wide max-w-3xl">
          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl prose-h3:text-xl prose-p:text-stone-600 prose-li:text-stone-600">
            
            <h2>1. Introduction</h2>
            <p>
              LOCRA ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website locra.com and make purchases from our store.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>When you make a purchase or create an account, we may collect:</p>
            <ul>
              <li>Name and contact information (email address, phone number, shipping address)</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Account credentials</li>
              <li>Order history and preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect:</p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Browsing behavior and interactions with our site</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, products, and promotions</li>
              <li>Manage your Travel Club membership and rewards</li>
              <li>Improve our website and customer experience</li>
              <li>Prevent fraud and maintain security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Companies that help us operate our business (shipping, payment processing, email services)</li>
              <li><strong>Business Partners:</strong> Only with your explicit consent</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction. Payment information is encrypted using 
              SSL technology and processed through PCI-compliant payment processors.
            </p>

            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze site traffic, and 
              personalize content. You can control cookie preferences through your browser settings.
            </p>

            <h2>8. Marketing Communications</h2>
            <p>
              With your consent, we may send you marketing emails about new products, promotions, and Travel Club 
              updates. You can unsubscribe at any time by clicking the unsubscribe link in any email or contacting us.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:privacy@locra.com" className="text-gold hover:underline">privacy@locra.com</a><br />
              Or visit our <a href="/contact" className="text-gold hover:underline">Contact Page</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
