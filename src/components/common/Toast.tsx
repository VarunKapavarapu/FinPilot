import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const Toast: React.FC = () => {
  const { notification, setNotification } = useFinance();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111722] border border-[#00F59B]/30 shadow-xl shadow-black/60 text-slate-100">
        <div className="p-1 rounded-md bg-[#00F59B]/15 text-[#00F59B]">
          <CheckCircle className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium">{notification}</p>
        <button
          onClick={() => setNotification(null)}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
