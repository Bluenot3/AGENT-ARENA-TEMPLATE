import React from 'react';

export const Modal = ({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1020]/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button aria-label="Close modal" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
