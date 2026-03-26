import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

const TagInput = ({ tags, setTags, placeholder, label }) => {
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
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 min-h-[46px] transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full group animate-in fade-in zoom-in duration-200"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 min-w-[120px]"
        />
      </div>
    </div>
  );
};

export default TagInput;
