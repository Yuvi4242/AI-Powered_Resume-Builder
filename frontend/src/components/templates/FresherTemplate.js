import React from 'react';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';

const FresherTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { 
    name, email, phone, city, state, linkedin, github, 
    education, skills, projects, internships, technical_skills, 
    achievements, certifications 
  } = data;

  // Helper to render bullet points from newline-separated text
  const renderBullets = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <div key={i} className="flex items-start gap-2 mb-1">
        <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
        <span className="text-[11pt] leading-snug">{line.trim().startsWith('-') ? line.trim().substring(1).trim() : line.trim()}</span>
      </div>
    ));
  };

  return (
    <div className="p-[1in] font-serif text-black bg-white min-h-[1056px] flex flex-col items-stretch shadow-inner selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-[24pt] font-bold mb-1 tracking-tight">
          <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
        </h1>
        <div className="text-[11pt] flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          <EditableText value={city} onChange={(v) => onInlineEdit('city', v)} isEditing={isEditing} placeholder="City" />, <EditableText value={state} onChange={(v) => onInlineEdit('state', v)} isEditing={isEditing} placeholder="State" />
          <span className="text-gray-400">|</span>
          <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" />
          <span className="text-gray-400">|</span>
          <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" />
          {linkedin && (
            <>
              <span className="text-gray-400">|</span>
              <EditableText value={linkedin} onChange={(v) => onInlineEdit('linkedin', v)} isEditing={isEditing} placeholder="LinkedIn" />
            </>
          )}
          {github && (
            <>
              <span className="text-gray-400">|</span>
              <EditableText value={github} onChange={(v) => onInlineEdit('github', v)} isEditing={isEditing} placeholder="GitHub" />
            </>
          )}
        </div>
      </header>

      <div className="space-y-5">
        
        {/* EDUCATION */}
        <section>
          <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Education</h2>
          <div className="space-y-2">
            <FieldRenderer 
              data={education}
              isEditing={isEditing}
              onInlineEdit={onInlineEdit}
              sectionName="education"
              fields={{ title: 'school', subtitle: 'degree', date: 'year' }}
              renderItem={(item, i, onFieldEdit) => (
                <div key={i} className="flex justify-between items-start text-[11pt] text-left">
                  <div className="flex-1">
                     <EditableText className="font-bold block" value={item.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} placeholder="School" />
                     <EditableText className="italic block" value={item.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} placeholder="Degree" />
                  </div>
                  <EditableText className="text-right font-bold ml-4" value={item.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} placeholder="Year" />
                </div>
              )}
            />
          </div>
        </section>

        {/* SKILLS / COURSEWORK */}
        {skills && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Relevant Coursework</h2>
            <div className="text-[11pt] leading-relaxed text-left">
              <EditableText value={skills} onChange={(v) => onInlineEdit('skills', v)} isEditing={isEditing} placeholder="Enter shared skills/coursework..." />
            </div>
          </section>
        )}

        {/* INTERNSHIPS / EXPERIENCE */}
        {internships && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Experience / Internships</h2>
            <div className="space-y-4 text-left">
              <FieldRenderer 
                data={internships} 
                isEditing={isEditing} 
                onInlineEdit={onInlineEdit} 
                sectionName="internships" 
              />
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Projects</h2>
            <div className="space-y-4">
              <FieldRenderer 
                data={projects}
                isEditing={isEditing}
                onInlineEdit={onInlineEdit}
                sectionName="projects"
                fields={{ title: 'title', description: 'description' }}
                renderItem={(item, i, onFieldEdit) => (
                  <div key={i} className="text-left">
                    <div className="flex justify-between items-baseline text-[11pt]">
                       <EditableText className="font-bold block" value={item.title} onChange={(v) => onFieldEdit('title', v)} isEditing={isEditing} placeholder="Project Title" />
                       <EditableText className="text-xs font-medium text-gray-500 block" value={item.tech} onChange={(v) => onFieldEdit('tech', v)} isEditing={isEditing} placeholder="Tech used" />
                    </div>
                    <div className="mt-1 text-gray-800">
                      <EditableText className="block whitespace-pre-line" value={item.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Project Description" />
                    </div>
                  </div>
                )}
              />
            </div>
          </section>
        )}

        {/* TECHNICAL SKILLS */}
        {technical_skills && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Technical Skills</h2>
            <div className="space-y-1 text-left">
              <EditableText className="block whitespace-pre-line" value={technical_skills} onChange={(v) => onInlineEdit('technical_skills', v)} isEditing={isEditing} placeholder="Languages: C++, Java..." />
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Extracurricular / Achievements</h2>
            <div className="mt-1 text-left">
              <EditableText className="block whitespace-pre-line" value={achievements} onChange={(v) => onInlineEdit('achievements', v)} isEditing={isEditing} placeholder="Enter achievements..." />
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications && (
          <section>
            <h2 className="text-[13pt] font-bold uppercase border-b border-black mb-2 pb-0.5">Certifications</h2>
            <div className="mt-1 text-left">
              <EditableText className="block whitespace-pre-line" value={certifications} onChange={(v) => onInlineEdit('certifications', v)} isEditing={isEditing} placeholder="Enter certifications..." />
            </div>
          </section>
        )}

      </div>

      <style jsx="true">{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default FresherTemplate;
