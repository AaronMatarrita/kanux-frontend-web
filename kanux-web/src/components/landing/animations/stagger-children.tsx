"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "./gsap-setup";
import { ensureGsapRegistered } from "./gsap-setup";

export function StaggerChildren({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.children;
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
