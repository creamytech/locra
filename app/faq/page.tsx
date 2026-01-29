import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, Package, RefreshCw, CreditCard, Plane, Mail } from "lucide-react";

export const metadata = {
  title: "FAQ — LOCRA",
  description: "Frequently asked questions about LOCRA orders, shipping, returns, and the Travel Club.",
};

const faqCategories = [
  {
    title: "Orders & Shipping",
    icon: Package,
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping within the US takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. International orders typically take 10-14 business days depending on destination.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location. You can see exact shipping costs at checkout.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with tracking information. You can also track your order by logging into your account and viewing your order history.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Orders can be modified or canceled within 2 hours of placement. After that, our fulfillment process begins and changes may not be possible. Contact us immediately if you need to make changes.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    icon: RefreshCw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery for unworn items in original condition with tags attached. Items must be returned in their original packaging.",
      },
      {
        q: "How do I start a return?",
        a: "To initiate a return, log into your account and select the order you wish to return, or contact our support team at hello@locra.com with your order number.",
      },
      {
        q: "Are returns free?",
        a: "US returns are free - we provide a prepaid shipping label. International returns are the responsibility of the customer.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your return, refunds are processed within 5-7 business days. The refund will appear on your original payment method.",
      },
    ],
  },
  {
    title: "Products & Sizing",
    icon: CreditCard,
    questions: [
      {
        q: "How do your garments fit?",
        a: "Our pieces are designed with a relaxed, travel-friendly fit. Each product page includes detailed measurements and a size guide. When in doubt, we recommend sizing up for a more comfortable fit.",
      },
      {
        q: "What materials do you use?",
        a: "We prioritize natural, breathable fabrics like premium cotton, linen, and silk blends. Each product description includes detailed material information and care instructions.",
      },
      {
        q: "How should I care for my LOCRA pieces?",
        a: "Most items should be hand washed or machine washed cold on a gentle cycle. Air drying is recommended to preserve the integrity of natural fibers. Specific care instructions are on each product's label.",
      },
    ],
  },
  {
    title: "Travel Club & Rewards",
    icon: Plane,
    questions: [
      {
        q: "How does the Travel Club work?",
        a: "The LOCRA Travel Club is our loyalty program. Earn 1 mile for every $1 spent, collect passport stamps from collections, and redeem miles for rewards like store credit and free shipping.",
      },
      {
        q: "How do I join the Travel Club?",
        a: "Membership is automatic and free! Simply create an account or make a purchase, and you'll start earning miles immediately.",
      },
      {
        q: "Do my miles expire?",
        a: "Miles remain active as long as you have account activity (purchase or login) within 12 months. Keep exploring to keep your miles active!",
      },
      {
        q: "What are passport stamps?",
        a: "When you purchase from a specific destination collection (like Santorini or Kyoto), you earn a passport stamp for that destination. Collect stamps to unlock special rewards and achievements.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-narrow text-center">
          <HelpCircle className="w-8 h-8 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Frequently Asked Questions</h1>
          <p className="text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
            Find answers to common questions about orders, shipping, returns, and our Travel Club program.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-spacing">
        <div className="container-wide max-w-4xl">
          <div className="space-y-16">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.title}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, idx) => (
                      <AccordionItem key={idx} value={`${category.title}-${idx}`} className="border-stone-100">
                        <AccordionTrigger className="text-left text-stone-900 hover:text-gold hover:no-underline font-medium">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-stone-500 leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 bg-stone-50 border-t border-stone-100">
        <div className="container-narrow text-center">
          <Mail className="w-8 h-8 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl mb-4">Still Have Questions?</h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <Button asChild className="rounded-none bg-stone-900 hover:bg-gold text-white px-8 h-12">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
