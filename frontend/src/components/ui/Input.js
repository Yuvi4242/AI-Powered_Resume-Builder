import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Input = forwardRef(({ 
  label, 
  error, 
  success,
  warning,
  className = '', 
  containerClassName = '', 
  icon: Icon, 
  helperText,
  ...props 
}, ref) => {
  const getStatusColor = () => {
    if (error) return 'border-rose-500 ring-rose-500/20';
    if (success) return 'border-emerald-500 ring-emerald-500/20';
    if (warning) return 'border-amber-500 ring-amber-500/20';
    return 'border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-primary-500/20';
  };

  const getLabelColor = () => {
    if (error) return 'text-rose-600 dark:text-rose-400';
    if (success) return 'text-emerald-600 dark:text-emerald-400';
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`w-full group ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${getLabelColor()}`}>
          {label}
        </label>
      )}
      <div className="relative group-focus-within:transform group-focus-within:-translate-y-0.5 transition-all duration-300">
        <input
          ref={ref}
          className={`
            w-full bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 
            text-sm rounded-xl px-4 py-3 border shadow-sm
            transition-all duration-300 outline-none focus:ring-4
            ${getStatusColor()}
            ${Icon ? 'pl-11' : ''} 
            ${className}
          `}
          {...props}
        />
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-xs font-medium text-rose-500 flex items-center gap-1"
          >
            {error}
          </motion.p>
        ) : helperText ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
