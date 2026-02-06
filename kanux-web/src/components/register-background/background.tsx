"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedWaves } from "@/components/landing/animated-waves";

interface Props {
  children: React.ReactNode;
  step: 1 | 2; // step of the registration process
}

export function RegisterBackground({ children, step }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-[#0D2A4E] overflow-hidden flex flex-col items-center py-8">
      {/* App logo */}
      <div className="z-10 mb-8">
        <img
          src="/brand/kanux-logo-variant-white.svg"
          alt="Kánux"
          className="h-20 w-auto"
        />
      </div>

      {/* steps views */}
      <div className="z-10 flex items-center gap-4 mb-10 text-white/90 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full border ${step === 1 ? "bg-[#2B8CE6] border-[#2B8CE6]" : "border-slate-500 text-slate-400"}`}
          >
            1
          </span>
          <span className={step === 1 ? "text-white" : "text-slate-400"}>
            Create account
          </span>
        </div>

        <div className="w-12 h-1px bg-slate-600" />

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full border ${step === 2 ? "bg-[#2B8CE6] border-[#2B8CE6]" : "border-slate-500 text-slate-400"}`}
          >
            2
          </span>
          <span className={step === 2 ? "text-white" : "text-slate-400"}>
            Complete profile
          </span>
        </div>
      </div>
      {/* set forms */}
      <div className="z-10 w-full max-w-137.5 bg-white rounded-[40px] shadow-2xl p-10 mx-4">
        {children}
      </div>

      <AnimatedWaves />
    </div>
  );
}
