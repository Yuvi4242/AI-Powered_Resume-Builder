import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/25 focus:ring-primary-500",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700/80 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60 focus:ring-gray-500",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white focus:ring-red-500"
  };

  const spinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <motion.button 
      whileHover={!disabled && !loading ? { scale: 1.02, translateY: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && spinner}
      {children}
    </motion.button>
  );
};
