import { motion } from 'framer-motion';

const AIToolCard = ({ title, description, icon: Icon, onClick, gradient, isActive }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-6 rounded-2xl shadow-lg border transition-all duration-300 relative overflow-hidden group ${
        isActive 
          ? 'border-transparent ring-2 ring-primary-500 shadow-xl shadow-primary-500/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-${isActive ? '10' : '0'} group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
          {description}
        </p>
        
        <div className={`inline-flex items-center text-sm font-semibold transition-colors duration-300 ${
          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-500'
        }`}>
          {isActive ? 'Active Tool' : 'Use Tool'}
          <span className="ml-2">→</span>
        </div>
      </div>
    </motion.button>
  );
};

export default AIToolCard;
