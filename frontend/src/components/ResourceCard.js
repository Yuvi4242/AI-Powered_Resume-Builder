import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ resource, isBookmarked, onBookmarkToggle }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col h-full group transition-all hover:border-primary-200 dark:hover:border-primary-800"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <resource.icon className="w-6 h-6" />
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(resource.id);
          }}
          className={`p-2 rounded-lg transition-colors ${
            isBookmarked 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
          }`}
        >
          <FiHeart className={isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider rounded-md">
            {resource.category}
          </span>
          <span className="text-gray-400 text-[10px] font-medium">• {resource.readTime}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors leading-tight">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {resource.description}
        </p>
      </div>

      <button 
        onClick={() => navigate(`/resources/${resource.id}`)}
        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm hover:gap-3 transition-all mt-auto"
      >
        Read Full Guide <FiArrowRight />
      </button>
    </motion.div>
  );
};

export default ResourceCard;
