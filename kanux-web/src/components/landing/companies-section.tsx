"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeInOnScroll } from "@/components/landing/animations/fade-in-on-scroll";
import { ScaleOnScroll } from "@/components/landing/animations/scale-on-scroll";
import { gsap } from "@/components/landing/animations/gsap-setup";
import { ensureGsapRegistered } from "@/components/landing/animations/gsap-setup";

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const el = imageRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={imageRef}
      className="relative rounded-3xl overflow-hidden shadow-2xl"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
    </div>
  );
}

export function CompaniesSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScaleOnScroll className="relative order-2 lg:order-1">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
              alt="Equipo de trabajo"
            />
          </ScaleOnScroll>

          <FadeInOnScroll direction="right" className="order-1 lg:order-2">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Contrata basado en habilidades reales
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Evalúa talento usando retos reales, no suposiciones.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Creación de retos",
                  "Análisis de habilidades",
                  "Comparación de talento",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="mt-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
              >
                <a href="/onboarding/register-company">
                  Comienza como Empresa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
