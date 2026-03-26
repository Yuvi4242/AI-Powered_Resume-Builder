import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';

const BusinessTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { name, email, phone, summary, experience, skills, education } = data;

  return (
    <div className="p-12 font-serif text-gray-900 bg-white min-h-[1056px]">
      {/* Centered Header */}
      <header className="text-center mb-12 border-double border-b-4 border-gray-300 pb-10">
        <h1 className="text-4xl font-serif font-black tracking-normal mb-6">
          <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
        </h1>
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-600">
          <span><EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" /></span>
          <span>|</span>
          <span><EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" /></span>
          <span>|</span>
          <span className="flex items-center gap-1 font-serif italic capitalize tracking-normal text-sm font-medium">New York, NY</span>
        </div>
      </header>

      <div className="space-y-10">
        {/* Executive Summary */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2 mb-4">Executive Profile</h2>
          <div className="text-md leading-relaxed text-gray-800 font-serif italic text-center px-12">
            <EditableText value={summary} onChange={(v) => onInlineEdit('summary', v)} isEditing={isEditing} placeholder="Enter your summary..." />
          </div>
        </section>

        {/* Experience - CORE SECTION */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2 mb-6">Professional Experience</h2>
          <div className="space-y-8 font-serif">
            <FieldRenderer 
              data={experience}
              isEditing={isEditing}
              onInlineEdit={onInlineEdit}
              sectionName="experience"
              fields={{ title: 'role', subtitle: 'company', date: 'duration', description: 'description' }}
              renderItem={(exp, i, onFieldEdit) => (
                <div key={i} className="space-y-2 text-left">
                  <div className="flex justify-between items-baseline">
                    <EditableText className="text-lg font-bold text-gray-900 leading-tight block" value={exp.role} onChange={(v) => onFieldEdit('role', v)} isEditing={isEditing} />
                    <EditableText className="text-xs font-bold text-gray-500 italic block" value={exp.duration} onChange={(v) => onFieldEdit('duration', v)} isEditing={isEditing} />
                  </div>
                  <EditableText className="text-sm font-bold text-primary-700 uppercase tracking-wider block" value={exp.company} onChange={(v) => onFieldEdit('company', v)} isEditing={isEditing} />
                  <EditableText className="text-sm text-gray-800 text-justify leading-relaxed whitespace-pre-line block" value={exp.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} />
                </div>
              )}
            />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          {/* Skills */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2 mb-4">Core Competencies</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
               {(Array.isArray(skills) ? skills : (skills || '').split(',')).map((skill, i) => {
                 const skillName = typeof skill === 'string' ? skill : skill.name;
                 if (!skillName) return null;
                 return (
                  <div key={i} className="text-xs font-bold text-gray-700 flex items-center gap-2">
                     <div className="w-1 h-1 bg-gray-400"></div> {skillName.trim()}
                  </div>
                 );
               })}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2 mb-4">Education & Credentials</h2>
            <div className="space-y-3">
              <FieldRenderer 
                data={education}
                isEditing={isEditing}
                onInlineEdit={onInlineEdit}
                sectionName="education"
                fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
                renderItem={(edu, i, onFieldEdit) => (
                  <div key={i} className="text-sm text-gray-800 text-left">
                    <EditableText className="font-bold block" value={edu.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} />
                    <div className="flex gap-1 italic">
                      <EditableText value={edu.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} />
                      {edu.year && <span className="font-normal text-gray-500">| <EditableText value={edu.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} /></span>}
                    </div>
                  </div>
                )}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessTemplate;
