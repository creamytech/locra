"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState('success');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-narrow text-center">
          <Badge variant="outline" className="border-gold text-gold px-4 py-1 mb-6">
            Get In Touch
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">Contact Us</h1>
          <p className="text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
            Questions about your order, our collections, or joining the Travel Club? 
            We're here to help guide your journey.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl mb-8">Send a Message</h2>
              
              {formState === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-xl text-emerald-900 mb-2">Message Sent</h3>
                  <p className="text-emerald-700">
                    Thank you for reaching out. We'll respond within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                        Your Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 border-stone-200 focus:border-gold focus:ring-gold"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12 border-stone-200 focus:border-gold focus:ring-gold"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="h-12 border-stone-200 focus:border-gold focus:ring-gold"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full border border-stone-200 rounded-md px-4 py-3 text-stone-900 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={formState === 'submitting'}
                    className="w-full h-14 bg-stone-900 hover:bg-gold text-white rounded-none transition-all duration-300"
                  >
                    {formState === 'submitting' ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-serif text-2xl mb-8">Other Ways to Reach Us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">Email</h3>
                      <a href="mailto:hello@locra.com" className="text-stone-500 hover:text-gold transition-colors">
                        hello@locra.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">Headquarters</h3>
                      <p className="text-stone-500">
                        Los Angeles, California<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-stone-100 pt-12">
                <h3 className="font-serif text-xl mb-4">Response Times</h3>
                <p className="text-stone-500 font-light leading-relaxed">
                  We aim to respond to all inquiries within 24-48 hours during business days. 
                  For urgent order issues, please include your order number in the subject line.
                </p>
              </div>
              
              <div className="bg-stone-50 rounded-lg p-6">
                <h3 className="font-serif text-lg mb-3">Frequently Asked Questions</h3>
                <p className="text-stone-500 text-sm mb-4">
                  Many common questions are answered in our FAQ section.
                </p>
                <Button asChild variant="outline" size="sm" className="rounded-none border-stone-200">
                  <a href="/faq">View FAQ</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
