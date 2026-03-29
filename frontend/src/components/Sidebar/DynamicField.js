import React from 'react';
import { FiPlus, FiTrash2, FiZap, FiLoader } from 'react-icons/fi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const DynamicField = ({ field, value, onChange, onAIAssist, activeAIField }) => {
  const { type, name, label, placeholder } = field;
  const isAssisting = activeAIField === name;

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
          <button 
            type="button"
            onClick={() => onAIAssist(name)}
            disabled={isAssisting}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all px-2 py-1 rounded-md ${isAssisting ? 'text-primary-400 bg-primary-50/50' : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
          >
            {isAssisting ? <FiLoader className="animate-spin w-3 h-3" /> : <FiZap className="w-3 h-3" />}
            {isAssisting ? 'Analyzing...' : 'AI Assist'}
          </button>
        </div>
        <textarea
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full text-sm font-medium p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 border-b-2 focus:border-b-primary-500 outline-none transition-all resize-none placeholder:text-slate-400"
        />
      </div>
    );
  }

  const showAI = ['jobTitle', 'role', 'currentRole', 'company', 'location'].includes(name);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
        {showAI && (
          <button 
            type="button"
            onClick={() => onAIAssist(name)}
            disabled={isAssisting}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all px-2 py-1 rounded-md ${isAssisting ? 'text-primary-400' : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
          >
            {isAssisting ? <FiLoader className="animate-spin" /> : <FiZap />}
            AI
          </button>
        )}
      </div>
      <Input
        type={type || 'text'}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="text-sm font-medium"
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
    <div className="space-y-10">
      {items.map((item, index) => (
        <div key={index} className="relative group/list-item">
          {items.length > 1 && (
            <button 
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 text-rose-500 p-2 rounded-xl opacity-0 group-hover/list-item:opacity-100 transition-all shadow-xl hover:bg-rose-50 z-20 border border-slate-100 dark:border-slate-800"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
          
          <div className="space-y-6">
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
          
          {index < items.length - 1 && (
            <div className="mt-10 border-b border-dashed border-slate-200 dark:border-slate-800"></div>
          )}
        </div>
      ))}
      
      <Button 
        variant="secondary"
        onClick={handleAddItem}
        className="w-full !py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent text-slate-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50/10 transition-all font-bold text-xs"
      >
        <FiPlus className="mr-2" /> Add {section.label}
      </Button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Skills</label>
        <button 
          type="button"
          onClick={() => onAIAssist('skills')}
          disabled={isAssisting}
          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all px-2 py-1 rounded-md ${isAssisting ? 'text-primary-400' : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
        >
          {isAssisting ? <FiLoader className="animate-spin w-3 h-3" /> : <FiZap className="w-3 h-3" />}
          {isAssisting ? 'Curating...' : 'AI Suggest'}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-xl flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-rose-500 transition-colors">
              <FiTrash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <p className="text-[10px] text-slate-400 font-medium m-0 flex items-center">No skills listed yet.</p>}
      </div>

      <div className="flex gap-2">
        <Input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="New Skill..."
          className="flex-1 text-xs"
        />
        <Button 
          onClick={handleAddTag}
          size="sm"
          className="shrink-0 rounded-2xl"
        >
          <FiPlus />
        </Button>
      </div>
    </div>
  );
};
