import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
  secondary: 'bg-white/10 text-slate-100 hover:bg-white/15 border border-white/15',
  ghost: 'text-slate-300 hover:bg-white/10',
  danger: 'bg-red-500/80 text-white hover:bg-red-500'
};

export const Button = ({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) => (
  <button
    {...props}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/80 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 ${variants[variant]} ${className}`}
  />
);
