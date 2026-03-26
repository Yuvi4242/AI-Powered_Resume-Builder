import { motion } from 'framer-motion';
import { FiCalendar, FiDownload, FiEdit2, FiFileText, FiMail, FiTrash2 } from 'react-icons/fi';

const ResumeCard = ({ resume, onEdit, onDelete, isLoading, viewMode = 'grid', index = 0 }) => {
  const templateColors = {
    template1: 'from-blue-500 to-blue-600',
    template2: 'from-emerald-500 to-emerald-600',
    template3: 'from-purple-500 to-purple-600',
  };

  const colorClass = templateColors[resume.template] || templateColors.template1;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        delay: index * 0.05 
      }
    },
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01, x: 5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-lg transition-all"
      >
        {/* Preview Icon */}
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <FiFileText className="w-6 h-6 text-white" />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-white truncate">{resume.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FiMail className="w-4 h-4" />
              {resume.email}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              {new Date(resume.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Template Badge */}
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className={`px-3 py-1 bg-gradient-to-r ${colorClass} text-white text-xs rounded-full font-medium`}
        >
          {resume.template || 'Template 1'}
        </motion.span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(resume)}
            className="p-2.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(resume._id)}
            disabled={isLoading}
            className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" 
              />
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
    >
      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none"
      />

      {/* Header with gradient */}
      <motion.div 
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`h-3 bg-gradient-to-r ${colorClass} bg-[length:200%_200%]`} 
      />
      
      <div className="p-5 relative z-10">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <FiFileText className="w-6 h-6 text-white" />
          </motion.div>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className={`px-3 py-1 bg-gradient-to-r ${colorClass} text-white text-xs rounded-full font-medium`}
          >
            {resume.template || 'Template 1'}
          </motion.span>
        </div>

        {/* Content */}
        <motion.h3 
          whileHover={{ color: '#3b82f6' }}
          className="font-bold text-lg text-gray-800 dark:text-white mb-1 truncate"
        >
          {resume.name}
        </motion.h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate flex items-center gap-1">
          <FiMail className="w-3.5 h-3.5" />
          {resume.email}
        </p>

        {/* Skills Preview */}
        {resume.skills && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resume.skills.split(',').slice(0, 3).map((skill, i) => (
              <motion.span 
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {skill.trim()}
              </motion.span>
            ))}
            {resume.skills.split(',').length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{resume.skills.split(',').length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <motion.span 
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            className="text-xs text-gray-400"
          >
            {new Date(resume.createdAt).toLocaleDateString()}
          </motion.span>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(resume)}
              className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
              title="Download"
            >
              <FiDownload className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(resume._id)}
              disabled={isLoading}
              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" 
                />
              ) : (
                <FiTrash2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeCard;
