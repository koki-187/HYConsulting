import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Achievements from "@/components/sections/Achievements";
import Assessment from "@/components/sections/Assessment";
import SuccessStories from "@/components/sections/SuccessStories";
import FAQ from "@/components/sections/FAQ";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground overflow-x-hidden">
      <Header />
      
      <main className="flex-grow">
        {/* Strategic Lead Generation Flow */}
        <Hero />
        {/* Users from HP link arrive at Hero with a specific need */}
        {/* Next step: Assessment to understand their situation */}
        <Assessment />
        {/* After assessment, show services that match their needs */}
        <Services />
        {/* Show customer success stories to build trust */}
        <SuccessStories />
        {/* Build trust and credibility */}
        <Features />
        <Achievements />

        {/* Address remaining questions */}
        <FAQ />

      </main>
      
      <Footer />
    </div>
  );
}
