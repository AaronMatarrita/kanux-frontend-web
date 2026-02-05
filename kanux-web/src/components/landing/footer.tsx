"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeInOnScroll } from "@/components/landing/animations/fade-in-on-scroll";

export function Footer() {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FadeInOnScroll>
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                  K
                </div>
                <span className="font-semibold text-lg text-foreground">
                  Kánux
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Conectamos profesionales y empresas a través de retos reales y
                habilidades verificadas
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Enlaces</h4>
              <div className="space-y-3">
                {["Acerca de", "Términos", "Privacidad"].map((link) => (
                  <button
                    key={link}
                    className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Pruébalo hoy
              </h4>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <a href="/onboarding/account-selection">
                  Comienza hoy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>

        <FadeInOnScroll delay={0.3}>
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 Kánux. Todos los derechos reservados.
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </footer>
  );
}
