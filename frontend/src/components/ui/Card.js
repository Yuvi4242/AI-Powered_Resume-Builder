import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
      className={`
        bg-white dark:bg-slate-900/50 
        border border-slate-200 dark:border-slate-800 
        rounded-2xl overflow-hidden 
        transition-all duration-300 
        ${hoverable ? 'hover:shadow-2xl hover:shadow-primary-500/10' : 'shadow-sm'} 
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
