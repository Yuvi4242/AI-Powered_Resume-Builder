import React from 'react';
import { FiGithub, FiMail, FiPhone } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';
import SocialLinksRenderer from '../SocialLinksRenderer';

const SoftwareTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { name, email, phone, summary, skills, projects, experience, education } = data;

  return (
    <div className="p-10 font-sans text-gray-900 bg-white min-h-[1056px]">
      {/* Header */}
      <header className="border-b-4 border-gray-900 pb-6 mb-8 text-left">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
          <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600 uppercase items-center">
          <div className="flex items-center gap-1">
            <FiMail className="shrink-0" />
            {isEditing ? (
              <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" />
            ) : (
              <a href={`mailto:${email}`} className="hover:text-primary-600 transition-colors underline decoration-gray-300 underline-offset-2">{email}</a>
            )}
          </div>
          <div className="flex items-center gap-1">
            <FiPhone className="shrink-0" />
            {isEditing ? (
              <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" />
            ) : (
              <a href={`tel:${phone?.replace(/\s+/g, '')}`} className="hover:text-primary-600 transition-colors underline decoration-gray-300 underline-offset-2">{phone}</a>
            )}
          </div>
          <SocialLinksRenderer 
            links={Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'email' && k !== 'phone'))} 
            className="!gap-4" 
            itemClassName="text-gray-600 font-bold" 
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Summary */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-2">Technical Profile</h2>
          <div className="text-sm leading-relaxed text-gray-700">
            <EditableText value={summary} onChange={(v) => onInlineEdit('summary', v)} isEditing={isEditing} placeholder="Enter your profile summary..." />
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-3">Core Stack</h2>
          <div className="flex flex-wrap gap-2">
            {(skills || '').split(',').map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold rounded uppercase">
                {skill.trim()}
              </span>
            ))}
          </div>
        </section>

        {/* Projects - HIGH IMPORTANCE */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4">Technical Projects</h2>
          <div className="space-y-4">
            <FieldRenderer 
              data={projects}
              isEditing={isEditing}
              onInlineEdit={onInlineEdit}
              sectionName="projects"
              fields={{ title: 'title', subtitle: 'tech', description: 'description' }}
              renderItem={(item, i, onFieldEdit) => (
                <div key={i} className="border-l-2 border-gray-200 pl-4 py-1">
                  <EditableText className="text-sm font-bold text-gray-900 block" value={item.title} onChange={(v) => onFieldEdit('title', v)} isEditing={isEditing} />
                  <EditableText className="text-xs text-secondary-500 font-medium mb-1 block" value={item.tech} onChange={(v) => onFieldEdit('tech', v)} isEditing={isEditing} />
                  <EditableText className="text-xs text-gray-600 mt-1 block" value={item.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} />
                </div>
              )}
            />
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4">Professional Experience</h2>
          <div className="space-y-6">
            <FieldRenderer 
              data={experience}
              isEditing={isEditing}
              onInlineEdit={onInlineEdit}
              sectionName="experience"
              fields={{ title: 'role', subtitle: 'company', date: 'duration', description: 'description' }}
              renderItem={(exp, i, onFieldEdit) => (
                <div key={i} className="border-l-2 border-primary-100 pl-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <EditableText className="text-sm font-bold text-gray-900" value={exp.role} onChange={(v) => onFieldEdit('role', v)} isEditing={isEditing} />
                    <EditableText className="text-[10px] font-bold text-gray-400 uppercase" value={exp.duration} onChange={(v) => onFieldEdit('duration', v)} isEditing={isEditing} />
                  </div>
                  <EditableText className="text-xs font-bold text-primary-600 mb-2 block" value={exp.company} onChange={(v) => onFieldEdit('company', v)} isEditing={isEditing} />
                  <EditableText className="text-xs text-gray-700 whitespace-pre-line leading-relaxed block" value={exp.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} />
                </div>
              )}
            />
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-2">Education</h2>
          <div className="space-y-2">
            <FieldRenderer 
              data={education}
              isEditing={isEditing}
              onInlineEdit={onInlineEdit}
              sectionName="education"
              fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
              renderItem={(edu, i, onFieldEdit) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <EditableText className="text-sm text-gray-800 font-bold block" value={edu.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} />
                    <EditableText className="text-xs text-gray-600 block" value={edu.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} />
                  </div>
                  <EditableText className="text-[10px] font-bold text-gray-400" value={edu.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} />
                </div>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SoftwareTemplate;
