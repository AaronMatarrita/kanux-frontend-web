"use client";

import CrossIcon from "./CrossIcon";
import CheckIcon from "./CheckIcon";


export default function FeatureItem({ label, hasAccess }: {
  label: string;
  hasAccess:boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      {hasAccess ? <CheckIcon /> : <CrossIcon />}
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
