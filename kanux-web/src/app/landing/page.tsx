"use client";

import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

import { GlassNavbar } from "@/components/landing/glass-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { WhatIsSection } from "@/components/landing/what-is-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { ProfessionalsSection } from "@/components/landing/professionals-section";
import { CompaniesSection } from "@/components/landing/companies-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <GlassNavbar />
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <MarqueeSection />
      <ProfessionalsSection />
      <CompaniesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
