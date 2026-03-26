import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { resourceData } from '../data/resourcesData';
import ResourceCard from '../components/ResourceCard';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('resource_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = ['All', 'Resume', 'Interview', 'Career'];

  useEffect(() => {
    localStorage.setItem('resource_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleBookmarkToggle = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredResources = resourceData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Career <span className="text-primary-600">Resources</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
          Unlock your potential with expert guides on resume building, interview preparation, and professional growth.
        </p>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search guides, tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
          />
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl overflow-x-auto w-full md:w-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              isBookmarked={bookmarks.includes(resource.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or category filters.</p>
        </div>
      )}

      {/* Downloadable Sidebar Section Placeholder */}
      <div className="mt-20 p-8 lg:p-12 bg-gray-900 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">Preparation Checklist</h2>
            <p className="text-gray-400 max-w-lg mb-0 text-lg leading-relaxed">
              Download our 50-point resume and interview checklist to ensure you're fully prepared.
            </p>
          </div>
          <Button variant="primary" className="px-10 py-5 bg-white text-gray-900 hover:bg-white/90 whitespace-nowrap shadow-2xl font-black">
            <FiDownload className="mr-3" /> Download PDF Pack
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Resources;
