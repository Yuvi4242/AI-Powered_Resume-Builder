import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiShare2, FiBookmark } from 'react-icons/fi';
import { resourceData } from '../data/resourcesData';
import { Button } from '../components/ui/Button';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = resourceData.find(r => r.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Resource not found</h2>
          <Button onClick={() => navigate('/resources')}>Back to Resources</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-transparent"
    >
      {/* Top Banner / Hero */}
      <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-500/20"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <button 
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-bold"
          >
            <FiArrowLeft /> Back to Resources
          </button>
          
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md">
                {resource.category}
             </span>
             <span className="text-gray-400 text-sm flex items-center gap-1.5 font-medium">
               <FiClock className="text-gray-500" /> {resource.readTime}
             </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {resource.title}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center">
                 <resource.icon size={20} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Expert Guide</p>
                 <p className="text-sm font-bold text-gray-900 dark:text-white">AI Resume Builder Team</p>
               </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="p-2 h-auto rounded-xl">
                <FiShare2 />
              </Button>
              <Button variant="secondary" className="p-2 h-auto rounded-xl">
                <FiBookmark />
              </Button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {resource.content.split('\n').map((line, i) => {
              if (line.trim().startsWith('###')) {
                return <h3 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">{line.replace('###', '').trim()}</h3>;
              }
              if (line.trim().startsWith('1. ') || line.trim().startsWith('2. ') || i > 10 && line.includes(' - ')) {
                return (
                  <div key={i} className="flex gap-3 mb-2">
                    <span className="text-primary-500 font-bold mt-1">•</span>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{line.replace(/^\d+\.\s+/, '').replace(/^-\s+/, '').trim()}</p>
                  </div>
                );
              }
              if (line.trim().startsWith('**')) {
                return <p key={i} className="mb-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed"><strong className="text-gray-900 dark:text-white">{line.replace(/\*\*/g, '').trim()}</strong></p>;
              }
              if (line.trim() === '') return <br key={i} />;
              
              return <p key={i} className="mb-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{line.trim()}</p>;
            })}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-700">
             <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 text-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 italic">"Your career is an investment. Put in the time to build a strong foundation today."</h4>
                <Button onClick={() => navigate('/builder')} className="px-8 shadow-lg shadow-primary-500/20">Apply Tips to Your Resume</Button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceDetails;
