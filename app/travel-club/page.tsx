import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TravelClubSignup } from "@/components/portal/TravelClubSignup";
import { Check, ShieldCheck, Zap, Globe } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "The Travel Club — LOCRA Membership",
  description: "Join the Locra Travel Club. Early access to archival drops and exclusive destination stories.",
};

export default function TravelClubPage() {
  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-gold" />,
      title: "First Entry",
      description: "Receive 48-hour early entry into new world capsules before they are archived permanently."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold" />,
      title: "Archival Concierge",
      description: "Dedicated assistance for sizing across global fits and specialized travel care instructions."
    },
    {
      icon: <Globe className="w-5 h-5 text-gold" />,
      title: "Postcards from Field",
      description: "Direct letters from our curators on location, including hidden coordinates and artisanal stories."
    },
    {
      icon: <Check className="w-5 h-5 text-gold" />,
      title: "Complimentary Passage",
      description: "Priority international shipping on all artifacts over $200."
    }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* 1. MEMBERSHIP HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 opacity-40">
           <Image 
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1600"
            alt="Club Interior"
            fill
            className="object-cover"
           />
           <div className="absolute inset-0 bg-stone-900/60" />
        </div>
        
        <div className="container-narrow relative z-10 text-center text-white">
          <Badge variant="gold" className="px-4 py-1 mb-8">
            Established 2026
          </Badge>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 italic">The Travel Club</h1>
          <p className="text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto italic leading-relaxed">
            &ldquo;Beyond commerce, a shared appreciation for the places that move us.&rdquo;
          </p>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY */}
      <section className="py-32 bg-[#F9F8F6]">
        <div className="container-narrow text-center">
           <span className="text-[10px] tracking-[0.4em] font-medium text-stone-400 uppercase mb-8 block">Member Privileges</span>
           <h2 className="font-serif text-3xl md:text-5xl mb-16 italic text-stone-900">Entrance Benefits</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
             {benefits.map((benefit, idx) => (
               <div key={idx} className="space-y-6 flex flex-col items-start p-8 bg-white border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500">
                 <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center">
                   {benefit.icon}
                 </div>
                 <h3 className="font-serif text-2xl italic text-stone-900">{benefit.title}</h3>
                 <p className="text-stone-500 font-light leading-relaxed">
                   {benefit.description}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 3. SIGNUP MODULE (DARK MODE FOCUS) */}
      <section className="pb-32 bg-[#F9F8F6]">
        <div className="container-narrow">
          <div className="bg-stone-900 rounded-3xl p-12 md:p-24 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
             
             <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight italic">Secure Your Presence</h2>
             <p className="text-stone-400 max-w-lg mx-auto mb-16 font-light leading-relaxed">
               Locra is a community for the curious. We do not advertise publicly. Our community grows through those who seek the extraordinary.
             </p>
             
             <div className="max-w-md mx-auto relative z-10">
               <TravelClubSignup />
             </div>
             
             <div className="mt-16 flex justify-center gap-12 text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500">
               <div className="flex flex-col gap-2">
                 <span className="text-gold">01</span>
                 <span>Sign Up</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-gold">02</span>
                 <span>Verification</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-gold">03</span>
                 <span>First Drop</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTNOTE */}
      <section className="py-24 border-t border-stone-100 text-center">
        <div className="container-narrow">
          <p className="text-stone-400 font-serif italic text-sm">
            Membership is complimentary provided you respect the traditions of the Atlas. 
            <br />
            Unsubscribe from the field letters at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
