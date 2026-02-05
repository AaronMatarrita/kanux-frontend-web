"use client";

import { Marquee } from "@/components/landing/marquee";

export function MarqueeSection() {
  const words = [
    "Habilidades",
    "Talento",
    "Crecimiento",
    "Oportunidades",
    "Innovación",
    "Desarrollo",
    "Éxito",
    "Conexión",
  ];

  return (
    <section className="py-12 bg-primary overflow-hidden">
      <Marquee>
        {words.map((word, i) => (
          <span
            key={i}
            className="text-2xl sm:text-3xl font-bold text-white/90 whitespace-nowrap flex items-center gap-6"
          >
            {word}
            <span className="w-2 h-2 rounded-full bg-secondary" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
