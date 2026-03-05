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
    <div className="hidden md:block fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1300] animate-slideDown px-4 md:px-0 w-full md:w-auto">
      <div className={`bg-gradient-to-r ${bgColors[type]} text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-2 md:gap-4 md:min-w-[320px] max-w-[calc(100vw-2rem)] md:max-w-none border-2 border-white/20`}>
        <div className="bg-white/20 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg md:text-2xl font-bold shrink-0">
          {icons[type]}
        </div>
        <p className="font-semibold text-sm md:text-lg flex-1 line-clamp-2">{message}</p>
        <button 
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-colors shrink-0 text-sm md:text-base"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
