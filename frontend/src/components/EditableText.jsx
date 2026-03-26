import React, { useState, useEffect, useRef } from 'react';

/**
 * EditableText - A reusable component for inline editing
 */
const EditableText = ({ 
  value, 
  onChange, 
  placeholder = "Click to edit", 
  className = "", 
  type = "text",
  isEditing = true // Global edit mode toggle
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleChange = (e) => {
    const newVal = e.target.innerText;
    setLocalValue(newVal);
    
    // Simple debounce for real-time sync (optional, usually blur is enough for performance)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // onChange(newVal); // Uncomment for real-time, but blur is safer for massive re-renders
    }, 500);
  };

  if (!isEditing) {
    return <span className={className}>{value || ""}</span>;
  }

  const isEmpty = !localValue || localValue.trim() === "";

  return (
    <div 
      contentEditable
       suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleChange}
      onFocus={() => setIsFocused(true)}
      className={`
        inline-block min-w-[20px] outline-none transition-all duration-200
        ${isFocused ? 'ring-2 ring-primary-400 rounded-sm bg-primary-50 px-1' : 'hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 rounded-sm px-1 cursor-text'}
        ${isEmpty && !isFocused ? 'text-gray-400 italic' : ''}
        ${className}
      `}
      data-placeholder={placeholder}
    >
      {isEmpty && !isFocused ? placeholder : localValue}
    </div>
  );
};

export default EditableText;
