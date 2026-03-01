import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastCtx = createContext<{ show: (message: string) => void } | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2200);
  };
  const value = useMemo(() => ({ show }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {message && <div className="fixed bottom-4 right-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white shadow-xl">{message}</div>}
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used in ToastProvider');
  return ctx;
};
