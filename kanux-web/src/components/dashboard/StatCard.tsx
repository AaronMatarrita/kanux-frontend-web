"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="py-5">
        <CardContent className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-5">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>

          {subtitle && <p className="mt-1 text-xs text-red-600">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
