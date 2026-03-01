import React from 'react';

export const Card = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] ${className}`}
  />
);
