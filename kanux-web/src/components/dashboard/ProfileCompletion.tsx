"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileCompletionProps {
  completionPercentage: number;
  message: string;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercentage,
  message,
}) => {
  return (
    <Card className="py-5">
      <CardContent className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Completa tu perfil
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-slate-700">
                Nivel de progreso
              </p>
              <p className="text-sm font-semibold text-sky-600">
                {completionPercentage}%
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-linear-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};
