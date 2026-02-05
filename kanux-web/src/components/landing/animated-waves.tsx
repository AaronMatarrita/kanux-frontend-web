"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/components/landing/animations/gsap-setup";
import { ensureGsapRegistered } from "@/components/landing/animations/gsap-setup";

export function AnimatedWaves() {
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const wave1Ref = useRef<SVGPathElement>(null);
  const wave2Ref = useRef<SVGPathElement>(null);
  const wave3Ref = useRef<SVGPathElement>(null);
  const wave4Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.to(wave1Ref.current, {
        attr: {
          d: "M0,192L60,197.3C120,203,240,213,360,213.3C480,213,600,203,720,186.7C840,171,960,149,1080,154.7C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
        },
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(wave2Ref.current, {
        attr: {
          d: "M0,224L60,234.7C120,245,240,267,360,261.3C480,256,600,224,720,218.7C840,213,960,235,1080,240C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
        },
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(wave3Ref.current, {
        attr: {
          d: "M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,261.3C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
        },
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(wave4Ref.current, {
        attr: {
          d: "M0,288L60,282.7C120,277,240,267,360,261.3C480,256,600,256,720,261.3C840,267,960,277,1080,272C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
        },
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, waveContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={waveContainerRef}
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none overflow-hidden"
      style={{ height: "65%", minHeight: "350px" }}
    >
      <svg
        viewBox="0 0 1440 320"
        className="absolute bottom-0 left-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={wave1Ref}
          d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,181.3C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="#1e3a8a"
          fillOpacity="0.8"
        />
        <path
          ref={wave2Ref}
          d="M0,224L60,218.7C120,213,240,203,360,208C480,213,600,235,720,240C840,245,960,235,1080,224C1200,213,1320,203,1380,197.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="#2563eb"
          fillOpacity="0.7"
        />
        <path
          ref={wave3Ref}
          d="M0,256L60,250.7C120,245,240,235,360,240C480,245,600,267,720,266.7C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="#3b82f6"
          fillOpacity="0.6"
        />
        <path
          ref={wave4Ref}
          d="M0,288L60,277.3C120,267,240,245,360,245.3C480,245,600,267,720,272C840,277,960,267,1080,256C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
