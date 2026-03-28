import React from 'react';
import { FiPlus, FiTrash2, FiZap, FiLoader } from 'react-icons/fi';

export const DynamicField = ({ field, value, onChange, onAIAssist, activeAIField }) => {
  const { type, name, label, placeholder } = field;
  const isAssisting = activeAIField === name;

  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
          <button 
            onClick={() => onAIAssist(name)}
            disabled={isAssisting}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${isAssisting ? 'text-primary-400' : 'text-primary-600 hover:text-primary-700'}`}
          >
            {isAssisting ? <FiLoader className="animate-spin" /> : <FiZap />}
            {isAssisting ? 'Thinking...' : 'AI Assist'}
          </button>
        </div>
        <textarea
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full text-sm p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 focus:border-primary-500 outline-none transition-all resize-none"
        />
      </div>
    );
  }

  const showAI = ['jobTitle', 'role', 'currentRole', 'company', 'location'].includes(name);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        {showAI && (
          <button 
            onClick={() => onAIAssist(name)}
            disabled={isAssisting}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${isAssisting ? 'text-primary-400' : 'text-primary-600 hover:text-primary-700'}`}
          >
            {isAssisting ? <FiLoader className="animate-spin" /> : <FiZap />}
            AI
          </button>
        )}
      </div>
      <input
        type={type || 'text'}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 focus:border-primary-500 outline-none transition-all"
      />
    </div>
  );
};

export const ListField = ({ section, values, onChange, onAIAssist, activeAIField }) => {
  const items = Array.isArray(values) ? values : [{}];

  const handleAddItem = () => {
    onChange(section.id, [...items, {}]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(section.id, newItems.length > 0 ? newItems : [{}]);
  };

  const handleItemChange = (index, fieldName, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    onChange(section.id, newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm relative group">
          <button 
            onClick={() => handleRemoveItem(index)}
            className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
          
          <div className="space-y-3">
            {section.fields.map((field) => (
              <DynamicField 
                key={field.name}
                field={field}
                value={item[field.name]}
                onChange={(name, val) => handleItemChange(index, name, val)}
                onAIAssist={onAIAssist}
                activeAIField={activeAIField}
              />
            ))}
          </div>
        </div>
      ))}
      
      <button 
        onClick={handleAddItem}
        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <FiPlus /> Add {section.label.replace('Information', '').trim()} Item
      </button>
    </div>
  );
};

export const TagsField = ({ section, value, onChange, onAIAssist, activeAIField }) => {
  const tags = typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
  const [inputValue, setInputValue] = React.useState('');
  const isAssisting = activeAIField === 'skills';

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onChange(section.id || section.name, newTags.join(', '));
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    onChange(section.id || section.name, newTags.join(', '));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Skills</label>
        <button 
          onClick={() => onAIAssist('skills')}
          disabled={isAssisting}
          className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${isAssisting ? 'text-primary-400' : 'text-primary-600 hover:text-primary-700'}`}
        >
          {isAssisting ? <FiLoader className="animate-spin" /> : <FiZap />}
          {isAssisting ? 'Analyzing...' : 'Suggest Skills'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-primary-100 dark:border-primary-800">
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
              <FiTrash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <p className="text-xs text-gray-400 italic">No skills added yet...</p>}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="Add a skill (e.g. React)..."
          className="flex-1 text-sm p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 focus:border-primary-500 outline-none transition-all"
        />
        <button 
          onClick={handleAddTag}
          className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
};
