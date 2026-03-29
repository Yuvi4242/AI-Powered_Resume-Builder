import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <FiXCircle className="w-5 h-5 text-rose-500" />,
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-amber-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50',
    error: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/50',
    info: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50',
    warning: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/50'
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md min-w-[320px] max-w-md ${bgColors[toast.type]}`}
            >
              <div className="flex-shrink-0">
                {icons[toast.type]}
              </div>
              <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
