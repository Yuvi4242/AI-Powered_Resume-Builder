import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiLayout, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import TemplateCard from '../components/TemplateCard';
import { useSearch } from '../context/SearchContext';

import { templatesData as templates } from '../data/templatesData';

const Templates = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  
  const [category, setCategory] = useState("All");
  const [experience, setExperience] = useState("All");
  const [type, setType] = useState("All");
  const [atsOnly, setAtsOnly] = useState(false);
  
  const categories = ['All', 'Engineering', 'Marketing', 'Design', 'Business'];
  const experienceLevels = ['All', 'Fresher', 'Mid-Level', 'Senior'];
  const templateTypes = ['All', 'Modern', 'Professional', 'Creative', 'Simple'];

  const filteredTemplates = templates.filter(template => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (template.title || '').toLowerCase().includes(searchLower) ||
      (template.name || '').toLowerCase().includes(searchLower);

    const matchesCategory = category === 'All' || template.category === category;
    const matchesExperience = experience === 'All' || template.experienceLevel === experience;
    const matchesType = type === 'All' || template.type === type;
    const matchesAts = !atsOnly || template.tags.includes('ATS');

    return matchesSearch && matchesCategory && matchesExperience && matchesType && matchesAts;
  });

  const clearFilters = () => {
    setCategory('All');
    setExperience('All');
    setType('All');
    setAtsOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-10 w-full h-full">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Template Library</h1>
                <p className="text-gray-500 dark:text-gray-400">Choose from our collection of ATS-optimized designs.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                  />
                </div>
                <Button variant="secondary" className="px-3">
                  <FiFilter className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Category Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Experience Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Experience Level</label>
                  <select 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  >
                    {experienceLevels.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Template Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  >
                    {templateTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* ATS Friendly Filter */}
                <div className="flex flex-col justify-end">
                  <label className="relative inline-flex items-center cursor-pointer p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={atsOnly} 
                      onChange={(e) => setAtsOnly(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[12px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <FiCheckCircle className={atsOnly ? "text-primary-500" : "text-gray-400"} /> ATS Friendly
                    </span>
                  </label>
                </div>

              </div>
            </div>

            {/* Template Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TemplateCard 
                      template={template} 
                      onUse={(t) => navigate('/builder', { state: { template: t } })} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <FiLayout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No templates found</h3>
                <p className="text-gray-500">Try adjusting your search or advanced filters.</p>
                <Button onClick={clearFilters} variant="secondary" className="mt-4">Clear All Filters</Button>
              </div>
            )}

    </div>
  );
};

export default Templates;
