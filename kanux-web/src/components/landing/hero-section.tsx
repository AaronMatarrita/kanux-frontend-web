"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/components/landing/animations/gsap-setup";
import { ensureGsapRegistered } from "@/components/landing/animations/gsap-setup";
import { AnimatedWaves } from "@/components/landing/animated-waves";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-title",
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5 },
      )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          ".hero-description",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          ".hero-buttons",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-primary via-primary to-blue-700"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
          Desarrolla habilidades.
          <br />
          <span className="text-[#22c55e] drop-shadow-[0_2px_8px_rgba(34,197,94,0.5)]">
            Descubre el talento.
          </span>
        </h1>

        <p className="hero-subtitle mt-6 text-lg sm:text-xl md:text-2xl text-white/80 font-medium">
          Te ayudamos a crecer.
        </p>

        <p className="hero-description mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Kánux conecta a profesionales y empresas a través de retos reales y
          habilidades verificadas.
        </p>

        <div className="hero-buttons mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25"
          >
            <a href="/onboarding/account-selection">
              Comienza ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
          >
            Más información
          </Button>
        </div>
      </div>

      <AnimatedWaves />
    </section>
  );
}
