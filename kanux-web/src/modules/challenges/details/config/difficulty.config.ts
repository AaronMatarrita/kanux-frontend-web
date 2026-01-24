import { Code2, FlaskConical, Layers } from "lucide-react";

export const difficultyConfig: Record<
  string,
  { label: string; className: string; icon: typeof FlaskConical }
> = {
  // Spanish variants
  Básico: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  Intermedio: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  Avanzado: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
  // English variants
  Basic: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  Intermediate: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  Advanced: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
  // Legacy variants (lowercase)
  basic: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  easy: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  medium: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  advanced: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
  hard: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
};
