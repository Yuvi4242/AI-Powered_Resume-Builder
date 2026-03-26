import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiGlobe, FiMapPin } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';

const SidebarTemplate = ({ data, isEditing, onInlineEdit }) => {
  if (!data) return <div className="p-8 text-center text-gray-500">No data available for this template.</div>;

  const {
    name = 'Your Name',
    title = 'Job Title',
    email = 'email@example.com',
    phone = 'Phone Number',
    linkedin = '',
    github = '',
    website = '',
    location = '',
    summary = '',
    skills = '',
    programmingSkills = [],
    experience = '',
    education = '',
    research = '',
    publications = ''
  } = data;

  // Optimized list parsing
  const parseList = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split('\n').filter(item => item.trim() !== '');
  };

  // Skill parsing logic (handles both array and string "Name:Level")
  const getProgrammingSkills = () => {
    if (Array.isArray(programmingSkills) && programmingSkills.length > 0) return programmingSkills;
    if (typeof programmingSkills !== 'string' || !programmingSkills) return [];
    
    return programmingSkills.split(',').map(s => {
      const [name, level] = s.split(':');
      return { 
        name: name?.trim(), 
        level: parseInt(level?.trim()) || 80 
      };
    }).filter(s => s.name);
  };

  const skillList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (Array.isArray(skills) ? skills : []);
  const progSkills = getProgrammingSkills();

  return (
    <div className="bg-white min-h-[1123px] w-[794px] mx-auto shadow-2xl print:shadow-none print:mx-0 print:w-full flex font-sans text-gray-800 antialiased overflow-hidden print:text-black">
      {/* LEFT SIDEBAR (30%) */}
      <div className="w-[30%] bg-gray-900 text-white p-8 flex flex-col gap-10 print:bg-gray-900 print:text-white print:!bg-opacity-100" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        {/* Header */}
        <section>
          <h1 className="text-3xl font-black mb-2 leading-tight uppercase tracking-tighter text-left">
            <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
          </h1>
          <div className="text-primary-400 font-bold text-sm uppercase tracking-widest border-b border-gray-700 pb-4 mb-6 text-left">
            <EditableText value={title} onChange={(v) => onInlineEdit('title', v)} isEditing={isEditing} placeholder="Job Title" />
          </div>

          <div className="space-y-4 text-xs font-medium text-gray-300 text-left">
            <div className="flex items-center gap-3">
              <FiMail className="text-primary-400 w-4 h-4" />
              <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" />
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-primary-400 w-4 h-4" />
              <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" />
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-primary-400 w-4 h-4" />
              <EditableText value={location} onChange={(v) => onInlineEdit('location', v)} isEditing={isEditing} placeholder="Location" />
            </div>
            <div className="flex items-center gap-3">
              <FiLinkedin className="text-primary-400 w-4 h-4" />
              <EditableText value={linkedin} onChange={(v) => onInlineEdit('linkedin', v)} isEditing={isEditing} placeholder="LinkedIn" />
            </div>
            <div className="flex items-center gap-3">
              <FiGithub className="text-primary-400 w-4 h-4" />
              <EditableText value={github} onChange={(v) => onInlineEdit('github', v)} isEditing={isEditing} placeholder="GitHub" />
            </div>
            <div className="flex items-center gap-3">
              <FiGlobe className="text-primary-400 w-4 h-4" />
              <EditableText value={website} onChange={(v) => onInlineEdit('website', v)} isEditing={isEditing} placeholder="Website" />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-primary-500 pl-3">
            Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-800 text-[10px] font-bold rounded-md border border-gray-700 transition-all hover:border-primary-500"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Programming Skills (Progress Bars) */}
        {progSkills.length > 0 && (
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-primary-500 pl-3">
              Programming
            </h3>
            <div className="space-y-4">
              {progSkills.map((s, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>{s.name}</span>
                    <span className="text-gray-400">{s.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT CONTENT (70%) */}
      <div className="w-[70%] p-10 flex flex-col gap-10">
        {/* Summary */}
          <section>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-gray-900 border-b-2 border-gray-100 pb-2 text-left">
              Profile
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed italic text-left">
              <EditableText value={summary} onChange={(v) => onInlineEdit('summary', v)} isEditing={isEditing} placeholder="Enter your profile summary..." />
            </div>
          </section>

        {/* Experience */}
        <section>
          <h3 className="text-lg font-black uppercase tracking-tighter mb-6 text-gray-900 border-b-2 border-gray-100 pb-2">
            Experience
          </h3>
          <div className="space-y-8">
            <FieldRenderer 
              data={experience}
              isEditing={isEditing} 
              onInlineEdit={onInlineEdit} 
              sectionName="experience"
              fields={{ title: 'role', subtitle: 'company', date: 'duration', description: 'description' }}
              renderItem={(exp, index, onFieldEdit) => (
                <div key={index} className="relative pl-6 border-l border-gray-200 text-left">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-primary-50" />
                  <div className="mb-1 flex justify-between items-baseline">
                    <EditableText className="text-sm font-bold text-gray-900 block" value={exp.role} onChange={(v) => onFieldEdit('role', v)} isEditing={isEditing} placeholder="Role" />
                    <EditableText className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block" value={exp.duration} onChange={(v) => onFieldEdit('duration', v)} isEditing={isEditing} placeholder="Duration" />
                  </div>
                  <EditableText className="text-xs font-bold text-primary-600 mb-2 uppercase tracking-tighter block" value={exp.company} onChange={(v) => onFieldEdit('company', v)} isEditing={isEditing} placeholder="Company" />
                  <EditableText className="whitespace-pre-line text-xs text-gray-700 leading-relaxed block" value={exp.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Description" />
                </div>
              )}
            />
          </div>
        </section>

        {/* Research */}
        {research && (
          <section>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-gray-900 border-b-2 border-gray-100 pb-2 text-left">
              Research
            </h3>
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
              <EditableText value={research} onChange={(v) => onInlineEdit('research', v)} isEditing={isEditing} placeholder="Enter research..." />
            </div>
          </section>
        )}

        {/* Publications */}
        {publications && (
          <section>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-gray-900 border-b-2 border-gray-100 pb-2 text-left">
              Publications
            </h3>
            <div className="text-sm text-gray-600 text-left">
              <EditableText value={publications} onChange={(v) => onInlineEdit('publications', v)} isEditing={isEditing} placeholder="Enter publications (one per line)..." />
            </div>
          </section>
        )}

        {/* Education */}
        <section>
          <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-gray-900 border-b-2 border-gray-100 pb-2">
            Education
          </h3>
          <div className="text-sm text-gray-700 font-medium">
            <FieldRenderer 
              data={education}
              isEditing={isEditing} 
              onInlineEdit={onInlineEdit} 
              sectionName="education"
              fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
              renderItem={(edu, index, onFieldEdit) => (
                <div key={index} className="mb-3 text-left">
                  <EditableText className="font-bold text-gray-900 block" value={edu.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} placeholder="Degree" />
                  <div className="flex gap-1 text-xs text-gray-500 italic">
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
  );
};

export default SidebarTemplate;
