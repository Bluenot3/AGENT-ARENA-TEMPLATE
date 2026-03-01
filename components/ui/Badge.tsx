import React from 'react';

export const Badge = ({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    {...props}
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-white/10 text-slate-200 border border-white/10 ${className}`}
  />
);
