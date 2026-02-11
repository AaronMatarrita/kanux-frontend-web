"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap-setup";
import { ensureGsapRegistered } from "./gsap-setup";

export function TextReveal({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [children]);

  return (
    <div ref={containerRef} className={className}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="word inline-block mr-[0.25em]">
          {word}
        </span>
      ))}
    </div>
  );
}
