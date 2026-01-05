import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Achievements from "@/components/sections/Achievements";
import Assessment from "@/components/sections/Assessment";

import FAQ from "@/components/sections/FAQ";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground overflow-x-hidden">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Services />
        <Assessment />
        <Features />
        <Achievements />
        <Testimonials />
        <FAQ />

      </main>
      
      <Footer />
    </div>
  );
}
