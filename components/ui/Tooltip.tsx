import React from 'react';

export const Tooltip = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <span className="group relative inline-flex">
    {children}
    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
      {label}
    </span>
  </span>
);
