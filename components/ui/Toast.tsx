"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-rose-500",
    info: "from-blue-500 to-cyan-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slideDown">
      <div className={`bg-gradient-to-r ${bgColors[type]} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] border-2 border-white/20`}>
        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">
          {icons[type]}
        </div>
        <p className="font-semibold text-lg flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
