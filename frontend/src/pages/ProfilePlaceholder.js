import { motion } from 'framer-motion';
import { FiTool } from 'react-icons/fi';

const ProfilePlaceholder = ({ title }) => {
  return (
    <div className="flex-1 p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-16 text-center border border-gray-100 dark:border-gray-700 max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiTool className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This page is under construction. We are building something amazing for you. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePlaceholder;
