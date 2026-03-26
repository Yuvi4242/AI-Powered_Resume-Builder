import React from 'react';
import EditableText from './EditableText';


const FieldRenderer = ({ 
  data, 
  fields = { title: 'role', subtitle: 'company', date: 'duration', description: 'description' },
  renderItem,
  fallback = null,
  isEditing = false,
  onInlineEdit = () => {},
  sectionName = ""
}) => {
  if (!data) return fallback;

  // Handle Array of Objects (New Schema)
  if (Array.isArray(data)) {
    if (data.length === 0) return fallback;
    
    return (
      <>
        {data.map((item, index) => {
          if (typeof item !== 'object') {
            return (
              <EditableText 
                key={index}
                value={item}
                isEditing={isEditing}
                onChange={(val) => onInlineEdit(`${sectionName}.${index}`, val)}
              />
            );
          }
          
          if (renderItem) return renderItem(item, index, (field, val) => onInlineEdit(`${sectionName}.${index}.${field}`, val));
          
          return (
            <div key={index} className="mb-4 last:mb-0">
              <EditableText 
                className="font-bold block"
                value={item[fields.title]}
                isEditing={isEditing}
                onChange={(val) => onInlineEdit(`${sectionName}.${index}.${fields.title}`, val)}
              />
              <EditableText 
                className="italic text-gray-600 block"
                value={item[fields.subtitle]}
                isEditing={isEditing}
                onChange={(val) => onInlineEdit(`${sectionName}.${index}.${fields.subtitle}`, val)}
              />
              <EditableText 
                className="text-sm text-gray-400 block"
                value={item[fields.date]}
                isEditing={isEditing}
                onChange={(val) => onInlineEdit(`${sectionName}.${index}.${fields.date}`, val)}
              />
              <EditableText 
                className="text-sm mt-1 whitespace-pre-line block"
                value={item[fields.description]}
                isEditing={isEditing}
                onChange={(val) => onInlineEdit(`${sectionName}.${index}.${fields.description}`, val)}
              />
            </div>
          );
        })}
      </>
    );
  }

  // Handle Single Object (Rare but safe)
  if (typeof data === 'object') {
    if (renderItem) return renderItem(data, 0, (field, val) => onInlineEdit(`${sectionName}.${field}`, val));
    return (
      <div>
        <EditableText 
          className="font-bold block"
          value={data[fields.title]}
          isEditing={isEditing}
          onChange={(val) => onInlineEdit(`${sectionName}.${fields.title}`, val)}
        />
        <EditableText 
          className="block"
          value={data[fields.description]}
          isEditing={isEditing}
          onChange={(val) => onInlineEdit(`${sectionName}.${fields.description}`, val)}
        />
      </div>
    );
  }

  // Handle String (Legacy or simple field)
  return (
    <EditableText 
      className="block"
      value={data}
      isEditing={isEditing}
      onChange={(val) => onInlineEdit(sectionName, val)}
    />
  );
};

export default FieldRenderer;
