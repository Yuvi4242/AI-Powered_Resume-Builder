import { motion } from 'framer-motion';
import { FiCheck, FiLayout } from 'react-icons/fi';

import { templatesData as templates } from '../data/templatesData';

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiLayout className="text-primary-500" />
        Choose Template
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={`relative p-3 rounded-xl border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            {/* Preview Card */}
            <div className={`h-20 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 mb-2 shadow-inner flex items-center justify-center`}>
              <div className="w-8 h-10 bg-white/30 rounded-sm" />
            </div>
            
            {/* Template Info */}
            <div className="text-center">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{template.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{template.title}</p>
            </div>

            {/* Selected Indicator */}
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiCheck className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Template Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            animate={{
              scale: selectedTemplate === template.id ? 1.2 : 1,
              backgroundColor: selectedTemplate === template.id ? template.accent : '#d1d5db'
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
