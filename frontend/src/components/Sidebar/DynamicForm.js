import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiUser, FiBriefcase, FiBookOpen, FiZap, FiLayers, FiMessageSquare } from 'react-icons/fi';
import { DynamicField, ListField, TagsField } from './DynamicField';

const iconMap = {
  FiUser: FiUser,
  FiBriefcase: FiBriefcase,
  FiBookOpen: FiBookOpen,
  FiZap: FiZap,
  FiLayers: FiLayers,
  FiMessageSquare: FiMessageSquare
};

const DynamicForm = ({ schema, formData, onChange }) => {
  const [activeSection, setActiveSection] = useState(schema.sections[0]?.id || '');

  const handleToggle = (id) => {
    setActiveSection(activeSection === id ? '' : id);
  };

  const handleFieldChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <div className="space-y-4">
      {schema.sections.map((section) => {
        const Icon = iconMap[section.icon] || FiUser;
        const isActive = activeSection === section.id;

        return (
          <div 
            key={section.id} 
            className={`border rounded-2xl transition-all duration-300 ${isActive ? 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-900 shadow-xl shadow-primary-500/5' : 'bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'}`}
          >
            <button
              onClick={() => handleToggle(section.id)}
              className={`w-full flex items-center justify-between p-4 px-5 text-sm font-bold transition-all ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'bg-white dark:bg-gray-800 text-gray-400 group-hover:text-gray-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {section.label}
              </div>
              <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-1 space-y-6 border-t border-gray-50 dark:border-gray-700/50 mt-1">
                    {section.type === 'list' ? (
                      <ListField 
                        section={section} 
                        values={formData[section.id] || []} 
                        onChange={handleFieldChange} 
                      />
                    ) : section.type === 'tags' ? (
                      <TagsField 
                        section={section} 
                        value={formData[section.id] || ''} 
                        onChange={handleFieldChange} 
                      />
                    ) : (
                      <div className="space-y-4">
                        {section.fields?.map((field) => (
                          <DynamicField 
                            key={field.name} 
                            field={field} 
                            value={formData[field.name]} 
                            onChange={handleFieldChange} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
