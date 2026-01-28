"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  step: 1 | 2; // step of the registration process
}

export function RegisterBackground({ children, step }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-[#0D2A4E] overflow-hidden flex flex-col items-center py-8">
      {/* App logo */}
      <div className="z-10 mb-8">
        <img src="/brand/kanux-logo.svg" alt="Kánux" className="h-20 w-auto" />
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

      {/* Background SVG */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <svg
          viewBox="0 0 900 600"
          width="100%"
          height="auto"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <rect x="0" y="0" width="900" height="600" fill="#0D2A4E" />
          <path
            d="M0 367L21.5 355.8C43 344.7 86 322.3 128.8 326.5C171.7 330.7 214.3 361.3 257.2 367.8C300 374.3 343 356.7 385.8 358.2C428.7 359.7 471.3 380.3 514.2 377.3C557 374.3 600 347.7 642.8 338.3C685.7 329 728.3 337 771.2 348.8C814 360.7 857 376.3 878.5 384.2L900 392L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#1e4ed8"
          />
          <path
            d="M0 442L21.5 438.2C43 434.3 86 426.7 128.8 418.8C171.7 411 214.3 403 257.2 401.8C300 400.7 343 406.3 385.8 400.2C428.7 394 471.3 376 514.2 368C557 360 600 362 642.8 372.7C685.7 383.3 728.3 402.7 771.2 401.2C814 399.7 857 377.3 878.5 366.2L900 355L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#007ae2"
          />
          <path
            d="M0 433L21.5 434.2C43 435.3 86 437.7 128.8 444.5C171.7 451.3 214.3 462.7 257.2 468.8C300 475 343 476 385.8 470.2C428.7 464.3 471.3 451.7 514.2 447.3C557 443 600 447 642.8 454.5C685.7 462 728.3 473 771.2 467.7C814 462.3 857 440.7 878.5 429.8L900 419L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#009bda"
          />
          <path
            d="M0 483L21.5 489.5C43 496 86 509 128.8 512C171.7 515 214.3 508 257.2 507.2C300 506.3 343 511.7 385.8 509.3C428.7 507 471.3 497 514.2 487.8C557 478.7 600 470.3 642.8 468C685.7 465.7 728.3 469.3 771.2 473.3C814 477.3 857 481.7 878.5 483.8L900 486L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#00b4c4"
          />
          <path
            d="M0 520L21.5 518.8C43 517.7 86 515.3 128.8 522.2C171.7 529 214.3 545 257.2 547.3C300 549.7 343 538.3 385.8 532.8C428.7 527.3 471.3 527.7 514.2 530C557 532.3 600 536.7 642.8 534C685.7 531.3 728.3 521.7 771.2 518.3C814 515 857 518 878.5 519.5L900 521L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#2ec27e"
          />
        </svg>
      </div>
    </div>
  );
}
