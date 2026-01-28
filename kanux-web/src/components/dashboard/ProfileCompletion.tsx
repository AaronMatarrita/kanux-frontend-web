"use client";

import React from "react";

interface ProfileCompletionProps {
  completionPercentage: number;
  message: string;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercentage,
  message,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Completa tu perfil
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-slate-700">
              Nivel de progreso
            </p>
            <p className="text-sm font-semibold text-blue-600">
              {completionPercentage}%
            </p>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};
