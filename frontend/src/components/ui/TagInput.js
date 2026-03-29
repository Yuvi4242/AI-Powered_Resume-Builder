import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const TagInput = ({ tags = [], setTags, placeholder = "Add tag...", label }) => {
  const [inputValue, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setValue('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-200 group-focus-within:text-primary-600">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 p-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300 min-h-[52px] focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.span
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.8, x: -5 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full border border-primary-100 dark:border-primary-800/50 group transition-all hover:border-primary-300"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 py-1.5 min-w-[120px]"
        />
      </div>
    </div>
  );
};

export default TagInput;
