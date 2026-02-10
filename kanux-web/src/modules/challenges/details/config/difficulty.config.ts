import { Code2, FlaskConical, Layers } from "lucide-react";

export const difficultyConfig: Record<
  string,
  { label: string; className: string; icon: typeof FlaskConical }
> = {
  // Spanish variants
  Básico: {
    label: "Básico",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    icon: FlaskConical,
  },
  Intermedio: {
    label: "Intermedio",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    icon: Code2,
  },
  Avanzado: {
    label: "Avanzado",
    className:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    icon: Layers,
  },
  // English variants
  Basic: {
    label: "Beginner",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    icon: FlaskConical,
  },
  Intermediate: {
    label: "Intermediate",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    icon: Code2,
  },
  Advanced: {
    label: "Advanced",
    className:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    icon: Layers,
  },
  // Legacy variants (lowercase)
  basic: {
    label: "Beginner",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    icon: FlaskConical,
  },
  easy: {
    label: "Beginner",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    icon: FlaskConical,
  },
  intermediate: {
    label: "Intermediate",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    icon: Code2,
  },
  medium: {
    label: "Intermediate",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    icon: Code2,
  },
  advanced: {
    label: "Advanced",
    className:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    icon: Layers,
  },
  hard: {
    label: "Advanced",
    className:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    icon: Layers,
  },
};
