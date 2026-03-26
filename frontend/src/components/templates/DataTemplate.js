import React from 'react';
import { FiPieChart, FiMail, FiPhone, FiAward } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';

const DataTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { name, email, phone, summary, skills, projects, certifications, experience, education } = data;

  return (
    <div className="p-10 font-sans text-gray-900 bg-slate-50 min-h-[1056px]">
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
            </h1>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Analytics Professional</p>
          </div>
          <div className="text-right text-sm space-y-1 opacity-80">
            <p className="flex items-center justify-end gap-2">
              <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" /> <FiMail />
            </p>
            <p className="flex items-center justify-end gap-2">
              <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" /> <FiPhone />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* Main Content */}
          <div className="col-span-8 p-10 space-y-8">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Executive Summary</h2>
              <div className="text-sm text-slate-700 leading-relaxed font-medium">
                <EditableText value={summary} onChange={(v) => onInlineEdit('summary', v)} isEditing={isEditing} placeholder="Enter your summary..." />
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Data Projects & Visualization</h2>
              <div className="space-y-4">
                <FieldRenderer 
                  data={projects}
                  isEditing={isEditing}
                  onInlineEdit={onInlineEdit}
                  sectionName="projects"
                  fields={{ title: 'title', subtitle: 'tech', description: 'description' }}
                  renderItem={(project, i, onFieldEdit) => (
                    <div key={i} className="group text-left">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors flex items-center gap-2">
                         <FiPieChart className="shrink-0" /> 
                         <EditableText value={project.title} onChange={(v) => onFieldEdit('title', v)} isEditing={isEditing} placeholder="Project Title" />
                      </h3>
                      <EditableText className="text-[10px] text-slate-400 font-bold ml-6 uppercase block" value={project.tech} onChange={(v) => onFieldEdit('tech', v)} isEditing={isEditing} placeholder="Tech Stack" />
                      <EditableText className="text-xs text-slate-500 mt-1 ml-6 block" value={project.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Project Description" />
                    </div>
                  )}
                />
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Professional Experience</h2>
              <div className="space-y-6 ml-6 border-l border-slate-200 pl-6">
                <FieldRenderer 
                  data={experience}
                  isEditing={isEditing}
                  onInlineEdit={onInlineEdit}
                  sectionName="experience"
                  fields={{ title: 'role', subtitle: 'company', date: 'duration', description: 'description' }}
                  renderItem={(exp, i, onFieldEdit) => (
                    <div key={i} className="space-y-1 text-left">
                      <div className="flex justify-between items-baseline">
                        <EditableText className="text-sm font-bold text-slate-900 block" value={exp.role} onChange={(v) => onFieldEdit('role', v)} isEditing={isEditing} placeholder="Role" />
                        <EditableText className="text-[10px] font-bold text-slate-400 block" value={exp.duration} onChange={(v) => onFieldEdit('duration', v)} isEditing={isEditing} placeholder="Duration" />
                      </div>
                      <EditableText className="text-xs font-bold text-slate-500 italic uppercase block" value={exp.company} onChange={(v) => onFieldEdit('company', v)} isEditing={isEditing} placeholder="Company" />
                      <EditableText className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-2 block" value={exp.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Description" />
                    </div>
                  )}
                />
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-4 bg-slate-50/50 p-10 border-l border-slate-100 space-y-8">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {(skills || '').split(',').map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Certifications</h2>
              <div className="space-y-3">
                 {(certifications || '').split('\n').map((cert, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                    <FiAward className="text-accent-500 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                 ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Education</h2>
              <div className="space-y-3">
                <FieldRenderer 
                  data={education}
                  isEditing={isEditing}
                  onInlineEdit={onInlineEdit}
                  sectionName="education"
                  fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
                  renderItem={(edu, i, onFieldEdit) => (
                    <div key={i} className="text-left">
                      <EditableText className="text-xs text-slate-900 font-bold block" value={edu.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} placeholder="Degree" />
                      <div className="flex gap-1 text-[10px] text-slate-500">
                        <EditableText value={edu.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} placeholder="School" />
                        {edu.year && <span>(<EditableText value={edu.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} placeholder="Year" />)</span>}
                      </div>
                    </div>
                  )}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTemplate;
