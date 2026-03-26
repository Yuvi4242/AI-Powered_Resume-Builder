import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiGrid, FiList, FiPlus, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ResumeCard from '../components/ResumeCard';
import { resumeAPI } from '../utils/api';
import { useSearch } from '../context/SearchContext';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await resumeAPI.getResumes();
      if (response.data.success) {
        setResumes(response.data.resumes);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);
      const response = await resumeAPI.deleteResume(id);
      if (response.data.success) {
        setResumes(resumes.filter((resume) => resume._id !== id));
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (resume) => {
    navigate('/builder', { state: { resume } });
  };

  const filteredResumes = resumes.filter(resume =>
    resume.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Resumes</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your saved resumes</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/builder')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              <FiPlus className="w-5 h-5" />
              Create New Resume
            </motion.button>
          </motion.div>

          {/* Search and View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resumes...</p>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-16 text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FiPlus className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {searchQuery ? 'No resumes found' : 'No resumes yet'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No resumes matching "${searchQuery}"`
                  : 'Create your first resume to get started with AI-powered features'
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/builder')}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg"
              >
                Create Your First Resume
              </motion.button>
            </motion.div>
          ) : (
            /* Resume Grid/List */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            >
              {filteredResumes.map((resume, index) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={deleteLoading === resume._id}
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </motion.div>
          )}
    </div>
  );
};

export default ResumeList;
