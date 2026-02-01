'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-600">{title}</p>

          <p className="text-3xl font-bold text-slate-900">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-red-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  );
};
