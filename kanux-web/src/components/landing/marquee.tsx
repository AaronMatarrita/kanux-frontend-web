"use client";

import React from "react";

export function Marquee({
  children,
  reverse = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="flex overflow-hidden mask-[linear-linear(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex gap-6 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } [--duration:30s]`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
