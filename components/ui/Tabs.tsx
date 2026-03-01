import React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export const Tabs = ({
  items,
  activeTab,
  onChange
}: {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}) => (
  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
    {items.map((tab) => (
      <button
        key={tab.id}
        aria-label={`Switch to ${tab.label}`}
        onClick={() => onChange(tab.id)}
        className={`rounded-lg px-3 py-1.5 text-sm transition ${activeTab === tab.id ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/10'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
