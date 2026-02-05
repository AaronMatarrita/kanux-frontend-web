"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "./gsap-setup";
import { ensureGsapRegistered } from "./gsap-setup";

type Direction = "up" | "down" | "left" | "right";

export function FadeInOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const el = ref.current;
    if (!el) return;

    const directions: Record<Direction, { y: number; x: number }> = {
      up: { y: 60, x: 0 },
      down: { y: -60, x: 0 },
      left: { y: 0, x: 60 },
      right: { y: 0, x: -60 },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: directions[direction].y,
          x: directions[direction].x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
