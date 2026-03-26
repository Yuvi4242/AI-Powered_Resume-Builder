import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${hoverable ? 'hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
