import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, RefreshCw, Clock, Globe, Package, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns — LOCRA",
  description: "Free shipping on orders over $150. Easy 30-day returns. Learn about our shipping policies and return process.",
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-narrow text-center">
          <Truck className="w-8 h-8 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Shipping & Returns</h1>
          <p className="text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
            We believe in thoughtful journeys — for you and your pieces. 
            Here's everything you need to know about getting your pieces delivered.
          </p>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="section-spacing">
        <div className="container-wide max-w-4xl">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-stone-50 rounded-lg p-6 text-center">
              <Package className="w-6 h-6 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-xl mb-2">Free Shipping</h3>
              <p className="text-stone-500 text-sm">On US orders over $150</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-6 text-center">
              <RefreshCw className="w-6 h-6 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-xl mb-2">Easy Returns</h3>
              <p className="text-stone-500 text-sm">30-day return window</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-6 text-center">
              <Globe className="w-6 h-6 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-xl mb-2">Global Delivery</h3>
              <p className="text-stone-500 text-sm">Shipping worldwide</p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-2xl">Shipping Options</h2>
              </div>
              
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Method</th>
                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Delivery Time</th>
                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="px-6 py-4 text-stone-900 font-medium">Standard (US)</td>
                      <td className="px-6 py-4 text-stone-500">5-7 business days</td>
                      <td className="px-6 py-4 text-stone-500">Free over $150 / $8.95</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-900 font-medium">Express (US)</td>
                      <td className="px-6 py-4 text-stone-500">2-3 business days</td>
                      <td className="px-6 py-4 text-stone-500">$14.95</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-900 font-medium">International Standard</td>
                      <td className="px-6 py-4 text-stone-500">10-14 business days</td>
                      <td className="px-6 py-4 text-stone-500">Calculated at checkout</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-900 font-medium">International Express</td>
                      <td className="px-6 py-4 text-stone-500">5-7 business days</td>
                      <td className="px-6 py-4 text-stone-500">Calculated at checkout</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-stone-500 text-sm mt-4">
                * Delivery times are estimates and may vary during peak seasons or due to customs processing for international orders.
              </p>
            </div>

            {/* Returns Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-2xl">Returns & Exchanges</h2>
              </div>
              
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-relaxed mb-6">
                  We want you to love your LOCRA pieces. If something doesn't feel right, 
                  returns are easy within 30 days of delivery.
                </p>
                
                <h3 className="font-serif text-xl mb-4">Return Eligibility</h3>
                <ul className="list-none space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-gold mt-1">✓</span>
                    Items must be unworn, unwashed, and in original condition
                  </li>
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-gold mt-1">✓</span>
                    All original tags must still be attached
                  </li>
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-gold mt-1">✓</span>
                    Items must be returned in original packaging
                  </li>
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-gold mt-1">✓</span>
                    Return initiated within 30 days of delivery
                  </li>
                </ul>

                <h3 className="font-serif text-xl mb-4">Non-Returnable Items</h3>
                <ul className="list-none space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-stone-400 mt-1">×</span>
                    Items marked as "Final Sale"
                  </li>
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-stone-400 mt-1">×</span>
                    Gift cards
                  </li>
                  <li className="flex items-start gap-3 text-stone-600">
                    <span className="text-stone-400 mt-1">×</span>
                    Personalized or monogrammed items
                  </li>
                </ul>

                <h3 className="font-serif text-xl mb-4">How to Return</h3>
                <ol className="list-decimal list-inside space-y-3 text-stone-600 mb-8">
                  <li>Log into your account or contact us at hello@locra.com</li>
                  <li>Select the items you wish to return</li>
                  <li>Print your prepaid return label (US orders)</li>
                  <li>Pack items securely in original packaging</li>
                  <li>Drop off at any carrier location</li>
                </ol>
              </div>
            </div>

            {/* Processing Times */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-2xl">Processing Times</h2>
              </div>
              
              <div className="bg-stone-50 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-stone-900 mb-2">Order Processing</h3>
                    <p className="text-stone-500">
                      Orders are processed within 1-2 business days. You'll receive a shipping confirmation email once your order is on its way.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 mb-2">Return Processing</h3>
                    <p className="text-stone-500">
                      Once received, returns are processed within 5-7 business days. Refunds will be issued to your original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-stone-50 border-t border-stone-100">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl mb-4">Have More Questions?</h2>
          <p className="text-stone-500 mb-8">
            Check our FAQ or reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="rounded-none border-stone-300 px-8 h-12">
              <Link href="/faq">View FAQ</Link>
            </Button>
            <Button asChild className="rounded-none bg-stone-900 hover:bg-gold text-white px-8 h-12">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
