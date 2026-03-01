import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-white/10 ${className}`} />
);
