"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeInOnScroll } from "@/components/landing/animations/fade-in-on-scroll";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeInOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            ¿Listo para crecer con Kánux?
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <a href="/onboarding/account-selection">
                Comienza ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
            >
              <a href="/auth/login">Inicia sesión</a>
            </Button>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
