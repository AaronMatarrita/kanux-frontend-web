"use client";

import { Card } from "@/components/ui/card";
import { Target, Scale, ClipboardCheck, BarChart3 } from "lucide-react";
import { FadeInOnScroll } from "@/components/landing/animations/fade-in-on-scroll";
import { StaggerChildren } from "@/components/landing/animations/stagger-children";

export function WhatIsSection() {
  const items = [
    {
      icon: Target,
      title: "Las habilidades por encima de los títulos",
      description:
        "Nos centramos en lo que puedes hacer, no en lo que dice tu cargo.",
    },
    {
      icon: Scale,
      title: "Oportunidades justas",
      description:
        "Todos tienen la oportunidad de demostrar sus habilidades mediante la práctica.",
    },
    {
      icon: ClipboardCheck,
      title: "Práctica real",
      description:
        "Completa desafíos reales que demuestren tus habilidades en acción.",
    },
    {
      icon: BarChart3,
      title: "Evaluación transparente",
      description:
        "Comentarios claros y métricas que muestran tus verdaderas habilidades.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInOnScroll className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            ¿Qué es Kánux?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kánux es una plataforma basada en habilidades diseñada para conectar
            a profesionales y empresas a través de retos del mundo real. En
            lugar de currículums, Kánux se centra en lo que las personas pueden
            hacer realmente.
          </p>
        </FadeInOnScroll>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((Item, index) => (
            <Card
              key={index}
              className="group p-6 bg-card hover:bg-muted/50 border border-border hover:border-primary/20 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {Item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {Item.description}
              </p>
            </Card>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
