"use client";

import React from "react";

interface GenericHeaderProps {
  title: string;
  description: string;
  rightContent?: React.ReactNode;
}

export function GenericHeader({
  title,
  description,
  rightContent,
}: GenericHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      </div>

      {rightContent && (
        <div className="flex items-center gap-3">{rightContent}</div>
      )}
    </div>
  );
}
