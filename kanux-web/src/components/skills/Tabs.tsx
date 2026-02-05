import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-slate-600 hover:bg-white/70"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
