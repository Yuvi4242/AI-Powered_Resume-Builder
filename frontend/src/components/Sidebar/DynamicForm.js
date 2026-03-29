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

const DynamicForm = ({ schema, formData, onChange, onAIAssist, activeAIField }) => {
  const [activeSection, setActiveSection] = useState(schema.sections[0]?.id || '');

  const handleToggle = (id) => {
    setActiveSection(activeSection === id ? '' : id);
  };

  const handleFieldChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <div className="space-y-6">
      {schema.sections.map((section) => {
        const Icon = iconMap[section.icon] || FiUser;
        const isActive = activeSection === section.id;

        return (
          <div 
            key={section.id} 
            className={`rounded-3xl transition-all duration-500 overflow-hidden ${isActive ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary-500/10' : 'bg-slate-50/50 dark:bg-slate-900/30 border border-transparent'}`}
          >
            <button
              onClick={() => handleToggle(section.id)}
              className={`w-full flex items-center justify-between p-6 text-sm font-bold transition-all ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/30 rotate-0' : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 shadow-sm'}`}>
                  <Icon className="w-5 h-5 transition-transform" />
                </div>
                <div className="flex flex-col items-start">
                   <span className="text-sm font-bold tracking-tight">{section.label}</span>
                   {isActive && <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400/80 mt-1">Active Section</span>}
                </div>
              </div>
              <FiChevronDown className={`w-5 h-5 transition-all duration-500 ${isActive ? 'rotate-180 text-primary-500' : 'text-slate-300'}`} />
            </button>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="p-6 pt-2 space-y-10 border-t border-slate-100 dark:border-slate-800/50">
                    {section.type === 'list' ? (
                      <ListField 
                        section={section} 
                        values={formData[section.id] || []} 
                        onChange={handleFieldChange} 
                        onAIAssist={onAIAssist}
                        activeAIField={activeAIField}
                      />
                    ) : section.type === 'tags' ? (
                      <TagsField 
                        section={section} 
                        value={formData[section.id] || ''} 
                        onChange={handleFieldChange} 
                        onAIAssist={onAIAssist}
                        activeAIField={activeAIField}
                      />
                    ) : (
                      <div className="space-y-8">
                        {section.fields?.map((field) => (
                          <DynamicField 
                            key={field.name} 
                            field={field} 
                            value={formData[field.name]} 
                            onChange={handleFieldChange} 
                            onAIAssist={onAIAssist}
                            activeAIField={activeAIField}
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
