import React from 'react';
import { FiLayers, FiExternalLink } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';

const DesignerTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { name, email, phone, portfolio, skills, projects, experience, education } = data;

  return (
    <div className="font-sans text-gray-900 bg-white min-h-[1056px]">
      <div className="flex">
        {/* Left Column (Creative Side) */}
        <div className="w-[80px] bg-black min-h-[1056px] flex flex-col items-center py-10 gap-8">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-black">
            {name?.[0] || 'V'}
          </div>
          <div className="rotate-90 whitespace-nowrap text-white font-black tracking-[0.4em] uppercase text-[10px] opacity-40 mt-12">
            Portfolio 2024
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-16 space-y-12">
          {/* Header */}
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-6xl font-black mb-2 tracking-tighter">
                <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
              </h1>
              <p className="text-xl text-primary-600 font-bold">Product & Visual Designer</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-bold flex items-center justify-end gap-2 text-gray-400">
                <EditableText value={portfolio} onChange={(v) => onInlineEdit('portfolio', v)} isEditing={isEditing} placeholder="Portfolio Link" /> <FiExternalLink />
              </p>
              <p className="text-sm font-bold text-gray-400">
                <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" />
              </p>
              <p className="text-sm font-bold text-gray-400">
                <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" />
              </p>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-16">
            <section className="space-y-6">
              <h2 className="text-3xl font-black italic tracking-tight border-b-4 border-gray-100 pb-2">Craft & Tools</h2>
              <div className="grid grid-cols-2 gap-4">
                {(skills || '').split(',').map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-600 group hover:text-black transition-colors">
                    <div className="w-2 h-2 bg-accent-500 rounded-full group-hover:scale-150 transition-transform"></div>
                    {skill.trim()}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black italic tracking-tight border-b-4 border-gray-100 pb-2">Selected Works</h2>
              <div className="space-y-6">
                <FieldRenderer 
                  data={projects}
                  isEditing={isEditing}
                  onInlineEdit={onInlineEdit}
                  sectionName="projects"
                  fields={{ title: 'title', description: 'description' }}
                  renderItem={(item, i, onFieldEdit) => (
                    <div key={i} className="space-y-2 text-left">
                       <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <FiLayers className="text-primary-500" /> 
                          <EditableText value={item.title} onChange={(v) => onFieldEdit('title', v)} isEditing={isEditing} placeholder="Project Title" />
                       </h3>
                       <EditableText className="text-xs text-secondary-500 font-bold uppercase tracking-widest block" value={item.tech} onChange={(v) => onFieldEdit('tech', v)} isEditing={isEditing} placeholder="Tech Stack" />
                       <EditableText className="text-xs text-gray-500 leading-relaxed font-medium block" value={item.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Project Description" />
                    </div>
                  )}
                />
              </div>
            </section>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tight border-b-4 border-gray-100 pb-2">The Journey</h2>
            <div className="text-sm text-gray-600 font-medium px-8 bg-gray-50 py-6 rounded-3xl border border-gray-100 text-left">
              <FieldRenderer 
                data={experience} 
                isEditing={isEditing} 
                onInlineEdit={onInlineEdit} 
                sectionName="experience"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-2 font-mono">Institutional Training</h2>
            <FieldRenderer 
              data={education} 
              isEditing={isEditing} 
              onInlineEdit={onInlineEdit} 
              sectionName="education"
              fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
              renderItem={(item, i, onFieldEdit) => (
                <div key={i} className="text-lg text-gray-900 font-black italic flex gap-1 items-baseline">
                   <EditableText value={item.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} placeholder="Degree" />
                   {item.school && <span className="mx-1">|</span>}
                   <EditableText value={item.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} placeholder="School" />
                   {item.year && <span className="mx-1 font-normal opacity-40">(<EditableText value={item.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} placeholder="Year" />)</span>}
                </div>
              )}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DesignerTemplate;
