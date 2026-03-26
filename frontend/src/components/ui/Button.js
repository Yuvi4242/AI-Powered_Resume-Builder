import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/30 focus:ring-primary-500",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-500"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
