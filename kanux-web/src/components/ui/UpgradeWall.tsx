"use client";
import React from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UpgradeWallProps {
  featureName: string;
  userType: string;
  infoText: string | null;
}

export function UpgradeWall({
  featureName,
  userType,
  infoText,
}: UpgradeWallProps) {
  const displayName = featureName
    .replace(/can_|access_|create_/g, "")
    .replace(/_/g, " ");
  const router = useRouter();
  const title = infoText ? infoText : displayName;

  return (
    <div className="flex flex-col bg-white items-center justify-center min-h-100 w-full p-8 border border-slate-200 rounded-xl shadow-sm">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-emerald-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
        {title} es una funcion Premium
      </h3>

      <p className="text-slate-600 text-center max-w-md mb-8">
        Tu plan actual no incluye acceso a esta funcionalidad. Actualiza para
        desbloquear todas las herramientas profesionales y mejorar tus
        resultados.
      </p>

      <Button
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
        onClick={() => router.push(`/${userType}/billing`)}
      >
        Ver planes y actualizar
      </Button>

      <p className="mt-4 text-xs text-slate-400">Toma menos de 1 minuto</p>
    </div>
  );
}
