'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-600/20 border-green-600 text-green-400'
    : 'bg-red-600/20 border-red-600 text-red-400';

  return (
    <div className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 p-4 rounded-lg border ${bgColor} animate-slideIn z-50`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">
          {type === 'success' ? '✓' : '✕'}
        </div>
        <p className="font-semibold">{message}</p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}