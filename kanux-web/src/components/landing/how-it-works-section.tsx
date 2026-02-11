"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { FadeInOnScroll } from "@/components/landing/animations/fade-in-on-scroll";

function StepsCard({
  title,
  color = "primary",
  steps,
}: {
  title: string;
  color?: "primary" | "secondary";
  steps: string[];
}) {
  const badgeBase =
    color === "primary"
      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
      : "bg-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground";

  return (
    <Card className="p-8 bg-card border border-border rounded-2xl h-full">
      <h3 className="text-xl font-bold text-foreground mb-6">{title}</h3>
      <div className="space-y-5">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4 group">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm transition-all duration-300 ${badgeBase}`}
            >
              {index + 1}
            </div>
            <p className="text-muted-foreground pt-1">{step}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInOnScroll className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Cómo funciona
          </h2>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeInOnScroll direction="left">
            <StepsCard
              title="Para Profesionales"
              color="primary"
              steps={[
                "Crea un perfil basado en habilidades.",
                "Completa desafíos prácticos",
                "Recibe comentarios y verificación de habilidades",
                "Sé descubierto por empresas",
              ]}
            />
          </FadeInOnScroll>

          <FadeInOnScroll direction="right">
            <StepsCard
              title="Para Empresas"
              color="secondary"
              steps={[
                "Crea desafíos del mundo real",
                "Evalúa el rendimiento real",
                "Analiza los datos de habilidades",
                "Conecta directamente con candidatos calificados",
              ]}
            />
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
