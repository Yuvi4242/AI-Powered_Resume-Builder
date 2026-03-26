import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', containerClassName = '', icon: Icon, ...props }, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'} rounded-lg px-4 py-2.5 transition-all duration-200 outline-none focus:ring-2 shadow-sm ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
