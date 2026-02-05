"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  "Acerca de",
  "Profesional",
  "Empresarial",
  "Precios",
] as const;

function Logo({ isScrolled }: { isScrolled: boolean }) {
  const logoSrc = isScrolled
    ? "/brand/kanux-logo-sidebar.svg"
    : "/brand/kanux-logo-variant-white.svg";

  return (
    <div className="flex items-center group cursor-pointer">
      <img
        src={logoSrc}
        alt="Kánux"
        className={`h-9 w-auto transition-all duration-300 group-hover:scale-105 ${
          isScrolled ? "text-foreground" : "text-white"
        }`}
      />
    </div>
  );
}

function DesktopNav({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
            isScrolled
              ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function DesktopCTA({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <a
        href="/auth/login"
        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
          isScrolled
            ? "text-muted-foreground hover:text-foreground"
            : "text-white/80 hover:text-white"
        }`}
      >
        Inicia sesión
      </a>
      <Button
        asChild
        className={`rounded-xl px-5 font-medium transition-all duration-300 hover:scale-105 ${
          isScrolled
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "bg-white text-primary hover:bg-white/90"
        }`}
      >
        <a href="/onboarding/account-selection">
          Prueba Gratis
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

function MobileMenu({
  open,
  isScrolled,
  onToggle,
}: {
  open: boolean;
  isScrolled: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button
        onClick={onToggle}
        className={`md:hidden p-2 rounded-xl transition-colors ${
          isScrolled ? "text-foreground" : "text-white"
        }`}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-80 mt-4 pt-4 border-t border-border/30" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className="px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 rounded-xl transition-colors"
            >
              {item}
            </button>
          ))}
          <a
            href="/auth/login"
            className="px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 rounded-xl transition-colors"
          >
            Inicia sesión
          </a>
          <Button
            asChild
            className="mt-2 rounded-xl bg-primary hover:bg-primary/90"
          >
            <a href="/onboarding/account-selection">
              Prueba Gratis
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}

export function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "top-2" : "top-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative px-4 sm:px-6 py-3 rounded-2xl border transition-all duration-500 ${
            isScrolled
              ? "bg-background/70 backdrop-blur-2xl border-border/50 shadow-lg shadow-black/5"
              : "bg-white/10 backdrop-blur-xl border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo isScrolled={isScrolled} />
            <DesktopNav isScrolled={isScrolled} />
            <DesktopCTA isScrolled={isScrolled} />
            <MobileMenu
              open={isMobileMenuOpen}
              isScrolled={isScrolled}
              onToggle={() => setIsMobileMenuOpen((v) => !v)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
