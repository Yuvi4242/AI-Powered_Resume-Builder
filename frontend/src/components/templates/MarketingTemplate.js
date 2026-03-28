import React from 'react';
import { FiTrendingUp, FiTarget, FiMail, FiPhone } from 'react-icons/fi';
import FieldRenderer from '../FieldRenderer';
import EditableText from '../EditableText';
import SocialLinksRenderer from '../SocialLinksRenderer';

const MarketingTemplate = ({ data, isEditing, onInlineEdit }) => {
  const { name, email, phone, summary, skills, campaigns, achievements, education } = data;

  return (
    <div className="font-sans text-gray-900 bg-white min-h-[1056px] flex flex-col">
      {/* Visual Header */}
      <header className="bg-primary-600 p-12 text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-left">
          <EditableText value={name} onChange={(v) => onInlineEdit('name', v)} isEditing={isEditing} placeholder="Your Name" />
        </h1>
        <div className="flex flex-wrap gap-6 text-sm font-medium opacity-90 text-left items-center">
          <span className="flex items-center gap-2">
            <FiMail /> 
            {isEditing ? (
              <EditableText value={email} onChange={(v) => onInlineEdit('email', v)} isEditing={isEditing} placeholder="Email" />
            ) : (
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            )}
          </span>
          <span className="flex items-center gap-2">
            <FiPhone /> 
            {isEditing ? (
              <EditableText value={phone} onChange={(v) => onInlineEdit('phone', v)} isEditing={isEditing} placeholder="Phone" />
            ) : (
              <a href={`tel:${phone?.replace(/\s+/g, '')}`} className="hover:underline">{phone}</a>
            )}
          </span>
          <SocialLinksRenderer 
            links={Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'email' && k !== 'phone'))} 
            className="!gap-6" 
            itemClassName="text-white" 
          />
        </div>
      </header>

      <div className="flex-1 p-12 grid grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="col-span-1 space-y-10">
          <section>
            <h2 className="text-lg font-bold border-b-2 border-primary-500 pb-2 mb-4 flex items-center gap-2">
              <FiTarget className="text-primary-500" /> Key Skills
            </h2>
            <div className="space-y-2">
              {(skills || '').split(',').map((skill, i) => (
                <div key={i} className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                  {skill.trim()}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold border-b-2 border-primary-500 pb-2 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-primary-500" /> Achievements
            </h2>
            <div className="text-sm text-gray-600 italic leading-relaxed whitespace-pre-line text-left">
              <EditableText value={achievements} onChange={(v) => onInlineEdit('achievements', v)} isEditing={isEditing} placeholder="Enter achievements..." />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold border-b-2 border-primary-500 pb-2 mb-4">Education</h2>
            <FieldRenderer 
              data={education} 
              isEditing={isEditing} 
              onInlineEdit={onInlineEdit} 
              sectionName="education"
              fields={{ title: 'degree', subtitle: 'school', date: 'year' }}
              renderItem={(item, i, onFieldEdit) => (
                <div key={i} className="mb-2 text-left">
                  <EditableText className="text-sm text-gray-800 font-bold block" value={item.degree} onChange={(v) => onFieldEdit('degree', v)} isEditing={isEditing} placeholder="Degree" />
                  <div className="flex gap-1 text-xs text-gray-500 italic">
                    <EditableText value={item.school} onChange={(v) => onFieldEdit('school', v)} isEditing={isEditing} placeholder="School" />
                    {item.year && <span>(<EditableText value={item.year} onChange={(v) => onFieldEdit('year', v)} isEditing={isEditing} placeholder="Year" />)</span>}
                  </div>
                </div>
              )}
            />
          </section>
        </div>

        {/* Main */}
        <div className="col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-primary-600 mb-4 text-left">Professional Profile</h2>
            <div className="text-md leading-relaxed text-gray-700 font-medium text-left">
              <EditableText value={summary} onChange={(v) => onInlineEdit('summary', v)} isEditing={isEditing} placeholder="Enter your summary..." />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-600 mb-6">Marketing Campaigns & Impact</h2>
            <div className="space-y-6">
              <FieldRenderer 
                data={campaigns}
                isEditing={isEditing} 
                onInlineEdit={onInlineEdit} 
                sectionName="campaigns"
                fields={{ title: 'title', description: 'description' }}
                renderItem={(item, i, onFieldEdit) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl border-l-4 border-accent-500 text-left">
                    <EditableText className="font-bold text-gray-900 mb-1 block" value={item.title} onChange={(v) => onFieldEdit('title', v)} isEditing={isEditing} placeholder="Campaign Title" />
                    <EditableText className="text-sm text-gray-600 block" value={item.description} onChange={(v) => onFieldEdit('description', v)} isEditing={isEditing} placeholder="Campaign Description" />
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

export default MarketingTemplate;
