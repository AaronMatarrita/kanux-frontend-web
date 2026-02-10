"use client";
import { useState } from "react";

export function Tabs({
  tabs,
  defaultTab = 0,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  defaultTab?: number;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      {/* tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-2 font-medium text-sm rounded-lg transition-all ${
              activeTab === index
                ? "bg-emerald-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab]?.content}</div>
    </div>
  );
}
